"use client";

import { useState, useEffect, useMemo } from "react";
import {
  OccasionKey,
  StageKey,
  VibeKey,
  ArchetypeKey,
  InterestKey,
  ConfidenceKey,
  getVibeRecommendation,
  getBudgetRecommendation,
  getBudgetOptionFromRange,
  getInterestsForArchetypes,
  getOverlapInterests,
  ARCHETYPE_INTERESTS,
} from "@/lib/quizRules";

// =============================================================================
// TYPES
// =============================================================================

export type QuizAnswers = {
  occasion?: OccasionKey;
  occasion_date?: string;
  days_until_needed?: number;
  relationship_stage?: StageKey;
  partner_name?: string;
  partner_id?: string;
  vibe?: VibeKey[];
  max_price?: number;
  confidence?: ConfidenceKey;
  archetypes?: ArchetypeKey[];
  interests?: InterestKey[];
  // overlap interests are passed to backend for scoring boost
  overlap_interests?: InterestKey[];
};

type QuizProps = {
  onComplete: (answers: QuizAnswers) => void;
  initialAnswers?: QuizAnswers;
};

// =============================================================================
// CONSTANTS
// =============================================================================

const FEEDBACK_DURATION = 1400;
const LOADING_DURATION = 2800;

const VIBE_META: Record<VibeKey, { label: string; emoji: string; feedback: string }> = {
  pampering:   { label: "Pampered",    emoji: "🛁", feedback: "She gets to slow down and feel taken care of." },
  romantic:    { label: "Romantic",    emoji: "🌹", feedback: "Warm, intentional, and just for her." },
  sentimental: { label: "Sentimental", emoji: "💌", feedback: "The gift that shows you've been paying attention." },
  luxe:        { label: "Luxe",        emoji: "✨", feedback: "Something she'd never justify buying herself." },
  cozy:        { label: "Cozy",        emoji: "🕯️", feedback: "Warm, comforting, and perfect for any season." },
  fun:         { label: "Fun",         emoji: "🎉", feedback: "Playful, surprising, and genuinely enjoyable." },
  thoughtful:  { label: "Thoughtful",  emoji: "🎯", feedback: "Specific to her — shows you actually listen." },
};

const INTEREST_META: Record<InterestKey, { label: string; emoji: string }> = {
  coffee:    { label: "Coffee",       emoji: "☕" },
  cooking:   { label: "Cooking",      emoji: "🍳" },
  baking:    { label: "Baking",       emoji: "🧁" },
  wine:      { label: "Wine",         emoji: "🍷" },
  cocktails: { label: "Cocktails",    emoji: "🍹" },
  fitness:   { label: "Fitness",      emoji: "🏋️" },
  running:   { label: "Running",      emoji: "🏃" },
  cycling:   { label: "Cycling",      emoji: "🚴" },
  yoga:      { label: "Yoga",         emoji: "🧘" },
  reading:   { label: "Reading",      emoji: "📚" },
  music:     { label: "Music",        emoji: "🎵" },
  gaming:    { label: "Gaming",       emoji: "🎮" },
  photography: { label: "Photography", emoji: "📸" },
  art:       { label: "Art",          emoji: "🎨" },
  travel:    { label: "Travel",       emoji: "✈️" },
  hiking:    { label: "Hiking",       emoji: "⛰️" },
  camping:   { label: "Camping",      emoji: "🏕️" },
  gardening: { label: "Gardening",    emoji: "🌱" },
  movies:    { label: "Movies",       emoji: "🎬" },
  fashion:   { label: "Fashion",      emoji: "👗" },
  skincare:  { label: "Skincare",     emoji: "✨" },
  makeup:    { label: "Makeup",       emoji: "💄" },
  wellness:  { label: "Wellness",     emoji: "🌿" },
  home_decor: { label: "Candles & Home", emoji: "🕯️" },
  pets:      { label: "Pets",         emoji: "🐾" },
};

// =============================================================================
// STEP IDs — explicit enum keeps routing logic readable
// =============================================================================

type StepId =
  | "occasion"
  | "occasion_date"
  | "relationship_stage"
  | "partner_name"
  | "vibe"
  | "budget"
  | "confidence"
  | "archetypes"
  | "interests";

const STEP_ORDER: StepId[] = [
  "occasion",
  "occasion_date",
  "relationship_stage",
  "partner_name",
  "vibe",
  "budget",
  "confidence",
  "archetypes",
  "interests",
];

// Steps that are skipped when confidence === 'lost'
const INTEREST_STEPS: StepId[] = ["archetypes", "interests"];

// =============================================================================
// HELPERS
// =============================================================================

function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

function getNextHolidayDate(month: number, day: number): string {
  const today = new Date();
  let target = new Date(today.getFullYear(), month - 1, day);
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return target.toISOString().split("T")[0];
}

// Second Sunday of May
function getNextMothersDayDate(): string {
  const today = new Date();
  let year = today.getFullYear();
  const getMothersDay = (y: number) => {
    const may1 = new Date(y, 4, 1);
    const firstSunday = (7 - may1.getDay()) % 7;
    return new Date(y, 4, 1 + firstSunday + 7);
  };
  let md = getMothersDay(year);
  if (md < today) md = getMothersDay(year + 1);
  return md.toISOString().split("T")[0];
}

function getDateLimits() {
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  return {
    minDate: today.toISOString().split("T")[0],
    maxDate: oneYear.toISOString().split("T")[0],
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function GiftQuiz({ onComplete, initialAnswers }: QuizProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(
    initialAnswers ?? { archetypes: [], interests: [] }
  );
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [isFindingGifts, setIsFindingGifts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAllInterests, setShowAllInterests] = useState(false);

  useEffect(() => {
    if (initialAnswers?.partner_id && !isEditingProfile) {
      setIsEditingProfile(true);
    }
  }, [initialAnswers?.partner_id]);

  // Build the active step sequence, skipping interest steps for 'lost'
  const activeSteps = useMemo<StepId[]>(() => {
    if (answers.confidence === "lost") {
      return STEP_ORDER.filter((s) => !INTEREST_STEPS.includes(s));
    }
    return STEP_ORDER;
  }, [answers.confidence]);

  const currentStepId = activeSteps[stepIndex];
  const totalSteps = activeSteps.length;
  const progressPercent = ((stepIndex + 1) / totalSteps) * 100;

  // Smart preselections (recomputed when occasion/stage change)
  const vibeRecommendation = useMemo(() => {
    if (answers.occasion && answers.relationship_stage) {
      return getVibeRecommendation(answers.occasion, answers.relationship_stage);
    }
    return null;
  }, [answers.occasion, answers.relationship_stage]);

  const budgetRecommendation = useMemo(() => {
    if (answers.occasion && answers.relationship_stage) {
      return getBudgetRecommendation(answers.occasion, answers.relationship_stage);
    }
    return null;
  }, [answers.occasion, answers.relationship_stage]);

  // Interests to show in step 9 — based on selected archetypes
  const archetypeInterests = useMemo<InterestKey[]>(() => {
    if (showAllInterests) {
      return Object.keys(INTEREST_META) as InterestKey[];
    }
    if (answers.archetypes && answers.archetypes.length > 0) {
      return getInterestsForArchetypes(answers.archetypes);
    }
    return Object.keys(INTEREST_META) as InterestKey[];
  }, [answers.archetypes, showAllInterests]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const triggerCompletion = (finalAnswers: QuizAnswers) => {
    // Calculate overlap interests for backend scoring boost
    const overlap =
      finalAnswers.archetypes && finalAnswers.archetypes.length > 1
        ? getOverlapInterests(finalAnswers.archetypes)
        : [];
    const withOverlap = { ...finalAnswers, overlap_interests: overlap };
    setIsFindingGifts(true);
    setTimeout(() => onComplete(withOverlap), LOADING_DURATION);
  };

  const goNext = (updatedAnswers?: QuizAnswers) => {
    const ans = updatedAnswers ?? answers;
    setError(null);
    if (stepIndex < activeSteps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      triggerCompletion(ans);
    }
  };

  const goBack = () => {
    setActiveFeedback(null);
    setError(null);
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleSkip = () => goNext();

  // Single-select with feedback flash then auto-advance
  const selectWithFeedback = (
    update: Partial<QuizAnswers>,
    feedback: string,
    updatedAnswers: QuizAnswers
  ) => {
    setActiveFeedback(feedback);
    setTimeout(() => {
      setActiveFeedback(null);
      goNext(updatedAnswers);
    }, FEEDBACK_DURATION);
  };

  // ============================================================
  // PER-STEP HANDLERS
  // ============================================================

  const handleOccasion = (value: OccasionKey, feedback: string) => {
    let dateToPreFill: string | undefined;
    if (value === "christmas") dateToPreFill = getNextHolidayDate(12, 25);
    else if (value === "valentines") dateToPreFill = getNextHolidayDate(2, 14);
    else if (value === "mothers_day") dateToPreFill = getNextMothersDayDate();

    const updated: QuizAnswers = {
      ...answers,
      occasion: value,
      occasion_date: dateToPreFill,
      days_until_needed: dateToPreFill ? getDaysUntil(dateToPreFill) : undefined,
    };
    setAnswers(updated);
    selectWithFeedback({}, feedback, updated);
  };

  const handleStage = (value: StageKey, feedback: string) => {
    const updated = { ...answers, relationship_stage: value };
    setAnswers(updated);
    selectWithFeedback({}, feedback, updated);
  };

  const handleVibe = (value: VibeKey) => {
    const updated = { ...answers, vibe: [value] };
    setAnswers(updated);
    selectWithFeedback({}, VIBE_META[value].feedback, updated);
  };

  const handleBudget = (value: number, feedback: string) => {
    const updated = { ...answers, max_price: value };
    setAnswers(updated);
    selectWithFeedback({}, feedback, updated);
  };

  const handleConfidence = (value: ConfidenceKey, feedback: string) => {
    const updated = { ...answers, confidence: value };
    setAnswers(updated);
    // After setting confidence, re-evaluate active steps
    if (value === "lost") {
      setActiveFeedback(feedback);
      setTimeout(() => {
        setActiveFeedback(null);
        // Skip to completion since interest steps are removed
        triggerCompletion(updated);
      }, FEEDBACK_DURATION);
    } else {
      selectWithFeedback({}, feedback, updated);
    }
  };

  const handleArchetypeToggle = (value: ArchetypeKey) => {
    const current = answers.archetypes ?? [];
    let next: ArchetypeKey[];
    if (current.includes(value)) {
      next = current.filter((a) => a !== value);
    } else if (current.length < 2) {
      next = [...current, value];
    } else {
      next = [current[1], value]; // replace oldest
    }
    setAnswers({ ...answers, archetypes: next, interests: [] });
    setShowAllInterests(false);
  };

  const handleInterestToggle = (value: InterestKey) => {
    const current = answers.interests ?? [];
    let next: InterestKey[];
    if (current.includes(value)) {
      next = current.filter((i) => i !== value);
    } else if (current.length < 5) {
      next = [...current, value];
    } else {
      next = current; // cap at 5
    }
    setAnswers({ ...answers, interests: next });
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (isFindingGifts) {
    const isApology = answers.occasion === "apology";
    const name = answers.partner_name;
    return (
      <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div
          className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-500 mb-8"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <h2 className="text-3xl font-serif text-stone-900 mb-8 tracking-tight">
          {isApology
            ? "Finding the right gesture…"
            : name
            ? `Finding the perfect gift for ${name}…`
            : "Finding the perfect gift…"}
        </h2>
        <div className="space-y-4 w-full max-w-xs">
          {[
            { icon: "🔍", text: "Scanning thousands of options" },
            { icon: "💡", text: "Matching with her interests" },
            { icon: "📦", text: "Checking delivery times" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-left text-stone-500"
              style={{
                animation: "fadeSlideIn 0.5s ease forwards",
                animationDelay: `${i * 0.7}s`,
                opacity: 0,
              }}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm font-medium">{s.text}</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateX(-8px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================
  // FEEDBACK OVERLAY
  // ============================================================

  if (activeFeedback) {
    return (
      <div className="w-full max-w-2xl mx-auto min-h-[400px] flex items-center justify-center py-24 px-4">
        <p
          className="text-2xl font-serif text-stone-800 text-center"
          style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
        >
          {activeFeedback}
        </p>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const SmartCard = ({
    title,
    explanation,
    highlight,
  }: {
    title: string;
    explanation: string;
    highlight: string;
  }) => (
    <div className="mb-6 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
        {title}
      </p>
      <p className="text-sm text-stone-600 leading-relaxed">{explanation}</p>
      <p className="text-sm font-semibold text-stone-900 mt-2">{highlight}</p>
    </div>
  );

  const QuestionHeader = ({
    question,
    subtitle,
    badge,
  }: {
    question: string;
    subtitle: string;
    badge?: string;
  }) => (
    <div className="mb-8">
      <h2 className="text-3xl font-serif text-stone-900 mb-2 tracking-tight leading-snug">
        {question}
      </h2>
      <p className="text-stone-500 text-base">{subtitle}</p>
      {badge && (
        <p className="text-sm text-amber-600 font-medium mt-2">{badge}</p>
      )}
    </div>
  );

  // ============================================================
  // STEP RENDERERS
  // ============================================================

  const renderOccasion = () => (
    <>
      <QuestionHeader
        question="What's the occasion?"
        subtitle="Let's start with the reason."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {(
          [
            { label: "Birthday",       value: "birthday",    emoji: "🎂", feedback: "Birthdays are all about her — let's make it personal." },
            { label: "Valentine's Day",value: "valentines",  emoji: "❤️", feedback: "Time to show up. Let's find something she'll love." },
            { label: "Anniversary",    value: "anniversary", emoji: "💝", feedback: "The occasion that rewards thoughtfulness more than any other." },
            { label: "Christmas",      value: "christmas",   emoji: "🎄", feedback: "Warm, cozy, and a little indulgent — let's find the one." },
            { label: "Mother's Day",   value: "mothers_day", emoji: "🌸", feedback: "She deserves to feel celebrated. Let's get this right." },
            { label: "Just Because",   value: "just_because",emoji: "✨", feedback: "Honestly? Surprise gifts are the most romantic move there is." },
            { label: "I Owe Her One",  value: "apology",     emoji: "🙏", feedback: "We've all been there. Let's help you make it right." },
          ] as { label: string; value: OccasionKey; emoji: string; feedback: string }[]
        ).map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            emoji={opt.emoji}
            selected={answers.occasion === opt.value}
            onClick={() => handleOccasion(opt.value, opt.feedback)}
          />
        ))}
      </div>
    </>
  );

  const renderOccasionDate = () => {
    const { minDate, maxDate } = getDateLimits();
    return (
      <>
        <QuestionHeader
          question="When is it?"
          subtitle="We'll make sure it arrives in time."
        />
        <div className="mb-8 max-w-sm">
          <input
            type="date"
            value={answers.occasion_date ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setAnswers({
                ...answers,
                occasion_date: v || undefined,
                days_until_needed: v ? getDaysUntil(v) : undefined,
              });
            }}
            min={minDate}
            max={maxDate}
            className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-lg text-stone-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
          <p className="text-xs text-stone-400 mt-2">Must be within the next year</p>
        </div>
        <NavRow
          onBack={goBack}
          onNext={() => goNext()}
          onSkip={handleSkip}
          showSkip
          showBack={stepIndex > 0}
          canProceed
          isLast={stepIndex === activeSteps.length - 1}
        />
      </>
    );
  };

  const renderRelationshipStage = () => (
    <>
      <QuestionHeader
        question="Where are you two at?"
        subtitle="This helps us get the tone exactly right."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {(
          [
            { label: "Early days",       sublabel: "Just started seeing each other", value: "new",         emoji: "🌱", feedback: "New relationships have their own rules — we've got you." },
            { label: "We're official",   sublabel: "In a relationship",              value: "dating",      emoji: "💛", feedback: "You know her well enough to be specific. Good place to be." },
            { label: "The real deal",    sublabel: "Serious or living together",     value: "serious",     emoji: "🔑", feedback: "The bar is high — but so is your advantage. You know her." },
            { label: "All in",           sublabel: "Engaged or married",             value: "committed",   emoji: "💍", feedback: "The highest stakes and the best opportunity. Let's make it count." },
            { label: "It's complicated", sublabel: "On and off",                     value: "complicated", emoji: "🌀", feedback: "Warm and genuine without putting pressure on things — we know the assignment." },
          ] as { label: string; sublabel: string; value: StageKey; emoji: string; feedback: string }[]
        ).map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            sublabel={opt.sublabel}
            emoji={opt.emoji}
            selected={answers.relationship_stage === opt.value}
            onClick={() => handleStage(opt.value, opt.feedback)}
          />
        ))}
      </div>
    </>
  );

  const renderPartnerName = () => (
    <>
      <QuestionHeader
        question="What's her name?"
        subtitle="Makes your recommendations feel a little more personal."
      />
      <div className="mb-8 max-w-sm">
        <input
          type="text"
          value={answers.partner_name ?? ""}
          onChange={(e) => setAnswers({ ...answers, partner_name: e.target.value })}
          placeholder="e.g., Sarah"
          maxLength={50}
          autoFocus
          className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-lg text-stone-900 placeholder-stone-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
        />
        <p className="text-xs text-stone-400 mt-2">Optional — skip if you prefer</p>
      </div>
      <NavRow
        onBack={goBack}
        onNext={() => goNext()}
        onSkip={handleSkip}
        showSkip
        showBack={stepIndex > 0}
        canProceed
        isLast={false}
      />
    </>
  );

  const renderVibe = () => {
    const rec = vibeRecommendation;
    return (
      <>
        <QuestionHeader
          question="What do you want her to feel?"
          subtitle="We picked a starting point — but you know her best."
        />
        {rec && (
          <SmartCard
            title="Our read on this"
            explanation={rec.explanation}
            highlight={`We'd lean toward: ${rec.vibes.map((v) => VIBE_META[v].label).join(" + ")}`}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {(Object.keys(VIBE_META) as VibeKey[]).map((v) => (
            <OptionCard
              key={v}
              label={VIBE_META[v].label}
              emoji={VIBE_META[v].emoji}
              selected={answers.vibe?.includes(v) ?? false}
              recommended={rec?.vibes.includes(v) ?? false}
              onClick={() => handleVibe(v)}
            />
          ))}
        </div>
      </>
    );
  };

  const renderBudget = () => {
    const rec = budgetRecommendation;
    const recommendedValue = rec
      ? getBudgetOptionFromRange(rec.min, rec.max)
      : undefined;

    const options = [
      { label: "Under $25",    value: 25,     sublabel: "Small but meaningful",      emoji: "💸" },
      { label: "$25 – $50",    value: 50,     sublabel: "Sweet spot for most occasions", emoji: "💵" },
      { label: "$50 – $100",   value: 100,    sublabel: "Room to be impressive",      emoji: "💳" },
      { label: "$100 – $200",  value: 200,    sublabel: "For the moments that matter", emoji: "💎" },
      { label: "$200+",        value: 999999, sublabel: "All out",                    emoji: "🌟" },
    ];

    return (
      <>
        <QuestionHeader
          question="What's your budget?"
          subtitle="We'll find the best option at any price point."
        />
        {rec && (
          <SmartCard
            title="Our suggestion"
            explanation={rec.explanation}
            highlight={`We'd recommend: $${rec.min}–$${rec.max}`}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              sublabel={opt.sublabel}
              emoji={opt.emoji}
              selected={answers.max_price === opt.value}
              recommended={recommendedValue === opt.value}
              onClick={() =>
                handleBudget(
                  opt.value,
                  `${opt.label} — ${opt.sublabel.toLowerCase()}.`
                )
              }
            />
          ))}
        </div>
      </>
    );
  };

  const renderConfidence = () => {
    const isApology = answers.occasion === "apology";
    return (
      <>
        <QuestionHeader
          question="How well do you know her style?"
          subtitle="Honest answer gets you better results."
        />
        <div className="grid grid-cols-1 gap-3 mb-8">
          {(
            [
              {
                label: "Pretty well",
                sublabel: "I have a good sense of what she likes",
                value: "confident" as ConfidenceKey,
                emoji: "🎯",
                feedback: "Perfect — we'll use everything you've told us to get specific.",
              },
              {
                label: "Somewhat",
                sublabel: "I have some idea but not totally sure",
                value: "somewhat" as ConfidenceKey,
                emoji: "🤔",
                feedback: "No problem — we'll mix specific picks with versatile options.",
              },
              {
                label: "Honestly lost",
                sublabel: "I genuinely have no idea",
                value: "lost" as ConfidenceKey,
                emoji: "😅",
                feedback: isApology
                  ? "We've got you — let's find something that feels real."
                  : "More common than you think. We'll focus on crowd-pleasers she'll actually love.",
              },
            ]
          ).map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              sublabel={opt.sublabel}
              emoji={opt.emoji}
              selected={answers.confidence === opt.value}
              onClick={() => handleConfidence(opt.value, opt.feedback)}
            />
          ))}
        </div>
      </>
    );
  };

  const renderArchetypes = () => {
    const selected = answers.archetypes ?? [];
    return (
      <>
        <QuestionHeader
          question="What's her vibe?"
          subtitle="Pick up to 2 that feel like her."
          badge={`${selected.length} of 2 selected`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {(
            [
              { label: "The Outdoorsy One", sublabel: "Happiest outside",                        value: "outdoorsy"    as ArchetypeKey, emoji: "🏕️" },
              { label: "The Homebody",       sublabel: "Her home is her happy place",              value: "homebody"     as ArchetypeKey, emoji: "🕯️" },
              { label: "The Artsy One",      sublabel: "Always making or appreciating something",  value: "artsy"        as ArchetypeKey, emoji: "🎨" },
              { label: "The Wellness Girl",  sublabel: "Self-care is her love language",           value: "wellness"     as ArchetypeKey, emoji: "🧘" },
              { label: "The Social One",     sublabel: "She makes everything an occasion",         value: "social"       as ArchetypeKey, emoji: "🥂" },
              { label: "Has Her Thing",      sublabel: "Deeply into one or two specific interests",value: "niche"        as ArchetypeKey, emoji: "🎮" },
              { label: "The Pet Parent",     sublabel: "Her fur baby is basically her child",      value: "petparent"    as ArchetypeKey, emoji: "🐾" },
              { label: "The Fitness Girl",   sublabel: "The gym is her happy place",               value: "fitness_girl" as ArchetypeKey, emoji: "🏋️" },
            ]
          ).map((opt) => {
            const isSelected = selected.includes(opt.value);
            const isDisabled = !isSelected && selected.length >= 2;
            return (
              <OptionCard
                key={opt.value}
                label={opt.label}
                sublabel={opt.sublabel}
                emoji={opt.emoji}
                selected={isSelected}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleArchetypeToggle(opt.value)}
              />
            );
          })}
        </div>
        <NavRow
          onBack={goBack}
          onNext={() => goNext()}
          onSkip={handleSkip}
          showSkip
          showBack={stepIndex > 0}
          canProceed={selected.length > 0}
          isLast={stepIndex === activeSteps.length - 1}
        />
      </>
    );
  };

  const renderInterests = () => {
    const selected = answers.interests ?? [];
    const overlapInterests =
      answers.archetypes && answers.archetypes.length > 1
        ? getOverlapInterests(answers.archetypes)
        : [];

    return (
      <>
        <QuestionHeader
          question="What specifically is she into?"
          subtitle={
            answers.archetypes && answers.archetypes.length > 0 && !showAllInterests
              ? "We narrowed it down based on her vibe — pick everything that fits."
              : "Pick up to 5 things she genuinely enjoys."
          }
          badge={`${selected.length} of 5 selected`}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {archetypeInterests.map((interest) => {
            const meta = INTEREST_META[interest];
            const isSelected = selected.includes(interest);
            const isDisabled = !isSelected && selected.length >= 5;
            const isOverlap = overlapInterests.includes(interest);
            return (
              <OptionCard
                key={interest}
                label={meta.label}
                emoji={meta.emoji}
                selected={isSelected}
                disabled={isDisabled}
                overlap={isOverlap}
                onClick={() => !isDisabled && handleInterestToggle(interest)}
              />
            );
          })}
        </div>
        {!showAllInterests && (answers.archetypes?.length ?? 0) > 0 && (
          <button
            onClick={() => setShowAllInterests(true)}
            className="text-sm text-stone-400 hover:text-stone-600 underline mb-6 transition-all"
          >
            Show all interests instead
          </button>
        )}
        <NavRow
          onBack={goBack}
          onNext={() => goNext()}
          onSkip={handleSkip}
          showSkip
          showBack={stepIndex > 0}
          canProceed={selected.length > 0}
          isLast={stepIndex === activeSteps.length - 1}
        />
      </>
    );
  };

  // ============================================================
  // STEP ROUTER
  // ============================================================

  const renderStep = () => {
    switch (currentStepId) {
      case "occasion":          return renderOccasion();
      case "occasion_date":     return renderOccasionDate();
      case "relationship_stage":return renderRelationshipStage();
      case "partner_name":      return renderPartnerName();
      case "vibe":              return renderVibe();
      case "budget":            return renderBudget();
      case "confidence":        return renderConfidence();
      case "archetypes":        return renderArchetypes();
      case "interests":         return renderInterests();
      default:                  return null;
    }
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[400px]">
      {isEditingProfile && (
        <div className="mb-6 px-5 py-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2">
          <span className="text-amber-600 text-sm">✏️</span>
          <p className="text-sm font-medium text-amber-800">
            Editing {answers.partner_name || "profile"}'s preferences
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span className="text-xs font-semibold text-stone-400">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="flex gap-1.5">
          {activeSteps.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor:
                  i < stepIndex
                    ? "#d97706"
                    : i === stepIndex
                    ? "#f59e0b"
                    : "#e7e5e4",
              }}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Step content */}
      {renderStep()}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

type OptionCardProps = {
  label: string;
  sublabel?: string;
  emoji?: string;
  selected: boolean;
  recommended?: boolean;
  overlap?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function OptionCard({
  label,
  sublabel,
  emoji,
  selected,
  recommended,
  overlap,
  disabled,
  onClick,
}: OptionCardProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border text-left transition-all duration-200 ${
        selected
          ? "border-amber-400 bg-amber-50 shadow-sm"
          : disabled
          ? "border-stone-100 opacity-40 cursor-not-allowed"
          : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm"
      }`}
      aria-pressed={selected}
    >
      {/* Selected checkmark */}
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      {/* Recommended badge */}
      {recommended && !selected && (
        <span className="absolute top-3 right-3 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
          Suggested
        </span>
      )}

      {/* Overlap badge — double-archetype interest */}
      {overlap && (
        <span className="absolute top-3 right-3 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
          Strong match
        </span>
      )}

      <div className="flex gap-3 items-center pr-6">
        {emoji && (
          <span className="text-2xl leading-none" aria-hidden="true">
            {emoji}
          </span>
        )}
        <div>
          <div className="text-base font-semibold text-stone-900 leading-tight">
            {label}
          </div>
          {sublabel && (
            <div className="text-xs text-stone-400 mt-0.5">{sublabel}</div>
          )}
        </div>
      </div>
    </button>
  );
}

type NavRowProps = {
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  showBack: boolean;
  showSkip?: boolean;
  canProceed: boolean;
  isLast: boolean;
};

function NavRow({
  onBack,
  onNext,
  onSkip,
  showBack,
  showSkip,
  canProceed,
  isLast,
}: NavRowProps) {
  return (
    <div className="flex gap-3 mt-8">
      {showBack && (
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-2xl text-stone-500 font-medium hover:text-stone-800 hover:bg-stone-100 transition-all"
        >
          ← Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="flex-1 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        {isLast ? "Find Gifts" : "Continue"}
      </button>
      {showSkip && onSkip && (
        <button
          onClick={onSkip}
          className="px-5 py-3 text-stone-400 hover:text-stone-600 text-sm font-medium transition-all"
        >
          Skip
        </button>
      )}
    </div>
  );
}