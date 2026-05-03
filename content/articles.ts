// app/content/articles.ts

export interface Gift {
  name: string;
  price: string;
  reason: string;
  url: string;
  image_url: string;
}

export interface ArticleSection {
  type: 'picks' | 'cta' | 'text';
  gifts?: Gift[];
  heading?: string;
  body?: string;
}

export interface GiftArticle {
  slug: string;
  title: string;
  excerpt: string;
  occasion: string;
  interests: string[];
  readTime: string;
  publishedAt: string;
  sections: ArticleSection[];
  relatedArticles?: string[];
}

export const SAMPLE_ARTICLES: GiftArticle[] = [
  // ============================================================================
  // BIRTHDAY GIFTS — COFFEE LOVERS
  // ============================================================================
  {
    slug: "birthday-gifts-coffee",
    title: "Birthday Gift Ideas for a Coffee-Obsessed Girlfriend",
    excerpt: "Birthday gifts matched to her love of coffee, ranked by how thoughtful they'll feel.",
    occasion: "birthday",
    interests: ["coffee"],
    readTime: "4 min read",
    publishedAt: "2026-05-01",
    relatedArticles: [
      "birthday-gifts-cooking",
      "birthday-gifts-reading",
      "valentines-gifts-coffee",
      "christmas-gifts-coffee"
    ],
    sections: [
      {
        type: "text",
        heading: "What most guys get wrong about coffee gifts",
        body: "Buying a birthday gift for someone who's into coffee sounds straightforward — but the wrong pick can feel generic or lazy. The best gifts in this space connect to how she actually engages with coffee, not just the category label."
      },
      {
        type: "text",
        heading: "Making it land",
        body: "Birthday gifts hit different when they feel considered, not last-minute. If it arrives in Amazon packaging, rewrap it. A handwritten note — even two sentences — elevates any gift."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "20 Bar Semi-Automatic Espresso Machine",
            price: "$159.00",
            reason: "This espresso machine demonstrates your attention to detail and appreciation for quality, which aligns with making her birthday special. It's a thoughtful gift that allows your girlfriend to enjoy a luxurious coffee experience at home.",
            url: "https://www.amazon.com/HIBREW-H10B-Temperature-Adjustable-Intelligent/dp/B0DLP26373",
            image_url: "https://m.media-amazon.com/images/I/71CeX2VA0+L._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "World Coffee Discovery Set - 8-Pack",
            price: "$59.00",
            reason: "A coffee sampler like this shows you've put thought into offering your girlfriend a fun and cozy experience on her birthday. It's a unique way to celebrate her and let her explore different flavors as part of her special day.",
            url: "https://www.amazon.com/dp/B09GZSQMRJ",
            image_url: "https://m.media-amazon.com/images/I/51BxEaYF-+L._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "6-Cup Pour-Over Glass Coffeemaker",
            price: "$47.00",
            reason: "The Chemex Pour-Over Coffeemaker offers a cozy, thoughtful way for your girlfriend to enjoy her coffee experience, making it an ideal birthday gift.",
            url: "https://www.amazon.com/dp/B0000YWF5E",
            image_url: "https://m.media-amazon.com/images/I/71oMA36JxfL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      { type: "cta" }
    ]
  },

  // ============================================================================
  // MOTHER'S DAY GIFTS — SKINCARE
  // ============================================================================
  {
    slug: "mothers_day-gifts-skincare",
    title: "5 Thoughtful Mother’s Day Skincare Gifts That Don’t Feel Generic",
    excerpt: "Curated Mother's Day gift ideas for a girlfriend who's into skincare — each one with an explanation of why it works.",
    occasion: "mothers_day",
    interests: ["skincare"],
    readTime: "4 min read",
    publishedAt: "2026-05-02",
    sections: [
      {
        type: "text",
        heading: "Why skincare gifts need extra thought",
        body: "Buying a Mother's Day gift for someone who's into skincare sounds straightforward — but the wrong pick can feel generic or lazy."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "Rodan + Fields Luxury Skincare Set",
            price: "$199.20",
            reason: "This skincare kit allows your girlfriend to indulge in a luxurious self-care routine, providing her with the pampering she deserves.",
            url: "https://www.amazon.com/Rodan-Fields-Redefine-Appearance-Firmness/dp/B01LHPRZFE",
            image_url: "https://m.media-amazon.com/images/I/51AHekjUOkL._SL1500_.jpg"
          },
          {
            name: "4D Red Light Therapy Face Mask",
            price: "$179.00",
            reason: "This red light therapy mask is a perfect way for your partner to relax and rejuvenate her skin.",
            url: "https://www.amazon.com/dp/B0FJS8ZQWS",
            image_url: "https://m.media-amazon.com/images/I/41AUc0hbRmL._SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      { type: "cta" }
    ]
  },

  // ============================================================================
  // MOTHER'S DAY GIFTS — FITNESS
  // ============================================================================
  {
    slug: "mothers_day-gifts-fitness",
    title: "5 Best Mother’s Day Gifts for Moms Who Love to Stay Active",
    excerpt: "Not sure what to get her for Mother's Day? These fitness-inspired picks actually feel personal.",
    occasion: "mothers_day",
    interests: ["fitness"],
    readTime: "4 min read",
    publishedAt: "2026-05-03",
    sections: [
      {
        type: "picks",
        gifts: [
          {
            name: "Shiatsu Neck and Back Massager",
            price: "$45.00",
            reason: "This gift focuses on pampering, allowing your wife to unwind and enjoy some much-deserved relaxation.",
            url: "https://www.amazon.com/dp/B07G142F9Z",
            image_url: "https://m.media-amazon.com/images/I/71fdZ-Ei0tL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Walking Treadmill with Incline",
            price: "$169.00",
            reason: "A treadmill offers a thoughtful way for your wife to stay active without leaving the comfort of home.",
            url: "https://www.amazon.com/FOUSAE-Treadmill-Treadmills-Brushless-Programs/dp/B0G91J48G6",
            image_url: "https://m.media-amazon.com/images/I/61-4fwbZMxL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      {
        type: "text",
        heading: "Why fitness gifts need extra thought",
        body: "What makes a gift land is the signal that you understand what fitness means to her specifically."
      },
      { type: "cta" }
    ]
  },

  // ============================================================================
  // MOTHER'S DAY GIFTS — LUXURY WELLNESS
  // ============================================================================
  {
    slug: "mothers-day-gifts-luxury-wellness",
    title: "Luxury Mother’s Day Gift Ideas: The Ultimate Self-Care List",
    excerpt: "Go beyond the standard card and flowers with these high-end picks that prioritize her long-term well-being.",
    occasion: "mothers_day",
    interests: ["luxe", "wellness", "home_decor"],
    readTime: "5 min read",
    publishedAt: "2026-05-03",
    sections: [
      {
        type: "picks",
        gifts: [
          {
            name: "Eco-Friendly Non-Slip Yoga Mat",
            price: "$164.00",
            reason: "This is the 'Rolls Royce' of yoga mats. Its premium construction and eco-friendly materials make it a standout gift.",
            url: "https://www.amazon.com/dp/B01CGLCGRA",
            image_url: "https://m.media-amazon.com/images/I/41jBqFTYZVL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Nespresso Vertuo Coffee and Espresso Machine",
            price: "$99.00",
            reason: "Give her the luxury of a specialty coffee bar at home. The Vertuo system is known for its rich crema and elegant design.",
            url: "https://www.amazon.com/dp/B0DVDG5TRT",
            image_url: "https://m.media-amazon.com/images/I/51KPEbDiU+L._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      {
        type: "text",
        heading: "Making her feel celebrated",
        body: "Mother's Day is the perfect time to upgrade the things she uses every day."
      },
      { type: "cta" }
    ]
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getArticleBySlug(slug: string): GiftArticle | undefined {
  return SAMPLE_ARTICLES.find(article => article.slug === slug);
}

export function getArticlesByOccasion(occasion: string): GiftArticle[] {
  return SAMPLE_ARTICLES.filter(article => article.occasion === occasion);
}

export function getArticlesByInterest(interest: string): GiftArticle[] {
  return SAMPLE_ARTICLES.filter(article => article.interests.includes(interest));
}

export function getArticlesByOccasionAndInterest(
  occasion: string,
  interest: string
): GiftArticle[] {
  return SAMPLE_ARTICLES.filter(
    article => article.occasion === occasion && article.interests.includes(interest)
  );
}

export function getAllArticles(): GiftArticle[] {
  return SAMPLE_ARTICLES;
}

export function getRelatedArticles(article: GiftArticle): GiftArticle[] {
  if (!article.relatedArticles) return [];
  return article.relatedArticles
    .map(slug => getArticleBySlug(slug))
    .filter((article): article is GiftArticle => !!article);
}