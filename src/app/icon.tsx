import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="20" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50,5 L64,52 L80,14 L94,52 L94,70 Q94,76 88,76 L12,76 Q6,76 6,70 L6,52 L20,14 L36,52 Z"
            fill="white"
          />
          <circle cx="50" cy="5" r="6" fill="white" />
          <circle cx="20" cy="14" r="5" fill="white" />
          <circle cx="80" cy="14" r="5" fill="white" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
