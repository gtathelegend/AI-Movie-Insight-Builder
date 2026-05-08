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
import FilmstripSection from "@/components/pop/FilmstripSection";
import CommentsSection from "@/components/pop/CommentsSection";
import FooterSection from "@/components/pop/FooterSection";
import PopcornRain from "@/components/pop/PopcornRain";

import type { MovieResponse } from "@/types/movie";
import type { AnalyzeResponse } from "@/types/ai";

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movieData, setMovieData] = useState<MovieResponse | null>(null);
  const [insights, setInsights] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const heroRef = useRef<HeroSectionHandle>(null);

  // Register ScrollTrigger globally once
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

    try {
      const movieRes = await fetch(`/api/movie?imdbID=${encodeURIComponent(normalizedId)}`);
      const movieJson = (await movieRes.json()) as MovieResponse & { error?: string };

      if (!movieRes.ok) throw new Error(movieJson.error ?? "Failed to fetch movie details.");
      setMovieData(movieJson);

      // Scroll to detail section after movie loads
      setTimeout(() => {
        document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      if (!movieJson.reviews || movieJson.reviews.length === 0) {
        setInfoMessage("Insufficient audience reviews for AI sentiment analysis.");
        return;
      }

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbID: normalizedId, reviews: movieJson.reviews.slice(0, 10) }),
      });

      const analyzeJson = (await analyzeRes.json()) as AnalyzeResponse & { error?: string };
      if (!analyzeRes.ok) throw new Error(analyzeJson.error ?? "AI analysis failed.");
      setInsights(analyzeJson);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const marqueeTitle = movieData?.movie.title ?? "NEON HEARTS";
  const marqueeScore = insights
    ? (insights.sentimentScore + 1) / 2
    : 0.92;

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

      {/* Error / info banners */}
      {(error || infoMessage) && (
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

      <DetailSection
        movie={movieData?.movie}
        insights={insights}
        loading={loading}
      />

      <BreakdownSection insights={insights} />

      <FilmstripSection />

      <CommentsSection reviews={movieData?.reviews} />

      <FooterSection />
    </>
  );
}
