"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CharacterInsight } from "@/types/ai";
import { MOCK_CHARACTERS } from "./data";

type CharacterSectionProps = {
  characters?: CharacterInsight[] | null;
};

const AVATAR_EMOJIS = ["🎭", "🎬", "⭐", "🌙", "🔥", "👑", "🎯", "🌟"];

export default function CharacterSection({ characters }: CharacterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rawData = characters && characters.length > 0 ? characters : MOCK_CHARACTERS;

  // Sort deterministically by mention count (highest first)
  const data = useMemo(() => {
    return [...rawData].sort((a, b) => b.mentions - a.mentions);
  }, [rawData]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-char]").forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: () => {
            gsap.from(card, {
              scale: 0.85,
              opacity: 0,
              duration: 0.45,
              delay: i * 0.08,
              ease: "back.out(1.4)",
            });
          },
          once: true,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [data]);

  return (
    <section className="characters" id="characters" ref={sectionRef}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="section-label mono">{"// CHARACTER INTELLIGENCE"}</span>
          <span className="tag-ai-synthesis">AI ENTITY EXTRACTION</span>
        </div>
        <h2 className="section-title">
          Character <span style={{ color: "var(--yellow)" }}>Discussion</span>.
        </h2>
        <p className="section-sub">
          {characters
            ? "Characters identified in audience reviews — ranked by mention frequency and sentiment."
            : "The characters that linger in audience memory long after the credits roll."}
        </p>
        <div className="char-grid">
          {data.map((char, i) => (
            <div key={i} className="char-card" data-char>
              <div className="char-avatar">{AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]}</div>
              <div className="char-name">{char.name}</div>
              <div style={{ marginBottom: 6 }}>
                <span className={`char-badge ${char.sentiment}`}>
                  ● {char.sentiment.toUpperCase()}
                </span>
              </div>
              <div className="char-mentions mono">{char.mentions} audience mention{char.mentions === 1 ? "" : "s"}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
