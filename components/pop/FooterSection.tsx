"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DEVELOPER = {
  name: "Vedaang Sharma",
  role: "Full-stack developer · AI enthusiast",
  blurb:
    "POP is a solo passion project — built to prove that movie discovery can feel like a buttered tub of joy, grounded in real viewer voices.",
  github: "https://github.com/vedaangsharma2006",
  linkedin: "https://www.linkedin.com/in/vedaang-sharma",
  email: "vedaangsharma2006@gmail.com",
};

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

const scrollToId = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footerRef.current?.querySelector(".footer-grid"),
        start: "top 90%",
        onEnter: () => {
          gsap.from(".footer-grid > *", { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 });
        },
        once: true,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="pop-footer" ref={footerRef}>
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pop-logo.png" alt="POP" width={56} height={56} />
            <span className="footer-brand-name display">POP</span>
          </div>
          <p className="footer-tag">
            AI-powered movie insights with honest scores and real viewer voices — without a hidden recommendation feed.
          </p>
          <p className="footer-tmdb-notice">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="display">Discover</h4>
          <Link href="/#trending" onClick={scrollToId("trending")}>Trending this week</Link>
          <Link href="/#filmstrip" onClick={scrollToId("filmstrip")}>Now showing</Link>
          <Link href="/#detail" onClick={scrollToId("detail")}>Movie spotlight</Link>
          <Link href="/#emotions" onClick={scrollToId("emotions")}>Emotion fingerprint</Link>
          <Link href="/#comments" onClick={scrollToId("comments")}>Viewer reviews</Link>
        </div>

        <div className="footer-col">
          <h4 className="display">Explore</h4>
          <Link href="/about">About POP</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4 className="display">Built with</h4>
          <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">Next.js</a>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb API</a>
          <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">OMDb API</a>
          <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">OpenRouter</a>
          <a href="https://greensock.com/gsap/" target="_blank" rel="noopener noreferrer">GSAP</a>
        </div>

        <div className="footer-col footer-dev">
          <h4 className="display">The Maker</h4>
          <div className="footer-dev-name">{DEVELOPER.name}</div>
          <div className="footer-dev-role mono">{DEVELOPER.role}</div>
          <p className="footer-dev-blurb">{DEVELOPER.blurb}</p>
          <div className="footer-social">
            <a
              href={DEVELOPER.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Vedaang Sharma on GitHub (opens in new tab)"
              title="GitHub"
            >
              <GitHubIcon />
              <span>GitHub</span>
            </a>
            <a
              href={DEVELOPER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Vedaang Sharma on LinkedIn (opens in new tab)"
              title="LinkedIn"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${DEVELOPER.email}`}
              className="footer-social-link"
              aria-label="Send email to Vedaang Sharma"
              title="Email"
            >
              <MailIcon />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 POP — BUILT BY {DEVELOPER.name.toUpperCase()}</span>
        <span>CRAFTED WITH 🍿 &amp; OPEN SOURCE</span>
        <span>v1.0.0 — &ldquo;EXTRA BUTTER&rdquo;</span>
      </div>
    </footer>
  );
}
