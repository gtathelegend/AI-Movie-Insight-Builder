"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AudienceVsCritics } from "@/types/ai";
import { MOCK_AVC } from "./data";

type AudienceVsCriticsSectionProps = {
  avc?: AudienceVsCritics | null;
};

export default function AudienceVsCriticsSection({ avc }: AudienceVsCriticsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = avc ?? MOCK_AVC;
  const diff = Math.abs(data.audienceScore - data.criticScore);
  const winner = data.audienceScore > data.criticScore ? "Audience" : "Critics";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLElement>(".avc-side").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.from(el, { y: 60, opacity: 0, duration: 0.6, delay: i * 0.15, ease: "back.out(1.2)" });
          },
          once: true,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="avc" id="avc" ref={sectionRef}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="section-label mono">{"// AUDIENCE VS CRITICS SIGNAL"}</span>
          <span className="tag-ai-synthesis">SIGNAL COMPARISON</span>
        </div>
        <h2 className="section-title">
          Who was <span className="accent">right</span>?
        </h2>
        <p className="section-sub">
          {avc
            ? "Comparing professional critic scores against real audience sentiment."
            : "Where critics and audiences diverge — and who the film actually landed with."}
        </p>

        <div className="avc-split">
          <div className="avc-side critics">
            <div className="avc-big-score critics">{data.criticScore}%</div>
            <div className="avc-side-label mono">ROTTEN TOMATOES TOMATOMETER</div>
          </div>

          <div className="avc-divider">
            <div className="avc-vs-pill">VS</div>
          </div>

          <div className="avc-side audience">
            <div className="avc-big-score audience">{data.audienceScore}%</div>
            <div className="avc-side-label mono">AUDIENCE SENTIMENT INDEX</div>
          </div>
        </div>

        <div className="avc-verdict">
          {data.verdict || "Audience reception and critic scores evaluated side by side."}
          {diff >= 5 && (
            <span className="avc-diff-badge">
              {winner} lead +{diff}%
            </span>
          )}
        </div>

        <div className="avc-methodology-note">
          <span>ℹ Methodology Note: Audience Sentiment Index is synthesized from NLP analysis of real audience reviews. Critic score reflects aggregated Tomatometer ratings from OMDb / Rotten Tomatoes.</span>
        </div>
      </div>
    </section>
  );
}
