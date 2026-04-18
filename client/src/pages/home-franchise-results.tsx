import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Calendar, ChevronDown, ChevronUp, Home, DollarSign, Clock, Users, Star, Phone, X } from "lucide-react";

const surveySteps = [
  {
    id: "investment",
    question: "What's your ideal investment range?",
    subtitle: "This helps us match you with franchises that fit your budget.",
    options: [
      { label: "Under $50K", value: "under-50k" },
      { label: "$50K – $100K", value: "50k-100k" },
      { label: "$100K – $250K", value: "100k-250k" },
      { label: "$250K+", value: "250k-plus" },
    ],
  },
  {
    id: "style",
    question: "How do you want to run your business?",
    subtitle: "Every franchise model is different — let's find yours.",
    options: [
      { label: "Full-time, hands-on owner-operator", value: "full-time" },
      { label: "Semi-absentee (manage part-time, hire a team)", value: "semi-absentee" },
      { label: "Executive model (oversee from a distance)", value: "executive" },
      { label: "Not sure yet — open to options", value: "flexible" },
    ],
  },
  {
    id: "timeline",
    question: "What's your timeline for getting started?",
    subtitle: "No wrong answer — we work at your pace.",
    options: [
      { label: "Ready now (within 30 days)", value: "now" },
      { label: "1–3 months", value: "1-3-months" },
      { label: "3–6 months", value: "3-6-months" },
      { label: "Just exploring for now", value: "exploring" },
    ],
  },
];

interface Franchise {
  name: string;
  category: string;
  description: string;
  investmentRange: string;
  ownershipModel: string;
  highlights: string[];
  fit: string[];
}

const franchises: Franchise[] = [
  {
    name: "ERA Group",
    category: "Business Consulting",
    description: "ERA Group helps businesses reduce overhead costs through expert expense reduction analysis. Franchisees serve as consultants to businesses, identifying savings on telecom, shipping, merchant processing, and more — all from a home office.",
    investmentRange: "$75K – $100K",
    ownershipModel: "Home-based, full-time or semi-absentee",
    highlights: ["B2B model with recurring revenue", "No employees needed at startup", "Work from anywhere with a laptop"],
    fit: ["executive", "semi-absentee", "full-time"],
  },
  {
    name: "Schooley Mitchell",
    category: "Cost Reduction Consulting",
    description: "Schooley Mitchell is North America's largest independent cost reduction consulting firm. Franchisees analyze and reduce business expenses across categories like telecom, waste, and merchant services — earning ongoing residual income.",
    investmentRange: "$75K – $95K",
    ownershipModel: "Home-based, executive or semi-absentee",
    highlights: ["Residual income model", "No inventory or employees", "Training academy included"],
    fit: ["executive", "semi-absentee", "flexible"],
  },
  {
    name: "Two Maids",
    category: "Home Cleaning Services",
    description: "Two Maids is a rapidly growing residential cleaning franchise. Owners manage teams of cleaners serving homeowners in their local market — a high-demand, recession-resistant service industry.",
    investmentRange: "$100K – $150K",
    ownershipModel: "Owner-operator or semi-absentee",
    highlights: ["Recurring weekly/biweekly customers", "Simple operations model", "Strong brand with national marketing"],
    fit: ["full-time", "semi-absentee", "flexible"],
  },
  {
    name: "Senior Care Authority",
    category: "Senior Care Consulting",
    description: "Senior Care Authority franchisees help families navigate senior living options — from assisted living to memory care. As a consultant and advocate, you guide families through one of life's most important transitions.",
    investmentRange: "$60K – $90K",
    ownershipModel: "Home-based, full-time",
    highlights: ["Meaningful, purpose-driven work", "Growing aging population = growing demand", "Low overhead, high margin"],
    fit: ["full-time", "semi-absentee", "flexible"],
  },
  {
    name: "Mosquito Joe",
    category: "Outdoor Pest Control",
    description: "Mosquito Joe provides mosquito, tick, and flea control treatments to residential and commercial properties. Franchisees manage treatment teams and routes in their territory — a seasonal business with strong margins.",
    investmentRange: "$110K – $160K",
    ownershipModel: "Semi-absentee or owner-operator",
    highlights: ["Part of Neighborly family of brands", "Recurring seasonal revenue", "Simple, scalable service model"],
    fit: ["full-time", "semi-absentee", "flexible"],
  },
  {
    name: "Fetch Pet Care",
    category: "Pet Care Services",
    description: "Fetch Pet Care provides professional pet sitting, dog walking, and overnight care. Franchisees manage a team of pet care providers in their territory — capitalizing on the booming $150B pet industry.",
    investmentRange: "$80K – $120K",
    ownershipModel: "Home-based, semi-absentee or full-time",
    highlights: ["Booming pet industry", "Low overhead — no physical location needed", "Flexible scheduling model"],
    fit: ["full-time", "semi-absentee", "flexible"],
  },
];

function getPersonalizedMessage(answers: Record<string, string>, name: string): string {
  const firstName = name || "there";
  const timeline = answers.timeline;
  const style = answers.style;

  let urgency = "";
  if (timeline === "now") urgency = "Since you're ready to move quickly, ";
  else if (timeline === "1-3-months") urgency = "With your 1–3 month timeline, ";
  else if (timeline === "3-6-months") urgency = "With a few months to explore, ";
  else urgency = "Since you're still exploring, ";

  let styleNote = "";
  if (style === "executive") styleNote = "you'd be a great fit for executive-model franchises where you oversee the business without being in the day-to-day.";
  else if (style === "semi-absentee") styleNote = "semi-absentee models are perfect — you can start building while keeping your current income.";
  else if (style === "full-time") styleNote = "hands-on franchise models will give you the most control and fastest path to profitability.";
  else styleNote = "we can explore a range of models to find the one that fits your lifestyle best.";

  return `Great news, ${firstName}! ${urgency}${styleNote} Based on your answers, here are franchise opportunities hand-picked for your profile. Book a free call with Charles to dive deeper into any of these options.`;
}

function getMatchedFranchises(answers: Record<string, string>): Franchise[] {
  const style = answers.style || "flexible";
  const investment = answers.investment || "100k-250k";

  return franchises.filter((f) => {
    const styleFit = f.fit.includes(style) || f.fit.includes("flexible") || style === "flexible";
    let investFit = true;
    if (investment === "under-50k") {
      investFit = f.investmentRange.includes("$60K") || f.investmentRange.includes("$75K") || f.investmentRange.includes("$80K");
    } else if (investment === "250k-plus") {
      investFit = true;
    }
    return styleFit || investFit;
  });
}

export default function HomeFranchiseResults() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-593191309/w4I0CPeau54cEI3D7ZoC",
        value: 1.0,
        currency: "USD",
      });
    }
  }, []);

  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "";
  const email = params.get("email") || "";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);

  const currentStep = surveySteps[step];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);

    if (step < surveySteps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setSurveyComplete(true), 300);
    }
  };

  const matchedFranchises = surveyComplete ? getMatchedFranchises(answers) : [];
  const personalizedMessage = surveyComplete ? getPersonalizedMessage(answers, name) : "";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (selectedFranchise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1a2332] py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedFranchise(null)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-['Inter'] text-sm"
              data-testid="button-back-results"
            >
              <ArrowLeft size={16} />
              Back to Results
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a2332] to-[#2a3a4f] p-8 md:p-12">
                <span className="inline-block bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 font-['Inter']">
                  {selectedFranchise.category}
                </span>
                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-2">
                  {selectedFranchise.name}
                </h1>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-gray-700 text-lg leading-relaxed mb-8 font-['Inter']">
                  {selectedFranchise.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={18} className="text-[#c9a84c]" />
                      <span className="font-semibold text-[#1a2332] font-['Inter'] text-sm">Investment Range</span>
                    </div>
                    <p className="text-gray-700 font-['Inter'] text-lg font-bold">{selectedFranchise.investmentRange}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={18} className="text-[#c9a84c]" />
                      <span className="font-semibold text-[#1a2332] font-['Inter'] text-sm">Ownership Model</span>
                    </div>
                    <p className="text-gray-700 font-['Inter'] text-lg font-bold">{selectedFranchise.ownershipModel}</p>
                  </div>
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a2332] mb-4">Key Highlights</h3>
                <div className="space-y-3 mb-8">
                  {selectedFranchise.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={14} className="text-white" />
                      </div>
                      <p className="text-gray-700 font-['Inter']">{h}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1a2332] rounded-xl p-6 text-center">
                  <p className="text-white font-['Playfair_Display'] text-xl font-bold mb-2">
                    Interested in {selectedFranchise.name}?
                  </p>
                  <p className="text-gray-300 text-sm font-['Inter'] mb-4">
                    Book a free call with Charles to learn more about this opportunity.
                  </p>
                  <a
                    href="https://calendly.com/charles-stovall/intro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a2332] font-bold px-8 py-4 rounded-lg hover:bg-[#b8953f] transition-colors font-['Inter']"
                    data-testid="button-book-detail"
                  >
                    <Calendar size={18} />
                    Book My Free Call
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!surveyComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0f1922] flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="mb-8 text-center">
            <div className="flex justify-center gap-2 mb-6">
              {surveySteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i < step ? "w-12 bg-[#c9a84c]" : i === step ? "w-12 bg-[#c9a84c]/60" : "w-8 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-[#c9a84c] text-xs uppercase tracking-wider font-semibold font-['Inter'] mb-1">
              Step {step + 1} of {surveySteps.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
                <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a2332] mb-2">
                  {currentStep.question}
                </h2>
                <p className="text-gray-500 text-sm font-['Inter'] mb-8">{currentStep.subtitle}</p>
                <div className="space-y-3">
                  {currentStep.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-['Inter'] group hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 ${
                        answers[currentStep.id] === option.value
                          ? "border-[#c9a84c] bg-[#c9a84c]/5"
                          : "border-gray-200"
                      }`}
                      data-testid={`survey-option-${currentStep.id}-${i}`}
                    >
                      <span className="text-[#1a2332] font-medium group-hover:text-[#1a2332]">{option.label}</span>
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mt-6 flex items-center gap-1 text-gray-400 hover:text-[#1a2332] transition-colors text-sm font-['Inter']"
                    data-testid="button-survey-back"
                  >
                    <ArrowLeft size={14} />
                    Go back
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-gray-400 text-xs mt-6 font-['Inter']">
            Your answers help Charles match you with the right franchise — 100% free, no obligation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#1a2332] to-[#2a3a4f] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 rounded-full px-4 py-1.5 mb-4">
              <Check size={16} className="text-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider font-['Inter']">Your Results Are Ready</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-4">
              Your Home-Based Franchise Matches
            </h1>
            <p className="text-gray-300 text-lg font-['Inter'] max-w-2xl mx-auto leading-relaxed">
              {personalizedMessage}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} className="text-[#c9a84c]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-lg font-bold text-[#1a2332]">
                    Ready to talk? Book your free call.
                  </h2>
                  <p className="text-gray-500 text-xs font-['Inter']">30 minutes, zero cost, zero pressure.</p>
                </div>
              </div>
              <a
                href="https://calendly.com/charles-stovall/intro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a2332] font-bold px-6 py-3 rounded-lg hover:bg-[#b8953f] transition-colors font-['Inter'] text-sm"
                data-testid="button-book-call"
              >
                <Calendar size={16} />
                Book My Free Call
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a2332] text-center mb-2">
            Franchise Opportunities Matched to You
          </h2>
          <p className="text-gray-500 text-center font-['Inter'] mb-10">
            Tap any card to learn more about the opportunity
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {matchedFranchises.map((f, i) => (
            <motion.div
              key={f.name}
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } } }}
            >
              <button
                onClick={() => setSelectedFranchise(f)}
                className="w-full text-left bg-white rounded-2xl border border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-lg transition-all group p-6"
                data-testid={`card-franchise-${i}`}
              >
                <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 font-['Inter'] group-hover:bg-[#c9a84c]/10 group-hover:text-[#c9a84c] transition-colors">
                  {f.category}
                </span>
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a2332] mb-2 group-hover:text-[#c9a84c] transition-colors">
                  {f.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <DollarSign size={14} className="text-[#c9a84c]" />
                  <span className="text-gray-600 text-xs font-['Inter'] font-medium">{f.investmentRange}</span>
                </div>
                <p className="text-gray-500 text-xs font-['Inter'] leading-relaxed line-clamp-3">
                  {f.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[#c9a84c] text-xs font-semibold font-['Inter']">
                  Learn More <ArrowRight size={12} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-[#1a2332] rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-white font-['Playfair_Display'] text-xl font-bold mb-2">
              Don't see the right fit?
            </p>
            <p className="text-gray-300 text-sm font-['Inter'] mb-4">
              Charles has access to 500+ franchise brands. Book a call and he'll find options tailored specifically to you.
            </p>
            <a
              href="tel:9198273921"
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a2332] font-bold px-6 py-3 rounded-lg hover:bg-[#b8953f] transition-colors font-['Inter'] text-sm"
              data-testid="button-call-bottom"
            >
              <Phone size={16} />
              Call (919) 827-3921
            </a>
          </div>
        </div>
      </div>

      <footer className="bg-[#0f1922] py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs font-['Inter']">
            Results vary. Franchise investments involve risk. Charles Stovall is a FranChoice certified advisor. © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
