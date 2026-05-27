"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon, MoreHorizontalIcon, Edit01Icon, Delete01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { useClientSheetParams } from "@/hooks/sheets/use-client-sheet";
import { PageHeader } from "@/components/page-header";

export function ClientsView() {
  const trpc = useTRPC();
  const { data: clientsList, isLoading } = useQuery(trpc.clients.list.queryOptions());
  const { setParams } = useClientSheetParams();

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Clients"
        action={
          <Button size="sm" onClick={() => setParams({ clientCreate: true })}>
            <HugeiconsIcon icon={UserAdd01Icon} size={14} strokeWidth={2} className="mr-1.5" />
            New client
          </Button>
        }
      />

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !clientsList?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <HugeiconsIcon icon={UserGroupIcon} size={32} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No clients yet. Add your first one.</p>
            <Button size="sm" variant="outline" onClick={() => setParams({ clientCreate: true })}>Add client</Button>
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
                          <DropdownMenuItem onClick={() => setParams({ clientEdit: client.id })}>
                            <HugeiconsIcon icon={Edit01Icon} size={13} strokeWidth={2} className="mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setParams({ clientDelete: client.id })}>
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
    </div>
  );
}
