import { and, eq, lt, sql } from "drizzle-orm";
import { inngest } from "./client";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";

export const markOverdueInvoices = inngest.createFunction(
  { id: "mark-overdue-invoices", triggers: [{ cron: "0 1 * * *" }] },
  async () => {
    const now = new Date();
    const result = await db
      .update(invoices)
      .set({ status: "OVERDUE" })
      .where(
        and(
          eq(invoices.status, "SENT"),
          lt(invoices.dueDate, now),
        ),
      )
      .returning({ id: invoices.id });

    return { markedOverdue: result.length };
  },
);
