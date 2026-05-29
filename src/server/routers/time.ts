import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { timeEntries, projects, clients } from "@/lib/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import { z } from "zod/v4";

export const timeRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
    const userProjects = db.select({ id: projects.id }).from(projects).where(inArray(projects.clientId, userClients));
    return db
      .select({ entry: timeEntries, projectName: projects.name, clientName: clients.name })
      .from(timeEntries)
      .innerJoin(projects, eq(timeEntries.projectId, projects.id))
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(inArray(timeEntries.projectId, userProjects))
      .orderBy(desc(timeEntries.date));
  }),

  create: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      description: z.string().optional(),
      hours: z.string().min(1),
      date: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
      const [project] = await db.select({ id: projects.id }).from(projects)
        .where(and(eq(projects.id, input.projectId), inArray(projects.clientId, userClients)));
      if (!project) throw new Error("Project not found");
      const [entry] = await db.insert(timeEntries).values({
        projectId: input.projectId,
        description: input.description || null,
        hours: input.hours,
        date: new Date(input.date),
      }).returning();
      return entry;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      projectId: z.string(),
      description: z.string().optional(),
      hours: z.string().min(1),
      date: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
      const userProjects = db.select({ id: projects.id }).from(projects).where(inArray(projects.clientId, userClients));
      const [entry] = await db.update(timeEntries)
        .set({
          projectId: input.projectId,
          description: input.description || null,
          hours: input.hours,
          date: new Date(input.date),
        })
        .where(and(eq(timeEntries.id, input.id), inArray(timeEntries.projectId, userProjects)))
        .returning();
      return entry;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
      const userProjects = db.select({ id: projects.id }).from(projects).where(inArray(projects.clientId, userClients));
      await db.delete(timeEntries).where(and(eq(timeEntries.id, input.id), inArray(timeEntries.projectId, userProjects)));
    }),
});
