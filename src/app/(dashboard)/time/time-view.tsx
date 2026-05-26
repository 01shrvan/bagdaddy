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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockAddIcon, Delete01Icon, Clock01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

const schema = z.object({
  projectId: z.string().min(1, "Select a project"),
  hours: z.string().min(1, "Hours required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date required"),
});
type FormData = z.infer<typeof schema>;

function LogTimeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: projects } = useQuery(trpc.projects.list.queryOptions());

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { projectId: "", hours: "", description: "", date: new Date().toISOString().split("T")[0] },
  });

  const create = useMutation(trpc.time.create.mutationOptions({ onSuccess: () => { qc.invalidateQueries(trpc.time.list.queryFilter()); onClose(); reset(); } }));

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-medium">Log time</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1 px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select onValueChange={(v) => setValue("projectId", v)}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects?.filter(r => r.project.status === "ACTIVE").map(r => (
                    <SelectItem key={r.project.id} value={r.project.id}>{r.project.name} — {r.clientName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-xs text-destructive">{errors.projectId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="hours">Hours</Label>
                <Input id="hours" type="number" step="0.25" placeholder="2.5" {...register("hours")} />
                {errors.hours && <p className="text-xs text-destructive">{errors.hours.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" placeholder="What did you work on?" {...register("description")} />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => { onClose(); reset(); }}>Cancel</Button>
            <Button type="submit" size="sm" disabled={create.isPending}>{create.isPending ? "Saving..." : "Log time"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function TimeView() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: entries, isLoading } = useQuery(trpc.time.list.queryOptions());
  const deleteEntry = useMutation(trpc.time.delete.mutationOptions({ onSuccess: () => qc.invalidateQueries(trpc.time.list.queryFilter()) }));

  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalHours = entries?.reduce((sum, r) => sum + parseFloat(r.entry.hours), 0) ?? 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-medium">Time</h1>
          {totalHours > 0 && <span className="text-xs text-muted-foreground">{totalHours.toFixed(2)} hrs total</span>}
        </div>
        <Button size="sm" onClick={() => setSheetOpen(true)}>
          <HugeiconsIcon icon={ClockAddIcon} size={14} strokeWidth={2} className="mr-1.5" />
          Log time
        </Button>
      </header>

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !entries?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <HugeiconsIcon icon={Clock01Icon} size={32} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No time entries yet.</p>
            <Button size="sm" variant="outline" onClick={() => setSheetOpen(true)}>Log time</Button>
          </div>
        ) : (
          <div className="border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(({ entry, projectName, clientName }) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground text-sm">{new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                    <TableCell className="font-medium">{projectName}</TableCell>
                    <TableCell className="text-muted-foreground">{clientName}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.description ?? "—"}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{parseFloat(entry.hours).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(entry.id)}>
                        <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <LogTimeSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
            <AlertDialogDescription>This time entry will be permanently deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteEntry.mutate({ id: deleteId }); setDeleteId(null); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
