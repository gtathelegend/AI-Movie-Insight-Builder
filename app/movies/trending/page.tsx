import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";
import FaqSection from "@/components/pop/FaqSection";
import { getTrendingMoviesServer } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Trending Movies This Week — Ratings, Reviews & Audience Sentiment",
  description:
    "Explore the top trending movies this week. Read real audience review highlights, emotional fingerprints, and AI sentiment scores for what viewers are watching right now.",
  alternates: {
    canonical: "https://pop.vedaangsharma.in/movies/trending",
  },
  openGraph: {
    title: "Trending Movies This Week — Ratings & Audience Sentiment | POP",
    description:
      "Explore the top trending movies this week with real audience review highlights and AI sentiment scores.",
    url: "https://pop.vedaangsharma.in/movies/trending",
  },
};

export default async function TrendingMoviesPage() {
  const movies = await getTrendingMoviesServer();

  const ITEM_LIST_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Trending Movies This Week",
    "description": "Weekly trending movies with verified audience ratings and AI sentiment analysis.",
    "itemListElement": movies.map((m, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Movie",
        "name": m.title,
        "image": m.poster || undefined,
        "url": m.imdbId
          ? `https://pop.vedaangsharma.in/movie/${m.imdbId}`
          : `https://pop.vedaangsharma.in/movies/trending`,
      },
    })),
  };

  return (
    <div className="subpage-root">
      <SubpageNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_JSON_LD) }}
      />

      <main className="subpage-main">
        <header className="subpage-header">
          <span className="subpage-tag mono">{"// LIVE TMDb TRENDING"}</span>
          <h1 className="subpage-title">Trending Movies This Week</h1>
          <p className="subpage-lead">
            Live audience favorites and viral cinema hits. Click any title to explore its full AI sentiment breakdown, emotion profile, and real viewer reviews.
          </p>
        </header>

        <section className="subpage-card" style={{ marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
            {movies.map((m, index) => {
              const linkHref = m.imdbId ? `/movie/${m.imdbId}` : `/?q=${encodeURIComponent(m.title)}`;
              return (
                <Link
                  key={m.id}
                  href={linkHref}
                  style={{
                    textDecoration: "none",
                    color: "var(--ink)",
                    background: "var(--white)",
                    border: "3px solid var(--ink)",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "4px 4px 0 var(--ink)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    {m.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.poster}
                        alt={`${m.title} (${m.year}) movie poster`}
                        style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "2/3",
                          background: "var(--ink)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                        }}
                      >
                        POP
                      </div>
                    )}
                    <span
                      className="mono"
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "var(--yellow)",
                        color: "var(--ink)",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 800,
                        fontSize: 12,
                        border: "2px solid var(--ink)",
                      }}
                    >
                      #{index + 1}
                    </span>
                  </div>

                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6, flexGrow: 1 }}>
                    <h2 style={{ fontFamily: "var(--font-bagel)", fontSize: 18, lineHeight: 1.2, margin: 0 }}>
                      {m.title}
                    </h2>
                    <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                      {m.year} · {m.genre}
                    </span>
                    <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="mono" style={{ fontWeight: 800, fontSize: 12, color: "var(--pink)" }}>
                        ★ {(m.score * 10).toFixed(0)}% Score
                      </span>
                      <span style={{ fontWeight: 800, fontSize: 13 }}>View Insights →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <FaqSection />
      </main>

      <FooterSection />
    </div>
  );
}
