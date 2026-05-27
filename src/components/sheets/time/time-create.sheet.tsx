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
import { useTimeSheetParams } from "@/hooks/sheets/use-time-sheet";

const schema = z.object({
  projectId: z.string().min(1, "Select a project"),
  hours: z.string().min(1, "Hours required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date required"),
});
type FormData = z.infer<typeof schema>;

export function TimeCreateSheet() {
  const { timeCreate, setParams } = useTimeSheetParams();
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: projects } = useQuery(trpc.projects.list.queryOptions());

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { projectId: "", hours: "", description: "", date: new Date().toISOString().split("T")[0] },
  });

  const create = useMutation(
    trpc.time.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.time.list.queryFilter());
        setParams({ timeCreate: null });
        reset();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={Boolean(timeCreate)}
      onOpenChange={(nextOpen) => { if (!nextOpen) { setParams({ timeCreate: null }); reset(); } }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Log time</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>Record hours against an active project.</SheetComponent.SheetDescription>
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
              <Label>Project</Label>
              <Select onValueChange={(v) => setValue("projectId", v)}>
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
                <Label htmlFor="tc-hours">Hours</Label>
                <Input id="tc-hours" type="number" step="0.25" placeholder="2.5" {...register("hours")} />
                {errors.hours && <p className="text-xs text-destructive">{errors.hours.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tc-date">Date</Label>
                <Input id="tc-date" type="date" {...register("date")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-desc">Description</Label>
              <Input id="tc-desc" placeholder="What did you work on?" {...register("description")} />
            </div>
          </div>
          <div className="shrink-0 border-t p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={create.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" size="lg" disabled={create.isPending}>
                {create.isPending ? "Saving..." : "Log time"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
