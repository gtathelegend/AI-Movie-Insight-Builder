import axios from "axios";
import type { Movie } from "@/types/movie";
import { ApiError, isValidImdbId } from "@/lib/utils";

type OmdbResponse = {
  Response: "True" | "False";
  Error?: string;
  Title?: string;
  Poster?: string;
  Year?: string;
  imdbRating?: string;
  Plot?: string;
  Actors?: string;
};

export async function getMovieMetadata(imdbID: string): Promise<Movie> {
  if (!isValidImdbId(imdbID)) {
    throw new ApiError("Invalid IMDb ID format.", 400);
  }

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new ApiError("OMDB_API_KEY is missing.", 500);
  }

  try {
    const { data } = await axios.get<OmdbResponse>("https://www.omdbapi.com/", {
      params: {
        i: imdbID,
        apikey: apiKey,
      },
      timeout: 10000,
    });

    if (data.Response === "False") {
      const message = data.Error ?? "Movie not found.";
      const status = message.toLowerCase().includes("not found") ? 404 : 500;
      throw new ApiError(message, status);
    }

    return {
      title: data.Title ?? "Unknown",
      poster: data.Poster && data.Poster !== "N/A" ? data.Poster : "",
      year: data.Year ?? "Unknown",
      rating: data.imdbRating ?? "N/A",
      plot: data.Plot ?? "No plot available.",
      cast: data.Actors
        ? data.Actors
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name.length > 0)
            .slice(0, 5)
        : [],
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Failed to fetch movie metadata.", 500);
  }
}
