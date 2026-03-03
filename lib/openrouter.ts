import axios from "axios";
import type { AIInsights } from "@/types/ai";
import { extractJsonObject, ApiError } from "@/lib/utils";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?:
        | string
        | Array<{
            type?: string;
            text?: string;
          }>;
    };
  }>;
};

function getContentAsText(
  content: OpenRouterResponse["choices"] extends Array<infer Choice>
    ? Choice extends { message?: { content?: infer Content } }
      ? Content
      : never
    : never,
): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const combined = content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("\n")
      .trim();

    if (combined) {
      return combined;
    }
  }

  return "";
}

export async function analyzeReviewsWithAI(reviews: string[]): Promise<AIInsights> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new ApiError("OPENROUTER_API_KEY is missing.", 500);
  }

  const prompt = `You are analyzing audience movie reviews. Return ONLY strict JSON with this exact shape:
{
  "summary": string,
  "sentimentScore": number
}
Rules:
- sentimentScore must be between -1 and 1.
- Do not include markdown, code fences, or extra text.
- Summary should be 3-4 lines in plain text.

Reviews:\n${reviews.join("\n---\n")}`;

  try {
    const modelsToTry = ["openai/gpt-oss-120b:free"];
    let lastRequestError: unknown = null;

    for (const model of modelsToTry) {
      try {
        const { data } = await axios.post<OpenRouterResponse>(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: {
              type: "json_object",
            },
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

        const rawContent = getContentAsText(data.choices?.[0]?.message?.content);

        if (!rawContent) {
          throw new ApiError("OpenRouter returned an empty response.", 500);
        }

        return JSON.parse(extractJsonObject(rawContent)) as AIInsights;
      } catch (modelError) {
        lastRequestError = modelError;
      }
    }

    throw lastRequestError;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data === "object" && error.response?.data !== null
          ? JSON.stringify(error.response.data)
          : error.message;

      throw new ApiError(`OpenRouter request failed: ${apiMessage}`, 500);
    }

    throw new ApiError("Failed to analyze reviews with AI.", 500);
  }
}
