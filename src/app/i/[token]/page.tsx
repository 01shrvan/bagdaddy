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

function fmt(date: Date | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function money(val: string | null | undefined) {
  const n = parseFloat(val ?? "0");
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
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
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.2px", color: "#a3a3a3" }}>bagdaddy</span>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          padding: "3px 10px",
          border: "1px solid #e5e5e5",
          color: invoice.status === "PAID" ? "#166534" : invoice.status === "OVERDUE" ? "#991b1b" : "#525252",
          backgroundColor: invoice.status === "PAID" ? "#f0fdf4" : invoice.status === "OVERDUE" ? "#fef2f2" : "#fafafa",
        }}>
          {STATUS_LABEL[invoice.status]}
        </span>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", padding: "40px 44px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.5px", margin: 0 }}>Invoice</p>
            <p style={{ fontSize: 13, color: "#a3a3a3", fontFamily: "monospace", margin: "4px 0 0" }}>{invoice.invoiceNumber}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#0a0a0a", margin: 0 }}>{money(invoice.totalAmount)}</p>
            {invoice.dueDate && (
              <p style={{ fontSize: 12, color: "#a3a3a3", margin: "4px 0 0" }}>due {fmt(invoice.dueDate)}</p>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: "0 0 6px" }}>From</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", margin: "0 0 2px" }}>{displayName}</p>
            <p style={{ fontSize: 12, color: "#737373", margin: 0 }}>{fromEmail}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: "0 0 6px" }}>To</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", margin: "0 0 2px" }}>{clientName}</p>
            {clientEmail && <p style={{ fontSize: 12, color: "#737373", margin: 0 }}>{clientEmail}</p>}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 24, marginBottom: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 100px 100px", gap: 8, marginBottom: 12 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: 0 }}>Description</p>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: 0, textAlign: "center" }}>Qty</p>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: 0, textAlign: "right" }}>Unit price</p>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: 0, textAlign: "right" }}>Total</p>
          </div>

          {items.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 72px 100px 100px", gap: 8, padding: "12px 0", borderTop: "1px solid #f5f5f5" }}>
              <p style={{ fontSize: 13, color: "#0a0a0a", margin: 0 }}>{item.description || "—"}</p>
              <p style={{ fontSize: 13, color: "#737373", margin: 0, textAlign: "center" }}>{item.quantity}</p>
              <p style={{ fontSize: 13, color: "#737373", margin: 0, textAlign: "right" }}>{money(item.unitPrice)}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", margin: 0, textAlign: "right" }}>{money(item.total)}</p>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 32, borderTop: "1px solid #e5e5e5", paddingTop: 16, marginTop: 4 }}>
            <p style={{ fontSize: 13, color: "#737373", margin: 0 }}>Total</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#0a0a0a", margin: 0 }}>{money(invoice.totalAmount)}</p>
          </div>
        </div>

        {invoice.notes && (
          <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 32, paddingTop: 24 }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a3a3a3", margin: "0 0 8px" }}>Notes</p>
            <p style={{ fontSize: 13, color: "#525252", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{invoice.notes}</p>
          </div>
        )}

        {invoice.createdAt && (
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #f5f5f5" }}>
            <p style={{ fontSize: 11, color: "#d4d4d4", margin: 0 }}>Issued {fmt(invoice.createdAt)}</p>
          </div>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#d4d4d4", marginTop: 24 }}>
        Sent via <strong style={{ color: "#a3a3a3" }}>bagdaddy</strong>
      </p>
    </div>
  );
}
