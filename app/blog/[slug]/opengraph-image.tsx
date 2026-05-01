import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/content/articles";

export const runtime = "edge";
export const alt = "Regala Gift Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OCCASION_LABELS: Record<string, string> = {
  birthday: "🎂 Birthday",
  valentines: "❤️ Valentine's Day",
  anniversary: "💝 Anniversary",
  christmas: "🎄 Christmas",
  mothers_day: "🌸 Mother's Day",
  just_because: "✨ Just Because",
  apology: "🙏 Apology",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "#fffdf9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "serif",
            fontSize: 48,
            color: "#1c1917",
          }}
        >
          Regala — AI Gift Advisor
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const occasionLabel =
    OCCASION_LABELS[article.occasion] ?? article.occasion;
  const titleFontSize = article.title.length > 50 ? 42 : 52;

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
          {/* Occasion label */}
          <div
            style={{
              fontSize: 20,
              color: "#b45309",
              fontFamily: "sans-serif",
              fontWeight: 600,
              marginBottom: 24,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {occasionLabel}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: titleFontSize,
              color: "#1c1917",
              fontFamily: "serif",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {article.title}
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
