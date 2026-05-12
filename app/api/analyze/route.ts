import { NextRequest } from "next/server";
import { analyzeReviewsWithAI } from "@/lib/openrouter";
import { aiInsightsSchema } from "@/lib/schema";
import { getCache, setCache } from "@/lib/cache";
import { classifySentiment, hashInput, ApiError } from "@/lib/utils";
import type { AnalyzeResponse, SSEEvent } from "@/types/ai";

// ─── DB import is gracefully optional ────────────────────────────────────────
// If Prisma hasn't been set up yet (no DATABASE_URL / npx prisma generate not
// run), the DB layer silently degrades to in-memory cache only.
async function getDb() {
  try {
    const { getDbClient } = await import("@/lib/db");
    return await getDbClient();
  } catch {
    return null;
  }
}

const DB_TTL_HOURS = 24;

type AnalyzePayload = {
  imdbID?: string;
  reviews?: string[];
  movieTitle?: string;
  movieYear?: string;
  rottenTomatoes?: string;
};

// Converts "94%" → 94; returns undefined if value is missing or invalid.
function rtToNumber(rt?: string): number | undefined {
  if (!rt) return undefined;
  const n = parseInt(rt.replace("%", ""), 10);
  return isNaN(n) ? undefined : n;
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────
const encoder = new TextEncoder();

function sseChunk(event: SSEEvent): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const payload = (await request.json()) as AnalyzePayload;
  const reviews = payload.reviews ?? [];

  // Validate before opening stream so we can return a proper 400
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return new Response(
      JSON.stringify({ error: "No audience reviews available for sentiment analysis." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const reviewsForAnalysis = reviews.slice(0, 10);
  const imdbID = payload.imdbID;
  const cacheKey = hashInput(imdbID ? `v3:${imdbID}` : `v3:${reviewsForAnalysis.join("|")}`);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SSEEvent) => controller.enqueue(sseChunk(event));

      try {
        // ── L1: In-memory cache ───────────────────────────────────────────
        send({ step: "checking_cache", message: "Checking cache..." });

        const memCached = getCache<AnalyzeResponse>(cacheKey);
        if (memCached) {
          send({ step: "complete", data: { ...memCached, fromCache: true } });
          controller.close();
          return;
        }

        // ── L2: DB cache ──────────────────────────────────────────────────
        const prisma = await getDb();
        if (prisma && imdbID) {
          try {
            const row = await prisma.cachedAnalysis.findUnique({
              where: { imdbId: imdbID },
            });

            if (row && new Date(row.expiresAt) > new Date()) {
              const parsed = JSON.parse(row.data) as AnalyzeResponse;
              setCache(cacheKey, parsed); // warm L1
              send({ step: "complete", data: { ...parsed, fromCache: true } });
              controller.close();
              return;
            }
          } catch {
            // DB unavailable — continue to AI
          }
        }

        // ── AI analysis ───────────────────────────────────────────────────
        send({ step: "analyzing", message: "AI is analyzing audience reviews..." });

        const criticScore = rtToNumber(payload.rottenTomatoes);
        const aiRaw = await analyzeReviewsWithAI(reviewsForAnalysis, {
          movieTitle: payload.movieTitle,
          movieYear: payload.movieYear,
          criticScore,
        });

        // ── Validate structured output ─────────────────────────────────────
        send({ step: "processing", message: "Processing intelligence insights..." });

        const validated = aiInsightsSchema.safeParse(aiRaw);
        if (!validated.success) {
          send({ step: "error", error: "AI response did not match expected schema." });
          controller.close();
          return;
        }

        const response: AnalyzeResponse = {
          ...validated.data,
          classification: classifySentiment(validated.data.sentimentScore),
        };

        // ── Persist to both cache layers ──────────────────────────────────
        send({ step: "saving", message: "Saving to database..." });

        setCache(cacheKey, response);

        if (prisma && imdbID) {
          const expiresAt = new Date(Date.now() + DB_TTL_HOURS * 60 * 60 * 1000);
          try {
            await prisma.cachedAnalysis.upsert({
              where: { imdbId: imdbID },
              create: {
                imdbId: imdbID,
                movieTitle: payload.movieTitle ?? "Unknown",
                data: JSON.stringify(response),
                expiresAt,
              },
              update: {
                movieTitle: payload.movieTitle ?? "Unknown",
                data: JSON.stringify(response),
                expiresAt,
              },
            });
          } catch {
            // Non-fatal: analysis already in memory
          }
        }

        send({ step: "complete", data: response });
        controller.close();
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to analyze reviews.";

        send({ step: "error", error: message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
