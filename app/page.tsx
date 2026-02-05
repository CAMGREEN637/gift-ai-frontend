"use client";

import { useState } from "react";

type Gift = {
  name: string;
  price: number;
  confidence: number;
  description: string;
  image_url?: string;
  product_url?: string;
  ranking_reasons?: string[];
  reason?: string;
};

function normalizeUrl(url?: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
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

      const gifts: Gift[] = Array.isArray(data.gifts) ? data.gifts : [];

      gifts.sort((a, b) => b.confidence - a.confidence);

      setResults(gifts);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          🎁 AI Gift Finder
        </h1>
        <p className="text-slate-600 mb-8">
          Thoughtful gifts, ranked by relevance.
        </p>

        {/* Search */}
        <div className="flex gap-3 mb-10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gift for dad who loves grilling"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query) {
                getRecommendations();
              }
            }}
          />
          <button
            onClick={getRecommendations}
            disabled={loading || !query}
            className="rounded-lg bg-slate-900 px-6 py-3 text-white font-medium disabled:opacity-50 hover:bg-slate-800 transition"
          >
            {loading ? "Thinking…" : "Find Gifts"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Results */}
        <div className="space-y-6">
          {results.map((gift, idx) => {
            const isTopPick = idx === 0;
            const reasons = Array.isArray(gift.ranking_reasons)
              ? gift.ranking_reasons
              : [];

            const buyUrl = normalizeUrl(gift.product_url);
            const imageUrl = gift.image_url;

            return (
              <div
                key={`${gift.name}-${idx}`}
                className="rounded-xl bg-white shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid md:grid-cols-[220px_1fr] gap-6 p-6">
                  {/* Image - Link to product on click */}
                  {buyUrl ? (
                    <a
                      href={buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="w-full h-52 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg overflow-hidden flex-shrink-0 hover:opacity-90 transition group relative">
                        {imageUrl ? (
                          <>
                            {/* Referrer policy to help with CORS */}
                            <img
                              src={imageUrl}
                              alt={gift.name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                // If image fails, show gift emoji instead
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full flex flex-col items-center justify-center text-slate-300';
                                  fallback.innerHTML = '<div class="text-6xl mb-2">🎁</div><div class="text-xs">Click to view</div>';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-slate-700 font-medium">
                                View on Amazon →
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                            <div className="text-6xl mb-2">🎁</div>
                            <div className="text-xs">Click to view</div>
                          </div>
                        )}
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={gift.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain p-4"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              e.currentTarget.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex flex-col items-center justify-center text-slate-300';
                              fallback.innerHTML = '<div class="text-6xl">🎁</div>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <div className="text-6xl">🎁</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col">
                    <div className="flex items-start gap-3 flex-wrap mb-2">
                      <h2 className="text-xl font-semibold text-slate-900 flex-1">
                        {gift.name}
                      </h2>
                      {isTopPick && (
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold whitespace-nowrap">
                          🏆 Top Pick
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-slate-600 text-sm leading-relaxed">
                      {gift.description}
                    </p>

                    {/* LLM Reason */}
                    {gift.reason && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">💡 Why this works: </span>
                          {gift.reason}
                        </p>
                      </div>
                    )}

                    {/* Confidence */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-500 font-medium">Match Confidence</span>
                        <span className="font-semibold text-slate-700">
                          {(gift.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${gift.confidence * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Top pick explanation */}
                    {isTopPick && reasons.length > 0 && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-sm font-semibold text-emerald-900 mb-2">
                          ⭐ Why this is the best choice:
                        </p>
                        <ul className="space-y-1.5">
                          {reasons.map((reason, i) => (
                            <li key={i} className="text-sm text-emerald-800 flex items-start">
                              <span className="mr-2 mt-0.5">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-5 flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-slate-900">
                          ${gift.price}
                        </span>
                      </div>

                      {buyUrl && (
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md"
                        >
                          <span>Buy Gift</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-slate-600">No gifts found. Try a different search!</p>
          </div>
        )}
      </div>
    </main>
  );
}