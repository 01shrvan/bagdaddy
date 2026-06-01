import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { clients, projects, invoices, timeEntries } from "@/lib/db/schema";
import { eq, and, inArray, count } from "drizzle-orm";
import { z } from "zod/v4";

export const clientsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.select().from(clients).where(eq(clients.userId, ctx.user.id)).orderBy(clients.createdAt);
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional().or(z.literal("")),
      phone: z.string().optional(),
      address: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [client] = await db.insert(clients).values({
        userId: ctx.user.id,
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
      }).returning();
      return client;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      email: z.string().email().optional().or(z.literal("")),
      phone: z.string().optional(),
      address: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [client] = await db.update(clients)
        .set({ name: input.name, email: input.email || null, phone: input.phone || null, address: input.address || null })
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)))
        .returning();
      return client;
    }),

  relatedCounts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [client] = await db.select({ id: clients.id }).from(clients)
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)));
      if (!client) return { projects: 0, timeEntries: 0, invoices: 0 };

      const projectIds = db.select({ id: projects.id }).from(projects).where(eq(projects.clientId, input.id));

      const [[p], [inv], [te]] = await Promise.all([
        db.select({ c: count() }).from(projects).where(eq(projects.clientId, input.id)),
        db.select({ c: count() }).from(invoices).where(eq(invoices.clientId, input.id)),
        db.select({ c: count() }).from(timeEntries).where(inArray(timeEntries.projectId, projectIds)),
      ]);

      return { projects: p.c, invoices: inv.c, timeEntries: te.c };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(clients).where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)));
    }),
});
