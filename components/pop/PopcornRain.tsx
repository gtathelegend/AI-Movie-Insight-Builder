"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PopcornRainProps = {
  enabled?: boolean;
};

export default function PopcornRain({ enabled = true }: PopcornRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function spawnKernel() {
    const container = containerRef.current;
    if (!container) return;
    const k = document.createElement("div");
    k.className = "kernel";
    k.textContent = Math.random() > 0.4 ? "🍿" : "🌽";
    k.style.left = Math.random() * 100 + "%";
    k.style.top = "-30px";
    k.style.fontSize = 16 + Math.random() * 16 + "px";
    k.style.position = "absolute";
    container.appendChild(k);

    gsap.to(k, {
      y: window.innerHeight + 50,
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720 - 360,
      duration: 4 + Math.random() * 3,
      ease: "power1.in",
      onComplete: () => k.remove(),
    });
  }

  function burst(n: number) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => spawnKernel(), i * 30);
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
    }, 280);

    const bursts = ["#detail", "#breakdown", "#comments"].map((sel) =>
      ScrollTrigger.create({
        trigger: sel,
        start: "top 60%",
        onEnter: () => burst(25),
        once: true,
      })
    );

    return () => {
      trendingTrigger.kill();
      bursts.forEach((t) => t.kill());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;

  return <div id="popcorn-rain" ref={containerRef} />;
}
