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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useTimeSheetParams } from "@/hooks/sheets/use-time-sheet";

const schema = z.object({
  projectId: z.string().min(1, "Select a project"),
  hours: z.string().min(1, "Hours required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date required"),
});
type FormData = z.infer<typeof schema>;

export function TimeEditSheet() {
  const { timeEdit, setParams } = useTimeSheetParams();
  const isOpen = Boolean(timeEdit);
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: projects } = useQuery(trpc.projects.list.queryOptions());

  const allEntries = qc.getQueryData<any[]>(trpc.time.list.queryOptions().queryKey);
  const row = allEntries?.find((r) => r.entry.id === timeEdit);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { projectId: "", hours: "", description: "", date: "" },
  });

  useEffect(() => {
    if (row) {
      reset({
        projectId: row.entry.projectId,
        hours: row.entry.hours,
        description: row.entry.description ?? "",
        date: new Date(row.entry.date).toISOString().split("T")[0],
      });
    }
  }, [row, reset]);

  const update = useMutation(
    trpc.time.update.mutationOptions({
      onSuccess: (updated) => {
        qc.setQueryData(trpc.time.list.queryOptions().queryKey, (old: any) =>
          old?.map((r: any) => {
            if (r.entry.id !== updated.id) return r;
            const proj = projects?.find((p) => p.project.id === updated.projectId);
            return {
              entry: updated,
              projectName: proj?.project.name ?? r.projectName,
              clientName: proj?.clientName ?? r.clientName,
            };
          }) ?? [],
        );
        setParams({ timeEdit: null });
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => { if (!nextOpen) setParams({ timeEdit: null }); }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Edit time entry</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>Update hours, date, or description.</SheetComponent.SheetDescription>
          </div>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form
          onSubmit={handleSubmit((d) => { if (timeEdit) update.mutate({ id: timeEdit, ...d }); })}
          className="flex h-full flex-col"
        >
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={row?.entry.projectId ?? ""}
                onValueChange={(v) => setValue("projectId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {projects?.filter((r) => r.project.status === "ACTIVE").map((r) => (
                    <SelectItem key={r.project.id} value={r.project.id}>
                      {r.project.name} — {r.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-xs text-destructive">{errors.projectId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="te-hours">Hours</Label>
                <Input id="te-hours" type="number" step="0.25" placeholder="2.5" {...register("hours")} />
                {errors.hours && <p className="text-xs text-destructive">{errors.hours.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="te-date">Date</Label>
                <Input id="te-date" type="date" {...register("date")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="te-desc">Description</Label>
              <Input id="te-desc" placeholder="What did you work on?" {...register("description")} />
            </div>
          </div>
          <div className="shrink-0 border-t p-4">
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
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
