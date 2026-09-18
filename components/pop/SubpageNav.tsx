"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubpageNav() {
  const pathname = usePathname();

  return (
    <nav className="subpage-nav" aria-label="Main Navigation">
      <Link href="/" className="subpage-brand" aria-label="POP Home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pop-logo.png" alt="POP Logo" width={38} height={38} style={{ borderRadius: 8 }} />
        <span className="subpage-brand-text">POP</span>
      </Link>

      <div className="subpage-links">
        <Link href="/about" className={pathname === "/about" ? "active" : ""}>
          About
        </Link>
        <Link href="/privacy" className={pathname === "/privacy" ? "active" : ""}>
          Privacy
        </Link>
        <Link href="/contact" className={pathname === "/contact" ? "active" : ""}>
          Contact
        </Link>
        <Link href="/" className="subpage-back-btn">
          <span>🎬 Back to Cinema</span>
        </Link>
      </div>
    </nav>
  );
}
