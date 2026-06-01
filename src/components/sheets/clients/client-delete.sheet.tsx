"use client";

import { Cancel01Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useClientSheetParams } from "@/hooks/sheets/use-client-sheet";

export function ClientDeleteSheet() {
  const { clientDelete, setParams } = useClientSheetParams();
  const isOpen = Boolean(clientDelete);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { data: counts, isLoading: countsLoading } = useQuery(
    trpc.clients.relatedCounts.queryOptions(
      { id: clientDelete ?? "" },
      { enabled: isOpen },
    ),
  );

  const lines = counts
    ? [
        [counts.projects, "project"],
        [counts.timeEntries, "time entry", "time entries"],
        [counts.invoices, "invoice"],
      ].filter(([n]) => (n as number) > 0)
    : [];

  const del = useMutation(
    trpc.clients.delete.mutationOptions({
      onSuccess: () => {
        qc.setQueryData(trpc.clients.list.queryOptions().queryKey, (old: any) =>
          old?.filter((c: any) => c.id !== clientDelete) ?? [],
        );
        qc.invalidateQueries({ queryKey: trpc.projects.list.queryOptions().queryKey });
        qc.invalidateQueries({ queryKey: trpc.invoices.list.queryOptions().queryKey });
        qc.invalidateQueries({ queryKey: trpc.time.list.queryOptions().queryKey });
        setParams({ clientDelete: null });
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => { if (!nextOpen) setParams({ clientDelete: null }); }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Delete client</SheetComponent.SheetTitle>
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
          onSubmit={(e) => { e.preventDefault(); if (clientDelete) del.mutate({ id: clientDelete }); }}
          className="flex h-full flex-col"
        >
          <div className="flex-1 p-4">
            <div className="flex gap-3 border border-destructive/20 p-4">
              <HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={1.5} className="text-destructive shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This permanently deletes the client
                  {countsLoading
                    ? " and any associated data."
                    : lines.length === 0
                      ? ". It has no associated data."
                      : ", and will also delete:"}
                </p>
                {!countsLoading && lines.length > 0 && (
                  <ul className="space-y-1">
                    {lines.map(([n, singular, plural]) => (
                      <li key={singular as string} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="size-1 rounded-full bg-destructive" />
                        <span className="font-medium tabular-nums">{n as number}</span>
                        <span className="text-muted-foreground">
                          {(n as number) === 1 ? (singular as string) : ((plural as string) ?? `${singular}s`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground/70">This action cannot be undone.</p>
              </div>
            </div>
          </div>
          <div className="shrink-0 border-t p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={del.isPending}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" variant="destructive" size="lg" disabled={del.isPending}>
                {del.isPending ? "Deleting..." : "Delete client"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
