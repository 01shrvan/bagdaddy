"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderAddIcon, MoreHorizontalIcon, Edit01Icon, Delete01Icon, FolderOpenIcon } from "@hugeicons/core-free-icons";
import { useProjectSheetParams } from "@/hooks/sheets/use-project-sheet";
import { Container } from "@/components/container";

const STATUS_LABELS = { ACTIVE: "Active", COMPLETED: "Completed", ARCHIVED: "Archived" } as const;
const STATUS_VARIANTS = { ACTIVE: "default", COMPLETED: "secondary", ARCHIVED: "outline" } as const;

export function ProjectsView() {
  const trpc = useTRPC();
  const { data: rows, isLoading } = useQuery(trpc.projects.list.queryOptions());
  const { setParams } = useProjectSheetParams();

  return (
    <Container>
      <main className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-semibold text-3xl tracking-tight">Projects</h1>
            <p className="text-muted-foreground text-sm">
              Track active projects, rates, and client assignments.
            </p>
          </div>
          <Button size="sm" onClick={() => setParams({ projectCreate: true })}>
            <HugeiconsIcon icon={FolderAddIcon} size={14} strokeWidth={2} className="mr-1.5" />
            New project
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !rows?.length ? (
          <div className="flex flex-col items-center justify-center border py-24 gap-4">
            <div className="flex h-10 w-10 items-center justify-center border">
              <HugeiconsIcon icon={FolderOpenIcon} size={18} strokeWidth={1.5} className="text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">No projects yet</p>
              <p className="text-xs text-muted-foreground">Create a project and start tracking time.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setParams({ projectCreate: true })}>
              New project
            </Button>
          </div>
        ) : (
          <div className="border">
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
                    <TableCell className="text-muted-foreground">
                      ${parseFloat(project.hourlyRate).toFixed(2)}/hr
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[project.status] as any}>
                        {STATUS_LABELS[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} strokeWidth={2} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setParams({ projectEdit: project.id })}>
                            <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={2} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setParams({ projectDelete: project.id })}
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} className="mr-2" />
                            Delete
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
      </main>
    </Container>
  );
}
