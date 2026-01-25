"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function getRecommendations() {
    if (!query) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/recommend?query=${encodeURIComponent(query)}`,
        {
          headers: {
            "x-api-key": "dev-key", // change later
          },
        }
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">
        🎁 AI Gift Finder
      </h1>

      <p className="mb-6 text-gray-600">
        Describe the person and occasion, and I’ll recommend great gifts.
      </p>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 border rounded"
          placeholder="e.g. Gift for my outdoorsy brother who loves coffee"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={getRecommendations}
          className="px-5 py-3 bg-black text-white rounded"
        >
          {loading ? "Thinking..." : "Find Gifts"}
        </button>
      </div>

      <div className="grid gap-4">
        {results.map((gift, i) => (
          <div
            key={i}
            className="p-4 border rounded bg-white shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {gift.name}
            </h2>

            <p className="text-gray-600 mb-2">
              {gift.description}
            </p>

            <p className="text-sm text-gray-500">
              💰 ${gift.price} · Confidence: {gift.confidence}
            </p>

            {gift.ranking_reasons?.length > 0 && (
              <ul className="mt-2 text-sm text-green-700 list-disc ml-5">
                {gift.ranking_reasons.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

