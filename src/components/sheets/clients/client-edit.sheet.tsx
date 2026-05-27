"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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

export function ClientEditSheet() {
  const { clientEdit, setParams } = useClientSheetParams();
  const isOpen = Boolean(clientEdit);
  const trpc = useTRPC();
  const qc = useQueryClient();

  // Look up from list cache
  const allClients = qc.getQueryData<{ id: string; name: string; email: string | null; phone: string | null; address: string | null; createdAt: Date }[]>(
    trpc.clients.list.queryOptions().queryKey,
  );
  const client = allClients?.find((c) => c.id === clientEdit) ?? null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        address: client.address ?? "",
      });
    }
  }, [client, reset]);

  const update = useMutation(
    trpc.clients.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.clients.list.queryFilter());
        setParams({ clientEdit: null });
      },
    }),
  );

  const isLoading = isOpen && !client;

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setParams({ clientEdit: null });
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <SheetComponent.SheetTitle>Edit client</SheetComponent.SheetTitle>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        {isLoading ? (
          <div className="space-y-6 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((d) => { if (clientEdit) update.mutate({ id: clientEdit, ...d }); })}
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
                  <Button type="button" variant="outline" size="lg" disabled={update.isPending}>Cancel</Button>
                </SheetComponent.SheetClose>
                <Button type="submit" size="lg" disabled={update.isPending}>
                  {update.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
