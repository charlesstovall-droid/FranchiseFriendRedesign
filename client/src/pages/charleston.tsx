import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Check, ChevronDown, ChevronUp } from "lucide-react";

// ─── Feature flags ────────────────────────────────────────────────────────────
// Set to true and fill CHARLESTON_TESTIMONIAL when Charles provides a real quote
const HAS_CHARLESTON_TESTIMONIAL = false;
const CHARLESTON_TESTIMONIAL = {
  quote: "{{TESTIMONIAL_QUOTE}}",
  name: "{{CLIENT_NAME}}",
  neighborhood: "{{MOUNT_PLEASANT / DANIEL_ISLAND / etc.}}",
  brand: "{{FRANCHISE_BRAND}}",
};

// ─── Palette tokens ───────────────────────────────────────────────────────────
// bg: #F7F1E8 (ivory)   primary: #1F4E5F (teal)   btn: #C4704A (terracotta)
// text-accent: #A85A34 (darkened terracotta – passes WCAG AA on ivory)
// body: #2D2D2D   muted: #7A7065   surface: #FEFAF4

// ─── Palmetto SVG (inline, 1.5px stroke, no emoji) ───────────────────────────
function PalmettoIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* trunk */}
      <path d="M14 27 C14 27 13.5 20 14 15" />
      {/* fronds */}
      <path d="M14 15 C11 13 7 14 4 10 C8 8 12 11 14 15" />
      <path d="M14 15 C17 13 21 14 24 10 C20 8 16 11 14 15" />
      <path d="M14 15 C12 11 9 8 6 5 C10 5 13 9 14 15" />
      <path d="M14 15 C16 11 19 8 22 5 C18 5 15 9 14 15" />
      <path d="M14 15 C14 11 14 8 14 4 C14 4 14 9 14 15" />
    </svg>
  );
}

// ─── Logo imports (same assets already in repo) ───────────────────────────────
import logoBrightStar from "@assets/BSC-Primary-Logo-Full-Color_1772318628143.png";
import logoServpro from "@assets/429-4294474_servpro-logo-png-transparent-transparent-servpro-l_1772318628142.png";
import logoJanPro from "@assets/JAN-PRO®-Cleaning-Disinfecting-RGB-BlueGreen_1772318628142.png";
import logoBudgetBlinds from "@assets/US-BudgetBlinds_Logo-No-Tagline_RGB_1772318628142.png";
import logoPaulDavis from "@assets/friday-the-13th-ch-ch-ch-ah-ah-ah-paul-davis-restoration-logo-_1772318628142.png";

const brandLogos = [
  { name: "BrightStar Care", logo: logoBrightStar },
  { name: "Servpro", logo: logoServpro },
  { name: "Jan-Pro", logo: logoJanPro },
  { name: "Budget Blinds", logo: logoBudgetBlinds },
  { name: "Paul Davis Restoration", logo: logoPaulDavis },
  // TODO: Charles — add additional brand logo files here as you place them
];

const faqItems = [
  {
    id: "1",
    q: "Do you charge for your consulting services?",
    a: "$0. I'm compensated by the franchisors when you choose to move forward — not by you. This means my advice is completely unbiased and focused on your best interests.",
  },
  {
    id: "2",
    q: "Why work with a local Charleston consultant vs. a national firm?",
    a: "Because I live here. I know which Lowcountry markets are underserved, which concepts are already saturated in Mount Pleasant, and which SBA lenders and franchise attorneys in Charleston are ready to move fast. That local context doesn't exist in a call center.",
  },
  {
    id: "3",
    q: "What investment level do you work with?",
    a: "I typically work with clients who have $100K+ in liquid capital. Many Charleston clients invest $150K–$500K in proven, established concepts. We'll discuss financing options — including SBA loans and 401(k) rollovers — on our first call.",
  },
  {
    id: "4",
    q: "Do I need to quit my job to own a franchise?",
    a: "Not at all. Many of the models I recommend are semi-absentee — you can keep your income while building equity. It's one of the things we'll map out together based on your schedule and goals.",
  },
];

// ─── Shared field styles ──────────────────────────────────────────────────────
const fieldCls =
  "w-full h-[52px] px-4 border border-[#D9CFC3] rounded-lg text-base bg-white text-[#2D2D2D] placeholder-[#7A7065] focus:outline-none focus:border-[#1F4E5F] focus:ring-[3px] focus:ring-[#1F4E5F]/10 transition";
const labelCls = "block text-xs font-semibold text-[#2D2D2D] mb-1";
const srOnly = "sr-only";

export default function Charleston() {
  const bottomFormRef = useRef<HTMLDivElement>(null);

  // ── Hero compact form state ──
  const [hero, setHero] = useState({ firstName: "", email: "", phone: "", liquidCapital: "" });
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroCapitalError, setHeroCapitalError] = useState(false);

  // ── Bottom full form state ──
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    liquidCapital: "",
    timeline: "",
    area: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formCapitalError, setFormCapitalError] = useState(false);

  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Charleston Franchise Consulting | Charles Stovall | Franchise Friend";
    const desc = document.querySelector('meta[name="description"]');
    if (desc)
      desc.setAttribute(
        "content",
        "Charleston-based franchise consultant helping Lowcountry professionals buy the right franchise. Free consultation. 15+ years experience. Serving Mount Pleasant, Daniel Island, Summerville & the Charleston metro."
      );
  }, []);

  const scrollToForm = () => {
    bottomFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fireConversion = () => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-593191309/w4I0CPeau54cEI3D7ZoC",
        value: 1.0,
        currency: "USD",
      });
    }
  };

  const submitLead = async (payload: Record<string, string>) => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message || "Charleston Ad Landing Page",
        leadType: "charleston-ad",
        ...(payload.liquidCapital ? { liquidCapital: payload.liquidCapital } : {}),
        ...(payload.timeline ? { timeline: payload.timeline } : {}),
      }),
    });
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hero.liquidCapital === "Under $50K") {
      setHeroCapitalError(true);
      return;
    }
    setHeroCapitalError(false);
    setHeroSubmitting(true);
    try {
      await submitLead({
        name: hero.firstName,
        email: hero.email,
        phone: hero.phone,
        liquidCapital: hero.liquidCapital,
        message: "Charleston Hero Form",
      });
      fireConversion();
      setHeroSubmitted(true);
    } catch (err) {
      console.error("Hero form error:", err);
    } finally {
      setHeroSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.liquidCapital === "Under $50K") {
      setFormCapitalError(true);
      return;
    }
    setFormCapitalError(false);
    setFormSubmitting(true);
    try {
      const messageParts = ["Charleston Bottom Form"];
      if (form.area) messageParts.push(`Area: ${form.area}`);
      await submitLead({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        liquidCapital: form.liquidCapital,
        timeline: form.timeline,
        message: messageParts.join(" — "),
      });
      fireConversion();
      setFormSubmitted(true);
    } catch (err) {
      console.error("Bottom form error:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F1E8", color: "#2D2D2D" }}>

      {/* ── STICKY TOP BAR ── */}
      <a
        href="tel:9198273921"
        className="flex items-center justify-center gap-2 py-3 px-4 hover:opacity-90 transition-opacity"
        style={{ background: "#C4704A", color: "#FFF" }}
        data-testid="button-call-top"
      >
        <Phone size={16} className="animate-pulse flex-shrink-0" />
        <span className="font-semibold text-sm">Call Now: (919) 827-3921 · Charleston Franchise Consulting</span>
      </a>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Photo background — warm golden-hour harbor/Rainbow Row scene */}
        {/* TODO: Charles — swap Unsplash URL for your preferred Charleston photo (Rainbow Row at golden hour or harbor at sunset, no faces, 1600w WebP) */}
        <img
          src="https://images.unsplash.com/photo-1589459072535-550a14cd8022?w=1600&h=900&fit=crop&q=80"
          alt="Charleston South Carolina waterfront at golden hour"
          width="1600"
          height="900"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Teal gradient: dark left, reveals photo right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, #1F4E5F 0%, #1F4E5Fcc 45%, #1F4E5F88 70%, #1F4E5F44 100%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">

            {/* LEFT: Copy */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <p
                className="text-xs font-bold tracking-[3px] uppercase mb-5 flex items-center gap-2"
                style={{ color: "#F7C59F" }}
              >
                <PalmettoIcon size={16} />
                Charleston · Mount Pleasant · Daniel Island
              </p>

              <h1
                className="font-['Playfair_Display'] font-bold text-white leading-[1.1] mb-6"
                style={{ fontSize: "clamp(38px, 5.5vw, 68px)" }}
              >
                Own a Business in Charleston.<br />
                <span style={{ color: "#F7C59F" }}>Without Starting One From Scratch.</span>
              </h1>

              <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                I'm Charles Stovall — a Charleston-based franchise consultant. I help Lowcountry executives, military retirees, and professionals find franchise brands that fit their capital, lifestyle, and goals. No cost, no pressure, no guesswork.
              </p>

              {/* Desktop: two side-by-side CTAs */}
              <div className="hidden md:flex flex-wrap gap-4 mb-6">
                <button
                  onClick={scrollToForm}
                  className="font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "#C4704A", color: "#fff" }}
                  data-testid="button-hero-primary"
                >
                  Book My 15-Min Call
                </button>
                <a
                  href="tel:9198273921"
                  className="font-semibold py-4 px-8 rounded-lg border-2 border-white/60 text-white hover:bg-white/10 transition-all duration-300"
                  data-testid="button-hero-call"
                >
                  Call (919) 827-3921
                </a>
              </div>

              {/* Mobile: single scroll-to-form CTA */}
              <div className="flex md:hidden flex-wrap gap-4 mb-6">
                <button
                  onClick={scrollToForm}
                  className="font-bold py-4 px-8 rounded-lg transition-all duration-300 w-full text-center"
                  style={{ background: "#C4704A", color: "#fff" }}
                  data-testid="button-hero-mobile"
                >
                  Book My 15-Min Call
                </button>
                <a
                  href="tel:9198273921"
                  className="font-semibold py-4 px-8 rounded-lg border-2 border-white/60 text-white hover:bg-white/10 transition-all duration-300 w-full text-center"
                >
                  Call (919) 827-3921
                </a>
              </div>

              <p className="text-white/60 text-sm">
                Responds within 1 business day · Free to you · Charleston-based
              </p>
              <p className="text-white/50 text-xs mt-2">
                15+ years · $0 cost to you · Charleston, SC
              </p>
            </motion.div>

            {/* RIGHT: Compact hero form — desktop only */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "#FEFAF4" }}>
                {heroSubmitted ? (
                  <div className="text-center py-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "#1F4E5F" }}
                    >
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3" style={{ color: "#1F4E5F" }}>
                      Got it — you're all set.
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#7A7065" }}>
                      I'll personally call you within 1 business day. For faster service, call{" "}
                      <a href="tel:9198273921" className="font-semibold hover:underline" style={{ color: "#C4704A" }}>
                        (919) 827-3921
                      </a>{" "}
                      now.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-['Playfair_Display'] text-xl font-bold text-center mb-1" style={{ color: "#1F4E5F" }}>
                      Book Your Free Consultation
                    </h2>
                    <p className="text-xs text-center mb-6" style={{ color: "#7A7065" }}>
                      No cost · Responds within 1 business day
                    </p>

                    <form onSubmit={handleHeroSubmit} className="space-y-4" noValidate>
                      <div>
                        <label htmlFor="hero-first-name" className={labelCls}>First Name</label>
                        <input
                          id="hero-first-name"
                          type="text"
                          required
                          value={hero.firstName}
                          onChange={(e) => setHero({ ...hero, firstName: e.target.value })}
                          className={fieldCls}
                          placeholder="First name"
                          data-testid="input-hero-first-name"
                        />
                      </div>
                      <div>
                        <label htmlFor="hero-email" className={labelCls}>Email</label>
                        <input
                          id="hero-email"
                          type="email"
                          required
                          value={hero.email}
                          onChange={(e) => setHero({ ...hero, email: e.target.value })}
                          className={fieldCls}
                          placeholder="Email address"
                          data-testid="input-hero-email"
                        />
                      </div>
                      <div>
                        <label htmlFor="hero-phone" className={labelCls}>
                          Phone <span style={{ color: "#C4704A" }}>*</span>
                        </label>
                        <input
                          id="hero-phone"
                          type="tel"
                          required
                          value={hero.phone}
                          onChange={(e) => setHero({ ...hero, phone: e.target.value })}
                          className={fieldCls}
                          placeholder="Phone number (required)"
                          data-testid="input-hero-phone"
                        />
                      </div>
                      <div>
                        <label htmlFor="hero-capital" className={labelCls}>
                          Liquid Capital <span className="font-normal" style={{ color: "#7A7065" }}>(optional)</span>
                        </label>
                        <select
                          id="hero-capital"
                          value={hero.liquidCapital}
                          onChange={(e) => { setHero({ ...hero, liquidCapital: e.target.value }); setHeroCapitalError(false); }}
                          className={fieldCls}
                          data-testid="select-hero-capital"
                        >
                          <option value="">Select range</option>
                          <option value="Under $50K">Under $50K</option>
                          <option value="$50K–$150K">$50K–$150K</option>
                          <option value="$150K–$500K">$150K–$500K</option>
                          <option value="$500K+">$500K+</option>
                        </select>
                        {heroCapitalError && (
                          <p className="text-xs mt-1" style={{ color: "#A85A34" }} data-testid="error-hero-capital">
                            We work with clients who have $50K+ in liquid capital. Call us at (919) 827-3921 to discuss your situation.
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={heroSubmitting}
                        className="w-full h-[52px] font-bold text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                        style={{ background: "#C4704A", color: "#fff" }}
                        data-testid="button-hero-submit"
                      >
                        {heroSubmitting ? "Submitting…" : "Book My 15-Min Call"}
                      </button>

                      <p className="text-xs text-center" style={{ color: "#7A7065" }}>
                        🔒 Secure · No spam, ever
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROOF STRIP ── */}
      <section className="py-8 border-y" style={{ background: "#FEFAF4", borderColor: "#E4D9CC" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <p className="text-center text-xs uppercase tracking-[3px] font-semibold mb-6" style={{ color: "#7A7065" }}>
            Franchise brands in our network include
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {brandLogos.map((b, i) => (
              <div
                key={i}
                className="grayscale opacity-50 hover:grayscale-0 hover:opacity-90 transition-all duration-300"
                data-testid={`brand-logo-${i}`}
              >
                <img src={b.logo} alt={b.name} className="h-8 md:h-10 object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LOCAL ── */}
      <section className="py-20 md:py-28" style={{ background: "#F7F1E8" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-[3px] uppercase text-center mb-4" style={{ color: "#A85A34" }}>
              Local Advantage
            </p>
            <h2
              className="font-['Playfair_Display'] font-bold text-center mb-4 leading-tight"
              style={{ color: "#1F4E5F", fontSize: "clamp(28px, 4vw, 42px)" }}
            >
              Why a Local Consultant Matters
            </h2>
            <p className="text-center max-w-xl mx-auto mb-14" style={{ color: "#7A7065", fontSize: "1.1rem" }}>
              National firms don't know the Lowcountry. I do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "I Know the Lowcountry Market",
                body: "I know which franchise concepts are underserved in the Lowcountry and which ones are already saturated in Mount Pleasant. Where territories are still open in Summerville. What's working on Daniel Island.",
              },
              {
                title: "We Can Meet in Person",
                body: "Coffee at Second State, breakfast at Hominy Grill, or a quick call — whatever works for your schedule. Real conversation, not a Zoom you'd rather skip.",
              },
              {
                title: "I'm Your Neighbor, Not a Call Center",
                body: "You work with me directly from discovery through close. No handoffs, no junior reps, no call centers. One local advisor who's accountable to you.",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                style={{ background: "#FEFAF4", border: "1px solid #E4D9CC" }}
                data-testid={`card-local-${i}`}
              >
                <div className="mb-5" style={{ color: "#1F4E5F" }}>
                  <PalmettoIcon size={32} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3" style={{ color: "#1F4E5F" }}>
                  {c.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "#7A7065" }}>
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28" style={{ background: "#1F4E5F" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['Playfair_Display'] font-bold text-white text-center mb-16 leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                num: "01",
                title: "Discover",
                desc: "15-min call. We talk capital, goals, timeline, and lifestyle. No pitch — just listening.",
              },
              {
                num: "02",
                title: "Match",
                desc: "I present 2–4 vetted franchise brands that fit your profile. Real financials, honest assessment.",
              },
              {
                num: "03",
                title: "Decide",
                desc: "Due diligence, validation calls with existing franchisees, close support. You move at your own pace.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center px-4"
                data-testid={`card-step-${i}`}
              >
                <div className="flex justify-center mb-4" style={{ color: "#F7C59F" }}>
                  <PalmettoIcon size={36} />
                </div>
                <p
                  className="font-['Playfair_Display'] font-bold mb-2"
                  style={{ fontSize: "clamp(40px, 5vw, 56px)", color: "#C4704A", lineHeight: 1 }}
                >
                  {step.num}
                </p>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL (hidden until HAS_CHARLESTON_TESTIMONIAL = true) ── */}
      {HAS_CHARLESTON_TESTIMONIAL && (
        <section className="py-20 md:py-28" style={{ background: "#F7F1E8" }}>
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <PalmettoIcon size={32} className="mx-auto mb-6" style={{ color: "#A85A34" } as React.CSSProperties} />
            <blockquote
              className="font-['Playfair_Display'] italic mb-6 leading-relaxed"
              style={{ color: "#1F4E5F", fontSize: "clamp(22px, 3vw, 30px)" }}
            >
              "{CHARLESTON_TESTIMONIAL.quote}"
            </blockquote>
            <p className="font-semibold" style={{ color: "#2D2D2D" }}>
              {CHARLESTON_TESTIMONIAL.name}
            </p>
            <p className="text-sm" style={{ color: "#7A7065" }}>
              {CHARLESTON_TESTIMONIAL.neighborhood} · {CHARLESTON_TESTIMONIAL.brand}
            </p>
          </div>
        </section>
      )}

      {/* ── ABOUT CHARLES ── */}
      <section className="py-20 md:py-28" style={{ background: "#FEFAF4" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 md:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="/charles-headshot.jpeg"
                alt="Charles Stovall — Charleston franchise consultant"
                className="rounded-2xl shadow-xl w-full max-w-sm mx-auto object-cover"
                loading="lazy"
                width="300"
                height="380"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-bold tracking-[3px] uppercase mb-4" style={{ color: "#A85A34" }}>
                About Charles
              </p>
              <h2
                className="font-['Playfair_Display'] font-bold mb-6 leading-tight"
                style={{ color: "#1F4E5F", fontSize: "clamp(26px, 3.5vw, 38px)" }}
              >
                About Charles
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#7A7065" }}>
                I've spent 15+ years helping corporate professionals and executives make the transition to franchise ownership. I'm based in Charleston because I believe the Lowcountry is one of the best markets in the country for the right franchise concepts — and I want to be the advisor who knows that market inside and out.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "#7A7065" }}>
                My service costs you nothing. I'm compensated by franchisors when a placement happens, which means I have every incentive to find you the right fit — not just any fit. If franchising isn't right for you, I'll tell you that too.
              </p>
              <div className="flex flex-wrap gap-3">
                {["15+ Years Experience", "Licensed Franchise Consultant", "Charleston Resident"].map((badge, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-4 py-2 rounded-full"
                    style={{ background: "#1F4E5F", color: "#F7F1E8" }}
                    data-testid={`badge-${i}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM FORM (always visible, mobile-first full form) ── */}
      <section className="py-20 md:py-28" ref={bottomFormRef} style={{ background: "#F7F1E8" }} id="charleston-bottom-form">
        <div className="max-w-xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-[3px] uppercase text-center mb-4" style={{ color: "#A85A34" }}>
              Get Started
            </p>
            <h2
              className="font-['Playfair_Display'] font-bold text-center mb-2 leading-tight"
              style={{ color: "#1F4E5F", fontSize: "clamp(26px, 3.5vw, 38px)" }}
            >
              Book Your Free Charleston Consultation
            </h2>
            <p className="text-center mb-10" style={{ color: "#7A7065" }}>
              No cost. No pressure. Just a conversation about whether franchising makes sense for you.
            </p>
          </motion.div>

          <div className="rounded-2xl p-8 md:p-10 shadow-md" style={{ background: "#FEFAF4", border: "1px solid #E4D9CC" }}>
            {formSubmitted ? (
              <div className="text-center py-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "#1F4E5F" }}
                >
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-4" style={{ color: "#1F4E5F" }}>
                  You're all set.
                </h3>
                <p className="leading-relaxed" style={{ color: "#7A7065" }}>
                  I'll personally call you within 1 business day. For faster service, call{" "}
                  <a href="tel:9198273921" className="font-semibold hover:underline" style={{ color: "#C4704A" }}>
                    (919) 827-3921
                  </a>{" "}
                  now.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="form-first-name" className={labelCls}>First Name</label>
                    <input
                      id="form-first-name"
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className={fieldCls}
                      placeholder="First name"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-last-name" className={labelCls}>Last Name</label>
                    <input
                      id="form-last-name"
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className={fieldCls}
                      placeholder="Last name"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="form-email" className={labelCls}>Email</label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={fieldCls}
                    placeholder="Email address"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <label htmlFor="form-phone" className={labelCls}>
                    Phone <span style={{ color: "#C4704A" }}>*</span>
                  </label>
                  <input
                    id="form-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={fieldCls}
                    placeholder="Phone number (required)"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label htmlFor="form-capital" className={labelCls}>
                    Liquid Capital <span className="font-normal" style={{ color: "#7A7065" }}>(optional)</span>
                  </label>
                  <select
                    id="form-capital"
                    value={form.liquidCapital}
                    onChange={(e) => { setForm({ ...form, liquidCapital: e.target.value }); setFormCapitalError(false); }}
                    className={fieldCls}
                    data-testid="select-liquid-capital"
                  >
                    <option value="">Select range</option>
                    <option value="Under $50K">Under $50K</option>
                    <option value="$50K–$150K">$50K–$150K</option>
                    <option value="$150K–$500K">$150K–$500K</option>
                    <option value="$500K+">$500K+</option>
                  </select>
                  {formCapitalError && (
                    <p className="text-xs mt-1" style={{ color: "#A85A34" }} data-testid="error-capital">
                      We work with clients who have $50K+ in liquid capital. Call us at (919) 827-3921 to discuss your situation.
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="form-timeline" className={labelCls}>
                    Timeline <span className="font-normal" style={{ color: "#7A7065" }}>(optional)</span>
                  </label>
                  <select
                    id="form-timeline"
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className={fieldCls}
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
                  <label htmlFor="form-area" className={labelCls}>
                    What area of Charleston are you in? <span className="font-normal" style={{ color: "#7A7065" }}>(optional)</span>
                  </label>
                  <input
                    id="form-area"
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className={fieldCls}
                    placeholder="e.g. Mount Pleasant, Summerville, Downtown…"
                    data-testid="input-area"
                  />
                </div>
                <p className="text-xs text-center" style={{ color: "#7A7065" }}>
                  🔒 Your information is secure · No spam, ever
                </p>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full h-[54px] font-bold text-base rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  style={{ background: "#C4704A", color: "#fff" }}
                  data-testid="button-form-submit"
                >
                  {formSubmitting ? "Submitting…" : "Book My 15-Min Call"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28" style={{ background: "#FEFAF4" }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['Playfair_Display'] font-bold text-center mb-12"
            style={{ color: "#1F4E5F", fontSize: "clamp(26px, 3.5vw, 38px)" }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div style={{ borderBottom: "1px solid #D9CFC3" }}>
            {faqItems.map((item) => (
              <div key={item.id} style={{ borderTop: "1px solid #D9CFC3" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left group"
                  data-testid={`button-faq-${item.id}`}
                  aria-expanded={openFaq === item.id}
                >
                  <h3 className="font-semibold text-base md:text-lg transition-colors group-hover:opacity-80" style={{ color: "#1F4E5F" }}>
                    {item.q}
                  </h3>
                  <span className="flex-shrink-0 transition-transform duration-200" style={{ color: "#1F4E5F", transform: openFaq === item.id ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <ChevronDown size={20} />
                  </span>
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
                      <p className="leading-relaxed pb-5" style={{ color: "#7A7065" }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-24" style={{ background: "#C4704A" }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <PalmettoIcon size={36} className="mx-auto mb-6 text-white/60" />
            <h2
              className="font-['Playfair_Display'] font-bold text-white mb-4 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              Ready to Own a Business in Charleston?
            </h2>
            <p className="text-white/80 text-lg mb-10">
              One 15-minute call. No cost. No pressure.
            </p>
            <button
              onClick={scrollToForm}
              className="font-bold text-lg py-5 px-14 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl mb-4"
              style={{ background: "#1F4E5F", color: "#fff" }}
              data-testid="button-final-cta"
            >
              Book My Call
            </button>
            <p className="text-white/70 text-sm">
              Prefer to talk now?{" "}
              <a href="tel:9198273921" className="text-white font-semibold hover:underline">
                Call (919) 827-3921
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ── */}
      <footer className="py-10 px-4 text-center" style={{ background: "#1F4E5F" }}>
        <p className="font-['Playfair_Display'] font-bold text-lg mb-1" style={{ color: "#F7C59F" }}>
          Charles Stovall
        </p>
        <p className="text-sm mb-3 text-white/70">Licensed Franchise Consultant · Charleston, SC</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60 mb-4">
          <a href="tel:9198273921" className="hover:text-white transition-colors">(919) 827-3921</a>
          <span>·</span>
          <a href="mailto:charles.stovall@gmail.com" className="hover:text-white transition-colors">charles.stovall@gmail.com</a>
          <span>·</span>
          <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Franchise Friend. Results not guaranteed. Franchise investments involve risk.
        </p>
      </footer>
    </div>
  );
}
