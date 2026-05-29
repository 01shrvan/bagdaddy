"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useClientSheetParams } from "@/hooks/sheets/use-client-sheet";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function ClientCreateSheet() {
  const { clientCreate, setParams } = useClientSheetParams();
  const isOpen = Boolean(clientCreate);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  const create = useMutation(
    trpc.clients.create.mutationOptions({
      onSuccess: (newClient) => {
        qc.setQueryData(trpc.clients.list.queryOptions().queryKey, (old: any) => [...(old ?? []), newClient]);
        setParams({ clientCreate: null });
        reset();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) { setParams({ clientCreate: null }); reset(); }
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>New client</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>Add a new client to your roster.</SheetComponent.SheetDescription>
          </div>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="cc-name">Name</Label>
              <Input id="cc-name" placeholder="Acme Corp" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cc-email">Email</Label>
              <Input id="cc-email" type="email" placeholder="hello@acme.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cc-phone">Phone</Label>
              <Input id="cc-phone" placeholder="+1 555 000 0000" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cc-address">Address</Label>
              <Input id="cc-address" placeholder="123 Main St" {...register("address")} />
            </div>
          </div>
          <div className="shrink-0 border-t p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={create.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" size="lg" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create client"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
