"use client";

import { Warp, warpPresets } from "@paper-design/shaders-react";

const base = warpPresets[0];

export function LoginCover() {
  return (
    <Warp
      {...base.params}
      colors={["#0e0e10", "#18181b", "#2a2a30", "#46464f"]}
      speed={0.5}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
