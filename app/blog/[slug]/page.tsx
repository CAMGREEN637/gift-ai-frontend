import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/content/articles";
import type { Article, ArticleSection, GiftPick } from "@/content/articles";
import type { Metadata } from "next";

// =============================================================================
// STATIC PARAMS — pre-render all articles at build time
// =============================================================================

export function generateStaticParams() {
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
// OCCASION LABELS
// =============================================================================

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  valentines: "Valentine's Day",
  anniversary: "Anniversary",
  christmas: "Christmas",
  "mothers-day": "Mother's Day",
  "just-because": "Just Because",
};

// =============================================================================
// GIFT PICK CARD
// =============================================================================

function GiftPickCard({ gift }: { gift: GiftPick }) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 mb-4">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-serif text-lg text-stone-900 leading-snug">
          {gift.name}
        </h3>
        <span className="text-stone-600 font-semibold text-base shrink-0">
          {gift.price}
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-3">
        <p className="text-xs font-semibold text-amber-700 mb-0.5 uppercase tracking-widest">
          Why this works
        </p>
        <p className="text-xs text-amber-700 leading-relaxed">{gift.reason}</p>
      </div>

      <a
        href={gift.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
      >
        View on Amazon →
      </a>
    </div>
  );
}

// =============================================================================
// CTA BLOCK
// =============================================================================

function CtaBlock({
  article,
  variant,
}: {
  article: Article;
  variant: "mid" | "bottom";
}) {
  const quizUrl = `/?occasion=${article.occasion}&interests=${article.interests.join(",")}`;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 my-10 text-center">
      <h2 className="font-serif text-2xl text-stone-900 mb-2">
        {variant === "mid"
          ? "Want picks tailored specifically to her?"
          : "Still not sure? We'll figure it out together."}
      </h2>
      <p className="text-stone-500 text-sm mt-2 mb-6 max-w-sm mx-auto">
        Take the 2-minute quiz and get recommendations matched to her
        interests, your relationship, and the occasion.
      </p>
      <Link
        href={quizUrl}
        className="inline-block px-8 py-4 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-sm text-base"
      >
        {variant === "mid" ? "Find the perfect gift →" : "Take the quiz →"}
      </Link>
    </div>
  );
}

// =============================================================================
// ARTICLE SECTION RENDERER
// =============================================================================

function renderSection(
  section: ArticleSection,
  index: number,
  article: Article,
  ctaCount: { count: number }
) {
  if (section.type === "text") {
    return (
      <div key={index}>
        {section.heading && (
          <h2 className="font-serif text-2xl text-stone-900 mt-10 mb-4">
            {section.heading}
          </h2>
        )}
        <p className="text-stone-600 text-base leading-relaxed mb-6">
          {section.body}
        </p>
      </div>
    );
  }

  if (section.type === "picks") {
    return (
      <div key={index} className="my-6">
        {section.gifts.map((gift, i) => (
          <GiftPickCard key={i} gift={gift} />
        ))}
      </div>
    );
  }

  if (section.type === "cta") {
    ctaCount.count += 1;
    const variant = ctaCount.count === 1 ? "mid" : "bottom";
    return <CtaBlock key={index} article={article} variant={variant} />;
  }

  return null;
}

// =============================================================================
// PAGE
// =============================================================================

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const ctaCount = { count: 0 };

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

      {/* Article */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8 inline-block"
        >
          ← Back to Gift Guide
        </Link>

        {/* Occasion badge */}
        <div className="mt-6 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            {OCCASION_LABELS[article.occasion] ?? article.occasion}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl text-stone-900 tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <p className="text-xs text-stone-400 mb-8">{article.readTime}</p>

        {/* Body */}
        <div>
          {article.sections.map((section, index) =>
            renderSection(section, index, article, ctaCount)
          )}
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
