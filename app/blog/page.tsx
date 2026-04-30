import Link from "next/link";
import { getAllArticles } from "@/content/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Gift Guide | Regala",
  description: "Advice, ideas, and the thinking behind great gifts.",
};

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  valentines: "Valentine's Day",
  anniversary: "Anniversary",
  christmas: "Christmas",
  "mothers-day": "Mother's Day",
  "just-because": "Just Because",
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'DM Serif Display', serif !important; }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-stone-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl text-stone-900 hover:text-amber-700 transition-colors">
              Regala
            </span>
            <span className="text-stone-400 text-xs font-medium hidden sm:inline">
              gift advisor
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all"
            >
              Find gifts
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-stone-900 tracking-tight mb-3">
            The Gift Guide
          </h1>
          <p className="text-stone-500 text-lg">
            Advice, ideas, and the thinking behind great gifts.
          </p>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="bg-white border border-stone-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all block group"
            >
              {/* Accent bar */}
              <div className="h-1.5 bg-amber-400 rounded-t-3xl" />

              <div className="p-6">
                {/* Occasion badge */}
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {OCCASION_LABELS[article.occasion] ?? article.occasion}
                </span>

                {/* Title */}
                <h2 className="font-serif text-lg text-stone-900 leading-snug mb-3 group-hover:text-amber-700 transition-colors">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Read time */}
                <p className="text-xs text-stone-400">{article.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Regala. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
