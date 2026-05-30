export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clients, projects, timeEntries } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { InvoiceEditor } from "../invoice-editor";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from: projectId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, user.id));
  const allClients = await db.select().from(clients).where(eq(clients.userId, user.id));

  let prefillClientId: string | undefined;
  let prefillItems: { description: string; quantity: string; unitPrice: string }[] = [];

  if (projectId) {
    const [project] = await db.select().from(projects)
      .where(and(eq(projects.id, projectId), inArray(projects.clientId, userClients)));

    if (project) {
      prefillClientId = project.clientId;
      const entries = await db.select().from(timeEntries)
        .where(eq(timeEntries.projectId, projectId));

      if (entries.length > 0) {
        prefillItems = entries.map((e) => ({
          description: e.description ?? `${project.name} — time`,
          quantity: e.hours,
          unitPrice: project.hourlyRate,
        }));
      } else {
        prefillItems = [{ description: project.name, quantity: "1", unitPrice: project.hourlyRate }];
      }
    }
  }

  return (
    <InvoiceEditor
      clients={allClients}
      prefillClientId={prefillClientId}
      prefillItems={prefillItems.length > 0 ? prefillItems : undefined}
    />
  );
}
