"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconLogo } from "@/components/icons";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: 64,
        backgroundColor: scrolled ? "rgba(242,237,228,0.92)" : "#F2EDE4",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #C8C0B4" : "1px solid transparent",
        transition: "all 0.2s ease",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <IconLogo size={22} style={{ color: "#111010" }} />
        <span style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 18,
          color: "#111010",
          letterSpacing: "-0.5px",
        }}>
          bagdaddy
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 500,
            color: "#6B6461",
            textDecoration: "none",
            padding: "8px 16px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#111010")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6461")}
        >
          Sign in
        </Link>
        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            color: "#F2EDE4",
            backgroundColor: "#111010",
            textDecoration: "none",
            padding: "9px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Get started
          <span style={{ fontSize: 16 }}>→</span>
        </Link>
      </div>
    </header>
  );
}
