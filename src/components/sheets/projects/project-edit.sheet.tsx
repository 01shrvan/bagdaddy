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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useProjectSheetParams } from "@/hooks/sheets/use-project-sheet";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
});
type FormData = z.infer<typeof schema>;

type ProjectRow = { project: { id: string; name: string; hourlyRate: string; status: "ACTIVE" | "COMPLETED" | "ARCHIVED"; clientId: string; description: string | null; createdAt: Date }; clientName: string };

export function ProjectEditSheet() {
  const { projectEdit, setParams } = useProjectSheetParams();
  const isOpen = Boolean(projectEdit);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const allProjects = qc.getQueryData<ProjectRow[]>(trpc.projects.list.queryOptions().queryKey);
  const row = allProjects?.find((r) => r.project.id === projectEdit) ?? null;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { name: "", hourlyRate: "", status: "ACTIVE" },
  });

  useEffect(() => {
    if (row) {
      reset({ name: row.project.name, hourlyRate: row.project.hourlyRate, status: row.project.status });
    }
  }, [row, reset]);

  const update = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.projects.list.queryFilter());
        setParams({ projectEdit: null });
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => { if (!nextOpen) setParams({ projectEdit: null }); }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <SheetComponent.SheetTitle>Edit project</SheetComponent.SheetTitle>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        {isOpen && !row ? (
          <div className="space-y-6 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((d) => { if (projectEdit) update.mutate({ id: projectEdit, ...d }); })}
            className="flex h-full flex-col"
          >
            <div className="space-y-4 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="pe-name">Project name</Label>
                <Input id="pe-name" placeholder="Website redesign" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pe-rate">Hourly rate ($)</Label>
                <Input id="pe-rate" type="number" step="0.01" placeholder="75.00" {...register("hourlyRate")} />
                {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select onValueChange={(v) => setValue("status", v as any)} value={watch("status")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
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
