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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes float { 0%, 100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
        @keyframes rotate3d { from { transform: perspective(1200px) rotateY(0deg) } to { transform: perspective(1200px) rotateY(2deg) } }
        .animate-in { animation: slideInUp 0.6s ease-out forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-rotate { animation: rotate3d 6s ease-in-out infinite; }
        .invoice-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .invoice-card:hover { transform: translateY(-4px); }
      `}</style>

      <LandingNav />

      {/* HERO - Asymmetric layout */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* LEFT: Text - spans 1.5 columns visually */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                  ← the problem
                </p>
                <h1 className="font-heading font-black leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(48px, 12vw, 96px)' }}>
                  You're losing
                  <br />
                  <span className="text-muted-foreground">thousands</span>
                  <br />
                  chasing invoices.
                </h1>
              </div>

              <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">
                Spreadsheets don't track hours. Google Docs aren't invoices. Email threads disappear. You end up chasing clients for money you already earned.
              </p>

              <div className="pt-4 space-y-4">
                <Button asChild size="lg" className="group">
                  <Link href="/login">
                    Get started free
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">No credit card. No password.</p>
              </div>
            </div>

            {/* RIGHT: Visual - earnings card, floating */}
            <div className="hidden lg:block relative h-96">
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 60%)'
              }} />

              <div className="animate-float absolute right-0 top-0 w-80 space-y-3 rounded-lg border border-border bg-card p-6 shadow-lg">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">This month</p>
                  <p className="font-heading text-4xl font-black">$12,840</p>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Earned</span>
                    <span className="text-sm font-semibold">$12,840</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Outstanding</span>
                    <span className="text-sm font-semibold text-destructive">$4,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Overdue</span>
                    <span className="text-sm font-semibold text-destructive">$800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION - Invoice showcase with overlap */}
      <section className="border-b border-border relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-32 md:py-48">
          <div className="space-y-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
                → the solution
              </p>
              <h2 className="font-heading font-black text-5xl md:text-6xl leading-tight tracking-tight">
                One link.
                <br />
                One click.
                <br />
                Paid.
              </h2>
            </div>

            {/* Invoice - Asymmetric placement */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="invoice-card rounded-lg border border-border bg-card overflow-hidden shadow-xl">
                  {/* Invoice Header */}
                  <div className="bg-muted/30 px-8 py-6 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-2">
                      <IconLogo size={22} className="text-foreground" />
                      <span className="font-heading font-bold">bagdaddy</span>
                    </div>
                    <span className="inline-block bg-emerald-500/15 text-emerald-600 text-xs font-bold px-2.5 py-1.5 rounded border border-emerald-500/30">
                      PAID
                    </span>
                  </div>

                  {/* Invoice Body */}
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground font-mono mb-2">Invoice</p>
                        <p className="font-heading text-3xl font-black">0047</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground font-mono mb-2">Amount</p>
                        <p className="font-heading text-3xl font-black">$4,360</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground font-mono mb-2">Due</p>
                        <p className="font-mono text-sm">Jun 15</p>
                      </div>
                    </div>

                    <div className="border-t border-b border-border py-6 space-y-3">
                      {[
                        { desc: 'Website redesign', h: '40h', rate: '$85', amt: '$3,400' },
                        { desc: 'Brand system', h: '8h', rate: '$120', amt: '$960' }
                      ].map(({ desc, h, rate, amt }) => (
                        <div key={desc} className="flex items-center justify-between text-sm">
                          <span>{desc}</span>
                          <span className="ml-auto flex gap-6 text-muted-foreground font-mono text-xs">
                            <span className="w-8 text-right">{h}</span>
                            <span className="w-12 text-right">{rate}</span>
                            <span className="w-16 text-right font-semibold text-foreground">{amt}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Net 30 • Bank transfer</span>
                      <span className="font-heading font-black text-lg">$4,360</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Copy + CTA */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm uppercase text-muted-foreground tracking-wider font-mono">What it does</p>
                  <h3 className="font-heading font-black text-3xl leading-tight">
                    Your client gets this.
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    A clean, branded invoice page. No account. No friction. They view it, they pay it. That's it.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <p className="text-xs uppercase text-muted-foreground tracking-wider font-mono">The flow</p>
                  <ul className="space-y-2 text-sm">
                    {['Log hours daily', 'Generate invoice', 'Copy the link', 'They pay'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS - 2-column break */}
      <section className="border-b border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <div className="space-y-4">
              <p className="text-4xl md:text-5xl font-heading font-black leading-tight">
                Know exactly
                <br />
                what's owed.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Dashboard shows earned, outstanding, overdue. Sorted by client. Sorted by project. See which invoices are dragging.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Total earned', value: '$48,920' },
                { label: 'Outstanding', value: '$4,360' },
                { label: 'Overdue 30+ days', value: '$800' },
                { label: 'Active projects', value: '6' }
              ].map(({ label, value }) => (
                <div key={label} className="flex items-end justify-between border-b border-border/50 pb-4">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-heading font-black text-2xl">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-48">
        <div className="mx-auto max-w-5xl text-center space-y-8">
          <h2 className="font-heading font-black text-5xl md:text-6xl leading-tight tracking-tight">
            Stop leaving money on the table.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track time. Generate invoices. Share links. Get paid. All in one place, in under 2 minutes to set up.
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/login">
              Start free
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER - Minimal but designed */}
      <footer className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-border">
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-3">Product</p>
              <Link href="/login" className="text-sm hover:text-foreground transition-colors text-muted-foreground">Get started</Link>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-3">Company</p>
              <Link href="/login" className="text-sm hover:text-foreground transition-colors text-muted-foreground">Sign in</Link>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-3">Built by</p>
              <p className="text-sm text-muted-foreground">@shrvan</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-3">Status</p>
              <p className="text-sm text-muted-foreground">Live & free</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconLogo size={18} className="text-muted-foreground" />
              <span className="font-heading font-bold">bagdaddy</span>
            </div>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
