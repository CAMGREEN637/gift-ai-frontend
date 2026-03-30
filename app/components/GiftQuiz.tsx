"use client";
import { useState, useEffect } from "react";

// --- Types ---
type Recipient = {
  gender?: string;
  relationship?: string;
};

type QuizAnswers = {
  occasion?: string;
  recipient?: Recipient;
  partner_name?: string;
  partner_id?: string;
  interests?: string[];
  vibe?: string[];
  personality?: string[];
  max_price?: number;
  occasion_date?: string;
  days_until_needed?: number;
};

type OptionValue =
  | string
  | number
  | Recipient
  | { vibe: string[]; personality: string[] };

type Option = {
  label: string;
  value: OptionValue;
  emoji?: string;
  sublabel?: string;
  feedback?: string;
};

type Question = {
  id: string;
  question: string;
  subtitle: string;
  type: "single" | "multi" | "date" | "text";
  tagCategory: string;
  max?: number;
  options?: Option[];
  skipable?: boolean;
  optional?: boolean;
};

type QuizProps = {
  onComplete: (answers: QuizAnswers) => void;
  initialAnswers?: QuizAnswers;
};

// --- Constants ---
const FEEDBACK_DISPLAY_DURATION = 1400;
const LOADING_SCREEN_DURATION = 2500;

// --- Component ---
export default function GiftQuiz({ onComplete, initialAnswers }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(
    initialAnswers || {
      recipient: {},
      interests: [],
      vibe: [],
      personality: [],
    }
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [isFindingGifts, setIsFindingGifts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialAnswers?.partner_id && !isEditingProfile) {
      setIsEditingProfile(true);
    }
  }, [initialAnswers?.partner_id]);

  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getNextHolidayDate = (month: number, day: number): string => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let targetDate = new Date(currentYear, month - 1, day);
    if (targetDate < today) {
      targetDate.setFullYear(currentYear + 1);
    }
    return targetDate.toISOString().split("T")[0];
  };

  const getDateLimits = () => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const maxDate = oneYearFromNow.toISOString().split("T")[0];
    return { minDate, maxDate };
  };

  const questions: Question[] = [
    {
      id: "occasion",
      question: "What are we celebrating?",
      subtitle: "Every great gift starts with a reason.",
      type: "single",
      tagCategory: "occasions",
      options: [
        { label: "Birthday", value: "birthday", emoji: "🎂", feedback: "Birthdays are always fun to shop for." },
        { label: "Anniversary", value: "anniversary", emoji: "💝", feedback: "Love is in the air. Let's find something special." },
        { label: "Valentine's Day", value: "valentines", emoji: "❤️", feedback: "Time to play cupid." },
        { label: "Holiday / Christmas", value: "christmas", emoji: "🎄", feedback: "Tis the season for great gifts." },
        { label: "Wedding / Engagement", value: "wedding", emoji: "💍", feedback: "A beautiful milestone to celebrate." },
        { label: "Graduation", value: "graduation", emoji: "🎓", feedback: "A huge achievement deserves a great reward." },
        { label: "Just Because", value: "just_because", emoji: "✨", feedback: "The best gifts are the unexpected ones." },
      ],
    },
    {
      id: "occasion_date",
      question: "When is the big day?",
      subtitle: "We'll make sure it arrives on time.",
      type: "date",
      tagCategory: "lead_time",
      skipable: true,
      optional: true,
    },
    {
      id: "recipient",
      question: "Who's the lucky person?",
      subtitle: "We'll tailor ideas based on your relationship.",
      type: "single",
      tagCategory: "recipient",
      options: [
        { label: "Romantic Partner", value: { gender: "unisex", relationship: "partner" }, emoji: "💑", feedback: "We'll find something perfect for your other half." },
        { label: "Boyfriend", value: { gender: "male", relationship: "boyfriend" }, emoji: "👨", feedback: "Let's get him something he'll actually use." },
        { label: "Girlfriend", value: { gender: "female", relationship: "girlfriend" }, emoji: "👩", feedback: "She's going to love what we find." },
        { label: "Spouse", value: { gender: "unisex", relationship: "spouse" }, emoji: "💍", feedback: "For your forever person." },
        { label: "Close Friend", value: { gender: "unisex", relationship: "friend" }, emoji: "👥", feedback: "Because best friends deserve the best." },
        { label: "Family Member", value: { gender: "unisex", relationship: "family" }, emoji: "👨‍👩‍👧", feedback: "Family first. Let's find a winner." },
      ],
    },
    {
      id: "partner_name",
      question: "What's their name?",
      subtitle: "Helps us personalize your recommendations.",
      type: "text",
      tagCategory: "partner_info",
      optional: true,
      skipable: true,
    },
    {
      id: "budget",
      question: "What's your budget?",
      subtitle: "Amazing gifts exist at every price point.",
      type: "single",
      tagCategory: "max_price",
      options: [
        { label: "Under $25", value: 25, sublabel: "Small but thoughtful", emoji: "💸", feedback: "Great things come in small packages." },
        { label: "$25 – $50", value: 50, sublabel: "A great sweet spot", emoji: "💵", feedback: "The perfect range for thoughtful gifts." },
        { label: "$50 – $100", value: 100, sublabel: "A little more special", emoji: "💳", feedback: "We've got some amazing options here." },
        { label: "$100 – $200", value: 200, sublabel: "For bigger moments", emoji: "💎", feedback: "Going for something extra special." },
        { label: "$200+", value: 999999, sublabel: "Go all out", emoji: "🌟", feedback: "Sky's the limit. Let's find something unforgettable." },
      ],
    },
    {
      id: "interests",
      question: "What are they into?",
      subtitle: "Pick up to 3 things they genuinely enjoy.",
      type: "multi",
      max: 3,
      tagCategory: "interests",
      options: [
        { label: "Coffee", value: "coffee", emoji: "☕" },
        { label: "Cooking", value: "cooking", emoji: "🍳" },
        { label: "Baking", value: "baking", emoji: "🧁" },
        { label: "Running", value: "running", emoji: "🏃" },
        { label: "Yoga", value: "yoga", emoji: "🧘" },
        { label: "Gaming", value: "gaming", emoji: "🎮" },
        { label: "Photography", value: "photography", emoji: "📸" },
        { label: "Music", value: "music", emoji: "🎵" },
        { label: "Travel", value: "travel", emoji: "✈️" },
        { label: "Reading", value: "reading", emoji: "📚" },
        { label: "Art", value: "art", emoji: "🎨" },
        { label: "Gardening", value: "gardening", emoji: "🌱" },
        { label: "Hiking", value: "hiking", emoji: "⛰️" },
        { label: "Camping", value: "camping", emoji: "🏕️" },
        { label: "Movies", value: "movies", emoji: "🎬" },
        { label: "Wine", value: "wine", emoji: "🍷" },
        { label: "Cocktails", value: "cocktails", emoji: "🍹" },
        { label: "Fashion", value: "fashion", emoji: "👗" },
        { label: "Skincare", value: "skincare", emoji: "✨" },
        { label: "Makeup", value: "makeup", emoji: "💄" },
      ],
    },
    {
      id: "intent",
      question: "What kind of gift do you want to give?",
      subtitle: "Go with your instinct.",
      type: "single",
      tagCategory: "vibe_personality",
      options: [
        { label: "Something meaningful", value: { vibe: ["romantic"], personality: ["sentimental"] }, emoji: "💖", feedback: "Get the tissues ready." },
        { label: "Something fun", value: { vibe: ["fun"], personality: ["extroverted"] }, emoji: "🎉", feedback: "Let's bring the good times." },
        { label: "Something useful", value: { vibe: ["practical"], personality: ["organized"] }, emoji: "🛠️", feedback: "Practical gifts are always a win." },
        { label: "Something impressive", value: { vibe: ["luxury"], personality: ["curious"] }, emoji: "✨", feedback: "Prepare for some dropped jaws." },
        { label: "Something creative", value: { vibe: ["creative"], personality: ["creative"] }, emoji: "🎨", feedback: "Let's think outside the box." },
        { label: "Something relaxing", value: { vibe: ["cozy"], personality: ["relaxed"] }, emoji: "🌿", feedback: "Time to help them unwind." },
      ],
    },
  ];

  const currentQuestion = questions[step];
  const isMultiSelect = currentQuestion.type === "multi";
  const maxSelections = currentQuestion.max || 5;

  const triggerCompletion = (finalAnswers: QuizAnswers) => {
    setIsFindingGifts(true);
    setTimeout(() => {
      onComplete(finalAnswers);
    }, LOADING_SCREEN_DURATION);
  };

  const handleSelect = (value: OptionValue, feedbackMsg?: string) => {
    if (value === undefined && currentQuestion.id !== "occasion_date") return;

    let newAnswers = { ...answers };

    try {
      if (currentQuestion.id === "occasion") {
        const occasionValue = value as string;
        let dateToPreFill: string | undefined;
        let daysUntil: number | undefined;
        if (occasionValue === "christmas") dateToPreFill = getNextHolidayDate(12, 25);
        else if (occasionValue === "valentines") dateToPreFill = getNextHolidayDate(2, 14);
        if (dateToPreFill) daysUntil = getDaysUntil(dateToPreFill);
        newAnswers = { ...newAnswers, occasion: occasionValue, occasion_date: dateToPreFill, days_until_needed: daysUntil };
      } else if (currentQuestion.id === "occasion_date") {
        const dateValue = value as string;
        if (dateValue) {
          const daysUntil = getDaysUntil(dateValue);
          newAnswers = { ...newAnswers, occasion_date: dateValue, days_until_needed: daysUntil };
        } else {
          newAnswers = { ...newAnswers, occasion_date: undefined, days_until_needed: undefined };
        }
      } else if (currentQuestion.id === "recipient") {
        newAnswers = { ...newAnswers, recipient: value as Recipient };
      } else if (currentQuestion.id === "partner_name") {
        newAnswers = { ...newAnswers, partner_name: value as string };
      } else if (currentQuestion.id === "budget") {
        newAnswers = { ...newAnswers, max_price: value as number };
      } else if (currentQuestion.id === "interests") {
        const interestValue = value as string;
        const current = newAnswers.interests || [];
        if (current.includes(interestValue)) {
          newAnswers.interests = current.filter((i) => i !== interestValue);
        } else if (current.length < maxSelections) {
          newAnswers.interests = [...current, interestValue];
        }
      } else if (currentQuestion.id === "intent") {
        const intentValue = value as { vibe: string[]; personality: string[] };
        newAnswers = { ...newAnswers, vibe: intentValue.vibe, personality: intentValue.personality };
      }

      setAnswers(newAnswers);
      setError(null);

      if (currentQuestion.type === "single" && feedbackMsg) {
        setActiveFeedback(feedbackMsg);
        setTimeout(() => {
          setActiveFeedback(null);
          if (step < questions.length - 1) {
            setStep(step + 1);
          } else {
            triggerCompletion(newAnswers);
          }
        }, FEEDBACK_DISPLAY_DURATION);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error handling selection:", err);
    }
  };

  const isSelected = (value: OptionValue): boolean => {
    if (currentQuestion.id === "occasion") return answers.occasion === value;
    if (currentQuestion.id === "recipient") return JSON.stringify(answers.recipient) === JSON.stringify(value);
    if (currentQuestion.id === "budget") return answers.max_price === value;
    if (currentQuestion.id === "interests") return answers.interests?.includes(value as string) || false;
    if (currentQuestion.id === "intent") {
      const intentValue = value as { vibe: string[]; personality: string[] };
      return JSON.stringify(answers.vibe) === JSON.stringify(intentValue.vibe);
    }
    return false;
  };

  const canProceed = (): boolean => {
    if (currentQuestion.optional) return true;
    if (currentQuestion.id === "occasion") return !!answers.occasion;
    if (currentQuestion.id === "occasion_date") return true;
    if (currentQuestion.id === "recipient") return !!answers.recipient?.relationship;
    if (currentQuestion.id === "partner_name") return true;
    if (currentQuestion.id === "budget") return !!answers.max_price;
    if (currentQuestion.id === "interests") return (answers.interests?.length || 0) > 0;
    if (currentQuestion.id === "intent") return (answers.vibe?.length || 0) > 0;
    return false;
  };

  const handleNext = () => {
    if (!canProceed() && !currentQuestion.optional) {
      setError("Please make a selection to continue.");
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
      setError(null);
    } else {
      triggerCompletion(answers);
    }
  };

  const handleSkip = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setError(null);
    } else {
      triggerCompletion(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setActiveFeedback(null);
      setError(null);
      setStep(step - 1);
    }
  };

  const selectedCount = currentQuestion.id === "interests" ? answers.interests?.length || 0 : 0;
  const { minDate, maxDate } = getDateLimits();
  const progressPercent = ((step + 1) / questions.length) * 100;

  // --- Loading Screen ---
  if (isFindingGifts) {
    const steps = [
      { icon: "🔍", text: "Scanning thousands of ideas" },
      { icon: "💡", text: "Matching with their interests" },
      { icon: "📦", text: "Checking delivery times" },
    ];
    return (
      <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div
          className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-500 mb-8"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <h2 className="text-3xl font-serif text-stone-900 mb-8 tracking-tight">
          Finding the perfect gifts…
        </h2>
        <div className="space-y-4 w-full max-w-xs">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-left text-stone-500"
              style={{
                animation: `fadeSlideIn 0.5s ease forwards`,
                animationDelay: `${i * 0.6}s`,
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
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[400px]">
      {/* Editing profile banner */}
      {isEditingProfile && (
        <div className="mb-6 px-5 py-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2">
          <span className="text-amber-600 text-sm">✏️</span>
          <p className="text-sm font-medium text-amber-800">
            Editing {answers.partner_name || "profile"}'s preferences
          </p>
        </div>
      )}

      {/* Step dots progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Step {step + 1} of {questions.length}
          </span>
          <span className="text-xs font-semibold text-stone-400">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i < step ? "#d97706" : i === step ? "#f59e0b" : "#e7e5e4",
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

      {/* Feedback overlay */}
      {activeFeedback ? (
        <div className="flex items-center justify-center py-24 px-4">
          <p
            className="text-2xl font-serif text-stone-800 text-center"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
          >
            {activeFeedback}
          </p>
          <style>{`
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      ) : (
        <div>
          {/* Question header */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-stone-900 mb-2 tracking-tight leading-snug">
              {currentQuestion.question}
            </h2>
            <p className="text-stone-500 text-base">{currentQuestion.subtitle}</p>
            {isMultiSelect && (
              <p className="text-sm text-amber-600 font-medium mt-2">
                {selectedCount} of {maxSelections} selected
              </p>
            )}
          </div>

          {/* Text input */}
          {currentQuestion.type === "text" && (
            <div className="mb-8 max-w-sm">
              <input
                id="partner-name"
                type="text"
                value={answers.partner_name || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, partner_name: e.target.value })
                }
                placeholder="e.g., Sarah"
                maxLength={50}
                className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-lg text-stone-900 placeholder-stone-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                aria-label="Recipient's name (optional)"
                autoFocus
              />
              <p className="text-xs text-stone-400 mt-2">Optional — skip if you prefer</p>
            </div>
          )}

          {/* Date input */}
          {currentQuestion.type === "date" && (
            <div className="mb-8 max-w-sm">
              <input
                id="occasion-date"
                type="date"
                value={answers.occasion_date || ""}
                onChange={(e) => handleSelect(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-lg text-stone-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                aria-label="Date of the occasion"
              />
              <p className="text-xs text-stone-400 mt-2">Must be within the next year</p>
            </div>
          )}

          {/* Option grid */}
          {(currentQuestion.type === "single" || currentQuestion.type === "multi") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {currentQuestion.options?.map((option, idx) => {
                const selected = isSelected(option.value);
                const isDisabled =
                  isMultiSelect && !selected && selectedCount >= maxSelections;

                return (
                  <button
                    key={idx}
                    disabled={isDisabled}
                    onClick={() =>
                      !isDisabled && handleSelect(option.value, option.feedback)
                    }
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-200 group ${
                      selected
                        ? "border-amber-400 bg-amber-50 shadow-sm"
                        : isDisabled
                        ? "border-stone-100 opacity-40 cursor-not-allowed"
                        : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm"
                    }`}
                    aria-pressed={selected}
                    aria-label={option.label}
                  >
                    {/* Checkmark for selected */}
                    {selected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}

                    <div className="flex gap-3 items-center pr-6">
                      {option.emoji && (
                        <span className="text-2xl leading-none" aria-hidden="true">
                          {option.emoji}
                        </span>
                      )}
                      <div>
                        <div className="text-base font-semibold text-stone-900 leading-tight">
                          {option.label}
                        </div>
                        {option.sublabel && (
                          <div className="text-xs text-stone-400 mt-0.5">
                            {option.sublabel}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-5 py-3 rounded-2xl text-stone-500 font-medium hover:text-stone-800 hover:bg-stone-100 transition-all"
                aria-label="Go back to previous question"
              >
                ← Back
              </button>
            )}

            {currentQuestion.type !== "single" && (
              <>
                <button
                  onClick={handleNext}
                  disabled={!canProceed() && !currentQuestion.optional}
                  className="flex-1 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label={
                    step < questions.length - 1
                      ? "Continue to next question"
                      : "Find gifts"
                  }
                >
                  {step < questions.length - 1 ? "Continue" : "Find Gifts"}
                </button>
                {currentQuestion.skipable && (
                  <button
                    onClick={handleSkip}
                    className="px-5 py-3 text-stone-400 hover:text-stone-600 text-sm font-medium transition-all"
                    aria-label="Skip this question"
                  >
                    Skip
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}