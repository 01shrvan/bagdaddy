"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockAddIcon, Delete01Icon, Clock01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { useTimeSheetParams } from "@/hooks/sheets/use-time-sheet";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";

export function TimeView() {
  const trpc = useTRPC();
  const { data: entries, isLoading } = useQuery(trpc.time.list.queryOptions());
  const { setParams } = useTimeSheetParams();

  const totalHours = entries?.reduce((sum, r) => sum + parseFloat(r.entry.hours), 0) ?? 0;

  return (
    <Container>
      <main className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-semibold text-3xl tracking-tight">Time</h1>
            <p className="text-muted-foreground text-sm">
              {totalHours > 0
                ? `${totalHours.toFixed(2)} hours logged across all projects.`
                : "Log hours against your active projects."}
            </p>
          </div>
          <Button size="sm" onClick={() => setParams({ timeCreate: true })}>
            <HugeiconsIcon icon={ClockAddIcon} size={14} strokeWidth={2} className="mr-1.5" />
            Log time
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !entries?.length ? (
          <EmptyState
            icon={Clock01Icon}
            title="No time entries yet"
            description="Start logging hours against your projects."
            actionLabel="Log time"
            onAction={() => setParams({ timeCreate: true })}
          />
        ) : (
          <div className="border">
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
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{projectName}</TableCell>
                    <TableCell className="text-muted-foreground">{clientName}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.description ?? "—"}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {parseFloat(entry.hours).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => setParams({ timeEdit: entry.id })}
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} size={13} strokeWidth={2} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setParams({ timeDelete: entry.id })}
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </Container>
  );
}
