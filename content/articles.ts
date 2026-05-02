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
            name: "Espresso Martini Kit",
            price: "$45.00",
            reason: "This espresso martini kit captures the celebratory vibe of her birthday and shows you want her to enjoy something fun. It's a fun gift for your girlfriend that highlights her desire for good times while celebrating her special day.",
            url: "https://www.amazon.com/Espresso-Martini-Gifts-Complete-Botanicals/dp/B0FW25RLC5",
            image_url: "https://m.media-amazon.com/images/I/71W-IVXYZ9L._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "6-Cup Pour-Over Glass Coffeemaker",
            price: "$47.00",
            reason: "The Chemex Pour-Over Coffeemaker offers a cozy, thoughtful way for your girlfriend to enjoy her coffee experience, making it an ideal birthday gift. It's a beautiful and functional piece that reflects your care for her preferences.",
            url: "https://www.amazon.com/dp/B0000YWF5E",
            image_url: "https://m.media-amazon.com/images/I/71oMA36JxfL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Fellow Stagg EKG Pro Kettle",
            price: "$179.00",
            reason: "Investing in a high-quality kettle like this showcases your attention to detail and luxury for your girlfriend's birthday celebration. It's a thoughtful gesture that enhances her coffee-making experience.",
            url: "https://www.amazon.com/Fellow-Stagg-Electric-Gooseneck-Kettle/dp/B0BF7DXLBF",
            image_url: "https://m.media-amazon.com/images/I/61grHEIj7PL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      { type: "cta" }
    ]
  }, // <--- THIS COMMA IS CRUCIAL

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
        body: "Buying a Mother's Day gift for someone who's into skincare sounds straightforward — but the wrong pick can feel generic or lazy. The best gifts in this space connect to how she actually engages with skincare, not just the category label."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "Rodan + Fields Luxury Skincare Set",
            price: "$199.20",
            reason: "This skincare kit allows your girlfriend to indulge in a luxurious self-care routine, providing her with the pampering she deserves on Mother's Day.",
            url: "https://www.amazon.com/Rodan-Fields-Redefine-Appearance-Firmness/dp/B01LHPRZFE",
            image_url: "https://m.media-amazon.com/images/I/51AHekjUOkL._SL1500_.jpg"
          },
          {
            name: "4D Red Light Therapy Face Mask",
            price: "$179.00",
            reason: "This red light therapy mask is a perfect way for your partner to relax and rejuvenate her skin, allowing her to indulge in some personal time.",
            url: "https://www.amazon.com/dp/B0FJS8ZQWS",
            image_url: "https://m.media-amazon.com/images/I/41AUc0hbRmL._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Lavender Spa Gift Set for Women",
            price: "$139.00",
            reason: "This luxurious spa gift set offers a complete pampering experience right at home, aligning perfectly with the Mother's Day spirit.",
            url: "https://www.amazon.com/Lizush-Piece-Complete-Luxury-Women/dp/B088ZHBX22",
            image_url: "https://m.media-amazon.com/images/I/513jKGDIIYL._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "ELEMIS SPF 30 Daily Facial Moisturizer",
            price: "$119.00",
            reason: "This facial moisturizer provides a daily luxury that celebrates her beauty while helping her feel rejuvenated.",
            url: "https://www.amazon.com/ELEMIS-Pro-Collagen-Marine-Cream-SPF/dp/B07BMBQG73",
            image_url: "https://m.media-amazon.com/images/I/61EU70GZWTL._SL1500_.jpg"
          },
          {
            name: "Skincare Fridge with LED Mirror",
            price: "$135.59",
            reason: "This thoughtful skincare fridge allows her to keep beauty products organized and at the perfect temperature.",
            url: "https://www.amazon.com/Kikihouse-Skincare-Lighting-Dimmable-Cosmetic/dp/B0GSZN88J7",
            image_url: "https://m.media-amazon.com/images/I/61IdGY1rcPL._AC_SL1500_.jpg"
          }
        ]
      },
      {
        type: "text",
        heading: "Making it land",
        body: "Mother's Day gifts land best when paired with an experience — breakfast in bed, a quiet morning, or just handling everything for the day so she doesn't have to."
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
    .filter(Boolean) as GiftArticle[];
}