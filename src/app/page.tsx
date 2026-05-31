export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { IconLogo } from "@/components/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Clock01Icon,
  InvoiceIcon,
  ChartIncreaseIcon,
} from "@hugeicons/core-free-icons";
import { LandingNav } from "@/components/landing/nav";
import { FeatureCards } from "@/components/landing/features";

const STEPS = [
  { n: "01", label: "Add client", desc: "Name, email, address — everything in one place." },
  { n: "02", label: "Create project", desc: "Set a name and hourly rate for the work." },
  { n: "03", label: "Log hours", desc: "Track time daily against active projects." },
  { n: "04", label: "Generate invoice", desc: "Auto-fill from logged hours in one click." },
  { n: "05", label: "Get paid", desc: "Share the link. Client pays. Done." },
];

const STATS = [
  { icon: UserGroupIcon, headline: "All your clients", sub: "Managed in one place" },
  { icon: Clock01Icon, headline: "Hours × rate", sub: "Auto-calculated earnings" },
  { icon: InvoiceIcon, headline: "Send in seconds", sub: "Via a shareable link" },
  { icon: ChartIncreaseIcon, headline: "Know what's owed", sub: "Outstanding at a glance" },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      {/* HERO */}
      <section className="border-b border-border px-6 md:px-12 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 inline-flex items-center gap-2 border border-border bg-muted/40 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              For freelancers who get things done
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-end">
            <div>
              <h1 className="font-heading font-extrabold leading-[0.92] tracking-tight text-[clamp(56px,7vw,96px)]">
                Track work.
                <br />
                Get paid.
              </h1>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start free <span aria-hidden className="text-lg leading-none">→</span>
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 border border-border px-6 py-3.5 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  How it works <span aria-hidden className="text-base leading-none">↓</span>
                </a>
              </div>
            </div>

            <div>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Clients, projects, time tracking, and invoices in one place.
                Built for freelancers who'd rather be working than doing admin.
              </p>
              <div className="mt-8 flex gap-10 border-t border-border pt-8">
                {[["Free", "No credit card"], ["2 min", "To set up"], ["OTP", "No password"]].map(([v, l]) => (
                  <div key={l}>
                    <p className="font-heading text-xl font-bold tracking-tight">{v}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVOICE MOCKUP */}
      <section className="border-b border-border px-6 md:px-12">
        <div className="mx-auto max-w-6xl border-x border-border">
          <div className="bg-card p-8 md:p-12">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-6 md:gap-8">
                <MockField label="Invoice" value="INV-0047" big />
                <div className="hidden md:block h-9 w-px bg-border" />
                <MockField label="From" value="Shrvan Benke" />
                <div className="hidden md:block h-9 w-px bg-border" />
                <MockField label="Bill to" value="Studio Collective" />
                <div className="hidden md:block h-9 w-px bg-border" />
                <MockField label="Due date" value="Jun 15, 2026" />
              </div>
              <div className="flex items-center gap-3">
                <span className="border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Sent
                </span>
                <div className="flex items-center gap-1.5">
                  <IconLogo size={15} className="text-muted-foreground" />
                  <span className="font-heading text-xs font-bold text-muted-foreground">bagdaddy</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-[1fr_64px_88px_56px_104px] gap-4 border-b border-border pb-2.5 mb-1">
                {["Description", "Hours", "Rate", "Qty", "Total"].map((h) => (
                  <p key={h} className={`text-[10px] uppercase tracking-[0.1em] text-muted-foreground ${h === "Total" ? "text-right" : ""}`}>{h}</p>
                ))}
              </div>
              {[
                { desc: "Website redesign & development", hours: "40h", rate: "$85", qty: "1", total: "$3,400.00" },
                { desc: "Brand identity & style guide", hours: "8h", rate: "$120", qty: "1", total: "$960.00" },
              ].map((row) => (
                <div key={row.desc} className="grid grid-cols-[1fr_64px_88px_56px_104px] gap-4 items-center border-b border-border/60 py-3">
                  <p className="text-sm">{row.desc}</p>
                  <p className="text-[13px] text-muted-foreground">{row.hours}</p>
                  <p className="text-[13px] text-muted-foreground">{row.rate}/hr</p>
                  <p className="text-[13px] text-muted-foreground">{row.qty}</p>
                  <p className="font-heading text-sm font-bold text-right">{row.total}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[13px] text-muted-foreground">Payment terms: Net 30 · Bank transfer accepted</p>
              <div className="flex items-baseline gap-4">
                <span className="text-[13px] uppercase tracking-[0.08em] text-muted-foreground">Total due</span>
                <span className="font-heading text-3xl font-extrabold tracking-tight">$4,360.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <p className="bg-background py-4 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
        Your clients see a page like this — no account needed
      </p>

      {/* HOW IT WORKS */}
      <section id="how" className="border-b border-border px-6 md:px-12 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">How it works</p>
          <h2 className="font-heading text-[clamp(34px,4vw,56px)] font-extrabold leading-none tracking-tight mb-16">
            From first client
            <br />
            to final payment.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-border">
            {STEPS.map(({ n, label, desc }) => (
              <div key={n} className="border-b border-r border-border p-7">
                <p className="font-heading text-2xl font-extrabold tracking-tight text-foreground/30 mb-5">{n}</p>
                <p className="font-heading text-base font-bold tracking-tight mb-2">{label}</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border px-6 md:px-12 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Features</p>
          <h2 className="font-heading text-[clamp(34px,4vw,56px)] font-extrabold leading-none tracking-tight mb-14">
            Everything you need.
            <br />
            Nothing you don't.
          </h2>
          <FeatureCards />
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-border px-6 md:px-12">
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-x border-border">
          {STATS.map(({ icon, headline, sub }, i) => (
            <div
              key={headline}
              className={`flex flex-col gap-4 p-8 ${i < STATS.length - 1 ? "border-b lg:border-b-0 lg:border-r border-border" : ""}`}
            >
              <div className="flex h-10 w-10 items-center justify-center bg-primary">
                <HugeiconsIcon icon={icon} size={17} strokeWidth={1.5} className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-heading text-[15px] font-bold tracking-tight">{headline}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background px-6 md:px-12 py-28">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-background/50">
              Ready to get organized?
            </p>
            <h2 className="font-heading text-[clamp(44px,5.5vw,76px)] font-extrabold leading-[0.95] tracking-tight">
              Your clients
              <br />
              owe you.
            </h2>
            <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-background/60">
              Start tracking work and sending invoices. Free. No credit card. No password.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 bg-background px-9 py-4 text-base font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
            >
              Start free today <span aria-hidden className="text-xl leading-none">→</span>
            </Link>
            <p className="text-xs text-background/40">OTP login — your email is all you need</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background border-t border-border px-6 md:px-12 py-8">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <IconLogo size={18} className="text-muted-foreground" />
            <span className="font-heading text-[15px] font-bold tracking-tight text-muted-foreground">bagdaddy</span>
          </div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">made for freelancers</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} bagdaddy</p>
        </div>
      </footer>
    </div>
  );
}

function MockField({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">{label}</p>
      <p className={big ? "font-heading text-lg font-bold tracking-tight" : "text-sm font-semibold"}>{value}</p>
    </div>
  );
}
