"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DEVELOPER = {
  name: "Vedaang Sharma",
  role: "Full-stack developer · AI enthusiast",
  blurb:
    "POP is a solo passion project — built to prove that movie discovery can feel like a buttered tub of joy, not a feed of algorithmic noise.",
  github: "https://github.com/vedaangsharma2006",
  linkedin: "https://www.linkedin.com/in/vedaang-sharma",
  email: "vedaangsharma2006@gmail.com",
};

function PopcornIcon({ size = 18 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/pop-logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="footer-social-icon"
    />
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
            AI-powered movie insights with honest scores and real viewer voices. No algorithms,
            no auto-play, no compromises.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="display">Discover</h4>
          <a href="#trending" onClick={scrollToId("trending")}>Trending this week</a>
          <a href="#filmstrip" onClick={scrollToId("filmstrip")}>Now showing</a>
          <a href="#detail" onClick={scrollToId("detail")}>Movie spotlight</a>
          <a href="#emotions" onClick={scrollToId("emotions")}>Emotion fingerprint</a>
          <a href="#comments" onClick={scrollToId("comments")}>Viewer reviews</a>
        </div>

        <div className="footer-col">
          <h4 className="display">Built with</h4>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb API</a>
          <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">OMDb API</a>
          <a href="https://www.anthropic.com/" target="_blank" rel="noopener noreferrer">Claude AI</a>
          <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">Next.js</a>
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
              aria-label="GitHub profile"
              title="GitHub"
            >
              <PopcornIcon />
              <span>GitHub</span>
            </a>
            <a
              href={DEVELOPER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <PopcornIcon />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${DEVELOPER.email}`}
              className="footer-social-link"
              aria-label="Email Vedaang"
              title="Email"
            >
              <PopcornIcon />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 POP — BUILT BY {DEVELOPER.name.toUpperCase()}</span>
        <span>CRAFTED WITH 🍿 &amp; CLAUDE</span>
        <span>v1.0.0 — &ldquo;EXTRA BUTTER&rdquo;</span>
      </div>
    </footer>
  );
}
