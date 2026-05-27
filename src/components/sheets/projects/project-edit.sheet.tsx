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
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useSheetsStore } from "@/store/sheets";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
});
type FormData = z.infer<typeof schema>;

export function ProjectEditSheet() {
  const { projectEdit, closeProjectEdit } = useSheetsStore();
  const isOpen = Boolean(projectEdit);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { name: "", hourlyRate: "", status: "ACTIVE" },
  });

  useEffect(() => {
    if (projectEdit) {
      reset({
        name: projectEdit.project.name,
        hourlyRate: projectEdit.project.hourlyRate,
        status: projectEdit.project.status,
      });
    }
  }, [projectEdit, reset]);

  const update = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.projects.list.queryFilter());
        closeProjectEdit();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeProjectEdit();
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <SheetComponent.SheetTitle>Edit project</SheetComponent.SheetTitle>
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
            if (projectEdit) update.mutate({ id: projectEdit.project.id, ...d });
          })}
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
              <Select
                onValueChange={(v) => setValue("status", v as "ACTIVE" | "COMPLETED" | "ARCHIVED")}
                value={watch("status")}
              >
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
