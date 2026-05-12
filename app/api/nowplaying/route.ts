import { NextResponse } from "next/server";
import axios from "axios";

type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
};

type TmdbResponse = {
  results: TmdbMovie[];
};

export type NowPlayingMovie = {
  tmdbId: number;
  num: string;
  title: string;
  year: string;
  poster: string;
  score: number;
};

const CACHE_TTL_MS = 60 * 60 * 1000;
let cached: { data: NowPlayingMovie[]; ts: number } | null = null;

export async function GET() {
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY missing" }, { status: 500 });
  }

  try {
    const { data } = await axios.get<TmdbResponse>(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        params: { api_key: apiKey, language: "en-US", page: 1 },
        timeout: 8000,
      },
    );

    const movies: NowPlayingMovie[] = data.results.slice(0, 10).map((m, i) => ({
      tmdbId: m.id,
      num: String(i + 1).padStart(3, "0"),
      title: m.title,
      year: m.release_date ? m.release_date.slice(0, 4) : "",
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "",
      score: parseFloat((m.vote_average / 10).toFixed(2)),
    }));

    cached = { data: movies, ts: Date.now() };
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Failed to fetch now playing." }, { status: 500 });
  }
}
