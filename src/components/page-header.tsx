"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1 size-8" />
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm font-medium">{title}</span>
      {action && <div className="ml-auto">{action}</div>}
    </header>
  );
}
