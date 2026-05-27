"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddInvoiceIcon, MoreHorizontalIcon, Delete01Icon, InvoiceIcon, Mail01Icon, Link01Icon, ArrowUpRightIcon } from "@hugeicons/core-free-icons";
import { useInvoiceSheetParams } from "@/hooks/sheets/use-invoice-sheet";
import { Container } from "@/components/container";
import { toast } from "sonner";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  SENT: "secondary",
  PAID: "default",
  OVERDUE: "destructive",
};

export function InvoicesView() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: rows, isLoading } = useQuery(trpc.invoices.list.queryOptions());
  const updateStatus = useMutation(
    trpc.invoices.updateStatus.mutationOptions({
      onSuccess: () => qc.invalidateQueries(trpc.invoices.list.queryFilter()),
    }),
  );
  const sendInvoice = useMutation(
    trpc.invoices.send.mutationOptions({
      onSuccess: (data) => {
        qc.invalidateQueries(trpc.invoices.list.queryFilter());
        toast.success(`Invoice sent to ${data.sentTo}`);
      },
      onError: (err) => toast.error(err.message),
    }),
  );
  const { setParams } = useInvoiceSheetParams();

  const totalOutstanding =
    rows
      ?.filter((r) => r.invoice.status === "SENT" || r.invoice.status === "OVERDUE")
      .reduce((sum, r) => sum + parseFloat(r.invoice.totalAmount), 0) ?? 0;

  function copyLink(token: string | null | undefined) {
    if (!token) return toast.error("This invoice has no shareable link yet");
    const url = `${window.location.origin}/i/${token}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied to clipboard"));
  }

  function openInvoice(token: string | null | undefined) {
    if (!token) return toast.error("This invoice has no shareable link yet");
    window.open(`/i/${token}`, "_blank");
  }

  return (
    <Container>
      <main className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-semibold text-3xl tracking-tight">Invoices</h1>
            <p className="text-muted-foreground text-sm">
              {totalOutstanding > 0
                ? `$${totalOutstanding.toFixed(2)} outstanding across sent & overdue invoices.`
                : "Create and send invoices to your clients."}
            </p>
          </div>
          <Button size="sm" onClick={() => setParams({ invoiceCreate: true })}>
            <HugeiconsIcon icon={AddInvoiceIcon} size={14} strokeWidth={2} className="mr-1.5" />
            New invoice
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !rows?.length ? (
          <div className="flex flex-col items-center justify-center border py-24 gap-4">
            <div className="flex h-10 w-10 items-center justify-center border">
              <HugeiconsIcon icon={InvoiceIcon} size={18} strokeWidth={1.5} className="text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">No invoices yet</p>
              <p className="text-xs text-muted-foreground">Create your first invoice and send it to a client.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setParams({ invoiceCreate: true })}>
              New invoice
            </Button>
          </div>
        ) : (
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ invoice, clientName }) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="font-medium">{clientName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${parseFloat(invoice.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[invoice.status]}>
                        {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openInvoice(invoice.publicToken)}>
                            <HugeiconsIcon icon={ArrowUpRightIcon} size={13} strokeWidth={2} className="mr-2 text-muted-foreground" />
                            View invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyLink(invoice.publicToken)}>
                            <HugeiconsIcon icon={Link01Icon} size={13} strokeWidth={2} className="mr-2 text-muted-foreground" />
                            Copy link
                          </DropdownMenuItem>
                          {(invoice.status === "DRAFT" || invoice.status === "SENT") && (
                            <DropdownMenuItem
                              onClick={() => sendInvoice.mutate({ id: invoice.id })}
                              disabled={sendInvoice.isPending}
                            >
                              <HugeiconsIcon icon={Mail01Icon} size={13} strokeWidth={2} className="mr-2 text-muted-foreground" />
                              {invoice.status === "DRAFT" ? "Send to client" : "Resend to client"}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {invoice.status === "DRAFT" && (
                            <DropdownMenuItem
                              onClick={() => updateStatus.mutate({ id: invoice.id, status: "SENT" })}
                            >
                              Mark as sent
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                            <DropdownMenuItem
                              onClick={() => updateStatus.mutate({ id: invoice.id, status: "PAID" })}
                            >
                              Mark as paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "SENT" && (
                            <DropdownMenuItem
                              onClick={() => updateStatus.mutate({ id: invoice.id, status: "OVERDUE" })}
                            >
                              Mark as overdue
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setParams({ invoiceDelete: invoice.id })}
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </Container>
  );
}
