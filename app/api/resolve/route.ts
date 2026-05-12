import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type TmdbExternalIds = {
  imdb_id: string | null;
};

const cache = new Map<number, string>();

export async function GET(request: NextRequest) {
  const tmdbIdParam = request.nextUrl.searchParams.get("tmdbId");
  const tmdbId = tmdbIdParam ? parseInt(tmdbIdParam, 10) : NaN;

  if (!Number.isFinite(tmdbId)) {
    return NextResponse.json({ error: "Invalid tmdbId" }, { status: 400 });
  }

  const cached = cache.get(tmdbId);
  if (cached) {
    return NextResponse.json({ imdbID: cached });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY missing" }, { status: 500 });
  }

  try {
    const { data } = await axios.get<TmdbExternalIds>(
      `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`,
      {
        params: { api_key: apiKey },
        timeout: 8000,
      },
    );

    if (!data.imdb_id) {
      return NextResponse.json({ error: "No IMDb ID for this title." }, { status: 404 });
    }

    cache.set(tmdbId, data.imdb_id);
    return NextResponse.json({ imdbID: data.imdb_id });
  } catch {
    return NextResponse.json({ error: "Resolve failed." }, { status: 500 });
  }
}
