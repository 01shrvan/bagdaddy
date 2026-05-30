export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { IconLogo } from "@/components/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InvoiceIcon,
  Clock01Icon,
  UserGroupIcon,
  ChartIncreaseIcon,
} from "@hugeicons/core-free-icons";
import { LandingNav } from "@/components/landing/nav";
import { FeatureCards } from "@/components/landing/features";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh", color: "#1A1208" }}>
      <LandingNav />

      {/* ── HERO ── */}
      <section style={{ padding: "100px 48px 80px", borderBottom: "1px solid #D4CCC0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 48, padding: "5px 14px 5px 10px", border: "1px solid #D4CCC0", background: "#EDE7D8" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8860B", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "#7A6E62", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              For freelancers who get things done
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "flex-end" }}>
            <div>
              <h1 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "clamp(60px, 6.5vw, 96px)",
                lineHeight: 0.92,
                letterSpacing: "-3px",
                color: "#1A1208",
                margin: "0 0 32px",
              }}>
                Track<br />
                work.<br />
                <span style={{ color: "#B8860B" }}>Get paid.</span>
              </h1>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/login" style={{
                  fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
                  color: "#F5F0E8", background: "#1A1208", textDecoration: "none",
                  padding: "13px 28px", display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  Start free <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
                </Link>
                <a href="#how" style={{
                  fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
                  color: "#7A6E62", textDecoration: "none",
                  padding: "13px 24px", border: "1px solid #D4CCC0",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  How it works <span style={{ fontSize: 16, lineHeight: 1 }}>↓</span>
                </a>
              </div>
            </div>

            <div>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 20, lineHeight: 1.65,
                color: "#7A6E62", margin: "0 0 32px", maxWidth: 420,
              }}>
                Clients, projects, time tracking, and invoices in one place.
                Built for freelancers who'd rather be working than doing admin.
              </p>
              <div style={{ display: "flex", gap: 40 }}>
                {[["Free", "No credit card"], ["2 min", "To set up"], ["OTP", "No password"]].map(([v, l]) => (
                  <div key={l}>
                    <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#1A1208", margin: "0 0 2px", letterSpacing: "-0.5px" }}>{v}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#9A8E82", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INVOICE MOCKUP ── */}
      <section style={{ padding: "0 48px", borderBottom: "1px solid #D4CCC0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #D4CCC0",
            borderTop: "none",
            padding: "40px 48px 36px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #EDE7D8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4B8A8", margin: "0 0 4px" }}>Invoice</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#1A1208", margin: 0, letterSpacing: "-0.5px" }}>INV-0047</p>
                </div>
                <div style={{ width: 1, height: 36, background: "#EDE7D8" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4B8A8", margin: "0 0 4px" }}>From</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "#1A1208", margin: 0 }}>Shrvan Benke</p>
                </div>
                <div style={{ width: 1, height: 36, background: "#EDE7D8" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4B8A8", margin: "0 0 4px" }}>Bill to</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "#1A1208", margin: 0 }}>Studio Collective</p>
                </div>
                <div style={{ width: 1, height: 36, background: "#EDE7D8" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4B8A8", margin: "0 0 4px" }}>Due date</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "#1A1208", margin: 0 }}>Jun 15, 2026</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "#B8860B", background: "#FDF5E0", padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Sent</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IconLogo size={16} style={{ color: "#9A8E82" }} />
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "#9A8E82" }}>bagdaddy</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 80px 120px", gap: 16, paddingBottom: 10, borderBottom: "1px solid #EDE7D8", marginBottom: 8 }}>
                {["Description", "Hours", "Rate", "Qty", "Total"].map((h) => (
                  <p key={h} style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#C4B8A8", margin: 0, textAlign: h === "Total" ? "right" : "left" }}>{h}</p>
                ))}
              </div>
              {[
                { desc: "Website redesign & development", hours: "40h", rate: "$85/hr", qty: "1", total: "$3,400.00" },
                { desc: "Brand identity & style guide", hours: "8h", rate: "$120/hr", qty: "1", total: "$960.00" },
              ].map((row) => (
                <div key={row.desc} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 80px 120px", gap: 16, padding: "12px 0", borderBottom: "1px solid #F5F0E8", alignItems: "center" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#1A1208", margin: 0 }}>{row.desc}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#7A6E62", margin: 0 }}>{row.hours}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#7A6E62", margin: 0 }}>{row.rate}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#7A6E62", margin: 0 }}>{row.qty}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "#1A1208", margin: 0, textAlign: "right" }}>{row.total}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#9A8E82", margin: 0 }}>
                Payment terms: Net 30 · Bank transfer accepted
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#9A8E82", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total due</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 32, color: "#1A1208", letterSpacing: "-1px" }}>$4,360.00</span>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#C4B8A8", margin: "12px 0 0", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Your clients see a page like this — no account needed
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "100px 48px", borderBottom: "1px solid #D4CCC0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "#B8860B", textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 16px" }}>How it works</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(36px, 4vw, 60px)", color: "#1A1208", margin: 0, letterSpacing: "-2px", lineHeight: 1 }}>
              From first client<br />to final payment.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, borderTop: "1px solid #D4CCC0" }}>
            {[
              { n: "01", label: "Add client", desc: "Name, email, address — everything in one place." },
              { n: "02", label: "Create project", desc: "Set a name and hourly rate for the work." },
              { n: "03", label: "Log hours", desc: "Track time daily against active projects." },
              { n: "04", label: "Generate invoice", desc: "Auto-fill from logged hours in one click." },
              { n: "05", label: "Get paid", desc: "Share the link. Client pays. Done." },
            ].map(({ n, label, desc }, i) => (
              <div key={n} style={{ padding: "32px 28px 32px 0", borderRight: i < 4 ? "1px solid #D4CCC0" : "none", paddingLeft: i > 0 ? 28 : 0 }}>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, color: "#B8860B", margin: "0 0 20px", letterSpacing: "-0.5px" }}>{n}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#1A1208", margin: "0 0 8px", letterSpacing: "-0.2px" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#7A6E62", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "100px 48px", borderBottom: "1px solid #D4CCC0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "#B8860B", textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 16px" }}>Features</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(36px, 4vw, 60px)", color: "#1A1208", margin: 0, letterSpacing: "-2px", lineHeight: 1 }}>
              Everything you need.<br />Nothing you don't.
            </h2>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ borderBottom: "1px solid #D4CCC0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { icon: UserGroupIcon, headline: "All your clients", sub: "Managed in one place" },
            { icon: Clock01Icon, headline: "Hours × rate", sub: "Auto-calculated earnings" },
            { icon: InvoiceIcon, headline: "Send in seconds", sub: "Via shareable link" },
            { icon: ChartIncreaseIcon, headline: "Know what's owed", sub: "Outstanding at a glance" },
          ].map(({ icon, headline, sub }, i) => (
            <div key={headline} style={{
              padding: "40px 36px",
              borderRight: i < 3 ? "1px solid #D4CCC0" : "none",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{ width: 40, height: 40, background: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HugeiconsIcon icon={icon} size={17} strokeWidth={1.5} style={{ color: "#F5F0E8" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#1A1208", margin: "0 0 4px", letterSpacing: "-0.2px" }}>{headline}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#7A6E62", margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#1A1208", padding: "120px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 64 }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "#6A5A40", textTransform: "uppercase", letterSpacing: "0.14em", margin: "0 0 20px" }}>
              Ready to get organized?
            </p>
            <h2 style={{
              fontFamily: "var(--font-heading)", fontWeight: 900,
              fontSize: "clamp(48px, 5.5vw, 80px)", color: "#F5F0E8",
              margin: "0 0 16px", letterSpacing: "-2.5px", lineHeight: 0.95,
            }}>
              Your clients<br />
              <span style={{ color: "#B8860B" }}>owe you.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 17, color: "#6A5A40", margin: 0, lineHeight: 1.6, maxWidth: 380 }}>
              Start tracking work and sending invoices. Free. No credit card. No password.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
            <Link href="/login" style={{
              fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700,
              color: "#1A1208", background: "#F5F0E8", textDecoration: "none",
              padding: "18px 40px", display: "inline-flex", alignItems: "center", gap: 10,
              letterSpacing: "-0.2px", whiteSpace: "nowrap",
            }}>
              Start free today
              <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
            </Link>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#4A3A28", margin: 0 }}>
              OTP login — your email is all you need
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#120E08", padding: "32px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconLogo size={18} style={{ color: "#4A3A28" }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#4A3A28", letterSpacing: "-0.3px" }}>bagdaddy</span>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2416", margin: 0, letterSpacing: "0.05em" }}>
            made for freelancers
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2416", margin: 0 }}>
            © {new Date().getFullYear()} bagdaddy
          </p>
        </div>
      </footer>
    </div>
  );
}
