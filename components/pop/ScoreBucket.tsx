"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ScoreBucketProps = {
  score: number;
  label?: string;
};

function addKernelsToDom(group: SVGGElement, targetScore: number) {
  // Clear existing
  while (group.firstChild) group.removeChild(group.firstChild);

  const ns = "http://www.w3.org/2000/svg";
  const count = Math.round(targetScore * 60);

  for (let i = 0; i < count; i++) {
    const x = 45 + Math.random() * 110;
    const yBase = 205 - (i / count) * 130;
    const y = yBase + (Math.random() - 0.5) * 12;
    const r = 4 + Math.random() * 3;
    const fill = Math.random() > 0.3 ? "#FFD23F" : "#FFF8E7";

    const k = document.createElementNS(ns, "circle");
    k.setAttribute("cx", String(x));
    k.setAttribute("cy", String(y));
    k.setAttribute("r", String(r));
    k.setAttribute("fill", fill);
    k.setAttribute("stroke", "#1A1A2E");
    k.setAttribute("stroke-width", "1.5");
    k.classList.add("k-body");
    k.style.opacity = "0";
    group.appendChild(k);
  }

  // Top fluffy popcorn
  for (let i = 0; i < 12; i++) {
    const cx = 50 + (i / 12) * 100 + (Math.random() - 0.5) * 8;
    const cy = 60 + Math.random() * 12;
    const r = 7 + Math.random() * 4;

    const k = document.createElementNS(ns, "circle");
    k.setAttribute("cx", String(cx));
    k.setAttribute("cy", String(cy));
    k.setAttribute("r", String(r));
    k.setAttribute("fill", "#FFF8E7");
    k.setAttribute("stroke", "#1A1A2E");
    k.setAttribute("stroke-width", "2");
    k.classList.add("k-top");
    k.style.opacity = "0";
    group.appendChild(k);
  }
}

export default function ScoreBucket({ score, label = "★ EXTRA BUTTER WORTHY ★" }: ScoreBucketProps) {
  const fillRef = useRef<SVGRectElement>(null);
  const kernelGroupRef = useRef<SVGGElement>(null);
  const scoreTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fillRect = fillRef.current;
    const kernelGroup = kernelGroupRef.current;
    const scoreText = scoreTextRef.current;
    if (!fillRect || !kernelGroup || !scoreText) return;

    // Build kernels into DOM (avoids SSR hydration mismatch)
    addKernelsToDom(kernelGroup, score);

    // Animate fill rising
    gsap.fromTo(
      fillRect,
      { attr: { y: 210, height: 0 } },
      { attr: { y: 210 - score * 140, height: score * 140 }, duration: 1.4, ease: "power2.out" }
    );

    // Pop kernels in
    const bodies = kernelGroup.querySelectorAll<SVGCircleElement>(".k-body");
    const tops = kernelGroup.querySelectorAll<SVGCircleElement>(".k-top");

    gsap.to(bodies, { opacity: 1, duration: 0.05, stagger: { each: 0.025, from: "random" }, delay: 0.3 });
    gsap.fromTo(
      tops,
      { opacity: 0, scale: 0, transformOrigin: "center" },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: "back.out(2)", delay: 1.0 }
    );

    // Count-up number — render as 0–100 integer
    const obj = { v: 0 };
    gsap.to(obj, {
      v: score * 100,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => { if (scoreText) scoreText.textContent = String(Math.round(obj.v)); },
    });
  }, [score]);

  return (
    <div className="score-card">
      <div className="score-label mono">VIEWER SCORE</div>
      <div className="bucket">
        <svg className="bucket-svg" viewBox="0 0 200 220">
          <defs>
            <clipPath id="bucketClip">
              <path d="M40 70 L52 200 Q52 210 62 210 L138 210 Q148 210 148 200 L160 70 Z" />
            </clipPath>
          </defs>
          {/* Bucket stripes background */}
          <path d="M40 70 L52 200 Q52 210 62 210 L138 210 Q148 210 148 200 L160 70 Z" fill="#FFF" />
          <g clipPath="url(#bucketClip)">
            <rect x="40" y="70" width="20" height="140" fill="#FF3D7F" />
            <rect x="80" y="70" width="20" height="140" fill="#FF3D7F" />
            <rect x="120" y="70" width="20" height="140" fill="#FF3D7F" />
            <rect x="160" y="70" width="20" height="140" fill="#FF3D7F" />
            {/* Fill level — animated via GSAP */}
            <rect ref={fillRef} x="40" y="210" width="120" height="0" fill="rgba(255,210,63,0.35)" />
          </g>
          {/* Bucket outline */}
          <path
            d="M40 70 L52 200 Q52 210 62 210 L138 210 Q148 210 148 200 L160 70 Z"
            fill="none"
            stroke="#1A1A2E"
            strokeWidth="4"
          />
          {/* Kernels — populated by useEffect to avoid hydration mismatch */}
          <g ref={kernelGroupRef} />
        </svg>
      </div>
      <div className="score-num display">
        <span ref={scoreTextRef}>0</span>
        <span className="denom">/100</span>
      </div>
      <div className="score-tagline mono">{label}</div>
    </div>
  );
}
