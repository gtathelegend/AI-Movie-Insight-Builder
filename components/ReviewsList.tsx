"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ReviewsListProps = {
  reviews: string[];
};

const PREVIEW_COUNT = 6;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
      delay: Math.min(i * 0.05, 0.3),
    },
  }),
};

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const hasMore = reviews.length > PREVIEW_COUNT;

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 sm:px-8">
        <h3 className="text-sm font-semibold text-zinc-900">Audience Reviews</h3>
        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
          {reviews.length} reviews
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-px bg-zinc-100 md:grid-cols-2">
        {visible.map((review, index) => (
          <motion.article
            key={`${index}-${review.slice(0, 40)}`}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="group relative overflow-hidden bg-white p-6 transition hover:bg-zinc-50 sm:p-7"
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
          </motion.article>
        ))}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <div className="border-t border-zinc-100 px-6 py-4 sm:px-8">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-semibold text-zinc-400 transition hover:text-zinc-700"
          >
            {showAll
              ? "Show fewer reviews"
              : `Show all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </section>
  );
}
