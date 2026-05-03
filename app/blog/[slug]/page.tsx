// app/blog/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  GiftArticle,
  Gift,
  ArticleSection,
  getArticleBySlug,
  getRelatedArticles,
  getAllArticles,
} from "@/content/articles";

// =============================================================================
// STATIC PARAMS — pre-renders all article slugs at build time
// =============================================================================

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Regala`,
    description: article.excerpt,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function occasionLabel(occasion: string): string {
  const map: Record<string, string> = {
    birthday: "Birthday",
    valentines: "Valentine's Day",
    christmas: "Christmas",
    anniversary: "Anniversary",
    mothers_day: "Mother's Day",
    "mothers-day": "Mother's Day",
  };
  return map[occasion] ?? occasion.replace(/_/g, " ");
}

// =============================================================================
// GIFT PICK CARD
// =============================================================================

function GiftPickCard({ gift, index }: { gift: Gift; index: number }) {
  return (
    <a
      href={gift.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-5 items-start py-7 border-b border-stone-100 hover:bg-stone-50 rounded-xl px-3 -mx-3 transition-colors"
    >
      {/* Number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mt-0.5">
        <span className="font-serif text-amber-700 text-sm leading-none">{index + 1}</span>
      </div>

      {/* Image */}
      {gift.image_url && (
        <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-stone-100 overflow-hidden flex items-center justify-center border border-stone-200 group-hover:border-amber-300 transition-colors">
          <img
            src={gift.image_url}
            alt={gift.name}
            className="w-full h-full object-contain p-2"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-serif text-stone-900 text-lg leading-snug group-hover:text-amber-800 transition-colors">
            {gift.name}
          </h3>
          <span className="flex-shrink-0 text-stone-900 font-semibold text-base tabular-nums">
            {gift.price}
          </span>
        </div>

        {gift.reason && (
          <div className="mt-2 flex gap-2 items-start">
            <svg
              className="flex-shrink-0 mt-0.5 text-amber-500"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v4M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-stone-500 text-sm leading-relaxed">{gift.reason}</p>
          </div>
        )}

        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 group-hover:text-amber-900 transition-colors">
          View on Amazon
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CtaSection() {
  return (
    <div className="my-10 rounded-2xl bg-amber-50 border border-amber-200 px-8 py-8 text-center">
      <p className="font-serif text-stone-900 text-2xl mb-2">Not sure which one to pick?</p>
      <p className="text-stone-500 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
        Take a short quiz and get a recommendation matched to her specifically.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
      >
        Get a personalized pick
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}

// =============================================================================
// SECTION RENDERER
// =============================================================================

function ArticleSections({ sections }: { sections: ArticleSection[] }) {
  return (
    <div>
      {sections.map((section, i) => {
        if (section.type === "text") {
          return (
            <div key={i} className="mb-8">
              {section.heading && (
                <h2 className="font-serif text-stone-900 text-2xl mb-3 leading-tight">
                  {section.heading}
                </h2>
              )}
              {section.body && (
                <p className="text-stone-600 leading-relaxed text-[1.0625rem]">{section.body}</p>
              )}
            </div>
          );
        }

        if (section.type === "picks" && section.gifts) {
          return (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                  Our Picks
                </span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>
              <div>
                {section.gifts.map((gift, gi) => (
                  <GiftPickCard key={gi} gift={gift} index={gi} />
                ))}
              </div>
            </div>
          );
        }

        if (section.type === "cta") {
          return <CtaSection key={i} />;
        }

        return null;
      })}
    </div>
  );
}

// =============================================================================
// RELATED ARTICLES
// =============================================================================

function RelatedArticles({ articles }: { articles: GiftArticle[] }) {
  if (!articles.length) return null;
  return (
    <aside className="mt-14 pt-10 border-t border-stone-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">
        More Gift Guides
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.slice(0, 4).map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="group block rounded-xl border border-stone-100 bg-white hover:border-amber-200 hover:shadow-sm transition-all px-5 py-4"
          >
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
              {occasionLabel(a.occasion)}
            </span>
            <p className="font-serif text-stone-900 text-base leading-snug mt-1 group-hover:text-amber-800 transition-colors">
              {a.title}
            </p>
            <p className="text-stone-400 text-xs mt-1.5">{a.readTime}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}

// =============================================================================
// PAGE — DEFAULT EXPORT (required by Next.js)
// =============================================================================

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(article);

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'DM Serif Display', serif !important; }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-stone-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-stone-900 hover:text-amber-700 transition-colors">
            Regala
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors">
              ← Gift Guides
            </Link>
            <Link
              href="/"
              className="px-4 py-1.5 text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all"
            >
              Get a pick
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <Link
              href={`/blog?occasion=${article.occasion}`}
              className="text-xs font-semibold uppercase tracking-widest text-amber-600 hover:text-amber-800 transition-colors"
            >
              {occasionLabel(article.occasion)}
            </Link>
            {article.interests.map((tag) => (
              <span key={tag} className="text-xs font-medium text-stone-400 capitalize">
                · {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-stone-900 text-4xl sm:text-5xl leading-tight tracking-tight mb-4">
            {article.title}
          </h1>

          <p className="text-stone-500 text-lg leading-relaxed max-w-xl mb-5">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
              R
            </span>
            <span>
              By <span className="text-stone-600 font-medium">Regala Editors</span>
            </span>
            <span>·</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        <div className="h-px bg-stone-200 mb-10" />

        {/* Article body */}
        <ArticleSections sections={article.sections} />

        {/* Related articles */}
        <RelatedArticles articles={related} />

        {/* Affiliate disclaimer */}
        <p className="mt-10 text-xs text-stone-300 text-center leading-relaxed">
          Regala earns a small commission when you buy through our links, at no extra cost to you.
          We only recommend products we'd actually suggest.
        </p>
      </main>
    </div>
  );
}