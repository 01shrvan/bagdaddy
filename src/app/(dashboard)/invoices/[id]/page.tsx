export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { InvoiceEditor } from "../invoice-editor";

export default async function InvoiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const [row] = await db
    .select({ invoice: invoices })
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)));

  if (!row) notFound();

  const [items, allClients] = await Promise.all([
    db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id)),
    db.select().from(clients).where(eq(clients.userId, user.id)),
  ]);

  return <InvoiceEditor invoice={row.invoice} items={items} clients={allClients} />;
}
