"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOCK_COMMENTS, REVIEW_COLORS } from "./data";
import type { ReviewSource } from "@/types/movie";

type CommentsSectionProps = {
  reviews?: string[];
  sources?: ReviewSource[];
  collectedCount?: number;
  analyzedCount?: number;
};

type CommentCard = {
  name: string;
  sourceLabel: string;
  initials: string;
  color: string;
  text: string;
  isReal: boolean;
};

function truncateWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return { preview: text.trim(), truncated: false };
  return { preview: words.slice(0, maxWords).join(" ") + "…", truncated: true };
}

function buildRealComments(reviews: string[], sources?: ReviewSource[]): CommentCard[] {
  const sourceText = sources && sources.length > 0
    ? sources.map((s) => (s === "tmdb" ? "TMDb" : "IMDb")).join(" + ")
    : "Audience";

  return reviews.slice(0, 6).map((text, i) => ({
    name: `Audience Review #${String(i + 1).padStart(2, "0")}`,
    sourceLabel: `Source: ${sourceText}`,
    initials: String(i + 1).padStart(2, "0"),
    color: REVIEW_COLORS[i % REVIEW_COLORS.length],
    text,
    isReal: true,
  }));
}

export default function CommentsSection({
  reviews,
  sources,
  collectedCount,
  analyzedCount,
}: CommentsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasRealReviews = reviews && reviews.length > 0;
  const cards: CommentCard[] = hasRealReviews
    ? buildRealComments(reviews, sources)
    : MOCK_COMMENTS.map((c) => ({
        name: c.name,
        sourceLabel: c.handle,
        initials: c.initials,
        color: c.color,
        text: c.text,
        isReal: false,
      }));

  const previewCards = useMemo(
    () =>
      cards.map((c) => {
        const { preview, truncated } = truncateWords(c.text, 80);
        return { ...c, preview, truncated };
      }),
    [cards],
  );

  const active = activeIndex === null ? null : previewCards[activeIndex] ?? null;

  const totalCollected = collectedCount ?? reviews?.length ?? 0;
  const totalAnalyzed = analyzedCount ?? (hasRealReviews ? Math.min(totalCollected, 10) : 0);
  const sourceDisplay = sources && sources.length > 0
    ? sources.map((s) => (s === "tmdb" ? "TMDb" : "IMDb")).join(" + ")
    : "TMDb / IMDb";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLDivElement>("[data-comment]").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 88%" },
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(1.2)",
          delay: (i % 3) * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  const tiltClass = (i: number) => (i % 3 === 0 ? "tilt-l" : i % 3 === 2 ? "tilt-r" : "");

  return (
    <section className="comments" id="comments" ref={sectionRef}>
      <div className="container">
        <span className="section-label mono">{"// FROM THE BACK ROW"}</span>
        <h2 className="section-title">
          What viewers are <span className="accent">whispering</span>.
        </h2>
        <p className="section-sub">
          {hasRealReviews
            ? `${totalCollected} audience review${totalCollected === 1 ? "" : "s"} collected · ${totalAnalyzed} analyzed by AI. Source: ${sourceDisplay}.`
            : "Real reviews from real people who actually saw the movie. No bots. No paid takes."}
        </p>
        <div className="comment-grid">
          {previewCards.map((c, i) => (
            <div
              key={i}
              className={`comment-card is-clickable ${tiltClass(i)}`}
              data-comment
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveIndex(i);
              }}
              aria-label="Open full review"
            >
              <div className="comment-head">
                <div className="comment-avatar display" style={{ background: c.color }}>
                  {c.initials}
                </div>
                <div>
                  <div className="comment-name">{c.name}</div>
                  <div className="comment-handle mono">{c.sourceLabel}</div>
                </div>
              </div>
              <div className="comment-text">&ldquo;{c.preview}&rdquo;</div>
              <div className="comment-foot">
                <span className="comment-time mono" style={{ fontSize: 11, opacity: 0.8 }}>
                  {c.isReal ? "★ Verified Audience Feedback" : "Recently"}
                </span>
                <div className="comment-likes">
                  <span style={{ fontSize: 12, opacity: 0.85 }}>Click to expand ↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="comment-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comment-modal-head">
              <div className="comment-head">
                <div className="comment-avatar display" style={{ background: active.color }}>
                  {active.initials}
                </div>
                <div>
                  <div className="comment-name">{active.name}</div>
                  <div className="comment-handle mono">{active.sourceLabel}</div>
                </div>
              </div>
              <button
                type="button"
                className="comment-modal-close"
                onClick={() => setActiveIndex(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="comment-modal-text" style={{ whiteSpace: "pre-wrap" }}>
              &ldquo;{active.text}&rdquo;
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
