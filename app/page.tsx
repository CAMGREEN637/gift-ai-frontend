"use client";

import { useState } from "react";

type Gift = {
  name: string;
  price: number;
  reason: string;
  confidence: number;
};

function confidenceLabel(confidence: number) {
  if (confidence >= 0.8) return "Excellent match";
  if (confidence >= 0.6) return "Strong match";
  if (confidence >= 0.4) return "Good option";
  return "Wildcard pick";
}

function confidenceColor(confidence: number) {
  if (confidence >= 0.8) return "#22c55e";
  if (confidence >= 0.6) return "#84cc16";
  if (confidence >= 0.4) return "#facc15";
  return "#9ca3af";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRecommendations() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(
        `${apiUrl}/recommend?query=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      const sorted = (data.gifts || []).sort(
        (a: Gift, b: Gift) => b.confidence - a.confidence
      );

      setResults(sorted);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        padding: "4rem 1rem",
        color: "#f8fafc",
      }}
    >
      <main
        style={{
          maxWidth: "760px",
          margin: "auto",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "2.5rem",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
          }}
        >
          🎁 AI Gift Finder
        </h1>

        <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
          Thoughtful gift ideas, ranked by how well they match.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Gift for girlfriend who loves coffee"
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "12px",
            border: "none",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        />

        <button
          onClick={getRecommendations}
          disabled={loading || !query}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #f59e0b, #facc15)",
            color: "#020617",
            border: "none",
            cursor: "pointer",
            marginBottom: "1.5rem",
          }}
        >
          {loading ? "Thinking..." : "Find Gifts"}
        </button>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <ul style={{ padding: 0 }}>
          {results.map((gift, idx) => (
            <li
              key={idx}
              style={{
                listStyle: "none",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "1.25rem",
                position: "relative",
                boxShadow:
                  idx === 0
                    ? "0 0 0 2px #facc15, 0 20px 50px rgba(250,204,21,0.3)"
                    : "0 12px 30px rgba(0,0,0,0.3)",
                transition: "transform 0.2s ease",
              }}
            >
              {idx === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "16px",
                    background: "#facc15",
                    color: "#020617",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  🏆 Top Pick
                </div>
              )}

              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {gift.name}
              </h3>

              <p style={{ opacity: 0.85, margin: "0.5rem 0" }}>
                {gift.reason}
              </p>

              <p style={{ fontWeight: 600 }}>💰 ${gift.price}</p>

              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: confidenceColor(gift.confidence),
                    marginBottom: "0.25rem",
                  }}
                >
                  {confidenceLabel(gift.confidence)} •{" "}
                  {(gift.confidence * 100).toFixed(0)}%
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#020617",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${gift.confidence * 100}%`,
                      background: confidenceColor(gift.confidence),
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
