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
        type: "picks",
        gifts: [
          {
            name: "20 Bar Semi-Automatic Espresso Machine",
            price: "$159.00",
            reason: "This espresso machine demonstrates your attention to detail and appreciation for quality, which aligns with making her birthday special. It's a thoughtful gift that allows your girlfriend to enjoy a luxurious coffee experience at home.",
            url: "https://www.amazon.com/HIBREW-H10B-Temperature-Adjustable-Intelligent/dp/B0DLP26373?crid=3LJEBJLSS58L5&dib=eyJ2IjoiMSJ9.VRfsNFwOnWd_4xvdvi1vQ1gnO7pp1TWyTMz6hYXrp60IW99Li0B_EQsDKi6gRXiZQrIA0E11VP2Dm-6o-YbwmGxkUEo1fLmqNWPxAfbyB5IW8ot43CDr1w2z5sKE_5TX2ZqkuONNNF6c3Ieq-7xkwxMQGnIBkftJu95YFz4N6rg4VqHrAe3_a6lqqLQE_bFMJLF87_Dgn94NvgdKBBH_ZzayyjUBmuznEsZqCjpDwrNV9IV-U4OYUhAxbMSmlTgFsCXAcm_Xsl41OaM0H22F3LsnhlZhVChJ0UsJBN6ArqA.sMMG9Sm2lc7yL4Jy2y5sZy-3uO9KwKpka23MhvJK6Hc&dib_tag=se&keywords=Breville%2BBarista%2BExpress%2BEspresso%2BMachine&qid=1773107129&sprefix=breville%2Bbarista%2Bexpress%2Bespresso%2Bmachine%2Caps%2C341&sr=8-3-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=59d8a555daf224f89b05d4dd502510ff&language=en_US&ref_=as_li_ss_tl",
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
            url: "https://www.amazon.com/Espresso-Martini-Gifts-Complete-Botanicals/dp/B0FW25RLC5?crid=3CJNI70R46CHZ&dib=eyJ2IjoiMSJ9.ZR2nqrEwJgautpxRgRVWeBXqIDGF35iKcFIe8ps-OIqC5DjqQ_syS_0n9ykyK1m1LAgGAcX5sehf0nFxmnWzlZOyD8a56oRuOfJ-5QqJCAkS_WVpPBmE5_AHs4HGAHkRcuJ7WdH4r3HQyeTpaf95XAdqYJrtJrUrvG3MmL9xL4e0gcR7GogSAZXlKjFV2JLwmp9sGxZeBakXSY_VL74X2Rqy_6I69QocjB3XorwfIIHkwPFs2C8SVJqyLv6uWLXcOFHSCSAXcA-RQTOpPkOp8WS8XS3CKaRp7GkheA5od0A.auAsuxsXHw3sqm0qR1WwSFCuhwhswIIQxjdsbU1X_YA&dib_tag=se&keywords=Espresso+martini+kit&qid=1776008712&sprefix=espresso+martini+kit%2Caps%2C1175&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=41f4e893f1df165f058706118238ca93&language=en_US&ref_=as_li_ss_tl",
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
            url: "https://www.amazon.com/Fellow-Stagg-Electric-Gooseneck-Kettle/dp/B0BF7DXLBF?crid=3OIMZOVWJNRXA&dib=eyJ2IjoiMSJ9.kgh-95Gmn8iXvGBVrnDCwGYdH7kyBSsJUYSbIVGugVCU7ykZcZ0-q8ZTxnprn2nesd4fsNV_4UiRsDLDcPu1nuvbXkS6XfxBYeCJWnCZNySX3ROQ16gqFvjhH6z7ILy9uNJneHAeZ-EURmTnfhcBHi1agw-0Yowqwh1-gaAd0hUiyGkRSlcokxhkMaszS00Se5RyIJox-GUC59jO6qfVHrdOmh4SPeFJEquaVa5fpgE.kK2UVqiZS6OHuJWy5OJI_lb5cQkTDQcuLCR7_NuLs&dib_tag=se&keywords=Fellow%2BStagg%2BEKG%2BElectric%2BPour-Over%2BKettle&qid=1776730622&s=handmade&sprefix=fellow%2Bstagg%2Bekg%2Belectric%2Bpour-over%2Bkettle%2Cspecialty-aps%2C433&sr=8-1&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=e5edc9a0e8e188c4b4cf4ce4ea95024b&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/61grHEIj7PL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      {
        type: "cta"
      },
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
        type: "cta"
      }
    ]
  }

  // Add more articles here as you build them
  // TEMPLATE:
  // {
  //   slug: "occasion-gifts-interest",
  //   title: "Title Here",
  //   excerpt: "Short summary",
  //   occasion: "birthday|valentines|anniversary|christmas|mothers_day|just_because|apology",
  //   interests: ["interest_name"],
  //   readTime: "4 min read",
  //   publishedAt: "2026-05-01",
  //   relatedArticles: ["slug1", "slug2"],
  //   sections: [...]
  // }
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