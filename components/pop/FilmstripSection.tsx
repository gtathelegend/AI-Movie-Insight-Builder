"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FILMSTRIP, FILMSTRIP_COLORS } from "./data";
import type { NowPlayingMovie } from "@/app/api/nowplaying/route";

type FilmstripSectionProps = {
  onFrameClick?: (tmdbId: number, title: string) => void;
};

type FilmstripFrame = {
  num: string;
  title: string;
  meta: string;
  tmdbId?: number;
  poster?: string;
};

export default function FilmstripSection({ onFrameClick }: FilmstripSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [frames, setFrames] = useState<FilmstripFrame[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/nowplaying")
      .then((r) => (r.ok ? (r.json() as Promise<NowPlayingMovie[]>) : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setFrames(
          data.map((m) => ({
            num: m.num,
            title: m.title,
            meta: m.year ? `${m.year} · TMDb` : "TMDb",
            tmdbId: m.tmdbId,
            poster: m.poster,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setFrames(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allFrames: FilmstripFrame[] = (() => {
    const source: FilmstripFrame[] =
      frames && frames.length > 0 ? frames : FILMSTRIP.map((f) => ({ ...f }));
    return [...source, ...source];
  })();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const section = sectionRef.current;
    const filmstrip = filmstripRef.current;
    if (!track || !section || !filmstrip) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        onEnter: () => {
          gsap.from(track.querySelectorAll(".frame"), {
            opacity: 0,
            x: 40,
            stagger: 0.06,
            duration: 0.5,
            ease: "power2.out",
          });
        },
        once: true,
      });

      const trackWidth = track.scrollWidth;
      const viewWidth = window.innerWidth;
      const distance = Math.max(0, trackWidth - viewWidth + 72);

      if (distance > 0) {
        gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance + 200}`,
            // Pin an inner wrapper instead of the <section> itself.
            // Pinning the React-managed <section> can cause DOM exceptions when React inserts
            // new siblings above/below it (e.g. when a trending click loads a movie).
            pin: filmstrip,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [allFrames.length]);

  return (
    <section className="filmstrip-section" id="filmstrip" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono" style={{ background: "var(--yellow)", color: "var(--ink)" }}>
          // NOW SHOWING
        </span>
        <h2 className="section-title">
          Eight reels of
          <br />
          <span className="accent">pure bliss</span>.
        </h2>
        <p className="section-sub">
          {frames
            ? "Live from TMDb — what's actually in cinemas this week. Click a frame to dig in."
            : "Scroll through this week's lineup — pinned for you, just like the marquee outside."}
        </p>
      </div>
      <div className="filmstrip" ref={filmstripRef}>
        <div className="filmstrip-track" ref={trackRef}>
          {allFrames.map((f, i) => {
            const c = FILMSTRIP_COLORS[i % FILMSTRIP_COLORS.length];
            const clickable = !!(onFrameClick && f.tmdbId);
            return (
              <div
                key={`${f.num}-${i}`}
                className="frame"
                style={
                  f.poster
                    ? {
                        backgroundImage: `linear-gradient(rgba(26,26,46,0.25), rgba(26,26,46,0.55)), url(${f.poster})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: clickable ? "pointer" : "default",
                      }
                    : {
                        background: `linear-gradient(135deg, ${c[0]}, ${c[1]})`,
                        cursor: clickable ? "pointer" : "default",
                      }
                }
                onClick={() => {
                  if (clickable) onFrameClick!(f.tmdbId!, f.title);
                }}
              >
                <span className="frame-num mono">FRAME · {f.num}</span>
                <div className="frame-title display">{f.title}</div>
                <div className="frame-meta mono">{f.meta}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
