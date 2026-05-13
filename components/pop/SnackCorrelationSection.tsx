"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnalyzeResponse } from "@/types/ai";

type SnackCorrelationSectionProps = {
  insights?: AnalyzeResponse | null;
};

type SnackEntry = {
  icon: string;
  name: string;
  blurb: string;
  pct: number;
  color: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Deterministic mapping from emotion fingerprint + sentiment → concession-stand picks.
// Each snack picks up signal from the emotions most associated with the craving.
function deriveSnacks(insights: AnalyzeResponse): SnackEntry[] {
  const e = insights.emotions;
  const s = insights.sentimentScore; // -1..+1
  const sentimentBoost = s > 0 ? s * 12 : 0;

  const popcorn = clamp(
    Math.round(38 + e.excitement * 0.35 + e.satisfaction * 0.15 + sentimentBoost),
    25, 94,
  );
  const chocolate = clamp(
    Math.round(22 + e.nostalgia * 0.36 + e.sadness * 0.28 + e.inspiration * 0.10),
    18, 88,
  );
  const cola = clamp(
    Math.round(26 + e.excitement * 0.22 + e.satisfaction * 0.18 + (s > 0.3 ? 10 : 0)),
    20, 82,
  );

  return [
    {
      icon: "🍿",
      name: "Popcorn",
      blurb: "Driven by on-screen energy and viewer satisfaction.",
      pct: popcorn,
      color: "#FFD23F",
    },
    {
      icon: "🍫",
      name: "Chocolate",
      blurb: "Linked to nostalgia and emotional aftertaste.",
      pct: chocolate,
      color: "#9B5DE5",
    },
    {
      icon: "🥤",
      name: "Cola",
      blurb: "Pairs with high-tempo, feel-good viewing.",
      pct: cola,
      color: "#FF3D7F",
    },
  ];
}

export default function SnackCorrelationSection({ insights }: SnackCorrelationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!insights) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-snack]");
      cards?.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 40, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.55,
                delay: i * 0.08,
                ease: "back.out(1.4)",
                overwrite: "auto",
                onComplete: () => {
                  card.style.opacity = "1";
                },
              },
            );
            const fill = card.querySelector<HTMLElement>(".snack-bar-fill");
            if (fill) {
              const pct = fill.dataset.pct ?? "0";
              setTimeout(() => {
                fill.style.width = pct + "%";
              }, 200 + i * 80);
            }
          },
          once: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [insights]);

  // Hide entirely until AI insights exist — the whole section is meaningless without them.
  if (!insights) return null;

  const snacks = deriveSnacks(insights);
  const topSnack = [...snacks].sort((a, b) => b.pct - a.pct)[0];

  return (
    <section className="snack-correlation" id="snack-correlation" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">// SNACK SENTIMENT CORRELATION</span>
        <h2 className="section-title">
          What fans of this movie <span className="accent">crave</span>.
        </h2>
        <p className="section-sub">
          Behavioral intelligence: this film&rsquo;s emotional fingerprint maps to a specific concession-stand profile.
          Most-likely pick: <strong>{topSnack.icon} {topSnack.name}</strong>.
        </p>

        <div className="snack-corr-grid">
          {snacks.map((s) => (
            <div key={s.name} className="snack-corr-card" data-snack>
              <div className="snack-corr-icon">{s.icon}</div>
              <div className="snack-corr-name display">{s.name}</div>
              <div className="snack-corr-pct mono">{s.pct}%</div>
              <div className="snack-corr-bar">
                <div
                  className="snack-bar-fill"
                  data-pct={s.pct}
                  style={{ width: "0%", background: s.color }}
                />
              </div>
              <p className="snack-corr-blurb">{s.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
