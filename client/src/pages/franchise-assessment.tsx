import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, ChevronRight, Shield, Clock, Target, TrendingUp, Award, Briefcase, DollarSign, Heart, Brain } from "lucide-react";

interface Question {
  id: string;
  section: string;
  sectionIcon: string;
  text: string;
  options: { label: string; score: number; insight: string }[];
}

const questions: Question[] = [
  {
    id: "q1",
    section: "Your Goals & Motivation",
    sectionIcon: "target",
    text: "What is your primary motivation for exploring franchise ownership?",
    options: [
      { label: "I want to build long-term wealth and equity", score: 5, insight: "Wealth-building through franchising is one of the most proven paths. Franchisees in the top quartile often achieve 20%+ ROI." },
      { label: "I want more control over my schedule and lifestyle", score: 4, insight: "Semi-absentee franchise models are designed exactly for this — many owners manage 10-20 hrs/week." },
      { label: "I'm looking for a career change with less corporate stress", score: 4, insight: "You're not alone — 67% of franchise owners cite 'escaping corporate' as their #1 driver." },
      { label: "I want to leave a legacy for my family", score: 5, insight: "Multi-generational franchise ownership is a growing trend. Many brands actively support succession planning." },
      { label: "I'm just curious — not sure yet", score: 2, insight: "Curiosity is the first step. Let's see where your profile lands — you might be more ready than you think." },
    ],
  },
  {
    id: "q2",
    section: "Your Goals & Motivation",
    sectionIcon: "target",
    text: "How soon are you looking to make a transition into business ownership?",
    options: [
      { label: "Within the next 3 months", score: 5, insight: "Excellent urgency. Most franchise agreements close within 60-90 days once you've identified the right brand." },
      { label: "Within 6 months", score: 4, insight: "A 6-month timeline is ideal for thorough due diligence while maintaining momentum." },
      { label: "Within 12 months", score: 3, insight: "A year gives you time to build capital and explore multiple brands strategically." },
      { label: "1-2 years from now", score: 2, insight: "Smart to plan ahead. Use this time to strengthen your financial position and narrow your focus." },
      { label: "Just exploring for now", score: 1, insight: "No pressure — understanding your readiness now will save you time when you're ready to move." },
    ],
  },
  {
    id: "q3",
    section: "Financial Readiness",
    sectionIcon: "dollar",
    text: "What is your approximate liquid capital available for investment?",
    options: [
      { label: "Under $50,000", score: 1, insight: "Some lower-investment franchises start under $50K, especially in home services and mobile concepts." },
      { label: "$50,000 – $100,000", score: 3, insight: "This range opens doors to 40%+ of franchise brands, especially in service-based industries." },
      { label: "$100,000 – $250,000", score: 4, insight: "Great! $100K+ liquidity opens doors to the Top 50 service franchises with strong unit economics." },
      { label: "$250,000 – $500,000", score: 5, insight: "This positions you for premium, multi-unit opportunities with the highest earnings potential." },
      { label: "$500,000+", score: 5, insight: "You're in an elite position. Multi-unit and area development deals could accelerate your ROI significantly." },
    ],
  },
  {
    id: "q4",
    section: "Financial Readiness",
    sectionIcon: "dollar",
    text: "Are you comfortable using SBA loans, 401(k) rollovers (ROBS), or other financing?",
    options: [
      { label: "Yes, I'm open to financing options", score: 5, insight: "Smart approach. SBA loans offer favorable terms, and ROBS lets you use retirement funds tax-penalty free." },
      { label: "I'd like to learn more about financing", score: 4, insight: "We'll walk you through every option. Many franchisees use a combination of personal capital and financing." },
      { label: "I'd prefer to self-fund entirely", score: 3, insight: "Self-funding gives you maximum flexibility and no debt service — a strong position to negotiate from." },
      { label: "I'm not sure about taking on debt", score: 2, insight: "Understandable concern. Many successful franchise models can cash-flow debt service from month one." },
    ],
  },
  {
    id: "q5",
    section: "Skills & Experience",
    sectionIcon: "briefcase",
    text: "What best describes your professional background?",
    options: [
      { label: "C-Suite / VP / Senior Executive", score: 5, insight: "Executive experience translates directly to franchise success — leadership, systems thinking, and strategic planning." },
      { label: "Mid-level management / Director", score: 4, insight: "Management experience is one of the strongest predictors of franchise success. You're well-positioned." },
      { label: "Sales or business development", score: 4, insight: "Sales skills are gold in franchising. Your ability to build relationships and drive revenue is a major asset." },
      { label: "Technical / Engineering / Operations", score: 3, insight: "Operational excellence drives franchise profitability. Your process-oriented mindset is highly valuable." },
      { label: "Other professional background", score: 3, insight: "Diverse backgrounds bring unique strengths. The franchise system provides the business framework you need." },
    ],
  },
  {
    id: "q6",
    section: "Skills & Experience",
    sectionIcon: "briefcase",
    text: "Have you ever managed a team of 5 or more people?",
    options: [
      { label: "Yes, I've managed large teams (20+)", score: 5, insight: "Large-team leadership experience positions you perfectly for multi-unit or manager-run franchise models." },
      { label: "Yes, teams of 5-20 people", score: 4, insight: "This is the sweet spot for most franchise operations. Your people skills will translate seamlessly." },
      { label: "Small teams (under 5)", score: 3, insight: "Many franchise models start lean. Your experience scales naturally as the business grows." },
      { label: "No direct team management experience", score: 2, insight: "Franchise systems include comprehensive training on hiring and team management — you'll be supported." },
    ],
  },
  {
    id: "q7",
    section: "Lifestyle & Preferences",
    sectionIcon: "heart",
    text: "What level of involvement are you looking for?",
    options: [
      { label: "Full-time, hands-on owner-operator", score: 5, insight: "Owner-operators typically achieve the highest returns in years 1-3, with the option to step back later." },
      { label: "Semi-absentee (10-20 hours/week with a manager)", score: 4, insight: "Semi-absentee models are booming. The right brand + great manager = income without the 60-hour weeks." },
      { label: "Passive investor with minimal involvement", score: 2, insight: "Truly passive models exist but are limited. We'll identify brands that match this preference." },
      { label: "I'm not sure yet", score: 3, insight: "That's okay — your ideal involvement level often becomes clear once you see specific franchise models." },
    ],
  },
  {
    id: "q8",
    section: "Lifestyle & Preferences",
    sectionIcon: "heart",
    text: "Which industry interests you most?",
    options: [
      { label: "Home services (cleaning, restoration, painting)", score: 4, insight: "Home services is a $600B+ industry with recession-resistant demand and strong recurring revenue." },
      { label: "Health & fitness / Senior care", score: 4, insight: "Healthcare and senior services are among the fastest-growing franchise sectors — driven by demographics." },
      { label: "Food & beverage", score: 3, insight: "F&B franchises offer high visibility and brand recognition, though they typically require more capital." },
      { label: "B2B services (staffing, consulting, marketing)", score: 4, insight: "B2B franchises often have higher margins, lower overhead, and strong weekday-only schedules." },
      { label: "I'm open to anything that fits my goals", score: 5, insight: "Perfect mindset. Being industry-agnostic lets us match you with the highest-performing opportunities." },
    ],
  },
  {
    id: "q9",
    section: "Readiness & Mindset",
    sectionIcon: "brain",
    text: "How do you feel about following a proven system rather than creating your own?",
    options: [
      { label: "I love the idea — that's why franchising appeals to me", score: 5, insight: "You get it. The best franchise owners follow the system, then innovate within the guardrails." },
      { label: "I'm open to it but want some flexibility", score: 4, insight: "Many franchise systems allow local marketing creativity and operational input — it's a partnership." },
      { label: "I'd prefer to build something completely on my own", score: 1, insight: "Independent ownership is valid, but you'd miss the brand power, training, and support franchising provides." },
      { label: "Not sure — I need to learn more", score: 3, insight: "Understanding the franchisor-franchisee relationship is key. A consultation will clarify this perfectly." },
    ],
  },
  {
    id: "q10",
    section: "Readiness & Mindset",
    sectionIcon: "brain",
    text: "Do you have support from your spouse/partner (if applicable) in exploring franchise ownership?",
    options: [
      { label: "Yes, fully supportive", score: 5, insight: "Spousal alignment is one of the top predictors of franchise success. You're in a great position." },
      { label: "Mostly supportive — still discussing", score: 4, insight: "Involving your partner in the discovery process often builds confidence and excitement for both of you." },
      { label: "Not yet — haven't brought it up", score: 2, insight: "Having this conversation early is important. We can provide materials to help frame the opportunity." },
      { label: "N/A — making this decision independently", score: 4, insight: "Solo decision-making can actually speed up the process. You have full autonomy to move at your pace." },
    ],
  },
];

const sectionIcons: Record<string, React.ReactNode> = {
  target: <Target className="w-5 h-5" />,
  dollar: <DollarSign className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
};

function getVerdict(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct >= 80) return { label: "High-Potential Candidate", badge: "Excellent", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700", desc: "Your profile indicates a strong fit for semi-absentee and owner-operator models. You have the ideal combination of financial readiness, professional experience, and mindset for franchise ownership.", ctaText: "Your profile indicates a strong fit for semi-absentee models. Book your 15-minute Strategy Session to review the top 3 brands currently matching your score." };
  if (pct >= 60) return { label: "Strong Potential Candidate", badge: "Strong", color: "text-[#D4AF37]", badgeBg: "bg-amber-50 border-amber-200 text-amber-700", desc: "You have many of the key attributes for successful franchise ownership. A few areas may benefit from further exploration, and a strategy session can help clarify your best path forward.", ctaText: "You have strong foundational attributes. Book your 15-minute Strategy Session to identify the franchise models best aligned with your profile." };
  if (pct >= 40) return { label: "Emerging Candidate", badge: "Promising", color: "text-blue-500", badgeBg: "bg-blue-50 border-blue-200 text-blue-700", desc: "There's genuine potential here, but some factors need further development. A strategy session can help you understand your options and create a realistic timeline.", ctaText: "You're closer than you think. Book your 15-minute Strategy Session to explore the next steps for your franchise journey." };
  return { label: "Early Stage Explorer", badge: "Exploring", color: "text-gray-500", badgeBg: "bg-gray-50 border-gray-200 text-gray-600", desc: "You're in the early stages of exploring franchise ownership. That's perfectly okay — everyone starts somewhere. A conversation with a franchise advisor can help you map out the path.", ctaText: "Every successful franchise owner started exactly where you are. Book your 15-minute Strategy Session to learn what's possible." };
}

function ScoreRing({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6" />
          <motion.circle
            cx="44" cy="44" r={radius} fill="none"
            stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={pct}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-bold text-[#1B2B3A]"
          >
            {pct}
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">Readiness</span>
    </div>
  );
}

export default function FranchiseAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { index: number; score: number }>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const emailSentRef = useRef(false);

  const params = new URLSearchParams(window.location.search);
  const userName = params.get("name") || "";
  const userEmail = params.get("email") || "";

  const totalSteps = questions.length;
  const progress = showResults || analyzing ? 100 : started ? ((currentStep + 1) / (totalSteps + 1)) * 100 : 0;
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

  const handleSelect = useCallback((questionId: string, index: number, score: number, insight: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: { index, score } }));
    setCurrentInsight(insight);
  }, []);

  const canProceed = answers[questions[currentStep]?.id] !== undefined;

  const next = () => {
    setSlideDirection("left");
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInsight(null);
    } else {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setShowResults(true);
      }, 3000);
    }
  };

  const prev = () => {
    setSlideDirection("right");
    if (showResults) { setShowResults(false); return; }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentInsight(null);
    }
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

  const slideVariants = {
    enter: (dir: "left" | "right") => ({ x: dir === "left" ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "left" | "right") => ({ x: dir === "left" ? -80 : 80, opacity: 0 }),
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6"
        >
          <div className="relative w-28 h-28 mx-auto mb-8">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="4" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
              </motion.div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#1B2B3A] mb-3">Analyzing Your Profile...</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">Comparing your responses against our database of successful franchise owners.</p>
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#D4AF37]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <motion.div
          className="h-full bg-[#D4AF37]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-12 pb-20">
        <AnimatePresence mode="wait" custom={slideDirection}>
          {!showResults ? (
            !started ? (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-10 pt-4">
                  <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#B8962E] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                    <Shield className="w-3.5 h-3.5" /> Confidential Assessment
                  </div>
                  <h1 className="text-3xl md:text-[40px] font-semibold text-[#1B2B3A] mb-4 leading-tight tracking-tight">
                    Franchise Readiness Assessment
                  </h1>
                  <p className="text-base text-gray-400 max-w-md mx-auto">Discover how ready you are for franchise ownership in just 3 minutes.</p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
                  <div className="flex gap-4 items-center mb-6 pb-6 border-b border-gray-100">
                    <img src="/charles-headshot.jpeg" alt="Charles Stovall" className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/30 object-cover" />
                    <div>
                      <p className="font-semibold text-[#1B2B3A] text-sm">Charles Stovall</p>
                      <p className="text-xs text-gray-400">Franchise Advisor • Charleston, SC</p>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">
                    This assessment evaluates five key dimensions of franchise readiness. Your responses are confidential and will be used to generate a personalized readiness score.
                  </p>

                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {[
                      { icon: <Target className="w-4 h-4" />, label: "Goals & Motivation" },
                      { icon: <DollarSign className="w-4 h-4" />, label: "Financial Readiness" },
                      { icon: <Briefcase className="w-4 h-4" />, label: "Skills & Experience" },
                      { icon: <Heart className="w-4 h-4" />, label: "Lifestyle Preferences" },
                      { icon: <Brain className="w-4 h-4" />, label: "Readiness & Mindset" },
                    ].map((area, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-[#F8F9FB]">
                        <span className="text-[#D4AF37]">{area.icon}</span>
                        <span className="text-[#1B2B3A] text-sm font-medium">{area.label}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStarted(true)}
                    className="w-full h-13 py-3.5 bg-[#D4AF37] hover:bg-[#C19A2E] text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    data-testid="button-start-assessment"
                  >
                    Begin Assessment <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-300">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 minutes</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% confidential</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`q-${currentStep}`}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >

                <div className="bg-white rounded-xl p-4 mb-6 mt-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#D4AF37] mb-0.5">Your Readiness Score</p>
                      <p className="text-2xl font-bold text-[#1B2B3A]">{Math.round((totalScore / maxScore) * 100)}<span className="text-sm font-normal text-gray-300">/100</span></p>
                    </div>
                    <ScoreRing score={totalScore} maxScore={maxScore} />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-[#D4AF37]">{sectionIcons[questions[currentStep].sectionIcon]}</span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
                    {questions[currentStep].section}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-300 font-medium">Question {currentStep + 1} of {totalSteps}</span>
                </div>

                <h2 className="text-2xl md:text-[28px] font-semibold text-[#1B2B3A] leading-snug tracking-tight mb-8">
                  {questions[currentStep].text}
                </h2>

                <div className="space-y-3 mb-6">
                  {questions[currentStep].options.map((opt, i) => {
                    const isSelected = answers[questions[currentStep].id]?.index === i;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleSelect(questions[currentStep].id, i, opt.score, opt.insight)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-[#D4AF37] bg-[#D4AF37]/[0.04] shadow-[0_0_0_1px_rgba(212,175,55,0.15)]"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        }`}
                        data-testid={`option-q${currentStep + 1}-${i}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? "border-[#D4AF37] bg-[#D4AF37]" : "border-gray-200"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-[15px] leading-snug ${isSelected ? "text-[#1B2B3A] font-medium" : "text-gray-500"}`}>
                            {opt.label}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {currentInsight && (
                    <motion.div
                      key={currentInsight}
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8"
                    >
                      <div className="bg-[#1B2B3A]/[0.03] rounded-xl px-5 py-4 border border-[#1B2B3A]/[0.06]">
                        <p className="text-xs font-semibold text-[#D4AF37] tracking-wider uppercase mb-1.5">Expert Insight</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{currentInsight}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={prev}
                    className="h-12 px-5 bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!canProceed}
                    className="flex-1 h-12 bg-[#D4AF37] hover:bg-[#C19A2E] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    data-testid="button-next-question"
                  >
                    {currentStep === totalSteps - 1 ? "See My Results" : "Continue"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="pt-6">
                {userEmail && (
                  <p className="text-center text-emerald-500 text-xs font-medium mb-6">A copy of this report has been sent to {userEmail}</p>
                )}

                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
                  <div className="text-center mb-8">
                    <div className="relative w-32 h-32 mx-auto mb-5">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                        <motion.circle
                          cx="60" cy="60" r="52" fill="none"
                          stroke="#D4AF37" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 52}
                          initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 52 - (scorePercent / 100) * 2 * Math.PI * 52 }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                          className="text-3xl font-bold text-[#1B2B3A]"
                        >{scorePercent}</motion.span>
                        <span className="text-[10px] text-gray-300 font-medium">out of 100</span>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-3 ${verdict.badgeBg}`}>
                      <Award className="w-3.5 h-3.5" />
                      {verdict.label}
                    </div>
                    <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">{verdict.desc}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-[#1B2B3A] uppercase tracking-wider mb-5">Score Breakdown</h3>
                    <div className="space-y-5">
                      {Object.entries(sectionScores).map(([section, data], idx) => {
                        const pct = Math.round((data.earned / data.max) * 100);
                        return (
                          <div key={section}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">{section}</span>
                              <span className="text-sm font-bold text-[#1B2B3A]">{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-[#D4AF37] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
                  <h3 className="text-sm font-semibold text-[#1B2B3A] uppercase tracking-wider mb-5">Recommended Next Steps</h3>
                  <div className="space-y-4">
                    {[
                      "Book your complimentary Strategy Session with Charles",
                      "Receive 3-5 personalized franchise matches based on your profile",
                      "Review detailed financials and validation data",
                      "Make a confident, informed decision on your terms",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="text-sm text-gray-500 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1B2B3A] rounded-2xl p-8 md:p-10 text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">Your Next Step</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-md mx-auto">
                    {verdict.ctaText}
                  </p>

                  <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                    <div
                      className="calendly-inline-widget"
                      data-url="https://calendly.com/charles-stovall/intro"
                      style={{ minWidth: "280px", height: "400px" }}
                    />
                  </div>

                  <a
                    href="https://calendly.com/charles-stovall/intro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C19A2E] text-white font-semibold text-sm py-3.5 px-8 rounded-xl transition-all duration-200"
                    data-testid="button-book-call-results"
                  >
                    Book Your Strategy Session <ChevronRight className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-gray-500 mt-4">
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
