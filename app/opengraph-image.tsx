import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Regala — AI Gift Advisor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#fffdf9",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Amber accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#f59e0b",
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              color: "#1c1917",
              fontFamily: "serif",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            The right gift for her.
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#78716c",
              fontFamily: "sans-serif",
              fontWeight: 400,
            }}
          >
            AI-powered gift advisor
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            padding: "20px 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            fontSize: 18,
            color: "#78716c",
          }}
        >
          🎁 Regala · AI Gift Advisor
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
