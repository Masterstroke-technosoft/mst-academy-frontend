import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "How to Learn Blockchain in 2026: A Complete Roadmap";
    const category = searchParams.get("category") || "Web3 Developer Roadmap";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0b0f19",
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(227, 30, 36, 0.18) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            padding: "60px 80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Top Brand Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "#e31e24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "#ffffff",
                }}
              >
                M
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  letterSpacing: "-0.5px",
                  color: "#ffffff",
                }}
              >
                Masterstroke <span style={{ color: "#e31e24" }}>Academy</span>
              </div>
            </div>

            <div
              style={{
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: "rgba(227, 30, 36, 0.15)",
                border: "1px solid rgba(227, 30, 36, 0.4)",
                color: "#ff5252",
                fontSize: "16px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {category}
            </div>
          </div>

          {/* Center Main Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? "52px" : "62px",
                fontWeight: "900",
                lineHeight: "1.15",
                letterSpacing: "-1px",
                color: "#ffffff",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                lineHeight: "1.4",
              }}
            >
              Comprehensive Guide &bull; Solidity &bull; EVM &bull; Developer Tooling &bull; Auditing
            </div>
          </div>

          {/* Bottom Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            <div>masterstroke.academy/blogs</div>
            <div style={{ color: "#e31e24", fontWeight: "600" }}>Live Code Execution &bull; Verifiable Credentials</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
