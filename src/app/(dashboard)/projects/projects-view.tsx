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
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderAddIcon, MoreHorizontalIcon, Edit01Icon, Delete01Icon, FolderOpenIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

const STATUS_LABELS = { ACTIVE: "Active", COMPLETED: "Completed", ARCHIVED: "Archived" } as const;
const STATUS_VARIANTS = { ACTIVE: "default", COMPLETED: "secondary", ARCHIVED: "outline" } as const;

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});
type FormData = z.infer<typeof schema>;

type Project = { id: string; clientId: string; name: string; description: string | null; hourlyRate: string; status: "ACTIVE" | "COMPLETED" | "ARCHIVED"; createdAt: Date };
type Row = { project: Project; clientName: string };

function ProjectSheet({ open, onClose, row }: { open: boolean; onClose: () => void; row?: Row }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: clientsList } = useQuery(trpc.clients.list.queryOptions());
  const isEdit = !!row;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      clientId: row?.project.clientId ?? "",
      name: row?.project.name ?? "",
      description: row?.project.description ?? "",
      hourlyRate: row?.project.hourlyRate ?? "",
      status: row?.project.status ?? "ACTIVE",
    },
  });

  const create = useMutation(trpc.projects.create.mutationOptions({ onSuccess: () => { qc.invalidateQueries(trpc.projects.list.queryFilter()); onClose(); reset(); } }));
  const update = useMutation(trpc.projects.update.mutationOptions({ onSuccess: () => { qc.invalidateQueries(trpc.projects.list.queryFilter()); onClose(); } }));

  function onSubmit(data: FormData) {
    if (isEdit) update.mutate({ id: row.project.id, name: data.name, description: data.description, hourlyRate: data.hourlyRate, status: data.status ?? "ACTIVE" });
    else create.mutate({ clientId: data.clientId, name: data.name, description: data.description, hourlyRate: data.hourlyRate });
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-medium">{isEdit ? "Edit project" : "New project"}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1 px-6 py-5 space-y-4">
            {!isEdit && (
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select onValueChange={(v) => setValue("clientId", v)} defaultValue={watch("clientId")}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{clientsList?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="pname">Project name</Label>
              <Input id="pname" placeholder="Website redesign" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rate">Hourly rate ($)</Label>
              <Input id="rate" type="number" step="0.01" placeholder="75.00" {...register("hourlyRate")} />
              {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate.message}</p>}
            </div>
            {isEdit && (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select onValueChange={(v) => setValue("status", v as "ACTIVE" | "COMPLETED" | "ARCHIVED")} defaultValue={watch("status")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-border flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => { onClose(); reset(); }}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Saving..." : isEdit ? "Save changes" : "Create project"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function ProjectsView() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: rows, isLoading } = useQuery(trpc.projects.list.queryOptions());
  const deleteProject = useMutation(trpc.projects.delete.mutationOptions({ onSuccess: () => qc.invalidateQueries(trpc.projects.list.queryFilter()) }));

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Row | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <h1 className="text-sm font-medium">Projects</h1>
        <Button size="sm" onClick={() => { setEditing(undefined); setSheetOpen(true); }}>
          <HugeiconsIcon icon={FolderAddIcon} size={14} strokeWidth={2} className="mr-1.5" />
          New project
        </Button>
      </header>

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !rows?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <HugeiconsIcon icon={FolderOpenIcon} size={32} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No projects yet. Create your first one.</p>
            <Button size="sm" variant="outline" onClick={() => setSheetOpen(true)}>New project</Button>
          </div>
        ) : (
          <div className="border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ project, clientName }) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">{clientName}</TableCell>
                    <TableCell className="text-muted-foreground">${parseFloat(project.hourlyRate).toFixed(2)}/hr</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[project.status] as any}>{STATUS_LABELS[project.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditing({ project, clientName }); setSheetOpen(true); }}>
                            <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={2} className="mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(project.id)}>
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

      <ProjectSheet open={sheetOpen} onClose={() => setSheetOpen(false)} row={editing} />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>All time entries for this project will also be deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteProject.mutate({ id: deleteId }); setDeleteId(null); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
