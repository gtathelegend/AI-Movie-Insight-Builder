"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReviewCluster } from "@/types/ai";
import { MOCK_CLUSTERS } from "./data";

type ClusterSectionProps = {
  clusters?: ReviewCluster[] | null;
};

export default function ClusterSection({ clusters }: ClusterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="section-label mono">{"// OPINION CLUSTERS"}</span>
          <span className="tag-ai-synthesis">AI CLUSTER ANALYSIS</span>
        </div>
        <h2 className="section-title">
          Audience Opinion <span className="accent">Clusters</span>.
        </h2>
        <p className="section-sub">
          {clusters
            ? "Distinct sentiment clusters and narrative factions extracted from audience review language."
            : "Reviews grouped by the distinct narrative each audience faction tells."}
        </p>

        <div className="cluster-grid">
          {data.map((cluster, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div
                key={i}
                className={`cluster-card ${isExpanded ? "is-expanded" : ""}`}
                data-cluster
                tabIndex={0}
                role="region"
                aria-label={`Cluster: ${cluster.label}`}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setExpandedIndex(isExpanded ? null : i);
                }}
              >
                <div className="cluster-pct">{Math.round(cluster.percentage)}%</div>
                <div style={{ marginBottom: 8 }}>
                  <span className="tag-audience-evidence" style={{ fontSize: 9 }}>AUDIENCE EVIDENCE</span>
                </div>
                <div className="cluster-label display">{cluster.label}</div>
                
                <p className="cluster-rep-quote">
                  &ldquo;{cluster.representative}&rdquo;
                </p>

                <span className="cluster-expand-hint mono">
                  {isExpanded ? "▲ Click to collapse" : "▼ Click to expand"}
                </span>

                <div className="cluster-bar">
                  <div
                    className="cluster-bar-fill"
                    data-pct={cluster.percentage}
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
