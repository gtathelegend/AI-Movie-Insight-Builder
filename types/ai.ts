export type SentimentClassification = "positive" | "mixed" | "negative";
export type ViralPotential = "low" | "medium" | "high";
export type StreamingStrength = "weak" | "average" | "strong";

export type EmotionProfile = {
  excitement: number;
  nostalgia: number;
  confusion: number;
  fear: number;
  sadness: number;
  inspiration: number;
  satisfaction: number;
};

export type CharacterInsight = {
  name: string;
  sentiment: "positive" | "negative" | "mixed";
  mentions: number;
};

export type ReviewCluster = {
  label: string;
  percentage: number;
  representative: string;
};

export type AudienceVsCritics = {
  audienceScore: number;
  criticScore: number;
  verdict: string;
};

export type AIInsights = {
  summary: string;
  keyThemes: string[];
  pros: string[];
  cons: string[];
  sentimentScore: number;
  emotions: EmotionProfile;
  characters: CharacterInsight[];
  clusters: ReviewCluster[];
  audienceVsCritics: AudienceVsCritics;
};

export type AnalyzeResponse = AIInsights & {
  classification: SentimentClassification;
  fromCache?: boolean;
};

export type SSEEvent =
  | { step: "checking_cache"; message: string }
  | { step: "analyzing"; message: string }
  | { step: "processing"; message: string }
  | { step: "saving"; message: string }
  | { step: "complete"; data: AnalyzeResponse }
  | { step: "error"; error: string };
