"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useProjectSheetParams } from "@/hooks/sheets/use-project-sheet";

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  name: z.string().min(1, "Name is required"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
});
type FormData = z.infer<typeof schema>;

export function ProjectCreateSheet() {
  const { projectCreate, setParams } = useProjectSheetParams();
  const isOpen = Boolean(projectCreate);
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: clientsList } = useQuery(trpc.clients.list.queryOptions());

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { clientId: "", name: "", hourlyRate: "" },
  });

  const create = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.projects.list.queryFilter());
        setParams({ projectCreate: null });
        reset();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) { setParams({ projectCreate: null }); reset(); }
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <SheetComponent.SheetTitle>New project</SheetComponent.SheetTitle>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="flex h-full flex-col">
          <div className="space-y-4 p-4">
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Select onValueChange={(v) => setValue("clientId", v)}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clientsList?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pc-name">Project name</Label>
              <Input id="pc-name" placeholder="Website redesign" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pc-rate">Hourly rate ($)</Label>
              <Input id="pc-rate" type="number" step="0.01" placeholder="75.00" {...register("hourlyRate")} />
              {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate.message}</p>}
            </div>
          </div>
          <div className="mt-auto p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={create.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" size="lg" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create project"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
