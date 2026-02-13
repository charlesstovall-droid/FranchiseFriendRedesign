import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
  id: string;
  section: string;
  text: string;
  options: { label: string; score: number }[];
}

const questions: Question[] = [
  {
    id: "q1",
    section: "Your Goals & Motivation",
    text: "What is your primary motivation for exploring franchise ownership?",
    options: [
      { label: "I want to build long-term wealth and equity", score: 5 },
      { label: "I want more control over my schedule and lifestyle", score: 4 },
      { label: "I'm looking for a career change with less corporate stress", score: 4 },
      { label: "I want to leave a legacy for my family", score: 5 },
      { label: "I'm just curious—not sure yet", score: 2 },
    ],
  },
  {
    id: "q2",
    section: "Your Goals & Motivation",
    text: "How soon are you looking to make a transition into business ownership?",
    options: [
      { label: "Within the next 3 months", score: 5 },
      { label: "Within 6 months", score: 4 },
      { label: "Within 12 months", score: 3 },
      { label: "1-2 years from now", score: 2 },
      { label: "Just exploring for now", score: 1 },
    ],
  },
  {
    id: "q3",
    section: "Financial Readiness",
    text: "What is your approximate liquid capital available for investment? (Cash, savings, stocks—not including home equity)",
    options: [
      { label: "Under $50,000", score: 1 },
      { label: "$50,000 – $100,000", score: 3 },
      { label: "$100,000 – $250,000", score: 4 },
      { label: "$250,000 – $500,000", score: 5 },
      { label: "$500,000+", score: 5 },
    ],
  },
  {
    id: "q4",
    section: "Financial Readiness",
    text: "Are you comfortable using SBA loans, 401(k) rollovers (ROBS), or other financing to fund a franchise?",
    options: [
      { label: "Yes, I'm open to financing options", score: 5 },
      { label: "I'd like to learn more about financing", score: 4 },
      { label: "I'd prefer to self-fund entirely", score: 3 },
      { label: "I'm not sure about taking on debt", score: 2 },
    ],
  },
  {
    id: "q5",
    section: "Skills & Experience",
    text: "What best describes your professional background?",
    options: [
      { label: "C-Suite / VP / Senior Executive", score: 5 },
      { label: "Mid-level management / Director", score: 4 },
      { label: "Sales or business development", score: 4 },
      { label: "Technical / Engineering / Operations", score: 3 },
      { label: "Other professional background", score: 3 },
    ],
  },
  {
    id: "q6",
    section: "Skills & Experience",
    text: "Have you ever managed a team of 5 or more people?",
    options: [
      { label: "Yes, I've managed large teams (20+)", score: 5 },
      { label: "Yes, teams of 5-20 people", score: 4 },
      { label: "Small teams (under 5)", score: 3 },
      { label: "No direct team management experience", score: 2 },
    ],
  },
  {
    id: "q7",
    section: "Lifestyle & Preferences",
    text: "What level of involvement are you looking for?",
    options: [
      { label: "Full-time, hands-on owner-operator", score: 5 },
      { label: "Semi-absentee (10-20 hours/week with a manager)", score: 4 },
      { label: "Passive investor with minimal involvement", score: 2 },
      { label: "I'm not sure yet", score: 3 },
    ],
  },
  {
    id: "q8",
    section: "Lifestyle & Preferences",
    text: "Which industry interests you most?",
    options: [
      { label: "Home services (cleaning, restoration, painting)", score: 4 },
      { label: "Health & fitness / Senior care", score: 4 },
      { label: "Food & beverage", score: 3 },
      { label: "B2B services (staffing, consulting, marketing)", score: 4 },
      { label: "I'm open to anything that fits my goals", score: 5 },
    ],
  },
  {
    id: "q9",
    section: "Readiness & Mindset",
    text: "How do you feel about following a proven system (rather than creating your own)?",
    options: [
      { label: "I love the idea—that's why franchising appeals to me", score: 5 },
      { label: "I'm open to it but want some flexibility", score: 4 },
      { label: "I'd prefer to build something completely on my own", score: 1 },
      { label: "Not sure—I need to learn more", score: 3 },
    ],
  },
  {
    id: "q10",
    section: "Readiness & Mindset",
    text: "Do you have support from your spouse/partner (if applicable) in exploring franchise ownership?",
    options: [
      { label: "Yes, fully supportive", score: 5 },
      { label: "Mostly supportive—still discussing", score: 4 },
      { label: "Not yet—haven't brought it up", score: 2 },
      { label: "N/A—making this decision independently", score: 4 },
    ],
  },
];

function getVerdict(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct >= 80) return { label: "Excellent Franchise Candidate", color: "text-emerald-600", desc: "You have the ideal combination of financial readiness, professional experience, and mindset for franchise ownership. You're in a strong position to explore opportunities." };
  if (pct >= 60) return { label: "Strong Potential Candidate", color: "text-[#D4AF37]", desc: "You have many of the key attributes for successful franchise ownership. A few areas may benefit from further exploration, and a consultation can help clarify your path." };
  if (pct >= 40) return { label: "Promising—Needs Exploration", color: "text-blue-500", desc: "There's potential here, but some factors need further development. A free consultation can help you understand your options and create a timeline." };
  return { label: "Early Stage Explorer", color: "text-gray-500", desc: "You're in the early stages of exploring franchise ownership. That's perfectly okay—everyone starts somewhere. A conversation can help you understand what's needed." };
}

export default function FranchiseAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { index: number; score: number }>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);
  const emailSentRef = useRef(false);

  const params = new URLSearchParams(window.location.search);
  const userName = params.get("name") || "";
  const userEmail = params.get("email") || "";

  const totalSteps = questions.length;
  const progress = showResults ? 100 : started ? ((currentStep + 1) / (totalSteps + 1)) * 100 : 0;
  const maxScore = questions.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0);
  const totalScore = Object.values(answers).reduce((a, b) => a + b.score, 0);

  const sectionScores = useMemo(() => {
    const sections: Record<string, { earned: number; max: number }> = {};
    questions.forEach((q) => {
      if (!sections[q.section]) sections[q.section] = { earned: 0, max: 0 };
      sections[q.section].max += Math.max(...q.options.map(o => o.score));
      if (answers[q.id] !== undefined) sections[q.section].earned += answers[q.id].score;
    });
    return sections;
  }, [answers]);

  const handleSelect = (questionId: string, index: number, score: number) => {
    setAnswers({ ...answers, [questionId]: { index, score } });
  };

  const canProceed = answers[questions[currentStep]?.id] !== undefined;

  const next = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
    else setShowResults(true);
  };

  const prev = () => {
    if (showResults) { setShowResults(false); return; }
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else setStarted(false);
  };

  const verdict = getVerdict(totalScore, maxScore);
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  useEffect(() => {
    if (showResults && userEmail && !emailSentRef.current) {
      emailSentRef.current = true;
      fetch("/api/assessment-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          scorePercent,
          verdict: verdict.label,
          sectionScores,
        }),
      }).catch((err) => console.error("Failed to send assessment results:", err));
    }
  }, [showResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E5E7EB] pb-16">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C19A2E]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-16">
        <AnimatePresence mode="wait">
          {!showResults ? (
            !started ? (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-[42px] font-serif font-bold text-[#1B2B3A] mb-4 leading-tight">
                    Your Franchise Fit Assessment
                  </h1>
                  <p className="text-lg text-gray-500">Discover how ready you are for franchise ownership in just 3 minutes.</p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-8">
                  <div className="bg-[#F5F7FA] rounded-xl p-6 mb-8">
                    <div className="flex gap-4 items-center mb-4 pb-4 border-b border-gray-200">
                      <img src="/charles-headshot.jpeg" alt="Charles Stovall" className="w-14 h-14 rounded-full border-[3px] border-[#D4AF37] object-cover" />
                      <div>
                        <p className="font-semibold text-[#1B2B3A]">Charles Stovall</p>
                        <p className="text-sm text-gray-500">Franchise Advisor</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      This quick assessment will help us both understand where you stand on the path to franchise ownership. There are no right or wrong answers—just honest ones.
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      It takes about 3 minutes and covers your goals, finances, experience, and readiness.
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {["Your Goals & Motivation", "Financial Readiness", "Skills & Experience", "Lifestyle Preferences", "Readiness & Mindset"].map((area, i) => (
                      <li key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3">
                        <span className="text-[#D4AF37] font-bold">✦</span>
                        <span className="text-[#1B2B3A] font-medium">{area}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setStarted(true)}
                    className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] text-[#1B2B3A] font-bold text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                    data-testid="button-start-assessment"
                  >
                    Start My Assessment
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4">🔒 Your responses are 100% confidential</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`q-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mt-8">
                  <div className="mb-8">
                    <p className="text-[#D4AF37] text-xs font-bold tracking-[2px] uppercase mb-3">
                      {questions[currentStep].section} — Question {currentStep + 1} of {totalSteps}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1B2B3A] leading-snug">
                      {questions[currentStep].text}
                    </h2>
                  </div>

                  <div className="space-y-3 mb-10">
                    {questions[currentStep].options.map((opt, i) => {
                      const isSelected = answers[questions[currentStep].id]?.index === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(questions[currentStep].id, i, opt.score)}
                          className={`w-full text-left flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-[#D4AF37] bg-[#D4AF37]/5"
                              : "border-gray-200 hover:border-[#D4AF37]/50 hover:bg-gray-50"
                          }`}
                          data-testid={`option-q${currentStep + 1}-${i}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-[#D4AF37] bg-[#D4AF37]" : "border-gray-300"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={`text-base ${isSelected ? "text-[#1B2B3A] font-semibold" : "text-gray-600"}`}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-[1fr_2fr] gap-4">
                    <button
                      onClick={prev}
                      className="h-14 bg-gray-100 hover:bg-gray-200 text-[#1B2B3A] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={next}
                      disabled={!canProceed}
                      className="h-14 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] text-[#1B2B3A] font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-30 flex items-center justify-center gap-2"
                      data-testid="button-next-question"
                    >
                      {currentStep === totalSteps - 1 ? "See My Results" : "Continue"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="max-w-2xl mx-auto mt-8">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1B2B3A] text-center mb-4">Your Assessment Results</h1>
                {userEmail && (
                  <p className="text-center text-emerald-600 text-sm mb-10">A copy of this report has been sent to {userEmail}</p>
                )}

                <div className="text-center mb-12">
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C19A2E] flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(212,175,55,0.3)]">
                    <span className="text-6xl font-serif font-bold text-white leading-none">{scorePercent}</span>
                    <span className="text-sm text-white/90 mt-1">out of 100</span>
                  </div>
                  <h2 className={`text-2xl font-serif font-bold mb-3 ${verdict.color}`}>{verdict.label}</h2>
                  <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">{verdict.desc}</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                  <h3 className="text-xl font-serif font-bold text-[#1B2B3A] mb-6">Score Breakdown</h3>
                  {Object.entries(sectionScores).map(([section, data]) => {
                    const pct = Math.round((data.earned / data.max) * 100);
                    return (
                      <div key={section} className="mb-6 last:mb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-[#1B2B3A]">{section}</span>
                          <span className="font-bold text-[#D4AF37]">{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#F5F7FA] rounded-2xl p-8 mb-8">
                  <h3 className="text-xl font-serif font-bold text-[#1B2B3A] mb-5">Recommended Next Steps</h3>
                  <ul className="space-y-3">
                    {[
                      "Schedule your free 30-minute strategy call with Charles",
                      "Receive 3-5 personalized franchise matches based on your profile",
                      "Review detailed financials and validation data",
                      "Make a confident, informed decision on your terms",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#1B2B3A] to-[#0F1922] rounded-2xl p-8 md:p-10 text-center">
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">Ready to Take the Next Step?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Book a free 30-minute call with Charles to review your results and explore franchise opportunities tailored to your goals.
                  </p>
                  <a
                    href="/executive-access"
                    className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] text-[#1B2B3A] font-bold text-base py-4 px-10 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                    data-testid="button-book-call-results"
                  >
                    Book My Free Strategy Call
                  </a>
                  <p className="text-sm text-gray-400 mt-5 italic">
                    No pressure. No obligation. Just an honest conversation about your future.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
