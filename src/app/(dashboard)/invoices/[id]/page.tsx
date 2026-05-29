export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { InvoiceEditor } from "./editor";

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
    .select({ invoice: invoices, clientName: clients.name })
    .from(invoices)
    .innerJoin(clients, eq(invoices.clientId, clients.id))
    .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)));

  if (!row) notFound();

  const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));
  const allClients = await db.select().from(clients).where(eq(clients.userId, user.id));

  return <InvoiceEditor invoice={row.invoice} items={items} clients={allClients} />;
}
