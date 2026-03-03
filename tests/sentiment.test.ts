import { classifySentiment } from "@/lib/utils";

describe("classifySentiment", () => {
  it("returns positive for score above 0.3", () => {
    expect(classifySentiment(0.31)).toBe("positive");
  });

  it("returns negative for score below -0.3", () => {
    expect(classifySentiment(-0.31)).toBe("negative");
  });

  it("returns mixed for score between thresholds", () => {
    expect(classifySentiment(0)).toBe("mixed");
  });
});
