import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, projects } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { createId } from "@paralleldrive/cuid2";

const QUANTITY_RE = /^\d{1,4}(\.\d{1,2})?$/;
const PRICE_RE = /^\d{1,7}(\.\d{1,2})?$/;

const itemSchema = z.object({
  description: z.string().trim().min(1),
  quantity: z.string().trim().regex(QUANTITY_RE, "Quantity must be a number up to 9999.99"),
  unitPrice: z.string().trim().regex(PRICE_RE, "Unit price must be a number up to 9999999.99"),
});

const lineTotal = (item: { quantity: string; unitPrice: string }) =>
  parseFloat(item.quantity) * parseFloat(item.unitPrice);

async function assertOwnership(userId: string, clientId: string, projectId?: string) {
  const [client] = await db.select({ id: clients.id }).from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
  if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
  if (projectId) {
    const [project] = await db.select({ id: projects.id }).from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.clientId, clientId)));
    if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
  }
}

function isUniqueViolation(err: unknown) {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === "23505" || e?.cause?.code === "23505";
}

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
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
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
        items: z.array(itemSchema).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOwnership(ctx.user.id, input.clientId, input.projectId || undefined);
      const total = input.items.reduce((sum, item) => sum + lineTotal(item), 0);

      for (let attempt = 0; ; attempt++) {
        try {
          return await db.transaction(async (tx) => {
            const [lastInvoice] = await tx
              .select({ invoiceNumber: invoices.invoiceNumber })
              .from(invoices)
              .orderBy(desc(invoices.invoiceNumber))
              .limit(1);
            const lastNum = lastInvoice?.invoiceNumber ? parseInt(lastInvoice.invoiceNumber.replace("INV-", ""), 10) : 0;
            const invoiceNumber = `INV-${String((isNaN(lastNum) ? 0 : lastNum) + 1 + attempt).padStart(4, "0")}`;

            const [invoice] = await tx
              .insert(invoices)
              .values({
                userId: ctx.user.id,
                clientId: input.clientId,
                projectId: input.projectId || null,
                invoiceNumber,
                publicToken: createId(),
                status: "DRAFT",
                dueDate: input.dueDate ? new Date(input.dueDate) : null,
                totalAmount: total.toFixed(2),
                notes: input.notes || null,
              })
              .returning();

            await tx.insert(invoiceItems).values(
              input.items.map((item) => ({
                invoiceId: invoice.id,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: lineTotal(item).toFixed(2),
              })),
            );

            return invoice;
          });
        } catch (err) {
          if (attempt < 4 && isUniqueViolation(err)) continue;
          throw err;
        }
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        clientId: z.string(),
        projectId: z.string().optional(),
        dueDate: z.string().optional(),
        notes: z.string().optional(),
        items: z.array(itemSchema).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOwnership(ctx.user.id, input.clientId, input.projectId || undefined);
      const total = input.items.reduce((sum, item) => sum + lineTotal(item), 0);

      return db.transaction(async (tx) => {
        const [invoice] = await tx
          .update(invoices)
          .set({
            clientId: input.clientId,
            projectId: input.projectId || null,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            totalAmount: total.toFixed(2),
            notes: input.notes || null,
          })
          .where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)))
          .returning();

        if (!invoice) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });

        await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoice.id));
        const items = await tx
          .insert(invoiceItems)
          .values(
            input.items.map((item) => ({
              invoiceId: invoice.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: lineTotal(item).toFixed(2),
            })),
          )
          .returning();

        return { invoice, items };
      });
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
      if (!invoice) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      return invoice;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(invoices).where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)));
    }),
});
