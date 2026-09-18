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
    ? `Title: "${ctx.movieTitle}"${ctx.movieYear ? ` (${ctx.movieYear})` : ""}`
    : "Title: Unknown";

  const criticNote = typeof ctx.criticScore === "number"
    ? `Critic Score (Rotten Tomatoes): ${ctx.criticScore} — set audienceVsCritics.criticScore to ${ctx.criticScore}`
    : `Critic Score: None available — set audienceVsCritics.criticScore to 50`;

  return `You are an expert film intelligence analyst. You are provided with verified audience reviews for the film specified below.

=== MOVIE METADATA (Context Only) ===
${movieLine}
${criticNote}

=== AUDIENCE REVIEW EVIDENCE ===
Analyze ONLY the ${reviews.length} audience reviews below:
${reviews.map((r, i) => `[Review #${i + 1}]:\n${r}`).join("\n---\n")}

=== INSTRUCTIONS & CONSTRAINTS ===
1. Analyze ONLY the supplied audience review text. Do NOT invent reviews, quotes, statistics, characters, or audience opinions.
2. If the review evidence does not mention specific characters, return an empty array for "characters".
3. For "clusters", the "representative" property MUST be a genuine quote or verbatim excerpt taken directly from the provided review text — NEVER fabricate a quotation.
4. "sentimentScore": a float from -1.0 (very negative) to 1.0 (very positive) reflecting the aggregate sentiment of the provided reviews.
5. All emotion values: integers 0-100 indicating the prevalence of each emotion across the provided reviews.
6. Return ONLY valid JSON matching this exact shape (no markdown, no code fences, no extra text):

{
  "summary": "3-4 sentences: overall audience reception and defining qualities strictly based on reviews",
  "keyThemes": ["3-6 recurring topics from the reviews"],
  "pros": ["3-6 specific positives praised in the reviews"],
  "cons": ["3-6 specific negatives mentioned in the reviews"],
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
    { "label": "Short description of audience opinion group", "percentage": 35, "representative": "Verbatim quote from supplied reviews" }
  ],
  "audienceVsCritics": {
    "audienceScore": 72,
    "criticScore": 0,
    "verdict": "1-2 sentences comparing audience reception against critic score"
  }
}`;
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
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new ApiError("OpenRouter authentication failed. Please check your API key.", 500);
      }
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new ApiError("OpenRouter request timed out.", 504);
      }
      throw new ApiError("Failed to communicate with OpenRouter AI service.", 502);
    }

    throw new ApiError("Failed to analyze reviews with AI.", 500);
  }
}
