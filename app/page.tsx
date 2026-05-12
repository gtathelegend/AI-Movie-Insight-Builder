"use client";

import { useState, useRef, useEffect } from "react";
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
import FilmstripSection from "@/components/pop/FilmstripSection";
import CommentsSection from "@/components/pop/CommentsSection";
import FooterSection from "@/components/pop/FooterSection";
import PopcornRain from "@/components/pop/PopcornRain";

import type { MovieResponse } from "@/types/movie";
import type { AnalyzeResponse, SSEEvent } from "@/types/ai";

// ─── SSE stream reader ────────────────────────────────────────────────────────
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

    // Process complete SSE messages (separated by double newline)
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

// ─── Page component ───────────────────────────────────────────────────────────
export default function Home() {
  const [imdbID, setImdbID] = useState("");
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
    setAnalysisStep(null);

    try {
      // ── Fetch movie metadata + reviews ────────────────────────────────
      setAnalysisStep("Fetching movie details...");
      const movieRes = await fetch(`/api/movie?imdbID=${encodeURIComponent(normalizedId)}`);
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

      // ── Stream AI analysis via SSE ────────────────────────────────────
      const result = await streamAnalysis(
        {
          imdbID: normalizedId,
          reviews: movieJson.reviews.slice(0, 10),
          movieTitle: movieJson.movie.title,
          movieYear: movieJson.movie.year,
          rottenTomatoes: movieJson.movie.rottenTomatoes,
        },
        (msg) => setAnalysisStep(msg),
      );

      setInsights(result);

      // Scroll to intelligence sections after a beat
      setTimeout(() => {
        document.getElementById("emotions")?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Unexpected error.");
    } finally {
      setLoading(false);
      setAnalysisStep(null);
    }
  };

  const marqueeTitle = movieData?.movie.title ?? "NEON HEARTS";
  const marqueeScore = insights ? (insights.sentimentScore + 1) / 2 : 0.92;

  return (
    <>
      <PopcornRain enabled />

      <NavBar onSearchClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => heroRef.current?.focusSearch(), 600);
      }} />

      <HeroSection
        ref={heroRef}
        imdbID={imdbID}
        onChange={setImdbID}
        onSubmit={handleAnalyze}
        loading={loading}
      />

      <MarqueeStrip movieTitle={marqueeTitle} score={marqueeScore} />

      {/* ── Analysis progress indicator ────────────────────────────────── */}
      {analysisStep && (
        <div style={{ padding: "28px 36px", background: "var(--cream)", display: "flex", justifyContent: "center" }}>
          <div className="analysis-progress">
            <div className="progress-dot" />
            <span>{analysisStep}</span>
          </div>
        </div>
      )}

      {/* ── Error / info banners ───────────────────────────────────────── */}
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

      <TrendingGrid />

      <DetailSection movie={movieData?.movie} insights={insights} loading={loading} />

      <BreakdownSection insights={insights} />

      {/* ── Intelligence sections (live data when insights available) ─── */}
      <EmotionSection emotions={insights?.emotions} />

      <AudienceVsCriticsSection avc={insights?.audienceVsCritics} />

      <ClusterSection clusters={insights?.clusters} />

      <CharacterSection characters={insights?.characters} />

      <FilmstripSection />

      <CommentsSection reviews={movieData?.reviews} />

      <FooterSection />
    </>
  );
}
