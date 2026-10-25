import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { IconLogo } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <IconLogo size={14} className="text-foreground" />
            <span className="font-heading text-sm font-bold tracking-tight">bagdaddy</span>
          </div>
          <span className="border border-destructive/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-destructive">
            Void
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 px-5 pt-6 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Invoice</p>
            <p className="mt-1 whitespace-nowrap font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">INV-404</p>
          </div>
          <p className="whitespace-nowrap font-heading text-xl font-extrabold tracking-tight text-muted-foreground line-through sm:text-2xl">
            $0.00
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-border px-5 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Description</span>
          <span>Qty</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-dashed border-border px-5 py-3 text-sm">
          <span>The page you asked for</span>
          <span className="font-mono text-muted-foreground">0</span>
        </div>

        <p className="border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground">
          This page doesn&apos;t exist. If someone sent you an invoice link, it may have been deleted or mistyped.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
