import { test, expect } from "@playwright/test";

test("renders movie title after valid IMDb search", async ({ page }) => {
  await page.route("**/api/movie?imdbID=tt0133093", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        movie: {
          title: "The Matrix",
          poster: "",
          year: "1999",
          rating: "8.7",
          plot: "A computer hacker learns the true nature of his reality.",
          cast: ["Keanu Reeves", "Carrie-Anne Moss"],
        },
        reviews: ["Great movie", "Timeless sci-fi"],
        hasReviews: true,
      }),
    });
  });

  await page.route("**/api/analyze", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        summary: "Audiences praise story and visuals.",
        keyThemes: ["Visual effects", "Philosophy"],
        pros: ["Strong concept"],
        cons: ["Dense for some viewers"],
        sentimentScore: 0.7,
        classification: "positive",
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("IMDb ID").fill("tt0133093");
  await page.getByRole("button", { name: "Analyze" }).click();

  await expect(page.getByRole("heading", { name: "The Matrix" })).toBeVisible();
});
