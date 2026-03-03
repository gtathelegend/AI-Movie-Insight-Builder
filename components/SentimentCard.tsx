import type { AnalyzeResponse } from "@/types/ai";

type SentimentCardProps = {
  insights: AnalyzeResponse;
};

const badgeStyles: Record<AnalyzeResponse["classification"], string> = {
  positive: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  mixed: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  negative: "bg-rose-500/20 text-rose-300 border-rose-400/40",
};

export default function SentimentCard({ insights }: SentimentCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white">Audience Insight</h3>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeStyles[insights.classification]}`}>
          {insights.classification}
        </span>
      </div>

      <p className="mb-4 text-sm leading-6 text-zinc-200">{insights.summary}</p>

      <div className="mb-4">
        <p className="mb-2 text-sm font-semibold text-zinc-100">Key Themes</p>
        <div className="flex flex-wrap gap-2">
          {insights.keyThemes.map((theme) => (
            <span key={theme} className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">
              {theme}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-emerald-300">Pros</p>
          <ul className="space-y-1 text-sm text-zinc-200">
            {insights.pros.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-rose-300">Cons</p>
          <ul className="space-y-1 text-sm text-zinc-200">
            {insights.cons.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 text-sm text-zinc-300">
        Sentiment score: <span className="font-semibold text-white">{insights.sentimentScore.toFixed(2)}</span>
      </div>
    </section>
  );
}
