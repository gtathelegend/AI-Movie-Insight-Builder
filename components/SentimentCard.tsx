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
  const optionalInsights = insights as AnalyzeResponse & {
    keyThemes?: string[];
    pros?: string[];
    cons?: string[];
  };

  const keyThemes = Array.isArray(optionalInsights.keyThemes) ? optionalInsights.keyThemes : [];
  const pros = Array.isArray(optionalInsights.pros) ? optionalInsights.pros : [];
  const cons = Array.isArray(optionalInsights.cons) ? optionalInsights.cons : [];

  const normalized = ((insights.sentimentScore + 1) / 2) * 100;
  const progress = Math.max(0, Math.min(100, normalized));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-md sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">AI Sentiment Insight</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeStyles[insights.classification]}`}>
          {insights.classification}
        </span>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">AI Summary</h4>
        <p className="text-base leading-relaxed text-slate-700">{insights.summary}</p>
      </section>

      <section className="mb-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Key Themes</h4>
        <div className="flex flex-wrap gap-2">
          {keyThemes.length > 0 ? (
            keyThemes.map((theme) => (
              <span key={theme} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                {theme}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">Theme extraction is unavailable for this response format.</span>
          )}
        </div>
      </section>

      <section className="mb-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">Pros</h4>
          {pros.length > 0 ? (
            <ul className="space-y-1 text-sm text-slate-700">
              {pros.map((item) => (
                <li key={item}>
                  <span className="text-emerald-600">•</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Pros are unavailable for this response format.</p>
          )}
        </div>

        <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-700">Cons</h4>
          {cons.length > 0 ? (
            <ul className="space-y-1 text-sm text-slate-700">
              {cons.map((item) => (
                <li key={item}>
                  <span className="text-rose-600">•</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Cons are unavailable for this response format.</p>
          )}
        </div>
      </section>

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
