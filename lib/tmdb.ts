import axios from "axios";

export type TmdbMovieSummary = {
  id: number;
  title: string;
  poster: string;
  year: number;
  genre: string;
  score: number;
  imdbId?: string;
};

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

type TmdbApiResponse = {
  results: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    release_date?: string;
    vote_average: number;
    genre_ids?: number[];
  }>;
};

export async function getTrendingMoviesServer(): Promise<TmdbMovieSummary[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  try {
    const { data } = await axios.get<TmdbApiResponse>(
      "https://api.themoviedb.org/3/trending/movie/week",
      {
        params: { api_key: apiKey, language: "en-US" },
        timeout: 8000,
      }
    );

    const movies = data.results.slice(0, 12).map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
      year: m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 0,
      genre: m.genre_ids ? m.genre_ids.slice(0, 2).map((id) => GENRE_MAP[id] ?? "Film").join(", ") : "Film",
      score: parseFloat((m.vote_average / 10).toFixed(2)),
    }));

    // Resolve IMDb IDs in parallel
    const resolved = await Promise.all(
      movies.map(async (m) => {
        const imdbId = await getTmdbImdbId(m.id);
        return { ...m, imdbId: imdbId ?? undefined };
      })
    );

    return resolved;
  } catch {
    return [];
  }
}

export async function getNowPlayingMoviesServer(): Promise<TmdbMovieSummary[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  try {
    const { data } = await axios.get<TmdbApiResponse>(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        params: { api_key: apiKey, language: "en-US", page: 1 },
        timeout: 8000,
      }
    );

    const movies = data.results.slice(0, 12).map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
      year: m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 0,
      genre: m.genre_ids ? m.genre_ids.slice(0, 2).map((id) => GENRE_MAP[id] ?? "Film").join(", ") : "Cinema",
      score: parseFloat((m.vote_average / 10).toFixed(2)),
    }));

    const resolved = await Promise.all(
      movies.map(async (m) => {
        const imdbId = await getTmdbImdbId(m.id);
        return { ...m, imdbId: imdbId ?? undefined };
      })
    );

    return resolved;
  } catch {
    return [];
  }
}

const idCache = new Map<number, string | null>();

export async function getTmdbImdbId(tmdbId: number): Promise<string | null> {
  if (idCache.has(tmdbId)) {
    return idCache.get(tmdbId) ?? null;
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const { data } = await axios.get<{ imdb_id: string | null }>(
      `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`,
      {
        params: { api_key: apiKey },
        timeout: 6000,
      }
    );
    const imdbId = data.imdb_id ?? null;
    idCache.set(tmdbId, imdbId);
    return imdbId;
  } catch {
    return null;
  }
}
