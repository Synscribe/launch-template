import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — build the site and check the launch`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const launchSteps = [
  ["01", "Map the routes", "Migration"],
  ["02", "Write the page", "Message + SEO"],
  ["03", "Check production", "Launch"],
] as const;

export default function PlaceholderOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#f5f2ea",
        color: "#17201f",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        overflow: "hidden",
        padding: "58px 64px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle at center, rgba(191,227,209,0.9) 0%, rgba(191,227,209,0) 68%)",
          borderRadius: "999px",
          display: "flex",
          height: "560px",
          position: "absolute",
          right: "-120px",
          top: "-170px",
          width: "560px",
        }}
      />
      <div
        style={{
          border: "1px solid rgba(23,32,31,0.08)",
          borderRadius: "999px",
          display: "flex",
          height: "430px",
          position: "absolute",
          right: "70px",
          top: "100px",
          width: "430px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: "56%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "14px" }}>
          <div
            style={{
              alignItems: "center",
              background: "#17201f",
              borderRadius: "999px",
              color: "#f5f2ea",
              display: "flex",
              fontSize: 14,
              fontWeight: 800,
              height: "36px",
              justifyContent: "center",
              width: "36px",
            }}
          >
            LT
          </div>
          <div style={{ display: "flex", fontSize: 23, fontWeight: 700 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#c83f1b",
              display: "flex",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.16em",
              marginBottom: "22px",
              textTransform: "uppercase",
            }}
          >
            A practical launch system
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Georgia, serif",
              fontSize: 72,
              letterSpacing: "-0.055em",
              lineHeight: 0.94,
            }}
          >
            <span>Build the site.</span>
            <span>Check the launch.</span>
          </div>
          <div
            style={{
              color: "#56605d",
              display: "flex",
              fontSize: 22,
              lineHeight: 1.45,
              marginTop: "28px",
              maxWidth: "570px",
            }}
          >
            Migrations, rebuilds, and new websites—with the important defaults
            close to the code.
          </div>
        </div>

        <div
          style={{
            color: "#56605d",
            display: "flex",
            fontSize: 16,
            fontWeight: 700,
            gap: "12px",
          }}
        >
          <span>Next.js</span>
          <span style={{ color: "#df5028" }}>•</span>
          <span>Technical SEO</span>
          <span style={{ color: "#df5028" }}>•</span>
          <span>Launch checks</span>
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
          position: "relative",
          width: "44%",
        }}
      >
        <div
          style={{
            background: "#fbfaf6",
            border: "1px solid rgba(23,32,31,0.12)",
            borderRadius: "28px",
            boxShadow: "0 28px 70px rgba(29,41,38,0.12)",
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            transform: "rotate(2deg)",
            width: "440px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              borderBottom: "1px solid rgba(23,32,31,0.1)",
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "20px",
            }}
          >
            <span style={{ display: "flex", fontSize: 18, fontWeight: 800 }}>
              Launch path
            </span>
            <span
              style={{
                background: "#bfe3d1",
                borderRadius: "999px",
                display: "flex",
                fontSize: 12,
                fontWeight: 800,
                padding: "7px 11px",
                textTransform: "uppercase",
              }}
            >
              Ready to review
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "8px",
            }}
          >
            {launchSteps.map(([number, label, context]) => (
              <div
                key={number}
                style={{
                  alignItems: "center",
                  borderBottom: "1px solid rgba(23,32,31,0.09)",
                  display: "flex",
                  padding: "22px 0",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: number === "03" ? "#df5028" : "#17201f",
                    borderRadius: "999px",
                    color: "#fbfaf6",
                    display: "flex",
                    fontSize: 13,
                    fontWeight: 800,
                    height: "36px",
                    justifyContent: "center",
                    marginRight: "16px",
                    width: "36px",
                  }}
                >
                  {number}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    gap: "5px",
                  }}
                >
                  <span
                    style={{ display: "flex", fontSize: 17, fontWeight: 800 }}
                  >
                    {label}
                  </span>
                  <span
                    style={{ color: "#7e8783", display: "flex", fontSize: 13 }}
                  >
                    {context}
                  </span>
                </div>
                <div
                  style={{
                    alignItems: "center",
                    background: "#bfe3d1",
                    borderRadius: "999px",
                    display: "flex",
                    fontSize: 10,
                    fontWeight: 900,
                    height: "24px",
                    justifyContent: "center",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    width: "38px",
                  }}
                >
                  Done
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
