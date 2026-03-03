import { z } from "zod";

export const aiInsightsSchema = z.object({
  summary: z.string().min(1),
  keyThemes: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  sentimentScore: z.number().min(-1).max(1),
});

export type AIInsightsSchema = z.infer<typeof aiInsightsSchema>;
