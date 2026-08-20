import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — launch with the important things right`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f5f2ea",
        color: "#17201f",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#bfe3d1",
          borderRadius: "999px",
          display: "flex",
          height: "300px",
          opacity: 0.8,
          position: "absolute",
          right: "-60px",
          top: "-80px",
          width: "300px",
        }}
      />
      <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
        {siteConfig.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 76,
            letterSpacing: "-4px",
            lineHeight: 1.02,
            maxWidth: "940px",
          }}
        >
          Build the right site. Keep the old mistakes out.
        </div>
        <div style={{ color: "#56605d", display: "flex", fontSize: 26 }}>
          Next.js defaults, technical SEO, migration discipline, and launch
          checks.
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: 22,
          gap: 16,
        }}
      >
        <div
          style={{
            background: "#df5028",
            borderRadius: "50%",
            display: "flex",
            height: 14,
            width: 14,
          }}
        />
        Explicit pages · Deletable defaults · Evidence before launch
      </div>
    </div>,
    size,
  );
}
