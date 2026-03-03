export type SentimentClassification = "positive" | "mixed" | "negative";

export type AIInsights = {
  summary: string;
  keyThemes: string[];
  pros: string[];
  cons: string[];
  sentimentScore: number;
};

export type AnalyzeResponse = AIInsights & {
  classification: SentimentClassification;
};
