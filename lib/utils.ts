import crypto from "crypto";
import type { SentimentClassification } from "@/types/ai";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function classifySentiment(score: number): SentimentClassification {
  if (score > 0.3) {
    return "positive";
  }

  if (score < -0.3) {
    return "negative";
  }

  return "mixed";
}

export function isValidImdbId(imdbID: string): boolean {
  return /^tt\d{7,8}$/.test(imdbID);
}

export function hashInput(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return a valid JSON object");
  }

  return trimmed.slice(start, end + 1);
}
