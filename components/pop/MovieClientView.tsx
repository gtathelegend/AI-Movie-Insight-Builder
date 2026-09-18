"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Movie, ReviewSource } from "@/types/movie";
import type { AnalyzeResponse } from "@/types/ai";
import { streamAnalysis } from "@/lib/clientStream";
import DetailSection from "@/components/pop/DetailSection";
import BreakdownSection from "@/components/pop/BreakdownSection";
import EmotionSection from "@/components/pop/EmotionSection";
import AudienceVsCriticsSection from "@/components/pop/AudienceVsCriticsSection";
import ClusterSection from "@/components/pop/ClusterSection";
import CharacterSection from "@/components/pop/CharacterSection";
import SnackCorrelationSection from "@/components/pop/SnackCorrelationSection";
import CommentsSection from "@/components/pop/CommentsSection";
import SourceTransparencySection from "@/components/pop/SourceTransparencySection";
import FilmstripSection from "@/components/pop/FilmstripSection";
import FooterSection from "@/components/pop/FooterSection";
import FaqSection from "@/components/pop/FaqSection";
import SubpageNav from "@/components/pop/SubpageNav";

type MovieClientViewProps = {
  initialMovie: Movie;
  initialReviews: string[];
  initialSources?: ReviewSource[];
  initialCollectedCount?: number;
  imdbID: string;
};

export default function MovieClientView({
  initialMovie,
  initialReviews,
  initialSources = [],
  initialCollectedCount = 0,
  imdbID,
}: MovieClientViewProps) {
  const router = useRouter();
  const [insights, setInsights] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    initialReviews.length === 0
      ? "Not enough public audience reviews were available for AI sentiment analysis."
      : null
  );

  const activeRequestIdRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
    return () => clearTimeout(timer);
  }, [insights]);

  // Start AI analysis for the server-rendered movie
  const triggerAnalysis = useCallback(async () => {
    if (initialReviews.length === 0) {
      setInfoMessage("Not enough public audience reviews were available for AI sentiment analysis.");
      return;
    }

    const requestId = ++activeRequestIdRef.current;
    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setAnalysisStep("AI is analyzing audience reviews...");

    try {
      const result = await streamAnalysis(
        {
          imdbID,
          reviews: initialReviews.slice(0, 10),
          movieTitle: initialMovie.title,
          movieYear: initialMovie.year,
          rottenTomatoes: initialMovie.rottenTomatoes,
          sources: initialSources,
          collectedCount: initialCollectedCount || initialReviews.length,
        },
        (msg) => {
          if (activeRequestIdRef.current === requestId) {
            setAnalysisStep(msg);
          }
        }
      );

      if (activeRequestIdRef.current !== requestId) return;
      setInsights(result);

      setTimeout(() => {
        document.getElementById("emotions")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } catch {
      if (activeRequestIdRef.current !== requestId) return;
      setError("AI analysis is temporarily unavailable.");
    } finally {
      if (activeRequestIdRef.current === requestId) {
        setLoading(false);
        setAnalysisStep(null);
      }
    }
  }, [imdbID, initialMovie, initialReviews, initialSources, initialCollectedCount]);

  // Automatically start analysis when reviews exist
  useEffect(() => {
    if (initialReviews.length > 0 && !insights && !loading) {
      triggerAnalysis();
    }
  }, [initialReviews.length, insights, loading, triggerAnalysis]);

  const handleFrameClick = async (tmdbId: number) => {
    try {
      const res = await fetch(`/api/resolve?tmdbId=${tmdbId}`);
      if (res.ok) {
        const data = (await res.json()) as { imdbID?: string };
        if (data.imdbID) {
          router.push(`/movie/${data.imdbID}`);
        }
      }
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <SubpageNav />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="movie-breadcrumb-nav container" style={{ paddingTop: 24, paddingBottom: 12 }}>
        <ol style={{ display: "flex", gap: 8, alignItems: "center", listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "var(--ink-soft)", fontWeight: 700 }}>
          <li>
            <Link href="/" style={{ color: "var(--ink-soft)", textDecoration: "none" }}>Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/movies" style={{ color: "var(--ink-soft)", textDecoration: "none" }}>Movies</Link>
          </li>
          <li aria-hidden="true">/</li>
          {initialMovie.genre && (
            <>
              <li>
                <Link href={`/movies`} style={{ color: "var(--ink-soft)", textDecoration: "none" }}>
                  {initialMovie.genre.split(",")[0].trim()}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li aria-current="page" style={{ color: "var(--ink)", fontWeight: 800 }}>
            {initialMovie.title} ({initialMovie.year})
          </li>
        </ol>
      </nav>

      {/* Analysis Status Banner */}
      {(loading || analysisStep || error || infoMessage) && (
        <div className="container" style={{ margin: "16px auto" }}>
          <div
            className={`status-banner ${error ? "status-error" : loading ? "status-loading" : "status-info"}`}
            role="status"
            aria-live="polite"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: error ? "#ffeded" : loading ? "var(--yellow)" : "var(--white)",
              border: "3px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              color: "var(--ink)",
              fontWeight: 800,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {loading && <span className="status-spinner" style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>🍿</span>}
              <span>{error ?? infoMessage ?? analysisStep}</span>
            </div>
            {error && (
              <button
                type="button"
                onClick={triggerAnalysis}
                disabled={loading}
                style={{
                  padding: "6px 14px",
                  background: "var(--ink)",
                  color: "#fff",
                  border: "2px solid var(--ink)",
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                Retry Analysis
              </button>
            )}
          </div>
        </div>
      )}

      {/* Detail Section */}
      <DetailSection movie={initialMovie} insights={insights} loading={loading} />

      {/* Insights Breakdown */}
      {insights && (
        <>
          <BreakdownSection insights={insights} />
          <EmotionSection emotions={insights.emotions} />
          <AudienceVsCriticsSection avc={insights.audienceVsCritics} />
          <ClusterSection clusters={insights.clusters} />
          <CharacterSection characters={insights.characters} />
          <SnackCorrelationSection insights={insights} />
        </>
      )}

      {/* Comments Section */}
      <CommentsSection
        reviews={initialReviews}
        sources={initialSources}
        collectedCount={initialCollectedCount || initialReviews.length}
        analyzedCount={insights?.analyzedCount}
      />

      {/* Filmstrip Section */}
      <FilmstripSection onFrameClick={handleFrameClick} />

      {/* Data Source Transparency */}
      <SourceTransparencySection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Footer Section */}
      <FooterSection />
    </>
  );
}
