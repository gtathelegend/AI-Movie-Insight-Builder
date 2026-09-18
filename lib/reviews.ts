import axios from "axios";
import { scrapeIMDbReviews } from "@/lib/imdbScraper";
import { cleanReviews } from "@/lib/utils";
import type { ReviewData } from "@/types/movie";

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

export async function getReviews(imdbID: string): Promise<ReviewData> {
  if (!imdbID) {
    return { reviews: [], sources: [], collectedCount: 0 };
  }

  try {
    // 1. Primary: TMDb audience reviews
    const tmdbReviews = await getTMDbReviews(imdbID);
    if (tmdbReviews && tmdbReviews.length > 0) {
      return {
        reviews: tmdbReviews,
        sources: ["tmdb"],
        collectedCount: tmdbReviews.length,
      };
    }

    // 2. Fallback: IMDb scraping if TMDb returns zero reviews
    const imdbReviews = await scrapeIMDbReviews(imdbID);
    if (imdbReviews && imdbReviews.length > 0) {
      return {
        reviews: imdbReviews,
        sources: ["imdb"],
        collectedCount: imdbReviews.length,
      };
    }

    return { reviews: [], sources: [], collectedCount: 0 };
  } catch {
    return { reviews: [], sources: [], collectedCount: 0 };
  }
}
