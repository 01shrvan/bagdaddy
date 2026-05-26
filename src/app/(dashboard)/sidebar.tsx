"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  FolderOpenIcon,
  Clock01Icon,
  InvoiceIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { IconLogo } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/clients", label: "Clients", icon: UserGroupIcon },
  { href: "/projects", label: "Projects", icon: FolderOpenIcon },
  { href: "/time", label: "Time", icon: Clock01Icon },
  { href: "/invoices", label: "Invoices", icon: InvoiceIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-sidebar-border">
        <IconLogo size={22} className="text-sidebar-foreground shrink-0" />
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          bagdaddy
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <HugeiconsIcon
                icon={icon}
                size={16}
                strokeWidth={active ? 2 : 1.5}
                className="shrink-0"
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.5} className="shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
