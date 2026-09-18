"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { AnalyzeResponse } from "@/types/ai";

type AiSpotlightPanelProps = {
  insights: AnalyzeResponse;
};

export default function AiSpotlightPanel({ insights }: AiSpotlightPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const targetScore = Math.round(((insights.sentimentScore + 1) / 2) * 100);

  const [animatedScore, setAnimatedScore] = useState(() => (shouldReduceMotion ? targetScore : 0));
  const [animatedRawScore, setAnimatedRawScore] = useState(() => (shouldReduceMotion ? insights.sentimentScore : 0));
  const [badgeVisible, setBadgeVisible] = useState(() => Boolean(shouldReduceMotion));
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const scorePct = Math.round(((insights.sentimentScore + 1) / 2) * 100);
    const rawTarget = insights.sentimentScore;

    if (shouldReduceMotion) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setAnimatedScore(scorePct);
        setAnimatedRawScore(rawTarget);
        setBadgeVisible(true);
      });
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }

    const startTime = performance.now();
    const duration = 850; // ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeProgress * scorePct);
      const currentRaw = Number((easeProgress * rawTarget).toFixed(2));

      setAnimatedScore(currentVal);
      setAnimatedRawScore(currentRaw);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setBadgeVisible(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [insights.sentimentScore, shouldReduceMotion]);

  const classificationClass =
    insights.classification === "positive"
      ? "positive"
      : insights.classification === "negative"
      ? "negative"
      : "mixed";

  const classificationLabel =
    insights.classification === "positive"
      ? "AI SENTIMENT: POSITIVE"
      : insights.classification === "negative"
      ? "AI SENTIMENT: NEGATIVE"
      : "AI SENTIMENT: MIXED";

  const displayRawScore = `${animatedRawScore >= 0 ? "+" : ""}${animatedRawScore.toFixed(2)}`;

  const staggerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  // Marker position on spectrum: -1.0 -> 0%, 0.0 -> 50%, +1.0 -> 100%
  const markerLeftPct = shouldReduceMotion ? targetScore : animatedScore;

  return (
    <motion.div
      className="ai-spotlight-panel"
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {/* 1. Header & Overall Sentiment */}
      <motion.div
        className="ai-spotlight-top"
        custom={0.1}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
      >
        <div className="ai-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span className="tag-ai-synthesis">✦ AI AUDIENCE INSIGHT</span>
          </div>
          <h3 className="ai-spotlight-title">Audience Intelligence</h3>
          
          {badgeVisible && (
            <motion.div
              className={`ai-badge ${classificationClass}`}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ marginTop: 10 }}
            >
              <span style={{ fontSize: 10 }}>●</span>
              <span>{classificationLabel}</span>
            </motion.div>
          )}
        </div>

        <div className="ai-score-block">
          <div className="ai-score-value">{displayRawScore}</div>
          <div className="ai-score-denom mono">{animatedScore} / 100 VIEWER INDEX</div>
        </div>
      </motion.div>

      {/* Sentiment Spectrum Track (-1.0 to +1.0) */}
      <motion.div
        className="sentiment-spectrum-wrap"
        custom={0.15}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
      >
        <div className="sentiment-spectrum-header">
          <span>SENTIMENT SPECTRUM</span>
          <span className="mono" style={{ color: "var(--ink)", fontWeight: 800 }}>
            {displayRawScore}
          </span>
        </div>
        <div className="sentiment-spectrum-track" role="progressbar" aria-valuenow={animatedScore} aria-valuemin={0} aria-valuemax={100} aria-label="Audience sentiment spectrum gauge">
          <div className="sentiment-spectrum-center-mark" title="Neutral (0.0)" />
          <div
            className="sentiment-marker-pin"
            style={{ left: `${markerLeftPct}%` }}
            title={`Score: ${displayRawScore}`}
          />
        </div>
        <div className="sentiment-spectrum-labels">
          <span>-1.0 NEGATIVE</span>
          <span style={{ textAlign: "center" }}>0.0 MIXED</span>
          <span style={{ textAlign: "right" }}>+1.0 POSITIVE</span>
        </div>
      </motion.div>

      {/* 2. AI Summary */}
      <motion.div
        className="ai-summary-card"
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--pink-deep)", fontWeight: 800 }}>
            AI AUDIENCE SUMMARY
          </span>
          <span className="tag-ai-synthesis" style={{ fontSize: 9 }}>AI SYNTHESIS</span>
        </div>
        <p>{insights.summary || "Audience reception analyzed across public viewer reviews."}</p>
      </motion.div>

      {/* 3. Audience Signals (Key Themes) */}
      <motion.div
        className="ai-themes-wrap"
        custom={0.3}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
      >
        <div className="ai-section-subtitle">AUDIENCE SIGNALS · KEY THEMES</div>
        <div className="ai-themes-list">
          {insights.keyThemes && insights.keyThemes.length > 0 ? (
            insights.keyThemes.map((theme, i) => (
              <span key={i} className="ai-theme-tag">
                [ {theme} ]
              </span>
            ))
          ) : (
            <span style={{ fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic" }}>
              No recurring themes identified.
            </span>
          )}
        </div>
      </motion.div>

      {/* 4. Pros & Cons */}
      <motion.div
        className="ai-pros-cons-grid"
        custom={0.4}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
      >
        <div className="ai-pros-box">
          <div className="ai-box-title pros">
            <span>✓</span> WHAT AUDIENCES LIKED
          </div>
          <ul className="ai-points-list">
            {insights.pros && insights.pros.length > 0 ? (
              insights.pros.slice(0, 3).map((pro, i) => (
                <li key={i} className="ai-point-item">
                  <span style={{ color: "#059669", fontWeight: 800 }}>✓</span>
                  <span>{pro}</span>
                </li>
              ))
            ) : (
              <li className="ai-point-item" style={{ color: "#666" }}>
                No clear positive pattern identified.
              </li>
            )}
          </ul>
        </div>

        <div className="ai-cons-box">
          <div className="ai-box-title cons">
            <span>×</span> WHAT AUDIENCES DISLIKED
          </div>
          <ul className="ai-points-list">
            {insights.cons && insights.cons.length > 0 ? (
              insights.cons.slice(0, 3).map((con, i) => (
                <li key={i} className="ai-point-item">
                  <span style={{ color: "#DC2626", fontWeight: 800 }}>×</span>
                  <span>{con}</span>
                </li>
              ))
            ) : (
              <li className="ai-point-item" style={{ color: "#666" }}>
                No clear negative pattern identified.
              </li>
            )}
          </ul>
        </div>
      </motion.div>

      {/* 5. Review Analysis Statistics & Sources */}
      <motion.div
        className="ai-meta-footer"
        custom={0.5}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
      >
        <span>
          Analyzed: <b>{insights.analyzedCount ?? (insights.collectedCount ? Math.min(insights.collectedCount, 10) : 1)}</b> of <b>{insights.collectedCount ?? 1}</b> collected reviews
        </span>
        <span>
          Sources: <b>{insights.sources?.map((s) => (s === "tmdb" ? "TMDb" : "IMDb")).join(" + ") ?? "TMDb / IMDb"}</b>
        </span>
      </motion.div>
    </motion.div>
  );
}
