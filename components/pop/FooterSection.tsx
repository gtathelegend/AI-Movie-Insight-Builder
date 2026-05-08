"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SNACKS } from "./data";

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footerRef.current?.querySelector(".snack-bar"),
        start: "top 85%",
        onEnter: () => {
          gsap.from(".snack", {
            y: 60,
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)",
          });
        },
        once: true,
      });

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
      <div className="container" style={{ textAlign: "center", paddingTop: 40 }}>
        <span className="section-label mono" style={{ background: "var(--yellow)", color: "var(--ink)" }}>
          // SNACK BAR
        </span>
        <h2 className="section-title" style={{ color: "var(--cream)" }}>
          Grab a <span style={{ color: "var(--pink)" }}>treat</span> on the way out.
        </h2>
      </div>

      <div className="snack-bar">
        {SNACKS.map((s) => (
          <div key={s.name} className="snack">
            <div className="snack-icon">{s.icon}</div>
            <div className="snack-name display">{s.name}</div>
            <div className="snack-price mono">{s.price}</div>
          </div>
        ))}
      </div>

      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pop-logo.png" alt="POP" width={56} height={56} />
            <span className="footer-brand-name display">POP</span>
          </div>
          <p className="footer-tag">
            Made by people who love movies — for people who love movies. No algorithms, no auto-play, no
            compromises.
          </p>
        </div>
        <div className="footer-col">
          <h4 className="display">Discover</h4>
          <a href="#">Trending</a>
          <a href="#">New releases</a>
          <a href="#">Hidden gems</a>
          <a href="#">Top of all time</a>
          <a href="#">By director</a>
        </div>
        <div className="footer-col">
          <h4 className="display">Community</h4>
          <a href="#">Write a review</a>
          <a href="#">Reviewers</a>
          <a href="#">Watchlists</a>
          <a href="#">Movie clubs</a>
          <a href="#">Forums</a>
        </div>
        <div className="footer-col">
          <h4 className="display">The Bucket</h4>
          <a href="#">About POP</a>
          <a href="#">How we score</a>
          <a href="#">Contact</a>
          <a href="#">Press kit</a>
          <a href="#">Careers</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 POP CINEMA CO.</span>
        <span>BUILT WITH 🍿 IN BROOKLYN</span>
        <span>v1.0.0 — &ldquo;EXTRA BUTTER&rdquo;</span>
      </div>
    </footer>
  );
}
