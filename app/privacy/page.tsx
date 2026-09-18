import type { Metadata } from "next";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";

export const metadata: Metadata = {
  title: "Privacy Policy — POP",
  description:
    "Privacy Policy for POP (AI Movie Insight Builder). Learn what information is processed when searching and analyzing movies.",
};

export default function PrivacyPage() {
  return (
    <div className="subpage-root">
      <SubpageNav />

      <main className="subpage-main">
        <header className="subpage-header">
          <span className="subpage-tag mono">{"// LEGAL & TRANSPARENCY"}</span>
          <h1 className="subpage-title">Privacy Policy</h1>
          <p className="subpage-lead">
            Last updated: March 18, 2026
          </p>
        </header>

        <section className="subpage-card">
          <h2>Overview</h2>
          <p>
            POP (&ldquo;AI Movie Insight Builder&rdquo;) is an open-access movie discovery and audience intelligence tool. This Privacy Policy explains how information is handled when you interact with the application.
          </p>
        </section>

        <section className="subpage-card">
          <h2>Information You Provide</h2>
          <p>
            When using POP, you may submit search queries containing movie titles or IMDb identifiers (such as <code>tt0133093</code>).
          </p>
          <p>
            The application does not require user accounts, registration, logins, passwords, or personal profiles to access movie analysis features.
          </p>
        </section>

        <section className="subpage-card">
          <h2>Information Processed &amp; Third-Party Services</h2>
          <p>
            To provide movie metadata, audience reviews, and AI synthesis, search queries and identifiers are processed through the following external services:
          </p>
          <ul>
            <li>
              <strong><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">The Movie Database (TMDb):</a></strong> Used for movie discovery, title search autocomplete, weekly trending lists, now-playing filmstrip, and primary audience review retrieval.
            </li>
            <li>
              <strong><a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">OMDb API:</a></strong> Used to retrieve canonical movie metadata, release years, plot summaries, cast lists, and official critical scores.
            </li>
            <li>
              <strong><a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer">IMDb:</a></strong> Public webpage data may be queried as a secondary fallback to retrieve audience reviews when TMDb review counts are insufficient.
            </li>
            <li>
              <strong><a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">OpenRouter:</a></strong> Used to process collected public review text through large language models to generate structured audience intelligence insights.
            </li>
          </ul>
        </section>

        <section className="subpage-card">
          <h2>Cookies &amp; Local Storage</h2>
          <p>
            POP does not use tracking cookies, behavioral ad trackers, or commercial marketing pixels. Standard web hosting infrastructure (such as Vercel) may log standard HTTP request metadata (such as IP addresses and User-Agent headers) for routing, security, and performance diagnostic purposes.
          </p>
        </section>

        <section className="subpage-card">
          <h2>API Keys &amp; Security Safeguards</h2>
          <p>
            All upstream API keys and service credentials (OMDb, TMDb, OpenRouter, database credentials) are stored securely on the server and are strictly isolated from client-side JavaScript bundles.
          </p>
        </section>

        <section className="subpage-card">
          <h2>Data Caching &amp; Retention</h2>
          <p>
            To reduce redundant external network requests and improve response times, retrieved movie metadata and synthesized AI insights may be cached:
          </p>
          <ul>
            <li><strong>L1 In-Memory Cache:</strong> Temporarily held in server memory for 1 hour.</li>
            <li><strong>L2 Persistent Cache (Optional):</strong> Stored in an encrypted PostgreSQL database for 24 hours when configured.</li>
          </ul>
        </section>

        <section className="subpage-card">
          <h2>Contact &amp; Questions</h2>
          <p>
            If you have questions or feedback regarding this Privacy Policy, please contact:
          </p>
          <p>
            <strong>Vedaang Sharma</strong><br />
            Email: <a href="mailto:vedaangsharma2006@gmail.com">vedaangsharma2006@gmail.com</a><br />
            GitHub: <a href="https://github.com/vedaangsharma2006" target="_blank" rel="noopener noreferrer">github.com/vedaangsharma2006</a>
          </p>
        </section>

        <section className="subpage-card">
          <h2>Changes to This Policy</h2>
          <p>
            This policy may be updated periodically if new features or data integrations are added to the application. Updates will be reflected directly on this page with a revised date.
          </p>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
