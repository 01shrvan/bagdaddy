import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { projects, clients, invoices } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { z } from "zod/v4";

export const projectsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
    return db
      .select({ project: projects, clientName: clients.name })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(inArray(projects.clientId, userClients))
      .orderBy(projects.createdAt);
  }),

  create: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      name: z.string().min(1),
      description: z.string().optional(),
      hourlyRate: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const [client] = await db.select({ id: clients.id }).from(clients)
        .where(and(eq(clients.id, input.clientId), eq(clients.userId, ctx.user.id)));
      if (!client) throw new Error("Client not found");
      const [project] = await db.insert(projects).values({
        clientId: input.clientId,
        name: input.name,
        description: input.description || null,
        hourlyRate: input.hourlyRate,
        status: "ACTIVE",
      }).returning();
      return project;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      description: z.string().optional(),
      hourlyRate: z.string().min(1),
      status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
      const [project] = await db.update(projects)
        .set({ name: input.name, description: input.description || null, hourlyRate: input.hourlyRate, status: input.status })
        .where(and(eq(projects.id, input.id), inArray(projects.clientId, userClients)))
        .returning();
      return project;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userClients = db.select({ id: clients.id }).from(clients).where(eq(clients.userId, ctx.user.id));
      await db.update(invoices).set({ projectId: null }).where(eq(invoices.projectId, input.id));
      await db.delete(projects).where(and(eq(projects.id, input.id), inArray(projects.clientId, userClients)));
    }),
});
