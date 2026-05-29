export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { InvoiceEditor } from "../invoice-editor";

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const allClients = await db.select().from(clients).where(eq(clients.userId, user.id));

  return <InvoiceEditor clients={allClients} />;
}
