import { NextResponse } from "next/server";
import axios from "axios";

// TMDb genre ID → name map (stable subset of common genres)
const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

type TmdbResponse = {
  results: TmdbMovie[];
};

export type TrendingMovie = {
  rank: number;
  title: string;
  year: number;
  genre: string;
  score: number;
  poster: string;
  tmdbId: number;
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cached: { data: TrendingMovie[]; ts: number } | null = null;

export async function GET() {
  // Return cached results if still fresh
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY missing" }, { status: 500 });
  }

  try {
    const { data } = await axios.get<TmdbResponse>(
      "https://api.themoviedb.org/3/trending/movie/week",
      {
        params: { api_key: apiKey, language: "en-US" },
        timeout: 8000,
      },
    );

    const movies: TrendingMovie[] = data.results.slice(0, 8).map((m, i) => ({
      rank: i + 1,
      title: m.title,
      year: m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 0,
      genre: m.genre_ids.slice(0, 2).map((id) => GENRE_MAP[id] ?? "Film").join(", "),
      score: parseFloat((m.vote_average / 10).toFixed(2)),
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "",
      tmdbId: m.id,
    }));

    cached = { data: movies, ts: Date.now() };
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Failed to fetch trending movies." }, { status: 500 });
  }
}
