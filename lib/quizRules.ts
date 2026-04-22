// =============================================================================
// GIFT AI — QUIZ RULES
// All smart preselection logic for vibe, budget, and gift type guidance.
// These tables power the "Our read on this" recommendation cards in the quiz.
//
// BUDGET ALIGNMENT NOTE:
// All budget min/max values are aligned to the quiz price filter tiers:
//   Under $25 → max: 25
//   $25–$50   → max: 50
//   $50–$100  → max: 100
//   $100–$200 → max: 200
//   $200+     → max: 999999
// The display range shown to the user (e.g. "$50–$100") comes from the
// explanation string. The min/max values drive getBudgetOptionFromRange().
// =============================================================================

export type OccasionKey =
  | "birthday"
  | "valentines"
  | "anniversary"
  | "christmas"
  | "mothers_day"
  | "just_because"
  | "apology";

export type StageKey =
  | "new"
  | "dating"
  | "serious"
  | "committed"
  | "complicated";

export type VibeKey =
  | "pampering"
  | "romantic"
  | "sentimental"
  | "luxe"
  | "cozy"
  | "fun"
  | "thoughtful";

export type GiftTypeKey =
  | "tech"
  | "kitchen"
  | "home"
  | "fitness"
  | "beauty"
  | "outdoors"
  | "book"
  | "hobby"
  | "jewelry"
  | "loungewear";

export type ArchetypeKey =
  | "outdoorsy"
  | "homebody"
  | "artsy"
  | "wellness"
  | "social"
  | "niche"
  | "petparent"
  | "fitness_girl"
  | "custom";

export type ConfidenceKey = "confident" | "somewhat" | "lost";

// -----------------------------------------------------------------------------
// VIBE RULES
// -----------------------------------------------------------------------------

type VibeRule = {
  vibes: VibeKey[];
  explanation: string;
};

export const VIBE_RULES: Record<OccasionKey, Record<StageKey, VibeRule>> = {
  valentines: {
    new:         { vibes: ["fun"],                    explanation: "You're still getting to know each other — playful and low-pressure is exactly right. Save the grand gestures for later." },
    dating:      { vibes: ["romantic"],               explanation: "Valentine's is her holiday. Something warm and intentional will land far better than anything practical right now." },
    serious:     { vibes: ["romantic", "sentimental"],explanation: "At this stage the best Valentine's gifts feel personal to your relationship, not just the occasion." },
    committed:   { vibes: ["sentimental", "pampering"],explanation: "Married Valentine's Day is about making her feel truly seen — not just remembered. Personal beats expensive every time." },
    complicated: { vibes: ["cozy", "fun"],            explanation: "Warm and genuine without intensity. Something she can enjoy without it feeling like a statement." },
  },
  anniversary: {
    new:         { vibes: ["fun", "romantic"],          explanation: "A first anniversary in a new relationship is still light — celebrate without putting pressure on it." },
    dating:      { vibes: ["romantic", "sentimental"],  explanation: "Anniversaries reward thoughtfulness more than any other occasion. The more specific to her, the better." },
    serious:     { vibes: ["sentimental", "luxe"],      explanation: "This is the occasion where depth matters most. Something that references your time together will outlast anything expensive." },
    committed:   { vibes: ["sentimental", "luxe"],      explanation: "Go meaningful and go quality. This is one of the few occasions where both are expected." },
    complicated: { vibes: ["fun", "cozy"],              explanation: "Keep it warm without making it a statement about the relationship. Light and genuine is the move." },
  },
  birthday: {
    new:         { vibes: ["fun", "thoughtful"],        explanation: "Her birthday is about who she is as a person — not the relationship. Interest-driven and light is perfect." },
    dating:      { vibes: ["thoughtful", "fun"],        explanation: "You know her well enough to be specific. A gift tied to something she loves beats spending more every time." },
    serious:     { vibes: ["luxe", "thoughtful"],       explanation: "By now you know her well enough to give her something she'd never buy herself. That's the birthday sweet spot." },
    committed:   { vibes: ["luxe", "pampering"],        explanation: "Her birthday is entirely about her as an individual. Make her feel spoiled." },
    complicated: { vibes: ["fun", "thoughtful"],        explanation: "Keep it personal to her interests rather than the relationship. Fun and specific is the safest ground." },
  },
  christmas: {
    new:         { vibes: ["cozy", "fun"],              explanation: "Christmas gifts early on should feel warm but not intense. Cozy and enjoyable — nothing that implies too much." },
    dating:      { vibes: ["cozy", "luxe"],             explanation: "Christmas is the most forgiving occasion to shop for. Lean into warmth and things she'd love but wouldn't splurge on." },
    serious:     { vibes: ["luxe", "cozy"],             explanation: "You know her well enough to upgrade her. A luxury version of something she uses every day always lands at Christmas." },
    committed:   { vibes: ["cozy", "sentimental"],      explanation: "Christmas is about warmth and togetherness. Something that makes her feel at home — literally or emotionally." },
    complicated: { vibes: ["cozy", "fun"],              explanation: "The season does the emotional heavy lifting. Something warm and enjoyable without deeper implications." },
  },
  mothers_day: {
    new:         { vibes: ["cozy", "fun"],              explanation: "If you're early in the relationship, the gesture of acknowledging this day matters more than the spend. Keep it warm and light." },
    dating:      { vibes: ["pampering", "cozy"],        explanation: "Mother's Day is about letting her rest and feel taken care of. Pampering is almost always the right call." },
    serious:     { vibes: ["pampering", "luxe"],        explanation: "She does a lot. This is your moment to say you see that — something that lets her fully switch off." },
    committed:   { vibes: ["sentimental", "pampering"], explanation: "As her partner, this is your moment to make her feel celebrated as both a mother and a person." },
    complicated: { vibes: ["pampering", "cozy"],        explanation: "Whatever the relationship status, this day is about her as a mom. Keep it warm and appreciative." },
  },
  just_because: {
    new:         { vibes: ["fun", "cozy"],              explanation: "Surprise gifts early on should feel spontaneous — not intense. Something she'll enjoy in the moment is perfect." },
    dating:      { vibes: ["romantic", "cozy"],         explanation: "An out-of-nowhere gift is one of the most romantic moves you can make. Personal but not over the top." },
    serious:     { vibes: ["romantic", "pampering"],    explanation: "Surprise gifts after serious time together hit especially hard. This is your chance to show you still think about her unprompted." },
    committed:   { vibes: ["romantic", "sentimental"],  explanation: "Unexpected gifts in a long relationship might be the most meaningful thing on this list. Don't overthink it — just make her feel remembered." },
    complicated: { vibes: ["cozy", "fun"],              explanation: "A spontaneous gift during a complicated time should feel warm and genuine — not like a grand gesture." },
  },
  apology: {
    new:         { vibes: ["thoughtful", "cozy"],       explanation: "Early on, an apology gift should feel genuine and low-key. Something warm that shows you were thinking about her specifically." },
    dating:      { vibes: ["thoughtful", "pampering"],  explanation: "The gift should say 'I see you and I'm sorry' — not 'here's something expensive.' Personal and pampering lands better than romantic right now." },
    serious:     { vibes: ["pampering", "sentimental"], explanation: "At this stage she knows you well enough to see through a generic gesture. Something genuinely considered — and that lets her relax — is the right move." },
    committed:   { vibes: ["sentimental", "pampering"], explanation: "In a long relationship, the best apology gift shows you actually know her. Personal and pampering — not grand or expensive." },
    complicated: { vibes: ["thoughtful", "cozy"],       explanation: "During a complicated time, the gift should feel warm and genuine — not like a grand gesture or a bribe. Simple and personal is exactly right." },
  },
};

// -----------------------------------------------------------------------------
// BUDGET RULES
// min/max aligned to price filter tiers so getBudgetOptionFromRange() always
// lands on a real option. Explanations show the user-friendly range.
// -----------------------------------------------------------------------------

type BudgetRule = {
  min: number;
  max: number;
  explanation: string;
};

export const BUDGET_RULES: Record<OccasionKey, Record<StageKey, BudgetRule>> = {
  valentines: {
    new:         { min: 25,  max: 50,     explanation: "Early on, $25–50 is the sweet spot — enough to feel intentional without signaling intensity the relationship hasn't earned yet." },
    dating:      { min: 50,  max: 100,    explanation: "Valentine's calls for something considered. $50–100 gives you real options without overdoing it." },
    serious:     { min: 75,  max: 200,    explanation: "At this stage she has expectations — in a good way. $100–200 is appropriate and gives you room to be genuinely impressive." },
    committed:   { min: 100, max: 200,    explanation: "Spending less than $100 on Valentine's Day at this stage can feel like a miss. $100–200 is the right zone." },
    complicated: { min: 25,  max: 100,    explanation: "An expensive gift during a complicated patch sends the wrong signal. Keep it moderate — the gesture matters more than the price tag." },
  },
  anniversary: {
    new:         { min: 25,  max: 50,     explanation: "First anniversaries in new relationships should feel celebratory but light. $25–50 hits that tone." },
    dating:      { min: 50,  max: 100,    explanation: "Anniversaries are one of the highest-stakes occasions. $50–100 reflects that without going overboard." },
    serious:     { min: 100, max: 200,    explanation: "At this stage the anniversary carries real weight. $100–200 is appropriate — but a thoughtful $100 gift beats a careless $200 one." },
    committed:   { min: 150, max: 999999, explanation: "This is one of the few occasions where going big is genuinely expected. $200+ is the right target for a committed relationship." },
    complicated: { min: 25,  max: 100,    explanation: "Keep it moderate. An anniversary gift during complicated times should feel warm, not loaded." },
  },
  birthday: {
    new:         { min: 25,  max: 50,     explanation: "Her birthday early on is about showing you pay attention, not spending big. $25–50 is plenty." },
    dating:      { min: 50,  max: 100,    explanation: "You know her well enough to be specific. $50–100 gives you room to get something genuinely good." },
    serious:     { min: 75,  max: 200,    explanation: "Birthdays at this stage should feel a little indulgent. $100–200 lets you give her something she'd never buy herself." },
    committed:   { min: 100, max: 200,    explanation: "Her birthday is entirely about her as an individual. $100–200 is the right level of effort for where you are." },
    complicated: { min: 25,  max: 100,    explanation: "Keep it personal to her interests and moderate on price. The thought matters more than the spend here." },
  },
  christmas: {
    new:         { min: 25,  max: 50,     explanation: "Christmas gifts early in a relationship should feel warm but not intense. $25–50 is exactly right." },
    dating:      { min: 50,  max: 100,    explanation: "Christmas is forgiving on price — the vibe matters more than the spend. $50–100 is a solid range." },
    serious:     { min: 75,  max: 200,    explanation: "You know her well enough to get her something she'll genuinely love. $100–200 gives you room to deliver that." },
    committed:   { min: 100, max: 200,    explanation: "Christmas at this stage should feel generous and warm. $100–200 reflects that without needing to overthink it." },
    complicated: { min: 25,  max: 100,    explanation: "The season does the emotional work — keep the spend moderate and focus on something she'll genuinely enjoy." },
  },
  mothers_day: {
    new:         { min: 25,  max: 50,     explanation: "If you're early in the relationship, the gesture matters more than the spend. $25–50 is appropriate." },
    dating:      { min: 50,  max: 100,    explanation: "Mother's Day deserves real effort. $50–100 gives you access to genuinely good pampering gifts." },
    serious:     { min: 75,  max: 200,    explanation: "At this stage you're part of her life in a real way. $100–200 reflects that and gives you room to do something special." },
    committed:   { min: 100, max: 200,    explanation: "This is your occasion to go all in on making her feel celebrated. $100–200 is right for where you are." },
    complicated: { min: 25,  max: 100,    explanation: "Keep the focus on appreciation rather than the relationship. $50–100 and something genuinely thoughtful." },
  },
  just_because: {
    new:         { min: 15,  max: 50,     explanation: "Surprise gifts early on should feel spontaneous, not loaded. Keep it under $50 — the gesture is the whole point." },
    dating:      { min: 25,  max: 100,    explanation: "Just because gifts should feel like an impulse, not a production. $25–50 is the sweet spot." },
    serious:     { min: 50,  max: 100,    explanation: "A surprise gift at this stage can be genuinely romantic. $50–100 lets you make it feel real without overdoing it." },
    committed:   { min: 50,  max: 200,    explanation: "Unexpected gifts in a long relationship hit harder than almost anything planned. Spend what feels right — the surprise is doing most of the work." },
    complicated: { min: 15,  max: 50,     explanation: "Keep it light and genuine. An inexpensive but warm gesture is exactly right during complicated times." },
  },
  apology: {
    new:         { min: 20,  max: 50,     explanation: "An apology gift early on should feel sincere, not expensive. $25–50 is the right range — the gesture matters far more than the price tag." },
    dating:      { min: 25,  max: 100,    explanation: "Enough to feel considered, not so much that it looks like you're buying forgiveness. $50–100 is the sweet spot." },
    serious:     { min: 50,  max: 100,    explanation: "She deserves something real, but expensive gifts during a conflict can feel like the wrong kind of gesture. $50–100 and make it personal." },
    committed:   { min: 50,  max: 100,    explanation: "This isn't the occasion to go big on spend. $50–100 and put the thought into what it is, not what it costs." },
    complicated: { min: 20,  max: 100,    explanation: "Keep it modest and genuine. An inexpensive gift that feels personal will land better than anything expensive right now." },
  },
};

// -----------------------------------------------------------------------------
// GIFT TYPE GUIDANCE
// Surfaces recommended, neutral, and discouraged gift types per occasion.
// Used to nudge men away from defaulting to tech on romantic occasions.
// -----------------------------------------------------------------------------

type GiftTypeGuidance = {
  recommended: GiftTypeKey[];
  neutral: GiftTypeKey[];
  discouraged: GiftTypeKey[];
  discourageMessages: Partial<Record<GiftTypeKey, string>>;
};

export const GIFT_TYPE_GUIDANCE: Record<OccasionKey, GiftTypeGuidance> = {
  valentines: {
    recommended: ["jewelry", "beauty", "loungewear", "home"],
    neutral:     ["hobby", "book", "kitchen"],
    discouraged: ["tech", "fitness", "outdoors"],
    discourageMessages: {
      tech:    "Tech gifts on Valentine's Day tend to feel like something you bought for yourself. Unless she's asked for something specific, lean toward something more personal.",
      fitness: "Fitness gifts can read as a comment on her body rather than a celebration of her.",
      outdoors:"Outdoor gear is a great gift — just not the most romantic Valentine's choice unless she's passionate about it.",
    },
  },
  anniversary: {
    recommended: ["jewelry", "home", "beauty", "loungewear"],
    neutral:     ["hobby", "book", "kitchen"],
    discouraged: ["tech", "fitness", "outdoors"],
    discourageMessages: {
      tech:    "Anniversaries reward personal and meaningful gifts. A gadget rarely fits unless she's asked for it by name.",
      fitness: "Fitness gifts need to be specifically requested to land well on a romantic occasion.",
      outdoors:"Fine if she's outdoorsy — but make sure it's about her interests, not yours.",
    },
  },
  birthday: {
    recommended: ["jewelry", "beauty", "hobby", "loungewear", "book"],
    neutral:     ["home", "kitchen", "outdoors", "fitness", "tech"],
    discouraged: [],
    discourageMessages: {
      tech: "Tech works great for birthdays if it's tied to something she loves — just make sure it's for her, not because it's easy to buy.",
    },
  },
  christmas: {
    recommended: ["home", "beauty", "loungewear", "book", "hobby"],
    neutral:     ["jewelry", "tech", "kitchen", "fitness", "outdoors"],
    discouraged: [],
    discourageMessages: {},
  },
  mothers_day: {
    recommended: ["beauty", "loungewear", "home", "jewelry"],
    neutral:     ["book", "kitchen", "hobby"],
    discouraged: ["tech", "fitness", "outdoors"],
    discourageMessages: {
      tech:    "Mother's Day is about making her feel pampered. Tech gifts rarely convey that — save them for birthdays.",
      fitness: "Fitness gifts on Mother's Day can feel like you're asking her to work on herself rather than celebrating her.",
      outdoors:"Unless she's a passionate outdoors person, this misses the pampering energy Mother's Day calls for.",
    },
  },
  just_because: {
    recommended: ["beauty", "loungewear", "home", "book"],
    neutral:     ["jewelry", "hobby", "kitchen"],
    discouraged: ["tech", "fitness", "outdoors"],
    discourageMessages: {
      tech:    "Surprise gifts land best when they feel warm and personal. A gadget out of nowhere can feel random rather than romantic.",
      fitness: "Spontaneous fitness gifts are a minefield. Unless she's been talking about something specific, skip it.",
      outdoors:"As a standalone surprise this tends to feel impersonal unless it's tied to something you're planning together.",
    },
  },
  apology: {
    recommended: ["beauty", "loungewear", "jewelry", "home"],
    neutral:     ["book", "hobby"],
    discouraged: ["tech", "fitness", "outdoors", "kitchen"],
    discourageMessages: {
      tech:    "An apology gift needs to feel warm and personal. A gadget signals you grabbed something easy rather than thought about her.",
      fitness: "Never give a fitness gift as an apology.",
      outdoors:"Outdoor gear as an apology will almost certainly miss the mark.",
      kitchen: "Kitchen gifts during an apology can accidentally imply domestic expectations. Avoid unless she's specifically wanted something.",
    },
  },
};

// Gift type display metadata — labels and emojis for the quiz UI
export const GIFT_TYPE_META: Record<GiftTypeKey, { label: string; emoji: string; sublabel: string }> = {
  tech:      { label: "Tech & Gadgets",  emoji: "💻", sublabel: "Devices, smart home, accessories" },
  kitchen:   { label: "Kitchen & Food",  emoji: "🍳", sublabel: "Cookware, coffee, food & drink" },
  home:      { label: "Home & Décor",    emoji: "🏠", sublabel: "Candles, blankets, home accessories" },
  fitness:   { label: "Fitness & Wellness", emoji: "🏃", sublabel: "Gym, yoga, recovery, outdoors" },
  beauty:    { label: "Beauty & Skincare", emoji: "✨", sublabel: "Skincare, makeup, spa, hair" },
  outdoors:  { label: "Outdoor & Adventure", emoji: "🏕️", sublabel: "Hiking, camping, travel gear" },
  book:      { label: "Books & Learning", emoji: "📚", sublabel: "Books, journals, courses" },
  hobby:     { label: "Hobbies & Crafts", emoji: "🎨", sublabel: "Art, games, creative kits" },
  jewelry:   { label: "Jewelry",          emoji: "💍", sublabel: "Necklaces, bracelets, earrings" },
  loungewear:{ label: "Loungewear & Cozy", emoji: "🛁", sublabel: "Robes, pajamas, cozy wearables" },
};

// -----------------------------------------------------------------------------
// ARCHETYPE → INTERESTS MAPPING
// -----------------------------------------------------------------------------

export type InterestKey =
  | "coffee"
  | "cooking"
  | "baking"
  | "wine"
  | "cocktails"
  | "fitness"
  | "running"
  | "cycling"
  | "yoga"
  | "reading"
  | "music"
  | "gaming"
  | "photography"
  | "art"
  | "travel"
  | "hiking"
  | "camping"
  | "gardening"
  | "movies"
  | "fashion"
  | "skincare"
  | "makeup"
  | "wellness"
  | "home_decor"
  | "pets";

export const ARCHETYPE_INTERESTS: Record<ArchetypeKey, InterestKey[]> = {
  outdoorsy:    ["hiking", "camping", "travel", "photography", "gardening"],
  homebody:     ["home_decor", "cooking", "baking", "reading", "movies", "coffee"],
  artsy:        ["art", "photography", "music", "fashion", "baking"],
  wellness:     ["yoga", "skincare", "wellness", "home_decor", "reading"],
  social:       ["wine", "cocktails", "fashion", "travel", "music", "makeup"],
  niche:        ["gaming", "movies", "reading", "music", "art"],
  petparent:    ["pets", "hiking", "photography", "home_decor", "wellness"],
  fitness_girl: ["fitness", "running", "cycling", "yoga", "hiking"],
  custom:       [],
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

export function getVibeRecommendation(occasion: OccasionKey, stage: StageKey): VibeRule {
  return VIBE_RULES[occasion]?.[stage] ?? {
    vibes: ["thoughtful"],
    explanation: "We'll find something that feels right for the occasion.",
  };
}

export function getBudgetRecommendation(occasion: OccasionKey, stage: StageKey): BudgetRule {
  return BUDGET_RULES[occasion]?.[stage] ?? { min: 50, max: 100, explanation: "A thoughtful gift at any price point." };
}

export function getGiftTypeGuidance(occasion: OccasionKey): GiftTypeGuidance {
  return GIFT_TYPE_GUIDANCE[occasion] ?? {
    recommended: [],
    neutral: Object.keys(GIFT_TYPE_META) as GiftTypeKey[],
    discouraged: [],
    discourageMessages: {},
  };
}

export function getInterestsForArchetypes(archetypes: ArchetypeKey[]): InterestKey[] {
  const seen = new Set<InterestKey>();
  const result: InterestKey[] = [];
  for (const archetype of archetypes) {
    for (const interest of ARCHETYPE_INTERESTS[archetype] ?? []) {
      if (!seen.has(interest)) {
        seen.add(interest);
        result.push(interest);
      }
    }
  }
  return result;
}

export function getOverlapInterests(archetypes: ArchetypeKey[]): InterestKey[] {
  const counts = new Map<InterestKey, number>();
  for (const archetype of archetypes) {
    for (const interest of ARCHETYPE_INTERESTS[archetype] ?? []) {
      counts.set(interest, (counts.get(interest) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([interest]) => interest);
}

export function getBudgetTierFromMax(maxPrice: number): string {
  if (maxPrice <= 25) return "Under $25";
  if (maxPrice <= 50) return "$25 – $50";
  if (maxPrice <= 100) return "$50 – $100";
  if (maxPrice <= 200) return "$100 – $200";
  return "$200+";
}

export function getBudgetOptionFromRange(min: number, max: number): number {
  if (max <= 25) return 25;
  if (max <= 50) return 50;
  if (max <= 100) return 100;
  if (max <= 200) return 200;
  return 999999;
}