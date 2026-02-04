import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Phone } from "lucide-react";

export default function ExecutiveLanding() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    liquidCapital: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          message: `Liquid Capital: ${formData.liquidCapital}`,
          leadType: "executive-ad",
        }),
      });
      setLocation("/thank-you-ad");
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E2B42] flex flex-col">
      <a 
        href="tel:9198273921" 
        className="bg-[#D4AF37] text-[#1E2B42] py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#c9a432] transition-colors"
        data-testid="button-call-top"
      >
        <Phone size={18} className="animate-pulse" />
        <span className="font-bold text-sm">Call Now: (919) 827-3921</span>
      </a>
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                Exclusive Opportunity
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Escape the Golden Handcuffs.
              <br />
              <span className="text-[#D4AF37]">Executive Franchise Ownership.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              You've built someone else's empire. Now build your own.
            </p>
          </div>

          {/* Authority Bar - Trust Signals */}
          <div className="bg-gray-50 rounded-xl py-6 px-4 mb-12">
            <p className="text-center text-gray-500 text-xs font-semibold tracking-widest uppercase mb-4">
              Trusted Expertise in Franchise Consulting
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <span className="text-[#1E2B42] font-bold text-sm">15+ Years Experience</span>
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="text-[#1E2B42] font-bold text-sm">500+ Concepts Vetted</span>
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="text-[#1E2B42] font-bold text-sm">$0 Cost to Candidates</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Problem & Solution */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">
                  The Problem
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✗</span>
                    <span>Years of 60+ hour weeks with no equity to show for it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✗</span>
                    <span>Corporate politics limiting your potential</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✗</span>
                    <span>Your compensation tied to someone else's decisions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✗</span>
                    <span>No clear path to true financial independence</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#D4AF37]/10 backdrop-blur rounded-xl p-6 border border-[#D4AF37]/30">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">
                  The Solution
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✓</span>
                    <span>Proven business models with established systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✓</span>
                    <span>Build real equity in a business you own</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✓</span>
                    <span>Leverage your executive skills for yourself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">✓</span>
                    <span>Expert guidance from a certified franchise consultant</span>
                  </li>
                </ul>
              </div>

              {/* Who This Is For - The Filter */}
              <div className="bg-white rounded-xl p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#1E2B42] text-sm mb-1">PERFECT FOR:</p>
                      <p className="text-gray-600 text-sm">Executives looking to replace $150k+ income & Investors seeking proven business models.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#1E2B42] text-sm mb-1">NOT FOR:</p>
                      <p className="text-gray-600 text-sm">Those seeking hourly employment or "no money down" schemes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-2 text-center">
                  Request Your Free Consultation
                </h3>
                
                {/* Meet Your Advisor Section */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <img 
                      src="/charles-headshot.jpeg" 
                      alt="Charles Stovall" 
                      className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="text-center sm:text-left">
                      <h4 className="text-base font-bold text-[#1E2B42] mb-1">
                        Meet Your Advisor: Charles Stovall
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        As a Franchise Advisor, I specialize in helping corporate executives transition into business ownership. I don't sell franchises; I help you navigate the due diligence process to find the perfect match for your lifestyle. Let's build your exit strategy together.
                      </p>
                    </div>
                  </div>
                </div>
              
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                      placeholder="John Smith"
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                      placeholder="john@company.com"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                      placeholder="(555) 123-4567"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liquid Capital Available
                    </label>
                    <select
                      required
                      value={formData.liquidCapital}
                      onChange={(e) => setFormData({ ...formData, liquidCapital: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition bg-white"
                      data-testid="select-capital"
                    >
                      <option value="">Select your range</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                      <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                      <option value="$500,000+">$500,000+</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1E2B42] hover:bg-[#2a3d5c] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? "Submitting..." : "Get My Free Consultation"}
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  100% Confidential. No obligation. Speak directly with Charles Stovall.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[#D4AF37] font-bold text-sm mb-2">Q: Does this cost me money?</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                A: No. My services are 100% free to you. I am paid by the franchisor only if we find a match, similar to an executive recruiter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Compliance */}
      <footer className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-400 text-xs">
            © 2026 Charles Stovall Consulting. All Rights Reserved.
          </p>
          <a href="#" className="text-gray-400 text-xs hover:text-white transition">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
