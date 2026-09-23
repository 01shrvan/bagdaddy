import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconLogo } from "@/components/icons";

export function LandingNav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <IconLogo size={18} className="text-foreground" />
          <span className="font-heading text-sm font-bold tracking-tight">
            bagdaddy
          </span>
        </Link>
        <Button asChild size="sm" className="h-9 rounded-none px-4">
          <Link href="/login">Start free</Link>
        </Button>
      </div>
    </header>
  );
}