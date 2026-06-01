"use client";

import { useEffect, useState } from "react";
import { GrainGradient, Warp, warpPresets } from "@paper-design/shaders-react";

const warpBase = warpPresets[0];

type Props = {
  variant?: "grain" | "warp";
  className?: string;
  opacity?: number;
};

export function ShaderPanel({ variant = "grain", className = "", opacity = 0.55 }: Props) {
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const fill = { width: "100%", height: "100%" } as const;
  const speed = motion ? 0.35 : 0;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {variant === "warp" ? (
        <Warp
          {...warpBase.params}
          colors={["#0e0e10", "#18181b", "#2a2a30", "#46464f"]}
          speed={speed}
          style={fill}
        />
      ) : (
        <GrainGradient
          colorBack="#0d0d0f"
          colors={["#15151a", "#24242c", "#37373f"]}
          softness={0.9}
          intensity={0.32}
          noise={0.35}
          speed={speed}
          style={fill}
        />
      )}
    </div>
  );
}
