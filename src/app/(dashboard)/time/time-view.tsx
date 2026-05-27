"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockAddIcon, Delete01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { useTimeSheetParams } from "@/hooks/sheets/use-time-sheet";
import { PageHeader } from "@/components/page-header";

export function TimeView() {
  const trpc = useTRPC();
  const { data: entries, isLoading } = useQuery(trpc.time.list.queryOptions());
  const { setParams } = useTimeSheetParams();

  const totalHours = entries?.reduce((sum, r) => sum + parseFloat(r.entry.hours), 0) ?? 0;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={totalHours > 0 ? `Time · ${totalHours.toFixed(1)} hrs` : "Time"}
        action={
          <Button size="sm" onClick={() => setParams({ timeCreate: true })}>
            <HugeiconsIcon icon={ClockAddIcon} size={14} strokeWidth={2} className="mr-1.5" />
            Log time
          </Button>
        }
      />

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !entries?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <HugeiconsIcon icon={Clock01Icon} size={32} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No time entries yet.</p>
            <Button size="sm" variant="outline" onClick={() => setParams({ timeCreate: true })}>Log time</Button>
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
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="font-medium">{projectName}</TableCell>
                    <TableCell className="text-muted-foreground">{clientName}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.description ?? "—"}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{parseFloat(entry.hours).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => setParams({ timeDelete: entry.id })}
                      >
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
    </div>
  );
}
