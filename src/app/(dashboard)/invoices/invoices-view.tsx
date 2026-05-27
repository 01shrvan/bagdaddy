"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddInvoiceIcon, MoreHorizontalIcon, Delete01Icon, InvoiceIcon } from "@hugeicons/core-free-icons";
import { useInvoiceSheetParams } from "@/hooks/sheets/use-invoice-sheet";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline", SENT: "secondary", PAID: "default", OVERDUE: "destructive",
};

export function InvoicesView() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: rows, isLoading } = useQuery(trpc.invoices.list.queryOptions());
  const updateStatus = useMutation(trpc.invoices.updateStatus.mutationOptions({
    onSuccess: () => qc.invalidateQueries(trpc.invoices.list.queryFilter()),
  }));
  const { setParams } = useInvoiceSheetParams();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <h1 className="text-sm font-medium">Invoices</h1>
        <Button size="sm" onClick={() => setParams({ invoiceCreate: true })}>
          <HugeiconsIcon icon={AddInvoiceIcon} size={14} strokeWidth={2} className="mr-1.5" />
          New invoice
        </Button>
      </header>

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !rows?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <HugeiconsIcon icon={InvoiceIcon} size={32} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
            <Button size="sm" variant="outline" onClick={() => setParams({ invoiceCreate: true })}>New invoice</Button>
          </div>
        ) : (
          <div className="border border-border">
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
                        ? new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">${parseFloat(invoice.totalAmount).toFixed(2)}</TableCell>
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
                          {invoice.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: "SENT" })}>
                              Mark as sent
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "SENT" && (
                            <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: "PAID" })}>
                              Mark as paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "SENT" && (
                            <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: "OVERDUE" })}>
                              Mark as overdue
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setParams({ invoiceDelete: invoice.id })}>
                            <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} className="mr-2" />Delete
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
      </div>
    </div>
  );
}
