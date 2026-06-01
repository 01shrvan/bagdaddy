"use client";

import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";

const noir =
  liquidMetalPresets.find((p) => p.name.toLowerCase() === "noir") ??
  liquidMetalPresets[0];

export function LoginCover() {
  return (
    <LiquidMetal
      {...noir.params}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
