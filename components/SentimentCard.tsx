import type { AnalyzeResponse } from "@/types/ai";
import { motion } from "framer-motion";

type SentimentCardProps = {
  insights: AnalyzeResponse;
};

const badgeStyles: Record<AnalyzeResponse["classification"], string> = {
  positive: "bg-green-100 text-green-700",
  mixed: "bg-yellow-100 text-yellow-700",
  negative: "bg-red-100 text-red-700",
};

export default function SentimentCard({ insights }: SentimentCardProps) {
  const normalized = ((insights.sentimentScore + 1) / 2) * 100;
  const progress = Math.max(0, Math.min(100, normalized));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-medium text-slate-900">Audience Insight</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeStyles[insights.classification]}`}>
          {insights.classification}
        </span>
      </div>

      <p className="mb-6 text-base leading-relaxed text-slate-600">{insights.summary}</p>

      <div className="mt-6 space-y-2">
        <div className="text-sm text-slate-600">
          Sentiment score: <span className="font-medium text-slate-900">{insights.sentimentScore.toFixed(2)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.section>
  );
}
