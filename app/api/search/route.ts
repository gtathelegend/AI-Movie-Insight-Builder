import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type TmdbSearchResult = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
};

type TmdbSearchResponse = {
  results: TmdbSearchResult[];
};

export type SearchResult = {
  tmdbId: number;
  title: string;
  year: string;
  poster: string;
  score: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { data: SearchResult[]; ts: number }>();

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 3) {
    return NextResponse.json([] satisfies SearchResult[]);
  }

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) {
    return NextResponse.json(hit.data);
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY missing" }, { status: 500 });
  }

  try {
    const { data } = await axios.get<TmdbSearchResponse>(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: apiKey,
          query: q,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
        timeout: 8000,
      },
    );

    const results: SearchResult[] = data.results
      .filter((r) => r.title)
      .slice(0, 8)
      .map((r) => ({
        tmdbId: r.id,
        title: r.title,
        year: r.release_date ? r.release_date.slice(0, 4) : "",
        poster: r.poster_path
          ? `https://image.tmdb.org/t/p/w154${r.poster_path}`
          : "",
        score: parseFloat((r.vote_average / 10).toFixed(2)),
      }));

    cache.set(key, { data: results, ts: Date.now() });
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Search failed." }, { status: 500 });
  }
}
