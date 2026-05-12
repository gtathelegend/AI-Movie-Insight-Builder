"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReviewCluster } from "@/types/ai";
import { MOCK_CLUSTERS } from "./data";

type ClusterSectionProps = {
  clusters?: ReviewCluster[] | null;
};

export default function ClusterSection({ clusters }: ClusterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = clusters && clusters.length > 0 ? clusters : MOCK_CLUSTERS;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-cluster]").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.from(card, { y: 50, opacity: 0, duration: 0.55, ease: "back.out(1.2)" });
            const fill = card.querySelector<HTMLElement>(".cluster-bar-fill");
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
    <section className="clusters" id="clusters" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">// AUDIENCE CLUSTERS</span>
        <h2 className="section-title">
          What they <span className="accent">said</span>.
        </h2>
        <p className="section-sub">
          {clusters
            ? "AI-grouped audience opinion clusters from real review language."
            : "Reviews grouped by the distinct narrative each audience faction tells."}
        </p>
        <div className="cluster-grid">
          {data.map((cluster, i) => (
            <div key={i} className="cluster-card" data-cluster>
              <div className="cluster-pct">{Math.round(cluster.percentage)}%</div>
              <div className="cluster-label display">{cluster.label}</div>
              <p className="cluster-rep">"{cluster.representative}"</p>
              <div className="cluster-bar">
                <div
                  className="cluster-bar-fill"
                  data-pct={cluster.percentage}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
