import type { Metadata } from "next";
import SubpageNav from "@/components/pop/SubpageNav";
import FooterSection from "@/components/pop/FooterSection";

export const metadata: Metadata = {
  title: "Contact — POP",
  description:
    "Get in touch with the maker of POP (AI Movie Insight Builder) for inquiries, feedback, or collaborations.",
};

const DEVELOPER = {
  name: "Vedaang Sharma",
  role: "Full-stack developer · AI enthusiast",
  github: "https://github.com/gtathelegend",
  linkedin: "https://www.linkedin.com/in/vedaangsharma2006",
  email: "info@vedaangsharma.in",
};

export default function ContactPage() {
  return (
    <div className="subpage-root">
      <SubpageNav />

      <main className="subpage-main">
        <header className="subpage-header">
          <span className="subpage-tag mono">{"// GET IN TOUCH"}</span>
          <h1 className="subpage-title">Let&rsquo;s talk cinema &amp; AI.</h1>
          <p className="subpage-lead">
            Have a question about POP, found an issue, or want to connect? Reach out directly.
          </p>
        </header>

        <section className="subpage-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <span style={{ fontSize: 44, display: "block", marginBottom: 16 }}>📬</span>
          <h2>Direct Email</h2>
          <p style={{ maxWidth: 480, margin: "0 auto 24px", color: "var(--ink-soft)" }}>
            For project inquiries, technical feedback, or collaboration opportunities, email is the fastest way to reach me.
          </p>
          <a
            href={`mailto:${DEVELOPER.email}`}
            className="subpage-social-btn primary"
            style={{ fontSize: 16, padding: "14px 28px", display: "inline-flex" }}
            aria-label="Send email to Vedaang Sharma"
          >
            Email Vedaang ({DEVELOPER.email}) ✉
          </a>
        </section>

        <section className="subpage-card">
          <h2>Developer Profile</h2>
          <p>
            You can find my open-source code and projects here:
          </p>
          <div className="subpage-maker-socials">
            <a
              href={DEVELOPER.github}
              target="_blank"
              rel="noopener noreferrer"
              className="subpage-social-btn"
              aria-label="Vedaang Sharma on GitHub (opens in new tab)"
            >
              GitHub Profile ↗
            </a>
            <a
              href={DEVELOPER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="subpage-social-btn"
              aria-label="Vedaang Sharma on LinkedIn (opens in new tab)"
            >
              LinkedIn Profile ↗
            </a>
          </div>
        </section>

        <section className="subpage-maker-card" style={{ background: "var(--white)" }}>
          <div className="subpage-maker-name" style={{ fontSize: 22 }}>About the Author</div>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "8px 0 0", fontWeight: 600 }}>
            POP is a solo project designed and engineered by <strong>{DEVELOPER.name}</strong>. Built with a passion for clean UI craft, evidence-grounded AI architectures, and great cinema.
          </p>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
