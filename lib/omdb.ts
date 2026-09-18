import axios from "axios";
import type { Movie } from "@/types/movie";
import { ApiError, isValidImdbId } from "@/lib/utils";

type OmdbRating = {
  Source: string;
  Value: string;
};

type OmdbResponse = {
  Response: "True" | "False";
  Error?: string;
  Title?: string;
  Poster?: string;
  Year?: string;
  imdbRating?: string;
  Plot?: string;
  Actors?: string;
  Genre?: string;
  Director?: string;
  Runtime?: string;
  Metascore?: string;
  Ratings?: OmdbRating[];
};

function extractRottenTomatoes(ratings: OmdbRating[] = []): string | undefined {
  const rt = ratings.find((r) => r.Source === "Rotten Tomatoes");
  return rt?.Value && rt.Value !== "N/A" ? rt.Value : undefined;
}

export async function getMovieMetadata(imdbID: string): Promise<Movie> {
  if (!isValidImdbId(imdbID)) {
    throw new ApiError("Invalid IMDb ID format.", 400);
  }

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new ApiError("OMDB_API_KEY is missing.", 500);

  try {
    const { data } = await axios.get<OmdbResponse>("https://www.omdbapi.com/", {
      params: { i: imdbID, apikey: apiKey },
      timeout: 10000,
    });

    if (data.Response === "False") {
      const message = data.Error ?? "Movie not found.";
      throw new ApiError(message, message.toLowerCase().includes("not found") ? 404 : 500);
    }

    return {
      title: data.Title && data.Title !== "N/A" ? data.Title : "Unknown",
      poster: data.Poster && data.Poster !== "N/A" ? data.Poster : "",
      year: data.Year && data.Year !== "N/A" ? data.Year : "Unknown",
      rating: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "Not rated.",
      plot: data.Plot && data.Plot !== "N/A" ? data.Plot : "Plot unavailable.",
      cast:
        data.Actors && data.Actors !== "N/A"
          ? data.Actors.split(",").map((n) => n.trim()).filter(Boolean)
          : [],
      genre: data.Genre && data.Genre !== "N/A" ? data.Genre : undefined,
      director: data.Director && data.Director !== "N/A" ? data.Director : undefined,
      runtime: data.Runtime && data.Runtime !== "N/A" ? data.Runtime : undefined,
      metascore: data.Metascore && data.Metascore !== "N/A" ? data.Metascore : undefined,
      rottenTomatoes: extractRottenTomatoes(data.Ratings),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to fetch movie metadata.", 500);
  }
}
