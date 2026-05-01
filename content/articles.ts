export type GiftPick = {
  name: string;
  price: string;
  reason: string;
  url: string;
};

export type ArticleSection =
  | {
      type: "text";
      heading?: string;
      body: string;
    }
  | {
      type: "picks";
      gifts: GiftPick[];
    }
  | {
      type: "cta";
    };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  occasion: string;
  interests: string[];
  readTime: string;
  publishedAt: string;
  sections: ArticleSection[];
};

export const SAMPLE_ARTICLES: Article[] = [
  {
    slug: "birthday-gifts-girlfriend-skincare",
    title: "Birthday Gifts for a Girlfriend Who Loves Skincare",
    excerpt:
      "She's particular about what goes on her skin — which means you can't just grab anything off a shelf. Here's how to get it right.",
    occasion: "birthday",
    interests: ["skincare"],
    readTime: "4 min read",
    publishedAt: "2026-04-15",
    sections: [
      {
        type: "picks",
        gifts: [
          {
            name: "TONYMOLY I'm Real Sheet Mask Box Set",
            price: "$45",
            reason:
              "Sheet masks are the one skincare product that never conflicts with what she already owns — they're a standalone ritual, not part of a routine. A luxury set signals that you put thought into it, and the variety means she gets to pick her mood.",
            url: "https://www.amazon.com/s?k=luxury+face+mask+gift+set",
          },
          {
            name: "Jade Roller & Gua Sha Facial Tool Set",
            price: "$25",
            reason:
              "These sit beautifully on a bathroom shelf and feel like a spa upgrade even when she's doing her normal routine. It's a gift that communicates 'I want you to feel taken care of' without being overly personal or intimate.",
            url: "https://www.amazon.com/s?k=jade+roller+gua+sha+set",
          },
          {
            name: "Cooluli Mini Skincare Refrigerator",
            price: "$55",
            reason:
              "If she hasn't bought one for herself, this is the gift that makes her wonder how she lived without it. A skincare fridge keeps certain products more effective and makes her morning routine feel a little more curated — it's the kind of upgrade she'd love but wouldn't prioritise buying.",
            url: "https://www.amazon.com/s?k=skincare+mini+fridge",
          },
        ],
      },
      {
        type: "text",
        heading: "Why skincare gifts are tricky",
        body: "The problem with most skincare gift guides is that they default to whatever's trending — a product that's everywhere right now, regardless of whether it actually suits your girlfriend. Skincare is personal. The wrong texture, the wrong formula, or even just the wrong brand aesthetic can make a gift feel generic rather than considered. What she really wants is evidence that you were thinking about her specifically.",
      },
      {
        type: "text",
        heading: "Our approach",
        body: "The picks above and below are chosen because they feel luxurious without requiring you to know her exact routine. They're the kind of things she'll genuinely use — treats that sit on top of a skincare routine rather than disrupting it. Each one comes with a plain-English explanation of why it works as a birthday gift, so you know what you're giving and why.",
      },
      {
        type: "cta",
      },
      {
        type: "text",
        heading: "Beyond the products",
        body: "How you present it matters almost as much as what's inside. Wrap it simply — a white box, tissue paper, and a ribbon beats a plastic gift bag every time. Add a handwritten note that's specific: not 'hope you like it' but something that shows you chose it for her. Even one sentence — 'I know you love your skin routine so I wanted to add something to it' — lands differently than no note at all. The presentation is part of the gift.",
      },
      {
        type: "picks",
        gifts: [
          {
            name: "Lush Bath Bomb Gift Set",
            price: "$30",
            reason:
              "Bath bombs are a low-risk, high-reward gift for someone who values their self-care time. A curated set feels more special than a single product, and they're the kind of thing she'll actually look forward to using rather than saving for a special occasion.",
            url: "https://www.amazon.com/s?k=luxury+bath+bomb+gift+set",
          },
          {
            name: "Mulberry Silk Pillowcase",
            price: "$40",
            reason:
              "A silk pillowcase is one of those gifts that feels indulgent but has a real use-case she probably already knows about — better for skin, better for hair. It's thoughtful without being high-effort to find, and it's something she'll use every single night.",
            url: "https://www.amazon.com/s?k=mulberry+silk+pillowcase",
          },
        ],
      },
      {
        type: "cta",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return SAMPLE_ARTICLES.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return SAMPLE_ARTICLES;
}
