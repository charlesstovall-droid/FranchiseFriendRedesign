import { useState } from "react";
import { useLocation } from "wouter";
import { Phone, Check, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  { id: "1", q: "How much does your service cost?", a: "$0. I'm compensated by the franchisors when you choose to move forward, not by you. This means I can be completely unbiased in my recommendations." },
  { id: "2", q: "Are you going to pressure me to buy a franchise?", a: "Never. My reputation is built on helping people make informed decisions. If franchising isn't right for you, I'll be the first to tell you." },
  { id: "3", q: "What if I don't have $500K to invest?", a: "Most of my clients invest between $150K-$350K. I work with franchises across all investment levels and can help you explore financing options including SBA loans and 401(k) rollovers." },
  { id: "4", q: "How long does the process take?", a: "From our first call to signing a franchise agreement typically takes 60-90 days. But there's no rush—you move at your own pace. Some clients take 6 months, others take a year." },
  { id: "5", q: "Do I need business experience to own a franchise?", a: "Not at all. That's the beauty of franchising—you're buying a proven system. Your corporate skills (management, sales, operations) transfer beautifully to franchise ownership." },
  { id: "6", q: "What industries do you work with?", a: "Everything from home services to healthcare to food & beverage to B2B services. I match you based on your interests and goals, not what pays me the highest commission." },
];

const testimonials = [
  {
    quote: "Charles helped me transition from a VP role at a Fortune 500 company to owning a home services franchise. Best decision I ever made.",
    name: "Michael J.",
    title: "Former VP of Sales → Franchise Owner",
  },
  {
    quote: "I was skeptical about franchising until I worked with Charles. He showed me opportunities I never knew existed and helped me avoid several that looked good on paper but had terrible financials.",
    name: "Sarah M.",
    title: "Former Director of Operations → Multi-Unit Owner",
  },
  {
    quote: "The best part? No pressure. Charles truly cared about finding the right fit for my family and lifestyle. Six months in and I couldn't be happier with my decision.",
    name: "David C.",
    title: "Former CFO → Healthcare Franchise Owner",
  },
];

export default function ExecutiveLanding() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: "Executive Landing - Free Franchise Fit Assessment",
          leadType: "executive-ad",
        }),
      });
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <a
        href="tel:9198273921"
        className="bg-[#D4AF37] text-[#1B2B3A] py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#c9a432] transition-colors"
        data-testid="button-call-top"
      >
        <Phone size={18} className="animate-pulse" />
        <span className="font-bold text-sm">Call Now: (919) 827-3921</span>
      </a>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#1B2B3A] to-[#0F1922] min-h-[90vh] flex items-center py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#D4AF37] text-xs font-bold tracking-[3px] uppercase mb-5">Exclusive Opportunity</p>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-bold text-white mb-6 leading-[1.15]">
                Find Your Perfect<br />Franchise in 30 Days
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                Stop guessing. Get matched with proven franchises that fit your goals, budget, and lifestyle—with zero pressure.
              </p>

              <div className="bg-white rounded-xl p-6 md:p-8 grid grid-cols-3 gap-4 mb-5">
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <p className="text-xl md:text-2xl font-bold text-[#1B2B3A]">15+</p>
                  <p className="text-xs text-gray-500 mt-1">Years Experience</p>
                </div>
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <p className="text-xl md:text-2xl font-bold text-[#1B2B3A]">500+</p>
                  <p className="text-xs text-gray-500 mt-1">Concepts Vetted</p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-[#1B2B3A]">$0 Cost</p>
                  <p className="text-xs text-gray-500 mt-1">to Candidates</p>
                </div>
              </div>

              <p className="text-sm text-gray-400 italic">
                <span className="text-[#D4AF37]">★★★★★</span> Trusted by 150+ executives who transitioned to franchise ownership
              </p>
            </motion.div>

            <motion.div
              id="hero-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1B2B3A] text-center mb-2">
                  Get Your Free Franchise<br />Fit Assessment
                </h2>
                <p className="text-sm font-semibold text-emerald-600 text-center mb-6">($497 Value - Yours Free)</p>

                <div className="flex gap-4 items-start mb-6 pb-6 border-b border-gray-200">
                  <img
                    src="/charles-headshot.jpeg"
                    alt="Charles Stovall"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0 border-[3px] border-[#D4AF37]"
                  />
                  <div>
                    <p className="font-semibold text-[#1B2B3A] text-sm mb-1">Meet Your Advisor: Charles Stovall</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      As a Franchise Advisor, I specialize in helping corporate executives transition into business ownership. I don't sell franchises; I help you find the right match.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                    placeholder="Enter your first name"
                    data-testid="input-name"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                    placeholder="Enter your email address"
                    data-testid="input-email"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                    placeholder="Phone (optional - for faster response)"
                    data-testid="input-phone"
                  />

                  <p className="text-xs text-gray-400 text-center">🔒 Your information is 100% secure. No spam, ever.</p>

                  {!isSubmitted ? (
                    <>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] text-[#1B2B3A] font-bold text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                        data-testid="button-submit"
                      >
                        {isSubmitting ? "Submitting..." : "Send Me My Free Assessment"}
                      </button>

                      <div className="bg-amber-50 rounded-md p-3 text-center">
                        <p className="text-xs font-semibold text-amber-600">⚠️ Limited to 5 new clients per month</p>
                        <p className="text-xs font-semibold text-amber-600">📅 Consultations filling fast</p>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 text-center">
                        <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-emerald-700 font-semibold">You're in! Your info has been received.</p>
                      </div>
                      <a
                        href={`/franchise-assessment?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`}
                        className="block w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] text-[#1B2B3A] font-bold text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
                        data-testid="button-go-assessment"
                      >
                        Take Me to My Assessment
                      </a>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 md:py-28 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-[42px] font-serif font-bold text-[#1B2B3A] text-center mb-4 leading-tight">
              You've Built Someone Else's Empire.<br />Time to Build Your Own.
            </h2>
            <p className="text-lg md:text-xl text-gray-500 text-center max-w-3xl mx-auto mb-14">
              But here's the reality: 73% of first-time franchise buyers choose the wrong franchise and lose money. Don't be one of them.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Years of 60+ hour weeks with no equity to show for it",
              "Corporate politics limiting your potential",
              "Your compensation tied to someone else's decisions",
              "No clear path to true financial independence",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <X className="w-6 h-6 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-[#1B2B3A] leading-snug">{item}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/charles-headshot.jpeg"
                alt="Charles Stovall - Franchise Advisor"
                className="rounded-2xl shadow-xl w-full max-w-md mx-auto object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#D4AF37] text-xs font-bold tracking-[3px] uppercase mb-5">The Charles Stovall Difference</p>
              <h2 className="text-3xl md:text-[38px] font-serif font-bold text-[#1B2B3A] mb-6 leading-tight">
                Here's How I Help Executives Find Their Perfect Franchise
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                I've spent 15+ years helping corporate professionals just like you make the transition to franchise ownership. Here's what makes my approach different:
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { title: "No High-Pressure Sales", desc: "I'm compensated the same regardless of which franchise you choose (or if you choose at all). My job is to educate, not sell." },
                  { title: "500+ Franchise Brands Vetted", desc: "I have relationships with franchisors across every industry—from home services to healthcare to food & beverage." },
                  { title: "Proven Financial Vetting", desc: "I'll show you exactly what top-performing franchisees actually earn (not just what the marketing materials claim)." },
                  { title: "End-to-End Support", desc: "From initial discovery to FDD review to funding guidance—I'm with you every step of the way." },
                ].map((b, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B2B3A] mb-1">{b.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToForm}
                className="bg-[#D4AF37] hover:bg-[#C19A2E] text-[#1B2B3A] font-bold py-4 px-10 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Your Free 30-Minute Strategy Call
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3-STEP PROCESS */}
      <section className="py-20 md:py-28 bg-[#1B2B3A]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[42px] font-serif font-bold text-white text-center mb-16 leading-tight"
          >
            My 3-Step Franchise Match Process
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Discovery Call", time: "30 minutes", desc: "We discuss your goals, budget, skills, lifestyle preferences, and deal-breakers. I learn what success looks like for you." },
              { num: "02", title: "Franchise Matching", time: "3-5 business days", desc: "I present 3-5 franchises that perfectly align with your criteria. Each comes with detailed financials and my honest assessment." },
              { num: "03", title: "Due Diligence Support", time: "As long as you need", desc: "I guide you through FDD analysis, validation calls with existing franchisees, and help you make a confident final decision." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#2C3E50] p-10 rounded-2xl border-t-4 border-[#D4AF37] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-6xl font-serif font-bold text-[#D4AF37] opacity-30 block mb-4">{step.num}</span>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#D4AF37] mb-4">{step.time}</p>
                <p className="text-gray-300 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[42px] font-serif font-bold text-[#1B2B3A] text-center mb-16 leading-tight"
          >
            What Executives Say About<br />Working With Me
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 md:p-10 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-1 text-[#D4AF37] mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 italic leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-[#1B2B3A]">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[42px] font-serif font-bold text-[#1B2B3A] text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="border-b border-gray-200">
            {faqItems.map((item) => (
              <div key={item.id} className="border-t border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left group"
                  data-testid={`button-exec-faq-${item.id}`}
                >
                  <h3 className="font-semibold text-[#1B2B3A] text-lg group-hover:text-[#D4AF37] transition-colors">{item.q}</h3>
                  <span className={`text-2xl text-[#D4AF37] flex-shrink-0 transition-transform duration-200 ${openFaq === item.id ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence>
                  {openFaq === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 leading-relaxed pb-5">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-[#1B2B3A] to-[#0F1922]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#2C3E50] border-2 border-[#D4AF37] rounded-2xl p-10 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-[38px] font-serif font-bold text-white mb-5 leading-tight">
              Ready to Escape the Golden Handcuffs?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Book your free 30-minute strategy call and discover which franchises are the perfect fit for your goals and lifestyle.
            </p>

            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] text-[#1B2B3A] font-bold text-lg py-5 px-14 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Book My Free Strategy Call Now
            </button>

            <div className="mt-6">
              <p className="text-sm font-semibold text-amber-400">⚠️ Only 5 consultation spots available this month</p>
            </div>

            <p className="text-sm italic text-gray-400 mt-8">
              P.S. I only take 5 new clients per month to ensure everyone gets personalized attention. If you're serious about franchise ownership, don't wait.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F1922] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-white/10">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#D4AF37] mb-2">Charles Stovall</h3>
              <p className="text-sm text-gray-400">Franchise Advisor</p>
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Email: CStovall@FranChoice.com</p>
              <p>Phone: (919) 827-3921</p>
              <p>Location: Charleston, SC</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href="/" className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors">Main Site</a>
              <a href="/free-franchise-guide" className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors">Free Franchise Guide</a>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">© 2026 Charles Stovall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
