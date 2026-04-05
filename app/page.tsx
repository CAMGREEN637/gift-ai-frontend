"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GiftQuiz, { QuizAnswers } from "./components/GiftQuiz";
import AuthModal from "./components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

// =============================================================================
// TYPES
// =============================================================================

type Gift = {
  name: string;
  display_name?: string;
  price: number;
  confidence: number;
  description: string;
  image_url?: string;
  product_url?: string;
  ranking_reasons?: string[];
  reason?: string;
  shipping_min_days?: number;
  shipping_max_days?: number;
  is_prime_eligible?: boolean;
  already_purchased?: boolean;
};

type DeliveryStatus = {
  status: "instant" | "estimated" | "on-time" | "tight" | "late";
  message: string;
  color: "green" | "yellow" | "red" | "purple" | "stone";
  icon: string;
  showWarning?: boolean;
  warningText?: string;
};

type Partner = {
  id: string;
  name: string;
  relationship_stage?: string;
  relationship?: string; // legacy fallback
  interests?: string[];
  vibe?: string[];
  personality_traits?: string[];
  preferred_price_range?: string;
};

// =============================================================================
// HELPERS
// =============================================================================

const calculateDeliveryDate = (minDays: number, maxDays: number): string => {
  const minDate = new Date();
  const maxDate = new Date();
  minDate.setDate(minDate.getDate() + minDays);
  maxDate.setDate(maxDate.getDate() + maxDays);
  const minStr = minDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const maxStr = maxDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return minDays === maxDays ? minStr : `${minStr} – ${maxStr}`;
};

const getDeliveryStatus = (gift: Gift, daysUntilNeeded?: number): DeliveryStatus => {
  const minDays = gift.shipping_min_days ?? 5;
  const maxDays = gift.shipping_max_days ?? 8;

  if (maxDays === 0) {
    return { status: "instant", message: "Instant delivery", color: "purple", icon: "⚡", showWarning: false };
  }
  if (daysUntilNeeded === undefined || daysUntilNeeded === null) {
    return { status: "estimated", message: `Arrives ${calculateDeliveryDate(minDays, maxDays)}`, color: "stone", icon: "📦", showWarning: false };
  }
  if (maxDays <= daysUntilNeeded) {
    return { status: "on-time", message: `Arrives ${calculateDeliveryDate(minDays, maxDays)}`, color: "green", icon: "✓", showWarning: false };
  } else if (maxDays <= daysUntilNeeded + 3) {
    return { status: "tight", message: `Tight timeline (${maxDays} days)`, color: "yellow", icon: "⚠️", showWarning: true, warningText: `This gift takes ${maxDays} days to ship, close to your ${daysUntilNeeded}-day deadline.` };
  } else {
    const daysLate = maxDays - daysUntilNeeded;
    return { status: "late", message: `May arrive ${daysLate} days after`, color: "red", icon: "⚠️", showWarning: true, warningText: `This gift typically takes ${maxDays} days to arrive, which may be after your event.` };
  }
};

function normalizeUrl(url?: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

const enhanceReason = (reason: string): string => {
  let enhanced = reason
    .replace(/^(This gift|This item|This product|This)\s+/i, "")
    .replace(/matches your search/gi, "perfectly suited for what you are looking for")
    .trim();
  if (enhanced.length > 0) enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  if (enhanced.length > 0 && !enhanced.endsWith(".") && !enhanced.endsWith("!")) enhanced += ".";
  return enhanced;
};

const deliveryColorClasses: Record<string, string> = {
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  red:    "bg-red-50 text-red-700 border-red-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
  stone:  "bg-stone-100 text-stone-600 border-stone-200",
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function GiftApp() {
  const [showQuiz, setShowQuiz]                         = useState(true);
  const [results, setResults]                           = useState<Gift[]>([]);
  const [loading, setLoading]                           = useState(false);
  const [error, setError]                               = useState("");
  const [quizAnswers, setQuizAnswers]                   = useState<QuizAnswers | null>(null);
  const [selectedPartner, setSelectedPartner]           = useState<Partner | null>(null);
  const [showAuthModal, setShowAuthModal]               = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [resultsHeadline, setResultsHeadline]           = useState("");
  const [resultsSubline, setResultsSubline]             = useState("");

  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, session, signOut } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const partnerId = searchParams.get("partner_id");
    if (partnerId && user) loadPartner(partnerId);
  }, [searchParams, user]);

  const loadPartner = async (partnerId: string) => {
    if (!user || !session) return;
    try {
      const res = await fetch(`${apiUrl}/user-profile/recipients/${partnerId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;
      const partner: Partner = await res.json();
      setSelectedPartner(partner);
      setQuizAnswers({
        partner_id:         partner.id,
        partner_name:       partner.name,
        relationship_stage: (partner.relationship_stage ?? partner.relationship) as QuizAnswers["relationship_stage"],
        interests:          (partner.interests ?? []) as QuizAnswers["interests"],
        vibe:               (partner.vibe ?? []) as QuizAnswers["vibe"],
        max_price:          partner.preferred_price_range
                              ? parseInt(partner.preferred_price_range.replace(/\D/g, ""))
                              : undefined,
      });
    } catch (err) {
      console.error("Failed to load partner:", err);
    }
  };

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // ============================================================
  // STREAMING HANDLER
  // ============================================================

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setLoading(true);
    setError("");
    setResults([]);
    setShowQuiz(false);
    setQuizAnswers(answers);

    // Save or update partner profile if logged in
    if (user && session && answers.partner_name) {
      try {
        const recipientData = {
          name:                 answers.partner_name,
          relationship_stage:   answers.relationship_stage,
          interests:            answers.interests ?? [],
          vibe:                 answers.vibe ?? [],
          preferred_price_range: answers.max_price ? `Up to $${answers.max_price}` : undefined,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${session.access_token}`,
        };
        let savedRecipient;
        if (answers.partner_id) {
          const r = await fetch(`${apiUrl}/user-profile/recipients/${answers.partner_id}`, { method: "PUT", headers, body: JSON.stringify(recipientData) });
          if (r.ok) savedRecipient = await r.json();
        } else {
          const r = await fetch(`${apiUrl}/user-profile/recipients`, { method: "POST", headers, body: JSON.stringify(recipientData) });
          if (r.ok) savedRecipient = await r.json();
        }
        if (savedRecipient?.id) {
          answers.partner_id = savedRecipient.id;
          setQuizAnswers({ ...answers, partner_id: savedRecipient.id });
        }
      } catch (err) {
        console.error("Failed to save partner:", err);
        // Non-fatal — proceed to recommendations regardless
      }
    }

    try {
      const res = await fetch(`${apiUrl}/recommend?stream=true`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion:           answers.occasion,
          occasion_date:      answers.occasion_date,
          days_until_needed:  answers.days_until_needed,
          relationship_stage: answers.relationship_stage,
          partner_name:       answers.partner_name,
          partner_id:         answers.partner_id,
          vibe:               answers.vibe          ?? [],
          gift_types:         answers.gift_types    ?? [],
          max_price:          answers.max_price,
          confidence:         answers.confidence,
          archetypes:         answers.archetypes    ?? [],
          interests:          answers.interests     ?? [],
          overlap_interests:  answers.overlap_interests ?? [],
        }),
      });

      if (!res.body) throw new Error("Streaming not supported");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const jsonStr = part.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") return;

          try {
            const parsed = JSON.parse(jsonStr);

            // Preview: first 3 gifts arrive fast — show them immediately
            if (parsed.type === "preview") {
              setResults(parsed.gifts || []);
              setLoading(false); // unlock UI as soon as preview lands
            }

            // Result: full LLM-enriched gift list with reasons
            if (parsed.type === "result") {
              setResults(parsed.gifts || []);
              setResultsHeadline(parsed.results_headline ?? "");
              setResultsSubline(parsed.results_subline ?? "");
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations.");
      setLoading(false);
    }
  };

  // ============================================================
  // LOADING SCREEN
  // Only shown before the first preview arrives
  // ============================================================

  if (loading && results.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
          body { font-family: 'DM Sans', sans-serif; }
          .font-serif { font-family: 'DM Serif Display', serif !important; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-amber-500 mx-auto mb-6"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <h2 className="font-serif text-2xl text-stone-900 mb-6 tracking-tight">
            {quizAnswers?.occasion === "apology"
              ? "Finding the right gesture…"
              : quizAnswers?.partner_name
              ? `Finding the perfect gift for ${quizAnswers.partner_name}…`
              : "Finding the perfect gift…"}
          </h2>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              { icon: "🔍", text: "Scanning thousands of options" },
              { icon: "💡", text: "Matching with her interests" },
              { icon: "📦", text: "Checking delivery times" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-stone-500"
                style={{ animation: "fadeSlideIn 0.5s ease forwards", animationDelay: `${i * 0.7}s`, opacity: 0 }}
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-sm font-medium">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // QUIZ VIEW
  // ============================================================

  if (showQuiz) {
    return (
      <main className="min-h-screen bg-stone-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
          body { font-family: 'DM Sans', sans-serif; }
          .font-serif { font-family: 'DM Serif Display', serif !important; }
        `}</style>

        {/* Nav */}
        <nav className="border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="font-serif text-xl text-stone-900">Gift AI</span>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => router.push("/partners")}
                    className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all"
                  >
                    My Partners
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-1.5 text-sm font-medium text-stone-400 hover:text-stone-600 transition-all"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-1.5 text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
          <h1 className="font-serif text-5xl text-stone-900 mb-3 tracking-tight leading-tight">
            Find the perfect gift
          </h1>
          <p className="text-stone-500 text-lg max-w-md mx-auto">
            Answer a few questions and we'll match you with gifts she'll genuinely love.
          </p>
        </div>

        {/* Quiz card */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8 md:p-12">
            <GiftQuiz
              onComplete={handleQuizComplete}
              initialAnswers={quizAnswers ?? undefined}
            />
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </main>
    );
  }

  // ============================================================
  // RESULTS VIEW
  // ============================================================

  return (
    <main className="min-h-screen bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card-animate { animation: fadeUp 0.4s ease forwards; opacity: 0; }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-serif text-xl text-stone-900">Gift AI</span>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => router.push("/partners")}
                className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all"
              >
                My Partners
              </button>
            )}
            <button
              onClick={() => {
                setShowQuiz(true);
                setResults([]);
                setError("");
                setResultsHeadline("");
                setResultsSubline("");
                setExpandedDescriptions(new Set());
              }}
              className="px-4 py-1.5 text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all"
            >
              Start over
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-stone-900 tracking-tight">
            {resultsHeadline ||
              (quizAnswers?.partner_name
                ? `Gifts for ${quizAnswers.partner_name}`
                : "Your recommendations")}
          </h1>
          <p className="text-stone-400 mt-1 text-sm">
            {resultsSubline ||
              (results.length > 0 ? `${results.length} curated picks, ranked by match` : "")}
          </p>
          {/* Subtle "enriching..." indicator while LLM reasons are still loading */}
          {loading && results.length > 0 && (
            <p className="text-amber-500 text-xs font-medium mt-1 animate-pulse">
              Personalising your picks…
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl mb-8">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && !loading && (
          <div className="bg-white border border-stone-100 rounded-3xl p-16 text-center shadow-sm">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">No gifts found</h2>
            <p className="text-stone-500 mb-8 text-sm">Try adjusting your preferences or budget.</p>
            <button
              onClick={() => { setShowQuiz(true); setResults([]); }}
              className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-semibold text-sm hover:bg-stone-800 transition-all"
            >
              Try again
            </button>
          </div>
        )}

        {/* Gift cards */}
        <div className="space-y-5">
          {results.map((gift, idx) => {
            const buyUrl            = normalizeUrl(gift.product_url);
            const delivery          = getDeliveryStatus(gift, quizAnswers?.days_until_needed);
            const isExpanded        = expandedDescriptions.has(idx);
            const matchPercentage   = Math.round((gift.confidence || 0.85) * 100);
            const isTopPick         = idx === 0;
            const displayTitle      = gift.display_name || gift.name;
            const truncatedDescription =
              gift.description && gift.description.length > 150
                ? gift.description.substring(0, 150) + "…"
                : gift.description ?? "";

            return (
              <div
                key={idx}
                className={`card-animate bg-white rounded-3xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                  isTopPick ? "border-amber-200" : "border-stone-100"
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Top pick accent bar */}
                {isTopPick && (
                  <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-500" />
                )}

                <div className="grid md:grid-cols-[220px_1fr] gap-0">
                  {/* Image */}
                  <div className="bg-stone-50 flex items-center justify-center p-6 border-r border-stone-100 min-h-[180px]">
                    {gift.image_url ? (
                      <img
                        src={gift.image_url}
                        alt={displayTitle}
                        className="object-contain max-h-40 w-full"
                      />
                    ) : (
                      <span className="text-5xl opacity-40">🎁</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="font-serif text-xl text-stone-900 leading-snug tracking-tight">
                        {displayTitle}
                      </h2>
                      {isTopPick && (
                        <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                          Top pick
                        </span>
                      )}
                    </div>

                    {/* Price + badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <span className="text-2xl font-semibold text-stone-900">
                        ${gift.price.toFixed(2)}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {matchPercentage}% match
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                          deliveryColorClasses[delivery.color] || deliveryColorClasses.stone
                        }`}
                      >
                        {delivery.icon} {delivery.message}
                      </span>
                    </div>

                    {/* Description */}
                    {gift.description && (
                      <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                        {isExpanded ? gift.description : truncatedDescription}
                        {gift.description.length > 150 && (
                          <button
                            onClick={() => toggleDescription(idx)}
                            className="ml-1.5 text-amber-600 hover:text-amber-700 font-medium text-sm"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </p>
                    )}

                    {/* Why this works */}
                    {gift.reason && (
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
                        <p className="text-xs font-semibold text-amber-800 mb-0.5">
                          Why this works
                        </p>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          {enhanceReason(gift.reason)}
                        </p>
                      </div>
                    )}

                    {/* Shipping warning */}
                    {delivery.showWarning && delivery.warningText && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
                        <p className="text-sm text-red-600">{delivery.warningText}</p>
                      </div>
                    )}

                    {/* CTA */}
                    {buyUrl && (
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-stone-800 transition-all shadow-sm hover:shadow-md"
                      >
                        View on Amazon
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
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

// =============================================================================
// PAGE EXPORT
// =============================================================================

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-amber-500 mx-auto mb-4"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p className="text-sm text-stone-400 font-medium">Loading…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      }
    >
      <GiftApp />
    </Suspense>
  );
}