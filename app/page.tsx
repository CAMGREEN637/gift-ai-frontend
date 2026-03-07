// app/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GiftQuiz from "./components/GiftQuiz";
import AuthModal from "./components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

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
  shipping_min_days?: number;
  shipping_max_days?: number;
  is_prime_eligible?: boolean;
  already_purchased?: boolean;
};

type QuizAnswers = {
  occasion?: string;
  recipient?: {
    gender?: string;
    relationship?: string;
  };
  partner_name?: string;
  partner_id?: string;
  interests?: string[];
  categories?: string[];
  vibe?: string[];
  personality?: string[];
  experience_level?: string;
  days_until_needed?: number;
  max_price?: number;
  occasion_date?: string;
};

type DeliveryStatus = {
  status: 'instant' | 'estimated' | 'on-time' | 'tight' | 'late';
  message: string;
  color: 'purple' | 'slate' | 'green' | 'yellow' | 'red';
  icon: string;
  showWarning?: boolean;
  warningText?: string;
};

type Partner = {
  id: string;
  name: string;
  gender?: string;
  relationship?: string;
  interests?: string[];
  categories?: string[];
  vibe?: string[];
  personality_traits?: string[];
  experience_level?: string;
  preferred_price_range?: string;
};

// --- Helpers ---

const calculateDeliveryDate = (minDays: number, maxDays: number): string => {
  const minDate = new Date();
  const maxDate = new Date();
  minDate.setDate(minDate.getDate() + minDays);
  maxDate.setDate(maxDate.getDate() + maxDays);

  const minStr = minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const maxStr = maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return minDays === maxDays ? minStr : `${minStr} - ${maxStr}`;
};

const getDeliveryStatus = (gift: Gift, daysUntilNeeded?: number): DeliveryStatus => {
  const minDays = gift.shipping_min_days ?? 5;
  const maxDays = gift.shipping_max_days ?? 8;

  if (maxDays === 0) {
    return {
      status: 'instant', message: 'Instant delivery', color: 'purple', icon: '⚡', showWarning: false
    };
  }

  if (daysUntilNeeded === undefined || daysUntilNeeded === null) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: 'estimated', message: `Arrives ${estimatedDelivery}`, color: 'slate', icon: '📦', showWarning: false
    };
  }

  if (maxDays <= daysUntilNeeded) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: 'on-time', message: `Arrives ${estimatedDelivery}`, color: 'green', icon: '✓', showWarning: false
    };
  } else if (maxDays <= daysUntilNeeded + 3) {
    return {
      status: 'tight', message: `Tight timeline (${maxDays} days)`, color: 'yellow', icon: '⚠️', showWarning: true,
      warningText: `This gift takes ${maxDays} days to ship, which is close to your ${daysUntilNeeded}-day deadline.`
    };
  } else {
    const daysLate = maxDays - daysUntilNeeded;
    return {
      status: 'late', message: `May arrive ${daysLate} days after`, color: 'red', icon: '⚠️', showWarning: true,
      warningText: `This gift typically takes ${maxDays} days to arrive, which may be after your event.`
    };
  }
};

function normalizeUrl(url?: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

// --- Main Logic Component ---

function GiftApp() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, signOut } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const partnerId = searchParams.get('partner_id');
    if (partnerId && user) {
      loadPartner(partnerId);
    }
  }, [searchParams, user]);

  const loadPartner = async (partnerId: string) => {
    if (!user || !session) return;
    try {
      const res = await fetch(`${apiUrl}/user-profile/recipients/${partnerId}`, {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });

      if (!res.ok) {
        console.error("Failed to load recipient profile:", res.status);
        return;
      }

      const partner: Partner = await res.json();
      setSelectedPartner(partner);

      const prefilledAnswers: QuizAnswers = {
        partner_id: partner.id,
        partner_name: partner.name,
        recipient: {
          relationship: partner.relationship,
        },
        interests: partner.interests || [],
        categories: partner.categories || [],
        vibe: partner.vibe || [],
        personality: partner.personality_traits || [],
        experience_level: partner.experience_level,
        max_price: partner.preferred_price_range ? parseInt(partner.preferred_price_range.replace(/\D/g, '')) : undefined,
      };

      setQuizAnswers(prefilledAnswers);
    } catch (error) {
      console.error("Failed to load partner:", error);
    }
  };

  const filterRankingReasons = (reasons: string[]): string[] => {
    const technicalTerms = ['semantic', 'vector', 'similarity', 'score', 'algorithm', 'confidence'];
    return reasons.filter(reason => {
      const lowerReason = reason.toLowerCase();
      return !technicalTerms.some(term => lowerReason.includes(term)) && reason.length >= 10;
    });
  };

  const enhanceReason = (reason: string): string => {
    let enhanced = reason
      .replace(/^(This gift|This item|This product|This)\s+/i, '')
      .replace(/matches your search/gi, 'perfectly suited for what you are looking for')
      .trim();
    if (enhanced.length > 0) enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    if (enhanced.length > 0 && !enhanced.endsWith('.') && !enhanced.endsWith('!')) enhanced += '.';
    return enhanced;
  };

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setLoading(true);
    setError("");
    setResults([]);
    setShowQuiz(false);
    setQuizAnswers(answers);

    try {
      // 1. Save/Update Recipient Profile
      if (user && session && answers.partner_name) {
        const recipientData = {
          name: answers.partner_name,
          relationship: answers.recipient?.relationship,
          birthday: answers.occasion_date || null,
          interests: answers.interests || [],
          categories: answers.categories || [],
          vibe: answers.vibe || [],
          personality_traits: answers.personality || [],
          experience_level: answers.experience_level,
          preferred_price_range: answers.max_price ? `Up to $${answers.max_price}` : undefined,
        };

        const res = await fetch(`${apiUrl}/user-profile/recipients`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify(recipientData),
        });

        if (res.ok) {
          const savedRecipient = await res.json();
          answers.partner_id = savedRecipient.id;
          setQuizAnswers({ ...answers, partner_id: savedRecipient.id });
        }
      }

      // 2. Get Gift Recommendations
      const queryParts = [];
      if (answers.occasion) queryParts.push(`${answers.occasion} gift`);
      if (answers.recipient?.relationship) queryParts.push(`for ${answers.recipient.relationship}`);
      if (answers.interests?.length) queryParts.push(`who loves ${answers.interests.join(', ')}`);

      const query = queryParts.join(' ');
      let url = `${apiUrl}/recommend?query=${encodeURIComponent(query)}`;
      if (answers.max_price) url += `&max_price=${answers.max_price}`;
      if (answers.days_until_needed) url += `&days_until_needed=${answers.days_until_needed}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Recommendation request failed");

      const data = await res.json();
      setResults(Array.isArray(data.gifts) ? data.gifts : []);
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showQuiz && results.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-end mb-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button onClick={() => signOut()} className="text-sm text-gray-600 underline">Sign Out</button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium">
                Sign In to Save Profiles
              </button>
            )}
          </div>

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
            <GiftQuiz onComplete={handleQuizComplete} initialAnswers={quizAnswers || undefined} />
          )}
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            🎁 {quizAnswers?.partner_name ? `Gifts for ${quizAnswers.partner_name}` : 'Your Results'}
          </h1>
          <div className="flex gap-3">
            {user && <button onClick={() => router.push('/partners')} className="px-4 py-2 bg-white border rounded-lg">👥 Partners</button>}
            <button onClick={() => { setShowQuiz(true); setResults([]); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">← Start Over</button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-8">{error}</div>}

        <div className="space-y-6">
          {results.map((gift, idx) => {
            const buyUrl = normalizeUrl(gift.product_url);
            const delivery = getDeliveryStatus(gift, quizAnswers?.days_until_needed);
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-6 grid md:grid-cols-[240px_1fr] gap-6">
                <div className="h-56 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {gift.image_url ? <img src={gift.image_url} alt={gift.name} className="object-contain p-4" /> : <span className="text-6xl">🎁</span>}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">{gift.name}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-blue-600">${gift.price.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${delivery.color}-100 text-${delivery.color}-800`}>
                      {delivery.icon} {delivery.message}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{gift.description}</p>
                  {gift.reason && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                      <p className="text-sm font-semibold text-blue-900">💝 Why this works</p>
                      <p className="text-sm text-blue-800">{enhanceReason(gift.reason)}</p>
                    </div>
                  )}
                  {buyUrl && (
                    <a href={buyUrl} target="_blank" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold">
                      View on Amazon
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GiftApp />
    </Suspense>
  );
}