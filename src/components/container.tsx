import type * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-10 md:px-6 xl:max-w-6xl",
        className,
      )}
      {...props}
    />
  );
}
