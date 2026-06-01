"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ShaderPanel } from "@/components/shader-panel";

type Props = {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden border py-24">
      <ShaderPanel opacity={0.5} />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center border bg-background/40 backdrop-blur-sm">
        <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} className="text-muted-foreground" />
      </div>
      <div className="relative z-10 space-y-1 text-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button size="sm" variant="outline" className="relative z-10" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
