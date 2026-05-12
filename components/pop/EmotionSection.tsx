"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { EmotionProfile } from "@/types/ai";
import { MOCK_EMOTIONS } from "./data";

type EmotionSectionProps = {
  emotions?: EmotionProfile | null;
};

type EmotionDef = {
  key: keyof EmotionProfile;
  label: string;
  emoji: string;
};

const EMOTION_DEFS: EmotionDef[] = [
  { key: "excitement",   label: "Excitement",   emoji: "⚡" },
  { key: "satisfaction", label: "Satisfaction",  emoji: "✨" },
  { key: "inspiration",  label: "Inspiration",   emoji: "🌟" },
  { key: "nostalgia",    label: "Nostalgia",     emoji: "🎞" },
  { key: "sadness",      label: "Sadness",       emoji: "💧" },
  { key: "fear",         label: "Fear",          emoji: "😰" },
  { key: "confusion",    label: "Confusion",     emoji: "🌀" },
];

export default function EmotionSection({ emotions }: EmotionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = emotions ?? MOCK_EMOTIONS;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-emotion]").forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 88%",
          onEnter: () => {
            gsap.from(item, { x: -40, opacity: 0, duration: 0.5, ease: "power2.out" });
            const fill = item.querySelector<HTMLElement>(".emotion-fill");
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
  }, [data]);

  return (
    <section className="emotions" id="emotions" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">// EMOTION INTELLIGENCE</span>
        <h2 className="section-title">
          How it <span className="accent">feels</span>.
        </h2>
        <p className="section-sub">
          {emotions
            ? "Emotional frequency extracted from audience language patterns."
            : "The emotional fingerprint audiences leave behind in their words."}
        </p>
        <div className="emotion-grid">
          {EMOTION_DEFS.map(({ key, label, emoji }) => {
            const pct = data[key];
            return (
              <div key={key} className="emotion-item" data-emotion>
                <div className="emotion-label-row">
                  <span className="emotion-name">{emoji} {label}</span>
                  <span className="emotion-pct">{pct}%</span>
                </div>
                <div className="emotion-track">
                  <div
                    className={`emotion-fill ${key}`}
                    data-pct={pct}
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
