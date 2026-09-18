import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";
import FaqSection from "@/components/pop/FaqSection";
import { getTrendingMoviesServer, getNowPlayingMoviesServer } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Movies Directory — Ratings, Reviews & Audience Insights",
  description:
    "Discover trending films, now-playing cinema releases, and honest AI audience sentiment reports. Explore verified ratings, review consensus, and emotional breakdowns.",
  alternates: {
    canonical: "https://pop.vedaangsharma.in/movies",
  },
  openGraph: {
    title: "Movies Directory — Ratings, Reviews & Audience Insights | POP",
    description:
      "Discover trending films, now-playing cinema releases, and honest AI audience sentiment reports on POP.",
    url: "https://pop.vedaangsharma.in/movies",
  },
};

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
];

export default async function MoviesHubPage() {
  const [trending, nowPlaying] = await Promise.all([
    getTrendingMoviesServer(),
    getNowPlayingMoviesServer(),
  ]);

  return (
    <div className="subpage-root">
      <SubpageNav />

      <main className="subpage-main">
        <header className="subpage-header">
          <span className="subpage-tag mono">{"// MOVIE DISCOVERY DIRECTORY"}</span>
          <h1 className="subpage-title">Explore Cinema by Real Audience Sentiment.</h1>
          <p className="subpage-lead">
            Discover trending titles, cinema releases, and deep audience intelligence. Compare IMDb ratings, Rotten Tomatoes critic scores, and POP AI sentiment indexes.
          </p>
        </header>

        {/* Quick Navigation Cards */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          <Link
            href="/movies/trending"
            style={{
              background: "var(--yellow)",
              border: "3px solid var(--ink)",
              borderRadius: 16,
              padding: 24,
              textDecoration: "none",
              color: "var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span className="mono" style={{ fontSize: 12, fontWeight: 800 }}>🔥 WEEKLY SPOTLIGHT</span>
            <h2 style={{ fontFamily: "var(--font-bagel)", fontSize: 24, margin: 0 }}>Trending Movies →</h2>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>The top films capturing audience discussions this week.</p>
          </Link>

          <Link
            href="/movies/now-showing"
            style={{
              background: "var(--pink)",
              border: "3px solid var(--ink)",
              borderRadius: 16,
              padding: 24,
              textDecoration: "none",
              color: "var(--white)",
              boxShadow: "4px 4px 0 var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span className="mono" style={{ fontSize: 12, fontWeight: 800, color: "var(--yellow)" }}>🎬 IN CINEMAS NOW</span>
            <h2 style={{ fontFamily: "var(--font-bagel)", fontSize: 24, margin: 0 }}>Now Showing Reel →</h2>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>What’s currently lighting up theaters and marquee boards.</p>
          </Link>
        </section>

        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="subpage-card" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Trending This Week</h2>
              <Link href="/movies/trending" style={{ fontWeight: 800, color: "var(--ink)" }}>View All Trending →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
              {trending.slice(0, 6).map((m) => {
                const linkHref = m.imdbId ? `/movie/${m.imdbId}` : `/?q=${encodeURIComponent(m.title)}`;
                return (
                  <Link
                    key={m.id}
                    href={linkHref}
                    style={{
                      textDecoration: "none",
                      color: "var(--ink)",
                      background: "var(--cream)",
                      border: "2px solid var(--ink)",
                      borderRadius: 12,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {m.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.poster} alt={`${m.title} poster`} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", aspectRatio: "2/3", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        POP
                      </div>
                    )}
                    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontFamily: "var(--font-bagel)", fontSize: 15, lineHeight: 1.2 }}>{m.title}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{m.year} · {m.genre}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Now Showing Section */}
        {nowPlaying.length > 0 && (
          <section className="subpage-card" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Now Playing in Cinemas</h2>
              <Link href="/movies/now-showing" style={{ fontWeight: 800, color: "var(--ink)" }}>View All Now Showing →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
              {nowPlaying.slice(0, 6).map((m) => {
                const linkHref = m.imdbId ? `/movie/${m.imdbId}` : `/?q=${encodeURIComponent(m.title)}`;
                return (
                  <Link
                    key={m.id}
                    href={linkHref}
                    style={{
                      textDecoration: "none",
                      color: "var(--ink)",
                      background: "var(--cream)",
                      border: "2px solid var(--ink)",
                      borderRadius: 12,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {m.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.poster} alt={`${m.title} poster`} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", aspectRatio: "2/3", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        POP
                      </div>
                    )}
                    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontFamily: "var(--font-bagel)", fontSize: 15, lineHeight: 1.2 }}>{m.title}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{m.year} · {m.genre}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Popular Cinema Genres */}
        <section className="subpage-card" style={{ marginBottom: 40 }}>
          <h2>Popular Movie Genres</h2>
          <p style={{ color: "var(--ink-soft)", fontWeight: 600 }}>Explore cinema genres evaluated by viewer sentiment:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            {GENRES.map((g) => (
              <Link
                key={g}
                href={`/?q=${encodeURIComponent(g)}`}
                style={{
                  background: "var(--white)",
                  border: "2px solid var(--ink)",
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 13,
                  textDecoration: "none",
                  color: "var(--ink)",
                  boxShadow: "2px 2px 0 var(--ink)",
                }}
              >
                {g} Movies
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />
      </main>

      <FooterSection />
    </div>
  );
}
