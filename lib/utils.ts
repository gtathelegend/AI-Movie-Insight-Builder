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
  if (!imdbID || typeof imdbID !== "string") return false;
  return /^tt\d{7,8}$/i.test(imdbID.trim());
}

export function hashInput(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function cleanReviews(reviews: string[], maxReviews = 15, maxReviewLength = 1500): string[] {
  if (!Array.isArray(reviews)) return [];

  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const raw of reviews) {
    if (typeof raw !== "string") continue;
    
    // Collapse repeated whitespace and trim
    const normalized = raw.replace(/\s+/g, " ").trim();
    
    // Filter out empty or extremely short text (< 40 characters)
    if (normalized.length < 40) continue;

    // Deduplication key
    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    // Limit individual review length
    const truncated = normalized.length > maxReviewLength
      ? normalized.slice(0, maxReviewLength) + "..."
      : normalized;

    cleaned.push(truncated);

    if (cleaned.length >= maxReviews) break;
  }

  return cleaned;
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
