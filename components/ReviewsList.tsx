"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

type ReviewsListProps = {
  reviews: string[];
};

const PREVIEW_COUNT = 6;

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const visible = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const hasMore = reviews.length > PREVIEW_COUNT;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".review-card",
        { y: 26, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          duration: 0.46,
          ease: "power2.out",
          delay: 0.05,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 sm:px-8">
        <h3 className="text-sm font-semibold text-zinc-900">Audience Reviews</h3>
        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
          {reviews.length} reviews
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-px bg-zinc-100 md:grid-cols-1">
        {visible.map((review, index) => (
          <article
            key={`${index}-${review.slice(0, 40)}`}
            className="review-card group relative overflow-hidden bg-white p-6 transition hover:bg-zinc-50 sm:p-7"
          >
            {/* Large decorative quote */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-1 -top-4 select-none font-serif text-9xl leading-none text-zinc-100 transition-colors group-hover:text-zinc-150"
            >
              &ldquo;
            </div>

            {/* Review index */}
            <div className="relative mb-3 flex items-center gap-2">
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>

            {/* Review text */}
            <p className="relative line-clamp-5 text-sm leading-relaxed text-zinc-600">{review}</p>
          </article>
        ))}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <div className="border-t border-zinc-100 px-6 py-4 sm:px-8">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-semibold text-zinc-400 transition hover:text-zinc-700"
          >
            {showAll ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </section>
  );
}
