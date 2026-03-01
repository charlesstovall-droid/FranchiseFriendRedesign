import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Phone, Home, DollarSign, Star, X, Check, ChevronDown, ChevronUp, Leaf, GraduationCap, Heart, Wrench, Dog, Calendar, TrendingUp, Shield, ArrowRight, Lock, AlertTriangle, Download, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logoEntrepreneur from "@assets/154-1547881_entrepreneur-logo-entrepreneur-gray-logo_1772318692086.png";
import logoForbes from "@assets/forbes-logo-11609361702nvjwui1s5f_1772318692086.png";
import logoInc from "@assets/683-6834584_inc-500-hd-png-download_1772318692086.png";
import logoFoxBusiness from "@assets/FS_FBN_logo_new_1772318692086.png";
import logoBusinessInsider from "@assets/Business-Insider-Logo_1772318791523.png";
import logoBudgetBlinds from "@assets/US-BudgetBlinds_Logo-No-Tagline_RGB_1772318628142.png";
import logoPaulDavis from "@assets/friday-the-13th-ch-ch-ch-ah-ah-ah-paul-davis-restoration-logo-_1772318628142.png";
import logoStratus from "@assets/images_(1)_1772318628142.png";
import logoJanPro from "@assets/JAN-PRO®-Cleaning-Disinfecting-RGB-BlueGreen_1772318628142.png";
import logoServpro from "@assets/429-4294474_servpro-logo-png-transparent-transparent-servpro-l_1772318628142.png";
import logoJunkKing from "@assets/images_1772318628142.png";
import logoBrightStar from "@assets/BSC-Primary-Logo-Full-Color_1772318628143.png";

const categories = [
  { icon: Home, title: "Home Services", desc: "Cleaning, restoration, painting, handyman — essential services homeowners always need.", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop" },
  { icon: Leaf, title: "Lawn & Landscaping", desc: "Recurring revenue, low startup cost, and year-round demand in most markets.", img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=250&fit=crop" },
  { icon: GraduationCap, title: "In-Home Tutoring & Education", desc: "Recession-resistant demand as parents invest in their children's future.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop" },
  { icon: Dog, title: "Pet Care & Dog Training", desc: "A booming $150B+ industry with passionate, repeat customers.", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop" },
  { icon: Heart, title: "Senior Care & Home Health", desc: "The fastest-growing sector in franchising as 10,000 Boomers turn 65 daily.", img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=250&fit=crop" },
  { icon: Wrench, title: "Home Repair & Inspection", desc: "High-ticket services with low competition in most local markets.", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=250&fit=crop" },
];

const mediaLogos: { name: string; logo?: string }[] = [
  { name: "Entrepreneur Magazine", logo: logoEntrepreneur },
  { name: "Forbes", logo: logoForbes },
  { name: "Inc. 5000", logo: logoInc },
  { name: "Fox Business", logo: logoFoxBusiness },
  { name: "Business Insider", logo: logoBusinessInsider },
];

const franchiseBrands: { name: string; logo?: string }[] = [
  { name: "MaidPro" },
  { name: "Mosquito Joe" },
  { name: "Lawn Doctor" },
  { name: "Kumon" },
  { name: "BrightStar Care", logo: logoBrightStar },
  { name: "Cruise Planners" },
  { name: "Dream Vacations" },
  { name: "Junk King", logo: logoJunkKing },
  { name: "Servpro", logo: logoServpro },
  { name: "Jan-Pro", logo: logoJanPro },
  { name: "Stratus Building Solutions", logo: logoStratus },
  { name: "Paul Davis Restoration", logo: logoPaulDavis },
  { name: "HomeVestors" },
  { name: "Pillar To Post" },
  { name: "Budget Blinds", logo: logoBudgetBlinds },
];

const painPoints = [
  "Paying rent on an office or storefront you barely use",
  "Commuting hours every day that add up to months of your life",
  "A boss who controls your income ceiling",
  "No equity, no ownership, nothing to show after years of work",
];

const steps = [
  { num: "1", title: "Free Discovery Call (30 min)", desc: "Tell Charles your budget, schedule preferences, and income goals." },
  { num: "2", title: "Your Custom Match Report", desc: "Get 3–5 hand-picked home-based franchises with real earnings data." },
  { num: "3", title: "Decision With Confidence", desc: "Charles guides you through due diligence — no pressure, no rush." },
];

const testimonials = [
  { quote: "I went from a 90-minute daily commute to running my business from my kitchen table. Charles found me a home services franchise that replaced my salary in year one.", name: "Jennifer R.", title: "Former Marketing Manager", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face" },
  { quote: "I was skeptical that a 'real' business could run from home. Charles proved me wrong — I now run a 6-figure in-home tutoring franchise.", name: "Marcus T.", title: "Former School Administrator", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { quote: "The best part is picking my kids up from school every day. Charles matched me with a pet care franchise that fits my life perfectly.", name: "Lisa K.", title: "Former HR Director", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face" },
];

const faqItems = [
  { id: "1", q: "Are home-based franchises legitimate businesses?", a: "Absolutely. These are real, legally structured franchise businesses backed by established brands. You'll operate under a Franchise Disclosure Document (FDD), receive full training and support, and build a business with real equity and resale value. These are not MLMs or side hustles." },
  { id: "2", q: "How much does it cost to get started?", a: "Home-based franchise investments typically range from $50K to $150K, depending on the concept. Many options are available with SBA financing, 401(k) rollovers (ROBS), or other creative funding strategies Charles can walk you through." },
  { id: "3", q: "Does Charles cost anything?", a: "Absolutely $0 to you. Charles is compensated by the franchisors when you choose to move forward, which means his advice is completely unbiased and focused entirely on your best interests." },
  { id: "4", q: "Can I run this while still employed?", a: "Many of Charles's clients start their franchise exploration while still working full-time. Some home-based concepts can even be launched part-time before transitioning to full ownership." },
  { id: "5", q: "Do I need industry experience?", a: "No. That's the beauty of franchising — the franchisor provides comprehensive training, systems, and ongoing support. Your transferable skills in management, communication, and leadership are what matter most." },
  { id: "6", q: "How fast can I be up and running?", a: "Typically 60–120 days from signing your franchise agreement. The discovery process itself usually takes 30–60 days, moving at whatever pace is comfortable for you." },
];

const guideTeaser = [
  "The #1 home services franchise with 90%+ owner satisfaction",
  "3 under-the-radar concepts with 6-figure Year 1 potential",
  "How to evaluate a home-based FDD in under 2 hours",
  "The funding options most people don't know exist",
  "Red flags to avoid in any home-based franchise agreement",
];

export default function HomeBasedFranchises() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ firstName: "", email: "", phone: "" });
  const [guideEmail, setGuideEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuideSubmitting, setIsGuideSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [spotsRemaining] = useState(3);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.firstName,
          email: formData.email,
          phone: formData.phone,
          message: "Home-Based Franchise Landing Page — Lead",
          leadType: "home-based-ad",
        }),
      });
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      setLocation("/franchise-assessment?name=" + encodeURIComponent(formData.firstName) + "&email=" + encodeURIComponent(formData.email));
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGuideSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Guide Download",
          email: guideEmail,
          phone: "",
          message: "Home-Based Franchise Guide Download Request",
          leadType: "home-based-guide",
        }),
      });
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      setGuideEmail("");
      alert("Check your inbox! Your free guide is on its way.");
    } catch (error) {
      console.error("Error submitting guide form:", error);
    } finally {
      setIsGuideSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* STICKY TOP BAR */}
      <a
        href="tel:9198273921"
        className="bg-[#c9a84c] text-[#1a2332] py-3 px-4 flex items-center justify-center gap-3 hover:bg-[#b8953f] transition-colors sticky top-0 z-50"
        data-testid="button-call-top"
      >
        <Phone size={18} className="animate-pulse" />
        <span className="font-bold text-sm">Free Consultation — No Obligation — Limited Spots</span>
        <span className="hidden sm:inline text-sm font-semibold ml-1">(919) 827-3921</span>
      </a>

      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[90vh] flex items-center py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 via-[#1a2332]/85 to-[#1a2332]/70" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 border border-[#c9a84c]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
                <span className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider font-['Inter']">Now Accepting New Clients</span>
              </div>
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.15] mb-6">
                Run a Profitable Franchise From Home — <span className="text-[#c9a84c]">No Office, No Storefront, No Commute.</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 font-['Inter']">
                Discover the top home-based and in-home service franchises that let you build real wealth on your own schedule — with expert guidance at zero cost to you.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <Home size={16} className="text-[#c9a84c]" />
                  <span className="text-white text-sm font-medium font-['Inter']">Home-Based Friendly</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <DollarSign size={16} className="text-[#c9a84c]" />
                  <span className="text-white text-sm font-medium font-['Inter']">Starting at $50K</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <Star size={16} className="text-[#c9a84c]" />
                  <span className="text-white text-sm font-medium font-['Inter']">500+ Concepts Vetted</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video max-w-md">
                <iframe
                  src="https://www.youtube.com/embed?listType=user_uploads&list=yourfranchisefriend"
                  title="Charles Stovall — Franchise Advisor"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-testid="hero-video"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} id="hero-form">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a2332] text-center mb-2">
                  See Your Home-Based Options
                </h2>
                <p className="text-gray-500 text-sm text-center mb-6 font-['Inter']">100% free. Takes 60 seconds.</p>
                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#c9a84c] focus:ring-[3px] focus:ring-[#c9a84c]/10 transition font-['Inter']"
                    placeholder="First Name"
                    data-testid="input-first-name"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#c9a84c] focus:ring-[3px] focus:ring-[#c9a84c]/10 transition font-['Inter']"
                    placeholder="Email Address"
                    data-testid="input-email"
                  />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-[52px] px-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#c9a84c] focus:ring-[3px] focus:ring-[#c9a84c]/10 transition font-['Inter']"
                    placeholder="Phone Number"
                    data-testid="input-phone"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[56px] bg-[#c9a84c] text-[#1a2332] font-bold text-lg rounded-lg hover:bg-[#b8953f] transition-colors disabled:opacity-60 font-['Inter']"
                    data-testid="button-hero-submit"
                  >
                    {isSubmitting ? "Submitting..." : "Show Me Home-Based Franchise Options →"}
                  </button>
                </form>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Lock size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs font-['Inter']">Free. Confidential. No pressure — ever.</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3 bg-amber-50 rounded-lg py-2 px-3">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span className="text-amber-700 text-xs font-semibold font-['Inter']">Charles only takes 5 new clients per month — {spotsRemaining} spots remaining</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — WHAT IS A HOME-BASED FRANCHISE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a2332] text-center mb-12">
              What Exactly Is a Home-Based Franchise — And Why Are So Many People Choosing Them?
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-gray-700 text-lg leading-relaxed font-['Inter'] mb-6">
                A home-based franchise lets you operate a real, proven business without a physical storefront. You work from home, manage a team remotely or in the field, and follow a proven system built by a brand that's already figured out what works.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed font-['Inter'] mb-6">
                You get the freedom of entrepreneurship with the safety net of a franchise system — training, marketing, technology, and ongoing support all included.
              </p>
              <div className="bg-[#1a2332] text-white rounded-xl p-5 mt-4">
                <p className="text-sm font-['Inter'] italic">
                  "These aren't MLMs or side hustles. These are real, scalable businesses backed by billion-dollar brands."
                </p>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-5">
              {[
                { icon: Home, text: "No lease, no retail overhead" },
                { icon: Calendar, text: "Set your own schedule" },
                { icon: Wrench, text: "In-demand services people always need" },
                { icon: TrendingUp, text: "Scalable — start solo, grow a team" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={22} className="text-[#c9a84c]" />
                  </div>
                  <p className="text-gray-800 text-lg font-medium font-['Inter'] pt-2">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* AS SEEN IN BAR */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-center text-xs uppercase tracking-[3px] text-gray-400 font-['Inter'] font-semibold mb-6">As Seen In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {mediaLogos.map((media, i) => (
              <div key={i} className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default" data-testid={`media-logo-${i}`}>
                {media.logo ? (
                  <img src={media.logo} alt={media.name} className="h-8 md:h-10 object-contain" />
                ) : (
                  <span className="font-['Playfair_Display'] text-lg md:text-xl font-bold italic text-gray-400">{media.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRANCHISE BRAND LOGO TICKER */}
      <section className="py-10 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6">
          <p className="text-center text-sm uppercase tracking-[2px] text-gray-500 font-['Inter'] font-semibold">
            A Sample of Home-Based Franchise Brands We Work With
          </p>
        </div>
        <div className="relative">
          <div className="flex animate-ticker">
            {[...franchiseBrands, ...franchiseBrands].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-4 w-[180px] h-[70px] bg-white border border-gray-200 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:border-[#c9a84c]/40 hover:shadow-md cursor-default"
                data-testid={`brand-logo-${i}`}
              >
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="max-h-[45px] max-w-[150px] object-contain px-2" />
                ) : (
                  <span className="font-['Inter'] text-sm font-semibold text-gray-600 text-center px-3">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — CATEGORY CARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a2332] text-center mb-4">
              Popular Home-Based & In-Home Franchise Categories
            </h2>
            <p className="text-gray-500 text-center mb-12 text-lg font-['Inter']">Explore the types of franchises Charles helps clients discover</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-lg transition-all group"
                data-testid={`card-category-${i}`}
              >
                <div className="h-40 overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[#1a2332] flex items-center justify-center group-hover:bg-[#c9a84c] transition-colors flex-shrink-0">
                      <cat.icon size={20} className="text-[#c9a84c] group-hover:text-[#1a2332] transition-colors" />
                    </div>
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a2332]">{cat.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm font-['Inter'] leading-relaxed">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center text-gray-600 mt-10 text-lg font-['Inter']">
            Not sure which fits you? That's exactly what Charles helps you figure out — <span className="text-[#c9a84c] font-semibold">for free</span>.
          </motion.p>
        </div>
      </section>

      {/* SECTION 4 — AGITATION */}
      <section className="py-20 bg-[#1a2332]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Still Trading Time for a Paycheck That Was Never Really Yours?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X size={16} className="text-red-400" />
                </div>
                <p className="text-gray-300 font-['Inter'] text-base">{point}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
            <p className="text-[#c9a84c] text-xl md:text-2xl font-bold font-['Playfair_Display']">
              A home-based franchise gives you the system, the brand, and the freedom — you just run it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — MEET CHARLES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/videoseries?list=UUyourfranchisefriend"
                    title="Watch: How a Home-Based Franchise Can Replace Your Income"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    data-testid="charles-video"
                  />
                </div>
                <div className="bg-[#1a2332] px-6 py-4">
                  <p className="text-white font-bold text-lg font-['Playfair_Display']">Charles Stovall</p>
                  <p className="text-gray-300 text-sm font-['Inter']">Franchise Advisor · Charleston, SC</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a2332] mb-8">
                Your Guide to Finding the Right Home-Based Franchise
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  "15+ years as a dedicated franchise advisor",
                  "Personally vetted 500+ franchise brands including dozens of home-based concepts",
                  "FranChoice certified — the highest standard in franchise consulting",
                  "His service costs you nothing — he's paid by franchisors only",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-white" />
                    </div>
                    <p className="text-gray-700 font-['Inter']">{point}</p>
                  </div>
                ))}
              </div>
              <blockquote className="border-l-4 border-[#c9a84c] pl-6 py-2 mb-8">
                <p className="text-[#1a2332] text-xl italic font-['Playfair_Display'] leading-relaxed">
                  "My job isn't to sell you a franchise. It's to make sure you never buy the wrong one."
                </p>
              </blockquote>
              <button
                onClick={scrollToForm}
                className="bg-[#c9a84c] text-[#1a2332] font-bold px-8 py-4 rounded-lg hover:bg-[#b8953f] transition-colors font-['Inter']"
                data-testid="button-scroll-charles"
              >
                Talk to Charles — It's Free →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — THE PROCESS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a2332] text-center mb-4">
              Here's How We Find Your Perfect Home-Based Franchise in 3 Simple Steps
            </h2>
            <p className="text-gray-500 text-center mb-12 text-lg font-['Inter']">From curious to confident — typically in under 30 days</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } } }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative"
                data-testid={`card-step-${i}`}
              >
                <div className="w-16 h-16 rounded-full bg-[#1a2332] flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#c9a84c] text-2xl font-bold font-['Playfair_Display']">{step.num}</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a2332] mb-3">{step.title}</h3>
                <p className="text-gray-600 font-['Inter'] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center text-gray-600 mt-10 text-lg font-['Inter']">
            Most clients go from curious to confident in under 30 days — at <span className="text-[#c9a84c] font-semibold">zero cost</span>.
          </motion.p>
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a2332] text-center mb-12">
              What Clients Are Saying
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                data-testid={`card-testimonial-${i}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-[#c9a84c] text-[#c9a84c]" />)}
                </div>
                <p className="text-gray-700 font-['Inter'] text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[#1a2332] font-['Inter'] text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs font-['Inter']">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#1a2332] rounded-2xl py-6 px-8 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { val: "150+", label: "Clients Placed" },
              { val: "50", label: "States Covered" },
              { val: "$0", label: "Advisor Fee" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-[#c9a84c] text-3xl font-bold font-['Playfair_Display']">{stat.val}</p>
                <p className="text-gray-300 text-sm font-['Inter']">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 — LEAD MAGNET */}
      <section className="py-20 bg-gradient-to-br from-[#1a2332] to-[#0f1922]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 rounded-full px-4 py-2 mb-6">
              <Download size={16} className="text-[#c9a84c]" />
              <span className="text-[#c9a84c] text-sm font-semibold font-['Inter']">FREE DOWNLOAD</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-4">
              The 2026 Guide to the Top 10 Home-Based Franchises Under $100K
            </h2>
            <p className="text-gray-400 text-lg font-['Inter']">What's inside:</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-4">
              {guideTeaser.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-[#1a2332]" />
                  </div>
                  <p className="text-gray-300 font-['Inter'] text-sm">{item}</p>
                </div>
              ))}
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10">
                <form onSubmit={handleGuideSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={guideEmail}
                    onChange={(e) => setGuideEmail(e.target.value)}
                    className="w-full h-[52px] px-4 bg-white rounded-lg text-base focus:outline-none focus:ring-[3px] focus:ring-[#c9a84c]/30 transition font-['Inter']"
                    placeholder="Enter your email address"
                    data-testid="input-guide-email"
                  />
                  <button
                    type="submit"
                    disabled={isGuideSubmitting}
                    className="w-full h-[52px] bg-[#c9a84c] text-[#1a2332] font-bold rounded-lg hover:bg-[#b8953f] transition-colors disabled:opacity-60 font-['Inter']"
                    data-testid="button-guide-submit"
                  >
                    {isGuideSubmitting ? "Sending..." : "Send Me the Free Guide →"}
                  </button>
                </form>
                <p className="text-gray-400 text-xs text-center mt-3 font-['Inter']">No spam. Unsubscribe anytime.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a2332] text-center mb-12">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqItems.map((faq) => (
              <motion.div
                key={faq.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                data-testid={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  data-testid={`button-faq-${faq.id}`}
                >
                  <span className="font-semibold text-[#1a2332] font-['Inter'] pr-4">{faq.q}</span>
                  {openFaq === faq.id ? <ChevronUp size={20} className="text-[#c9a84c] flex-shrink-0" /> : <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed font-['Inter']">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA */}
      <section className="py-20 bg-[#1a2332]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Home. Your Business. Your Freedom.<br />
              <span className="text-[#c9a84c]">It Starts With One Free Call.</span>
            </h2>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a2332] font-bold text-lg px-10 py-5 rounded-lg hover:bg-[#b8953f] transition-colors font-['Inter'] mb-4"
              data-testid="button-final-cta"
            >
              Book My Free Home-Based Franchise Consultation
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center justify-center gap-2 mt-4">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-amber-300 text-sm font-semibold font-['Inter']">Only 5 spots open this month — don't wait</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 11 — FOOTER */}
      <footer className="bg-[#0f1922] py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <p className="font-['Playfair_Display'] text-xl font-bold text-white mb-2">Charles Stovall</p>
              <p className="text-gray-400 text-sm font-['Inter']">Franchise Advisor · Charleston, SC</p>
            </div>
            <div className="text-center">
              <div className="space-y-1">
                <a href="mailto:CStovall@FranChoice.com" className="text-gray-300 text-sm font-['Inter'] hover:text-[#c9a84c] transition-colors block">CStovall@FranChoice.com</a>
                <a href="tel:9198273921" className="text-gray-300 text-sm font-['Inter'] hover:text-[#c9a84c] transition-colors block">(919) 827-3921</a>
              </div>
            </div>
            <div className="md:text-right">
              <div className="flex md:justify-end gap-4 mb-3">
                <a href="/" className="text-gray-400 text-sm hover:text-[#c9a84c] transition-colors font-['Inter']">Main Site</a>
                <a href="/executive-access" className="text-gray-400 text-sm hover:text-[#c9a84c] transition-colors font-['Inter']">Executive Access</a>
                <a href="/free-franchise-guide" className="text-gray-400 text-sm hover:text-[#c9a84c] transition-colors font-['Inter']">Free Guide</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6">
            <p className="text-gray-500 text-xs font-['Inter'] text-center leading-relaxed">
              Results vary. Franchise investments involve risk. Charles Stovall is a FranChoice certified advisor. © 2026 Charles Stovall. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING CTA */}
      <FloatingCTA onClick={scrollToForm} />
    </div>
  );
}

function FloatingCTA({ onClick }: { onClick: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-[#c9a84c] text-[#1a2332] font-bold px-6 py-4 rounded-full shadow-2xl hover:bg-[#b8953f] transition-colors z-40 font-['Inter'] text-sm flex items-center gap-2"
      data-testid="button-floating-cta"
    >
      <Phone size={18} />
      Book a Free Call
    </motion.button>
  );
}
