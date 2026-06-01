import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconLogo } from "@/components/icons";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <IconLogo size={20} className="text-foreground" />
          <span className="font-heading text-base font-bold">bagdaddy</span>
        </Link>
        <Button asChild size="sm">
          <Link href="/login">Get started</Link>
        </Button>
      </div>
    </header>
  );
}
