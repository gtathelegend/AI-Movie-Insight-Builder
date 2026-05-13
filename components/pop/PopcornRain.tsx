"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PopcornRainProps = {
  enabled?: boolean;
  hasMovie?: boolean;
};

export default function PopcornRain({ enabled = true, hasMovie = false }: PopcornRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function spawnKernel() {
    const container = containerRef.current;
    if (!container) return;
    const k = document.createElement("div");
    k.className = "kernel";
    k.textContent = Math.random() > 0.25 ? "🍿" : "🌽";
    k.style.left = Math.random() * 100 + "%";
    k.style.top = "-30px";
    k.style.fontSize = 14 + Math.random() * 10 + "px";
    k.style.opacity = "0.7";
    k.style.position = "absolute";
    container.appendChild(k);

    gsap.to(k, {
      y: window.innerHeight + 50,
      x: (Math.random() - 0.5) * 160,
      rotation: Math.random() * 540 - 270,
      duration: 5 + Math.random() * 3,
      ease: "power1.in",
      onComplete: () => k.remove(),
    });
  }

  function burst(n: number) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => spawnKernel(), i * 60);
    }
  }

  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const trendingTrigger = ScrollTrigger.create({
      trigger: "#trending",
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => { activeRef.current = self.isActive; },
    });

    intervalRef.current = setInterval(() => {
      if (activeRef.current) spawnKernel();
    }, 900);

    const burstSelectors = hasMovie ? ["#detail", "#comments"] : [];
    const bursts = burstSelectors
      .map((sel) => {
        // Avoid creating ScrollTriggers for elements that don't exist yet.
        if (!document.querySelector(sel)) return null;
        return ScrollTrigger.create({
          trigger: sel,
          start: "top 60%",
          onEnter: () => burst(8),
          once: true,
        });
      })
      .filter((t): t is ScrollTrigger => t !== null);

    if (hasMovie && bursts.length) {
      // New sections just mounted; let ScrollTrigger re-measure now.
      ScrollTrigger.refresh();
    }

    return () => {
      trendingTrigger.kill();
      bursts.forEach((t) => t.kill());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, hasMovie]);

  if (!enabled) return null;

  return <div id="popcorn-rain" ref={containerRef} />;
}
