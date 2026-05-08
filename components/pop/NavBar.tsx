"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type NavBarProps = {
  onSearchClick: () => void;
};

export default function NavBar({ onSearchClick }: NavBarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let lastY = 0;
    const trigger = ScrollTrigger.create({
      start: "top -100",
      onUpdate: (self) => {
        const y = self.scroll();
        if (y > lastY && y > 200) navRef.current?.classList.add("hidden");
        else navRef.current?.classList.remove("hidden");
        lastY = y;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <nav className="pop-nav" ref={navRef} id="nav">
      <div className="nav-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pop-logo.png" alt="POP" width={44} height={44} />
        <span className="nav-brand-text display">POP</span>
      </div>
      <div className="nav-links">
        <a href="#trending">Trending</a>
        <a href="#detail">Spotlight</a>
        <a href="#filmstrip">Now Showing</a>
        <a href="#comments">Reviews</a>
        <button className="nav-cta" onClick={onSearchClick}>
          Search 🔍
        </button>
      </div>
    </nav>
  );
}
