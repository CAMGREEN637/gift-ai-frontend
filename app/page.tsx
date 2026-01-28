"use client";

import { useState } from "react";

type Gift = {
  name: string;
  price: number;
  confidence: number;
  ranking_reasons: string[];
};

function confidenceLabel(c: number) {
  if (c >= 0.85) return { text: "Top Pick", color: "bg-emerald-500" };
  if (c >= 0.7) return { text: "Strong match", color: "bg-blue-500" };
  if (c >= 0.6) return { text: "Good option", color: "bg-slate-500" };
  return { text: "Worth considering", color: "bg-gray-400" };
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Find the <span className="text-emerald-600">perfect gift</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Thoughtful, personalized gift ideas — ranked just for them.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gift for girlfriend who loves coffee"
            className="w-full sm:w-[420px] rounded-lg border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={getRecommendations}
            disabled={loading || !query}
            className="rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Find Gifts"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}
      </section>

      {/* RESULTS */}
      {results.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <h2 className="text-2xl font-semibold mb-6 text-slate-800">
            Recommended for you
          </h2>

          <div className="grid gap-6">
            {results.map((gift, idx) => {
              const badge = confidenceLabel(gift.confidence);

              return (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  {/* BADGE */}
                  <span
                    className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`}
                  >
                    {badge.text}
                  </span>

                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {gift.name}
                    </h3>
                    <span className="text-lg font-medium text-slate-700">
                      ${gift.price}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-1 text-slate-600 text-sm">
                    {gift.ranking_reasons.map((reason, i) => (
                      <li key={i}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

