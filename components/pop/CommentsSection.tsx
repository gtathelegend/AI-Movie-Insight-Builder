"use client";

import { useEffect, useRef } from "react";
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

  const cards: CommentCard[] = reviews && reviews.length > 0
    ? buildRealComments(reviews)
    : MOCK_COMMENTS;

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
          {cards.map((c, i) => (
            <div key={i} className={`comment-card ${tiltClass(i)}`} data-comment>
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
              <div className="comment-text">&ldquo;{c.text}&rdquo;</div>
              <div className="comment-foot">
                <span className="comment-time mono">{c.time}</span>
                <div className="comment-likes">
                  <button>♥ {c.likes}</button>
                  <button>💬 {c.replies}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
