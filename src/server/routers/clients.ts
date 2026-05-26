import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(clients).where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)));
    }),
});
