import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { markOverdueInvoices } from "@/inngest/mark-overdue";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [markOverdueInvoices],
});
