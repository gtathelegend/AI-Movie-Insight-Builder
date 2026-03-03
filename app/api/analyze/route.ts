import { NextRequest, NextResponse } from "next/server";
import { analyzeReviewsWithAI } from "@/lib/openrouter";
import { aiInsightsSchema } from "@/lib/schema";
import { getCache, setCache } from "@/lib/cache";
import { classifySentiment, hashInput, ApiError } from "@/lib/utils";
import type { AnalyzeResponse } from "@/types/ai";

type AnalyzePayload = {
  imdbID?: string;
  reviews?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AnalyzePayload;
    const reviews = payload.reviews ?? [];

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: "No audience reviews available for sentiment analysis." },
        { status: 400 },
      );
    }

    const reviewsForAnalysis = reviews.slice(0, 10);

    const keyBase = payload.imdbID ? `v2:${payload.imdbID}` : `v2:${reviewsForAnalysis.join("|")}`;
    const cacheKey = hashInput(keyBase);

    const cached = getCache<AnalyzeResponse>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    const aiRaw = await analyzeReviewsWithAI(reviewsForAnalysis);
    const validated = aiInsightsSchema.safeParse(aiRaw);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "AI response validation failed.",
          details: validated.error.flatten(),
        },
        { status: 500 },
      );
    }

    const response: AnalyzeResponse = {
      ...validated.data,
      classification: classifySentiment(validated.data.sentimentScore),
    };

    setCache(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to analyze reviews." }, { status: 500 });
  }
}
