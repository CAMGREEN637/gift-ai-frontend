"use client";

import { useState } from "react";

type Recipient = {
  gender?: string;
  relationship?: string;
};

type QuizAnswers = {
  occasion?: string;
  recipient?: Recipient;
  partner_name?: string; // NEW
  partner_id?: string; // NEW (for editing existing partners)
  interests?: string[];
  categories?: string[];
  vibe?: string[];
  personality?: string[];
  experience_level?: string;
  max_price?: number;
  occasion_date?: string;
  days_until_needed?: number;
};

type Option = {
  label: string;
  value: any;
  emoji?: string;
  sublabel?: string;
};

type Question = {
  id: string;
  question: string;
  subtitle: string;
  type: "single" | "multi" | "date" | "text"; // Added "text"
  tagCategory: string;
  max?: number;
  options?: Option[];
  skipable?: boolean;
  optional?: boolean; // NEW
};

type QuizProps = {
  onComplete: (answers: QuizAnswers) => void;
  initialAnswers?: QuizAnswers; // NEW: For pre-filling
};

export default function GiftQuiz({ onComplete, initialAnswers }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(
    initialAnswers || {
      recipient: {},
      interests: [],
      categories: [],
      vibe: [],
      personality: [],
    }
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Show banner if editing existing partner
  if (initialAnswers && initialAnswers.partner_id && !isEditingProfile) {
    setIsEditingProfile(true);
  }

  const getNextHolidayDate = (month: number, day: number): string => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let targetDate = new Date(currentYear, month - 1, day);
    if (targetDate < today) {
      targetDate.setFullYear(currentYear + 1);
    }
    return targetDate.toISOString().split('T')[0];
  };

  const questions: Question[] = [
    // Q1: Occasion
    {
      id: "occasion",
      question: "What's the occasion?",
      subtitle: "This helps us nail the vibe and price range",
      type: "single",
      tagCategory: "occasions",
      options: [
        { label: "Birthday", value: "birthday", emoji: "🎂" },
        { label: "Anniversary", value: "anniversary", emoji: "💝" },
        { label: "Valentine's Day", value: "valentines", emoji: "❤️" },
        { label: "Holiday / Christmas", value: "christmas", emoji: "🎄" },
        { label: "Wedding / Engagement", value: "wedding", emoji: "💍" },
        { label: "Graduation", value: "graduation", emoji: "🎓" },
        { label: "Just Because", value: "just_because", emoji: "✨" },
      ],
    },
    // Q2: Date
    {
      id: "occasion_date",
      question: "When is the big day?",
      subtitle: "We'll check shipping times to ensure it arrives",
      type: "date",
      tagCategory: "lead_time",
      skipable: true,
    },
    // Q3: Recipient
    {
      id: "recipient",
      question: "Who's this gift for?",
      subtitle: "We'll tailor suggestions to match your relationship",
      type: "single",
      tagCategory: "recipient",
      options: [
        { label: "Romantic Partner", value: { gender: "unisex", relationship: "partner" }, emoji: "💑" },
        { label: "Boyfriend", value: { gender: "male", relationship: "boyfriend" }, emoji: "👨" },
        { label: "Girlfriend", value: { gender: "female", relationship: "girlfriend" }, emoji: "👩" },
        { label: "Spouse", value: { gender: "unisex", relationship: "spouse" }, emoji: "💍" },
        { label: "Close Friend", value: { gender: "unisex", relationship: "friend" }, emoji: "👥" },
        { label: "Family Member", value: { gender: "unisex", relationship: "family" }, emoji: "👨‍👩‍👧" },
      ],
    },
    // Q4: Partner Name (NEW!)
    {
      id: "partner_name",
      question: "What's their name?",
      subtitle: "We'll personalize your recommendations (and you can save this profile for next time!)",
      type: "text",
      tagCategory: "partner_info",
      optional: true,
    },
    // Q5: Budget
    {
      id: "budget",
      question: "What's your budget?",
      subtitle: "We'll show you the best options in your price range",
      type: "single",
      tagCategory: "max_price",
      options: [
        { label: "Under $25", value: 25, sublabel: "Small but thoughtful", emoji: "💸" },
        { label: "$25 - $50", value: 50, sublabel: "Sweet spot for most gifts", emoji: "💵" },
        { label: "$50 - $100", value: 100, sublabel: "Go a bit bigger", emoji: "💳" },
        { label: "$100 - $200", value: 200, sublabel: "Special occasions", emoji: "💎" },
        { label: "$200+", value: 999999, sublabel: "No budget limit", emoji: "🌟" },
      ],
    },
    // Q6: Interests
    {
      id: "interests",
      question: "What do they love doing?",
      subtitle: "Pick up to 3 of their favorite activities",
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
    // Q7: Persona
    {
      id: "persona",
      question: "How would you describe their style?",
      subtitle: "Choose what feels most like them",
      type: "single",
      tagCategory: "vibe_personality",
      options: [
        {
          label: "Romantic & Sentimental",
          value: { vibe: ["romantic", "sentimental"], personality: ["sentimental"] },
          emoji: "🌹"
        },
        {
          label: "Practical & Organized",
          value: { vibe: ["practical"], personality: ["organized", "analytical"] },
          emoji: "🎯"
        },
        {
          label: "Luxury & Elegant",
          value: { vibe: ["luxury", "minimalist"], personality: ["curious"] },
          emoji: "✨"
        },
        {
          label: "Fun & Adventurous",
          value: { vibe: ["fun", "adventurous"], personality: ["extroverted", "adventurous"] },
          emoji: "🎉"
        },
        {
          label: "Cozy & Relaxed",
          value: { vibe: ["cozy"], personality: ["introverted", "relaxed"] },
          emoji: "🧘"
        },
        {
          label: "Creative & Artistic",
          value: { vibe: ["creative"], personality: ["creative", "curious"] },
          emoji: "🎨"
        },
      ],
    },
    // Q8: Categories
    {
      id: "categories",
      question: "What type of gift sounds best?",
      subtitle: "Pick 1-2 categories",
      type: "multi",
      max: 2,
      tagCategory: "categories",
      options: [
        { label: "Tech & Gadgets", value: "tech", emoji: "📱" },
        { label: "Home & Living", value: "home", emoji: "🏠" },
        { label: "Kitchen & Cooking", value: "kitchen", emoji: "🍴" },
        { label: "Fashion & Accessories", value: "fashion", emoji: "👔" },
        { label: "Beauty & Wellness", value: "beauty", emoji: "💅" },
        { label: "Fitness & Sports", value: "fitness", emoji: "💪" },
        { label: "Outdoors & Adventure", value: "outdoors", emoji: "🌲" },
        { label: "Hobbies & Crafts", value: "hobby", emoji: "🎨" },
        { label: "Books & Learning", value: "book", emoji: "📚" },
        { label: "Experiences", value: "experiences", emoji: "🎭" },
      ],
    },
    // Q9: Experience Level
    {
      id: "experience",
      question: "What's their experience level?",
      subtitle: "This helps us pick the right complexity",
      type: "single",
      tagCategory: "experience_level",
      options: [
        { label: "Just Starting Out", value: "beginner", emoji: "🌱" },
        { label: "Pretty Into It", value: "enthusiast", emoji: "⭐" },
        { label: "Total Expert", value: "expert", emoji: "🏆" },
      ],
    },
  ];

  const currentQuestion = questions[step];
  const isMultiSelect = currentQuestion.type === "multi";
  const maxSelections = currentQuestion.max || 5;

  const handleSelect = (value: any) => {
    if (currentQuestion.id === "occasion") {
      let dateToPreFill = undefined;
      let daysUntil = undefined;

      if (value === 'christmas') {
        dateToPreFill = getNextHolidayDate(12, 25);
      } else if (value === 'valentines') {
        dateToPreFill = getNextHolidayDate(2, 14);
      }

      if (dateToPreFill) {
        const target = new Date(dateToPreFill);
        const today = new Date();
        daysUntil = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }

      setAnswers({ ...answers, occasion: value, occasion_date: dateToPreFill, days_until_needed: daysUntil });
    }
    else if (currentQuestion.id === "occasion_date") {
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        const daysUntil = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        setAnswers({ ...answers, occasion_date: value, days_until_needed: daysUntil });
      } else {
        setAnswers({ ...answers, occasion_date: undefined, days_until_needed: undefined });
      }
    }
    else if (currentQuestion.id === "recipient") {
      setAnswers({ ...answers, recipient: value });
    }
    else if (currentQuestion.id === "partner_name") {
      setAnswers({ ...answers, partner_name: value });
    }
    else if (currentQuestion.id === "budget") {
      setAnswers({ ...answers, max_price: value });
    }
    else if (currentQuestion.id === "interests") {
      const current = answers.interests || [];
      if (current.includes(value)) {
        setAnswers({ ...answers, interests: current.filter(i => i !== value) });
      } else if (current.length < maxSelections) {
        setAnswers({ ...answers, interests: [...current, value] });
      }
    }
    else if (currentQuestion.id === "categories") {
      const current = answers.categories || [];
      if (current.includes(value)) {
        setAnswers({ ...answers, categories: current.filter(c => c !== value) });
      } else if (current.length < maxSelections) {
        setAnswers({ ...answers, categories: [...current, value] });
      }
    }
    else if (currentQuestion.id === "persona") {
      setAnswers({ ...answers, vibe: value.vibe, personality: value.personality });
    }
    else if (currentQuestion.id === "experience") {
      setAnswers({ ...answers, experience_level: value });
    }
  };

  const isSelected = (value: any) => {
    if (currentQuestion.id === "occasion") return answers.occasion === value;
    if (currentQuestion.id === "recipient") return JSON.stringify(answers.recipient) === JSON.stringify(value);
    if (currentQuestion.id === "budget") return answers.max_price === value;
    if (currentQuestion.id === "interests") return answers.interests?.includes(value);
    if (currentQuestion.id === "categories") return answers.categories?.includes(value);
    if (currentQuestion.id === "persona") return JSON.stringify(answers.vibe) === JSON.stringify(value.vibe);
    if (currentQuestion.id === "experience") return answers.experience_level === value;
    return false;
  };

  const canProceed = () => {
    if (currentQuestion.id === "occasion") return !!answers.occasion;
    if (currentQuestion.id === "occasion_date") return true;
    if (currentQuestion.id === "recipient") return !!answers.recipient?.relationship;
    if (currentQuestion.id === "partner_name") return true; // Optional
    if (currentQuestion.id === "budget") return !!answers.max_price;
    if (currentQuestion.id === "interests") return (answers.interests?.length || 0) > 0;
    if (currentQuestion.id === "categories") return (answers.categories?.length || 0) > 0;
    if (currentQuestion.id === "persona") return (answers.vibe?.length || 0) > 0;
    if (currentQuestion.id === "experience") return !!answers.experience_level;
    return false;
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const selectedCount = currentQuestion.id === "interests"
    ? answers.interests?.length || 0
    : currentQuestion.id === "categories"
    ? answers.categories?.length || 0
    : 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Editing Banner */}
      {isEditingProfile && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👤</span>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">
                Editing {answers.partner_name}'s Profile
              </p>
              <p className="text-sm text-blue-800">
                We've pre-filled their preferences. You can adjust anything before searching.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">
            Question {step + 1} of {questions.length}
          </span>
          <span className="text-sm text-slate-500">
            {Math.round(((step + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {currentQuestion.question}
        </h2>
        <p className="text-slate-600">
          {currentQuestion.subtitle}
        </p>
        {isMultiSelect && (
          <p className="text-sm text-blue-600 mt-2">
            Selected: {selectedCount}/{maxSelections}
          </p>
        )}
      </div>

      {/* Inputs */}
      {currentQuestion.type === "text" ? (
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={answers.partner_name || ''}
            onChange={(e) => setAnswers({ ...answers, partner_name: e.target.value })}
            placeholder="e.g., Sarah, Mom, Alex..."
            className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            autoFocus
          />

          {answers.partner_name && (
            <p className="mt-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
              ✓ Great! We'll find perfect gifts for {answers.partner_name}
            </p>
          )}

          {currentQuestion.optional && (
            <button
              onClick={() => handleNext()}
              className="w-full mt-4 px-4 py-3 text-slate-600 hover:text-slate-800 font-medium"
            >
              Skip - Don't personalize
            </button>
          )}
        </div>
      ) : currentQuestion.type === "date" ? (
        <div className="max-w-md mx-auto">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={answers.occasion_date || ''}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />

          {answers.days_until_needed !== undefined && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-900">
                {answers.days_until_needed > 0 ? (
                  <>
                    📦 <strong>{answers.days_until_needed} days</strong> until the big day.
                    We'll find gifts that arrive on time!
                  </>
                ) : (
                  <>
                    ⚠️ That's coming up soon! We'll prioritize fast shipping.
                  </>
                )}
              </p>
            </div>
          )}

          {currentQuestion.skipable && (
            <button
              onClick={() => handleSelect(null)}
              className="w-full mt-4 px-4 py-3 text-slate-500 hover:text-slate-700 text-sm font-medium transition"
            >
              Skip - No specific deadline
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {currentQuestion.options?.map((option, idx) => {
            const selected = isSelected(option.value);
            const isDisabled = isMultiSelect && !selected && selectedCount >= maxSelections;

            return (
              <button
                key={idx}
                onClick={() => !isDisabled && handleSelect(option.value)}
                disabled={isDisabled}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all
                  ${selected
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : isDisabled
                    ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {option.emoji && (
                    <span className="text-2xl">{option.emoji}</span>
                  )}
                  <div>
                    <div className="text-lg font-medium text-slate-900 leading-tight">
                      {option.label}
                    </div>
                    {option.sublabel && (
                      <div className="text-sm text-slate-500 mt-1">
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
      <div className="flex gap-4 mt-8">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
        >
          {step < questions.length - 1 ? 'Next →' : '✨ Find Gifts'}
        </button>
      </div>
    </div>
  );
}