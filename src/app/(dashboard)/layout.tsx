import { GlobalSheets } from "@/components/sheets/global-sheets";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { IconLogo } from "@/components/icons";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-12 shrink-0 items-center gap-3 border-b px-4 md:hidden">
          <SidebarTrigger className="rounded" />
          <div className="flex items-center gap-2">
            <IconLogo size={14} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">bagdaddy</span>
          </div>
        </div>
        {children}
      </SidebarInset>
      <GlobalSheets />
    </SidebarProvider>
  );
}
