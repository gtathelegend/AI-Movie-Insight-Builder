export type SentimentClassification = "positive" | "mixed" | "negative";

export type AIInsights = {
  summary: string;
  sentimentScore: number;
};

export type AnalyzeResponse = AIInsights & {
  classification: SentimentClassification;
};
