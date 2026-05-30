"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  InvoiceIcon,
  Clock01Icon,
  DollarSquareIcon,
  Link01Icon,
  Alert02Icon,
  AddInvoiceIcon,
} from "@hugeicons/core-free-icons";

const FEATURES = [
  { icon: InvoiceIcon, title: "Smart invoicing", desc: "Create, customize, and share invoices via a public link — no account needed for your client." },
  { icon: Clock01Icon, title: "Time tracking", desc: "Log hours against projects with one click. See total time and earnings per project instantly." },
  { icon: DollarSquareIcon, title: "Earnings overview", desc: "Dashboard shows total earned, outstanding, and per-project breakdown at a glance." },
  { icon: Link01Icon, title: "Public invoice links", desc: "Every invoice gets a unique shareable URL. Copy the link, send it — client sees a clean page." },
  { icon: Alert02Icon, title: "Auto overdue detection", desc: "Invoices past their due date automatically flip to overdue. No manual chasing required." },
  { icon: AddInvoiceIcon, title: "Instant invoice generation", desc: "Turn logged time entries into invoice line items in one click. Hours × rate = done." },
];

export function FeatureCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
      {FEATURES.map(({ icon, title, desc }, i) => (
        <div
          key={title}
          style={{
            padding: "40px 36px",
            border: "1px solid #C8C0B4",
            marginLeft: i % 3 !== 0 ? -1 : 0,
            marginTop: i >= 3 ? -1 : 0,
            transition: "background 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE7DC")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ width: 40, height: 40, border: "1px solid #C8C0B4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} style={{ color: "#111010" }} />
          </div>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#111010", margin: "0 0 10px", letterSpacing: "-0.3px" }}>{title}</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#6B6461", margin: 0, lineHeight: 1.65 }}>{desc}</p>
        </div>
      ))}
    </div>
  );
}
