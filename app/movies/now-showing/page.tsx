import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";
import FaqSection from "@/components/pop/FaqSection";
import { getNowPlayingMoviesServer } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Now Showing in Theaters — Cinema Releases & Audience Reviews",
  description:
    "Explore movies currently playing in cinemas and theaters. Check verified audience sentiment, ratings, review clusters, and emotional fingerprints before buying a ticket.",
  alternates: {
    canonical: "https://pop.vedaangsharma.in/movies/now-showing",
  },
  openGraph: {
    title: "Now Showing in Theaters — Cinema Releases & Audience Reviews | POP",
    description:
      "Explore movies currently playing in cinemas with verified audience sentiment, ratings, and emotional fingerprints on POP.",
    url: "https://pop.vedaangsharma.in/movies/now-showing",
  },
};

export default async function NowShowingPage() {
  const movies = await getNowPlayingMoviesServer();

  const ITEM_LIST_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Now Showing in Theaters",
    "description": "Cinema films currently in theaters with audience ratings and sentiment intelligence.",
    "itemListElement": movies.map((m, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Movie",
        "name": m.title,
        "image": m.poster || undefined,
        "url": m.imdbId
          ? `https://pop.vedaangsharma.in/movie/${m.imdbId}`
          : `https://pop.vedaangsharma.in/movies/now-showing`,
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
          <span className="subpage-tag mono" style={{ background: "var(--pink)", color: "var(--white)" }}>
            {"// THEATER MARQUEE LINEUP"}
          </span>
          <h1 className="subpage-title">Now Showing in Theaters</h1>
          <p className="subpage-lead">
            What&apos;s currently playing on the big screen. Explore real audience sentiment and viewer reviews before choosing your popcorn film.
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
                        alt={`${m.title} (${m.year}) cinema poster`}
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
                        background: "var(--ink)",
                        color: "var(--yellow)",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 800,
                        fontSize: 12,
                        border: "2px solid var(--yellow)",
                      }}
                    >
                      REEL #{String(index + 1).padStart(3, "0")}
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
