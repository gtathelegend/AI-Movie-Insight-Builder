import axios from "axios";
import * as cheerio from "cheerio";
import { cleanReviews, isValidImdbId } from "@/lib/utils";

function extractReviewTextFromJsonPayload(html: string): string[] {
  const matches = html.matchAll(/"reviewText":"((?:\\.|[^"\\])*)"/g);
  const results: string[] = [];

  for (const match of matches) {
    const encoded = match[1];

    try {
      const decoded = JSON.parse(`"${encoded}"`) as string;
      if (decoded) results.push(decoded);
    } catch {
      continue;
    }
  }

  return results;
}

export async function scrapeIMDbReviews(imdbID: string): Promise<string[]> {
  if (!imdbID || !isValidImdbId(imdbID)) return [];

  try {
    const url = `https://www.imdb.com/title/${imdbID}/reviews`;
    const { data } = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        Referer: `https://www.imdb.com/title/${imdbID}/`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
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
      ...$(".ipc-html-content-inner-div")
        .map((_, element) => $(element).text())
        .get(),
      ...extractReviewTextFromJsonPayload(String(data)),
    ];

    return cleanReviews(rawReviews, 15);
  } catch {
    // Return empty array instead of crashing on scraper error/block
    return [];
  }
}
