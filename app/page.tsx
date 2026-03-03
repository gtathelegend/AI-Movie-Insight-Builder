"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";
import Loader from "@/components/Loader";
import ReviewsList from "@/components/ReviewsList";
import type { MovieResponse } from "@/types/movie";
import type { AnalyzeResponse } from "@/types/ai";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movieData, setMovieData] = useState<MovieResponse | null>(null);
  const [insights, setInsights] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const sync = () => setIsDesktop(mediaQuery.matches);
    sync();

    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-6xl space-y-10 px-8 py-16"
      >
        <motion.section
          variants={itemVariants}
          className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-md sm:p-10"
        >
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">AI Movie Insight Builder</h1>
              <p className="text-lg text-slate-600">
                Discover movie intelligence with cinematic metadata, audience review mining, and AI-powered sentiment analysis.
              </p>
            </div>
            <SearchBar imdbID={imdbID} onChange={setImdbID} onSubmit={handleAnalyze} loading={loading} />
          </div>
        </motion.section>

        {loading && <Loader />}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-base text-rose-700 shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {infoMessage && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-600 shadow-sm"
          >
            {infoMessage}
          </motion.div>
        )}

        {movieData && (
          <motion.div
            layout
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={insights ? "grid items-start gap-6 lg:grid-cols-2" : "grid grid-cols-1"}
          >
            <motion.div
              layout
              layoutId="movie-panel"
              animate={
                isDesktop && insights
                  ? { x: -20, scale: 0.98, filter: "blur(0px)" }
                  : { x: 0, scale: 1, filter: "blur(0px)" }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={insights ? "rounded-2xl shadow-md ring-1 ring-blue-100" : ""}
            >
              <MovieCard movie={movieData.movie} reviewCount={movieData.reviews.length} />
            </motion.div>

            <AnimatePresence>
              {insights && (
                <motion.div
                  key="sentiment-panel"
                  layout
                  layoutId="insight-panel"
                  initial={isDesktop ? { opacity: 0, x: 40, filter: "blur(8px)" } : { opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)", scale: [0.99, 1.01, 1] }}
                  exit={isDesktop ? { opacity: 0, x: 24 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: "easeInOut", times: [0, 0.75, 1] }}
                  className="rounded-2xl shadow-md ring-1 ring-blue-100"
                >
                  <SentimentCard insights={insights} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {movieData && insights && movieData.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ReviewsList reviews={movieData.reviews} />
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
