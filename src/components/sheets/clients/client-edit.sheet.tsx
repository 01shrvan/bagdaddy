"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useSheetsStore } from "@/store/sheets";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function ClientEditSheet() {
  const { clientEdit, closeClientEdit } = useSheetsStore();
  const isOpen = Boolean(clientEdit);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (clientEdit) {
      reset({
        name: clientEdit.name,
        email: clientEdit.email ?? "",
        phone: clientEdit.phone ?? "",
        address: clientEdit.address ?? "",
      });
    }
  }, [clientEdit, reset]);

  const update = useMutation(
    trpc.clients.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.clients.list.queryFilter());
        closeClientEdit();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeClientEdit();
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <SheetComponent.SheetTitle>Edit client</SheetComponent.SheetTitle>
          <SheetComponent.SheetClose asChild>
            <Button
              variant="ghost"
              className="m-0 size-auto p-0 hover:bg-transparent"
              size="icon"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form
          onSubmit={handleSubmit((d) => {
            if (clientEdit) update.mutate({ id: clientEdit.id, ...d });
          })}
          className="flex h-full flex-col"
        >
          <div className="space-y-4 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="ce-name">Name</Label>
              <Input id="ce-name" placeholder="Acme Corp" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-email">Email</Label>
              <Input id="ce-email" type="email" placeholder="hello@acme.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-phone">Phone</Label>
              <Input id="ce-phone" placeholder="+1 555 000 0000" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-address">Address</Label>
              <Input id="ce-address" placeholder="123 Main St" {...register("address")} />
            </div>
          </div>

          <div className="mt-auto p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={update.isPending}>
                  Cancel
                </Button>
              </SheetComponent.SheetClose>
              <Button type="submit" size="lg" disabled={update.isPending}>
                {update.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
