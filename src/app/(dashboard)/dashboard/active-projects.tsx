import { db } from "@/lib/db";
import { projects, clients } from "@/lib/db/schema";
import { eq, inArray, sql, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

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
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(inArray(projects.clientId, userClients))
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
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between px-5 py-3 gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.clientName}</p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            ${parseFloat(row.hourlyRate).toFixed(0)}/hr
          </span>
        </div>
      ))}
    </div>
  );
}
