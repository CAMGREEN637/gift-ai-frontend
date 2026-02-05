"use client";


import { useState } from "react";


type Gift = {
 name: string;
 price: number;
 confidence: number;
 description: string;
 image_url?: string;
 product_url?: string;
 ranking_reasons?: string[];
 reason?: string;
};


function normalizeUrl(url?: string): string | null {
 if (!url || typeof url !== "string") return null;
 // Don't modify URLs that are already complete
 if (url.startsWith("http://") || url.startsWith("https://")) return url;
 return `https://${url}`;
}


export default function Home() {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState<Gift[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});


 async function getRecommendations() {
   setLoading(true);
   setError("");
   setResults([]);
   setImageErrors({});


   try {
     const apiUrl =
       process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


     const res = await fetch(
       `${apiUrl}/recommend?query=${encodeURIComponent(query)}`
     );


     if (!res.ok) throw new Error("Request failed");


     const data = await res.json();

     // Debug: Log the raw response
     console.log("API Response:", data);


     const gifts: Gift[] = Array.isArray(data.gifts) ? data.gifts : [];

     // Debug: Log each gift's URLs
     gifts.forEach((gift, idx) => {
       console.log(`Gift ${idx}:`, {
         name: gift.name,
         image_url: gift.image_url,
         product_url: gift.product_url
       });
     });


     gifts.sort((a, b) => b.confidence - a.confidence);


     setResults(gifts);
   } catch (err) {
     console.error("Fetch error:", err);
     setError("Failed to fetch recommendations");
   } finally {
     setLoading(false);
   }
 }


 const handleImageError = (idx: number, url: string) => {
   console.error(`Image failed to load at index ${idx}:`, url);
   setImageErrors(prev => ({ ...prev, [idx]: true }));
 };


 return (
   <main className="min-h-screen bg-slate-50 px-6 py-12">
     <div className="mx-auto max-w-4xl">
       {/* Hero */}
       <h1 className="text-4xl font-bold text-slate-900 mb-2">
         🎁 AI Gift Finder
       </h1>
       <p className="text-slate-600 mb-8">
         Thoughtful gifts, ranked by relevance.
       </p>


       {/* Search */}
       <div className="flex gap-3 mb-10">
         <input
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Gift for dad who loves grilling"
           className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
           onKeyDown={(e) => {
             if (e.key === 'Enter' && query) {
               getRecommendations();
             }
           }}
         />
         <button
           onClick={getRecommendations}
           disabled={loading || !query}
           className="rounded-lg bg-slate-900 px-6 py-3 text-white font-medium disabled:opacity-50"
         >
           {loading ? "Thinking…" : "Find Gifts"}
         </button>
       </div>


       {error && <p className="text-red-600">{error}</p>}


       {/* Results */}
       <div className="space-y-8">
         {results.map((gift, idx) => {
           const isTopPick = idx === 0;
           const reasons = Array.isArray(gift.ranking_reasons)
             ? gift.ranking_reasons
             : [];


           const buyUrl = normalizeUrl(gift.product_url);
           // Don't normalize image URLs - use them as-is
           const imageUrl = gift.image_url;
           const hasImageError = imageErrors[idx];


           return (
             <div
               key={`${gift.name}-${idx}`}
               className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden"
             >
               <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
                 {/* Image */}
                 <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                   {imageUrl && !hasImageError ? (
                     <img
                       src={imageUrl}
                       alt={gift.name}
                       loading="lazy"
                       className="w-full h-full object-cover"
                       onError={() => handleImageError(idx, imageUrl)}
                       crossOrigin="anonymous"
                     />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
                       <div>No image available</div>
                       {hasImageError && (
                         <div className="mt-1 text-[10px] text-slate-300">
                           (failed to load)
                         </div>
                       )}
                     </div>
                   )}
                 </div>


                 {/* Content */}
                 <div>
                   <div className="flex items-center gap-3">
                     <h2 className="text-xl font-semibold text-slate-900">
                       {gift.name}
                     </h2>
                     {isTopPick && (
                       <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
                         🏆 Top Pick
                       </span>
                     )}
                   </div>


                   <p className="mt-2 text-slate-600">
                     {gift.description}
                   </p>


                   {/* LLM Reason */}
                   {gift.reason && (
                     <p className="mt-3 text-sm text-emerald-700 italic">
                       {gift.reason}
                     </p>
                   )}


                   {/* Confidence */}
                   <div className="mt-4">
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-500">Match</span>
                       <span className="font-medium">
                         {(gift.confidence * 100).toFixed(0)}%
                       </span>
                     </div>
                     <div className="h-2 bg-slate-200 rounded-full">
                       <div
                         className="h-2 bg-emerald-500 rounded-full"
                         style={{
                           width: `${gift.confidence * 100}%`,
                         }}
                       />
                     </div>
                   </div>


                   {/* Top pick explanation */}
                   {isTopPick && reasons.length > 0 && (
                     <div className="mt-4">
                       <p className="text-sm font-semibold text-slate-700 mb-1">
                         Why this is the best choice
                       </p>
                       <ul className="list-disc list-inside text-sm text-slate-600">
                         {reasons.map((reason, i) => (
                           <li key={i}>{reason}</li>
                         ))}
                       </ul>
                     </div>
                   )}


                   {/* Footer */}
                   <div className="mt-6 flex items-center justify-between">
                     <span className="text-lg font-semibold">
                       ${gift.price}
                     </span>


                     {buyUrl ? (
                       <a
                         href={buyUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2 text-white text-sm font-medium hover:bg-slate-800 transition"
                       >
                         Buy Gift →
                       </a>
                     ) : (
                       <span className="text-sm text-slate-400">
                         No purchase link available
                       </span>
                     )}
                   </div>
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