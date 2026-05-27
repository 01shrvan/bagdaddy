import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, projects, users } from "@/lib/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { createId } from "@paralleldrive/cuid2";
import { sendEmail } from "@/lib/brevo";

function fmt(date: Date | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function buildEmailHtml(opts: {
  invoiceNumber: string;
  fromName: string;
  clientName: string;
  totalAmount: string;
  dueDate: string | null;
  items: Array<{ description: string; quantity: string; unitPrice: string; total: string }>;
  notes: string | null | undefined;
  viewUrl: string;
  pdfUrl: string;
}) {
  const rows = opts.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#0a0a0a;">${item.description}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#737373;text-align:right;">${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13px;color:#737373;text-align:right;">$${parseFloat(item.unitPrice).toFixed(2)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13px;font-weight:600;text-align:right;">$${parseFloat(item.total).toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e5e5e5;">
    <div style="padding:32px 36px;border-bottom:1px solid #f0f0f0;">
      <p style="margin:0 0 4px;font-size:11px;color:#a3a3a3;text-transform:uppercase;letter-spacing:1px;">bagdaddy</p>
      <h1 style="margin:0;font-size:22px;font-weight:600;color:#0a0a0a;letter-spacing:-0.3px;">Invoice from ${opts.fromName}</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#737373;">Hi ${opts.clientName}, you have a new invoice.</p>
    </div>

    <div style="padding:28px 36px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:24px;">
        <div>
          <p style="margin:0 0 3px;font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;">Invoice</p>
          <p style="margin:0;font-size:13px;font-weight:500;font-family:monospace;">${opts.invoiceNumber}</p>
        </div>
        ${opts.dueDate ? `<div style="text-align:right;">
          <p style="margin:0 0 3px;font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;">Due date</p>
          <p style="margin:0;font-size:13px;font-weight:500;">${opts.dueDate}</p>
        </div>` : ""}
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;text-align:left;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Description</th>
            <th style="font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;text-align:right;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Qty</th>
            <th style="font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;text-align:right;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Price</th>
            <th style="font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;text-align:right;padding-bottom:8px;border-bottom:1px solid #e5e5e5;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="text-align:right;padding-top:12px;border-top:1px solid #e5e5e5;margin-bottom:28px;">
        <span style="font-size:12px;color:#737373;margin-right:16px;">Total</span>
        <span style="font-size:18px;font-weight:700;color:#0a0a0a;">$${parseFloat(opts.totalAmount).toFixed(2)}</span>
      </div>

      ${opts.notes ? `<div style="background:#f9f9f9;padding:14px 16px;margin-bottom:28px;border-left:2px solid #e5e5e5;">
        <p style="margin:0 0 4px;font-size:10px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.8px;">Notes</p>
        <p style="margin:0;font-size:12px;color:#737373;line-height:1.6;">${opts.notes}</p>
      </div>` : ""}

      <div style="display:flex;gap:12px;">
        <a href="${opts.viewUrl}" style="flex:1;display:block;text-align:center;padding:12px 20px;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:13px;font-weight:500;">View invoice</a>
        <a href="${opts.pdfUrl}" style="display:block;text-align:center;padding:12px 20px;border:1px solid #e5e5e5;color:#0a0a0a;text-decoration:none;font-size:13px;font-weight:500;">Download PDF</a>
      </div>
    </div>

    <div style="padding:20px 36px;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#d4d4d4;">Sent via bagdaddy</p>
    </div>
  </div>
</body>
</html>`;
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

  send: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db
        .select({
          invoice: invoices,
          clientName: clients.name,
          clientEmail: clients.email,
          fromEmail: users.email,
          fromName: users.name,
        })
        .from(invoices)
        .innerJoin(clients, eq(invoices.clientId, clients.id))
        .innerJoin(users, eq(invoices.userId, users.id))
        .where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)));

      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      if (!row.clientEmail) throw new TRPCError({ code: "BAD_REQUEST", message: "Client has no email address" });
      if (!row.invoice.publicToken) throw new TRPCError({ code: "BAD_REQUEST", message: "Invoice has no public token" });

      const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, input.id));

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

      const viewUrl = `${baseUrl}/i/${row.invoice.publicToken}`;
      const pdfUrl = `${baseUrl}/api/invoice/${row.invoice.publicToken}/pdf`;
      const displayName = row.fromName ?? row.fromEmail.split("@")[0];

      const fromEmail = process.env.BREVO_FROM_EMAIL ?? row.fromEmail;
      const fromName = process.env.BREVO_FROM_NAME ?? displayName;

      try {
        await sendEmail({
          from: { name: `${fromName} via bagdaddy`, email: fromEmail },
          to: [{ email: row.clientEmail, name: row.clientName }],
          subject: `Invoice ${row.invoice.invoiceNumber} from ${displayName}`,
          htmlContent: buildEmailHtml({
            invoiceNumber: row.invoice.invoiceNumber,
            fromName: displayName,
            clientName: row.clientName,
            totalAmount: row.invoice.totalAmount,
            dueDate: fmt(row.invoice.dueDate),
            items,
            notes: row.invoice.notes,
            viewUrl,
            pdfUrl,
          }),
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Failed to send email",
        });
      }

      const [updated] = await db
        .update(invoices)
        .set({ status: "SENT", sentAt: new Date() })
        .where(eq(invoices.id, input.id))
        .returning();

      return { invoice: updated, sentTo: row.clientEmail };
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
