import axios from "axios";
import * as cheerio from "cheerio";

function extractReviewTextFromJsonPayload(html: string): string[] {
  const matches = html.matchAll(/"reviewText":"((?:\\.|[^"\\])*)"/g);
  const results: string[] = [];

  for (const match of matches) {
    const encoded = match[1];

    try {
      const decoded = JSON.parse(`"${encoded}"`) as string;
      results.push(decoded);
    } catch {
      continue;
    }
  }

  return results;
}

export async function scrapeIMDbReviews(imdbID: string): Promise<string[]> {
  try {
    const url = `https://www.imdb.com/title/${imdbID}/reviews`;
    const { data } = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: `https://www.imdb.com/title/${imdbID}/`,
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const rawReviews = [
      ...$("[data-testid='review-overflow']")
        .map((_, element) => $(element).text())
        .get(),
      ...$(".review-container .content .text")
        .map((_, element) => $(element).text())
        .get(),
      ...extractReviewTextFromJsonPayload(String(data)),
    ];

    const uniqueReviews = Array.from(
      new Set(
        rawReviews
          .map((review) => review.replace(/\s+/g, " ").trim())
          .filter((review) => review.length > 50),
      ),
    );

    const reviews = uniqueReviews.slice(0, 15);

    return reviews;
  } catch {
    return [];
  }
}
