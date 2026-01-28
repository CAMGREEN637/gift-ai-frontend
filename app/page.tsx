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
  if (confidence >= 0.8) return "#16a34a"; // green
  if (confidence >= 0.6) return "#65a30d"; // olive
  if (confidence >= 0.4) return "#facc15"; // yellow
  return "#9ca3af"; // gray
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

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      // 🔥 Auto-sort by confidence (highest first)
      const sorted = (data.gifts || []).sort(
        (a: Gift, b: Gift) => b.confidence - a.confidence
      );

      setResults(sorted);
    } catch (err) {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "720px", margin: "auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>🎁 AI Gift Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Gift for girlfriend who loves coffee"
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "1rem",
          fontSize: "1rem",
        }}
      />

      <button
        onClick={getRecommendations}
        disabled={loading || !query}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Find Gifts"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "2rem", padding: 0 }}>
        {results.map((gift, idx) => (
          <li
            key={idx}
            style={{
              listStyle: "none",
              border: "1px solid #e5e7eb",
              padding: "1.25rem",
              marginBottom: "1rem",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            {/* 🏆 TOP PICK BADGE */}
            {idx === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "12px",
                  background: "#f59e0b",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                🏆 Top Pick
              </div>
            )}

            <h3 style={{ marginBottom: "0.25rem" }}>{gift.name}</h3>
            <p style={{ marginBottom: "0.5rem", color: "#374151" }}>
              {gift.reason}
            </p>
            <p style={{ fontWeight: 600 }}>💰 ${gift.price}</p>

            {/* 🎯 Confidence UX */}
            <div style={{ marginTop: "0.75rem" }}>
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
                  width: "100%",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${gift.confidence * 100}%`,
                    backgroundColor: confidenceColor(gift.confidence),
                    borderRadius: "999px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

