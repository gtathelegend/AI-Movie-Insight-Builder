"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Movie } from "@/types/movie";
import type { AnalyzeResponse } from "@/types/ai";
import ScoreBucket from "./ScoreBucket";
import AiSpotlightPanel from "./AiSpotlightPanel";
import { MOCK_DETAIL } from "./data";

type DetailSectionProps = {
  movie?: Movie | null;
  insights?: AnalyzeResponse | null;
  loading?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DetailSection({ movie, insights, loading }: DetailSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [showShimmer, setShowShimmer] = useState(false);
  const prevInsightsRef = useRef<AnalyzeResponse | null>(null);

  const isAnalyzed = Boolean(insights);

  const displayTitle = movie?.title ?? MOCK_DETAIL.title;
  const displayYear = movie?.year ?? String(MOCK_DETAIL.year);
  const displayRating = movie?.rating ?? MOCK_DETAIL.rating;
  const displayRuntime = MOCK_DETAIL.runtime;
  const displaySynopsis = movie?.plot ?? MOCK_DETAIL.synopsis;
  const displayScore = insights
    ? (insights.sentimentScore + 1) / 2
    : MOCK_DETAIL.score;
  const scoreLabel = insights
    ? insights.classification === "positive"
      ? "★ AI SENTIMENT: POSITIVE ★"
      : insights.classification === "negative"
      ? "★ AI SENTIMENT: NEGATIVE ★"
      : "★ AI SENTIMENT: MIXED ★"
    : "★ EXTRA BUTTER WORTHY ★";

  const castEntries = movie?.cast
    ? movie.cast.slice(0, 6).map((name) => ({
        name,
        role: "Cast",
        initials: getInitials(name),
      }))
    : MOCK_DETAIL.cast;

  // Trigger completion micro-shimmer effect when analysis completes
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (insights && !prevInsightsRef.current && !shouldReduceMotion) {
      const raf = requestAnimationFrame(() => {
        setShowShimmer(true);
        timer = setTimeout(() => setShowShimmer(false), 500);
      });
      prevInsightsRef.current = insights;
      return () => {
        cancelAnimationFrame(raf);
        if (timer) clearTimeout(timer);
      };
    }
    prevInsightsRef.current = insights ?? null;
  }, [insights, shouldReduceMotion]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      const poster = root.querySelector(".detail-poster");
      const info = root.querySelector(".detail-info");
      const score = root.querySelector(".score-card");
      const castCards = root.querySelectorAll<HTMLElement>(".cast-card");

      const tweens = [
        poster && gsap.fromTo(poster, { x: -40, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, ease: "power3.out", overwrite: "auto", clearProps: "transform",
        }),
        info && gsap.fromTo(info, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: "power3.out", overwrite: "auto", clearProps: "transform",
        }),
        score && gsap.fromTo(score, { x: 40, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power3.out", overwrite: "auto", clearProps: "transform",
        }),
        castCards.length && gsap.fromTo(castCards, { y: 16, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.35, ease: "power2.out",
          overwrite: "auto",
          clearProps: "transform",
          onComplete: () => {
            castCards.forEach((c) => { c.style.opacity = "1"; });
          },
        }),
      ];

      return () => {
        tweens.forEach((t) => t && t.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [movie]);

  return (
    <section
      className={`detail cinematic-section ${isAnalyzed ? "is-analyzed" : ""}`}
      id="detail"
      ref={sectionRef}
    >
      {showShimmer && <div className="completion-shimmer" />}

      <div className="container spotlight-container">
        <span className="section-label mono">
          {isAnalyzed ? "// AI SPOTLIGHT REPORT" : "// SPOTLIGHT"}
        </span>
        <h2 className="section-title" style={{ color: "var(--white)" }}>
          {isAnalyzed ? (
            <>
              Intelligence unlocked.
              <br />
              <span style={{ color: "var(--yellow)" }}>The AI Verdict.</span>
            </>
          ) : (
            <>
              Today&rsquo;s pick of
              <br />
              the popcorn.
            </>
          )}
        </h2>
        <p className="section-sub" style={{ color: "rgba(255,255,255,0.88)" }}>
          {isAnalyzed
            ? "Audience sentiment, critical themes, and opinion landscape extracted from real viewer reviews."
            : movie
            ? "Your movie is in the spotlight — audience intelligence analyzing below."
            : "A deep dive on what we're handing the gold bucket to this week."}
        </p>

        {/* Transition container between State A (Centered) and State B (Split) */}
        {!insights ? (
          /* STATE A: Pre-analysis / Centered Layout */
          <motion.div
            className="detail-grid"
            layout
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.6,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            {/* Poster */}
            <div className="detail-poster">
              {movie?.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={movie.poster} alt={`${movie.title} poster`} />
              ) : (
                <div className="detail-poster-text display">{displayTitle.toUpperCase()}</div>
              )}
            </div>

            {/* Info */}
            <div className="detail-info">
              <h2>{displayTitle}</h2>
              <div className="detail-meta">
                <span className="pill">{displayYear}</span>
                <span className="pill">{displayRating}</span>
                <span className="pill">{displayRuntime}</span>
                {(movie ? [] : MOCK_DETAIL.genres).map((g) => (
                  <span key={g} className="pill">{g}</span>
                ))}
                {!movie && <span className="pill">DIR. M. TANAKA</span>}
              </div>
              <p className="detail-synopsis">
                {loading ? "Loading movie details…" : displaySynopsis}
              </p>

              <h4
                style={{
                  fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
                  fontSize: 24,
                  color: "var(--white)",
                  marginBottom: 16,
                }}
              >
                The Cast
              </h4>
              <div className="cast-list">
                {castEntries.map((c, i) => (
                  <div key={i} className="cast-card">
                    <div className="cast-avatar display">{c.initials}</div>
                    <div className="cast-name">{c.name}</div>
                    <div className="cast-role mono">{c.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Bucket */}
            <ScoreBucket score={displayScore} label={scoreLabel} />
          </motion.div>
        ) : (
          /* STATE B: Post-analysis / Split 2-Column Layout */
          <div className="spotlight-layout-split">
            {/* Left Movie Card */}
            <motion.div
              className="movie-cinematic-card"
              layoutId="movie-spotlight-card"
              layout
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <div className="cinematic-poster">
                {movie?.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={movie.poster} alt={`${movie.title} poster`} />
                ) : (
                  <div className="cinematic-poster-text">{displayTitle.toUpperCase()}</div>
                )}
              </div>

              <h3>{displayTitle}</h3>
              <div className="movie-cinematic-meta">
                <span className="pill">{displayYear}</span>
                <span className="pill">{displayRating}</span>
                <span className="pill">{displayRuntime}</span>
                {(movie ? [] : MOCK_DETAIL.genres).map((g) => (
                  <span key={g} className="pill">{g}</span>
                ))}
              </div>

              <p className="movie-cinematic-synopsis">{displaySynopsis}</p>

              <div className="movie-cinematic-cast-title">Top Cast</div>
              <div className="movie-cinematic-cast-grid">
                {castEntries.slice(0, 4).map((c, i) => (
                  <div key={i} className="movie-cinematic-cast-item">
                    <div className="movie-cinematic-cast-initials">{c.initials}</div>
                    <div className="movie-cinematic-cast-name">{c.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right AI Spotlight Panel */}
            <AnimatePresence mode="wait">
              <AiSpotlightPanel key="ai-spotlight-panel" insights={insights} />
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
