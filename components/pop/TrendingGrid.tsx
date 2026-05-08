"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRENDING } from "./data";

export default function TrendingGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll<HTMLDivElement>("[data-card]");
      cards?.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 90%" },
          y: 60,
          rotateY: 25,
          rotateX: -10,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: (i % 4) * 0.05,
        });

        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: px * 12, rotateX: -py * 12, duration: 0.3, transformPerspective: 800 });
        };
        const onLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
          Eight movies pulling the highest scores from real viewers right now. Hover to peek, click to dive in.
        </p>
        <div className="poster-grid">
          {TRENDING.map((m) => (
            <div
              key={m.rank}
              className="poster-card"
              data-card
              onClick={() => document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" })}
            >
              <div
                className="poster-img"
                style={{ background: `linear-gradient(135deg, ${m.color} 0%, ${m.color2} 100%)` }}
              >
                <span className="poster-rank display">{m.rank}</span>
                <span className="poster-score mono">{m.score.toFixed(2)}</span>
                <div
                  style={{
                    fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 28,
                    lineHeight: 0.9,
                    padding: 24,
                    textAlign: "center",
                    textShadow: "3px 3px 0 rgba(0,0,0,0.3)",
                  }}
                >
                  {m.title.toUpperCase()}
                </div>
              </div>
              <div className="poster-info">
                <div className="poster-title display">{m.title}</div>
                <div className="poster-meta mono">
                  {m.year} · {m.genre} · {m.runtime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
