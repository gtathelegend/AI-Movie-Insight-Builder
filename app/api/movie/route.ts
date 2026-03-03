import { NextRequest, NextResponse } from "next/server";
import { getMovieMetadata } from "@/lib/omdb";
import { getMovieReviews } from "@/lib/reviews";
import { ApiError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const imdbID = request.nextUrl.searchParams.get("imdbID")?.trim() ?? "";

  try {
    const movie = await getMovieMetadata(imdbID);
    const reviews = await getMovieReviews(imdbID);

    return NextResponse.json({
      movie,
      reviews,
      hasReviews: reviews.length > 0,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
