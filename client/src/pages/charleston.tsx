import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Phone, Check, X, MapPin, Coffee, Users, Star, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";

const faqItems = [
  { id: "1", q: "Do you charge for your consulting services?", a: "$0. I'm compensated by the franchisors when you choose to move forward — not by you. This means I can be completely unbiased in my recommendations." },
  { id: "2", q: "Do I need to quit my job to own a franchise?", a: "Not at all. Many of the franchise models I work with are semi-absentee — you can keep your income while building equity. We'll discuss your schedule during our first call." },
  { id: "3", q: "What investment level do you work with?", a: "I typically work with clients who have at least $100K in liquid capital. Many of my Charleston clients are investing $150K–$500K in established, proven concepts." },
  { id: "4", q: "Why work with a local Charleston consultant vs. a national firm?", a: "Because I live here. I know which Lowcountry markets are underserved, which concepts are already saturated, and which SBA lenders and attorneys in Charleston are franchise-friendly. That local context matters." },
  { id: "5", q: "How long does the process take?", a: "From first call to signing typically takes 60–90 days. You move at your own pace — some clients take 6 months, others a year. There's no rush." },
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
    quote: "The best part? No pressure. Charles truly cared about finding the right fit for my family and lifestyle. Six months in and I couldn't be happier.",
    name: "David C.",
    title: "Former CFO → Healthcare Franchise Owner",
  },
];

export default function Charleston() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    liquidCapital: "",
    timeline: "",
    area: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capitalError, setCapitalError] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Charleston Franchise Consulting | Charles Stovall | Franchise Friend";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Charleston-based franchise consultant helping Lowcountry professionals buy the right franchise. Free consultation. 15+ years experience. Serving Mount Pleasant, Daniel Island, Summerville & the Charleston metro.");
  }, []);

  const scrollToForm = () => {
    document.getElementById("charleston-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.liquidCapital === "Under $100K") {
      setCapitalError(true);
      return;
    }
    setCapitalError(false);
    setIsSubmitting(true);
    try {
      const messageparts = ["Charleston Landing Page"];
      if (formData.area) messageparts.push(`Area: ${formData.area}`);
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: messageparts.join(" — "),
          leadType: "charleston-landing",
          ...(formData.liquidCapital ? { liquidCapital: formData.liquidCapital } : {}),
          ...(formData.timeline ? { timeline: formData.timeline } : {}),
        }),
      });
      setLocation("/thank-you-ad");
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* TOP BAR */}
      <a
        href="tel:9198273921"
        className="bg-[#D4AF37] text-[#1B2B3A] py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#c9a432] transition-colors"
        data-testid="button-call-top"
      >
        <Phone size={18} className="animate-pulse" />
        <span className="font-bold text-sm">Call Now: (919) 827-3921 · Charleston Franchise Consulting</span>
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
              <p className="text-[#D4AF37] text-xs font-bold tracking-[3px] uppercase mb-5 flex items-center gap-2">
                <MapPin size={14} /> Charleston, SC
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-bold text-white mb-6 leading-[1.15]">
                Charleston's Trusted<br />Franchise Consultant
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                Helping Lowcountry professionals and executives find, vet, and buy the right franchise — without the guesswork or high-pressure sales tactics.
              </p>

              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] text-[#1B2B3A] font-bold text-base py-4 px-10 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(212,175,55,0.5)] mb-6"
                data-testid="button-hero-cta"
              >
                Book My Free Charleston Consultation →
              </button>

              <p className="text-sm text-gray-400 mb-3">
                Based in Charleston · 15+ Years Experience · $150K+ Liquid Capital Clients
              </p>
              <p className="text-xs text-gray-500 italic">
                Serving Mount Pleasant, Daniel Island, West Ashley, Summerville, James Island, Isle of Palms &amp; the greater Charleston metro.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8 grid grid-cols-3 gap-4">
                <div className="text-center border-r border-white/10">
                  <p className="text-xl md:text-2xl font-bold text-[#D4AF37]">15+</p>
                  <p className="text-xs text-gray-400 mt-1">Years Experience</p>
                </div>
                <div className="text-center border-r border-white/10">
                  <p className="text-xl md:text-2xl font-bold text-[#D4AF37]">500+</p>
                  <p className="text-xs text-gray-400 mt-1">Concepts Vetted</p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-[#D4AF37]">$0</p>
                  <p className="text-xs text-gray-400 mt-1">Advisor Fee</p>
                </div>
              </div>
            </motion.div>

            {/* HERO FORM */}
            <motion.div
              id="charleston-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1B2B3A] text-center mb-2">
                  Book Your Free<br />Charleston Consultation
                </h2>
                <p className="text-xs text-gray-500 text-center mb-6">
                  No cost to you — we're compensated by the franchisors in our network.
                </p>

                <div className="flex gap-4 items-start mb-6 pb-6 border-b border-gray-200">
                  <img
                    src="/charles-headshot.jpeg"
                    alt="Charles Stovall"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0 border-[3px] border-[#D4AF37]"
                  />
                  <div>
                    <p className="font-semibold text-[#1B2B3A] text-sm mb-1">Charles Stovall · Charleston, SC</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Local franchise advisor specializing in helping Lowcountry professionals transition to franchise ownership.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                      placeholder="First Name"
                      data-testid="input-first-name"
                    />
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                      placeholder="Last Name"
                      data-testid="input-last-name"
                    />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                    placeholder="Email address"
                    data-testid="input-email"
                  />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                    placeholder="Phone number (required)"
                    data-testid="input-phone"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Liquid Capital Available <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <select
                      value={formData.liquidCapital}
                      onChange={(e) => {
                        setFormData({ ...formData, liquidCapital: e.target.value });
                        setCapitalError(false);
                      }}
                      className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition bg-white text-gray-700"
                      data-testid="select-liquid-capital"
                    >
                      <option value="">Select range</option>
                      <option value="Under $100K">Under $100K</option>
                      <option value="$100K–$250K">$100K–$250K</option>
                      <option value="$250K–$500K">$250K–$500K</option>
                      <option value="$500K+">$500K+</option>
                    </select>
                    {capitalError && (
                      <p className="text-red-500 text-xs mt-1" data-testid="error-capital">
                        We work best with clients who have $100K+ in liquid capital. Please call us at (919) 827-3921 to discuss your options.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      When are you looking to make a decision? <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition bg-white text-gray-700"
                      data-testid="select-timeline"
                    >
                      <option value="">Select timeline</option>
                      <option value="0–3 months">0–3 months</option>
                      <option value="3–6 months">3–6 months</option>
                      <option value="6–12 months">6–12 months</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      What area of Charleston are you in? <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#D4AF37] focus:ring-[3px] focus:ring-[#D4AF37]/10 transition"
                      placeholder="e.g. Mount Pleasant, Summerville, Downtown…"
                      data-testid="input-area"
                    />
                  </div>

                  <p className="text-xs text-gray-400 text-center">🔒 Your information is 100% secure. No spam, ever.</p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] text-[#1B2B3A] font-bold text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? "Submitting…" : "Book My Free Consultation"}
                  </button>

                  <div className="bg-amber-50 rounded-md p-3 text-center">
                    <p className="text-xs font-semibold text-amber-600">⚠️ Limited to 5 new Charleston clients per month</p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LOCAL CREDIBILITY */}
      <section className="py-20 md:py-28 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[#D4AF37] text-xs font-bold tracking-[3px] uppercase text-center mb-4">Local Advantage</p>
            <h2 className="text-3xl md:text-[42px] font-serif font-bold text-[#1B2B3A] text-center mb-4 leading-tight">
              Why Work With a Charleston-Based<br />Franchise Consultant
            </h2>
            <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-14">
              National firms don't know the Lowcountry. I do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Local Market Insight",
                desc: "I know which franchise concepts are underserved in the Lowcountry and which ones are already saturated. That local intelligence protects your investment.",
              },
              {
                icon: Coffee,
                title: "In-Person Meetings Available",
                desc: "Coffee in Mount Pleasant, lunch downtown, or a call — whatever works for your schedule. This isn't a call center; it's a relationship.",
              },
              {
                icon: Users,
                title: "Charleston Network",
                desc: "Connections to local SBA lenders, commercial real estate brokers, and franchise attorneys who know the Charleston market and can move fast.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white p-8 md:p-10 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                data-testid={`card-local-${i}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1B2B3A] mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 md:py-28 bg-[#1B2B3A]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[42px] font-serif font-bold text-white text-center mb-16 leading-tight"
          >
            How the Process Works
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Discovery Call", desc: "We discuss your goals, budget, skills, lifestyle preferences, and deal-breakers. 30 minutes. No pressure." },
              { num: "02", title: "Capital Qualification", desc: "We confirm your liquid capital and explore financing options — SBA loans, 401(k) rollovers, and more." },
              { num: "03", title: "Brand Matching", desc: "I present 3–5 franchises perfectly aligned with your criteria, each with detailed financials and my honest assessment." },
              { num: "04", title: "Post-Sale Support", desc: "I guide you through FDD analysis, validation calls, and help you reach a confident final decision." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#2C3E50] p-8 rounded-2xl border-t-4 border-[#D4AF37] hover:-translate-y-1 transition-all duration-300"
                data-testid={`card-step-${i}`}
              >
                <span className="text-5xl font-serif font-bold text-[#D4AF37] opacity-30 block mb-4">{step.num}</span>
                <h3 className="text-xl font-serif font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{step.desc}</p>
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
            What Clients Say About<br />Working With Charles
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
                data-testid={`card-testimonial-${i}`}
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
                  data-testid={`button-faq-${item.id}`}
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
              Ready to Explore Franchise Ownership<br />in Charleston?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Book a free 30-minute call with Charles. No pressure, no cost — just a straightforward conversation about whether franchising makes sense for you.
            </p>
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C19A2E] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] text-[#1B2B3A] font-bold text-lg py-5 px-14 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              data-testid="button-final-cta"
            >
              Book My Free Consultation
            </button>
            <p className="text-sm font-semibold text-amber-400 mt-6">⚠️ Only 5 new client spots available this month</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
