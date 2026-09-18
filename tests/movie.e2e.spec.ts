import { test, expect } from "@playwright/test";

test.describe("Movie Analysis Pipeline E2E", () => {
  test("Test 1: User enters a valid IMDb ID and movie metadata renders", async ({ page }) => {
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
            plot: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
            cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
          },
          reviews: ["A groundbreaking cinematic masterpiece with visionary special effects."],
          hasReviews: true,
        }),
      });
    });

    await page.route("**/api/analyze", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: `data: {"step":"checking_cache","message":"Checking cache..."}\n\ndata: {"step":"complete","data":{"summary":"Audiences adore the groundbreaking VFX and philosophical depth.","keyThemes":["Cyberpunk","Virtual Reality"],"pros":["Action scenes","World-building"],"cons":["Complex lore for some"],"sentimentScore":0.85,"classification":"positive","emotions":{"excitement":85,"nostalgia":60,"confusion":20,"fear":15,"sadness":10,"inspiration":75,"satisfaction":90},"characters":[{"name":"Neo","sentiment":"positive","mentions":10}],"clusters":[{"label":"VFX Acclaim","percentage":60,"representative":"Groundbreaking visuals."}],"audienceVsCritics":{"audienceScore":88,"criticScore":87,"verdict":"Critically acclaimed and beloved by audiences."}}}\n\n`,
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("tt0133093");
    await page.getByRole("button", { name: /Pop it/i }).click();

    await expect(page.getByRole("heading", { name: "The Matrix" })).toBeVisible();
    await expect(page.getByText("Keanu Reeves")).toBeVisible();
  });

  test("Test 2: Invalid IMDb ID or empty input displays validation message", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Pop it/i }).click();
    await expect(page.getByText("Type a movie title or IMDb ID to begin.")).toBeVisible();
  });

  test("Test 3: AI analysis completes and renders insights sections", async ({ page }) => {
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
            plot: "A computer hacker learns the truth.",
            cast: ["Keanu Reeves"],
          },
          reviews: ["A groundbreaking cinematic masterpiece with visionary special effects."],
          hasReviews: true,
        }),
      });
    });

    await page.route("**/api/analyze", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: `data: {"step":"complete","data":{"summary":"Audiences adore the groundbreaking VFX.","keyThemes":["Cyberpunk"],"pros":["Action"],"cons":[],"sentimentScore":0.85,"classification":"positive","emotions":{"excitement":85,"nostalgia":60,"confusion":20,"fear":15,"sadness":10,"inspiration":75,"satisfaction":90},"characters":[{"name":"Neo","sentiment":"positive","mentions":10}],"clusters":[{"label":"VFX Acclaim","percentage":100,"representative":"Great visual effects."}],"audienceVsCritics":{"audienceScore":88,"criticScore":87,"verdict":"Beloved by audiences."}}}\n\n`,
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("tt0133093");
    await page.getByRole("button", { name: /Pop it/i }).click();

    await expect(page.getByRole("heading", { name: "The Matrix" })).toBeVisible();
    await expect(page.getByText("AI SENTIMENT: POSITIVE")).toBeVisible();
  });

  test("Test 4: Zero reviews gracefully keeps movie metadata visible and shows informational notice", async ({ page }) => {
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
            plot: "A computer hacker learns the truth.",
            cast: ["Keanu Reeves"],
          },
          reviews: [],
          hasReviews: false,
        }),
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("tt0133093");
    await page.getByRole("button", { name: /Pop it/i }).click();

    // Movie metadata is visible
    await expect(page.getByRole("heading", { name: "The Matrix" })).toBeVisible();
    // Informational message is visible
    await expect(page.getByText("Not enough public audience reviews were available for AI sentiment analysis.")).toBeVisible();
  });
});
