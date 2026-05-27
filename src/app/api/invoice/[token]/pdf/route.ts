import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { InvoicePDF } from "@/components/invoice-pdf";

export const dynamic = "force-dynamic";

function fmt(date: Date | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
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

  if (!row) return new Response("Not found", { status: 404 });

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, row.invoice.id));

  const { invoice, clientName, clientEmail, fromEmail, fromName } = row;
  const displayName = fromName ?? fromEmail.split("@")[0];

  const buffer = await renderToBuffer(
    createElement(InvoicePDF, {
      invoiceNumber: invoice.invoiceNumber,
      fromName: displayName,
      fromEmail,
      clientName,
      clientEmail,
      issueDate: fmt(invoice.createdAt) ?? "",
      dueDate: fmt(invoice.dueDate),
      items,
      totalAmount: invoice.totalAmount,
      notes: invoice.notes,
    }),
  );

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
