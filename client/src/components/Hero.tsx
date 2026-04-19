import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import charlesPhoto from "@assets/ImageStudios_KDP-3_websize_1775530552090.jpg";

// ── Issue 10: Social proof flag ──────────────────────────────────────────────
// TODO Charles: replace the placeholder copy below with a real stat/review,
// then set SHOW_HERO_SOCIAL_PROOF = true.
// Examples: "★★★★★ Rated by 50+ franchise buyers"
//           "Featured in Forbes" / a single testimonial quote + name + city
const SHOW_HERO_SOCIAL_PROOF = false;

function fireConversion() {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-593191309/w4I0CPeau54cEI3D7ZoC",
      value: 1.0,
      currency: "USD",
    });
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ChecklistCard() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Homepage Checklist Subscriber",
          email,
          phone: "",
          message: "Franchise Buyer Checklist — homepage hero opt-in",
          leadType: "homepage-checklist",
          // TODO: trigger Franchise Buyer Checklist auto-responder for homepage-checklist leadType
        }),
      });
      if (res.ok) {
        fireConversion();
        setSubmitted(true);
      } else {
        setEmailError("Something went wrong. Please try again.");
      }
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#1a2332] border border-[#c9a84c]/30 rounded-xl p-5 text-center">
        <CheckCircle2 className="w-8 h-8 text-[#c9a84c] mx-auto mb-2" />
        <p className="text-white font-semibold text-sm">
          Check your inbox — the checklist is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2332] border border-[#c9a84c]/30 rounded-xl p-5">
      <p className="text-[#c9a84c] text-[10px] font-bold uppercase tracking-[2px] mb-1">
        Free Download
      </p>
      <h4 className="text-white font-bold text-base leading-snug mb-1">
        The Franchise Buyer Checklist
      </h4>
      <p className="text-white/60 text-xs mb-3">7 questions that save six figures.</p>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
          placeholder="Your email address"
          className="w-full h-10 px-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm mb-2 focus:outline-none focus:border-[#c9a84c]/60"
          data-testid="input-checklist-email"
          required
        />
        {emailError && (
          <p className="text-red-400 text-xs mb-2" data-testid="error-checklist-email">{emailError}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-10 bg-[#c9a84c] text-[#1a2332] font-bold text-sm rounded-lg hover:bg-[#b8953f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-checklist-submit"
        >
          {submitting ? "Sending…" : "Send It to Me"}
        </button>
      </form>
      <p className="text-white/40 text-[10px] text-center mt-2">No spam. Unsubscribe anytime.</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#1a2332]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c9a84c 0%, transparent 40%)" }} />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1200px] relative z-10 grid md:grid-cols-2 gap-12 items-start py-12">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pt-4 md:pt-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] text-sm font-semibold mb-6 border border-[#c9a84c]/30 font-['Inter']">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
            Nationwide Franchise Advisor
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold text-white leading-[1.1] mb-6">
            <span className="text-[#c9a84c]">Charles Stovall</span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-white/90">Your Franchise Friend</span>
          </h1>

          {/* Issue 2: Updated body copy */}
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-lg leading-relaxed font-['Inter']">
            I've scaled 30 units across multiple states. Now I help executives and professionals avoid the mistakes I made — and find franchises actually worth owning. No cost to you.
          </p>

          {/* Issue 10: Social proof row (hidden until flag is true) */}
          {SHOW_HERO_SOCIAL_PROOF && (
            <div className="mb-6 flex items-center gap-2 text-white/80 text-sm font-['Inter']" data-testid="hero-social-proof">
              {/* TODO Charles: replace with real stat or remove entirely. */}
              ★★★★★ Trusted by franchise buyers across the U.S.
            </div>
          )}

          {/* Issue 1: Updated CTAs — stacked vertically to stay within left column */}
          <div className="flex flex-col gap-4 mb-10 max-w-sm">
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button
                size="lg"
                className="w-full bg-[#c9a84c] text-[#1a2332] hover:bg-[#b8953f] font-bold text-base h-12 shadow-lg transition-all font-['Inter']"
                data-testid="button-hero-primary"
              >
                Book a Free Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            {/* // TODO: replace with questionnaire route when built — currently linking to /franchise-assessment */}
            <Link href="/franchise-assessment" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 font-semibold text-base h-12 transition-all font-['Inter']"
                data-testid="button-hero-secondary"
              >
                Take the Franchise Questionnaire
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm font-medium text-white/60 font-['Inter']">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#c9a84c]" />
              <span>Expert Guidance on Franchise Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#c9a84c]" />
              <span>Financial Planning & Funding Strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#c9a84c]" />
              <span>Exclusive Market Opportunities</span>
            </div>
          </div>

          {/* Issue 7: Email capture — mobile only (shown below checkmarks on mobile) */}
          <div className="mt-8 md:hidden">
            <ChecklistCard />
          </div>
        </motion.div>

        {/* Right: Framed photo + email capture card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:flex flex-col gap-6"
        >
          {/* Gold accent border offset behind */}
          <div className="absolute -top-3 -right-3 w-full rounded-2xl border-2 border-[#c9a84c]/40 z-0" style={{ height: "600px" }} />
          {/* Photo frame */}
          <div className="relative rounded-2xl overflow-hidden border-4 border-[#c9a84c] shadow-2xl z-10" style={{ height: "600px" }}>
            <img
              src={charlesPhoto}
              alt="Charles Stovall, Charleston SC Franchise Consultant"
              className="w-full h-full object-cover object-top"
              loading="eager"
              fetchPriority="high"
            />
            {/* Subtle bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/50 via-transparent to-transparent" />
            {/* Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#1a2332]/90 backdrop-blur border border-[#c9a84c]/30 p-4 rounded-xl">
              <p className="text-[#c9a84c] uppercase text-xs font-bold tracking-widest mb-1 font-['Inter']">Your Franchise Friend™</p>
              <p className="text-white/80 text-sm italic font-['Inter']">"I provide a road map and honest assessment of how to succeed."</p>
            </div>
          </div>

          {/* Issue 7: Email capture card — desktop, below photo */}
          <ChecklistCard />
        </motion.div>
      </div>
    </section>
  );
}
