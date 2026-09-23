export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { IconLogo } from "@/components/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  InvoiceIcon,
  DollarSquareIcon,
  Link01Icon,
  ArrowUpRightIcon,
  UserGroupIcon,
  FolderOpenIcon,
} from "@hugeicons/core-free-icons";
import { LandingNav } from "@/components/landing/nav";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
      {children}
    </p>
  );
}

function StatusPill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "paid" | "overdue";
}) {
  const tones = {
    default: "border-border text-muted-foreground",
    paid: "border-foreground/40 bg-foreground text-background",
    overdue: "border-border bg-muted text-foreground",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] sm:text-[10px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  hero = false,
}: {
  label: string;
  value: string;
  sub?: string;
  hero?: boolean;
}) {
  return (
    <div className={`min-w-0 border-r border-border px-5 py-4 sm:px-6 sm:py-5 ${hero ? "bg-muted/40" : ""} ${sub ? "col-span-2" : ""}`}>
      <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
        {label}
      </p>
      <p
        className={`mt-1.5 font-heading font-extrabold tracking-tight ${
          hero ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-xs text-muted-foreground">
          hours logged across 11 clients
        </p>
      ) : null}
    </div>
  );
}

const INVOICE_ROWS = [
  { client: "Studio Collective", due: "Jun 15", amount: "$2,400", status: "Paid", paidd: true },
  { client: "Northwind Co.", due: "Jun 20", amount: "$1,960", status: "Sent" },
  { client: "Atlas Media", due: "Jun 02", amount: "$1,840", status: "Overdue", overdue: true },
  { client: "Bright Labs", due: "Jun 28", amount: "$960", status: "Draft" },
];

function DashboardFrame() {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <IconLogo size={15} className="text-foreground" />
          <span className="font-heading text-sm font-bold tracking-tight">bagdaddy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-sm bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
            Economy
          </span>
          <span className="h-6 w-6 border border-border" />
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        <StatCard label="Total earned" value="$48,920" sub hero />
        <StatCard label="Outstanding" value="$4,360" sub />
        <StatCard label="Overdue" value="$800" sub />
        <StatCard label="Active projects" value="6" sub />
      </div>

      <div className="border-b border-border px-5 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-sm font-bold tracking-tight">Invoices</h3>
          <span className="inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
            <HugeiconsIcon icon={InvoiceIcon} size={12} strokeWidth={2} className="text-muted-foreground" />
            New invoice
          </span>
        </div>
      </div>

      <div className="hidden grid-cols-[1fr_110px_90px_90px] gap-2 border-b border-border px-5 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:grid sm:px-6">
        <span>Client</span>
        <span className="text-right">Due</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Status</span>
      </div>

      {INVOICE_ROWS.map((row) => (
        <div
          key={row.client}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-border px-5 py-2.5 last:border-b-0 sm:grid-cols-[1fr_110px_90px_90px] sm:px-6"
        >
          <span className="truncate text-sm">{row.client}</span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block sm:text-right">
            {row.due}
          </span>
          <span className="font-mono text-sm sm:text-right">{row.amount}</span>
          <span className="flex justify-end">
            <StatusPill tone={row.paidd ? "paid" : row.overdue ? "overdue" : "default"}>
              {row.paidd ? "✓ Paid" : row.status}
            </StatusPill>
          </span>
        </div>
      ))}
    </div>
  );
}

function TimeEntryCard() {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Today
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
          <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={2} className="text-muted-foreground" />
          6h 20m
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="mb-3 text-sm font-medium">Redesign · landing</p>
        <div className="flex items-center justify-between border-t border-dashed border-border pt-3">
          <span className="text-xs text-muted-foreground">en route → invoice</span>
          <span className="font-heading text-lg font-extrabold tracking-tight">$510</span>
        </div>
      </div>
    </div>
  );
}

function InvoiceLinkCard() {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-xs font-semibold">INV-0042</span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <HugeiconsIcon icon={ArrowUpRightIcon} size={12} strokeWidth={2} />
          public page
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="font-heading text-2xl font-extrabold tracking-tight">$2,400</p>
        <p className="mt-1 text-xs text-muted-foreground">Studio Collective · due Jun 15</p>
        <div className="mt-4 flex items-center gap-2 border border-border bg-background px-3 py-2">
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            bagdaddy.app/i/x7k2qa
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em]">
            <HugeiconsIcon icon={Link01Icon} size={11} strokeWidth={2} className="text-muted-foreground" />
            Copy
          </span>
        </div>
      </div>
    </div>
  );
}

function PaidCard() {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-xs font-semibold">INV-0041</span>
        <StatusPill tone="paid">✓ Paid</StatusPill>
      </div>
      <div className="px-4 py-4">
        <p className="font-heading text-2xl font-extrabold tracking-tight">$1,275</p>
        <p className="mt-1 text-xs text-muted-foreground">Atlas Media · paid Jun 02</p>
        <p className="mt-4 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
          removed from outstanding. 0 chasing later.
        </p>
      </div>
    </div>
  );
}

const STEP_COPY = [
  {
    number: "01",
    title: "Track the work",
    body: "Log hours against any project. It becomes money the moment it happens.",
    card: "time",
  },
  {
    number: "02",
    title: "Send the link",
    body: "Every invoice is a public page. Copy the link, your client opens and pays.",
    card: "invoice",
  },
  {
    number: "03",
    title: "Watch it get paid",
    body: "The dashboard shows earned, outstanding, overdue. Late ones flag themselves.",
    card: "paid",
  },
] as const;

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <LandingNav />

      {/* statement */}
      <section className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <Kicker>Freelance invoicing</Kicker>
          <h1 className="mt-7 font-heading text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Get paid for every
            <br className="hidden sm:block" />
            hour you work.
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Log hours, turn them into invoices, send a link. Nothing slips
            through, and you go back to the work.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/login">Start free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <a href="#how">How it works</a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No card. No password. Just your email.
          </p>
        </div>
      </section>

      {/* the product, shown honestly */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-20 md:pb-28">
        <DashboardFrame />
      </section>

      {/* how it works */}
      <section id="how" className="scroll-mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker>How it works</Kicker>
            <h2 className="mt-6 font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Three steps.
              <br className="hidden sm:block" />
              No spreadsheet.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-6">
            {STEP_COPY.map(({ number, title, body, card }) => (
              <div key={number} className="flex min-w-0 flex-col">
                <div className="mb-5 h-full">
                  {card === "time" ? (
                    <TimeEntryCard />
                  ) : card === "invoice" ? (
                    <InvoiceLinkCard />
                  ) : (
                    <PaidCard />
                  )}
                </div>
                <p className="font-mono text-xs text-muted-foreground">{number}</p>
                <h3 className="mt-3 font-heading text-xl font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* the close */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center md:py-32">
          <div className="mx-auto flex max-w-md flex-col items-center border border-border bg-card px-6 py-8 sm:px-10">
            <div className="flex w-full items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <HugeiconsIcon icon={DollarSquareIcon} size={12} strokeWidth={2} />
                This quarter
              </span>
              <StatusPill tone="paid">✓ Paid on time</StatusPill>
            </div>
            <p className="mt-5 font-heading text-5xl font-extrabold tracking-tight sm:text-6xl">
              $48,920
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              hours turned into invoices, money in the bank
            </p>
            <div className="mt-6 h-1 w-full bg-muted">
              <div className="h-full w-full bg-foreground" />
            </div>
          </div>

          <h2 className="mt-14 max-w-2xl font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            The money you worked for, finally in your hands.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Set up in two minutes. No card, no password, just your email.
          </p>
          <div className="mt-9">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/login">Start free</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-9 sm:flex-row">
          <div className="flex items-center gap-2">
            <IconLogo size={18} className="text-muted-foreground" />
            <span className="font-heading text-sm font-bold">bagdaddy</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={UserGroupIcon} size={13} strokeWidth={2} /> Clients
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={FolderOpenIcon} size={13} strokeWidth={2} /> Projects
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={InvoiceIcon} size={13} strokeWidth={2} /> Invoices
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} · made for freelancers
          </p>
        </div>
      </footer>
    </div>
  );
}