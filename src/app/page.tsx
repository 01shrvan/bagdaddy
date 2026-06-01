export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { IconLogo } from "@/components/icons";
import { LandingNav } from "@/components/landing/nav";

const DOT_GRID = {
  backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
  maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
  WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
};

const FADE_BOTTOM = {
  maskImage: "linear-gradient(to bottom, black 55%, transparent 95%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 95%)",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={DOT_GRID} />

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-0 md:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 border border-border bg-card px-3.5 py-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-foreground" />
              </span>
              <span className="text-xs tracking-wide text-muted-foreground">Free while in beta</span>
            </div>

            <h1 className="font-heading text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              Get paid for
              <br />
              every hour you work.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              bagdaddy turns logged hours into invoices, sends them as a link,
              and tracks who still owes you — so nothing slips through.
            </p>

            <div className="mt-9 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-7">
                <Link href="/login">Start free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-7">
                <a href="#how">See how</a>
              </Button>
            </div>
          </div>

          {/* TILTED DASHBOARD MOCKUP */}
          <div className="mt-20" style={{ perspective: "2200px" }}>
            <div
              className="origin-top transform-gpu border border-border bg-card shadow-2xl"
              style={{ transform: "rotateX(7deg)", ...FADE_BOTTOM }}
            >
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — each card holds a live mini-mockup */}
      <section id="how" className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">How it works</p>
            <h2 className="font-heading text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Three steps. No spreadsheet.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
            {/* CARD 1 — hours -> invoice */}
            <article className="bg-card p-7">
              <div className="mb-7 border border-border bg-background p-5">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Time logged</p>
                <div className="space-y-2 font-mono text-xs">
                  {[["Mon", "6h", "Redesign"], ["Tue", "4h", "Redesign"], ["Wed", "5h", "Redesign"]].map(([d, h, p]) => (
                    <div key={d} className="flex items-center justify-between text-muted-foreground">
                      <span>{d}</span>
                      <span>{p}</span>
                      <span className="text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
                <div className="my-3 flex items-center justify-center">
                  <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">converts to ↓</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span>Redesign · 15h</span>
                  <span className="font-mono font-semibold">$1,275</span>
                </div>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold tracking-tight">Hours become invoices</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Log time against a project. One click turns those hours into invoice line items at your rate.
              </p>
            </article>

            {/* CARD 2 — public link */}
            <article className="bg-card p-7">
              <div className="mb-7 border border-border bg-background p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold">INV-0042</span>
                  <span className="border border-foreground/30 bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">Paid</span>
                </div>
                <p className="font-heading text-3xl font-extrabold tracking-tight">$2,400</p>
                <p className="mb-4 text-xs text-muted-foreground">Studio Collective · due Jun 15</p>
                <div className="flex items-center gap-2 border border-border bg-card px-3 py-2">
                  <span className="truncate font-mono text-[11px] text-muted-foreground">bagdaddy.app/i/x7k2qa</span>
                  <span className="ml-auto shrink-0 border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider">Copy</span>
                </div>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold tracking-tight">Send a link, get paid</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every invoice gets a public page. Copy the link, send it — your client views and pays. No account needed.
              </p>
            </article>

            {/* CARD 3 — dashboard / overdue */}
            <article className="bg-card p-7">
              <div className="mb-7 border border-border bg-background p-5">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">This quarter</p>
                <div className="space-y-3">
                  {[
                    ["Earned", "$48,920", false],
                    ["Outstanding", "$4,360", false],
                    ["Overdue", "$800", true],
                  ].map(([label, value, flag]) => (
                    <div key={label as string} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {flag ? <span className="size-1.5 rounded-full bg-foreground" /> : null}
                        {label}
                      </span>
                      <span className="font-mono text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-border pt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Overdue flagged automatically
                </p>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold tracking-tight">Never chase again</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The dashboard shows what's earned, outstanding, and overdue. Late invoices flag themselves.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* GIANT BRAND CTA */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-10 md:pt-32">
          <h2 className="font-heading text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Your clients owe you.
            <br />
            Go collect.
          </h2>
          <p className="mt-5 max-w-md text-lg text-background/70">
            Set up in two minutes. No card, no password — just your email.
          </p>
          <div className="mt-9">
            <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base">
              <Link href="/login">Start free</Link>
            </Button>
          </div>
        </div>

        {/* oversized responsive wordmark — scales to width, always fully visible */}
        <div className="relative mx-auto max-w-6xl px-6 pb-4">
          <svg
            viewBox="0 0 1200 230"
            preserveAspectRatio="xMidYMid meet"
            className="block w-full"
            aria-hidden
          >
            <text
              x="600"
              y="185"
              textAnchor="middle"
              textLength="1180"
              lengthAdjust="spacingAndGlyphs"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "230px",
                fill: "none",
                stroke: "var(--background)",
                strokeWidth: 2,
                opacity: 0.4,
              }}
            >
              bagdaddy
            </text>
          </svg>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <IconLogo size={18} className="text-muted-foreground" />
            <span className="font-heading font-bold">bagdaddy</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} · made for freelancers</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="grid grid-cols-[180px_1fr] text-left">
      {/* sidebar */}
      <aside className="hidden border-r border-border p-4 sm:block">
        <div className="mb-6 flex items-center gap-2">
          <IconLogo size={16} className="text-foreground" />
          <span className="font-heading text-sm font-bold">bagdaddy</span>
        </div>
        <nav className="space-y-1 text-sm">
          {["Dashboard", "Clients", "Projects", "Time", "Invoices"].map((item, i) => (
            <div
              key={item}
              className={`px-2.5 py-1.5 ${i === 4 ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* main */}
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold tracking-tight">Invoices</h3>
            <p className="text-xs text-muted-foreground">11 clients · 6 active projects</p>
          </div>
          <span className="border border-border px-3 py-1.5 text-xs">New invoice</span>
        </div>

        <div className="grid grid-cols-3 gap-px overflow-hidden border border-border bg-border">
          {[["Earned", "$48,920"], ["Outstanding", "$4,360"], ["Overdue", "$800"]].map(([l, v]) => (
            <div key={l} className="bg-card p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</p>
              <p className="mt-1 font-heading text-lg font-bold">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-hidden border border-border">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Client</span>
            <span className="w-20 text-right">Amount</span>
            <span className="w-16 text-right">Status</span>
          </div>
          {[
            ["Studio Collective", "$4,360", "Paid"],
            ["Northwind Co.", "$2,100", "Sent"],
            ["Atlas Media", "$1,840", "Overdue"],
            ["Bright Labs", "$960", "Draft"],
          ].map(([client, amount, status]) => (
            <div key={client} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0">
              <span>{client}</span>
              <span className="w-20 text-right font-mono">{amount}</span>
              <span className="flex w-16 justify-end">
                <span className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
