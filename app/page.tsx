"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";
import Loader from "@/components/Loader";
import type { MovieResponse } from "@/types/movie";
import type { AnalyzeResponse } from "@/types/ai";

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movieData, setMovieData] = useState<MovieResponse | null>(null);
  const [insights, setInsights] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const normalizedId = imdbID.trim();
    if (!/^tt\d{7,8}$/.test(normalizedId)) {
      setError("IMDb ID must start with 'tt' and include 7 or 8 digits.");
      return;
    }

    setLoading(true);
    setError(null);
    setMovieData(null);
    setInsights(null);

    try {
      const movieRes = await fetch(`/api/movie?imdbID=${encodeURIComponent(normalizedId)}`);
      const movieJson = (await movieRes.json()) as MovieResponse & { error?: string };

      if (!movieRes.ok) {
        throw new Error(movieJson.error ?? "Failed to fetch movie details.");
      }

      setMovieData(movieJson);

      if (!movieJson.reviews || movieJson.reviews.length === 0) {
        setError("No audience reviews found for this movie.");
        return;
      }

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imdbID: normalizedId,
          reviews: movieJson.reviews,
        }),
      });

      const analyzeJson = (await analyzeRes.json()) as AnalyzeResponse & { error?: string };

      if (!analyzeRes.ok) {
        throw new Error(analyzeJson.error ?? "AI analysis failed.");
      }

      setInsights(analyzeJson);
    } catch (unknownError) {
      const message = unknownError instanceof Error ? unknownError.message : "Unexpected error.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a,#020617)] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Movie Insight Builder</h1>
          <p className="text-sm text-zinc-300 sm:text-base">
            Fetch movie data and turn audience reviews into structured AI insights.
          </p>
        </header>

        <SearchBar imdbID={imdbID} onChange={setImdbID} onSubmit={handleAnalyze} loading={loading} />

        {loading && <Loader />}

        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {movieData && <MovieCard movie={movieData.movie} reviewCount={movieData.reviews.length} />}
        {insights && <SentimentCard insights={insights} />}
      </div>
    </main>
  );
}
