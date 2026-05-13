type MarqueeStripProps = {
  movieTitle?: string;
  score?: number;
};

export default function MarqueeStrip({ movieTitle = "NEON HEARTS", score = 0.92 }: MarqueeStripProps) {
  const displayScore = Math.round(score * 100);
  const content = `NOW SHOWING · ${movieTitle.toUpperCase()} · ${displayScore} / 100 · CRITICS' PICK · EXTRA BUTTER · `;

  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>
          {content}
          <i className="dot" />
          {content}
          <i className="dot" />
        </span>
        <span>
          {content}
          <i className="dot" />
          {content}
          <i className="dot" />
        </span>
      </div>
    </div>
  );
}
