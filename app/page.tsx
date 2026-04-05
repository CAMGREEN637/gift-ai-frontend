"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GiftQuiz, { QuizAnswers } from "./components/GiftQuiz";
import AuthModal from "./components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

// --- Types ---
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

type Partner = {
  id: string;
  name: string;
  relationship_stage?: string;
  relationship?: string;
  interests?: string[];
  vibe?: string[];
  personality_traits?: string[];
  preferred_price_range?: string;
};

function GiftApp() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [resultsHeadline, setResultsHeadline] = useState("");
  const [resultsSubline, setResultsSubline] = useState("");

  const router = useRouter();
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
    } catch (err) {
      console.error("Failed to load partner:", err);
    }
  };

  // ✅ STREAMING FIXED HERE
  const handleQuizComplete = async (answers: QuizAnswers) => {
    setLoading(true);
    setError("");
    setResults([]);
    setShowQuiz(false);
    setQuizAnswers(answers);

    try {
      const res = await fetch(`${apiUrl}/recommend?stream=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: answers.occasion,
          occasion_date: answers.occasion_date,
          days_until_needed: answers.days_until_needed,
          relationship_stage: answers.relationship_stage,
          partner_name: answers.partner_name,
          partner_id: answers.partner_id,
          vibe: answers.vibe ?? [],
          gift_types: answers.gift_types ?? [],
          max_price: answers.max_price,
          confidence: answers.confidence,
          archetypes: answers.archetypes ?? [],
          interests: answers.interests ?? [],
          overlap_interests: answers.overlap_interests ?? [],
        }),
      });

      if (!res.body) throw new Error("Streaming not supported");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;

          const jsonStr = part.replace("data: ", "").trim();

          if (jsonStr === "[DONE]") {
            return;
          }

          try {
            const parsed = JSON.parse(jsonStr);

            // 🚀 Preview gifts (instant)
            if (parsed.type === "preview") {
              setResults(parsed.gifts || []);
              setLoading(false); // ✅ unlock UI immediately
            }

            // 🚀 Final results
            if (parsed.type === "result") {
              setResults(parsed.gifts || []);
              setResultsHeadline(parsed.results_headline ?? "");
              setResultsSubline(parsed.results_subline ?? "");
            }
          } catch (err) {
            console.error("Failed to parse SSE chunk:", err);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations.");
      setLoading(false);
    }
  };

  // --- Loading Screen (only shows BEFORE preview arrives now) ---
  if (loading && results.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading your recommendations…</p>
      </main>
    );
  }

  // --- Quiz ---
  if (showQuiz) {
    return (
      <main>
        <GiftQuiz onComplete={handleQuizComplete} />
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </main>
    );
  }

  // --- Results ---
  return (
    <main className="p-6 max-w-4xl mx-auto">
      {resultsHeadline && (
        <h1 className="text-2xl font-bold mb-2">{resultsHeadline}</h1>
      )}
      {resultsSubline && (
        <p className="text-gray-500 mb-6">{resultsSubline}</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-6">
        {results.map((gift, index) => (
          <div key={index} className="border p-4 rounded-xl">
            <h2 className="font-semibold">
              {gift.display_name || gift.name}
            </h2>
            <p>${gift.price}</p>
            {gift.image_url && (
              <img src={gift.image_url} className="w-32 mt-2" />
            )}
            {gift.reason && <p className="mt-2">{gift.reason}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GiftApp />
    </Suspense>
  );
}