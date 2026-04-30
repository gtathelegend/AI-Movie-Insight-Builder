import type { AnalyzeResponse } from "@/types/ai";
import { motion } from "framer-motion";

type SentimentCardProps = {
  insights: AnalyzeResponse;
};

const badgeDot: Record<AnalyzeResponse["classification"], string> = {
  positive: "bg-emerald-500",
  mixed: "bg-amber-500",
  negative: "bg-rose-500",
};

const badgeText: Record<AnalyzeResponse["classification"], string> = {
  positive: "text-emerald-700",
  mixed: "text-amber-700",
  negative: "text-rose-600",
};

const panelVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

function scoreLabel(score: number): string {
  if (score >= 0.7) return "Highly positive";
  if (score >= 0.3) return "Positive";
  if (score >= -0.3) return "Mixed";
  if (score >= -0.7) return "Negative";
  return "Highly negative";
}

export default function SentimentCard({ insights }: SentimentCardProps) {
  const normalized = ((insights.sentimentScore + 1) / 2) * 100;
  const progress = Math.max(0, Math.min(100, normalized));

  return (
    <motion.section
      variants={panelVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 sm:p-8"
    >
      {/* Header */}
      <motion.div variants={childVariants} className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">AI Sentiment Insight</h3>
        <span className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${badgeText[insights.classification]}`}>
          <span className={`inline-block h-2 w-2 rounded-full ${badgeDot[insights.classification]}`} />
          {insights.classification}
        </span>
      </motion.div>

      {/* Summary */}
      <motion.section variants={childVariants} className="mb-6 border-l-2 border-zinc-200 pl-4">
        <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">Summary</h4>
        <p className="text-sm leading-relaxed text-zinc-700">{insights.summary}</p>
      </motion.section>

      {/* Key Themes */}
      <motion.section variants={childVariants} className="mb-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Key Themes</h4>
        <div className="flex flex-wrap gap-1.5">
          {insights.keyThemes.length > 0 ? (
            insights.keyThemes.map((theme) => (
              <span key={theme} className="rounded-lg bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                {theme}
              </span>
            ))
          ) : (
            <span className="text-xs text-zinc-400">No strong recurring themes detected.</span>
          )}
        </div>
      </motion.section>

      {/* Pros / Cons */}
      <motion.section variants={childVariants} className="mb-6 grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Pros</h4>
          {insights.pros.length > 0 ? (
            <ul className="space-y-1.5">
              {insights.pros.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-400">No major positive patterns detected.</p>
          )}
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Cons</h4>
          {insights.cons.length > 0 ? (
            <ul className="space-y-1.5">
              {insights.cons.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="mt-0.5 shrink-0 text-rose-500">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-400">No major negative patterns detected.</p>
          )}
        </div>
      </motion.section>

      {/* Sentiment Score */}
      <motion.div variants={childVariants} className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Sentiment score</span>
          <span className="font-medium text-zinc-900">
            {insights.sentimentScore.toFixed(2)} · {scoreLabel(insights.sentimentScore)}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #f87171, #fbbf24, #34d399)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-300">
          <span>Negative</span>
          <span>Positive</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
