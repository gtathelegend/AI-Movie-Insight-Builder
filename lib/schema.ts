import { z } from "zod";

const emotionProfileSchema = z.object({
  excitement: z.number().int().min(0).max(100),
  nostalgia: z.number().int().min(0).max(100),
  confusion: z.number().int().min(0).max(100),
  fear: z.number().int().min(0).max(100),
  sadness: z.number().int().min(0).max(100),
  inspiration: z.number().int().min(0).max(100),
  satisfaction: z.number().int().min(0).max(100),
}).default({ excitement: 50, nostalgia: 30, confusion: 20, fear: 15, sadness: 20, inspiration: 40, satisfaction: 55 });

const characterInsightSchema = z.object({
  name: z.string().min(1),
  sentiment: z.enum(["positive", "negative", "mixed"]),
  mentions: z.number().int().min(1),
});

const reviewClusterSchema = z.object({
  label: z.string().min(1),
  percentage: z.number().min(0).max(100),
  representative: z.string().min(1),
});

const audienceVsCriticsSchema = z.object({
  audienceScore: z.number().min(0).max(100),
  criticScore: z.number().min(0).max(100),
  verdict: z.string().min(1),
}).default({ audienceScore: 50, criticScore: 50, verdict: "No significant divergence detected." });

export const aiInsightsSchema = z.object({
  summary: z.string().min(1),
  keyThemes: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  sentimentScore: z.number().min(-1).max(1),
  emotions: emotionProfileSchema,
  characters: z.array(characterInsightSchema).max(8).default([]),
  clusters: z.array(reviewClusterSchema).min(1).max(6).default([]),
  audienceVsCritics: audienceVsCriticsSchema,
});

export type AIInsightsSchema = z.infer<typeof aiInsightsSchema>;
