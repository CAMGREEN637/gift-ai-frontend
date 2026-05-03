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
            url: "https://www.amazon.com/HIBREW-H10B-Temperature-Adjustable-Intelligent/dp/B0DLP26373?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71CeX2VA0+L._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "World Coffee Discovery Set - 8-Pack",
            price: "$59.00",
            reason: "A coffee sampler like this shows you've put thought into offering your girlfriend a fun and cozy experience on her birthday. It's a unique way to celebrate her and let her explore different flavors as part of her special day.",
            url: "https://www.amazon.com/dp/B09GZSQMRJ?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/51BxEaYF-+L._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "6-Cup Pour-Over Glass Coffeemaker",
            price: "$47.00",
            reason: "The Chemex Pour-Over Coffeemaker offers a cozy, thoughtful way for your girlfriend to enjoy her coffee experience, making it an ideal birthday gift.",
            url: "https://www.amazon.com/dp/B0000YWF5E?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71oMA36JxfL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      { type: "cta" }
    ]
  },
  {
    slug: "practical-mothers-day-gifts-new-moms",
    title: "The Essentials: Practical Mother's Day Gifts for New Moms",
    excerpt: "New motherhood is a whirlwind. These practical gift ideas focus on utility, convenience, and making those first few months just a little bit easier.",
    occasion: "mothers_day",
    interests: ["parenting", "lifestyle", "tech"],
    readTime: "5 min read",
    publishedAt: "2026-05-03",
    sections: [
      {
        type: "text",
        heading: "Gifts that actually help",
        body: "For a new mom, the most thoughtful gift is often one that solves a problem. Whether it's keeping her coffee hot or helping her stay hydrated while juggling a newborn, these picks are all about supporting her daily rhythm during this transition."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "Ember Temperature Control Smart Mug 2",
            price: "$129.95",
            reason: "Between feedings and diaper changes, coffee almost always goes cold. This smart mug keeps her drink at the perfect temperature for hours, ensuring she finally gets to finish a hot cup.",
            url: "https://www.amazon.com/dp/B07XJK9S59?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/51pI-E-A79L._AC_SL1000_.jpg"
          },
          {
            name: "Stanley Quencher H2.0 FlowState Tumbler",
            price: "$45.00",
            reason: "Hydration is vital for new moms, especially those breastfeeding. This massive, cup-holder-friendly tumbler makes it easy to hit daily water goals with one hand while holding a baby.",
            url: "https://www.amazon.com/dp/B0BHTN9X8N?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/61f9Vp-1LmL._AC_SL1500_.jpg"
          },
          {
            name: "Hatch Restore 2 Sunrise Alarm Clock",
            price: "$199.99",
            reason: "Sleep is a precious commodity. The Hatch helps Mom maximize her rest by creating a soothing sleep environment and waking her gently with light rather than a jarring phone alarm.",
            url: "https://www.amazon.com/dp/B0BC9N5B9G?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/61Nl-m9KlbL._AC_SL1500_.jpg"
          },
          {
            name: "Lululemon Everywhere Belt Bag",
            price: "$38.00",
            reason: "When she's out with a stroller, having her phone and keys easily accessible is a game-changer. This bag is trendy, durable, and keeps her essentials hands-free.",
            url: "https://shop.lululemon.com/p/bags/Everywhere-Belt-Bag/_/prod8900747",
            image_url: "https://images.lululemon.com/is/image/lululemon/LU9BYQS_0001_1"
          },
          {
            name: "Frida Mom Postpartum Recovery Kit",
            price: "$99.99",
            reason: "It might not be glamorous, but it is one of the most useful things a new mom can own. It provides all the physical recovery essentials she needs but might not think to buy for herself.",
            url: "https://www.amazon.com/dp/B07TKXKWLY?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/81M7-N-3vXL._SL1500_.jpg"
          },
          {
            name: "Kindle Paperwhite",
            price: "$149.99",
            reason: "The Kindle is perfect for one-handed reading during late-night feedings. The adjustable warm light is easy on the eyes and won't wake a sleeping baby.",
            url: "https://www.amazon.com/dp/B08KTZ8249?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/51H-x942qfL._AC_SL1000_.jpg"
          },
          {
            name: "Keurig K-Mini Single Serve Coffee Maker",
            price: "$99.99",
            reason: "Space and time are at a premium. This tiny brewer fits anywhere and makes a fresh cup in minutes—ideal for those mornings when she needs caffeine immediately.",
            url: "https://www.amazon.com/dp/B07GZ6S3KB?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71Yy8I0M1SL._AC_SL1500_.jpg"
          },
          {
            name: "Loop Quiet Earplugs",
            price: "$24.95",
            reason: "These help dampen overstimulating noise without completely blocking out the sounds she needs to hear. Great for focus or for catching a 20-minute nap while a partner is on baby duty.",
            url: "https://www.amazon.com/dp/B08MFDT65P?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/51Gv4-WbKxL._AC_SL1200_.jpg"
          },
          {
            name: "Bio-Oil Skincare Oil",
            price: "$13.00",
            reason: "A simple, highly effective staple for postpartum skincare. It's a small but meaningful way to help Mom feel like herself again during her daily routine.",
            url: "https://www.amazon.com/dp/B004E9S69A?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71-0jR5x2iL._SL1500_.jpg"
          },
          {
            name: "YETI Camino 35 Carryall Tote Bag",
            price: "$150.00",
            reason: "This bag is indestructible and waterproof. It's the ultimate 'everything' bag for a new mom—perfect for park trips, beach days, or just lugging extra supplies in the car.",
            url: "https://www.amazon.com/dp/B08VMTVQW9?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/81vXvXv7VPL._AC_SL1500_.jpg"
          }
        ]
      },
      {
        type: "text",
        heading: "Making the choice",
        body: "When choosing a gift for a new mom, think about the parts of her day that feel the most chaotic. A little bit of utility can go a long way in making her feel seen and supported."
      },
      { type: "cta" }
    ]
  },

  // ============================================================================
  // MOTHER'S DAY GIFTS — RELAXATION
  // ============================================================================
  {
    slug: "top-relaxation-gifts-mothers-day",
    title: "Top 10 Relaxation Gifts for a Stress-Free Mother's Day at Home",
    excerpt: "Help Mom turn her home into a sanctuary with these curated relaxation essentials, from high-end robes to soothing aromatherapy.",
    occasion: "mothers_day",
    interests: ["wellness", "skincare", "home_decor"],
    readTime: "6 min read",
    publishedAt: "2026-05-03",
    sections: [
      {
        type: "text",
        heading: "Why 'Stress-Free' is the ultimate Mother's Day gift",
        body: "Mother's Day is often busy with brunches and outings, but sometimes the best thing you can give a mom is permission to do absolutely nothing. These gifts are designed to help her reclaim her space and find a moment of peace without leaving the house."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "Barefoot Dreams CozyChic Adult Robe",
            price: "$138.00",
            reason: "Widely considered the gold standard for comfort, this robe is a luxury staple that makes every morning feel like a spa visit. It's perfect for the mom who deserves to feel pampered daily.",
            url: "https://www.amazon.com/gp/aw/d/B0FFHS6PXG?_encoding=UTF8&pd_rd_plhdr=t&aaxitk=92bfaf59a6b2b0ba3a46ec07b8d5be6b&hsa_cr_id=0&qid=1776648173&sr=1-1-9e67e56a-6f64-441f-a281-df67fc737124&pd_rd_w=QellE&content-id=amzn1.sym.2fb72bc8-96ef-420d-b08f-c04b69f36507%3Aamzn1.sym.2fb72bc8-96ef-420d-b08f-c04b69f36507&pf_rd_p=2fb72bc8-96ef-420d-b08f-c04b69f36507&pf_rd_r=3AAVKQF8QTQWK3YM0DBM&pd_rd_wg=kfBmQ&pd_rd_r=7143192c-12f6-45dd-8dc8-50d5cb571905&th=1&psc=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=19b275d0af4f654278195b58b65c7cf0&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/81kqgtaCEkL._AC_SY445_SX342_QL70_FMwebp_.jpg"
          },
          {
            name: "Shiatsu Back Shoulder and Neck Massager with Heat",
            price: "$45.00",
            reason: "This deep-tissue massager is a practical way to help Mom work out the tension of a long week. The added heat function makes it a cozy, thoughtful addition to her relaxation routine.",
            url: "https://www.amazon.com/dp/B07G142F9Z?th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=cf73fab08bd2334453804e1bfa6bf1c9&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/71fdZ-Ei0tL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "ASAKUKI Smart WiFi Essential Oil Diffuser",
            price: "$32.00",
            reason: "Creating a calming atmosphere is key to stress relief. This smart diffuser allows Mom to set schedules and control the vibe of her room directly from her phone or via voice control.",
            url: "https://www.amazon.com/dp/B07DH4ZSDF?ascsubtag=%5Bartid%7C10049.g.69275335%5Bsrc%7Cmgu_bg_cos_d_bm_comm_org_us_g13602855%5Buuid%7C964c00cb990844d49e2f93c4693d1a80&asc_source=bing&asc_campaign=mgu_bg_cos_d_bm_comm_org_us_g13602855&asc_refurl=https%3A%2F%2Fwww.cosmopolitan.com%2Fstyle-beauty%2Ffashion%2Fg69275335%2Fgift-ideas-for-women%2F&th=1&linkCode=ll2&tag=cbggiftapp637-20&linkId=c18301597d6f4c3e886f68ef830b08d4&language=en_US&ref_=as_li_ss_tl",
            image_url: "https://m.media-amazon.com/images/I/61kUIZamPwL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "UGG Euphoria Faux Fur Throw Blanket",
            price: "$54.00",
            reason: "There is nothing quite like an UGG blanket for ultimate coziness. It's an elegant, high-quality gift that upgrades any couch or bed into a dedicated relaxation spot.",
            url: "https://www.amazon.com/dp/B07WRDL2VZ?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71bO9GhO3PL._AC_SX300_SY300_QL70_FMwebp_.jpg"
          },
          {
            name: "Lizush Luxury 15-Piece Spa Gift Basket",
            price: "$139.00",
            reason: "This all-in-one set takes the guesswork out of a spa day. With 15 different lavender-scented pieces, it provides Mom with everything she needs for a complete self-care ritual at home.",
            url: "https://www.amazon.com/Lizush-Piece-Complete-Luxury-Women/dp/B088ZHBX22?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/513jKGDIIYL._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Blissy 100% Pure Mulberry Silk Pillowcase",
            price: "$82.46",
            reason: "A silk pillowcase is a gift that keeps giving, benefiting both hair and skin while providing a cool, luxe feel every night. It's a simple upgrade that feels incredibly indulgent.",
            url: "https://www.amazon.com/Blissy-Silk-Pillowcase-Mulberry-High-Grade/dp/B0CB5H5FK9?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71OLg-ScWGL._AC_SL1500_.jpg"
          },
          {
            name: "Nodpod Weighted Silk Sleep Mask",
            price: "$68.00",
            reason: "Using gentle pressure to promote deep sleep, this weighted mask is a game-changer for moms who struggle to switch off. The strap-free design is unique and incredibly comfortable.",
            url: "https://www.amazon.com/Pressure-Patented-Blocking-Sleeping-Relaxation/dp/B0BY39RY2R?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/61IaMVtP-sL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Organic Bath Bombs Spa Gift Set",
            price: "$35.99",
            reason: "These USA-made bath bombs use natural ingredients to turn an ordinary bath into a therapeutic experience. It's a classic Mother's Day gift that never fails to deliver a moment of peace.",
            url: "https://www.amazon.com/Organic-Natural-Ingredients-Mothers-Relaxing/dp/B00W2EH98I?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/81b7juZJqhL._SL1500_.jpg"
          },
          {
            name: "Tatcha The Starter Ritual Skincare Set",
            price: "$95.00",
            reason: "Tatcha is known for turning skincare into a meditative ritual. This set provides a high-end, introductory experience to one of the most respected names in beauty.",
            url: "https://www.amazon.com/Tatcha-Starter-Ritual-Set-Introductory/dp/B0F9BMZ5Z7?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/61PA8xpdCGL._SL1200_.jpg"
          },
          {
            name: "Teabloom Complete Glass Tea Set",
            price: "$63.00",
            reason: "Watching a flowering tea bloom is a relaxation exercise in itself. This set combines the beauty of tea art with the comfort of a warm drink, making it a wonderful 'me-time' companion.",
            url: "https://www.amazon.com/dp/B01IFBPX7A?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71imBu7dydL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
      },
      {
        type: "text",
        heading: "The finishing touch",
        body: "Pair any of these with a quiet morning where she doesn't have to check a single item off her to-do list. That is the real magic of a stress-free Mother's Day."
      },
      { type: "cta" }
    ]
  },

  // ============================================================================
  // MOTHER'S DAY GIFTS — LUXURY WELLNESS
  // ============================================================================
  {
    slug: "mothers-day-gifts-luxury",
    title: "Luxury Mother's Day Gifts That Actually Feel Worth It",
    excerpt: "High-end Mother's Day gifts that feel intentional, not just expensive.",
    occasion: "mothers_day",
    interests: ["wellness", "home_decor", "skincare", "cooking"],
    readTime: "5 min read",
    publishedAt: "2026-05-03",
    relatedArticles: [
      "mothers-day-gifts-relaxation",
      "mothers-day-gifts-new-moms",
      "birthday-gifts-skincare",
      "christmas-gifts-home"
    ],
    sections: [
      {
        type: "text",
        heading: "What most people get wrong about luxury gifts",
        body: "Spending more doesn't automatically make a gift better. The mistake most people make is choosing something expensive that still feels generic. The best luxury gifts feel like an upgrade to her everyday life—something she wouldn't buy for herself, but ends up using constantly once she has it."
      },
      {
        type: "text",
        heading: "How to make a high-end gift actually land",
        body: "Luxury works when it feels intentional. Think about how she spends her time—relaxing, cooking, unwinding—and choose something that elevates that specific part of her routine. Even a premium gift can feel flat if it's not tied to how she actually lives day to day."
      },
      {
        type: "picks",
        gifts: [
          {
            name: "LifePro Infrared Sauna Blanket",
            price: "$293.95",
            reason: "This feels like a true lifestyle upgrade. It turns her home into a personal spa, making it perfect for a Mother's Day gift that prioritizes her relaxation and well-being in a way she likely wouldn't invest in herself.",
            url: "https://www.amazon.com/LifePro-Far-Infrared-Sauna-Blanket/dp/B0BX7HLCYQ?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71+6dBgvlUL._AC_SX679_.jpg"
          },
          {
            name: "Le Creuset Enameled Cast Iron Dutch Oven (6.5 qt)",
            price: "$289.00",
            reason: "This is the kind of gift that lasts for years and gets used constantly. It elevates everyday cooking into something more intentional, making it a thoughtful pick if she enjoys time in the kitchen.",
            url: "https://www.amazon.com/Creuset-Enameled-Signature-Round-Artichaut/dp/B07RXBSWZZ?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/61NhCrCEh9L._AC_SX300_SY300_QL70_FMwebp_.jpg"
          },
          {
            name: "Coravin Wine Preservation System",
            price: "$279.00",
            reason: "This is a subtle but impressive upgrade. It lets her enjoy wine on her terms without committing to the whole bottle, which makes it feel both luxurious and genuinely useful.",
            url: "https://www.amazon.com/Coravin-Timeless-Three-Preservation-System/dp/B095BRZYP2?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71wEYWomDBL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "TheraGun Mini (3rd Generation)",
            price: "$219.00",
            reason: "A high-end self-care tool that actually gets used. It's perfect for relieving tension and stress, making it a practical luxury she'll appreciate regularly—not just on the day she opens it.",
            url: "https://www.amazon.com/dp/B0DV71V4R7?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71H1zckV0sL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Rodan + Fields Redefine Skincare Regimen",
            price: "$199.20",
            reason: "Instead of a single product, this gives her a full routine. That makes it feel more complete and intentional, which is what separates a luxury gift from a basic one.",
            url: "https://www.amazon.com/Rodan-Fields-Redefine-Appearance-Firmness/dp/B01LHPRZFE?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/51AHekjUOkL._SL1500_.jpg"
          },
          {
            name: "RENPHO Red Light Therapy Face Mask",
            price: "$179.00",
            reason: "This hits the sweet spot between tech and self-care. It feels modern, high-end, and slightly indulgent in a way that makes it stand out as a gift.",
            url: "https://www.amazon.com/dp/B0FJS8ZQWS?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/41AUc0hbRmL._SY300_SX300_QL70_FMwebp_.jpg"
          },
          {
            name: "Barefoot Dreams CozyChic Robe",
            price: "$138.00",
            reason: "This is everyday luxury done right. It's something she'll wear constantly, which makes the higher price feel justified every time she uses it.",
            url: "https://www.amazon.com/gp/aw/d/B0FFHS6PXG?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/81kqgtaCEkL._AC_SY445_SX342_QL70_FMwebp_.jpg"
          },
          {
            name: "Blissy Mulberry Silk Pillowcase",
            price: "$82.46",
            reason: "A smaller luxury that still feels premium. It improves sleep and feels noticeably different, making it a great add-on or standalone gift.",
            url: "https://www.amazon.com/Blissy-Silk-Pillowcase-Mulberry-High-Grade/dp/B0CB5H5FK9?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71OLg-ScWGL._AC_SL1500_.jpg"
          },
          {
            name: "Teabloom Complete Glass Tea Set",
            price: "$63.00",
            reason: "This is more about the experience than the object. It turns a simple routine into something calming and intentional, which makes it feel more thoughtful than its price suggests.",
            url: "https://www.amazon.com/dp/B01IFBPX7A?tag=cbggiftapp637-20",
            image_url: "https://m.media-amazon.com/images/I/71imBu7dydL._AC_SY300_SX300_QL70_FMwebp_.jpg"
          }
        ]
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