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
        headers: { "Content-Type": "application/json" },
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
    <>
      {/* Fixed header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center border-b border-zinc-100 bg-white/80 px-6 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-zinc-900">AI Movie Insights</span>
          <a
            href="https://github.com/vedaangsharma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-zinc-700"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </header>

      <main className="min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-6xl space-y-8 px-6 pb-20 pt-32"
        >
          {/* Hero */}
          <motion.section variants={itemVariants} className="space-y-6 pb-4 text-center">
            <div className="space-y-3">
              <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                AI Movie Insights
              </h1>
              <p className="mx-auto max-w-lg text-base text-zinc-500">
                Enter an IMDb ID to get cinematic metadata, audience reviews, and AI-powered sentiment analysis.
              </p>
            </div>
            <SearchBar imdbID={imdbID} onChange={setImdbID} onSubmit={handleAnalyze} loading={loading} />
          </motion.section>

          {loading && <Loader />}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-start gap-3 rounded-xl border border-rose-100 bg-white px-5 py-4 text-sm text-rose-600 shadow-sm"
            >
              <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </motion.div>
          )}

          {infoMessage && !error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-500 shadow-sm"
            >
              <svg className="mt-0.5 shrink-0 text-zinc-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 7.5V11M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {infoMessage}
            </motion.div>
          )}

          {movieData && (
            <motion.div
              layout
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={insights ? "grid items-start gap-6 lg:grid-cols-[3fr_2fr]" : "grid grid-cols-1"}
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
                className={insights ? "rounded-2xl shadow-sm ring-1 ring-zinc-100" : ""}
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
                    className="rounded-2xl shadow-sm ring-1 ring-zinc-100"
                  >
                    <SentimentCard insights={insights} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {movieData && insights && movieData.reviews.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="h-px flex-1 bg-zinc-100" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
                  Audience Reviews
                </span>
                <div className="h-px flex-1 bg-zinc-100" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ReviewsList reviews={movieData.reviews} />
              </motion.div>
            </>
          )}
        </motion.div>

        <footer className="border-t border-zinc-100 bg-white/60">
          <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-zinc-400">
            Powered by OpenRouter · OMDb · TMDb
          </div>
        </footer>
      </main>
    </>
  );
}
