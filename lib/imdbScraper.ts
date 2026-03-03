import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeIMDbReviews(imdbID: string): Promise<string[]> {
  try {
    const url = `https://www.imdb.com/title/${imdbID}/reviews`;
    const { data } = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const reviews = $(".review-container .content .text")
      .map((_, element) =>
        $(element)
          .text()
          .replace(/\s+/g, " ")
          .trim(),
      )
      .get()
      .filter((review) => review.length > 50)
      .slice(0, 15);

    return reviews;
  } catch {
    return [];
  }
}
