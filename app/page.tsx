"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
  interests?: string[];
  vibe?: string[];
  preferred_price_range?: string;
};

type AppView = "landing" | "quiz" | "results";

// Key used to persist pending saves across the auth redirect
const PENDING_SAVES_KEY = "giftai_pending_saves";

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
  if (maxDays === 0) return { status: "instant", message: "Instant delivery", color: "purple", icon: "⚡", showWarning: false };
  if (daysUntilNeeded === undefined || daysUntilNeeded === null)
    return { status: "estimated", message: `Arrives ${calculateDeliveryDate(minDays, maxDays)}`, color: "stone", icon: "📦", showWarning: false };
  if (maxDays <= daysUntilNeeded)
    return { status: "on-time", message: `Arrives ${calculateDeliveryDate(minDays, maxDays)}`, color: "green", icon: "✓", showWarning: false };
  if (maxDays <= daysUntilNeeded + 3)
    return { status: "tight", message: `Tight timeline (${maxDays} days)`, color: "yellow", icon: "⚠️", showWarning: true, warningText: `This gift takes ${maxDays} days to ship, close to your ${daysUntilNeeded}-day deadline.` };
  const daysLate = maxDays - daysUntilNeeded;
  return { status: "late", message: `May arrive ${daysLate} days after`, color: "red", icon: "⚠️", showWarning: true, warningText: `This gift typically takes ${maxDays} days to arrive, which may be after your event.` };
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
// SHARED NAV COMPONENT
// =============================================================================

function Nav({
  view,
  onStartOver,
  onLogoClick,
  showStartOver,
}: {
  view: AppView;
  onStartOver?: () => void;
  onLogoClick: () => void;
  showStartOver?: boolean;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="border-b border-stone-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={onLogoClick} className="font-serif text-xl text-stone-900 hover:text-amber-700 transition-colors">
            Gift AI
          </button>
          <div className="flex items-center gap-2">
            {view === "landing" && (
              <a href="#how-it-works" className="px-4 py-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-all hidden sm:block">
                How it works
              </a>
            )}
            {user ? (
              <>
                <button onClick={() => router.push("/partners")} className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all">
                  Saved Recipients
                </button>
                <button onClick={() => signOut()} className="px-4 py-1.5 text-sm font-medium text-stone-400 hover:text-stone-600 transition-all">
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="px-4 py-1.5 text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all">
                Sign in
              </button>
            )}
            {showStartOver && (
              <button onClick={onStartOver} className="px-4 py-1.5 text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all">
                Start over
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-10 border-b border-stone-700">
          {/* Brand */}
          <div>
            <p className="font-serif text-white text-lg mb-3">Gift AI</p>
            <p className="text-sm leading-relaxed text-stone-500">
              The gift advisor built for men who want to get it right. Context-aware recommendations that explain why each gift works.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#why-different" className="hover:text-white transition-colors">Why we're different</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
            <p className="text-xs text-stone-600 mt-4 leading-relaxed">
              We earn a small commission when you purchase through our links at no extra cost to you.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <p>© {new Date().getFullYear()} Gift AI. All rights reserved.</p>
          <p>Free to use · No sign-up required · Real products, real links</p>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// LANDING PAGE
// =============================================================================

function LandingPage({ onStart }: { onStart: () => void }) {
  const archetypes = [
    "your outdoorsy girlfriend",
    "your homebody wife",
    "your wellness-obsessed partner",
    "someone you just started dating",
    "your wife of 10 years",
    "your girlfriend who has everything",
  ];
  const [archetypeIndex, setArchetypeIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setArchetypeIndex((i) => (i + 1) % archetypes.length);
        setFading(false);
      }, 350);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'DM Serif Display', serif !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up-1 { animation: fadeUp 0.6s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.6s 0.45s ease both; }
        .archetype-text { transition: opacity 0.35s ease; }
        .archetype-fade { opacity: 0; }
      `}</style>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="fade-up-1 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          Free · No sign-up required
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl text-stone-900 mb-5 tracking-tight leading-tight fade-up-2">
          The right gift for<br />
          <span
            className={`archetype-text text-amber-600 italic ${fading ? "archetype-fade" : ""}`}
          >
            {archetypes[archetypeIndex]}
          </span>
        </h1>

        <p className="text-stone-500 text-lg max-w-lg mx-auto mb-10 leading-relaxed fade-up-3">
          Answer a few questions. Get curated picks — each one with a clear explanation of why it works for her, this occasion, and where you two are.
        </p>

        <div className="fade-up-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-sm hover:shadow-md text-base"
          >
            Find the perfect gift →
          </button>
          <a
            href="#how-it-works"
            className="px-6 py-4 text-stone-500 font-medium text-sm hover:text-stone-800 transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="fade-up-4 mt-10 flex items-center justify-center gap-6 text-xs text-stone-400">
          <span>✓ 100% free</span>
          <span className="text-stone-200">|</span>
          <span>✓ Real products with buy links</span>
          <span className="text-stone-200">|</span>
          <span>✓ No generic lists</span>
        </div>
      </section>

      {/* ── BEFORE / AFTER — CORE DIFFERENTIATOR ── */}
      <section id="why-different" className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">What makes us different</p>
            <h2 className="font-serif text-4xl text-stone-900 tracking-tight">
              Other tools show options.<br />We explain the right move.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Every other gift app</p>
              <div className="bg-white border border-stone-100 rounded-xl p-4 mb-3">
                <p className="text-sm font-semibold text-stone-700 mb-1">Faux Fur Throw Blanket</p>
                <p className="text-xs text-stone-400">Soft, warm, great for relaxing at home.</p>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-700 mb-1">Skincare Gift Set</p>
                <p className="text-xs text-stone-400">A luxurious set she'll love.</p>
              </div>
              <p className="text-xs text-stone-400 mt-4 italic">You still don't know which one to get.</p>
            </div>

            {/* After */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4">Gift AI</p>
              <div className="bg-white border border-amber-100 rounded-xl p-4 mb-3">
                <p className="text-sm font-semibold text-stone-800 mb-2">Faux Fur Throw Blanket</p>
                <div className="bg-amber-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold text-amber-700 mb-0.5">Why this works</p>
                  <p className="text-xs text-amber-600 leading-relaxed">This feels like you're giving her permission to slow down — exactly what a cozy surprise gift should say. It's personal without being intense, which is exactly right for where you two are.</p>
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-4 italic font-medium">You know it's the right call before you buy it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 FEATURE COLUMNS ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Built different</p>
          <h2 className="font-serif text-4xl text-stone-900 tracking-tight">
            Not a filter. A decision engine.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "Context-aware",
              body: "A Valentine's gift shouldn't feel like a birthday gift. We adapt to the occasion, your relationship stage, and the timing — all at once.",
            },
            {
              icon: "❤️",
              title: "Emotionally intelligent",
              body: "We don't just tell you what to buy — we tell you what it communicates. Every pick comes with a reason that helps you give it with confidence.",
            },
            {
              icon: "🧭",
              title: "Built for guys who are stuck",
              body: "Don't know her interests? Not sure what's appropriate? We guide you through it. The less you know, the more we help.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Simple process</p>
            <h2 className="font-serif text-4xl text-stone-900 tracking-tight">From stuck to confident in 2 minutes</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Tell us about her", body: "Pick her archetype, her interests, and how well you know her. Takes about 60 seconds." },
              { step: "02", title: "Tell us the moment", body: "The occasion, the relationship stage, your budget. We use this to calibrate the tone — not just the product." },
              { step: "03", title: "Get smart picks", body: "Curated gifts ranked for her specifically, each with a clear explanation of why it's the right move for her, right now." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col">
                <span className="font-serif text-5xl text-amber-200 mb-4 leading-none">{s.step}</span>
                <h3 className="font-semibold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-sm text-base"
            >
              Find the perfect gift →
            </button>
          </div>
        </div>
      </section>

      {/* ── OCCASION CHIPS ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-6">Works for every moment</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            ["🎂", "Birthday"],
            ["❤️", "Valentine's Day"],
            ["💝", "Anniversary"],
            ["🎄", "Christmas"],
            ["🌸", "Mother's Day"],
            ["✨", "Just Because"],
            ["🙏", "I Messed Up"],
          ].map(([emoji, label]) => (
            <button
              key={label}
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-white border-t border-stone-100 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-stone-900 tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does Gift AI find the right gift?",
                a: "We use a combination of your answers about her interests, personality, and the relationship context — the occasion, your stage, timing, and budget — to match and rank real products. Then an AI layer explains why each one fits her specifically.",
              },
              {
                q: "What if I don't know her interests well?",
                a: "That's exactly what we're built for. The confidence check in our quiz adapts the recommendations — when you say you're lost, we lean on occasion and vibe instead of interests, and surface crowd-pleasers that work broadly.",
              },
              {
                q: "How is this different from just Googling gift ideas?",
                a: "Google gives you generic lists. We give you specific picks for your girlfriend, for this occasion, with an explanation of why each one is the right call for where you two are right now.",
              },
              {
                q: "Is it really free?",
                a: "Yes, completely free. We earn a small affiliate commission when you click through and buy something — same price you'd pay anywhere else, no catch.",
              },
              {
                q: "How do I buy the recommended gifts?",
                a: "Every recommendation includes a direct link to the product. Click View on Amazon and you'll be taken straight to the listing to complete your purchase.",
              },
              {
                q: "Can I save my partner's profile for next time?",
                a: "Yes — create a free account and we'll remember her interests, vibe, and relationship stage so future recommendations start with context already filled in.",
              },
            ].map(({ q, a }) => (
              <FaqItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-4xl text-stone-900 mb-4 tracking-tight">
          Stop guessing.<br />Know it's the right gift.
        </h2>
        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
          Free, fast, and built for the guy who wants to get it right — not just get something.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-sm text-base"
        >
          Find the perfect gift →
        </button>
      </section>

      <Footer />
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-stone-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-all"
      >
        <span className="font-medium text-stone-900 text-sm pr-4">{question}</span>
        <span className="text-stone-400 text-lg shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-stone-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function GiftApp() {
  const [view, setView]                                 = useState<AppView>("landing");
  const [results, setResults]                           = useState<Gift[]>([]);
  const [error, setError]                               = useState("");
  const [quizAnswers, setQuizAnswers]                   = useState<QuizAnswers | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [resultsHeadline, setResultsHeadline]           = useState("");
  const [resultsSubline, setResultsSubline]             = useState("");
  const [enriching, setEnriching]                       = useState(false);
  const [savedGiftIds, setSavedGiftIds]                 = useState<Set<number>>(new Set());
  const [savingGiftIds, setSavingGiftIds]               = useState<Set<number>>(new Set());
  const [showAuthModal, setShowAuthModal]               = useState(false);
  const [saveAllDone, setSaveAllDone]                   = useState(false);
  const [loadingMore, setLoadingMore]                   = useState(false);
  const [noMoreGifts, setNoMoreGifts]                   = useState(false);

  const searchParams = useSearchParams();
  const { user, session } = useAuth();
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
      setQuizAnswers({
        partner_id:         partner.id,
        partner_name:       partner.name,
        relationship_stage: partner.relationship_stage as QuizAnswers["relationship_stage"],
        interests:          (partner.interests ?? []) as QuizAnswers["interests"],
        vibe:               (partner.vibe ?? []) as QuizAnswers["vibe"],
        max_price:          partner.preferred_price_range
                              ? parseInt(partner.preferred_price_range.replace(/\D/g, ""))
                              : undefined,
      });
      setView("quiz");
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

  const resetToLanding = () => {
    setView("landing");
    setResults([]);
    setError("");
    setResultsHeadline("");
    setResultsSubline("");
    setExpandedDescriptions(new Set());
    setEnriching(false);
    setSavedGiftIds(new Set());
    setSavingGiftIds(new Set());
    setSaveAllDone(false);
    setLoadingMore(false);
    setNoMoreGifts(false);
  };

  // ============================================================
  // SAVE GIFTS
  // If not signed in, stores pending saves in sessionStorage and
  // opens the auth modal. After sign-in the useEffect below fires
  // the pending saves automatically.
  // ============================================================

  const executeSave = async (indices: number[], currentResults: Gift[]) => {
    if (!session) return;
    const giftsToSave = indices
      .filter((i) => !savedGiftIds.has(i))
      .map((i) => currentResults[i])
      .filter(Boolean);
    if (giftsToSave.length === 0) return;

    const pendingIndices = indices.filter((i) => !savedGiftIds.has(i));
    setSavingGiftIds((prev) => { const s = new Set(prev); pendingIndices.forEach((i) => s.add(i)); return s; });

    try {
      const res = await fetch(`${apiUrl}/user-profile/saved-gifts`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          recipient_name: quizAnswers?.partner_name || "My Partner",
          recipient_id:   quizAnswers?.partner_id,
          occasion:       quizAnswers?.occasion,
          gifts:          giftsToSave,
        }),
      });
      if (res.ok) {
        setSavedGiftIds((prev) => { const s = new Set(prev); pendingIndices.forEach((i) => s.add(i)); return s; });
        if (pendingIndices.length === results.length) setSaveAllDone(true);
      }
    } catch (err) {
      console.error("Failed to save gifts:", err);
    } finally {
      setSavingGiftIds((prev) => { const s = new Set(prev); pendingIndices.forEach((i) => s.delete(i)); return s; });
    }
  };

  const handleSaveGift = (idx: number) => {
    if (savedGiftIds.has(idx)) return; // already saved — bookmark is purely additive
    if (!user) {
      // Queue the save and prompt auth
      sessionStorage.setItem(PENDING_SAVES_KEY, JSON.stringify({ indices: [idx], results }));
      setShowAuthModal(true);
      return;
    }
    executeSave([idx], results);
  };

  const handleSaveAll = () => {
    if (!user) {
      const allIndices = results.map((_, i) => i);
      sessionStorage.setItem(PENDING_SAVES_KEY, JSON.stringify({ indices: allIndices, results }));
      setShowAuthModal(true);
      return;
    }
    const unsaved = results.map((_, i) => i).filter((i) => !savedGiftIds.has(i));
    executeSave(unsaved, results);
  };

  // After sign-in, flush any pending saves that were queued before auth
  useEffect(() => {
    if (!user || !session) return;
    const pending = sessionStorage.getItem(PENDING_SAVES_KEY);
    if (!pending) return;
    sessionStorage.removeItem(PENDING_SAVES_KEY);
    try {
      const { action, indices, results: pendingResults } = JSON.parse(pending);
      if (pendingResults?.length) {
        setResults(pendingResults);
        setView("results");
        if (action === "load_more") {
          // Re-fire load more after auth
          fetchMoreGifts(pendingResults);
        } else {
          executeSave(indices ?? [], pendingResults);
        }
      }
    } catch { /* malformed — ignore */ }
  }, [user, session]);

  // ============================================================
  // LOAD MORE
  // ============================================================

  const fetchMoreGifts = async (currentResults: Gift[]) => {
    if (!quizAnswers || loadingMore) return;
    setLoadingMore(true);

    // Pass currently shown gift names so the backend excludes them
    const excludeNames = currentResults.map((g) => g.name);

    try {
      const res = await fetch(`${apiUrl}/recommend`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion:           quizAnswers.occasion,
          occasion_date:      quizAnswers.occasion_date,
          days_until_needed:  quizAnswers.days_until_needed,
          relationship_stage: quizAnswers.relationship_stage,
          partner_name:       quizAnswers.partner_name,
          partner_id:         quizAnswers.partner_id,
          vibe:               quizAnswers.vibe          ?? [],
          max_price:          quizAnswers.max_price,
          confidence:         quizAnswers.confidence,
          archetypes:         quizAnswers.archetypes    ?? [],
          interests:          quizAnswers.interests     ?? [],
          overlap_interests:  quizAnswers.overlap_interests ?? [],
          exclude_names:      excludeNames,
          k:                  5,
        }),
      });

      if (!res.ok) throw new Error("Failed to load more");
      const data = await res.json();
      const newGifts: Gift[] = Array.isArray(data.gifts) ? data.gifts : [];

      if (newGifts.length === 0) {
        setNoMoreGifts(true);
      } else {
        setResults((prev) => [...prev, ...newGifts]);
      }
    } catch {
      setNoMoreGifts(true);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!user) {
      // Queue load more and prompt auth
      sessionStorage.setItem(
        PENDING_SAVES_KEY,
        JSON.stringify({ action: "load_more", results })
      );
      setShowAuthModal(true);
      return;
    }
    fetchMoreGifts(results);
  };

  // ============================================================
  // STREAMING HANDLER
  // ============================================================

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setError("");
    setResults([]);
    setQuizAnswers(answers);

    // Save partner profile
    if (user && session && answers.partner_name) {
      try {
        const recipientData = {
          name:                 answers.partner_name,
          relationship_stage:   answers.relationship_stage,
          interests:            answers.interests ?? [],
          vibe:                 answers.vibe ?? [],
          preferred_price_range: answers.max_price ? `Up to $${answers.max_price}` : undefined,
        };
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` };
        let saved;
        if (answers.partner_id) {
          const r = await fetch(`${apiUrl}/user-profile/recipients/${answers.partner_id}`, { method: "PUT", headers, body: JSON.stringify(recipientData) });
          if (r.ok) saved = await r.json();
        } else {
          const r = await fetch(`${apiUrl}/user-profile/recipients`, { method: "POST", headers, body: JSON.stringify(recipientData) });
          if (r.ok) saved = await r.json();
        }
        if (saved?.id) answers.partner_id = saved.id;
      } catch { /* non-fatal */ }
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
          if (jsonStr === "[DONE]") { setEnriching(false); return; }

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === "preview") {
              setResults(parsed.gifts || []);
              setEnriching(true);
              setView("results");
            }
            if (parsed.type === "result") {
              setResults(parsed.gifts || []);
              setResultsHeadline(parsed.results_headline ?? "");
              setResultsSubline(parsed.results_subline ?? "");
              setEnriching(false);
            }
          } catch { /* ignore bad chunks */ }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations.");
      setView("results");
      setEnriching(false);
    }
  };

  // ============================================================
  // QUIZ VIEW
  // ============================================================

  if (view === "quiz") {
    return (
      <div className="min-h-screen bg-stone-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
          body { font-family: 'DM Sans', sans-serif; }
          .font-serif { font-family: 'DM Serif Display', serif !important; }
        `}</style>
        <Nav view="quiz" onLogoClick={resetToLanding} />
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-6 text-center">
          <h1 className="font-serif text-4xl text-stone-900 mb-2 tracking-tight">Find the perfect gift</h1>
          <p className="text-stone-500 max-w-md mx-auto">Answer a few questions and we'll match you with gifts she'll genuinely love.</p>
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8 md:p-12">
            <GiftQuiz onComplete={handleQuizComplete} initialAnswers={quizAnswers ?? undefined} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // RESULTS VIEW
  // ============================================================

  if (view === "results") {
    const allGifts = results;

    return (
      <div className="min-h-screen bg-amber-50/40">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
          body { font-family: 'DM Sans', sans-serif; }
          .font-serif { font-family: 'DM Serif Display', serif !important; }

          @keyframes pinDrop {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .pin-animate {
            animation: pinDrop 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            opacity: 0;
          }

          .pin-grid {
            columns: 2;
            column-gap: 1rem;
          }
          @media (max-width: 600px) {
            .pin-grid { columns: 1; }
          }
          .pin-item {
            break-inside: avoid;
            margin-bottom: 1rem;
          }

          /* Whole-card click target */
          .pin-card {
            display: block;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-decoration: none;
            color: inherit;
          }
          .pin-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px -10px rgba(0,0,0,0.13);
          }
          .pin-card:active {
            transform: translateY(-1px);
          }

          /* Top pick glows amber on hover */
          .pin-card-top:hover {
            box-shadow: 0 16px 40px -10px rgba(217,119,6,0.25);
          }

          /* Ribbon badge on image */
          .ribbon {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 2;
          }

          @keyframes shimmer {
            from { background-position: -400px 0; }
            to   { background-position: 400px 0; }
          }
          .shimmer {
            background: linear-gradient(90deg, #f5f4f3 25%, #eae8e6 50%, #f5f4f3 75%);
            background-size: 800px 100%;
            animation: shimmer 1.6s infinite linear;
          }
        `}</style>

        <Nav view="results" onLogoClick={resetToLanding} showStartOver onStartOver={resetToLanding} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

          {/* Page heading */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-stone-900 tracking-tight">
              {resultsHeadline || (quizAnswers?.partner_name ? `Gifts for ${quizAnswers.partner_name}` : "Your recommendations")}
            </h1>
            <p className="text-stone-400 mt-1 text-sm">
              {resultsSubline || (allGifts.length > 0 ? `${allGifts.length} curated picks, ranked by match` : "")}
            </p>
            {enriching && (
              <p className="text-amber-500 text-xs font-medium mt-1.5 animate-pulse">✦ Personalising your picks…</p>
            )}
            {/* Save all button — appears once gifts are loaded */}
            {allGifts.length > 0 && !enriching && (
              <div className="mt-4">
                {saveAllDone ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                    ✓ All gifts saved
                  </span>
                ) : (
                  <button
                    onClick={handleSaveAll}
                    className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-all shadow-sm"
                  >
                    Save this list
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Auth modal — triggered by save actions when not signed in */}
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl mb-6">
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {allGifts.length === 0 && !enriching && (
            <div className="bg-white border border-stone-100 rounded-3xl p-16 text-center shadow-sm">
              <p className="text-4xl mb-4">🔍</p>
              <h2 className="font-serif text-2xl text-stone-900 mb-2">No gifts found</h2>
              <p className="text-stone-500 mb-8 text-sm">Try adjusting your preferences or budget.</p>
              <button onClick={resetToLanding} className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-semibold text-sm hover:bg-stone-800 transition-all">
                Try again
              </button>
            </div>
          )}

          {/* ── PINTEREST GRID — all cards unified ── */}
          {allGifts.length > 0 && (
            <div className="pin-grid">
              {allGifts.map((gift, idx) => {
                const isTopPick  = idx === 0;
                const buyUrl     = normalizeUrl(gift.product_url);
                const delivery   = getDeliveryStatus(gift, quizAnswers?.days_until_needed);
                const matchPct   = Math.round((gift.confidence || 0.85) * 100);
                const title      = gift.display_name || gift.name;
                const isExpanded = expandedDescriptions.has(idx);
                const truncDesc  = gift.description && gift.description.length > 120
                  ? gift.description.substring(0, 120) + "…"
                  : gift.description ?? "";

                const cardBorder = isTopPick
                  ? "border-amber-200"
                  : "border-stone-100";

                return (
                  <div key={idx} className="pin-item pin-animate" style={{ animationDelay: `${idx * 90}ms` }}>
                    {/* Whole card is a link — inner interactive elements stop propagation */}
                    <a
                      href={buyUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`pin-card ${isTopPick ? "pin-card-top" : ""} bg-white rounded-3xl border ${cardBorder} overflow-hidden shadow-sm`}
                      onClick={(e) => { if (!buyUrl) e.preventDefault(); }}
                    >
                      {/* Image area */}
                      <div className="relative bg-stone-50 flex items-center justify-center overflow-hidden"
                        style={{ minHeight: idx % 2 === 0 ? "190px" : "165px" }}>

                        {/* Top pick ribbon overlaid on image */}
                        {isTopPick && (
                          <div className="ribbon">
                            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                              ✦ Top pick
                            </span>
                          </div>
                        )}

                        {/* Bookmark icon — top right of image */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveGift(idx); }}
                          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all"
                          title={savedGiftIds.has(idx) ? "Saved" : "Save gift"}
                        >
                          {savingGiftIds.has(idx) ? (
                            <svg className="w-4 h-4 text-stone-300 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                          ) : savedGiftIds.has(idx) ? (
                            <svg className="w-4 h-4 fill-amber-500 text-amber-500" viewBox="0 0 24 24">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-stone-400 hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                            </svg>
                          )}
                        </button>

                        {gift.image_url ? (
                          <img
                            src={gift.image_url}
                            alt={title}
                            className="w-full object-contain p-4"
                            style={{ maxHeight: idx % 2 === 0 ? "190px" : "165px" }}
                          />
                        ) : enriching ? (
                          <div className="shimmer w-full" style={{ height: idx % 2 === 0 ? "190px" : "165px" }} />
                        ) : (
                          <span className="text-5xl opacity-20 py-8">🎁</span>
                        )}
                      </div>

                      {/* Amber accent line under image for top pick */}
                      {isTopPick && (
                        <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
                      )}

                      {/* Card body */}
                      <div className="p-4">
                        <h2 className={`font-serif leading-snug tracking-tight mb-2 ${isTopPick ? "text-xl text-stone-900" : "text-lg text-stone-800"}`}>
                          {title}
                        </h2>

                        <div className="flex items-center gap-1.5 flex-wrap mb-3">
                          <span className="text-lg font-semibold text-stone-900">${gift.price.toFixed(2)}</span>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-100 text-stone-500 border border-stone-200">{matchPct}%</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${deliveryColorClasses[delivery.color] || deliveryColorClasses.stone}`}>
                            {delivery.icon} {delivery.message}
                          </span>
                        </div>

                        {gift.description && (
                          <p className="text-stone-400 text-xs mb-3 leading-relaxed">
                            {isExpanded ? gift.description : truncDesc}
                            {gift.description.length > 120 && (
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleDescription(idx); }}
                                className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
                              >
                                {isExpanded ? " less" : " more"}
                              </button>
                            )}
                          </p>
                        )}

                        {/* Why this works */}
                        {gift.reason && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-3">
                            <p className="text-xs font-semibold text-amber-700 mb-0.5 uppercase tracking-widest">Why this works</p>
                            <p className="text-xs text-amber-700 leading-relaxed">{enhanceReason(gift.reason)}</p>
                          </div>
                        )}

                        {delivery.showWarning && delivery.warningText && (
                          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
                            <p className="text-xs text-red-600">{delivery.warningText}</p>
                          </div>
                        )}

                        {/* View on Amazon — stops propagation so it doesn't double-open */}
                        {buyUrl && (
                          <div
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(buyUrl, "_blank", "noopener,noreferrer"); }}
                            className="flex items-center justify-center gap-1.5 w-full bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          >
                            View on Amazon
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load more + Start over */}
          {allGifts.length > 0 && !enriching && (
            <div className="mt-10 flex flex-col items-center gap-4">
              {!noMoreGifts ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-semibold text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {loadingMore ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Finding more…
                    </>
                  ) : (
                    <>
                      Show 5 more gifts
                      {!user && <span className="text-xs font-normal text-stone-400 ml-1">(free account required)</span>}
                    </>
                  )}
                </button>
              ) : (
                <p className="text-stone-400 text-sm">No more gifts to show — try adjusting your quiz answers.</p>
              )}
              <div className="text-center">
                <p className="text-stone-400 text-xs mb-2">Not quite right?</p>
                <button onClick={resetToLanding} className="px-5 py-2 border border-stone-200 rounded-xl text-xs font-medium text-stone-500 hover:bg-stone-100 transition-all">
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // LANDING VIEW (default)
  // ============================================================

  return (
    <>
      <Nav view="landing" onLogoClick={resetToLanding} />
      <LandingPage onStart={() => setView("quiz")} />
    </>
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
            <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-amber-500 mx-auto mb-4" style={{ animation: "spin 1s linear infinite" }} />
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