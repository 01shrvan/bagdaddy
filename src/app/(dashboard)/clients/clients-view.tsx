"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon, MoreHorizontalIcon, Edit01Icon, Delete01Icon, UserGroupIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

type Client = { id: string; name: string; email: string | null; phone: string | null; address: string | null; createdAt: Date };

function ClientSheet({ open, onClose, client }: { open: boolean; onClose: () => void; client?: Client }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const isEdit = !!client;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { name: client?.name ?? "", email: client?.email ?? "", phone: client?.phone ?? "", address: client?.address ?? "" },
  });

  const create = useMutation(trpc.clients.create.mutationOptions({ onSuccess: () => { qc.invalidateQueries(trpc.clients.list.queryFilter()); onClose(); reset(); } }));
  const update = useMutation(trpc.clients.update.mutationOptions({ onSuccess: () => { qc.invalidateQueries(trpc.clients.list.queryFilter()); onClose(); } }));

  function onSubmit(data: FormData) {
    if (isEdit) update.mutate({ id: client.id, ...data });
    else create.mutate(data);
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-medium">{isEdit ? "Edit client" : "New client"}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1 px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Acme Corp" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hello@acme.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 555 000 0000" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St" {...register("address")} />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => { onClose(); reset(); }}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Saving..." : isEdit ? "Save changes" : "Create client"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function ClientsView() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: clientsList, isLoading } = useQuery(trpc.clients.list.queryOptions());
  const deleteClient = useMutation(trpc.clients.delete.mutationOptions({ onSuccess: () => qc.invalidateQueries(trpc.clients.list.queryFilter()) }));

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Client | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <h1 className="text-sm font-medium">Clients</h1>
        <Button size="sm" onClick={() => { setEditing(undefined); setSheetOpen(true); }}>
          <HugeiconsIcon icon={UserAdd01Icon} size={14} strokeWidth={2} className="mr-1.5" />
          New client
        </Button>
      </header>

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !clientsList?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <HugeiconsIcon icon={UserGroupIcon} size={32} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No clients yet. Add your first one.</p>
            <Button size="sm" variant="outline" onClick={() => setSheetOpen(true)}>Add client</Button>
          </div>
        ) : (
          <div className="border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsList.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{client.phone ?? "—"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditing(client); setSheetOpen(true); }}>
                            <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={2} className="mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(client.id)}>
                            <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} className="mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ClientSheet open={sheetOpen} onClose={() => setSheetOpen(false)} client={editing} />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client?</AlertDialogTitle>
            <AlertDialogDescription>This will also delete all associated projects and data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteClient.mutate({ id: deleteId }); setDeleteId(null); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
