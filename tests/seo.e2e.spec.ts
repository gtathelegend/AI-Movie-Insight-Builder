import { test, expect } from "@playwright/test";

test.describe("POP SEO & Search Discoverability E2E", () => {
  test("Test 1: Root homepage has correct title, meta description, OpenGraph, canonical, and WebSite JSON-LD", async ({ page }) => {
    await page.goto("/");

    // Title
    await expect(page).toHaveTitle("POP — AI Movie Insights, Ratings & Audience Reviews");

    // Meta Description
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /Explore movie ratings, real audience reviews, viewer sentiment/i);

    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://pop.vedaangsharma.in");

    // OpenGraph
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", "POP — AI Movie Insights, Ratings & Audience Reviews");

    // Schema.org WebSite JSON-LD
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    let hasWebSite = false;

    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).innerText();
      if (text.includes('"@type":"WebSite"') || text.includes('"WebSite"')) {
        hasWebSite = true;
        break;
      }
    }
    expect(hasWebSite).toBe(true);
  });

  test("Test 2: Movie page /movie/tt0133093 has dynamic metadata, canonical URL, and Movie JSON-LD", async ({ page }) => {
    await page.route("**/api/movie?imdbID=tt0133093", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          movie: {
            title: "The Matrix",
            poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg",
            year: "1999",
            rating: "8.7",
            plot: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
            cast: ["Keanu Reeves", "Laurence Fishburne"],
            director: "Lana Wachowski, Lilly Wachowski",
            genre: "Action, Sci-Fi",
          },
          reviews: ["A groundbreaking visual masterpiece."],
          sources: ["tmdb"],
          collectedCount: 1,
          hasReviews: true,
        }),
      });
    });

    await page.goto("/movie/tt0133093");

    // Title should contain movie name and year
    await expect(page).toHaveTitle(/The Matrix \(1999\) — Ratings, Reviews & Audience Insights/i);

    // Meta description
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /The Matrix \(1999\)/i);

    // Canonical link
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://pop.vedaangsharma.in/movie/tt0133093");

    // JSON-LD Movie Schema
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    let hasMovieSchema = false;

    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).innerText();
      if (text.includes('"@type":"Movie"') && text.includes("The Matrix")) {
        hasMovieSchema = true;
        break;
      }
    }
    expect(hasMovieSchema).toBe(true);
  });

  test("Test 3: Movies directory (/movies) renders discovery hubs and genre collections", async ({ page }) => {
    await page.goto("/movies");

    await expect(page.getByRole("heading", { name: "Explore Cinema by Real Audience Sentiment." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Trending Movies/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Now Showing Reel/i })).toBeVisible();
  });

  test("Test 4: Trending movies page (/movies/trending) renders ItemList structured data", async ({ page }) => {
    await page.goto("/movies/trending");

    await expect(page.getByRole("heading", { name: "Trending Movies This Week" })).toBeVisible();

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    let hasItemList = false;

    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).innerText();
      if (text.includes('"@type":"ItemList"') && text.includes("Trending Movies This Week")) {
        hasItemList = true;
        break;
      }
    }
    expect(hasItemList).toBe(true);
  });

  test("Test 5: Now Showing page (/movies/now-showing) renders ItemList structured data", async ({ page }) => {
    await page.goto("/movies/now-showing");

    await expect(page.getByRole("heading", { name: "Now Showing in Theaters" })).toBeVisible();

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    let hasItemList = false;

    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).innerText();
      if (text.includes('"@type":"ItemList"') && text.includes("Now Showing in Theaters")) {
        hasItemList = true;
        break;
      }
    }
    expect(hasItemList).toBe(true);
  });

  test("Test 6: Robots.txt exists, allows crawling, disallows /api/, and specifies sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body.toLowerCase()).toContain("user-agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap: https://pop.vedaangsharma.in/sitemap.xml");
  });

  test("Test 7: Sitemap.xml returns valid XML containing core pages and canonical movie URLs", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("https://pop.vedaangsharma.in/movies");
    expect(body).toContain("https://pop.vedaangsharma.in/movies/trending");
    expect(body).toContain("https://pop.vedaangsharma.in/movies/now-showing");
    expect(body).toContain("https://pop.vedaangsharma.in/about");
    expect(body).toContain("https://pop.vedaangsharma.in/movie/tt0133093");
  });

  test("Test 8: FAQ section exists with FAQPage JSON-LD and clear ratings attribution", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Frequently Asked/i })).toBeVisible();
    await expect(page.getByText(/What is the difference between IMDb Rating, Rotten Tomatoes, and POP AI Sentiment/i)).toBeVisible();

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    let hasFaqSchema = false;

    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).innerText();
      if (text.includes('"@type":"FAQPage"') || text.includes('"FAQPage"')) {
        hasFaqSchema = true;
        break;
      }
    }
    expect(hasFaqSchema).toBe(true);
  });
});
