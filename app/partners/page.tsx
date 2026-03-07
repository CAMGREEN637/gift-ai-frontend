// app/partners/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Recipient = {
  id: string;
  name: string;
  relationship?: string;
  interests: string[];
  birthday?: string;
  lastGiftDate?: string;
  createdAt: string;
};

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, session } = useAuth();

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
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });

      if (!res.ok) {
        console.error("Failed to fetch recipients:", res.status);
        setRecipients([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setRecipients(data);
      } else {
        setRecipients([]);
      }
    } catch (error) {
      console.error("Failed to load recipients:", error);
      setRecipients([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipient = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    if (!session) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/user-profile/recipients/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        loadRecipients();
      }
    } catch (error) {
      console.error("Failed to delete recipient:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <Link href="/" className="text-blue-600 underline">Return Home</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">👥 Saved Recipients</h1>
            <p className="text-slate-600">People you've searched gifts for</p>
          </div>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
            ← Find Gifts
          </Link>
        </div>

        {recipients.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No recipients yet</h2>
            <Link href="/" className="text-blue-600 underline">Start the quiz to add one!</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{recipient.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recipient.relationship && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {recipient.relationship}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* CHANGED: This now uses partner_id to match your Home page's useEffect */}
                    <Link
                      href={`/?partner_id=${recipient.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      Find Gifts
                    </Link>
                    <button
                      onClick={() => deleteRecipient(recipient.id, recipient.name)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}