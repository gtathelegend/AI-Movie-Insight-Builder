"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CharacterInsight } from "@/types/ai";
import { MOCK_CHARACTERS } from "./data";

type CharacterSectionProps = {
  characters?: CharacterInsight[] | null;
};

const AVATAR_EMOJIS = ["🎭", "🎬", "⭐", "🌙", "🔥", "👑", "🎯", "🌟"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CharacterSection({ characters }: CharacterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = characters && characters.length > 0 ? characters : MOCK_CHARACTERS;

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
              delay: i * 0.1,
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
        <span className="section-label mono">// CHARACTER INTELLIGENCE</span>
        <h2 className="section-title">
          Who audiences <span style={{ color: "var(--yellow)" }}>remember</span>.
        </h2>
        <p className="section-sub">
          {characters
            ? "Characters extracted from audience reviews — who dominated the conversation."
            : "The characters that linger in audience memory long after the credits roll."}
        </p>
        <div className="char-grid">
          {data.map((char, i) => (
            <div key={i} className="char-card" data-char>
              <div className="char-avatar">{AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]}</div>
              <div className="char-name">{char.name}</div>
              <div>
                <span className={`char-badge ${char.sentiment}`}>
                  {char.sentiment.toUpperCase()}
                </span>
              </div>
              <div className="char-mentions">{char.mentions} mentions</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
