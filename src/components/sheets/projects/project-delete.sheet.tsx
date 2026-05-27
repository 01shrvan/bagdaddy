"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useProjectSheetParams } from "@/hooks/sheets/use-project-sheet";

export function ProjectDeleteSheet() {
  const { projectDelete, setParams } = useProjectSheetParams();
  const isOpen = Boolean(projectDelete);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const del = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.projects.list.queryFilter());
        setParams({ projectDelete: null });
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => { if (!nextOpen) setParams({ projectDelete: null }); }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Delete project</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>All time entries for this project will also be permanently deleted.</SheetComponent.SheetDescription>
          </div>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>
        <form onSubmit={(e) => { e.preventDefault(); if (projectDelete) del.mutate({ id: projectDelete }); }} className="flex h-full flex-col">
          <div className="mt-auto p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={del.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" variant="destructive" size="lg" disabled={del.isPending}>
                {del.isPending ? "Deleting..." : "Delete project"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
