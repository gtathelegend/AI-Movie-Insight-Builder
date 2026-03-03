import { motion } from "framer-motion";

type ReviewsListProps = {
  reviews: string[];
};

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-xl font-medium text-slate-900">Extracted Audience Reviews</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {reviews.length} reviews
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((review, index) => (
          <article key={`${index}-${review.slice(0, 40)}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">{review}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
