import { classifySentiment, isValidImdbId, cleanReviews } from "@/lib/utils";
import { getCache, setCache } from "@/lib/cache";
import { aiInsightsSchema } from "@/lib/schema";

describe("IMDb ID Validation", () => {
  it("accepts valid 7-digit IMDb IDs", () => {
    expect(isValidImdbId("tt0133093")).toBe(true);
  });

  it("accepts valid 8-digit IMDb IDs", () => {
    expect(isValidImdbId("tt12345678")).toBe(true);
  });

  it("accepts case-insensitive IMDb IDs", () => {
    expect(isValidImdbId("TT0133093")).toBe(true);
  });

  it("rejects invalid IDs", () => {
    expect(isValidImdbId("abc123")).toBe(false);
    expect(isValidImdbId("tt123")).toBe(false);
    expect(isValidImdbId("")).toBe(false);
    expect(isValidImdbId("   ")).toBe(false);
    expect(isValidImdbId(null as unknown as string)).toBe(false);
    expect(isValidImdbId(undefined as unknown as string)).toBe(false);
  });
});

describe("Sentiment Classification", () => {
  it("classifies scores above 0.3 as positive", () => {
    expect(classifySentiment(0.31)).toBe("positive");
    expect(classifySentiment(0.95)).toBe("positive");
  });

  it("classifies scores below -0.3 as negative", () => {
    expect(classifySentiment(-0.31)).toBe("negative");
    expect(classifySentiment(-0.85)).toBe("negative");
  });

  it("classifies scores between -0.3 and 0.3 as mixed", () => {
    expect(classifySentiment(0)).toBe("mixed");
    expect(classifySentiment(0.3)).toBe("mixed");
    expect(classifySentiment(-0.3)).toBe("mixed");
    expect(classifySentiment(0.15)).toBe("mixed");
    expect(classifySentiment(-0.15)).toBe("mixed");
  });
});

describe("Review Cleaning", () => {
  it("normalizes and collapses whitespace", () => {
    const raw = ["   This is a   great    sci-fi masterpiece with fantastic visuals and acting!   \n\n\t  "];
    const cleaned = cleanReviews(raw);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0]).toBe("This is a great sci-fi masterpiece with fantastic visuals and acting!");
  });

  it("removes duplicate reviews", () => {
    const raw = [
      "A stunning visual triumph that sets a new standard for modern cinema.",
      "A stunning visual triumph that sets a new standard for modern cinema.",
      "a stunning visual triumph that sets a new standard for modern cinema.",
    ];
    const cleaned = cleanReviews(raw);
    expect(cleaned).toHaveLength(1);
  });

  it("removes empty and short unusable text", () => {
    const raw = [
      "",
      "   ",
      "Good movie", // < 40 chars
      "Great!",
      "A truly memorable and groundbreaking cinematic experience that redefines the genre entirely.",
    ];
    const cleaned = cleanReviews(raw);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0]).toContain("groundbreaking cinematic experience");
  });

  it("truncates excessively long reviews and limits total count", () => {
    const longReview = "A".repeat(2000);
    const cleaned = cleanReviews([longReview], 5, 100);
    expect(cleaned[0].length).toBe(103); // 100 + "..."
  });
});

describe("In-Memory Cache", () => {
  it("stores and retrieves cached data before expiration", () => {
    const key = "test_key_" + Date.now();
    setCache(key, { result: "success" });
    const cached = getCache<{ result: string }>(key);
    expect(cached).toEqual({ result: "success" });
  });

  it("returns null for non-existent key", () => {
    expect(getCache("non_existent_key_12345")).toBeNull();
  });
});

describe("AI Insights Zod Schema Validation", () => {
  const validPayload = {
    summary: "A thrilling sci-fi adventure that redefined movie visual effects.",
    keyThemes: ["Simulation", "Free Will", "Cyberpunk"],
    pros: ["Groundbreaking VFX", "Iconic action sequences"],
    cons: ["Pacing slows in the middle"],
    sentimentScore: 0.85,
    emotions: {
      excitement: 85,
      nostalgia: 60,
      confusion: 20,
      fear: 15,
      sadness: 10,
      inspiration: 75,
      satisfaction: 90,
    },
    characters: [
      { name: "Neo", sentiment: "positive", mentions: 12 },
      { name: "Morpheus", sentiment: "positive", mentions: 8 },
    ],
    clusters: [
      { label: "Praise for VFX", percentage: 55, representative: "The bullet time effects are timeless." },
      { label: "Philosophical Depth", percentage: 45, representative: "Deep philosophical themes make you think." },
    ],
    audienceVsCritics: {
      audienceScore: 88,
      criticScore: 87,
      verdict: "Critics and audiences are strongly aligned on this classic.",
    },
  };

  it("accepts a fully valid AI insights object", () => {
    const parsed = aiInsightsSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it("rejects sentimentScore out of range (-1 to 1)", () => {
    const invalid = { ...validPayload, sentimentScore: 1.5 };
    const parsed = aiInsightsSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);

    const invalidNegative = { ...validPayload, sentimentScore: -1.2 };
    expect(aiInsightsSchema.safeParse(invalidNegative).success).toBe(false);
  });

  it("rejects missing summary", () => {
    const invalid = { ...validPayload, summary: "" };
    expect(aiInsightsSchema.safeParse(invalid).success).toBe(false);
  });
});
