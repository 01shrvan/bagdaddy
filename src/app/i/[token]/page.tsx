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
  SENT: "bg-blue-50 text-blue-700",
  PAID: "bg-green-50 text-green-700",
  OVERDUE: "bg-red-50 text-red-700",
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
  const pdfUrl = `/api/invoice/${token}/pdf`;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-semibold tracking-tight text-neutral-400">bagdaddy</span>
          <a
            href={pdfUrl}
            download={`${invoice.invoiceNumber}.pdf`}
            className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </a>
        </div>

        <div className="rounded-none border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-2xl font-semibold tracking-tight">Invoice</p>
              <p className="text-sm text-neutral-400 mt-0.5 font-mono">{invoice.invoiceNumber}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[invoice.status]}`}>
              {STATUS_LABEL[invoice.status]}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
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
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">Issue date</p>
              <p className="text-sm">{fmt(invoice.createdAt)}</p>
              {invoice.dueDate && (
                <>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5 mt-3">Due date</p>
                  <p className="text-sm">{fmt(invoice.dueDate)}</p>
                </>
              )}
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
