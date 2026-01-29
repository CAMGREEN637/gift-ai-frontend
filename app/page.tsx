"use client";

import { useState } from "react";

type Gift = {
  name: string;
  price: number;
  confidence: number;
  ranking_reasons?: string[];
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

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      // 🔑 ALWAYS sort by confidence
      const gifts = (data.gifts || []).sort(
        (a: Gift, b: Gift) => b.confidence - a.confidence
      );

      setResults(gifts);
    } catch {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          🎁 AI Gift Finder
        </h1>
        <p className="text-slate-600 mb-6">
          Tell us who you’re shopping for — we’ll do the thinking.
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gift for girlfriend who loves coffee"
            className="flex-1 rounded-lg border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={getRecommendations}
            disabled={loading || !query}
            className="rounded-lg bg-indigo-600 text-white px-6 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Find Gifts"}
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {/* Results */}
        <div className="space-y-4">
          {results.map((gift, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-5 border relative"
            >
              {/* Top Pick Badge */}
              {idx === 0 && (
                <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  🏆 Top Pick
                </span>
              )}

              <h3 className="text-xl font-semibold text-slate-800">
                {gift.name}
              </h3>

              <p className="text-slate-500 mt-1">
                💰 ${gift.price}
              </p>

              {/* Confidence label (human-friendly) */}
              <p className="mt-2 text-sm font-medium text-indigo-600">
                {gift.confidence >= 0.75
                  ? "Excellent match"
                  : gift.confidence >= 0.6
                  ? "Good option"
                  : "Worth considering"}
              </p>

              {/* Reasons */}
              <ul className="mt-3 list-disc list-inside text-slate-600 text-sm">
                {(gift.ranking_reasons ?? []).map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
