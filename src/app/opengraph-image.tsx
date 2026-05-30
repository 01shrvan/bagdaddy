import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "bagdaddy — freelance finance, simplified";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <svg width="72" height="60" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50,5 L64,52 L80,14 L94,52 L94,70 Q94,76 88,76 L12,76 Q6,76 6,70 L6,52 L20,14 L36,52 Z"
              fill="white"
            />
            <circle cx="50" cy="5" r="6" fill="white" />
            <circle cx="20" cy="14" r="5" fill="white" />
            <circle cx="80" cy="14" r="5" fill="white" />
          </svg>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: "white",
                letterSpacing: "-4px",
                lineHeight: 1,
              }}
            >
              bagdaddy
            </span>
            <span
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0px",
                fontWeight: 400,
              }}
            >
              freelance finance, simplified
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
            }}
          >
            {["Clients", "Projects", "Time", "Invoices"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "8px 20px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 16,
                  borderRadius: 0,
                  fontWeight: 400,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
