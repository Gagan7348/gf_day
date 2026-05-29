import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Our Story 💜";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0e0b16 0%, #1a0e2e 40%, #2d1b4e 70%, #0e0b16 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,29,118,0.4) 0%, transparent 70%)",
            top: 60,
            left: 100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,170,234,0.15) 0%, transparent 70%)",
            bottom: 80,
            right: 150,
          }}
        />

        {/* Heart */}
        <div style={{ fontSize: 80, marginBottom: 20 }}>💜</div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            background: "linear-gradient(to right, #FFAAEA, #EAC435, #98C1D9)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 16,
            letterSpacing: -1,
          }}
        >
          Our Story
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.4)",
            fontStyle: "italic",
            marginBottom: 40,
          }}
        >
          your little corner of the internet
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,170,234,0.5)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          ♥ the night everything began
        </div>
      </div>
    ),
    { ...size }
  );
}
