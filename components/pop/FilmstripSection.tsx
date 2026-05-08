"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FILMSTRIP, FILMSTRIP_COLORS } from "./data";

export default function FilmstripSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const allFrames = [...FILMSTRIP, ...FILMSTRIP];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

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
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
          Scroll through this week&rsquo;s lineup — pinned for you, just like the marquee outside.
        </p>
      </div>
      <div className="filmstrip">
        <div className="filmstrip-track" ref={trackRef}>
          {allFrames.map((f, i) => {
            const c = FILMSTRIP_COLORS[i % FILMSTRIP_COLORS.length];
            return (
              <div
                key={`${f.num}-${i}`}
                className="frame"
                style={{ background: `linear-gradient(135deg, ${c[0]}, ${c[1]})` }}
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
