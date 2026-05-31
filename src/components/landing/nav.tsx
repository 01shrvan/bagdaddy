"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconLogo } from "@/components/icons";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between px-6 md:px-12 transition-colors duration-200",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-background border-b border-transparent",
      )}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <IconLogo size={22} className="text-foreground" />
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">bagdaddy</span>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Get started
          <span aria-hidden className="text-base leading-none">→</span>
        </Link>
      </div>
    </header>
  );
}
