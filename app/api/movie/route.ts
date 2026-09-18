import { NextRequest, NextResponse } from "next/server";
import { getMovieMetadata } from "@/lib/omdb";
import { getReviews } from "@/lib/reviews";
import { getCache, setCache } from "@/lib/cache";
import { ApiError, isValidImdbId } from "@/lib/utils";
import type { MovieResponse, ReviewData } from "@/types/movie";

export async function GET(request: NextRequest) {
  const imdbID = request.nextUrl.searchParams.get("imdbID")?.trim() ?? "";

  if (!isValidImdbId(imdbID)) {
    return NextResponse.json({ error: "Invalid IMDb ID format." }, { status: 400 });
  }

  const cacheKey = `movie:${imdbID.toLowerCase()}`;
  const cached = getCache<MovieResponse>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const movie = await getMovieMetadata(imdbID);

    let reviewData: ReviewData = { reviews: [], sources: [], collectedCount: 0 };
    try {
      reviewData = await getReviews(imdbID);
    } catch {
      reviewData = { reviews: [], sources: [], collectedCount: 0 };
    }

    const response: MovieResponse = {
      movie,
      reviews: reviewData.reviews,
      sources: reviewData.sources,
      collectedCount: reviewData.collectedCount,
      hasReviews: reviewData.reviews.length > 0,
    };

    setCache(cacheKey, response);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to fetch movie metadata." }, { status: 500 });
  }
}
