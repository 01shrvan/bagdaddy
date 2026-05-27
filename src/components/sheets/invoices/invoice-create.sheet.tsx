"use client";

import { Cancel01Icon, Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useInvoiceSheetParams } from "@/hooks/sheets/use-invoice-sheet";

const itemSchema = z.object({
  description: z.string().min(1),
  quantity: z.string().min(1),
  unitPrice: z.string().min(1),
});
const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});
type FormData = z.infer<typeof schema>;

export function InvoiceCreateSheet() {
  const { invoiceCreate, setParams } = useInvoiceSheetParams();
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: clientsList } = useQuery(trpc.clients.list.queryOptions());
  const { data: projectsList } = useQuery(trpc.projects.list.queryOptions());

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      clientId: "",
      projectId: "",
      dueDate: "",
      notes: "",
      items: [{ description: "", quantity: "1", unitPrice: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const selectedClientId = watch("clientId");
  const items = watch("items");

  const subtotal = items.reduce((sum, item) => {
    const q = parseFloat(item.quantity || "0");
    const p = parseFloat(item.unitPrice || "0");
    return sum + (isNaN(q) || isNaN(p) ? 0 : q * p);
  }, 0);

  const clientProjects =
    projectsList?.filter((r) => r.project.clientId === selectedClientId && r.project.status === "ACTIVE") ?? [];

  const create = useMutation(
    trpc.invoices.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.invoices.list.queryFilter());
        setParams({ invoiceCreate: null });
        reset();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={Boolean(invoiceCreate)}
      onOpenChange={(nextOpen) => { if (!nextOpen) { setParams({ invoiceCreate: null }); reset(); } }}
    >
      <SheetComponent.SheetContent showCloseButton={false} className="sm:max-w-xl">
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>New invoice</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>Create and send an invoice to a client.</SheetComponent.SheetDescription>
          </div>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto space-y-5 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select onValueChange={(v) => { setValue("clientId", v); setValue("projectId", ""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {clientsList?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Project (optional)</Label>
                <Select onValueChange={(v) => setValue("projectId", v)} disabled={!selectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {clientProjects.map((r) => (
                      <SelectItem key={r.project.id} value={r.project.id}>{r.project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ic-due">Due date</Label>
              <Input id="ic-due" type="date" {...register("dueDate")} />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_72px_96px_28px] gap-2 px-1 text-xs text-muted-foreground">
                <span>Description</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Unit price</span>
                <span />
              </div>
              {fields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-[1fr_72px_96px_28px] gap-2 items-center">
                  <Input placeholder="Service description" {...register(`items.${i}.description`)} />
                  <Input type="number" step="0.01" placeholder="1" className="text-center" {...register(`items.${i}.quantity`)} />
                  <Input type="number" step="0.01" placeholder="0.00" className="text-right" {...register(`items.${i}.unitPrice`)} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(i)}
                    disabled={fields.length === 1}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={13} strokeWidth={2} />
                  </Button>
                </div>
              ))}
              {errors.items && <p className="text-xs text-destructive">Add at least one item</p>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ description: "", quantity: "1", unitPrice: "" })}
              >
                <HugeiconsIcon icon={Add01Icon} size={13} strokeWidth={2} className="mr-1.5" />
                Add line
              </Button>
            </div>

            <Separator />

            <div className="flex justify-end text-sm">
              <div className="flex gap-12">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ic-notes">Notes</Label>
              <Textarea
                id="ic-notes"
                placeholder="Payment terms, bank details..."
                className="resize-none"
                rows={2}
                {...register("notes")}
              />
            </div>
          </div>

          <div className="shrink-0 border-t p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={create.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" size="lg" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create invoice"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
