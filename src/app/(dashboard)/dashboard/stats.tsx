import { db } from "@/lib/db";
import { invoices, projects, clients } from "@/lib/db/schema";
import { eq, sum, count, and, sql, inArray } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DollarSquareIcon,
  ChartIncreaseIcon,
  FolderOpenIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

function fmt(value: string | null) {
  const n = parseFloat(value ?? "0");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

async function fetchStats(userId: string) {
  const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, userId));

  const [earned, outstanding, activeProjects, totalClients] = await Promise.all([
    db.select({ total: sum(invoices.totalAmount) })
      .from(invoices)
      .where(and(eq(invoices.userId, userId), sql`${invoices.status} = 'PAID'::invoice_status`))
      .then(r => r[0].total),

    db.select({ total: sum(invoices.totalAmount) })
      .from(invoices)
      .where(and(eq(invoices.userId, userId), sql`${invoices.status} IN ('SENT'::invoice_status, 'OVERDUE'::invoice_status)`))
      .then(r => r[0].total),

    db.select({ count: count() })
      .from(projects)
      .where(and(
        inArray(projects.clientId, userClients),
        sql`${projects.status} = 'ACTIVE'::project_status`,
      ))
      .then(r => r[0].count),

    db.select({ count: count() })
      .from(clients)
      .where(eq(clients.userId, userId))
      .then(r => r[0].count),
  ]);

  return { earned, outstanding, activeProjects, totalClients };
}

export async function Stats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const stats = await fetchStats(user.id);

  const cards = [
    { label: "Total earned", value: fmt(stats.earned), icon: DollarSquareIcon, sub: "from paid invoices" },
    { label: "Outstanding", value: fmt(stats.outstanding), icon: ChartIncreaseIcon, sub: "sent & overdue" },
    { label: "Active projects", value: String(stats.activeProjects), icon: FolderOpenIcon, sub: "in progress" },
    { label: "Total clients", value: String(stats.totalClients), icon: UserGroupIcon, sub: "all time" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon, sub }) => (
        <div key={label} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {label}
            </span>
            <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
              <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} className="text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
