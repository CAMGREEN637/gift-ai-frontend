"use client";

import { useState } from "react";
import GiftQuiz from "./components/GiftQuiz";

// --- Types ---

type Gift = {
  name: string;
  price: number;
  confidence: number;
  description: string;
  image_url?: string;
  product_url?: string;
  ranking_reasons?: string[];
  reason?: string;
  // Updated shipping fields
  shipping_min_days?: number;
  shipping_max_days?: number;
  is_prime_eligible?: boolean;
};

type QuizAnswers = {
  occasion?: string;
  recipient?: {
    gender?: string;
    relationship?: string;
  };
  interests?: string[];
  categories?: string[];
  vibe?: string[];
  personality?: string[];
  experience_level?: string;
  days_until_needed?: number;
};

type DeliveryStatus = {
  status: 'instant' | 'estimated' | 'on-time' | 'late';
  message: string;
  color: 'purple' | 'slate' | 'green' | 'red';
  icon: string;
};

// --- Shipping Helpers ---

const calculateDeliveryDate = (minDays: number, maxDays: number): string => {
  const minDate = new Date();
  const maxDate = new Date();

  minDate.setDate(minDate.getDate() + minDays);
  maxDate.setDate(maxDate.getDate() + maxDays);

  const minStr = minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const maxStr = maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (minDays === maxDays) {
    return minStr;
  }

  return `${minStr} - ${maxStr}`;
};

const getDeliveryStatus = (gift: Gift, daysUntilNeeded?: number): DeliveryStatus => {
  const minDays = gift.shipping_min_days ?? 5; // Default to 5 if undefined
  const maxDays = gift.shipping_max_days ?? 8; // Default to 8 if undefined

  // 1. Instant delivery (e.g. digital gifts)
  if (maxDays === 0) {
    return {
      status: 'instant',
      message: 'Instant delivery',
      color: 'purple',
      icon: '⚡'
    };
  }

  // 2. No deadline set by user -> Show estimate
  if (daysUntilNeeded === undefined || daysUntilNeeded === null) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: 'estimated',
      message: `Arrives ${estimatedDelivery}`,
      color: 'slate',
      icon: '📦'
    };
  }

  // 3. Check if it will arrive on time (use max_days for safety)
  if (maxDays <= daysUntilNeeded) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: 'on-time',
      message: `Arrives ${estimatedDelivery}`,
      color: 'green',
      icon: '✓'
    };
  } else {
    // 4. It might be late
    return {
      status: 'late',
      message: `May arrive late (${maxDays} days)`,
      color: 'red',
      icon: '⚠️'
    };
  }
};

function normalizeUrl(url?: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  const filterRankingReasons = (reasons: string[]): string[] => {
    const technicalTerms = [
      'semantic', 'vector', 'similarity', 'score', 'algorithm',
      'confidence', 'best match', 'matches your search description',
      'relevant to your search', 'strong semantic', 'technical', 'contains',
    ];

    return reasons.filter(reason => {
      const lowerReason = reason.toLowerCase();
      const isTechnical = technicalTerms.some(term => lowerReason.includes(term));
      const isTooShort = reason.length < 10;
      return !isTechnical && !isTooShort;
    });
  };

  const enhanceReason = (reason: string): string => {
    let enhanced = reason
      .replace(/^(This gift|This item|This product|This)\s+/i, '')
      .replace(/based on relevance/gi, '')
      .replace(/matches your search/gi, 'perfectly suited for what you are looking for')
      .replace(/is a great choice/gi, 'will bring joy')
      .trim();

    if (enhanced.length > 0) {
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    }

    if (enhanced.length > 0 && !enhanced.endsWith('.') && !enhanced.endsWith('!')) {
      enhanced += '.';
    }

    return enhanced;
  };

  const truncateDescription = (text: string, maxLength: number = 120): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 80 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  };

  const toggleDescription = (index: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const buildQuery = (answers: QuizAnswers): string => {
    const parts: string[] = [];
    if (answers.occasion) parts.push(`${answers.occasion} gift`);
    if (answers.recipient?.relationship) parts.push(`for ${answers.recipient.relationship}`);
    if (answers.interests && answers.interests.length > 0) {
      parts.push(`who loves ${answers.interests.join(', ')}`);
    }
    return parts.join(' ');
  };

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setLoading(true);
    setError("");
    setResults([]);
    setShowQuiz(false);
    setQuizAnswers(answers);
    setExpandedDescriptions(new Set());

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const query = buildQuery(answers);

      const preferences = {
        interests: answers.interests || [],
        vibe: answers.vibe || [],
        personality: answers.personality || [],
        categories: answers.categories || [],
        occasions: answers.occasion ? [answers.occasion] : [],
        recipient: answers.recipient || {},
        experience_level: answers.experience_level,
      };

      const res = await fetch(`${apiUrl}/recommend?query=${encodeURIComponent(query)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) {
        const getRes = await fetch(`${apiUrl}/recommend?query=${encodeURIComponent(query)}`);
        if (!getRes.ok) throw new Error("Request failed");
        const data = await getRes.json();
        setResults(Array.isArray(data.gifts) ? data.gifts : []);
      } else {
        const data = await res.json();
        setResults(Array.isArray(data.gifts) ? data.gifts : []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showQuiz && results.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">🎁 Find the Perfect Gift</h1>
            <p className="text-xl text-slate-600">Answer a few questions and we'll find gifts they'll love</p>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-lg text-slate-600">Finding perfect gifts...</p>
            </div>
          ) : (
            <GiftQuiz onComplete={handleQuizComplete} />
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">🎁 Your Perfect Gifts</h1>
          <button
            onClick={() => {
              setShowQuiz(true);
              setResults([]);
              setQuizAnswers(null);
            }}
            className="px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            ← Start Over
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        <div className="space-y-6">
          {results.map((gift, idx) => {
            const isTopPick = idx === 0;
            const filteredReasons = filterRankingReasons(gift.ranking_reasons || []);
            const isExpanded = expandedDescriptions.has(idx);
            const needsTruncation = gift.description && gift.description.length > 120;
            const buyUrl = normalizeUrl(gift.product_url);
            const imageUrl = gift.image_url;

            // Calculate Delivery Status
            const deliveryStatus = getDeliveryStatus(gift, quizAnswers?.days_until_needed);

            return (
              <div
                key={`${gift.name}-${idx}`}
                className="rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-[240px_1fr] gap-6 p-6">
                  {buyUrl ? (
                    <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden flex-shrink-0 hover:opacity-90 transition group relative">
                        {imageUrl ? (
                          <>
                            <img src={imageUrl} alt={gift.name} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-contain p-4" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-slate-700 font-medium">View Product →</span>
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
                    <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={gift.name} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-contain p-4" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <div className="text-6xl">🎁</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{gift.name}</h2>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-2xl font-bold text-blue-600">${gift.price.toFixed(2)}</span>

                          {isTopPick && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold whitespace-nowrap">🏆 Top Pick</span>
                          )}

                          {/* Updated Delivery Badge */}
                          {deliveryStatus && (
                            <span className={`
                              rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex items-center gap-1
                              ${deliveryStatus.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                              ${deliveryStatus.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                              ${deliveryStatus.color === 'slate' ? 'bg-slate-100 text-slate-700' : ''}
                              ${deliveryStatus.color === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
                            `}>
                              <span>{deliveryStatus.icon}</span>
                              <span>{deliveryStatus.message}</span>
                              {gift.is_prime_eligible && deliveryStatus.status !== 'instant' && (
                                <span className="ml-1 text-orange-600 font-bold" title="Prime Eligible">⚡</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {gift.description && (
                      <div className="mb-4">
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {isExpanded || !needsTruncation ? gift.description : truncateDescription(gift.description)}
                        </p>
                        {needsTruncation && (
                          <button onClick={() => toggleDescription(idx)} className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 hover:underline">
                            {isExpanded ? '← Show less' : 'Read more →'}
                          </button>
                        )}
                      </div>
                    )}

                    {gift.reason && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm font-semibold text-blue-900 mb-1.5">💝 Why this gift works</p>
                        <p className="text-sm text-blue-800 leading-relaxed">{enhanceReason(gift.reason)}</p>
                      </div>
                    )}

                    {filteredReasons.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {filteredReasons.map((reason, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">✓ {reason}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-500 font-medium">Match Confidence</span>
                        <span className="font-semibold text-slate-700">{(gift.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${gift.confidence * 100}%` }} />
                      </div>
                    </div>

                    {buyUrl && (
                      <div className="mt-5">
                        <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full md:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg">
                          <span>View on Amazon</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}