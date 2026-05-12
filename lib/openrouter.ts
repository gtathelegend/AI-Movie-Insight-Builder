import axios from "axios";
import type { AIInsights } from "@/types/ai";
import { extractJsonObject, ApiError } from "@/lib/utils";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

type AnalysisContext = {
  movieTitle?: string;
  movieYear?: string;
  criticScore?: number;
};

function getContentAsText(
  content: string | Array<{ type?: string; text?: string }> | undefined,
): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) => (typeof p?.text === "string" ? p.text : ""))
      .join("\n")
      .trim();
  }
  return "";
}

function buildPrompt(reviews: string[], ctx: AnalysisContext): string {
  const movieLine = ctx.movieTitle
    ? `Movie: "${ctx.movieTitle}"${ctx.movieYear ? ` (${ctx.movieYear})` : ""}`
    : "Movie: unknown";

  const criticNote = typeof ctx.criticScore === "number"
    ? `Critic score (Rotten Tomatoes): ${ctx.criticScore} — use this exact value for audienceVsCritics.criticScore`
    : `No critic score available — set audienceVsCritics.criticScore to 50`;

  return `You are an expert film intelligence analyst. Analyze these ${reviews.length} audience reviews.
${movieLine}
${criticNote}

Return ONLY valid JSON matching this exact shape (no markdown, no code fences, no extra text):

{
  "summary": "3-4 sentences: overall audience reception and defining qualities",
  "keyThemes": ["3-6 recurring topics from the reviews"],
  "pros": ["3-6 specific positives audiences praised"],
  "cons": ["3-6 specific negatives audiences mentioned"],
  "sentimentScore": 0.0,
  "emotions": {
    "excitement": 0,
    "nostalgia": 0,
    "confusion": 0,
    "fear": 0,
    "sadness": 0,
    "inspiration": 0,
    "satisfaction": 0
  },
  "characters": [
    { "name": "Character name (not actor)", "sentiment": "positive", "mentions": 3 }
  ],
  "clusters": [
    { "label": "Short description of what this audience group said", "percentage": 35, "representative": "A short representative quote from a review" }
  ],
  "audienceVsCritics": {
    "audienceScore": 72,
    "criticScore": 0,
    "verdict": "1-2 sentences comparing audience and critic reactions"
  }
}

Strict rules:
- sentimentScore: float from -1.0 (very negative) to 1.0 (very positive)
- All emotion values: integers 0-100 representing what % of reviews convey that feeling
- characters: 2-5 most mentioned CHARACTERS (not actors) — omit if reviews name none
- clusters: 3-5 distinct audience opinion groups; percentages must sum to ~100
- audienceScore: integer 0-100 reflecting overall audience sentiment
- criticScore: use the provided critic score value exactly as instructed above

Reviews:
${reviews.join("\n---\n")}`;
}

export async function analyzeReviewsWithAI(
  reviews: string[],
  ctx: AnalysisContext = {},
): Promise<AIInsights> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new ApiError("OPENROUTER_API_KEY is missing.", 500);

  const prompt = buildPrompt(reviews, ctx);

  try {
    const { data } = await axios.post<OpenRouterResponse>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
          "X-Title": "AI Movie Insight Builder",
          "Content-Type": "application/json",
        },
        timeout: 45000,
      },
    );

    const rawContent = getContentAsText(data.choices?.[0]?.message?.content);
    if (!rawContent) throw new ApiError("OpenRouter returned an empty response.", 500);

    return JSON.parse(extractJsonObject(rawContent)) as AIInsights;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (axios.isAxiosError(error)) {
      const msg =
        typeof error.response?.data === "object" && error.response?.data !== null
          ? JSON.stringify(error.response.data)
          : error.message;
      throw new ApiError(`OpenRouter request failed: ${msg}`, 500);
    }

    throw new ApiError("Failed to analyze reviews with AI.", 500);
  }
}
