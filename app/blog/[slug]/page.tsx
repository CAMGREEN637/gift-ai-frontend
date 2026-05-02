import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/content/articles";
import type { GiftArticle as Article, Gift as GiftPick } from "@/content/articles";
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
  const hasParenthetical = article.title.includes("(");
  const seoTitle = hasParenthetical
    ? `${article.title} | Regala`
    : `${article.title} (That Actually Feel Thoughtful) | Regala`;
  return {
    title: seoTitle,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      siteName: "Regala",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
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
// GIFT PICK CARD — stacked layout with full-width image
// =============================================================================

function GiftPickCard({ gift }: { gift: GiftPick }) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden mb-4">
      {gift.image_url && (
        <div className="bg-stone-50 flex items-center justify-center p-6 border-b border-stone-100">
          <img
            src={gift.image_url}
            alt={gift.name}
            className="max-h-64 w-auto object-contain"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg text-stone-900">{gift.name}</h3>
          <span className="text-stone-600 font-semibold text-sm shrink-0 ml-4">
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
          className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline"
        >
          View on Amazon →
        </a>
      </div>
    </div>
  );
}

// =============================================================================
// GIFT PICKS GROUP — inline CTA only after the first card
// =============================================================================

function GiftPicksGroup({
  gifts,
  quizUrl,
}: {
  gifts: GiftPick[];
  quizUrl: string;
}) {
  return (
    <div className="my-6">
      {gifts.map((gift, idx) => (
        <div key={idx}>
          <GiftPickCard gift={gift} />
          {idx === 0 && (
            <div className="text-right mt-1 mb-4">
              <Link
                href={quizUrl}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Want picks tailored to her? Take the quiz →
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// CTA BLOCK — single instance at bottom of article
// =============================================================================

function CtaBlock({ article }: { article: Article }) {
  const quizUrl = `/?occasion=${article.occasion}&interests=${article.interests.join(",")}`;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 my-10 text-center">
      <h2 className="font-serif text-2xl text-stone-900 mb-2">
        Still not sure? We'll figure it out together.
      </h2>
      <p className="text-stone-500 text-sm mt-2 mb-6 max-w-sm mx-auto">
        Take the 2-minute quiz and get recommendations matched to her
        interests, your relationship, and the occasion.
      </p>
      <Link
        href={quizUrl}
        className="inline-block px-8 py-4 bg-stone-900 text-white font-semibold rounded-2xl hover:bg-stone-800 transition-all shadow-sm text-base"
      >
        Take the quiz →
      </Link>
    </div>
  );
}

// =============================================================================
// HOW WE CHOOSE THESE
// =============================================================================

function HowWeChoose() {
  return (
    <div className="bg-stone-50 border border-stone-100 rounded-3xl p-8 my-10">
      <h3 className="font-serif text-xl text-stone-900 mb-4">
        How we choose these gifts
      </h3>
      <p className="text-stone-600 text-sm leading-relaxed mb-4">
        We don't just list popular products. Every recommendation is scored
        across multiple dimensions — her specific interests, the emotional
        register of the occasion, where your relationship is, and your
        budget — then ranked by how well each gift fits the full picture.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">🎯</span>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Interest matching
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Gifts ranked by how well they align with what she actually
              cares about
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">❤️</span>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Occasion awareness
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              A Valentine's gift should feel different from a birthday gift
              — we calibrate for that
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">🧭</span>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Stage sensitivity
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              What works for a new relationship is different from what
              works for a marriage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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

  const quizUrl = `/?occasion=${article.occasion}&interests=${article.interests.join(",")}`;

  // Hook paragraph — auto-generated from article metadata
  const hookOccasionLabels: Record<string, string> = {
    birthday: "her birthday",
    valentines: "Valentine's Day",
    anniversary: "your anniversary",
    christmas: "Christmas",
    mothers_day: "Mother's Day",
    just_because: "a surprise gift",
    apology: "an apology",
  };
  const hookOccasion = hookOccasionLabels[article.occasion] || "the occasion";
  const hookInterest = article.interests[0] || "her interests";

  // Price range — computed from all gift data
  const allGifts = article.sections
    .filter((s) => s.type === "picks")
    .flatMap((s) => s.gifts ?? []);
  const prices = allGifts
    .map((g) => parseFloat(g.price.replace(/[$,]/g, "")))
    .filter((p) => !isNaN(p));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Partition sections by type
  const textSections = article.sections.filter((s) => s.type === "text");
  const picksSections = article.sections.filter((s) => s.type === "picks");

  // Related articles — same occasion or overlapping interests
  const relatedArticles = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .filter(
      (a) =>
        a.occasion === article.occasion ||
        a.interests.some((i) => article.interests.includes(i))
    )
    .slice(0, 3);

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

        {/* 1. Occasion badge */}
        <div className="mt-6 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            {OCCASION_LABELS[article.occasion] ?? article.occasion}
          </span>
        </div>

        {/* 1. Title */}
        <h1 className="font-serif text-4xl text-stone-900 tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>

        {/* 1. Meta line */}
        <p className="text-xs text-stone-400 mb-8">{article.readTime}</p>

        {/* 2. Hook paragraph — auto-generated */}
        <p className="text-stone-600 text-base leading-relaxed mb-8">
          {`You know she's into ${hookInterest} — but buying ${
            hookOccasion === "a surprise gift" || hookOccasion === "an apology"
              ? hookOccasion
              : `a ${hookOccasion} gift`
          } around that interest is harder than it sounds. The obvious picks feel lazy, the obscure ones feel risky. These are the ones that actually land.`}
        </p>

        {/* 3. Price range context */}
        {prices.length > 0 && (
          <div className="flex items-center gap-3 mb-8 text-xs text-stone-400">
            <span>{allGifts.length} picks</span>
            <span className="text-stone-200">·</span>
            <span>
              ${minPrice.toFixed(0)} – ${maxPrice.toFixed(0)}
            </span>
          </div>
        )}

        {/* 4. Text sections — editorial content before picks */}
        {textSections.map((section, index) => (
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
        ))}

        {/* 5. "Our picks" subheading */}
        {picksSections.length > 0 && (
          <h2 className="font-serif text-2xl text-stone-900 mb-6 mt-10">
            Our picks
          </h2>
        )}

        {/* 6. Gift pick cards */}
        {picksSections.map((section, index) => (
          <GiftPicksGroup
            key={index}
            gifts={section.gifts ?? []}
            quizUrl={quizUrl}
          />
        ))}

        {/* 7 & 8. How we choose + single CTA block */}
        <HowWeChoose />
        <CtaBlock article={article} />

        {/* 9. Related guides */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-stone-200">
            <h3 className="font-serif text-xl text-stone-900 mb-6">
              Related guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white border border-stone-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-sm transition-all group"
                >
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest mb-2">
                    {OCCASION_LABELS[related.occasion] ?? related.occasion}
                  </p>
                  <p className="font-serif text-base text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                    {related.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-2">
                    {related.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
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
