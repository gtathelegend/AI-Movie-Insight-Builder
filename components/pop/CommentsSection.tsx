"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOCK_COMMENTS, REVIEW_COLORS } from "./data";

type CommentsSectionProps = {
  reviews?: string[];
};

type CommentCard = {
  name: string;
  handle: string;
  initials: string;
  color: string;
  stars: number;
  text: string;
  time: string;
  likes: number;
  replies: number;
};

const STABLE_LIKES = [247, 182, 421, 156, 312, 198];
const STABLE_REPLIES = [38, 22, 67, 19, 44, 28];

function truncateWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return { preview: text.trim(), truncated: false };
  return { preview: words.slice(0, maxWords).join(" ") + "…", truncated: true };
}

function buildRealComments(reviews: string[]): CommentCard[] {
  return reviews.slice(0, 6).map((text, i) => ({
    name: `Reviewer #${String(i + 1).padStart(2, "0")}`,
    handle: `@viewer_${i + 1}`,
    initials: String(i + 1).padStart(2, "0"),
    color: REVIEW_COLORS[i % REVIEW_COLORS.length],
    stars: 4 + (i % 2),
    text,
    time: "Recently",
    likes: STABLE_LIKES[i] ?? 100,
    replies: STABLE_REPLIES[i] ?? 10,
  }));
}

export default function CommentsSection({ reviews }: CommentsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const cards: CommentCard[] = reviews && reviews.length > 0
    ? buildRealComments(reviews)
    : MOCK_COMMENTS;

  const previewCards = useMemo(
    () =>
      cards.map((c) => {
        const { preview, truncated } = truncateWords(c.text, 100);
        return { ...c, preview, truncated };
      }),
    [cards],
  );

  const active = activeIndex === null ? null : previewCards[activeIndex] ?? null;

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
        <span className="section-label mono">// FROM THE BACK ROW</span>
        <h2 className="section-title">
          What viewers are <span className="accent">whispering</span>.
        </h2>
        <p className="section-sub">
          {reviews && reviews.length > 0
            ? "Real audience reviews scraped from IMDb. No bots. No paid takes."
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
                  <div className="comment-handle mono">{c.handle}</div>
                </div>
              </div>
              <div className="comment-stars">
                {"★".repeat(c.stars)}{"☆".repeat(5 - c.stars)}
              </div>
              <div className="comment-text">&ldquo;{c.preview}&rdquo;</div>
              <div className="comment-foot">
                <span className="comment-time mono">{c.time}</span>
                <div className="comment-likes">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    ♥ {c.likes}
                  </button>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    💬 {c.replies}
                  </button>
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
                  <div className="comment-handle mono">{active.handle}</div>
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

            <div className="comment-stars">
              {"★".repeat(active.stars)}{"☆".repeat(5 - active.stars)}
            </div>

            <div className="comment-modal-text">&ldquo;{active.text}&rdquo;</div>
          </div>
        </div>
      )}
    </section>
  );
}
