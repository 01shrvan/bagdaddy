"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import * as SheetComponent from "@/components/ui/sheet";
import { useTRPC } from "@/lib/trpc/client";
import { useSheetsStore } from "@/store/sheets";

export function ClientDeleteSheet() {
  const { clientDelete, closeClientDelete } = useSheetsStore();
  const isOpen = Boolean(clientDelete);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const del = useMutation(
    trpc.clients.delete.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.clients.list.queryFilter());
        closeClientDelete();
      },
    }),
  );

  return (
    <SheetComponent.Sheet
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeClientDelete();
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Delete client</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>
              This will permanently delete the client and all associated projects and data.
            </SheetComponent.SheetDescription>
          </div>
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
          onSubmit={(e) => {
            e.preventDefault();
            if (clientDelete) del.mutate({ id: clientDelete });
          }}
          className="flex h-full flex-col"
        >
          <div className="mt-auto p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={del.isPending}>
                  Cancel
                </Button>
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
