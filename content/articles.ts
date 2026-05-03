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
  }, // <--- THIS COMMA IS CRUCIAL

  // ============================================================================
  // MOTHER'S DAY GIFTS — COOKING
  // ============================================================================
  {
  "slug": "mothers_day-gifts-cooking",
  "title": "5 Best Mother’s Day Gifts for Wives Who Love to Cook",
  "excerpt": "Curated mothers_day gift ideas for a wife who's into cooking — each one with an explanation of why it works.",
  "occasion": "mothers_day",
  "interests": [
    "cooking"
  ],
  "readTime": "4 min read",
  "publishedAt": "2026-05-03",
  "sections": [
    {
      "type": "picks",
      "gifts": [
        {
          "name": "Pyramid Tea Collection - 24 Organic",
          "price": "$59.00",
          "reason": "This collection offers your girlfriend a cozy and sentimental way to unwind and enjoy a moment of self-care. It's a thoughtful gift that says you recognize her hard work and want her to relax.",
          "url": "https://www.amazon.com/Teabloom-Pyramid-Collection-Varieties-Certified/dp/B09MF37R3J?content-id=amzn1.sym.07299ac0-0d3c-4c5f-bbc6-00cc13939247%3Aamzn1.sym.07299ac0-0d3c-4c5f-bbc6-00cc13939247&crid=1S6CZFCGDQGGP&cv_ct_cx=Luxury%2BTea%2BSampler%2BChest&keywords=Luxury%2BTea%2BSampler%2BChest&pd_rd_i=B09MF37R3J&pd_rd_r=c7818d4a-9c65-4bbc-93b5-a365e3611c2b&pd_rd_w=prVmN&pd_rd_wg=xNxve&pf_rd_p=07299ac0-0d3c-4c5f-bbc6-00cc13939247&pf_rd_r=1B6JK4QDD1NFQA5QHKE0&qid=1773536332&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=luxury%2Btea%2Bsampler%2Bchest%2Caps%2C218&sr=1-1-e169343e-09af-4d41-85b1-8335fe8f32d0-spons&aref=UAgiUjLqNL&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=30963ab55315d223aa4e7b7645977e77&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/51HQaiawuCL._SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Complete Glass Tea Set with Infuser",
          "price": "$63.00",
          "reason": "This elegant tea set will definitely provide your girlfriend with an opportunity to indulge in a luxurious tea experience. It's not just a gift; it’s an invitation for her to take a break and enjoy some quality time for herself.",
          "url": "https://www.amazon.com/dp/B01IFBPX7A",
          "image_url": "https://m.media-amazon.com/images/I/71imBu7dydL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Gourmet Olive Oil Set",
          "price": "$43.00",
          "reason": "Your girlfriend deserves to feel appreciated for all her culinary efforts, and this olive oil sampler allows her to explore new flavors without the effort of buying them herself. It’s a thoughtful way to enhance her cooking while letting her know you value her passions.",
          "url": "https://www.amazon.com/Thoughtfully-Sampler-Flavors-Include-Chipotle/dp/B08TDZVQDM?crid=23RDG83403FX6&dd=K4QnWBIoK6UMnHrJOE_yw9NGzeC2M1AGI-JCm90QnS4%2C&ddc_refnmnt=free&dib=eyJ2IjoiMSJ9.WUNJLGxoRUgSi9-GvzZpUROpb-_sEiyIglpAmzE_OgpAzK5X1VBsC3HjPbT1Y6e2q5SIJHqowQX4qxC7DiZdgsy237x1nKwQFTYS-Y3X0THXWcIH_VAH-GrVip_2snDoWrmFV74aqj1vxQl2VyrjaYGpyyw9Zw_2E4IN6tn-s4ZD8yt6fRo1bYCsN8LoElFvCA_H_Yr-n8PnKjLfnKf1x217rQODDt_js0XcogpXG7A.EEfKw-egu2NW4FlEiBqmyj6dA6wEADQlxyBoI4N9Ssk&dib_tag=se&keywords=gourmet+olive+oil+set&qid=1775435704&s=samedaystore&sprefix=gourmet+olive+oil+set%2Csamedaystore%2C185&sr=1-1&linkCode=ll2&tag=cbggiftapp637-20&linkId=06f300d79e895b98bcb38bb1586943d4&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/81rEVc-M7PL._SL1500_.jpg"
        },
        {
          "name": "Date Night Ideas Couples Game",
          "price": "$29.99",
          "reason": "This gift speaks to the importance of connection in your serious relationship and encourages both of you to take a break from the daily grind. By making date nights easier, you’re showing your girlfriend that you want to create special moments together.",
          "url": "https://www.amazon.com/Mini-Dates-Meaningful-Original-Scratch-Off/dp/B0BX4SQHW5?pd_rd_w=l6Cgj&content-id=amzn1.sym.6640a844-ab24-4352-ac9b-78899e683a5e&pf_rd_p=6640a844-ab24-4352-ac9b-78899e683a5e&pf_rd_r=HZ8AKAEGZVGGDB8NC5GF&pd_rd_wg=pVja1&pd_rd_r=01f359d7-3f5d-4767-8397-39c8c006616a&pd_rd_i=B0BX4SQHW5&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=a0b1ebd3cf363a6cb50ef1cb088e15f6&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/61ZDzTRTHDL._AC_SX679_.jpg"
        },
        {
          "name": "Date Night Scratch-Off Adventure Book",
          "price": "$42.00",
          "reason": "This book not only offers fun and romantic experiences for you both to share, but it also highlights the importance of making time for each other. Your girlfriend will appreciate this thoughtfulness in nurturing your relationship.",
          "url": "https://www.amazon.com/Date-Night-Book-Scratch-Off-Anniversary/dp/B0C7WFJRS6?crid=13XNMGEIBS0Z7&dib=eyJ2IjoiMSJ9.uRQ8iM56V6PgulWyD81ojOYNafJyJW0ZlQdbx-9ELytMTfSZA-BKtooutEtZPf9sKxp-AT7g7v2tyeVxeP66yDawsSHkXAWWi0cNaBNbIm78rIPRcwy5hk7T26BwKIvv3uF-yaEwCntbg8PI08rswKRSWM4qiig2wCTQnZsABXC9vpEMrClyW_nGLv2qUhEenvyxDwrjBQ6J8aMDov4NcYiA2FObMJI6VYI1H-3t6X4.fKUDVYJbJUMcnqI9T8_0c5YW8eHyCKIWAD-7p66hQHY&dib_tag=se&keywords=Couples+Adventure+Challenge+Book&qid=1773534770&sprefix=couples+adventure+challenge+book%2Caps%2C271&sr=8-4&linkCode=ll2&tag=cbggiftapp637-20&linkId=b498b3b9fbcba3f1fb6ad25e72b37db4&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/519A-wlTT5L._AC_SY300_SX300_QL70_FMwebp_.jpg"
        }
      ]
    },
    {
      "type": "cta"
    },
    {
      "type": "text",
      "heading": "The cooking gifting trap (and how to avoid it)",
      "body": "Buying a mothers_day gift for someone who's into cooking sounds straightforward — but the wrong pick can feel generic or lazy. The best gifts in this space connect to how she actually engages with cooking, not just the category label."
    },
    {
      "type": "text",
      "heading": "Making it land",
      "body": "Mother's Day gifts land best when paired with an experience — breakfast in bed, a quiet morning, or just handling everything for the day so she doesn't have to."
    },
    {
      "type": "cta"
    }
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