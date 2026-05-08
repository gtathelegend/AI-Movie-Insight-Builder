"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Movie } from "@/types/movie";
import type { AnalyzeResponse } from "@/types/ai";
import ScoreBucket from "./ScoreBucket";
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
  const triggered = useRef(false);

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.from(".detail-poster", { x: -80, opacity: 0, duration: 0.8, ease: "power3.out" });
          gsap.from(".detail-info", { y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
          gsap.from(".score-card", { x: 80, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });
          gsap.from(".cast-card", { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.6 });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Re-animate when real data arrives
  useEffect(() => {
    if (!movie) return;
    triggered.current = false;
    gsap.fromTo(".detail-poster", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(".detail-info", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power3.out" });
    gsap.fromTo(".score-card", { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(".cast-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, delay: 0.4, duration: 0.4 });
  }, [movie]);

  return (
    <section className="detail" id="detail" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">// SPOTLIGHT</span>
        <h2 className="section-title" style={{ color: "var(--white)" }}>
          Today&rsquo;s pick of
          <br />
          the popcorn.
        </h2>
        <p className="section-sub" style={{ color: "rgba(255,255,255,0.85)" }}>
          {movie
            ? "Your movie is in the spotlight — AI-powered insights below."
            : "A deep dive on what we're handing the gold bucket to this week."}
        </p>

        <div className="detail-grid">
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

          {/* Score */}
          <ScoreBucket score={displayScore} label={scoreLabel} />
        </div>
      </div>
    </section>
  );
}
