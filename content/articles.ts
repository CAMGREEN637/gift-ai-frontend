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
  // MOTHER'S DAY GIFTS — FITNESS
  // ============================================================================
{
  "slug": "mothers_day-gifts-fitness",
  "title": "5 Best Mother’s Day Gifts for Moms Who Love to Stay Active",
  "excerpt": "Not sure what to get her for Mother's Day? These fitness-inspired picks actually feel personal.",
  "occasion": "mothers_day",
  "interests": [
    "fitness"
  ],
  "readTime": "4 min read",
  "publishedAt": "2026-05-03",
  "sections": [
    {
      "type": "picks",
      "gifts": [
        {
          "name": "Shiatsu Neck and Back Massager with",
          "price": "$45.00",
          "reason": "This gift focuses on pampering, allowing your wife to unwind and enjoy some much-deserved relaxation. It’s a thoughtful way to acknowledge her hard work and let her know you see how much she juggles daily.",
          "url": "https://www.amazon.com/dp/B07G142F9Z",
          "image_url": "https://m.media-amazon.com/images/I/71fdZ-Ei0tL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "BOOST Smart Water Bottle 32oz",
          "price": "$46.00",
          "reason": "Choosing this smart water bottle adds a fun and thoughtful touch to your wife's daily routine. It shows you care about her wellness while making her life just a bit easier.",
          "url": "https://www.amazon.com/Reminder-BPA-Free-Stainless-Insulated-Tracker/dp/B0D479ZB2L?crid=2ADBEYGJS8OO6&dib=eyJ2IjoiMSJ9.NcnSz236mSprkeX4A2qXy4mK-hS6mdHPWsjmlPc9QPq7qysOzmy2Ava-HoXBRhLFIGkuRoiSx7wo-89VTErp-U9gf8nwYq4jFesY9FvUQHt6N5yIp8d7q7FCO2AJGiY7vShN4ZKejnmq0bkIAvJkyLqjsYgXMNlJ7zp78zVOcTDfQcFPvJFFVLxIH0wlb3LRRBhbVmyS2W01V71SGLo4PGOO7PY_30B-Iafzu6_kPC3j9GRbO4-508Q196iIgmFdblaDGdQYRYKxIYsS3Sx9S5Pb6vLkPKNZCDeW46hKEcE.yi_sBYcR-NsCF1PDFKvLhY6mMDJ-7UAJ-aPMcaMVNoM&dib_tag=se&keywords=smart%2Bwater%2Bbottle&qid=1776010057&sprefix=smart%2Bwater%2Bbottle%2Caps%2C327&sr=8-7&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=14aae9ebd86d64f726c2df4bec4a6e7d&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/61j0emHta6L._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Pilates Ring and Ball Kit",
          "price": "$32.00",
          "reason": "This Pilates kit provides a cozy and thoughtful way for your wife to take care of herself at home. It recognizes her need for relaxation and personal time, showing you want her to feel good and valued.",
          "url": "https://www.amazon.com/dp/B0FXJLMPXC",
          "image_url": "https://m.media-amazon.com/images/I/61fbS+zmvUL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Walking Treadmill with Incline",
          "price": "$169.00",
          "reason": "A treadmill offers a thoughtful way for your wife to stay active without leaving the comfort of home. This gift acknowledges her busy lifestyle while giving her a chance to enjoy some 'me time'.",
          "url": "https://www.amazon.com/FOUSAE-Treadmill-Treadmills-Brushless-Programs/dp/B0G91J48G6?crid=ATS0SJQBEQNA&dib=eyJ2IjoiMSJ9.Z_On5EJi1czlkPFukrY9UPQMahqLhbxEbo0HSzimxjIZ3qGrhjKMDpraBBVdvzJanGjDVVlYNWi5xP8pUlXWnL6wnQFpspsmMQ3lvEh4X5sh0LPXP-tdns8XaSc6kpqYFWLL7_qHElvxyW0t5UdG8iaUkaXcYEBsKnHEh5_KXi4KjUqBWAiBZyrVrrOcf8dl9nN_dPI4OC_eKyGZOkDBHjg40eL32fJJ6o3xcRIdC-Y.-QLc3pfeF2do59-vd-GFya1rxOr9K9vQ4ghS78psdGw&dib_tag=se&keywords=walking%2Bpad&qid=1776007000&sprefix=walking%2B%2Caps%2C1058&sr=8-7&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=5ce96a994faca90d59cf9d15328fb759&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/61-4fwbZMxL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Eco-Friendly Non-Slip Yoga Mat, 4.2mm",
          "price": "$164.00",
          "reason": "This luxurious yoga mat is perfect for creating a cozy space for your wife to practice self-care. It emphasizes relaxation and personal growth, reminding her that you appreciate her well-being.",
          "url": "https://www.amazon.com/dp/B01CGLCGRA",
          "image_url": "https://m.media-amazon.com/images/I/41jBqFTYZVL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        }
      ]
    },
    {
      "type": "cta"
    },
    {
      "type": "text",
      "heading": "Why fitness gifts need extra thought",
      "body": "The temptation is to search 'fitness gift' and buy the first thing with good reviews. But she can do that herself. What makes a gift land is the signal that you understand what fitness means to her specifically — not just that she's into it."
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
},
{
  "slug": "mothers_day-gifts-gardening",
  "title": "What to Get a Wife Who Loves Gardening for Mother's Day",
  "excerpt": "Mother's Day gifts matched to her love of gardening, ranked by how thoughtful they'll feel.",
  "occasion": "mothers_day",
  "interests": [
    "gardening"
  ],
  "readTime": "4 min read",
  "publishedAt": "2026-05-03",
  "sections": [
    {
      "type": "picks",
      "gifts": [
        {
          "name": "17-Pod Hydroponics Growing System",
          "price": "$109.00",
          "reason": "This thoughtful gift allows your wife to indulge in a hobby that can bring her joy while also providing a sense of accomplishment. It’s a delightful way to show her that you see how much she does and want her to take a moment for herself.",
          "url": "https://www.amazon.com/dp/B0CQN9Z2WD",
          "image_url": "https://m.media-amazon.com/images/I/818unoUl7-L._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "Pressed Flower Art Kit",
          "price": "$31.99",
          "reason": "This sentimental and cozy gift encourages your wife to engage in a creative activity that can provide a sense of calm and relaxation. It acknowledges her hard work and gives her the space to enjoy a soothing craft.",
          "url": "https://www.amazon.com/Aboofx-Pressing-Detailed-instruction-Preservation/dp/B0C7T7JWWM?crid=2HCE070Q0HIFC&dib=eyJ2IjoiMSJ9.XB-VrJgulguvzs3nesGKKRWz6j4S_kMlajLr13WaxMbYofz9UU-z3NQM2Z5d85yycWyPB4zfYvgCqnl9q5IG2wPzVCd6uFH65vvq6gHmqgfT7WtSnmFIVIRPyi6qEZrirRUNOe7trKme5lBLY94QXdwywBDZxv7znCis56btA0Hiarsgv7nLjJQ0N9_p3jAiqWKlDVsU24ZB8iIMsz40pDibNTT40wCvEWyTi1aZ0t8EnuDifq-ZmsmBsdlJokCrnvNNe0miPt2LkD0Vjycped_85u7zeAt9n5qGKwPDiDI.4qxEJl5PvfGhYEpf6GXC4Ex7CQ3MG7uoN2U0fHQFJbs&dib_tag=se&keywords=Pressed%2Bflower%2Bart%2Bkit&qid=1774735650&sprefix=pressed%2Bflower%2Bart%2Bkit%2Caps%2C414&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=ef0f8037debeb680b7fcc9d4c32713c5&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/91K6A7TnAuL._AC_SX679_.jpg"
        },
        {
          "name": "Complete Glass Tea Set with Infuser",
          "price": "$63.00",
          "reason": "This luxe gift provides your wife with an opportunity to unwind and enjoy a moment of tranquility with a beautiful tea experience. It’s a charming way to pamper her and remind her how much you appreciate everything she does.",
          "url": "https://www.amazon.com/dp/B01IFBPX7A",
          "image_url": "https://m.media-amazon.com/images/I/71imBu7dydL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "All-in-One Gardening Tool Set",
          "price": "$32.00",
          "reason": "This cozy and thoughtful gardening tool set reflects your understanding of your wife's efforts and passion for gardening, helping her to relax and enjoy her time outdoors. It shows her that you notice her interests and want to support her hobbies.",
          "url": "https://www.amazon.com/Scuddles-Stainless-Fingertip-Landscaping-Gardening/dp/B0761Z9MKM?crid=233CP1RI8QE95&dib=eyJ2IjoiMSJ9.PZYsXAh67pc8FLxZ6eEqRbK1JHv6SPVo7Td0vFgHKOipG12has7h_6fJck2rV60-_KYLmMbX03abogoVK4cfS3uSox7jj2tUXR_bLaRREUUdaIel9t63cccWkocN3qK8YdhDXgkKWAaDRFGwNKxkjJfDtcOxGS6l-D5P9hY-2WviXPWYKriff6r-CtL44lO9e99672sbjbrMuWGqtBJL2dxhDvUc9WYhpkOuwOLv67GjPMjq-bSkgv1_ttS6UGXVkka1wNDO01Pd40HHxn462I3_okPgzCsbFgFymDo9mIw.WS0zFpqvb9LkMPeHAJ2ghxBsItW6guh_9NUWy0FGU9s&dib_tag=se&keywords=Professional%2BGardening%2BTool%2BSet&qid=1773534318&sprefix=professional%2Bgardening%2Btool%2Bset%2Caps%2C271&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=6f8bfc9c48bad73de24200b7cba43254&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/81GQjPjFt+L._AC_SY300_SX300_QL70_FMwebp_.jpg"
        },
        {
          "name": "2-Person Outdoor Hammock with Stand",
          "price": "$199.00",
          "reason": "This fun and cozy gift gives your wife a perfect retreat to relax and enjoy some well-deserved rest, whether it’s in the backyard or on a weekend getaway. It’s a celebration of her dedication, providing her with a beautiful space to unwind.",
          "url": "https://www.amazon.com/Everyfun-Polyester-Adjustable-Portable-Carrying/dp/B0FMDYQFWZ?crid=36HYK0SHGY7X7&dib=eyJ2IjoiMSJ9.0gor6a9VZm3ZgdAABiXZ7ODlqrNSgiSM08dymlFeYNIsB4VUP5BKISSLrZhitGzQMKM-ecrVcJUB9deKw_C0qcVPMJWnuHI6ftK_N1IxvLApXgjjPw1LYmYtcd_LUy-Xa7Y33lcQmKYBBM992z-NotNhEqjxwCOKQtWSJJ2BZ6tyyw8KeyLznQOfNvBQ14XOsAAsg_w6BTm-g6uF2JzKOfJZ7wAUcfhKhQVcT74WnEzTNHaLNv2jXEZvKxQ27Ij2WmKvjKhsSQ0rK68Tkh7r4Ob3jW6ynxolioULRBGsHxk.2zSnS8VhzZTfAzKFad95DkjLerYCjq13p5XjfDLpNHo&dib_tag=se&keywords=Premium%2BCamping%2BHammock&qid=1772582431&sprefix=premium%2Bcamping%2Bhammock%2Caps%2C352&sr=8-5-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=54cebdefa34f457130d7e23b9edd316a&language=en_US&ref_=as_li_ss_tl",
          "image_url": "https://m.media-amazon.com/images/I/71ZI9Z7oIHL._AC_SY300_SX300_QL70_FMwebp_.jpg"
        }
      ]
    },
    {
      "type": "cta"
    },
    {
      "type": "text",
      "heading": "The gardening gifting trap (and how to avoid it)",
      "body": "The temptation is to search 'gardening gift' and buy the first thing with good reviews. But she can do that herself. What makes a gift land is the signal that you understand what gardening means to her specifically — not just that she's into it."
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