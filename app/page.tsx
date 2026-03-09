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
  status: "instant" | "estimated" | "on-time" | "tight" | "late";
  message: string;
  color: "purple" | "slate" | "green" | "yellow" | "red";
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

  const minStr = minDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const maxStr = maxDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return minDays === maxDays ? minStr : `${minStr} - ${maxStr}`;
};

const getDeliveryStatus = (
  gift: Gift,
  daysUntilNeeded?: number
): DeliveryStatus => {
  const minDays = gift.shipping_min_days ?? 5;
  const maxDays = gift.shipping_max_days ?? 8;

  if (maxDays === 0) {
    return {
      status: "instant",
      message: "Instant delivery",
      color: "purple",
      icon: "⚡",
      showWarning: false,
    };
  }

  if (daysUntilNeeded === undefined || daysUntilNeeded === null) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: "estimated",
      message: `Arrives ${estimatedDelivery}`,
      color: "slate",
      icon: "📦",
      showWarning: false,
    };
  }

  if (maxDays <= daysUntilNeeded) {
    const estimatedDelivery = calculateDeliveryDate(minDays, maxDays);
    return {
      status: "on-time",
      message: `Arrives ${estimatedDelivery}`,
      color: "green",
      icon: "✓",
      showWarning: false,
    };
  } else if (maxDays <= daysUntilNeeded + 3) {
    return {
      status: "tight",
      message: `Tight timeline (${maxDays} days)`,
      color: "yellow",
      icon: "⚠️",
      showWarning: true,
      warningText: `This gift takes ${maxDays} days to ship, which is close to your ${daysUntilNeeded}-day deadline.`,
    };
  } else {
    const daysLate = maxDays - daysUntilNeeded;
    return {
      status: "late",
      message: `May arrive ${daysLate} days after`,
      color: "red",
      icon: "⚠️",
      showWarning: true,
      warningText: `This gift typically takes ${maxDays} days to arrive, which may be after your event.`,
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
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(
    new Set()
  );
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, signOut } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const partnerId = searchParams.get("partner_id");
    if (partnerId && user) {
      loadPartner(partnerId);
    }
  }, [searchParams, user]);

  const loadPartner = async (partnerId: string) => {
    if (!user || !session) return;
    try {
      const res = await fetch(`${apiUrl}/user-profile/recipients/${partnerId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
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
        max_price: partner.preferred_price_range
          ? parseInt(partner.preferred_price_range.replace(/\D/g, ""))
          : undefined,
      };

      setQuizAnswers(prefilledAnswers);
    } catch (error) {
      console.error("Failed to load partner:", error);
    }
  };

  const enhanceReason = (reason: string): string => {
    let enhanced = reason
      .replace(/^(This gift|This item|This product|This)\s+/i, "")
      .replace(
        /matches your search/gi,
        "perfectly suited for what you are looking for"
      )
      .trim();
    if (enhanced.length > 0)
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    if (
      enhanced.length > 0 &&
      !enhanced.endsWith(".") &&
      !enhanced.endsWith("!")
    )
      enhanced += ".";
    return enhanced;
  };

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setLoading(true);
    setError("");
    setResults([]);
    setShowQuiz(false);
    setQuizAnswers(answers);

    try {
      // 1. Save/Update Recipient Profile (if logged in)
      if (user && session && answers.partner_name) {
        try {
          console.log("💾 Saving recipient profile:", answers.partner_name);

          const recipientData = {
            name: answers.partner_name,
            relationship: answers.recipient?.relationship,
            birthday: answers.occasion_date || null,
            interests: answers.interests || [],
            categories: answers.categories || [],
            vibe: answers.vibe || [],
            personality_traits: answers.personality || [],
            experience_level: answers.experience_level,
            preferred_price_range: answers.max_price
              ? `Up to $${answers.max_price}`
              : undefined,
          };

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          };

          let savedRecipient;

          // Update existing or create new
          if (answers.partner_id) {
            console.log("📝 Updating existing recipient:", answers.partner_id);
            const updateRes = await fetch(
              `${apiUrl}/user-profile/recipients/${answers.partner_id}`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify(recipientData),
              }
            );

            if (updateRes.ok) {
              savedRecipient = await updateRes.json();
              console.log("✅ Recipient updated successfully");
            } else {
              const errorText = await updateRes.text();
              console.error("❌ Failed to update recipient:", errorText);
              throw new Error(`Failed to update recipient: ${updateRes.status}`);
            }
          } else {
            console.log("➕ Creating new recipient");
            const createRes = await fetch(`${apiUrl}/user-profile/recipients`, {
              method: "POST",
              headers,
              body: JSON.stringify(recipientData),
            });

            if (createRes.ok) {
              savedRecipient = await createRes.json();
              console.log("✅ Recipient created:", savedRecipient);
            } else {
              const errorText = await createRes.text();
              console.error("❌ Failed to create recipient:", errorText);
              throw new Error(`Failed to create recipient: ${createRes.status}`);
            }
          }

          // Update answers with saved recipient ID
          if (savedRecipient?.id) {
            answers.partner_id = savedRecipient.id;
            setQuizAnswers({ ...answers, partner_id: savedRecipient.id });
            console.log("✅ Updated quiz answers with partner_id:", savedRecipient.id);
          }
        } catch (recipientError) {
          console.error("❌ Error saving recipient:", recipientError);
          // Don't fail the entire flow - continue to recommendations
          setError(
            "Couldn't save recipient profile, but we'll still find great gifts!"
          );
        }
      } else {
        console.log("⏭️ Skipping recipient save (not logged in or no name provided)");
      }

      // 2. Build recommendation query
      const queryParts = [];
      if (answers.occasion) queryParts.push(`${answers.occasion} gift`);
      if (answers.recipient?.relationship)
        queryParts.push(`for ${answers.recipient.relationship}`);
      if (answers.partner_name) queryParts.push(`named ${answers.partner_name}`);
      if (answers.interests?.length)
        queryParts.push(`who loves ${answers.interests.join(", ")}`);

      const query = queryParts.join(" ");

      // 3. Build URL with all parameters
      let url = `${apiUrl}/recommend?query=${encodeURIComponent(query)}`;

      // Add optional parameters
      if (answers.max_price) url += `&max_price=${answers.max_price}`;
      if (answers.days_until_needed)
        url += `&days_until_needed=${answers.days_until_needed}`;
      if (answers.partner_id) url += `&partner_id=${answers.partner_id}`;
      if (answers.partner_name && !answers.partner_id)
        url += `&partner_name=${encodeURIComponent(answers.partner_name)}`;
      if (answers.occasion) url += `&occasion=${encodeURIComponent(answers.occasion)}`;
      if (answers.recipient?.relationship)
        url += `&relationship=${encodeURIComponent(answers.recipient.relationship)}`;

      console.log("🎁 Fetching recommendations:", url);

      // 4. Fetch recommendations
      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Recommendation request failed:", errorText);
        throw new Error(`Recommendation request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Received recommendations:", data);

      // 5. Set results
      const gifts = Array.isArray(data.gifts) ? data.gifts : [];
      setResults(gifts);

      if (gifts.length === 0) {
        setError(
          "No gifts found matching your criteria. Try adjusting your preferences."
        );
      }
    } catch (err) {
      console.error("❌ Error in handleQuizComplete:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch recommendations. Please try again."
      );
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
                <button
                  onClick={() => router.push("/partners")}
                  className="px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  👥 My Partners
                </button>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 underline hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Sign In to Save Profiles
              </button>
            )}
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              🎁 Find the Perfect Gift
            </h1>
            <p className="text-xl text-slate-600">
              Answer a few questions and we'll find gifts they'll love
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-lg text-slate-600">Finding perfect gifts...</p>
            </div>
          ) : (
            <GiftQuiz
              onComplete={handleQuizComplete}
              initialAnswers={quizAnswers || undefined}
            />
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
            🎁{" "}
            {quizAnswers?.partner_name
              ? `Gifts for ${quizAnswers.partner_name}`
              : "Your Results"}
          </h1>
          <div className="flex gap-3">
            {user && (
              <button
                onClick={() => router.push("/partners")}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50 transition"
              >
                👥 My Partners
              </button>
            )}
            <button
              onClick={() => {
                setShowQuiz(true);
                setResults([]);
                setError("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ← Start Over
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl mb-8">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-lg text-slate-600">Loading recommendations...</p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="bg-slate-100 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No gifts found
            </h2>
            <p className="text-slate-600 mb-6">
              Try adjusting your preferences or budget
            </p>
            <button
              onClick={() => {
                setShowQuiz(true);
                setResults([]);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="space-y-6">
          {results.map((gift, idx) => {
            const buyUrl = normalizeUrl(gift.product_url);
            const delivery = getDeliveryStatus(
              gift,
              quizAnswers?.days_until_needed
            );
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-6 grid md:grid-cols-[240px_1fr] gap-6"
              >
                <div className="h-56 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {gift.image_url ? (
                    <img
                      src={gift.image_url}
                      alt={gift.name}
                      className="object-contain max-h-full p-4"
                    />
                  ) : (
                    <span className="text-6xl">🎁</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">{gift.name}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${gift.price.toFixed(2)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold bg-${delivery.color}-100 text-${delivery.color}-800`}
                    >
                      {delivery.icon} {delivery.message}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    {gift.description}
                  </p>
                  {gift.reason && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                      <p className="text-sm font-semibold text-blue-900">
                        💝 Why this works
                      </p>
                      <p className="text-sm text-blue-800">
                        {enhanceReason(gift.reason)}
                      </p>
                    </div>
                  )}
                  {buyUrl && (

                      href={buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                    >
                      View on Amazon →
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-lg text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <GiftApp />
    </Suspense>
  );
}