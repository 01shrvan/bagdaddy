import Link from "next/link";
import { db } from "@/lib/db";
import { projects, clients, timeEntries } from "@/lib/db/schema";
import { eq, and, inArray, desc, sum, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export function ActiveProjectsSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-3 animate-pulse">
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
          <div className="h-3.5 w-12 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export async function ActiveProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, user.id));

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      hourlyRate: projects.hourlyRate,
      clientName: clients.name,
      totalHours: sum(timeEntries.hours),
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(timeEntries, eq(timeEntries.projectId, projects.id))
    .where(and(inArray(projects.clientId, userClients), sql`${projects.status} = 'ACTIVE'::project_status`))
    .groupBy(projects.id, clients.name)
    .orderBy(desc(projects.createdAt))
    .limit(5);

  if (!rows.length) {
    return (
      <div className="px-5 py-10 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {rows.map((row) => {
        const earned = (parseFloat(row.totalHours ?? "0") * parseFloat(row.hourlyRate)).toFixed(2);
        return (
          <Link
            key={row.id}
            href="/projects"
            className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-muted/40 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{row.name}</p>
              <p className="text-xs text-muted-foreground">{row.clientName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium">${parseFloat(earned).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">${parseFloat(row.hourlyRate).toFixed(0)}/hr</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
