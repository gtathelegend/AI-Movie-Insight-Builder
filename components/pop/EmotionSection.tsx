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

function generateRadarPoints(data: EmotionProfile, cx = 150, cy = 150, radius = 100): string {
  const numAxes = EMOTION_DEFS.length;
  return EMOTION_DEFS.map((def, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const value = Math.max(0, Math.min(100, data[def.key] ?? 50));
    const r = (value / 100) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function generateWebRings(cx = 150, cy = 150, radius = 100, steps = [0.25, 0.5, 0.75, 1]): string[] {
  const numAxes = EMOTION_DEFS.length;
  return steps.map((step) => {
    const r = radius * step;
    return EMOTION_DEFS.map((_, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  });
}

export default function EmotionSection({ emotions }: EmotionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = emotions ?? MOCK_EMOTIONS;

  const radarPoints = generateRadarPoints(data);
  const webRings = generateWebRings();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Radar entrance
      const radarCard = sectionRef.current?.querySelector<HTMLElement>(".emotion-radar-card");
      if (radarCard) {
        ScrollTrigger.create({
          trigger: radarCard,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              radarCard,
              { scale: 0.9, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }
            );
          },
          once: true,
        });
      }

      // Bar items entrance & fill
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-emotion]").forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              item,
              { x: -30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.45, delay: i * 0.05, ease: "power2.out" }
            );
            const fill = item.querySelector<HTMLElement>(".emotion-fill");
            if (fill) {
              const pct = fill.dataset.pct ?? "0";
              setTimeout(() => {
                fill.style.width = pct + "%";
              }, 150 + i * 40);
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="section-label mono">{"// EMOTIONAL FINGERPRINT"}</span>
          <span className="tag-ai-synthesis">AI SYNTHESIS</span>
        </div>
        <h2 className="section-title">
          Emotional <span className="accent">Fingerprint</span>.
        </h2>
        <p className="section-sub">
          {emotions
            ? "Emotional frequency and tonal resonance extracted from audience review language."
            : "The emotional fingerprint audiences leave behind in their words."}
        </p>

        <div className="emotion-layout-grid">
          {/* Left: SVG Spider Radar Visual */}
          <div className="emotion-radar-card" aria-hidden="true">
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--yellow)", marginBottom: 12, fontWeight: 800 }}>
              7-AXIS FREQUENCY MAP
            </span>
            <svg className="emotion-radar-svg" viewBox="0 0 300 300">
              {/* Web Rings */}
              {webRings.map((points, idx) => (
                <polygon
                  key={idx}
                  points={points}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1.5"
                  strokeDasharray={idx === 3 ? "none" : "3,3"}
                />
              ))}

              {/* Spokes */}
              {EMOTION_DEFS.map((_, i) => {
                const angle = (Math.PI * 2 / EMOTION_DEFS.length) * i - Math.PI / 2;
                const x = 150 + 100 * Math.cos(angle);
                const y = 150 + 100 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="150"
                    y1="150"
                    x2={x.toFixed(1)}
                    y2={y.toFixed(1)}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon className="emotion-poly" points={radarPoints} />

              {/* Axis Labels */}
              {EMOTION_DEFS.map((def, i) => {
                const angle = (Math.PI * 2 / EMOTION_DEFS.length) * i - Math.PI / 2;
                const x = 150 + 124 * Math.cos(angle);
                const y = 150 + 124 * Math.sin(angle);
                return (
                  <text
                    key={def.key}
                    x={x.toFixed(1)}
                    y={y.toFixed(1)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--cream)"
                    fontSize="10"
                    fontFamily="var(--font-mono), monospace"
                    fontWeight="700"
                  >
                    {def.emoji} {data[def.key]}%
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Right: Dimension Bars with Numeric & Screen-Reader Values */}
          <div className="emotion-grid-side">
            {EMOTION_DEFS.map(({ key, label, emoji }) => {
              const pct = data[key] ?? 0;
              return (
                <div key={key} className="emotion-item" data-emotion>
                  <div className="emotion-label-row">
                    <span className="emotion-name">{emoji} {label}</span>
                    <span className="emotion-pct mono">{pct}%</span>
                  </div>
                  <div
                    className="emotion-track"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${label} emotional score: ${pct} percent`}
                  >
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
      </div>
    </section>
  );
}
