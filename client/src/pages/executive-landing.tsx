import { useState } from "react";
import { useLocation } from "wouter";

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
    <div className="min-h-screen bg-[#1E2B42]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
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

        <div className="grid md:grid-cols-2 gap-12 items-start">
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
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-2 text-center">
              Request Your Free Consultation
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Discover franchise opportunities matched to your goals
            </p>
            
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

        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            Charles Stovall | Certified Franchise Consultant | Charleston, SC
          </p>
        </div>
      </div>
    </div>
  );
}
