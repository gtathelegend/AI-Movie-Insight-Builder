import axios from "axios";
import { scrapeIMDbReviews } from "@/lib/imdbScraper";
import { cleanReviews } from "@/lib/utils";

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

  if (!apiKey || !imdbID) {
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

    const tmdbMovieId = findResponse.data.movie_results?.[0]?.id;

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

    const rawContents = (reviewResponse.data.results ?? []).map((item) => item.content);
    return cleanReviews(rawContents, 15);
  } catch {
    return [];
  }
}

export async function getReviews(imdbID: string): Promise<string[]> {
  if (!imdbID) return [];

  try {
    // 1. Primary: TMDb audience reviews
    let reviews = await getTMDbReviews(imdbID);

    // 2. Fallback: IMDb scraping if TMDb returns zero reviews
    if (!reviews || reviews.length === 0) {
      reviews = await scrapeIMDbReviews(imdbID);
    }

    return reviews ?? [];
  } catch {
    return [];
  }
}
