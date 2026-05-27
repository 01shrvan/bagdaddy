import { db } from "@/lib/db";
import { invoices, clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  SENT: "secondary",
  PAID: "default",
  OVERDUE: "destructive",
};

export function RecentInvoicesSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-3 animate-pulse">
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
          <div className="h-3.5 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export async function RecentInvoices() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const rows = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      totalAmount: invoices.totalAmount,
      status: invoices.status,
      clientName: clients.name,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .where(eq(invoices.userId, user.id))
    .orderBy(desc(invoices.createdAt))
    .limit(5);

  if (!rows.length) {
    return (
      <div className="px-5 py-10 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No invoices yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between px-5 py-3 gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{row.clientName}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.invoiceNumber}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-medium">${parseFloat(row.totalAmount).toFixed(2)}</span>
            <Badge variant={STATUS_VARIANTS[row.status]}>
              {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
