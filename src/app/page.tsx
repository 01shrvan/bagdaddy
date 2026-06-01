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
      <section className="border-b border-border px-6 py-32 md:py-48">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-16">
            <h1 className="font-heading font-black text-6xl md:text-7xl leading-tight tracking-tight mb-6">
              Track work. Get paid.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Clients, projects, hours, invoices. Everything freelancers need to bill and get paid, in one place.
            </p>
            <Button asChild size="lg">
              <Link href="/login">Get started free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* INVOICE PREVIEW */}
      <section className="border-b border-border px-6 py-32 md:py-48">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-12">Product</p>

          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <IconLogo size={24} className="text-foreground" />
                <span className="font-heading font-bold text-lg">bagdaddy</span>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground rounded">
                PAID
              </span>
            </div>

            {/* Body */}
            <div className="p-8 md:p-12 space-y-8">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Invoice</p>
                  <p className="font-heading font-black text-3xl">INV-0047</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Amount</p>
                  <p className="font-heading font-black text-3xl">$4,360</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Due</p>
                  <p className="text-lg font-medium">Jun 15, 2026</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-8 border-t border-b border-border py-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">From</p>
                  <p className="font-semibold">Shrvan Benke</p>
                  <p className="text-sm text-muted-foreground">shrvan@studio.co</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Bill to</p>
                  <p className="font-semibold">Studio Collective</p>
                  <p className="text-sm text-muted-foreground">hi@studioco.xyz</p>
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-4">
                {[
                  { desc: 'Website redesign & development', h: '40h', rate: '$85/hr', amount: '$3,400' },
                  { desc: 'Brand identity & style guide', h: '8h', rate: '$120/hr', amount: '$960' }
                ].map(({ desc, h, rate, amount }) => (
                  <div key={desc} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm">{desc}</span>
                    <span className="flex gap-6 ml-auto font-mono text-sm text-muted-foreground">
                      <span className="w-10 text-right">{h}</span>
                      <span className="w-16 text-right">{rate}</span>
                      <span className="w-20 text-right font-semibold text-foreground">{amount}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-end justify-between pt-4">
                <p className="text-sm text-muted-foreground">Net 30 · Bank transfer accepted</p>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total due</p>
                  <p className="font-heading font-black text-4xl">$4,360</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            Your client sees this when you share the invoice link. Clean, simple, ready to pay.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border px-6 py-32 md:py-48">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading font-black text-5xl md:text-6xl leading-tight tracking-tight mb-16">
            The flow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-12">
              {[
                { n: '1', title: 'Add clients', desc: 'Name, email, address. Your whole roster in one place.' },
                { n: '2', title: 'Create projects', desc: 'Set a name and hourly rate for the work.' }
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30">
                    <span className="font-heading font-black text-lg">{n}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-12">
              {[
                { n: '3', title: 'Log hours daily', desc: 'Track time against any project. Takes 30 seconds.' },
                { n: '4', title: 'Share invoice', desc: 'Copy the link. Send it. They view and pay immediately.' }
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30">
                    <span className="font-heading font-black text-lg">{n}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border px-6 py-32 md:py-48">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading font-black text-5xl md:text-6xl leading-tight tracking-tight mb-16">
            Know exactly what's owed.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total earned', value: '$48,920' },
              { label: 'Outstanding invoices', value: '$4,360' },
              { label: 'Overdue (30+ days)', value: '$800' },
              { label: 'Active clients', value: '11' }
            ].map(({ label, value }) => (
              <div key={label} className="border border-border rounded-lg p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
                <p className="font-heading font-black text-3xl">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-48">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="font-heading font-black text-5xl md:text-6xl leading-tight tracking-tight">
            Your clients owe you.
          </h2>
          <p className="text-xl text-muted-foreground">
            Start invoicing in minutes. Track who owes what. Get paid.
          </p>
          <div>
            <Button asChild size="lg">
              <Link href="/login">Start free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconLogo size={20} className="text-foreground" />
            <span className="font-heading font-bold">bagdaddy</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} · Made for freelancers</p>
        </div>
      </footer>
    </div>
  );
}
