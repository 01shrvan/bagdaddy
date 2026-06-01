export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { IconLogo } from "@/components/icons";
import { LandingNav } from "@/components/landing/nav";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      {/* HERO */}
      <section className="overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-48">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 md:items-center">
            <div>
              <p className="mb-6 inline-block border border-border bg-muted/30 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                For freelancers
              </p>
              <h1 className="mb-6 font-heading text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Stop chasing invoices.
              </h1>
              <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
                Log hours. Generate invoices. Share a link. Get paid.
                Everything for freelance billing, kept simple and fast.
              </p>
              <div className="flex gap-3">
                <Button asChild size="lg">
                  <Link href="/login">Start free</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">No card. No password. Email only.</p>
            </div>

            {/* STATS PREVIEW */}
            <div className="hidden md:block">
              <div className="space-y-4 rounded-lg border border-border bg-card p-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total earned</p>
                  <p className="mt-2 font-heading text-4xl font-bold">$48,920</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Outstanding</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-muted-foreground">$4,360</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Active projects</p>
                  <p className="mt-2 font-heading text-2xl font-bold">6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVOICE EXAMPLE */}
      <section className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h2 className="mb-4 font-heading text-3xl font-bold">Your clients see this</h2>
            <p className="max-w-xl text-muted-foreground">A clean, branded invoice page. They click. They pay. No account needed.</p>
          </div>

          <div className="overflow-hidden border border-border bg-card">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-border px-8 py-6">
              <div className="flex items-center gap-3">
                <IconLogo size={20} className="text-foreground" />
                <span className="font-heading text-lg font-bold">bagdaddy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  PAID
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-8 py-8 md:py-12">
              <div className="mb-8 grid grid-cols-3 gap-6">
                <div>
                  <p className="mb-2 text-xs uppercase text-muted-foreground">Invoice number</p>
                  <p className="font-heading text-3xl font-bold">0047</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase text-muted-foreground">Amount due</p>
                  <p className="font-heading text-3xl font-bold">$4,360</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase text-muted-foreground">Due date</p>
                  <p className="text-lg">Jun 15, 2026</p>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-8 border-y border-border py-8">
                <div>
                  <p className="mb-2 text-xs uppercase text-muted-foreground">From</p>
                  <p className="font-semibold">Shrvan Benke</p>
                  <p className="text-sm text-muted-foreground">Studio lead & designer</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase text-muted-foreground">Bill to</p>
                  <p className="font-semibold">Studio Collective</p>
                  <p className="text-sm text-muted-foreground">Creative agency</p>
                </div>
              </div>

              {/* LINE ITEMS */}
              <div className="mb-8 space-y-4">
                {[
                  { work: "Website redesign & development", hrs: 40, rate: "$85/hr", total: "$3,400" },
                  { work: "Brand identity & style guide", hrs: 8, rate: "$120/hr", total: "$960" },
                ].map(({ work, hrs, rate, total }) => (
                  <div key={work} className="flex items-center justify-between py-2">
                    <span className="text-sm">{work}</span>
                    <span className="ml-auto flex gap-8 font-mono text-sm text-muted-foreground">
                      <span className="w-12 text-right">{hrs}h</span>
                      <span className="w-16 text-right">{rate}</span>
                    </span>
                    <span className="ml-8 w-20 text-right font-semibold">{total}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-end justify-between border-t border-border pt-6">
                <div>
                  <p className="text-xs text-muted-foreground">Payment method: Bank transfer</p>
                  <p className="text-xs text-muted-foreground">Terms: Net 30</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-xs uppercase text-muted-foreground">Total</p>
                  <p className="font-heading text-4xl font-bold">$4,360</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE FLOW */}
      <section className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 font-heading text-3xl font-bold">The flow</h2>

          <div className="space-y-12">
            {[
              { n: "1", title: "Add clients", desc: "Email, address, rate. Your roster." },
              { n: "2", title: "Log hours daily", desc: "Against any project. Takes 30 seconds." },
              { n: "3", title: "Generate invoice", desc: "Hours auto-fill as line items." },
              { n: "4", title: "Share the link", desc: "Copy. Send. They view. They pay." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border">
                  <span className="font-heading text-lg font-bold">{n}</span>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-heading text-5xl font-bold">Your clients owe you.</h2>
          <p className="mb-10 text-xl text-muted-foreground">
            Start invoicing in minutes. Keep track of who owes what.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Start free</Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconLogo size={18} className="text-muted-foreground" />
            <span className="font-heading font-bold">bagdaddy</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} · Made for freelancers</p>
        </div>
      </footer>
    </div>
  );
}
