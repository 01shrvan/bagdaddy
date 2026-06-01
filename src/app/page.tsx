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
      <section className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm text-muted-foreground">Freelance finance simplified</p>
          <h1 className="mb-6 font-heading text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Track your work.
            <br />
            Get paid.
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Clients, projects, time tracking, and invoices — all in one place.
            Log hours, generate invoices, and send shareable links. No spreadsheets, no friction.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">Start free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Learn more</a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Free. No credit card. Email login only.
          </p>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 space-y-2">
            <h2 className="font-heading text-3xl font-bold">What your client sees</h2>
            <p className="text-muted-foreground">A clean invoice page. They view, they pay. No account needed.</p>
          </div>
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-8 py-5">
              <div className="flex items-center gap-2">
                <IconLogo size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">bagdaddy</span>
              </div>
              <span className="text-xs text-muted-foreground">Sent</span>
            </div>
            <div className="space-y-8 px-8 py-8 md:py-12">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Invoice</p>
                  <p className="text-2xl font-bold">INV-0047</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-xs text-muted-foreground">Due</p>
                  <p className="text-sm font-semibold">Jun 15, 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">From</p>
                  <p className="font-semibold">Shrvan Benke</p>
                  <p className="text-sm text-muted-foreground">shrvan@studio.co</p>
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Bill to</p>
                  <p className="font-semibold">Studio Collective</p>
                  <p className="text-sm text-muted-foreground">hi@studioco.xyz</p>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                {[
                  ["Website redesign & development", "40h", "$85", "$3,400.00"],
                  ["Brand identity system", "8h", "$120", "$960.00"],
                ].map(([desc, qty, rate, amount]) => (
                  <div key={desc} className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
                    <span className="text-sm">{desc}</span>
                    <span className="ml-auto flex w-32 items-center justify-end gap-4 font-mono text-sm text-muted-foreground">
                      <span>{qty}</span>
                      <span>{rate}</span>
                    </span>
                    <span className="ml-4 w-24 text-right font-semibold">{amount}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-end justify-between border-t border-border pt-8">
                <p className="text-sm text-muted-foreground">Net 30 · Bank transfer accepted</p>
                <div className="text-right">
                  <p className="mb-1 text-xs text-muted-foreground">Total due</p>
                  <p className="text-4xl font-bold">$4,360</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 font-heading text-3xl font-bold">Five simple steps</h2>
          <div className="space-y-8">
            {[
              { n: "01", label: "Add clients", desc: "Name, email, address. Your whole roster in one place." },
              { n: "02", label: "Create projects", desc: "Give each a name and hourly rate." },
              { n: "03", label: "Log hours daily", desc: "Track time against any active project." },
              { n: "04", label: "Generate invoices", desc: "Hours auto-fill as line items. One click." },
              { n: "05", label: "Get paid", desc: "Share the link. They view, they pay." },
            ].map(({ n, label, desc }) => (
              <div key={n} className="flex gap-8">
                <span className="mt-1 font-mono text-sm font-medium text-muted-foreground">{n}</span>
                <div>
                  <h3 className="font-semibold">{label}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold">Ready to get paid?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Start tracking work and sending invoices in minutes.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Start free today</Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <IconLogo size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">bagdaddy</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} · made for freelancers</p>
        </div>
      </footer>
    </div>
  );
}
