"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const normalizedId = imdbID.trim();
    if (!/^tt\d{7,8}$/.test(normalizedId)) {
      setError("IMDb ID must start with 'tt' and include 7 or 8 digits.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);
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
        setInfoMessage("Insufficient audience reviews for AI sentiment analysis.");
        return;
      }

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imdbID: normalizedId,
          reviews: movieJson.reviews.slice(0, 10),
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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">AI Movie Insight Builder</h1>
          <p className="text-base text-slate-600">
            Fetch movie data and turn audience reviews into structured AI insights.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SearchBar imdbID={imdbID} onChange={setImdbID} onSubmit={handleAnalyze} loading={loading} />
        </motion.div>

        {loading && <Loader />}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {infoMessage && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700 shadow-sm"
          >
            {infoMessage}
          </motion.div>
        )}

        {movieData && <MovieCard movie={movieData.movie} reviewCount={movieData.reviews.length} />}
        {insights && <SentimentCard insights={insights} />}
      </div>
    </main>
  );
}
