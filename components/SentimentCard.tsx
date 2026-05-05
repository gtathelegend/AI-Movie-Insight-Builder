import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { AnalyzeResponse } from "@/types/ai";

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

function scoreLabel(score: number): string {
  if (score >= 0.7) return "Highly positive";
  if (score >= 0.3) return "Positive";
  if (score >= -0.3) return "Mixed response";
  if (score >= -0.7) return "Negative";
  return "Highly negative";
}

export default function SentimentCard({ insights }: SentimentCardProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cfg = classificationConfig[insights.classification];
  const normalized = ((insights.sentimentScore + 1) / 2) * 100;
  const progress = Math.max(0, Math.min(100, normalized));

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(".sc-header",
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.42 }
      )
      .fromTo(".sc-score-block",
        { scale: 0.93, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.52 },
        "<0.1"
      )
      .fromTo(".sc-progress",
        { width: "0%" },
        { width: `${progress}%`, duration: 0.9, ease: "power2.inOut" },
        "<0.18"
      )
      .fromTo(".sc-summary",
        { x: -12, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.46 },
        "<0.45"
      )
      .fromTo(".sc-theme-chip",
        { scale: 0.78, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.055, duration: 0.34 },
        "<0.1"
      )
      .fromTo([".sc-pros", ".sc-cons"],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.46 },
        "<0.1"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      className="flex h-full flex-col rounded-2xl border border-zinc-100 bg-white shadow-sm"
    >
      {/* Card header */}
      <div className="sc-header border-b border-zinc-100 px-6 py-4 sm:px-8">
        <h3 className="text-sm font-semibold text-zinc-900">AI Sentiment Insight</h3>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Score hero block */}
        <div className={`sc-score-block rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
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
              <div
                className="sc-progress h-full rounded-full"
                style={{
                  background: "linear-gradient(to right, #f87171, #fbbf24, #34d399)",
                  width: 0,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-300">
              <span>Negative</span>
              <span>Positive</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="sc-summary border-l-2 border-zinc-200 pl-4">
          <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Summary
          </h4>
          <p className="text-sm leading-relaxed text-zinc-700">{insights.summary}</p>
        </div>

        {/* Key Themes */}
        <div>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Key Themes
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {insights.keyThemes.length > 0 ? (
              insights.keyThemes.map((theme) => (
                <span
                  key={theme}
                  className="sc-theme-chip rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
                >
                  {theme}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400">No recurring themes detected.</span>
            )}
          </div>
        </div>

        {/* Pros / Cons */}
        <div className="grid gap-5 border-t border-zinc-100 pt-5 md:grid-cols-2">
          <div className="sc-pros">
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

          <div className="sc-cons">
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
        </div>
      </div>
    </section>
  );
}
