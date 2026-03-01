"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Partner = {
  id: string;
  name: string;
  relationship?: string;
  interests: string[];
  last_gift_search_at?: string;
  birthday?: string;
  updated_at: string;
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: Check if user is logged in
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      // FIX: Added trailing slash
      const res = await fetch(`${apiUrl}/partners/`);
      const data = await res.json();
      setPartners(data);
    } catch (error) {
      console.error("Failed to load partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s profile?`)) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      // FIX: Added trailing slash
      await fetch(`${apiUrl}/partners/${id}/`, { method: "DELETE" });
      loadPartners();
    } catch (error) {
      console.error("Failed to delete partner:", error);
    }
  };

  const getProfileFreshness = (partner: Partner): {
    status: 'fresh' | 'stale' | 'very_stale';
    message: string;
  } => {
    if (!partner.updated_at) return { status: 'fresh', message: '' };

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(partner.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate > 180) {
      return {
        status: 'very_stale',
        message: `Last updated ${Math.floor(daysSinceUpdate / 30)} months ago`
      };
    } else if (daysSinceUpdate > 60) {
      return {
        status: 'stale',
        message: `Updated ${Math.floor(daysSinceUpdate / 30)} months ago`
      };
    }

    return { status: 'fresh', message: '' };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              👥 My Partners
            </h1>
            <p className="text-slate-600">
              Save profiles to find gifts faster next time
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md"
          >
            ← Back to Quiz
          </Link>
        </div>

        {partners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No partners yet
            </h2>
            <p className="text-slate-600 mb-6">
              Take the quiz and add a name to create your first profile!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Start Quiz
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {partners.map((partner) => {
              const freshness = getProfileFreshness(partner);

              return (
                <div
                  key={partner.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
                >
                  {/* Staleness Warning */}
                  {freshness.status !== 'fresh' && (
                    <div className={`
                      p-3 rounded-lg mb-4 text-sm font-medium
                      ${freshness.status === 'very_stale' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}
                    `}>
                      ⚠️ {freshness.message}. <Link href={`/?partner_id=${partner.id}`} className="underline">Update their preferences</Link>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {partner.name}
                      </h3>
                      {partner.relationship && (
                        <p className="text-slate-500 font-medium">
                          {partner.relationship}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {partner.interests.slice(0, 4).map((interest, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                          >
                            {interest}
                          </span>
                        ))}
                        {partner.interests.length > 4 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                            +{partner.interests.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/?partner_id=${partner.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Find Gifts"
                      >
                        🎁
                      </Link>
                      <button
                        onClick={() => deletePartner(partner.id, partner.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Profile"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}