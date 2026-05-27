import { Suspense } from "react";
import Link from "next/link";
import { Stats, StatsSkeleton } from "./stats";
import { Container } from "@/components/container";
import { RecentInvoices, RecentInvoicesSkeleton } from "./recent-invoices";
import { ActiveProjects, ActiveProjectsSkeleton } from "./active-projects";

export default function DashboardPage() {
  return (
    <Container>
      <main className="space-y-8">

        {/* ── Overview header ── */}
        <section className="space-y-1">
          <h1 className="font-semibold text-3xl tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">
            A snapshot of your freelance business — earnings, projects, and clients.
          </p>
        </section>

        {/* ── Stats ── */}
        <Suspense fallback={<StatsSkeleton />}>
          <Stats />
        </Suspense>

        {/* ── Recent activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="border">
            <div className="flex items-center justify-between px-5 py-3.5 border-b">
              <h2 className="text-sm font-medium">Recent invoices</h2>
              <Link href="/invoices" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all
              </Link>
            </div>
            <Suspense fallback={<RecentInvoicesSkeleton />}>
              <RecentInvoices />
            </Suspense>
          </section>

          <section className="border">
            <div className="flex items-center justify-between px-5 py-3.5 border-b">
              <h2 className="text-sm font-medium">Active projects</h2>
              <Link href="/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all
              </Link>
            </div>
            <Suspense fallback={<ActiveProjectsSkeleton />}>
              <ActiveProjects />
            </Suspense>
          </section>
        </div>

      </main>
    </Container>
  );
}
