"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NavBar from "@/components/pop/NavBar";
import HeroSection, { type HeroSectionHandle } from "@/components/pop/HeroSection";
import MarqueeStrip from "@/components/pop/MarqueeStrip";
import TrendingGrid from "@/components/pop/TrendingGrid";
import DetailSection from "@/components/pop/DetailSection";
import BreakdownSection from "@/components/pop/BreakdownSection";
import EmotionSection from "@/components/pop/EmotionSection";
import AudienceVsCriticsSection from "@/components/pop/AudienceVsCriticsSection";
import ClusterSection from "@/components/pop/ClusterSection";
import CharacterSection from "@/components/pop/CharacterSection";
import SnackCorrelationSection from "@/components/pop/SnackCorrelationSection";
import FilmstripSection from "@/components/pop/FilmstripSection";
import CommentsSection from "@/components/pop/CommentsSection";
import FooterSection from "@/components/pop/FooterSection";
import PopcornRain from "@/components/pop/PopcornRain";

import type { MovieResponse } from "@/types/movie";
import type { AnalyzeResponse, SSEEvent } from "@/types/ai";
import type { SearchResult } from "@/app/api/search/route";

async function streamAnalysis(
  payload: {
    imdbID: string;
    reviews: string[];
    movieTitle?: string;
    movieYear?: string;
    rottenTomatoes?: string;
  },
  onStep: (msg: string) => void,
): Promise<AnalyzeResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const err = await response.json().catch(() => ({ error: "AI analysis failed." })) as { error?: string };
    throw new Error(err.error ?? "AI analysis failed.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const messages = buffer.split("\n\n");
    buffer = messages.pop() ?? "";

    for (const message of messages) {
      if (!message.startsWith("data: ")) continue;
      const event = JSON.parse(message.slice(6)) as SSEEvent;

      if (event.step === "complete") return event.data;
      if (event.step === "error") throw new Error(event.error);
      if ("message" in event) onStep(event.message);
    }
  }

  throw new Error("Analysis stream ended unexpectedly.");
}

async function resolveTmdbToImdb(tmdbId: number): Promise<string> {
  const r = await fetch(`/api/resolve?tmdbId=${tmdbId}`);
  const data = (await r.json()) as { imdbID?: string; error?: string };
  if (!r.ok || !data.imdbID) throw new Error(data.error ?? "Could not resolve IMDb ID.");
  return data.imdbID;
}

async function searchTitle(query: string): Promise<SearchResult[]> {
  const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!r.ok) return [];
  return (await r.json()) as SearchResult[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [movieData, setMovieData] = useState<MovieResponse | null>(null);
  const [insights, setInsights] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const heroRef = useRef<HeroSectionHandle>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Core analysis pipeline given a known IMDb id
  const runAnalysis = useCallback(async (imdbID: string) => {
    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setMovieData(null);
    setInsights(null);
    setAnalysisStep("Fetching movie details...");

    try {
      const movieRes = await fetch(`/api/movie?imdbID=${encodeURIComponent(imdbID)}`);
      const movieJson = (await movieRes.json()) as MovieResponse & { error?: string };
      if (!movieRes.ok) throw new Error(movieJson.error ?? "Failed to fetch movie details.");
      setMovieData(movieJson);
      setAnalysisStep(null);

      setTimeout(() => {
        document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      if (!movieJson.reviews || movieJson.reviews.length === 0) {
        setInfoMessage("Insufficient audience reviews for AI sentiment analysis.");
        return;
      }

      const result = await streamAnalysis(
        {
          imdbID,
          reviews: movieJson.reviews.slice(0, 10),
          movieTitle: movieJson.movie.title,
          movieYear: movieJson.movie.year,
          rottenTomatoes: movieJson.movie.rottenTomatoes,
        },
        (msg) => setAnalysisStep(msg),
      );

      setInsights(result);

      setTimeout(() => {
        document.getElementById("emotions")?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Unexpected error.");
    } finally {
      setLoading(false);
      setAnalysisStep(null);
    }
  }, []);

  // Called by HeroSection button: query may be either an IMDb ID or a title
  const handleAnalyze = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Type a movie title or IMDb ID to begin.");
      return;
    }

    // Direct IMDb-ID path
    if (/^tt\d{6,8}$/i.test(trimmed)) {
      await runAnalysis(trimmed.toLowerCase());
      return;
    }

    // Title path: pick the top search match and resolve to IMDb
    setLoading(true);
    setError(null);
    setAnalysisStep("Looking up movie...");
    try {
      const results = await searchTitle(trimmed);
      if (results.length === 0) {
        setError(`No movies matched "${trimmed}". Try a different title.`);
        setLoading(false);
        setAnalysisStep(null);
        return;
      }
      const imdbID = await resolveTmdbToImdb(results[0].tmdbId);
      setQuery(results[0].title);
      await runAnalysis(imdbID);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
      setLoading(false);
      setAnalysisStep(null);
    }
  };

  // Called by HeroSection autocomplete pick
  const handlePickResult = async (r: SearchResult) => {
    setLoading(true);
    setError(null);
    setAnalysisStep("Looking up movie...");
    try {
      const imdbID = await resolveTmdbToImdb(r.tmdbId);
      await runAnalysis(imdbID);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load that movie.");
      setLoading(false);
      setAnalysisStep(null);
    }
  };

  // Called by TrendingGrid card click — same flow as autocomplete pick
  const handleTrendingClick = async (tmdbId: number, title: string) => {
    setQuery(title);
    setLoading(true);
    setError(null);
    setAnalysisStep("Looking up movie...");
    try {
      const imdbID = await resolveTmdbToImdb(tmdbId);
      await runAnalysis(imdbID);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load that movie.");
      setLoading(false);
      setAnalysisStep(null);
    }
  };

  const marqueeTitle = movieData?.movie.title ?? "POP CINEMA";
  const marqueeScore = insights ? (insights.sentimentScore + 1) / 2 : 0.92;

  return (
    <>
      <PopcornRain enabled hasMovie={!!movieData} />

      <NavBar
        hasMovie={!!movieData}
        onSearchClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => heroRef.current?.focusSearch(), 600);
        }}
      />

      <HeroSection
        ref={heroRef}
        query={query}
        onChange={setQuery}
        onSubmit={handleAnalyze}
        onPickResult={handlePickResult}
        loading={loading}
      />

      <MarqueeStrip movieTitle={marqueeTitle} score={marqueeScore} />

      {analysisStep && (
        <div style={{ padding: "28px 36px", background: "var(--cream)", display: "flex", justifyContent: "center" }}>
          <div className="analysis-progress">
            <div className="progress-dot" />
            <span>{analysisStep}</span>
          </div>
        </div>
      )}

      {(error || infoMessage) && !analysisStep && (
        <div style={{ padding: "24px 36px", background: "var(--cream)" }}>
          <div
            className={`pop-error ${error ? "is-error" : "is-info"}`}
            style={{ maxWidth: 680, margin: "0 auto" }}
          >
            <svg style={{ marginTop: 2, flexShrink: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{error ?? infoMessage}</span>
          </div>
        </div>
      )}

      <TrendingGrid onMovieClick={handleTrendingClick} />

      {movieData && (
        <>
          <DetailSection movie={movieData.movie} insights={insights} loading={loading} />
          <BreakdownSection insights={insights} />
          <EmotionSection emotions={insights?.emotions} />
          <AudienceVsCriticsSection avc={insights?.audienceVsCritics} />
          <ClusterSection clusters={insights?.clusters} />
          <CharacterSection characters={insights?.characters} />
          <SnackCorrelationSection insights={insights} />
          <CommentsSection reviews={movieData.reviews} />
        </>
      )}

      <FilmstripSection onFrameClick={handleTrendingClick} />

      <FooterSection />
    </>
  );
}
