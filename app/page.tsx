"use client";

import { useState } from "react";

type Gift = {
  name: string;
  price: number;
  description: string;
  confidence: number;
};

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
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1>🎁 AI Gift Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Gift for dad who likes grilling"
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "1rem",
        }}
      />

      <button
        onClick={getRecommendations}
        disabled={loading || !query}
        style={{ padding: "0.75rem 1.5rem" }}
      >
        {loading ? "Thinking..." : "Find Gifts"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "2rem" }}>
        {results.map((gift, idx) => (
          <li
            key={idx}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{gift.name}</h3>
            <p>{gift.description}</p>
            <p>💰 ${gift.price}</p>
            <p>🎯 Confidence: {(gift.confidence * 100).toFixed(0)}%</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
