import axios from "axios";
import { scrapeIMDbReviews } from "@/lib/imdbScraper";

type TmdbFindResponse = {
  movie_results: Array<{ id: number }>;
};

type TmdbReviewsResponse = {
  results: Array<{
    content: string;
  }>;
};

export async function getTMDbReviews(imdbID: string): Promise<string[]> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return [];
  }

  try {
    const findUrl = `https://api.themoviedb.org/3/find/${imdbID}`;
    const findResponse = await axios.get<TmdbFindResponse>(findUrl, {
      params: {
        api_key: apiKey,
        external_source: "imdb_id",
      },
      timeout: 10000,
    });

    const tmdbMovieId = findResponse.data.movie_results[0]?.id;

    if (!tmdbMovieId) {
      return [];
    }

    const reviewUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/reviews`;
    const reviewResponse = await axios.get<TmdbReviewsResponse>(reviewUrl, {
      params: {
        api_key: apiKey,
        page: 1,
      },
      timeout: 10000,
    });

    return reviewResponse.data.results
      .map((item) => item.content.trim())
      .filter((text) => text.length > 0)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function getReviews(imdbID: string): Promise<string[]> {
  let reviews = await getTMDbReviews(imdbID);

  if (!reviews || reviews.length === 0) {
    reviews = await scrapeIMDbReviews(imdbID);
  }

  return reviews;
}
