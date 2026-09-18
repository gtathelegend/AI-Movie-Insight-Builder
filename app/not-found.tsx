import Link from "next/link";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";

export const metadata = {
  title: "404 — Scene Not Found | POP",
  description: "The requested movie reel or page could not be found on POP.",
};

export default function NotFound() {
  return (
    <div className="subpage-root">
      <SubpageNav />

      <main className="subpage-main" style={{ textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <header className="subpage-header" style={{ marginBottom: 32 }}>
          <span className="subpage-tag mono" style={{ background: "var(--pink)", color: "var(--white)", borderColor: "var(--ink)" }}>
            {"// ERROR 404: MISSING REEL"}
          </span>
          <div
            style={{
              fontFamily: "var(--font-bagel)",
              fontSize: "clamp(4.5rem, 12vw, 8.5rem)",
              lineHeight: 1,
              color: "var(--ink)",
              textShadow: "5px 5px 0 var(--yellow)",
              margin: "16px 0 8px",
            }}
          >
            404 🍿
          </div>
          <h1 className="subpage-title" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", maxWidth: 640, margin: "0 auto 16px" }}>
            This Reel Went Missing.
          </h1>
          <p className="subpage-lead" style={{ maxWidth: 520, margin: "0 auto 32px" }}>
            Looks like this scene doesn&rsquo;t exist or got lost in the cutting room. Let&rsquo;s get you back into the cinema seats.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <Link
              href="/"
              className="subpage-social-btn primary"
              style={{ fontSize: 16, padding: "14px 28px", textDecoration: "none" }}
              aria-label="Back to POP homepage"
            >
              🍿 Back to POP
            </Link>
            <Link
              href="/movies"
              className="subpage-social-btn"
              style={{ fontSize: 16, padding: "14px 28px", textDecoration: "none" }}
              aria-label="Explore movies directory"
            >
              🎬 Explore Movies →
            </Link>
          </div>
        </header>

        {/* Quick Route Shortcuts Card */}
        <section
          className="subpage-card"
          style={{
            maxWidth: 580,
            width: "100%",
            textAlign: "left",
            background: "var(--white)",
            border: "3px solid var(--ink)",
            borderRadius: 16,
            boxShadow: "5px 5px 0 var(--ink)",
            padding: "24px 28px",
          }}
        >
          <h2 style={{ fontSize: 18, margin: "0 0 12px", fontFamily: "var(--font-bagel)" }}>
            Need help finding a movie?
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>
            Jump to our curated cinema channels or search for any film by title:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Link
              href="/movies/trending"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 16px",
                background: "var(--cream)",
                border: "2px solid var(--ink)",
                borderRadius: 10,
                textDecoration: "none",
                color: "var(--ink)",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              <span>🔥 Trending Movies</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>Weekly crowd favorites</span>
            </Link>
            <Link
              href="/movies/now-showing"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 16px",
                background: "var(--cream)",
                border: "2px solid var(--ink)",
                borderRadius: 10,
                textDecoration: "none",
                color: "var(--ink)",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              <span>🎬 In Theaters Now</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>Current box office reel</span>
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
