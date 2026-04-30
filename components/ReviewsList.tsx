import { motion } from "framer-motion";

type ReviewsListProps = {
  reviews: string[];
};

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">Audience Reviews</h3>
        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
          {reviews.length} reviews
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((review, index) => (
          <article
            key={`${index}-${review.slice(0, 40)}`}
            className="relative overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 p-5 transition hover:border-zinc-200 hover:bg-white"
          >
            <span className="pointer-events-none absolute -left-1 -top-2 select-none font-serif text-7xl leading-none text-zinc-100">
              &ldquo;
            </span>
            <span className="absolute right-4 top-3 font-mono text-xs text-zinc-300">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <p className="relative text-sm leading-relaxed text-zinc-600">{review}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
