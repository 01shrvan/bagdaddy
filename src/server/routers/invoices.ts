import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, projects, users } from "@/lib/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { createId } from "@paralleldrive/cuid2";

export const invoicesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select({ invoice: invoices, clientName: clients.name })
      .from(invoices)
      .innerJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.userId, ctx.user.id))
      .orderBy(desc(invoices.createdAt));
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [row] = await db
        .select({ invoice: invoices, clientName: clients.name })
        .from(invoices)
        .innerJoin(clients, eq(invoices.clientId, clients.id))
        .where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)));
      if (!row) throw new Error("Invoice not found");
      const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, input.id));
      return { ...row, items };
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        projectId: z.string().optional(),
        dueDate: z.string().optional(),
        notes: z.string().optional(),
        items: z
          .array(
            z.object({
              description: z.string().min(1),
              quantity: z.string(),
              unitPrice: z.string(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const total = input.items.reduce((sum, item) => {
        return sum + parseFloat(item.quantity) * parseFloat(item.unitPrice);
      }, 0);

      const count = await db.select({ id: invoices.id }).from(invoices).where(eq(invoices.userId, ctx.user.id));
      const invoiceNumber = `INV-${String(count.length + 1).padStart(4, "0")}`;
      const publicToken = createId();

      const [invoice] = await db
        .insert(invoices)
        .values({
          userId: ctx.user.id,
          clientId: input.clientId,
          projectId: input.projectId || null,
          invoiceNumber,
          publicToken,
          status: "DRAFT",
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          totalAmount: String(total.toFixed(2)),
          notes: input.notes || null,
        })
        .returning();

      await db.insert(invoiceItems).values(
        input.items.map((item) => ({
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: String((parseFloat(item.quantity) * parseFloat(item.unitPrice)).toFixed(2)),
        })),
      );

      return invoice;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [invoice] = await db
        .update(invoices)
        .set({
          status: input.status,
          sentAt: input.status === "SENT" ? new Date() : undefined,
          paidAt: input.status === "PAID" ? new Date() : undefined,
        })
        .where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)))
        .returning();
      return invoice;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(invoices).where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)));
    }),
});
