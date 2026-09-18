"use client";

export default function SourceTransparencySection() {
  return (
    <section className="sources-section" id="sources">
      <div className="container">
        <span className="section-label mono">{"// INSIGHT SOURCES & METHODOLOGY"}</span>
        <h2 className="section-title">
          Transparency & <span style={{ color: "var(--yellow)" }}>Data Sources</span>.
        </h2>
        <p className="section-sub">
          Every AI insight and audience metric is directly grounded in public data from official cinema registries and verified audience reviews.
        </p>

        <div className="sources-grid">
          {/* Card 1: Metadata */}
          <div className="source-card">
            <div className="source-card-role mono">01 · MOVIE METADATA</div>
            <h3 className="source-card-title">OMDb API</h3>
            <p className="source-card-desc">
              Supplies verified movie titles, release years, MPAA ratings, runtimes, plot synopses, billing cast rosters, and Rotten Tomatoes critic scores.
            </p>
          </div>

          {/* Card 2: Reviews */}
          <div className="source-card">
            <div className="source-card-role mono">02 · AUDIENCE REVIEWS</div>
            <h3 className="source-card-title">TMDb + IMDb Scraping</h3>
            <p className="source-card-desc">
              Retrieves uncurated public audience reviews from TMDb with automated fallback to IMDb user review pages, normalized and stripped of noise.
            </p>
          </div>

          {/* Card 3: AI Intelligence */}
          <div className="source-card">
            <div className="source-card-role mono">03 · AI INTELLIGENCE</div>
            <h3 className="source-card-title">OpenRouter Neural Synthesis</h3>
            <p className="source-card-desc">
              Extracts deterministic sentiment scores, 7-axis emotion frequencies, narrative opinion clusters, and character discussions strictly grounded in the review texts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
