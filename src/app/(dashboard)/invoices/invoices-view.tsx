"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddInvoiceIcon, MoreHorizontalIcon, Delete01Icon, InvoiceIcon, Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline", SENT: "secondary", PAID: "default", OVERDUE: "destructive",
};

const itemSchema = z.object({ description: z.string().min(1), quantity: z.string().min(1), unitPrice: z.string().min(1) });
const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});
type FormData = z.infer<typeof schema>;

function NewInvoiceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: clientsList } = useQuery(trpc.clients.list.queryOptions());
  const { data: projectsList } = useQuery(trpc.projects.list.queryOptions());

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { clientId: "", projectId: "", dueDate: "", notes: "", items: [{ description: "", quantity: "1", unitPrice: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const selectedClientId = watch("clientId");
  const items = watch("items");

  const subtotal = items.reduce((sum, item) => {
    const q = parseFloat(item.quantity || "0");
    const p = parseFloat(item.unitPrice || "0");
    return sum + (isNaN(q) || isNaN(p) ? 0 : q * p);
  }, 0);

  const create = useMutation(trpc.invoices.create.mutationOptions({ onSuccess: () => { qc.invalidateQueries(trpc.invoices.list.queryFilter()); onClose(); reset(); } }));

  const clientProjects = projectsList?.filter(r => r.project.clientId === selectedClientId && r.project.status === "ACTIVE") ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New invoice</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Select onValueChange={(v) => { setValue("clientId", v); setValue("projectId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clientsList?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Project (optional)</Label>
              <Select onValueChange={(v) => setValue("projectId", v)} disabled={!selectedClientId}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>{clientProjects.map(r => <SelectItem key={r.project.id} value={r.project.id}>{r.project.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 text-xs text-muted-foreground px-1">
              <span>Description</span><span className="text-center">Qty</span><span className="text-right">Unit price</span><span />
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
                <Input placeholder="Service description" {...register(`items.${i}.description`)} />
                <Input type="number" step="0.01" placeholder="1" className="text-center" {...register(`items.${i}.quantity`)} />
                <Input type="number" step="0.01" placeholder="0.00" className="text-right" {...register(`items.${i}.unitPrice`)} />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(i)} disabled={fields.length === 1}>
                  <HugeiconsIcon icon={Delete02Icon} size={13} strokeWidth={2} />
                </Button>
              </div>
            ))}
            {errors.items && <p className="text-xs text-destructive">Add at least one item</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: "1", unitPrice: "" })}>
              <HugeiconsIcon icon={Add01Icon} size={13} strokeWidth={2} className="mr-1.5" />Add line
            </Button>
          </div>

          <Separator />

          <div className="flex justify-end">
            <div className="text-sm space-y-1 text-right">
              <div className="flex justify-between gap-12"><span className="text-muted-foreground">Total</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Payment terms, bank details..." className="resize-none" rows={2} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { onClose(); reset(); }}>Cancel</Button>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating..." : "Create invoice"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function InvoicesView() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: rows, isLoading } = useQuery(trpc.invoices.list.queryOptions());
  const updateStatus = useMutation(trpc.invoices.updateStatus.mutationOptions({ onSuccess: () => qc.invalidateQueries(trpc.invoices.list.queryFilter()) }));
  const deleteInvoice = useMutation(trpc.invoices.delete.mutationOptions({ onSuccess: () => qc.invalidateQueries(trpc.invoices.list.queryFilter()) }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <h1 className="text-sm font-medium">Invoices</h1>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
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
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>New invoice</Button>
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
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">${parseFloat(invoice.totalAmount).toFixed(2)}</TableCell>
                    <TableCell><Badge variant={STATUS_VARIANTS[invoice.status]}>{invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {invoice.status === "DRAFT" && <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: "SENT" })}>Mark as sent</DropdownMenuItem>}
                          {invoice.status === "SENT" && <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: "PAID" })}>Mark as paid</DropdownMenuItem>}
                          {invoice.status === "SENT" && <DropdownMenuItem onClick={() => updateStatus.mutate({ id: invoice.id, status: "OVERDUE" })}>Mark as overdue</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(invoice.id)}>
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

      <NewInvoiceDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete invoice?</AlertDialogTitle>
            <AlertDialogDescription>This invoice and all its line items will be permanently deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteInvoice.mutate({ id: deleteId }); setDeleteId(null); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
