"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { SEARCH_SUGGESTIONS } from "./data";

type HeroSectionProps = {
  imdbID: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export type HeroSectionHandle = {
  focusSearch: () => void;
};

const HeroSection = forwardRef<HeroSectionHandle, HeroSectionProps>(
  ({ imdbID, onChange, onSubmit, loading }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const curtainLRef = useRef<HTMLDivElement>(null);
    const curtainRRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const curtainRemovedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      focusSearch: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      if (curtainRemovedRef.current) return;
      curtainRemovedRef.current = true;

      const tl = gsap.timeline({ delay: 0.2 });

      document.body.style.overflow = "hidden";
      tl.to(curtainLRef.current, { x: "-100%", duration: 1.6, ease: "power3.inOut" }, 0)
        .to(curtainRRef.current, { x: "100%", duration: 1.6, ease: "power3.inOut" }, 0)
        .add(() => {
          document.body.style.overflow = "";
          curtainLRef.current?.remove();
          curtainRRef.current?.remove();
        }, ">-0.3");

      // Hero text reveal
      gsap.set(".reveal-word", { y: 80, opacity: 0 });
      tl.to(".reveal-word", {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "back.out(1.4)",
      }, 1.0)
        .from(".hero-eyebrow", { y: -20, opacity: 0, duration: 0.5 }, "<-0.2")
        .from(".hero-tagline", { y: 20, opacity: 0, duration: 0.5 }, "<+0.2")
        .from(".search-wrap", { y: 30, opacity: 0, duration: 0.6, ease: "back.out(1.2)" }, "<")
        .from(".search-suggestions .chip", { y: 10, opacity: 0, stagger: 0.04, duration: 0.3 }, "<+0.2")
        .from(".float-snack", {
          scale: 0,
          rotation: "random(-180, 180)",
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }, "<-0.4");

      // Floating loop
      document.querySelectorAll<SVGElement>(".float-snack").forEach((el, i) => {
        gsap.to(el, {
          y: "random(-15, 15)",
          x: "random(-10, 10)",
          rotation: "random(-8, 8)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    }, []);

    const handleKey = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") onSubmit();
    };

    return (
      <>
        {/* Curtains — absolutely positioned siblings rendered before hero */}
        <div className="curtain left" ref={curtainLRef} />
        <div className="curtain right" ref={curtainRRef} />

        <section className="hero" ref={heroRef}>
          <div className="hero-inner">
            <span className="hero-eyebrow mono">★ NOW SHOWING — 12,847 MOVIES ★</span>
            <h1 className="display">
              <span className="reveal-word">Find</span>{" "}
              <span className="reveal-word">your</span>
              <br />
              <span className="reveal-word pink">favorite</span>{" "}
              <span className="reveal-word">movie.</span>
            </h1>
            <p className="hero-tagline">
              Honest scores, real viewer voices, and a buttered bucket of recommendations. No algorithm slop.
            </p>

            <div className="search-wrap">
              <div className="search-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={imdbID}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Enter an IMDb ID (e.g. tt0133093)…"
                  autoComplete="off"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  className="search-btn"
                  onClick={onSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    "Loading…"
                  ) : (
                    <>
                      Pop it
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <div className="search-suggestions">
                <span className="mono" style={{ fontSize: 12, alignSelf: "center", opacity: 0.6 }}>TRY:</span>
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button
                    key={s.id}
                    className="chip"
                    onClick={() => onChange(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Floating snacks */}
          <svg className="float-snack" style={{ top: "15%", left: "8%" }} width="80" height="80" viewBox="0 0 80 80">
            <ellipse cx="40" cy="60" rx="22" ry="6" fill="#1A1A2E" opacity="0.15" />
            <path d="M22 30 L26 65 Q26 70 32 70 L48 70 Q54 70 54 65 L58 30 Z" fill="#FF3D7F" stroke="#1A1A2E" strokeWidth="3" />
            <path d="M28 30 L31 65 M40 30 L40 65 M52 30 L49 65" stroke="#FFF" strokeWidth="3" />
            <ellipse cx="40" cy="28" rx="22" ry="10" fill="#FFF8E7" stroke="#1A1A2E" strokeWidth="3" />
            <circle cx="32" cy="22" r="5" fill="#FFF8E7" stroke="#1A1A2E" strokeWidth="2" />
            <circle cx="42" cy="18" r="6" fill="#FFF8E7" stroke="#1A1A2E" strokeWidth="2" />
            <circle cx="50" cy="24" r="4" fill="#FFF8E7" stroke="#1A1A2E" strokeWidth="2" />
          </svg>

          <svg className="float-snack" style={{ top: "20%", right: "10%" }} width="70" height="90" viewBox="0 0 70 90">
            <path d="M16 20 L20 80 Q20 85 25 85 L45 85 Q50 85 50 80 L54 20 Z" fill="#E11D69" stroke="#1A1A2E" strokeWidth="3" />
            <rect x="16" y="20" width="38" height="10" fill="#FFF" stroke="#1A1A2E" strokeWidth="3" />
            <ellipse cx="35" cy="20" rx="19" ry="4" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="3" />
            <rect x="32" y="6" width="6" height="16" fill="#FFF" stroke="#1A1A2E" strokeWidth="2" />
            <ellipse cx="35" cy="6" rx="4" ry="2" fill="#FFF" stroke="#1A1A2E" strokeWidth="2" />
          </svg>

          <svg className="float-snack" style={{ bottom: "12%", left: "12%" }} width="80" height="50" viewBox="0 0 80 50">
            <rect x="6" y="10" width="68" height="32" rx="4" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="3" />
            <rect x="14" y="16" width="52" height="20" fill="#FFF" stroke="#1A1A2E" strokeWidth="2" />
            <text x="40" y="30" textAnchor="middle" fontFamily="var(--font-bagel), 'Bagel Fat One', sans-serif" fontSize="12" fill="#FF3D7F">ADMIT 1</text>
            <circle cx="14" cy="26" r="2" fill="#1A1A2E" />
            <circle cx="66" cy="26" r="2" fill="#1A1A2E" />
          </svg>

          <svg className="float-snack" style={{ bottom: "18%", right: "14%" }} width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="22" fill="#8B4513" stroke="#1A1A2E" strokeWidth="3" />
            <circle cx="30" cy="30" r="14" fill="#D2691E" stroke="#1A1A2E" strokeWidth="2" />
            <circle cx="30" cy="30" r="6" fill="#1A1A2E" />
          </svg>
        </section>
      </>
    );
  }
);

HeroSection.displayName = "HeroSection";
export default HeroSection;
