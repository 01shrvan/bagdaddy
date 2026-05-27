"use client";

import { Cancel01Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as SheetComponent from "@/components/ui/sheet";

interface DeleteAccountSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userEmail: string;
  confirmEmail: string;
  setConfirmEmail: (v: string) => void;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}

export function DeleteAccountSheet({
  open,
  setOpen,
  userEmail,
  confirmEmail,
  setConfirmEmail,
  canDelete,
  isDeleting,
  onDelete,
}: DeleteAccountSheetProps) {
  return (
    <SheetComponent.Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setConfirmEmail("");
      }}
    >
      <SheetComponent.SheetContent showCloseButton={false}>
        <SheetComponent.SheetHeader className="flex flex-row items-center justify-between">
          <div>
            <SheetComponent.SheetTitle>Delete account</SheetComponent.SheetTitle>
            <SheetComponent.SheetDescription>This action is permanent and cannot be undone.</SheetComponent.SheetDescription>
          </div>
          <SheetComponent.SheetClose asChild>
            <Button variant="ghost" className="m-0 size-auto p-0 hover:bg-transparent" size="icon">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </SheetComponent.SheetClose>
        </SheetComponent.SheetHeader>

        <form
          onSubmit={(e) => { e.preventDefault(); if (canDelete && !isDeleting) onDelete(); }}
          className="flex h-full flex-col"
        >
          <div className="flex-1 space-y-4 p-4">
            <div className="flex gap-3 border border-destructive/20 p-4">
              <HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={1.5} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                All your clients, projects, time entries, and invoices will be permanently erased. There is no way to recover this data.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delete-account-email">
                Type <span className="font-medium text-foreground">{userEmail}</span> to confirm
              </Label>
              <Input
                id="delete-account-email"
                autoComplete="off"
                autoFocus
                disabled={isDeleting}
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={userEmail}
              />
            </div>
          </div>

          <div className="shrink-0 border-t p-4">
            <div className="grid grid-cols-2 gap-x-2">
              <SheetComponent.SheetClose asChild>
                <Button type="button" variant="outline" size="lg" disabled={isDeleting}>Cancel</Button>
              </SheetComponent.SheetClose>
              <Button type="submit" variant="destructive" size="lg" disabled={!canDelete || isDeleting}>
                {isDeleting ? "Deleting..." : "Delete account"}
              </Button>
            </div>
          </div>
        </form>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
