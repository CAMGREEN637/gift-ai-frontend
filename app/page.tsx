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
      status: 'instant',
      message: 'Instant delivery',
      color: 'purple',
      icon: '⚡',
      showWarning: false
    };
  }

  if (daysUntilNeeded === undefined || daysUntilNeeded === null) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: 'estimated',
      message: `Arrives ${estimatedDelivery}`,
      color: 'slate',
      icon: '📦',
      showWarning: false
    };
  }

  if (maxDays <= daysUntilNeeded) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: 'on-time',
      message: `Arrives ${estimatedDelivery}`,
      color: 'green',
      icon: '✓',
      showWarning: false
    };
  } else if (maxDays <= daysUntilNeeded + 3) {
    return {
      status: 'tight',
      message: `Tight timeline (${maxDays} days)`,
      color: 'yellow',
      icon: '⚠️',
      showWarning: true,
      warningText: `This gift takes ${maxDays} days to ship, which is close to your ${daysUntilNeeded}-day deadline. Consider expedited shipping if available.`
    };
  } else {
    const daysLate = maxDays - daysUntilNeeded;
    return {
      status: 'late',
      message: `May arrive ${daysLate} days after`,
      color: 'red',
      icon: '⚠️',
      showWarning: true,
      warningText: `This gift typically takes ${maxDays} days to arrive, which may be after your event. Consider digital alternatives or express shipping.`
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

  useEffect(() => {
    const partnerId = searchParams.get('partner_id');
    if (partnerId && user) {
      loadPartner(partnerId);
    }
  }, [searchParams, user]);

  const loadPartner = async (partnerId: string) => {
    if (!user || !session) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/partners/${partnerId}`, {
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });

      if (!res.ok) {
        console.error("Failed to load partner:", res.status);
        return;
      }

      const partner: Partner = await res.json();
      setSelectedPartner(partner);

      const prefilledAnswers: QuizAnswers = {
        partner_id: partner.id,
        partner_name: partner.name,
        recipient: {
          gender: partner.gender,
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
    const technicalTerms = ['semantic', 'vector', 'similarity', 'score', 'algorithm', 'confidence', 'best match'];
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
      .trim();
    if (enhanced.length > 0) enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    if (enhanced.length > 0 && !enhanced.endsWith('.') && !enhanced.endsWith('!')) enhanced += '.';
    return enhanced;
  };

  const truncateDescription = (text: string, maxLength: number = 120): string => {
    if (!text || text.length <= maxLength) return text;
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
    if (answers.interests && answers.interests.length > 0) parts.push(`who loves ${answers.interests.join(', ')}`);
    return parts.join(' ');
  };

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setLoading(true);
    setError("");
    setResults([]);
    setShowQuiz(false);
    setQuizAnswers(answers);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (user && session && answers.partner_name) {
        const partnerData = {
          name: answers.partner_name,
          relationship: answers.recipient?.relationship,
          gender: answers.recipient?.gender,
          interests: answers.interests || [],
          categories: answers.categories || [],
          vibe: answers.vibe || [],
          personality_traits: answers.personality || [],
          experience_level: answers.experience_level,
          preferred_price_range: answers.max_price ? `Up to $${answers.max_price}` : undefined,
        };

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        };

        if (answers.partner_id) {
          // ✅ FIX 2A: Removed trailing slash
          await fetch(`${apiUrl}/partners/${answers.partner_id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(partnerData),
          });
        } else {
          // ✅ FIX 2B: Removed trailing slash
          const partnerRes = await fetch(`${apiUrl}/partners`, {
            method: "POST",
            headers,
            body: JSON.stringify(partnerData),
          });

          if (partnerRes.ok) {
            const newPartner = await partnerRes.json();
            setQuizAnswers({ ...answers, partner_id: newPartner.id });
            answers.partner_id = newPartner.id;
          }
        }
      }

      const query = buildQuery(answers);
      let url = `${apiUrl}/recommend?query=${encodeURIComponent(query)}`;
      if (answers.max_price && answers.max_price < 999999) url += `&max_price=${answers.max_price}`;
      if (answers.days_until_needed !== undefined && answers.days_until_needed > 0) url += `&days_until_needed=${answers.days_until_needed}`;
      if (user && answers.partner_id) url += `&partner_id=${answers.partner_id}&user_id=${user.id}`;
      if (answers.partner_name) url += `&partner_name=${encodeURIComponent(answers.partner_name)}`;
      if (answers.occasion) url += `&occasion=${encodeURIComponent(answers.occasion)}`;
      if (answers.recipient?.relationship) url += `&relationship=${encodeURIComponent(answers.recipient.relationship)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed with status: ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data.gifts) ? data.gifts : []);
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your JSX rendering remains the same ...
  // (Rendering logic for quiz results, cards, etc.)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
       {/* ... existing UI code ... */}
       <div className="mx-auto max-w-5xl">
          {/* Header and Start Over buttons */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              🎁 {quizAnswers?.partner_name ? `Gifts for ${quizAnswers.partner_name}` : 'Your Perfect Gifts'}
            </h1>
            <div className="flex gap-3">
              <button onClick={() => { setShowQuiz(true); setResults([]); }} className="px-4 py-2 rounded-lg border-2 border-slate-300">← Start Over</button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            {results.map((gift, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                 <h2 className="text-xl font-bold">{gift.name}</h2>
                 <p className="text-blue-600 font-bold">${gift.price.toFixed(2)}</p>
                 <p className="text-slate-600 text-sm mt-2">{truncateDescription(gift.description)}</p>
                 {gift.product_url && (
                    <a href={normalizeUrl(gift.product_url)!} target="_blank" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">View Product</a>
                 )}
              </div>
            ))}
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