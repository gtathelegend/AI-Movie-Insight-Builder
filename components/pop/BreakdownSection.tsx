"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnalyzeResponse } from "@/types/ai";
import { MOCK_DETAIL } from "./data";

type BreakdownSectionProps = {
  insights?: AnalyzeResponse | null;
};

type BdCard = {
  name: string;
  icon: string;
  score: number;
  note: string;
  pct: number;
};

function buildAiCards(insights: AnalyzeResponse): BdCard[] {
  const normalized = ((insights.sentimentScore + 1) / 2) * 10;
  return [
    {
      name: "Sentiment",
      icon: "🎯",
      score: parseFloat(normalized.toFixed(1)),
      note: insights.summary,
      pct: ((insights.sentimentScore + 1) / 2) * 100,
    },
    {
      name: "Highlights",
      icon: "✨",
      score: Math.min(10, parseFloat((insights.pros.length * 2).toFixed(1))),
      note: insights.pros.slice(0, 2).join(". ") || "No major positives detected.",
      pct: Math.min(100, insights.pros.length * 20),
    },
    {
      name: "Pain Points",
      icon: "⚡",
      score: parseFloat(Math.max(0, 10 - insights.cons.length * 2).toFixed(1)),
      note: insights.cons.slice(0, 2).join(". ") || "No significant issues found.",
      pct: Math.max(0, 100 - insights.cons.length * 20),
    },
    {
      name: "Key Themes",
      icon: "🎬",
      score: Math.min(10, parseFloat((insights.keyThemes.length * 1.5).toFixed(1))),
      note: insights.keyThemes.join(" · ") || "No recurring themes detected.",
      pct: Math.min(100, insights.keyThemes.length * 15),
    },
  ];
}

export default function BreakdownSection({ insights }: BreakdownSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const cards: BdCard[] = insights ? buildAiCards(insights) : MOCK_DETAIL.breakdown;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLDivElement>("[data-bd]").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.from(card, { y: 50, opacity: 0, duration: 0.6, ease: "back.out(1.2)" });
            const fill = card.querySelector<HTMLElement>(".bd-bar-fill");
            if (fill) {
              const pct = fill.dataset.pct ?? "0";
              setTimeout(() => { fill.style.width = pct + "%"; }, 200);
            }
          },
          once: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <section className="breakdown" id="breakdown" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">// SCORE BREAKDOWN</span>
        <h2 className="section-title">
          What makes it <span className="accent">pop</span>.
        </h2>
        <p className="section-sub">
          {insights
            ? "AI-powered breakdown from real audience reviews."
            : "We don't roll up to a single number. Here's the full receipt — out of 10, by category."}
        </p>
        <div className="breakdown-grid">
          {cards.map((b, i) => (
            <div key={i} className="bd-card" data-bd>
              <div className="bd-head">
                <div>
                  <div className="bd-name display">{b.name}</div>
                  <div className="bd-score mono">
                    <b>{b.score.toFixed(1)}</b> / 10
                  </div>
                </div>
                <div className="bd-icon">{b.icon}</div>
              </div>
              <div className="bd-bar">
                <div className="bd-bar-fill" data-pct={b.pct} />
              </div>
              <p className="bd-note">{b.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
