import axios from "axios";
import type { AIInsights } from "@/types/ai";
import { extractJsonObject, ApiError } from "@/lib/utils";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function analyzeReviewsWithAI(reviews: string[]): Promise<AIInsights> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new ApiError("OPENROUTER_API_KEY is missing.", 500);
  }

  const prompt = `You are analyzing audience movie reviews. Return ONLY strict JSON with this exact shape:
{
  "summary": string,
  "keyThemes": string[],
  "pros": string[],
  "cons": string[],
  "sentimentScore": number
}
Rules:
- sentimentScore must be between -1 and 1.
- Do not include markdown, code fences, or extra text.
- Keep arrays concise and useful.

Reviews:\n${reviews.join("\n---\n")}`;

  try {
    const { data } = await axios.post<OpenRouterResponse>(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
          "X-Title": "AI Movie Insight Builder",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new ApiError("OpenRouter returned an empty response.", 500);
    }

    const parsed = JSON.parse(extractJsonObject(rawContent)) as AIInsights;
    return parsed;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Failed to analyze reviews with AI.", 500);
  }
}
