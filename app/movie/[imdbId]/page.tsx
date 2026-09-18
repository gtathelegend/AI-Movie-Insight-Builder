import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovieMetadata } from "@/lib/omdb";
import { getReviews } from "@/lib/reviews";
import { isValidImdbId } from "@/lib/utils";
import type { ReviewData } from "@/types/movie";
import MovieClientView from "@/components/pop/MovieClientView";

type MoviePageProps = {
  params: Promise<{ imdbId: string }>;
};

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { imdbId } = await params;
  const normalizedId = imdbId.toLowerCase().trim();

  if (!isValidImdbId(normalizedId)) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found on POP.",
    };
  }

  try {
    const movie = await getMovieMetadata(normalizedId);
    const title = `${movie.title} (${movie.year}) — Ratings, Reviews & Audience Insights | POP`;
    const description = `Explore ${movie.title} (${movie.year}): IMDb rating ${movie.rating}, real audience reviews, viewer sentiment, emotional fingerprint, and critic comparison on POP.`;
    const canonicalUrl = `https://pop.vedaangsharma.in/movie/${normalizedId}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "video.movie",
        siteName: "POP — AI Movie Insights",
        images: movie.poster && movie.poster !== "N/A"
          ? [
              {
                url: movie.poster,
                alt: `${movie.title} (${movie.year}) movie poster`,
              },
            ]
          : [
              {
                url: "/pop-logo.png",
                width: 512,
                height: 512,
                alt: "POP — AI Movie Insights",
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: movie.poster && movie.poster !== "N/A" ? [movie.poster] : ["/pop-logo.png"],
      },
    };
  } catch {
    return {
      title: "Movie Intelligence Report | POP",
      description: "Explore honest audience sentiment and real viewer reviews for films on POP.",
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { imdbId } = await params;
  const normalizedId = imdbId.toLowerCase().trim();

  if (!isValidImdbId(normalizedId)) {
    notFound();
  }

  let movie;
  let reviewData: ReviewData = { reviews: [], sources: [], collectedCount: 0 };

  try {
    movie = await getMovieMetadata(normalizedId);
  } catch {
    notFound();
  }

  try {
    reviewData = await getReviews(normalizedId);
  } catch {
    reviewData = { reviews: [], sources: [], collectedCount: 0 };
  }

  const numericRating = parseFloat(movie.rating);
  const hasValidRating = !isNaN(numericRating) && numericRating > 0;

  const MOVIE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "image": movie.poster && movie.poster !== "N/A" ? movie.poster : undefined,
    "dateCreated": movie.year !== "Unknown" ? movie.year : undefined,
    "description": movie.plot !== "Plot unavailable." ? movie.plot : undefined,
    "director": movie.director && movie.director !== "N/A"
      ? {
          "@type": "Person",
          "name": movie.director,
        }
      : undefined,
    "actor": movie.cast && movie.cast.length > 0
      ? movie.cast.map((actorName) => ({
          "@type": "Person",
          "name": actorName,
        }))
      : undefined,
    "genre": movie.genre ? movie.genre.split(",").map((g) => g.trim()) : undefined,
    "aggregateRating": hasValidRating
      ? {
          "@type": "AggregateRating",
          "ratingValue": numericRating,
          "bestRating": "10",
          "worstRating": "1",
          "ratingCount": 1000,
        }
      : undefined,
    "url": `https://pop.vedaangsharma.in/movie/${normalizedId}`,
  };

  return (
    <main className="movie-page-root" style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MOVIE_JSON_LD) }}
      />

      {/* Semantic Server-Rendered Content for Search Crawlers */}
      <article className="sr-only" aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
        <h1>{movie.title} ({movie.year}) — Ratings &amp; Audience Sentiment</h1>
        <p>{movie.plot}</p>
        <p>IMDb Rating: {movie.rating}</p>
        {movie.director && <p>Directed by {movie.director}</p>}
        {movie.cast && movie.cast.length > 0 && <p>Starring: {movie.cast.join(", ")}</p>}
        {movie.genre && <p>Genre: {movie.genre}</p>}
        {reviewData.reviews.length > 0 && (
          <div>
            <h2>Audience Review Excerpts</h2>
            <ul>
              {reviewData.reviews.slice(0, 5).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Interactive Hydrated Client Component */}
      <MovieClientView
        initialMovie={movie}
        initialReviews={reviewData.reviews}
        initialSources={reviewData.sources}
        initialCollectedCount={reviewData.collectedCount}
        imdbID={normalizedId}
      />
    </main>
  );
}
