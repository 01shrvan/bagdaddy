import { Suspense } from "react";
import { Stats } from "./stats";
import { PageHeader } from "@/components/page-header";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-5 h-28 animate-pulse" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Overview" />

      <div className="flex-1 p-6 space-y-8">
        <Suspense fallback={<StatsSkeleton />}>
          <Stats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-medium text-foreground">Recent invoices</h2>
              <a href="/invoices" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all
              </a>
            </div>
            <div className="px-5 py-10 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No invoices yet</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-medium text-foreground">Active projects</h2>
              <a href="/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all
              </a>
            </div>
            <div className="px-5 py-10 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No projects yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
