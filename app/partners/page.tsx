// app/partners/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// =============================================================================
// TYPES
// =============================================================================

type SavedGift = {
  id: string;
  name: string;
  display_name?: string;
  price?: number;
  image_url?: string;
  product_url?: string;
  reason?: string;
  occasion?: string;
  saved_at?: string;
};

type Recipient = {
  id: string;
  name: string;
  relationship_stage?: string;
  interests?: string[];
  birthday?: string;
  anniversary?: string;
  notes?: string;
  createdAt?: string;
  saved_gifts?: SavedGift[];
};

// =============================================================================
// HELPERS
// =============================================================================

const RELATIONSHIP_STAGE_LABELS: Record<string, string> = {
  new:         "Early days",
  dating:      "We're official",
  serious:     "The real deal",
  committed:   "All in",
  complicated: "It's complicated",
};

const INTEREST_LABELS: Record<string, string> = {
  coffee:      "Coffee",
  cooking:     "Cooking",
  baking:      "Baking",
  wine:        "Wine",
  cocktails:   "Cocktails",
  fitness:     "Fitness",
  running:     "Running",
  cycling:     "Cycling",
  yoga:        "Yoga",
  reading:     "Reading",
  music:       "Music",
  gaming:      "Gaming",
  photography: "Photography",
  art:         "Art",
  travel:      "Travel",
  hiking:      "Hiking",
  camping:     "Camping",
  gardening:   "Gardening",
  movies:      "Movies",
  fashion:     "Fashion",
  skincare:    "Skincare",
  makeup:      "Makeup",
  wellness:    "Wellness",
  home_decor:  "Candles & Home",
  pets:        "Pets",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function formatJoined(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Days until a recurring annual date (birthday/anniversary)
function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}

function UpcomingBadge({ days, label }: { days: number; label: string }) {
  if (days > 30) return null;
  const color =
    days <= 7
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${color}`}>
      {label} in {days}d
    </span>
  );
}

// =============================================================================
// RECIPIENT CARD
// =============================================================================

function RecipientCard({
  recipient,
  onDelete,
}: {
  recipient: Recipient;
  onDelete: (id: string, name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const stage =
    RELATIONSHIP_STAGE_LABELS[recipient.relationship_stage ?? ""] ||
    recipient.relationship_stage ||
    null;

  const interests    = recipient.interests ?? [];
  const savedGifts   = recipient.saved_gifts ?? [];
  const birthdayDays = daysUntil(recipient.birthday);
  const anniversaryDays = daysUntil(recipient.anniversary);
  const joined = formatJoined(recipient.createdAt);

  return (
    <div className="bg-white border border-stone-100 rounded-3xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <span className="font-serif text-amber-700 text-lg font-semibold">
                {getInitials(recipient.name)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-lg leading-tight">
                {recipient.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {stage && (
                  <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {stage}
                  </span>
                )}
                {birthdayDays !== null && (
                  <UpcomingBadge days={birthdayDays} label="Birthday" />
                )}
                {anniversaryDays !== null && (
                  <UpcomingBadge days={anniversaryDays} label="Anniversary" />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/?partner_id=${recipient.id}`}
              className="px-4 py-2 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-all"
            >
              Find gifts
            </Link>
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all text-sm"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Quick info row */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-stone-400">
          {recipient.birthday && (
            <div className="flex items-center gap-1.5">
              <span>🎂</span>
              <span>Birthday {formatDate(recipient.birthday)}</span>
            </div>
          )}
          {recipient.anniversary && (
            <div className="flex items-center gap-1.5">
              <span>💝</span>
              <span>Anniversary {formatDate(recipient.anniversary)}</span>
            </div>
          )}
          {joined && (
            <div className="flex items-center gap-1.5">
              <span>📅</span>
              <span>Added {joined}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-stone-100 px-6 py-5 space-y-5">

          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-medium rounded-full"
                  >
                    {INTEREST_LABELS[interest] ?? interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {recipient.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Notes
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">{recipient.notes}</p>
            </div>
          )}

          {/* Saved gifts */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Saved gifts
              {savedGifts.length > 0 && (
                <span className="ml-2 normal-case font-medium text-stone-400">
                  · {savedGifts.length}
                </span>
              )}
            </p>

            {savedGifts.length === 0 ? (
              <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 text-center">
                <p className="text-sm text-stone-400">
                  No gifts saved yet.{" "}
                  <Link href={`/?partner_id=${recipient.id}`} className="text-amber-600 hover:underline font-medium">
                    Find gift ideas
                  </Link>{" "}
                  and bookmark the ones you like.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedGifts.map((gift) => {
                  const buyUrl = gift.product_url
                    ? gift.product_url.startsWith("http") ? gift.product_url : `https://${gift.product_url}`
                    : null;
                  const savedDate = gift.saved_at
                    ? new Date(gift.saved_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : null;

                  return (
                    <div key={gift.id} className="flex gap-3 bg-stone-50 border border-stone-100 rounded-2xl p-3 group">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-white border border-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {gift.image_url ? (
                          <img src={gift.image_url} alt={gift.display_name || gift.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-xl opacity-30">🎁</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-900 leading-tight truncate">
                          {gift.display_name || gift.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {gift.price != null && (
                            <span className="text-xs font-medium text-stone-600">${gift.price.toFixed(2)}</span>
                          )}
                          {gift.occasion && (
                            <span className="text-xs text-stone-400 capitalize">{gift.occasion.replace(/_/g, " ")}</span>
                          )}
                        </div>
                        {gift.reason && (
                          <p className="text-xs text-stone-400 leading-relaxed mt-1 line-clamp-2">{gift.reason}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {buyUrl && (
                            <a
                              href={buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline"
                            >
                              View on Amazon →
                            </a>
                          )}
                          {savedDate && (
                            <span className="text-xs text-stone-300">Saved {savedDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onDelete(recipient.id, recipient.name)}
              className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
            >
              Delete profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default function PartnersPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading]       = useState(true);
  const { user, session, signOut }  = useAuth();
  const router                      = useRouter();

  useEffect(() => {
    if (user && session) {
      loadRecipients();
    } else {
      setLoading(false);
    }
  }, [user, session]);

  const loadRecipients = async () => {
    if (!session) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/user-profile/recipients`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) { setRecipients([]); return; }
      const data = await res.json();
      setRecipients(Array.isArray(data) ? data : []);
    } catch {
      setRecipients([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipient = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}'s profile? This can't be undone.`)) return;
    if (!session) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/user-profile/recipients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) loadRecipients();
    } catch { /* silent */ }
  };

  // ── STYLES (shared across all states) ──
  const pageStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
      body { font-family: 'DM Sans', sans-serif; }
      .font-serif { font-family: 'DM Serif Display', serif !important; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  );

  const nav = (
    <nav className="border-b border-stone-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-stone-900 hover:text-amber-700 transition-colors">
          Gift AI
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all">
            Find gifts
          </Link>
          {user && (
            <button
              onClick={() => signOut()}
              className="px-4 py-1.5 text-sm font-medium text-stone-400 hover:text-stone-600 transition-all"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  // ── LOADING ──
  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        {pageStyles}
        {nav}
        <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-amber-500" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      </main>
    );
  }

  // ── NOT SIGNED IN ──
  if (!user) {
    return (
      <main className="min-h-screen bg-stone-50">
        {pageStyles}
        {nav}
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <p className="text-5xl mb-6">🔒</p>
          <h1 className="font-serif text-3xl text-stone-900 mb-3 tracking-tight">Sign in to view your account</h1>
          <p className="text-stone-500 mb-8 text-sm">Your saved partners and gift history live here.</p>
          <Link href="/" className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-semibold text-sm hover:bg-stone-800 transition-all">
            Back to Gift AI
          </Link>
        </div>
      </main>
    );
  }

  // ── MAIN PAGE ──
  return (
    <main className="min-h-screen bg-stone-50">
      {pageStyles}
      {nav}

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-2">My Account</p>
            <h1 className="font-serif text-4xl text-stone-900 tracking-tight">Saved Partners</h1>
            <p className="text-stone-400 text-sm mt-1">
              {recipients.length === 0
                ? "No partners saved yet."
                : `${recipients.length} saved profile${recipients.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/"
            className="self-start sm:self-auto px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-all"
          >
            + Find gifts
          </Link>
        </div>

        {/* Account info strip */}
        <div className="bg-white border border-stone-100 rounded-2xl px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
              <span className="text-stone-500 text-sm font-semibold">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-900">{user.email}</p>
              <p className="text-xs text-stone-400">Free account</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-xs text-stone-400 hover:text-stone-600 transition-all self-start sm:self-auto"
          >
            Sign out
          </button>
        </div>

        {/* Empty state */}
        {recipients.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-3xl p-16 text-center shadow-sm">
            <p className="text-5xl mb-5">💝</p>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">No partners saved yet</h2>
            <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto">
              When you enter a partner's name during the quiz, their profile is saved here for next time.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-semibold text-sm hover:bg-stone-800 transition-all"
            >
              Start the gift finder
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recipients.map((r) => (
              <RecipientCard key={r.id} recipient={r} onDelete={deleteRecipient} />
            ))}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Gift AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}