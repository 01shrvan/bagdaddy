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
  { icon: DollarSquareIcon, title: "Earnings overview", desc: "Your dashboard shows total earned, outstanding, and per-project breakdown at a glance." },
  { icon: Link01Icon, title: "Public invoice links", desc: "Every invoice gets a unique shareable URL. Copy, send, done — your client sees a clean page." },
  { icon: Alert02Icon, title: "Auto overdue detection", desc: "Invoices past their due date flip to overdue automatically. No manual chasing required." },
  { icon: AddInvoiceIcon, title: "Instant generation", desc: "Turn logged time entries into invoice line items in one click. Hours times rate, calculated." },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
      {FEATURES.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="group border-b border-r border-border p-8 transition-colors hover:bg-muted/40"
        >
          <div className="mb-6 flex h-10 w-10 items-center justify-center border border-border transition-colors group-hover:border-foreground/30">
            <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} className="text-foreground" />
          </div>
          <p className="font-heading text-base font-bold tracking-tight text-foreground mb-2">{title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  );
}
