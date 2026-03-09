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

const FEEDBACK_DISPLAY_DURATION = 900; // ms - matches animation duration
const LOADING_SCREEN_DURATION = 2500; // ms - creates labor illusion

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

  // Fix: Use useEffect to prevent infinite re-render
  useEffect(() => {
    if (initialAnswers?.partner_id && !isEditingProfile) {
      setIsEditingProfile(true);
    }
  }, [initialAnswers?.partner_id]);

  // Helper: Calculate days until date
  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Helper: Get next holiday date
  const getNextHolidayDate = (month: number, day: number): string => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let targetDate = new Date(currentYear, month - 1, day);

    if (targetDate < today) {
      targetDate.setFullYear(currentYear + 1);
    }
    return targetDate.toISOString().split("T")[0];
  };

  // Helper: Get min/max dates for date input
  const getDateLimits = () => {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const maxDate = oneYearFromNow.toISOString().split('T')[0];

    return { minDate, maxDate };
  };

  const questions: Question[] = [
    {
      id: "occasion",
      question: "🎉 What are we celebrating?",
      subtitle: "Every great gift starts with a good reason.",
      type: "single",
      tagCategory: "occasions",
      options: [
        { label: "Birthday", value: "birthday", emoji: "🎂", feedback: "🎉 Nice — birthdays are always fun to shop for." },
        { label: "Anniversary", value: "anniversary", emoji: "💝", feedback: "💝 Love is in the air! Let's find something special." },
        { label: "Valentine's Day", value: "valentines", emoji: "❤️", feedback: "❤️ Time to play cupid." },
        { label: "Holiday / Christmas", value: "christmas", emoji: "🎄", feedback: "🎄 Tis the season for great gifts!" },
        { label: "Wedding / Engagement", value: "wedding", emoji: "💍", feedback: "💍 A beautiful milestone to celebrate." },
        { label: "Graduation", value: "graduation", emoji: "🎓", feedback: "🎓 A huge achievement deserves a great reward." },
        { label: "Just Because", value: "just_because", emoji: "✨", feedback: "✨ The best kind of gifts are the unexpected ones." },
      ],
    },
    {
      id: "occasion_date",
      question: "📅 When is the big day?",
      subtitle: "We'll make sure the gift arrives on time.",
      type: "date",
      tagCategory: "lead_time",
      skipable: true,
      optional: true,
    },
    {
      id: "recipient",
      question: "👀 Who's the lucky person?",
      subtitle: "We'll tailor gift ideas based on your relationship.",
      type: "single",
      tagCategory: "recipient",
      options: [
        { label: "Romantic Partner", value: { gender: "unisex", relationship: "partner" }, emoji: "💑", feedback: "💑 We'll find something perfect for your other half." },
        { label: "Boyfriend", value: { gender: "male", relationship: "boyfriend" }, emoji: "👨", feedback: "👨 Let's get him something he'll actually use." },
        { label: "Girlfriend", value: { gender: "female", relationship: "girlfriend" }, emoji: "👩", feedback: "👩 She's going to love what we find." },
        { label: "Spouse", value: { gender: "unisex", relationship: "spouse" }, emoji: "💍", feedback: "💍 For your forever person." },
        { label: "Close Friend", value: { gender: "unisex", relationship: "friend" }, emoji: "👥", feedback: "👥 Because best friends deserve the best." },
        { label: "Family Member", value: { gender: "unisex", relationship: "family" }, emoji: "👨‍👩‍👧", feedback: "👨‍👩‍👧 Family first! Let's find a winner." },
      ],
    },
    {
      id: "partner_name",
      question: "✨ What's their name?",
      subtitle: "Optional — helps us personalize recommendations.",
      type: "text",
      tagCategory: "partner_info",
      optional: true,
      skipable: true,
    },
    {
      id: "budget",
      question: "💸 What's your budget looking like?",
      subtitle: "Amazing gifts exist at every price point.",
      type: "single",
      tagCategory: "max_price",
      options: [
        { label: "Under $25", value: 25, sublabel: "Small but thoughtful", emoji: "💸", feedback: "💸 Proof that great things come in small packages." },
        { label: "$25 - $50", value: 50, sublabel: "A great sweet spot", emoji: "💵", feedback: "💵 The perfect sweet spot for thoughtful gifts." },
        { label: "$50 - $100", value: 100, sublabel: "A little more special", emoji: "💳", feedback: "💳 Nice. We've got some amazing options in this range." },
        { label: "$100 - $200", value: 200, sublabel: "For bigger moments", emoji: "💎", feedback: "💎 Ooh, going for something extra special!" },
        { label: "$200+", value: 999999, sublabel: "Go all out", emoji: "🌟", feedback: "🌟 Sky's the limit! Let's find something unforgettable." },
      ],
    },
    {
      id: "interests",
      question: "🧠 What are they into?",
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
      question: "🎁 What kind of gift do you want to give?",
      subtitle: "Go with your instinct.",
      type: "single",
      tagCategory: "vibe_personality",
      options: [
        { label: "Something meaningful", value: { vibe: ["romantic"], personality: ["sentimental"] }, emoji: "💖", feedback: "💖 Get the tissues ready." },
        { label: "Something fun", value: { vibe: ["fun"], personality: ["extroverted"] }, emoji: "🎉", feedback: "🎉 Let's bring the good times!" },
        { label: "Something useful", value: { vibe: ["practical"], personality: ["organized"] }, emoji: "🛠️", feedback: "🛠️ Practical gifts are always a win." },
        { label: "Something impressive", value: { vibe: ["luxury"], personality: ["curious"] }, emoji: "✨", feedback: "✨ Prepare for some dropped jaws." },
        { label: "Something creative", value: { vibe: ["creative"], personality: ["creative"] }, emoji: "🎨", feedback: "🎨 Love that. Let's think outside the box." },
        { label: "Something relaxing", value: { vibe: ["cozy"], personality: ["relaxed"] }, emoji: "🌿", feedback: "🌿 Ahh... time to help them unwind." },
      ],
    },
  ];

  const currentQuestion = questions[step];
  const isMultiSelect = currentQuestion.type === "multi";
  const maxSelections = currentQuestion.max || 5;

  // Trigger completion with loading screen
  const triggerCompletion = (finalAnswers: QuizAnswers) => {
    setIsFindingGifts(true);
    setTimeout(() => {
      onComplete(finalAnswers);
    }, LOADING_SCREEN_DURATION);
  };

  // Handle option selection
  const handleSelect = (value: OptionValue, feedbackMsg?: string) => {
    // Validation
    if (value === undefined && currentQuestion.id !== "occasion_date") {
      return;
    }

    let newAnswers = { ...answers };

    try {
      // Handle each question type
      if (currentQuestion.id === "occasion") {
        const occasionValue = value as string;
        let dateToPreFill: string | undefined;
        let daysUntil: number | undefined;

        if (occasionValue === "christmas") {
          dateToPreFill = getNextHolidayDate(12, 25);
        } else if (occasionValue === "valentines") {
          dateToPreFill = getNextHolidayDate(2, 14);
        }

        if (dateToPreFill) {
          daysUntil = getDaysUntil(dateToPreFill);
        }

        newAnswers = {
          ...newAnswers,
          occasion: occasionValue,
          occasion_date: dateToPreFill,
          days_until_needed: daysUntil,
        };
      } else if (currentQuestion.id === "occasion_date") {
        const dateValue = value as string;
        if (dateValue) {
          const daysUntil = getDaysUntil(dateValue);
          newAnswers = {
            ...newAnswers,
            occasion_date: dateValue,
            days_until_needed: daysUntil,
          };
        } else {
          newAnswers = {
            ...newAnswers,
            occasion_date: undefined,
            days_until_needed: undefined,
          };
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
        newAnswers = {
          ...newAnswers,
          vibe: intentValue.vibe,
          personality: intentValue.personality,
        };
      }

      setAnswers(newAnswers);
      setError(null);

      // Auto-advance for single-select questions
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

  // Check if option is selected
  const isSelected = (value: OptionValue): boolean => {
    if (currentQuestion.id === "occasion") return answers.occasion === value;
    if (currentQuestion.id === "recipient")
      return JSON.stringify(answers.recipient) === JSON.stringify(value);
    if (currentQuestion.id === "budget") return answers.max_price === value;
    if (currentQuestion.id === "interests")
      return answers.interests?.includes(value as string) || false;
    if (currentQuestion.id === "intent") {
      const intentValue = value as { vibe: string[]; personality: string[] };
      return JSON.stringify(answers.vibe) === JSON.stringify(intentValue.vibe);
    }
    return false;
  };

  // Check if can proceed
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

  // Navigation handlers
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

  // Loading screen
  if (isFindingGifts) {
    return (
      <div className="w-full max-w-3xl mx-auto min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="text-6xl mb-6 animate-bounce">🎁</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Finding the perfect gifts...
        </h2>
        <div className="space-y-3 text-slate-500 font-medium animate-pulse">
          <p>Scanning thousands of ideas...</p>
          <p>Matching with their interests...</p>
          <p>Checking delivery times...</p>
        </div>
      </div>
    );
  }

  // Main quiz UI
  return (
    <div className="w-full max-w-3xl mx-auto min-h-[400px]">
      {isEditingProfile && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <p className="font-semibold text-blue-900">
            ✏️ Editing {answers.partner_name || "Profile"}'s Preferences
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-red-800 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Feedback animation */}
      {activeFeedback ? (
        <div className="flex items-center justify-center py-20 px-4 animate-pulse">
          <p className="text-2xl font-medium text-blue-600 text-center transition-opacity duration-300">
            {activeFeedback}
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {currentQuestion.question}
            </h2>
            <p className="text-slate-600">{currentQuestion.subtitle}</p>
            {isMultiSelect && (
              <p className="text-sm text-blue-600 mt-2">
                Selected: {selectedCount}/{maxSelections}
              </p>
            )}
          </div>

          {/* Text input */}
          {currentQuestion.type === "text" ? (
            <div className="mb-8 max-w-md">
              <label htmlFor="partner-name" className="sr-only">
                Recipient's Name
              </label>
              <input
                id="partner-name"
                type="text"
                value={answers.partner_name || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, partner_name: e.target.value })
                }
                placeholder="e.g., Sarah"
                maxLength={50}
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-lg focus:border-blue-500 outline-none"
                aria-label="Recipient's name (optional)"
                aria-required="false"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-2">Optional</p>
            </div>
          ) : currentQuestion.type === "date" ? (
            /* Date input */
            <div className="mb-8 max-w-md">
              <label htmlFor="occasion-date" className="sr-only">
                Occasion Date
              </label>
              <input
                id="occasion-date"
                type="date"
                value={answers.occasion_date || ""}
                onChange={(e) => handleSelect(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-lg focus:border-blue-500 outline-none"
                aria-label="Date of the occasion"
                aria-required="false"
              />
              <p className="text-xs text-slate-400 mt-2">
                Must be between today and one year from now
              </p>
            </div>
          ) : (
            /* Option buttons */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {currentQuestion.options?.map((option, idx) => {
                const selected = isSelected(option.value);
                const isDisabled = isMultiSelect && !selected && selectedCount >= maxSelections;

                return (
                  <button
                    key={idx}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleSelect(option.value, option.feedback)}
                    className={`p-4 rounded-xl border-2 text-left transition-all
                    ${
                      selected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : isDisabled
                        ? "border-slate-200 opacity-50 cursor-not-allowed"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                    aria-pressed={selected}
                    aria-label={option.label}
                  >
                    <div className="flex gap-3 items-center">
                      {option.emoji && (
                        <span className="text-2xl" aria-hidden="true">
                          {option.emoji}
                        </span>
                      )}
                      <div>
                        <div className="text-lg font-medium text-slate-900">
                          {option.label}
                        </div>
                        {option.sublabel && (
                          <div className="text-sm text-slate-500">{option.sublabel}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition"
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
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
                  aria-label={step < questions.length - 1 ? "Continue to next question" : "Find gifts"}
                >
                  {step < questions.length - 1 ? "Next →" : "✨ Find Gifts"}
                </button>

                {currentQuestion.skipable && (
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3 text-slate-500 hover:text-slate-700 underline transition"
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