#!/usr/bin/env ts-node

// Usage:
//   npx ts-node scripts/generate-article.ts --occasion birthday --interest skincare
//   npx ts-node scripts/generate-article.ts --occasion valentines --interest coffee --stage committed

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] !== undefined ? args[idx + 1] : undefined;
}

const _occasion = getArg("--occasion");
const _interest = getArg("--interest");
const stage = getArg("--stage") ?? (_occasion === "mothers_day" ? "committed" : "dating");

if (!_occasion || !_interest) {
  console.error(
    "Usage: npx ts-node scripts/generate-article.ts --occasion <occasion> --interest <interest> [--stage <stage>]"
  );
  process.exit(1);
}

// Type-narrow to string after the exit guard above
const occasion: string = _occasion;
const interest: string = _interest;

const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Pick helpers ─────────────────────────────────────────────────────────────

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

function generateSlug(occ: string, int: string): string {
  return `${occ}-gifts-${int}`;
}

// ─── Title ───────────────────────────────────────────────────────────────────

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  valentines: "Valentine's Day",
  anniversary: "Anniversary",
  christmas: "Christmas",
  mothers_day: "Mother's Day",
  just_because: "Surprise",
  apology: "Apology",
};

const INTEREST_LABELS: Record<string, string> = {
  coffee: "Coffee-Obsessed",
  skincare: "Loves Skincare",
  hiking: "Loves Hiking",
  cooking: "Loves Cooking",
  reading: "Loves Reading",
  yoga: "Into Yoga",
  art: "Artsy",
  photography: "Into Photography",
  gardening: "Loves Gardening",
  gaming: "a Gamer",
  fitness: "Fitness-Obsessed",
  travel: "Loves Travel",
  wine: "Wine-Loving",
  baking: "Loves Baking",
  music: "Music-Loving",
  fashion: "Fashion-Forward",
  wellness: "Wellness-Obsessed",
  home_decor: "a Candle & Home Lover",
  pets: "a Pet Mom",
};

const STAGE_LABELS: Record<string, string> = {
  new:         "Someone You Just Started Dating",
  dating:      "Girlfriend",
  serious:     "Girlfriend",
  committed:   "Wife",
  complicated: "Partner",
};

function generateTitle(occ: string, int: string, stg: string): string {
  const occasionLabel =
    OCCASION_LABELS[occ] ??
    occ.charAt(0).toUpperCase() + occ.slice(1).replace(/_/g, " ");
  const interestLabel =
    INTEREST_LABELS[int] ??
    `Loves ${int.charAt(0).toUpperCase() + int.slice(1).replace(/_/g, " ")}`;
  const personLabel = STAGE_LABELS[stg] ?? "Girlfriend";

  if (occ === "apology") {
    return `Apology Gifts for Your ${personLabel} (That Actually Feel Sincere)`;
  }
  if (occ === "just_because") {
    return `Surprise Gifts for a ${personLabel} Who ${interestLabel}`;
  }

  return pick([
    `${occasionLabel} Gifts for a ${personLabel} Who ${interestLabel}`,
    `${occasionLabel} Gift Ideas for a ${personLabel} Who ${interestLabel}`,
    `What to Get a ${personLabel} Who ${interestLabel} for ${occasionLabel}`,
  ]);
}

// ─── Excerpt ─────────────────────────────────────────────────────────────────

function generateExcerpt(occ: string, int: string, stg: string): string {
  const occLabel =
    OCCASION_LABELS[occ] ??
    occ.charAt(0).toUpperCase() + occ.slice(1).replace(/_/g, " ");
  const personLabel = (STAGE_LABELS[stg] ?? "girlfriend").toLowerCase();
  return pick([
    `Curated ${occLabel} gift ideas for a ${personLabel} who's into ${int} — each one with an explanation of why it works.`,
    `Not sure what to get her for ${occLabel}? These ${int}-inspired picks actually feel personal.`,
    `${occLabel} gifts matched to her love of ${int}, ranked by how thoughtful they'll feel.`,
  ]);
}

// ─── Why heading ─────────────────────────────────────────────────────────────

function generateWhyHeading(occ: string, int: string): string {
  return pick([
    `Why ${int} gifts need extra thought`,
    `The ${int} gifting trap (and how to avoid it)`,
    `What most guys get wrong about ${int} gifts`,
  ]);
}

// ─── Why section body ────────────────────────────────────────────────────────

function generateWhySection(occ: string, int: string): string {
  const occLabel = (OCCASION_LABELS[occ] ?? occ).toLowerCase();
  return pick([
    `Buying a ${occLabel} gift for someone who's into ${int} sounds straightforward — but the wrong pick can feel generic or lazy. The best gifts in this space connect to how she actually engages with ${int}, not just the category label.`,
    `The temptation is to search '${int} gift' and buy the first thing with good reviews. But she can do that herself. What makes a gift land is the signal that you understand what ${int} means to her specifically — not just that she's into it.`,
    `Most ${int} gifts miss because they're too obvious — the thing everyone buys. The picks above are chosen to match her interest without being the predictable choice.`,
  ]);
}

// ─── Presentation tips ───────────────────────────────────────────────────────

function generatePresentationTips(occ: string): string {
  const tips: Record<string, string> = {
    birthday:
      "Birthday gifts hit different when they feel considered, not last-minute. If it arrives in Amazon packaging, rewrap it. A handwritten note — even two sentences — elevates any gift.",
    valentines:
      "Valentine's gifts are as much about the moment as the object. Present it at home, not at a restaurant. No pressure, no audience. Let the gift do the talking.",
    anniversary:
      "Anniversary gifts should reference your shared history. Mention a specific memory when you give it — that context is what separates a great gift from a good product.",
    christmas:
      "Christmas gifts get lost in the pile. Consider giving yours separately — maybe Christmas Eve, or a quiet moment before the family gathering. It deserves its own moment.",
    mothers_day:
      "Mother's Day gifts land best when paired with an experience — breakfast in bed, a quiet morning, or just handling everything for the day so she doesn't have to.",
    apology:
      "Apology gifts should arrive without fanfare. Don't make a production of it. Hand it to her quietly, say what you need to say, and let the gesture speak.",
    just_because:
      "Surprise gifts work best when they're truly unexpected. Don't announce it — just leave it where she'll find it, or hand it to her mid-conversation with no buildup.",
  };
  return (
    tips[occ] ??
    "How you give it matters as much as what you give. A handwritten note — even just a few honest words — makes any gift feel intentional."
  );
}

// ─── Category diversity selection ────────────────────────────────────────────

function selectDiverseGifts(gifts: any[], max: number): any[] {
  const selected: any[] = [];
  const typeCounts: Record<string, number> = {};
  for (const g of gifts) {
    if (selected.length >= max) break;
    const types = g.gift_type || g.categories || [];
    const dominated = types.some(
      (t: string) => (typeCounts[t] || 0) >= 2
    );
    if (dominated && selected.length < max - 1) continue;
    selected.push(g);
    types.forEach((t: string) => {
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
  }
  return selected;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  try {
    const response = await fetch(`${backendUrl}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        occasion,
        relationship_stage: stage,
        vibe: [],
        max_price: 200,
        confidence: "confident",
        archetypes: [],
        interests: [interest],
        overlap_interests: [],
        k: 7,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Backend returned ${response.status}: ${body}`);
      process.exit(1);
    }

    const data = (await response.json()) as any;
    const rawGifts: any[] = data.gifts ?? [];

    if (rawGifts.length === 0) {
      console.error(
        `Backend returned no gifts for ${occasion} + ${interest}. Try a different combination or check your gift database.`
      );
      process.exit(1);
    }

    const diverseGifts = selectDiverseGifts(rawGifts, 5);

    const article = {
      slug: generateSlug(occasion, interest),
      title: generateTitle(occasion, interest, stage),
      excerpt: generateExcerpt(occasion, interest, stage),
      occasion,
      interests: [interest],
      readTime: "4 min read",
      publishedAt: new Date().toISOString().split("T")[0],
      sections: [
        {
          type: "picks",
          gifts: diverseGifts.map((g: any) => ({
            name: g.display_name || g.name,
            price: `$${Number(g.price).toFixed(2)}`,
            reason: g.reason || "A strong match for her interests.",
            url: g.product_url || "#",
            image_url: g.image_url || undefined,
          })),
        },
        { type: "cta" },
        {
          type: "text",
          heading: generateWhyHeading(occasion, interest),
          body: generateWhySection(occasion, interest),
        },
        {
          type: "text",
          heading: "Making it land",
          body: generatePresentationTips(occasion),
        },
        { type: "cta" },
      ],
    };

    console.log("// Add this object to SAMPLE_ARTICLES in content/articles.ts");
    console.log(JSON.stringify(article, null, 2));

    console.log("\n// SUGGESTED RELATED ARTICLES:");
    console.log("// Same occasion, different interest:");
    console.log(`//   ${occasion}-gifts-cooking`);
    console.log(`//   ${occasion}-gifts-reading`);
    console.log(`//   ${occasion}-gifts-wellness`);
    console.log("// Same interest, different occasion:");
    console.log(`//   valentines-gifts-${interest}`);
    console.log(`//   christmas-gifts-${interest}`);

    console.log("\n// Remember to:");
    console.log("// 1. Review gift reasons for quality and tone");
    console.log("// 2. Verify Amazon URLs are correct");
    console.log("// 3. Add to SAMPLE_ARTICLES array in articles.ts");
    console.log(
      "// 4. Generate the suggested related articles for internal linking"
    );
  } catch (error: any) {
    const msg: string = error?.message ?? String(error);
    const isConnRefused =
      error?.cause?.code === "ECONNREFUSED" ||
      error?.code === "ECONNREFUSED" ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("fetch failed");
    if (isConnRefused) {
      console.error(
        `Could not connect to backend at ${backendUrl}. Make sure it's running.`
      );
    } else {
      console.error(msg);
    }
    process.exit(1);
  }
}

main();