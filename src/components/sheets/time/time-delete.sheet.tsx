"use client";

import { Cancel01Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useTimeSheetParams } from "@/hooks/sheets/use-time-sheet";

export function TimeDeleteSheet() {
  const { timeDelete, setParams } = useTimeSheetParams();
  const isOpen = Boolean(timeDelete);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const del = useMutation(
    trpc.time.delete.mutationOptions({
      onSuccess: () => {
        qc.setQueryData(trpc.time.list.queryOptions().queryKey, (old: any) =>
          old?.filter((r: any) => r.entry.id !== timeDelete) ?? [],
        );
        setParams({ timeDelete: null });
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => { if (!nextOpen) setParams({ timeDelete: null }); }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Delete time entry</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>This action cannot be undone.</SheetComponent.SheetDescription>
          </div>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form
          onSubmit={(e) => { e.preventDefault(); if (timeDelete) del.mutate({ id: timeDelete }); }}
          className="flex h-full flex-col"
        >
          <div className="flex-1 p-4">
            <div className="flex gap-3 border border-destructive/20 p-4">
              <HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={1.5} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                This time entry will be permanently deleted and cannot be recovered.
              </p>
            </div>
          </div>
          <div className="shrink-0 border-t p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={del.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" variant="destructive" size="lg" disabled={del.isPending}>
                {del.isPending ? "Deleting..." : "Delete entry"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
