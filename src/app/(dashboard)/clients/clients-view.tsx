"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon, MoreHorizontalIcon, Edit01Icon, Delete01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { useClientSheetParams } from "@/hooks/sheets/use-client-sheet";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";

export function ClientsView() {
  const trpc = useTRPC();
  const { data: clientsList, isLoading } = useQuery(trpc.clients.list.queryOptions());
  const { setParams } = useClientSheetParams();

  return (
    <Container>
      <main className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-semibold text-3xl tracking-tight">Clients</h1>
            <p className="text-muted-foreground text-sm">
              Manage your client list and contact details.
            </p>
          </div>
          <Button size="sm" onClick={() => setParams({ clientCreate: true })}>
            <HugeiconsIcon icon={UserAdd01Icon} size={14} strokeWidth={2} className="mr-1.5" />
            New client
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !clientsList?.length ? (
          <EmptyState
            icon={UserGroupIcon}
            title="No clients yet"
            description="Add your first client to get started."
            actionLabel="Add client"
            onAction={() => setParams({ clientCreate: true })}
          />
        ) : (
          <div className="border">
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
                          <DropdownMenuItem onClick={() => setParams({ clientEdit: client.id })}>
                            <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={2} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setParams({ clientDelete: client.id })}
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
