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

const RULED_BG = {
  backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, #C8C0B480 47px, #C8C0B480 48px)",
};

const STEPS = [
  { n: "01", label: "Add client", desc: "Name, email, address" },
  { n: "02", label: "Create project", desc: "Set the hourly rate" },
  { n: "03", label: "Log hours", desc: "Track time daily" },
  { n: "04", label: "Generate invoice", desc: "Auto-fill from hours" },
  { n: "05", label: "Get paid", desc: "Share the link" },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div style={{ background: "#F2EDE4", minHeight: "100vh" }}>
      <LandingNav />

      {/* HERO */}
      <section
        style={{
          ...RULED_BG,
          position: "relative",
          overflow: "hidden",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          padding: "80px 48px 100px",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -60,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.045,
            pointerEvents: "none",
          }}
        >
          <IconLogo size={680} style={{ color: "#111010" }} />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 420px", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, padding: "6px 14px", border: "1px solid #C8C0B4" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C47F1A", display: "block" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "#6B6461", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                For freelancers
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "clamp(64px, 7.5vw, 108px)",
                lineHeight: 0.95,
                letterSpacing: "-3px",
                color: "#111010",
                margin: "0 0 28px",
              }}
            >
              Track work.<br />
              <span style={{ color: "#C47F1A" }}>Get paid.</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 18,
                fontWeight: 400,
                color: "#6B6461",
                lineHeight: 1.65,
                maxWidth: 440,
                margin: "0 0 48px",
              }}
            >
              Clients, projects, time tracking, and invoices — all in one place.
              Built for freelancers who'd rather be working than doing admin.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#F2EDE4",
                  background: "#111010",
                  textDecoration: "none",
                  padding: "14px 28px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Start free
                <span style={{ fontSize: 18 }}>→</span>
              </Link>
              <a
                href="#how"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#6B6461",
                  textDecoration: "none",
                  padding: "14px 20px",
                  border: "1px solid #C8C0B4",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "border-color 0.15s, color 0.15s",
                }}
              >
                See how it works
                <span style={{ fontSize: 16 }}>↓</span>
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 48, paddingTop: 40, borderTop: "1px solid #C8C0B4" }}>
              {[
                { value: "Free", label: "No credit card" },
                { value: "2 min", label: "Setup time" },
                { value: "OTP", label: "No password" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, color: "#111010", margin: 0, letterSpacing: "-0.5px" }}>{value}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#6B6461", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INVOICE MOCKUP */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #C8C0B4",
              padding: "32px 32px 28px",
              position: "relative",
              boxShadow: "8px 8px 0 #C8C0B4",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C8C0B4", margin: "0 0 6px" }}>Invoice</p>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, color: "#111010", margin: 0, letterSpacing: "-0.5px" }}>INV-0047</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconLogo size={16} style={{ color: "#111010" }} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "#111010" }}>bagdaddy</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C8C0B4", margin: "0 0 6px" }}>From</p>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "#111010", margin: "0 0 2px" }}>Shrvan Benke</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6B6461", margin: 0 }}>shrvan@studio.co</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C8C0B4", margin: "0 0 6px" }}>Bill to</p>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "#111010", margin: "0 0 2px" }}>Studio Collective</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6B6461", margin: 0 }}>hi@studioco.xyz</p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F0EBE3", paddingTop: 20, marginBottom: 16 }}>
              {[
                { desc: "Website redesign", qty: "40h", rate: "$85", total: "$3,400" },
                { desc: "Brand identity", qty: "8h", rate: "$120", total: "$960" },
              ].map((item) => (
                <div key={item.desc} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, marginBottom: 10, alignItems: "center" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#111010", margin: 0 }}>{item.desc}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6B6461", margin: 0 }}>{item.qty}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6B6461", margin: 0 }}>{item.rate}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 12, color: "#111010", margin: 0 }}>{item.total}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #C8C0B4", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#6B6461", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Due Jun 15, 2026</p>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6461", margin: "0 0 2px" }}>Total</p>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, color: "#111010", margin: 0, letterSpacing: "-0.5px" }}>$4,360.00</p>
              </div>
            </div>

            <div style={{
              background: "#111010",
              color: "#F2EDE4",
              textAlign: "center",
              padding: "11px",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}>
              View invoice
              <span style={{ fontSize: 14 }}>→</span>
            </div>

            <div style={{ position: "absolute", top: -10, right: 24, background: "#C47F1A", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px" }}>
              Sent
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="how" style={{ padding: "120px 48px", borderTop: "1px solid #C8C0B4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 64 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: "#C47F1A", letterSpacing: "0.06em" }}>01</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#111010", margin: 0, letterSpacing: "-1.5px", lineHeight: 1 }}>
              From first client<br />to final payment.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", position: "relative" }}>
            <div style={{ position: "absolute", top: 20, left: "10%", right: "10%", height: 1, background: "#C8C0B4", zIndex: 0 }} />
            {STEPS.map(({ n, label, desc }) => (
              <div key={n} style={{ position: "relative", zIndex: 1, paddingRight: 24 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  background: "#F2EDE4",
                  border: "1px solid #C8C0B4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13, color: "#C47F1A" }}>{n}</span>
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#111010", margin: "0 0 6px", letterSpacing: "-0.3px" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#6B6461", margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "0 48px 120px", borderTop: "1px solid #C8C0B4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, margin: "80px 0 56px" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: "#C47F1A", letterSpacing: "0.06em" }}>02</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 52px)", color: "#111010", margin: 0, letterSpacing: "-1.5px", lineHeight: 1 }}>
              Everything you need.<br />Nothing you don't.
            </h2>
          </div>

          <FeatureCards />
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ borderTop: "1px solid #C8C0B4", borderBottom: "1px solid #C8C0B4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { icon: UserGroupIcon, stat: "All your clients", sub: "in one place" },
            { icon: Clock01Icon, stat: "Hours × rate", sub: "auto-calculated" },
            { icon: InvoiceIcon, stat: "Send in seconds", sub: "via shareable link" },
            { icon: ChartIncreaseIcon, stat: "Know what you're owed", sub: "at a glance" },
          ].map(({ icon, stat, sub }, i) => (
            <div key={stat} style={{ padding: "48px 36px", borderLeft: i > 0 ? "1px solid #C8C0B4" : "none", display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 36, height: 36, background: "#111010", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} style={{ color: "#F2EDE4" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#111010", margin: "0 0 4px", letterSpacing: "-0.2px" }}>{stat}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#6B6461", margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#111010", padding: "140px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -100, top: "50%", transform: "translateY(-50%)", opacity: 0.04, pointerEvents: "none" }}>
          <IconLogo size={600} style={{ color: "#F2EDE4" }} />
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#6B6461", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 24px" }}>
            Ready to get organized?
          </p>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: "clamp(52px, 6vw, 88px)",
            color: "#F2EDE4",
            margin: "0 0 16px",
            letterSpacing: "-2.5px",
            lineHeight: 0.95,
          }}>
            Your clients<br />
            <span style={{ color: "#C47F1A" }}>owe you.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 18, color: "rgba(242,237,228,0.5)", margin: "24px 0 52px", maxWidth: 400, lineHeight: 1.6 }}>
            Start tracking, invoicing, and getting paid. Free. No credit card. No nonsense.
          </p>
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              fontWeight: 700,
              color: "#111010",
              background: "#F2EDE4",
              textDecoration: "none",
              padding: "16px 36px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              letterSpacing: "-0.2px",
            }}
          >
            Start free today
            <span style={{ fontSize: 20 }}>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0D0C0C", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconLogo size={20} style={{ color: "#6B6461" }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#6B6461", letterSpacing: "-0.3px" }}>bagdaddy</span>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#3A3736", margin: 0 }}>made for freelancers</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#3A3736", margin: 0 }}>
            © {new Date().getFullYear()} bagdaddy
          </p>
        </div>
      </footer>
    </div>
  );
}
