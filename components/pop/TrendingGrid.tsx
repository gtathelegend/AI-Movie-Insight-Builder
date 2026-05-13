"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRENDING } from "./data";
import type { TrendingMovie } from "@/app/api/trending/route";

const GRADIENT_PAIRS = [
  ["#FF3D7F", "#FFD23F"], ["#C1272D", "#FFB347"], ["#2A1A3E", "#7A5BA8"],
  ["#FF6B9D", "#FFE66D"], ["#1A3A5C", "#F4A460"], ["#E63946", "#F1FAEE"],
  ["#457B9D", "#A8DADC"], ["#9B5DE5", "#F15BB5"],
];

type TrendingGridProps = {
  onMovieClick?: (tmdbId: number, title: string) => void;
};

export default function TrendingGrid({ onMovieClick }: TrendingGridProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [movies, setMovies] = useState<TrendingMovie[] | null>(null);

  // Fetch real trending data; fall back to static mock if API is unavailable
  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.ok ? r.json() as Promise<TrendingMovie[]> : Promise.reject())
      .then(setMovies)
      .catch(() => setMovies(null)); // null → use TRENDING mock below
  }, []);

  const displayMovies = movies ?? TRENDING.map((m, i) => ({
    rank: m.rank,
    title: m.title,
    year: m.year,
    genre: m.genre,
    score: m.score,
    poster: "",
    tmdbId: i,
  }));

  useEffect(() => {
    if (!displayMovies.length) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll<HTMLDivElement>("[data-card]");
      cards?.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 90%" },
          y: 60, rotateY: 25, rotateX: -10, opacity: 0,
          duration: 0.8, ease: "power3.out", delay: (i % 4) * 0.05,
        });

        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: px * 12, rotateX: -py * 12, duration: 0.3, transformPerspective: 800 });
        };
        const onLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayMovies]);

  return (
    <section className="trending" id="trending" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">// TRENDING THIS WEEK</span>
        <h2 className="section-title">
          Buttery <span className="accent">bangers</span>
          <br />
          everyone&rsquo;s watching.
        </h2>
        <p className="section-sub">
          {movies
            ? "Live from TMDb — the 8 movies pulling the highest scores right now."
            : "Eight movies pulling the highest scores from real viewers right now. Hover to peek."}
        </p>
        <div className="poster-grid">
          {displayMovies.map((m, i) => {
            const [c1, c2] = GRADIENT_PAIRS[i % GRADIENT_PAIRS.length];
            return (
              <div
                key={m.rank}
                className="poster-card"
                data-card
                onClick={() => {
                  if (onMovieClick && Number.isFinite(m.tmdbId)) {
                    onMovieClick(m.tmdbId, m.title);
                  } else {
                    document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <div
                  className="poster-img"
                  style={
                    m.poster
                      ? { backgroundImage: `url(${m.poster})` }
                      : { background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }
                  }
                >
                  <span className="poster-rank display">{m.rank}</span>
                  <span className="poster-score mono">{Math.round(m.score * 100)}</span>
                  {!m.poster && (
                    <div style={{ fontFamily: "var(--font-bagel),'Bagel Fat One',sans-serif", color: "rgba(255,255,255,0.9)", fontSize: 28, lineHeight: 0.9, padding: 24, textAlign: "center", textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}>
                      {m.title.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="poster-info">
                  <div className="poster-title display">{m.title}</div>
                  <div className="poster-meta mono">
                    {m.year} · {m.genre}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
