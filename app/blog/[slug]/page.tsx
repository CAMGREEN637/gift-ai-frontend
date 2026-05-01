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
// METADATA — Task 3: emotional hook in title
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
    <div className="bg-white border border-stone-100 rounded-2xl p-5">
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
// GIFT PICKS GROUP — renders each card + inline micro-CTA (Task 2)
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
      {gifts.map((gift, i) => (
        <div key={i}>
          <GiftPickCard gift={gift} />
          {/* Task 2: subtle inline micro-CTA after each card */}
          <div className="text-right mt-1 mb-4">
            <Link
              href={quizUrl}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              Want more picks like this? Take the quiz →
            </Link>
          </div>
        </div>
      ))}
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
// HOW WE CHOOSE THESE — Task 5: hardcoded trust section
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
// SECTION RENDERER — skips first picks (already front-loaded)
// =============================================================================

function renderSection(
  section: ArticleSection,
  index: number,
  article: Article,
  ctaCount: { count: number },
  quizUrl: string
): React.ReactNode {
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
      <GiftPicksGroup key={index} gifts={section.gifts} quizUrl={quizUrl} />
    );
  }

  if (section.type === "cta") {
    ctaCount.count += 1;
    const variant = ctaCount.count === 1 ? "mid" : "bottom";
    // Task 5: inject "How we choose these" immediately before the bottom CTA
    if (variant === "bottom") {
      return [
        <HowWeChoose key={`how-${index}`} />,
        <CtaBlock key={`cta-${index}`} article={article} variant="bottom" />,
      ];
    }
    return <CtaBlock key={index} article={article} variant="mid" />;
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

  const quizUrl = `/?occasion=${article.occasion}&interests=${article.interests.join(",")}`;

  // Task 1: find the first picks section to front-load
  const firstPicksIndex = article.sections.findIndex((s) => s.type === "picks");
  const firstPicksSection =
    firstPicksIndex !== -1 ? article.sections[firstPicksIndex] : null;

  // Task 4: related articles — same occasion or overlapping interests
  const relatedArticles = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .filter(
      (a) =>
        a.occasion === article.occasion ||
        a.interests.some((i) => article.interests.includes(i))
    )
    .slice(0, 3);

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

        {/* Task 1: front-loaded first picks section */}
        {firstPicksSection && firstPicksSection.type === "picks" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4">
              Our top picks
            </p>
            <GiftPicksGroup
              gifts={firstPicksSection.gifts}
              quizUrl={quizUrl}
            />
          </div>
        )}

        {/* Remaining sections — skip the already-rendered first picks */}
        {article.sections.map((section, index) => {
          if (index === firstPicksIndex) return null;
          return renderSection(section, index, article, ctaCount, quizUrl);
        })}

        {/* Task 4: related guides */}
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
