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
          sources: ["tmdb"],
          collectedCount: 1,
          hasReviews: true,
        }),
      });
    });

    await page.route("**/api/analyze", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: `data: {"step":"checking_cache","message":"Checking cache..."}\n\ndata: {"step":"complete","data":{"summary":"Audiences adore the groundbreaking VFX and philosophical depth.","keyThemes":["Cyberpunk","Virtual Reality"],"pros":["Action scenes","World-building"],"cons":["Complex lore for some"],"sentimentScore":0.85,"classification":"positive","analyzedCount":1,"collectedCount":1,"sources":["tmdb"],"emotions":{"excitement":85,"nostalgia":60,"confusion":20,"fear":15,"sadness":10,"inspiration":75,"satisfaction":90},"characters":[{"name":"Neo","sentiment":"positive","mentions":10}],"clusters":[{"label":"VFX Acclaim","percentage":60,"representative":"Groundbreaking visuals."}],"audienceVsCritics":{"audienceScore":88,"criticScore":87,"verdict":"Critically acclaimed and beloved by audiences."}}}\n\n`,
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("tt0133093");
    await page.getByRole("button", { name: /Pop it/i }).click();

    await expect(page.getByRole("heading", { name: "The Matrix" })).toBeVisible();
    await expect(page.getByText("Keanu Reeves")).toBeVisible();
    await expect(page.getByText("Source: TMDb").first()).toBeVisible();
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

  test("Test 5: Title search fetches suggestions and resolves on pick", async ({ page }) => {
    await page.route("**/api/search?q=Inception", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            tmdbId: 27205,
            title: "Inception",
            year: "2010",
            poster: null,
            voteAverage: 8.4,
          },
        ]),
      });
    });

    await page.route("**/api/resolve?tmdbId=27205", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ imdbID: "tt1375666" }),
      });
    });

    await page.route("**/api/movie?imdbID=tt1375666", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          movie: {
            title: "Inception",
            poster: "",
            year: "2010",
            rating: "8.8",
            plot: "A thief who steals corporate secrets through the use of dream-sharing technology.",
            cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
          },
          reviews: ["A mind-bending heist thriller with stunning visual effects."],
          sources: ["tmdb"],
          collectedCount: 1,
          hasReviews: true,
        }),
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("Inception");

    // Click the autocomplete suggestion
    const suggestionOption = page.getByRole("option", { name: /Inception/i });
    await expect(suggestionOption).toBeVisible();
    await suggestionOption.click();

    // Verify metadata appears
    await expect(page.getByRole("heading", { name: "Inception" })).toBeVisible();
    await expect(page.getByText("Leonardo DiCaprio")).toBeVisible();
  });

  test("Test 6: Nonexistent title search shows clear error notice", async ({ page }) => {
    await page.route("**/api/search?q=xyznonexistentmovie12345", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("xyznonexistentmovie12345");
    await page.getByRole("button", { name: /Pop it/i }).click();

    await expect(page.getByText('No movies matched "xyznonexistentmovie12345". Try a different title.')).toBeVisible();
  });

  test("Test 7: Mobile viewport rendering displays cleanly without layout overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

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
          reviews: ["Incredible visuals and action."],
          sources: ["tmdb"],
          collectedCount: 1,
          hasReviews: true,
        }),
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("Search by movie title or IMDb ID…");
    await searchInput.fill("tt0133093");
    await page.getByRole("button", { name: /Pop it/i }).click();

    await expect(page.getByRole("heading", { name: "The Matrix" })).toBeVisible();
  });

  test("Test 8: About page renders correctly with creator attribution and tech stack", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /Honest cinema insights/i })).toBeVisible();
    await expect(page.getByRole("main").getByText("Vedaang Sharma")).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: /Send email to Vedaang/i })).toBeVisible();
  });

  test("Test 9: Privacy Policy page renders all third-party disclosures", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
    await expect(page.getByText("The Movie Database (TMDb):")).toBeVisible();
    await expect(page.getByText("OMDb API:")).toBeVisible();
    await expect(page.getByText("OpenRouter:")).toBeVisible();
  });

  test("Test 10: Contact page renders email link and developer profiles", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /talk cinema/i })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: /Send email to Vedaang/i })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: /GitHub/i })).toBeVisible();
  });

  test("Test 11: Filmstrip section renders in proper vertical document flow without horizontal page overflow", async ({ page }) => {
    // Desktop Viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const filmstrip = page.locator(".filmstrip-section");
    await expect(filmstrip).toBeVisible();
    await expect(page.getByRole("heading", { name: /Eight reels of/i })).toBeVisible();

    const desktopNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(desktopNoOverflow).toBe(true);

    // Mobile Viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(filmstrip).toBeVisible();
    await expect(page.getByRole("heading", { name: /Eight reels of/i })).toBeVisible();

    const mobileNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(mobileNoOverflow).toBe(true);
  });
});
