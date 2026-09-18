import { NextRequest, NextResponse } from "next/server";
import { getMovieMetadata } from "@/lib/omdb";
import { getReviews } from "@/lib/reviews";
import { ApiError, isValidImdbId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const imdbID = request.nextUrl.searchParams.get("imdbID")?.trim() ?? "";

  if (!isValidImdbId(imdbID)) {
    return NextResponse.json({ error: "Invalid IMDb ID format." }, { status: 400 });
  }

  try {
    const movie = await getMovieMetadata(imdbID);

    let reviews: string[] = [];
    try {
      reviews = await getReviews(imdbID);
    } catch {
      reviews = [];
    }

    return NextResponse.json({
      movie,
      reviews,
      hasReviews: reviews.length > 0,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to fetch movie metadata." }, { status: 500 });
  }
}
