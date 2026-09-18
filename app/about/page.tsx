import type { Metadata } from "next";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";

export const metadata: Metadata = {
  title: "About POP — AI Movie Insight Builder",
  description:
    "Learn how POP combines verified cinematic metadata, multi-source audience reviews, and evidence-grounded AI analysis into an honest movie intelligence dashboard.",
};

const DEVELOPER = {
  name: "Vedaang Sharma",
  role: "Full-stack developer · AI enthusiast",
  bio: "Full-stack engineer passionate about building high-craft, evidence-grounded AI applications that feel responsive, transparent, and joyful to use.",
  github: "https://github.com/gtathelegend",
  linkedin: "https://www.linkedin.com/in/vedaangsharma2006",
  email: "info@vedaangsharma.in",
};

export default function AboutPage() {
  return (
    <div className="subpage-root">
      <SubpageNav />

      <main className="subpage-main">
        <header className="subpage-header">
          <span className="subpage-tag mono">{"// ABOUT THE PROJECT"}</span>
          <h1 className="subpage-title">Honest cinema insights from real viewer voices.</h1>
          <p className="subpage-lead">
            POP is an AI-powered movie insight experience that combines verified movie metadata, real audience reviews, and evidence-grounded AI synthesis into a single cinematic interface.
          </p>
        </header>

        <section className="subpage-card">
          <h2>What POP Does</h2>
          <p>
            Traditional movie platforms often bury audience consensus beneath algorithmic recommendation feeds or single unrepresentative star averages. POP breaks down how real viewers felt about a movie through a 4-step pipeline:
          </p>

          <ol>
            <li>
              <strong>1. Find a movie:</strong> Search by any film title or direct IMDb identifier (e.g. <code>tt0133093</code>).
            </li>
            <li>
              <strong>2. Gather the evidence:</strong> Canonical movie metadata (cast, director, plot, ratings) is retrieved from OMDb. Public audience reviews are retrieved from TMDb, falling back to IMDb web data when necessary.
            </li>
            <li>
              <strong>3. Analyze audience sentiment:</strong> OpenRouter AI synthesizes the collected audience reviews across multi-dimensional metrics.
            </li>
            <li>
              <strong>4. Explore the audience perspective:</strong> POP presents an interactive intelligence dashboard featuring overall sentiment classification, core themes, key highlights and pain points, emotional fingerprints, opinion clusters, character discussions, and original review quotes.
            </li>
          </ol>
        </section>

        <section className="subpage-card">
          <h2>Built Around Real Evidence</h2>
          <p>
            A core engineering principle of POP is <strong>evidence grounding</strong>. The application does not hallucinate fictional viewer reviews or fabricate quotes.
          </p>
          <p>
            AI insights are synthesized strictly from the audience reviews retrieved by the application. In every analysis, POP clearly distinguishes:
          </p>
          <ul>
            <li>
              <strong>Audience Evidence:</strong> Real public review excerpts collected from TMDb and IMDb, with transparent source attribution and review counts.
            </li>
            <li>
              <strong>AI Synthesis:</strong> Structured thematic extraction, emotional intensity modeling, and sentiment scoring derived directly from those verified reviews.
            </li>
          </ul>
        </section>

        <section className="subpage-card">
          <h2>Technology Stack</h2>
          <p>
            POP is built with a modern, high-performance web and AI engineering stack:
          </p>
          <ul>
            <li><strong>Next.js 16 (App Router &amp; Turbopack):</strong> React framework powering server routes, streaming Server-Sent Events (SSE), and static optimization.</li>
            <li><strong>TypeScript 5:</strong> End-to-end type safety across movie data structures and AI response payloads.</li>
            <li><strong>OMDb API:</strong> Canonical movie metadata, plot summaries, and official ratings.</li>
            <li><strong>TMDb API:</strong> Live search autocomplete, weekly trending lists, now-playing filmstrip, and primary review retrieval.</li>
            <li><strong>IMDb Review Fallback:</strong> Cheerio-based HTML scraping fallback when TMDb review counts are insufficient.</li>
            <li><strong>OpenRouter AI:</strong> Multi-dimensional audience sentiment analysis with strict structured JSON output.</li>
            <li><strong>Framer Motion &amp; GSAP:</strong> Fluid layout transitions, pinned filmstrips, and curtain reveals.</li>
            <li><strong>Zod:</strong> Runtime schema validation at all API and AI boundaries.</li>
            <li><strong>Prisma &amp; PostgreSQL (Optional):</strong> 24-hour persistent L2 cache for instant insight retrieval.</li>
          </ul>
        </section>

        <section className="subpage-maker-card">
          <div className="subpage-maker-header">
            <div>
              <div className="subpage-maker-name">{DEVELOPER.name}</div>
              <div className="subpage-maker-role mono">{DEVELOPER.role}</div>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink)", fontWeight: 600 }}>
            {DEVELOPER.bio}
          </p>
          <div className="subpage-maker-socials">
            <a
              href={DEVELOPER.github}
              target="_blank"
              rel="noopener noreferrer"
              className="subpage-social-btn"
              aria-label="Vedaang Sharma on GitHub (opens in new tab)"
            >
              GitHub ↗
            </a>
            <a
              href={DEVELOPER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="subpage-social-btn"
              aria-label="Vedaang Sharma on LinkedIn (opens in new tab)"
            >
              LinkedIn ↗
            </a>
            <a
              href={`mailto:${DEVELOPER.email}`}
              className="subpage-social-btn primary"
              aria-label="Send email to Vedaang Sharma"
            >
              Email Vedaang ✉
            </a>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
