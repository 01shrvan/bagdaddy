"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  FolderOpenIcon,
  Clock01Icon,
  InvoiceIcon,
} from "@hugeicons/core-free-icons";
import { IconLogo } from "@/components/icons";
import { NavUser } from "@/components/nav-user";
import * as SidebarComponent from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/clients",   label: "Clients",   icon: UserGroupIcon },
  { href: "/projects",  label: "Projects",  icon: FolderOpenIcon },
  { href: "/time",      label: "Time",      icon: Clock01Icon },
  { href: "/invoices",  label: "Invoices",  icon: InvoiceIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <SidebarComponent.Sidebar collapsible="icon" className="border-r-0">
      <SidebarComponent.SidebarHeader className="flex flex-row items-center justify-between">
        {state === "collapsed" ? (
          <SidebarComponent.SidebarMenu>
            <SidebarComponent.SidebarMenuItem>
              <SidebarComponent.SidebarMenuButton className="rounded" onClick={toggleSidebar}>
                <IconLogo size={16} className="shrink-0" />
              </SidebarComponent.SidebarMenuButton>
            </SidebarComponent.SidebarMenuItem>
          </SidebarComponent.SidebarMenu>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1">
            <IconLogo size={16} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">bagdaddy</span>
          </div>
        )}
        {state !== "collapsed" && (
          <SidebarComponent.SidebarTrigger className="rounded" />
        )}
      </SidebarComponent.SidebarHeader>

      <div className="w-full border-b" />

      <SidebarComponent.SidebarContent>
        <SidebarComponent.SidebarGroup>
          <SidebarComponent.SidebarGroupLabel>Menu</SidebarComponent.SidebarGroupLabel>
          <SidebarComponent.SidebarGroupContent>
            <SidebarComponent.SidebarMenu className="space-y-1">
              {nav.map(({ href, label, icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <SidebarComponent.SidebarMenuItem key={href}>
                    <SidebarComponent.SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={label}
                      className="rounded font-medium"
                    >
                      <Link href={href}>
                        <HugeiconsIcon
                          icon={icon}
                          size={16}
                          strokeWidth={active ? 2 : 1.5}
                          className="text-muted-foreground"
                        />
                        <span>{label}</span>
                      </Link>
                    </SidebarComponent.SidebarMenuButton>
                  </SidebarComponent.SidebarMenuItem>
                );
              })}
            </SidebarComponent.SidebarMenu>
          </SidebarComponent.SidebarGroupContent>
        </SidebarComponent.SidebarGroup>
      </SidebarComponent.SidebarContent>

      <SidebarComponent.SidebarFooter>
        <div className="w-full border-b" />
        <NavUser />
      </SidebarComponent.SidebarFooter>
    </SidebarComponent.Sidebar>
  );
}
