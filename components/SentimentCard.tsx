import type { AnalyzeResponse } from "@/types/ai";
import { motion } from "framer-motion";

type SentimentCardProps = {
  insights: AnalyzeResponse;
};

const classificationConfig: Record<
  AnalyzeResponse["classification"],
  { dot: string; text: string; bg: string; border: string }
> = {
  positive: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  mixed: {
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  negative: {
    dot: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
};

const panelVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function scoreLabel(score: number): string {
  if (score >= 0.7) return "Highly positive";
  if (score >= 0.3) return "Positive";
  if (score >= -0.3) return "Mixed response";
  if (score >= -0.7) return "Negative";
  return "Highly negative";
}

export default function SentimentCard({ insights }: SentimentCardProps) {
  const cfg = classificationConfig[insights.classification];
  const normalized = ((insights.sentimentScore + 1) / 2) * 100;
  const progress = Math.max(0, Math.min(100, normalized));

  return (
    <motion.section
      variants={panelVariants}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col rounded-2xl border border-zinc-100 bg-white shadow-sm"
    >
      {/* Card header */}
      <div className="border-b border-zinc-100 px-6 py-4 sm:px-8">
        <h3 className="text-sm font-semibold text-zinc-900">AI Sentiment Insight</h3>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Score hero block */}
        <motion.div
          variants={childVariants}
          className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>
                  {insights.classification}
                </span>
              </div>
              <div className="text-4xl font-bold tracking-tight text-zinc-900">
                {insights.sentimentScore.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-zinc-400">{scoreLabel(insights.sentimentScore)}</div>
            </div>
            <div className="text-right text-xs text-zinc-300">
              <div>out of</div>
              <div className="font-medium">1.00</div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #f87171, #fbbf24, #34d399)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-300">
              <span>Negative</span>
              <span>Positive</span>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div variants={childVariants} className="border-l-2 border-zinc-200 pl-4">
          <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Summary
          </h4>
          <p className="text-sm leading-relaxed text-zinc-700">{insights.summary}</p>
        </motion.div>

        {/* Key Themes */}
        <motion.div variants={childVariants}>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Key Themes
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {insights.keyThemes.length > 0 ? (
              insights.keyThemes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
                >
                  {theme}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400">No recurring themes detected.</span>
            )}
          </div>
        </motion.div>

        {/* Pros / Cons */}
        <motion.div
          variants={childVariants}
          className="grid gap-5 border-t border-zinc-100 pt-5 md:grid-cols-2"
        >
          <div>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Pros
            </h4>
            {insights.pros.length > 0 ? (
              <ul className="space-y-2">
                {insights.pros.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                    <span className="mt-px shrink-0 text-xs font-bold text-emerald-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-400">No major positives detected.</p>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Cons
            </h4>
            {insights.cons.length > 0 ? (
              <ul className="space-y-2">
                {insights.cons.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                    <span className="mt-px shrink-0 text-xs font-bold text-rose-400">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-400">No major negatives detected.</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
