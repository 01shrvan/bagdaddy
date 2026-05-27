import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  SENT: "bg-neutral-100 text-neutral-600",
  PAID: "bg-neutral-900 text-neutral-50",
  OVERDUE: "bg-neutral-100 text-neutral-600",
};

function fmt(date: Date | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const [row] = await db
    .select({
      invoice: invoices,
      clientName: clients.name,
      clientEmail: clients.email,
      fromEmail: users.email,
      fromName: users.name,
    })
    .from(invoices)
    .innerJoin(clients, eq(invoices.clientId, clients.id))
    .innerJoin(users, eq(invoices.userId, users.id))
    .where(eq(invoices.publicToken, token));

  if (!row) notFound();

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, row.invoice.id));

  const { invoice, clientName, clientEmail, fromEmail, fromName } = row;
  const displayName = fromName ?? fromEmail.split("@")[0];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-semibold tracking-tight text-neutral-400">bagdaddy</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[invoice.status]}`}>
            {STATUS_LABEL[invoice.status]}
          </span>
        </div>

        <div className="border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-2xl font-semibold tracking-tight">Invoice</p>
              <p className="text-sm text-neutral-400 mt-0.5 font-mono">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">${parseFloat(invoice.totalAmount).toFixed(2)}</p>
              {invoice.dueDate && (
                <p className="text-xs text-neutral-400 mt-0.5">due {fmt(invoice.dueDate)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">From</p>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-neutral-500">{fromEmail}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">To</p>
              <p className="text-sm font-medium">{clientName}</p>
              {clientEmail && <p className="text-xs text-neutral-500">{clientEmail}</p>}
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 mb-6">
            <div className="grid grid-cols-[1fr_60px_90px_90px] gap-2 mb-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">Description</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 text-center">Qty</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 text-right">Unit price</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 text-right">Total</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_60px_90px_90px] gap-2 py-3">
                  <p className="text-sm">{item.description}</p>
                  <p className="text-sm text-center text-neutral-500">{item.quantity}</p>
                  <p className="text-sm text-right text-neutral-500">${parseFloat(item.unitPrice).toFixed(2)}</p>
                  <p className="text-sm text-right font-medium">${parseFloat(item.total).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-neutral-200 pt-5">
            <div className="flex items-center gap-8">
              <p className="text-sm text-neutral-500">Total</p>
              <p className="text-xl font-semibold">${parseFloat(invoice.totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 border-t border-neutral-100 pt-6">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Notes</p>
              <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Sent via <span className="font-medium">bagdaddy</span>
        </p>
      </div>
    </div>
  );
}
