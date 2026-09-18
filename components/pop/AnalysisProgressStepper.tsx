"use client";

type AnalysisProgressStepperProps = {
  currentStepMessage: string | null;
  hasMovie: boolean;
  hasReviews: boolean;
};

const STAGES = [
  { id: "movie", label: "Movie metadata identified" },
  { id: "reviews", label: "Audience reviews collected" },
  { id: "sentiment", label: "Analyzing opinions & sentiment" },
  { id: "themes", label: "Extracting themes & clusters" },
  { id: "profile", label: "Building audience profile" },
];

export default function AnalysisProgressStepper({
  currentStepMessage,
  hasMovie,
  hasReviews,
}: AnalysisProgressStepperProps) {
  // Determine stage progress
  let activeIndex = 0;
  const msg = (currentStepMessage || "").toLowerCase();

  if (!hasMovie) {
    activeIndex = 0;
  } else if (!hasReviews) {
    activeIndex = 1;
  } else if (msg.includes("cache") || msg.includes("starting") || msg.includes("finding")) {
    activeIndex = 1;
  } else if (msg.includes("analyzing") || msg.includes("sentiment") || msg.includes("prompt")) {
    activeIndex = 2;
  } else if (msg.includes("theme") || msg.includes("cluster") || msg.includes("character")) {
    activeIndex = 3;
  } else if (msg.includes("saving") || msg.includes("profile") || msg.includes("final")) {
    activeIndex = 4;
  } else {
    activeIndex = 2;
  }

  return (
    <div style={{ padding: "32px 24px", background: "var(--cream)" }}>
      <div className="stepper-card" role="status" aria-live="polite" aria-atomic="true">
        <div className="stepper-title">
          <span style={{ color: "var(--pink)", fontSize: 22 }} aria-hidden="true">🎬</span>
          <span>Analyzing Audience Intelligence</span>
        </div>

        <div className="stepper-list">
          {STAGES.map((stage, index) => {
            const isCompleted = index < activeIndex || (index === 0 && hasMovie) || (index === 1 && hasReviews && activeIndex > 1);
            const isActive = index === activeIndex;

            let statusClass = "pending";
            if (isCompleted) statusClass = "completed";
            else if (isActive) statusClass = "active";

            return (
              <div key={stage.id} className={`stepper-item ${statusClass}`}>
                <div className="stepper-bullet">
                  {isCompleted ? "✓" : isActive ? "●" : "○"}
                </div>
                <span>{stage.label}</span>
                {isActive && currentStepMessage && (
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--pink-deep)",
                      marginLeft: "auto",
                      opacity: 0.85,
                    }}
                  >
                    [{currentStepMessage}]
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
