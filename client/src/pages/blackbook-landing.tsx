import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, BookOpen, Phone, Download, Shield } from "lucide-react";

export default function BlackbookLanding() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
          message: "Black Book Download Request",
          leadType: "black-book",
        }),
      });
      
      const link = document.createElement('a');
      link.href = '/api/download-book';
      link.download = 'the-black-book-of-franchising.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setLocation("/thank-you-blackbook");
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
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                Free Download
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              The Black Book
              <br />
              <span className="text-[#D4AF37]">of Franchising</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The Unfiltered Truth About Franchise Ownership And Why Success Lies Within the Person Starting the Business
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl py-6 px-4 mb-12">
            <p className="text-center text-gray-500 text-xs font-semibold tracking-widest uppercase mb-4">
              Written By Charles Stovall
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <span className="text-[#1E2B42] font-bold text-sm">Franchise Owner</span>
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="text-[#1E2B42] font-bold text-sm">Advisor</span>
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="text-[#1E2B42] font-bold text-sm">Advocate</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                  <h2 className="text-2xl font-serif font-bold text-white">
                    What's Inside
                  </h2>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>The psychological gut check every franchisee must pass</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>How to navigate landlords, leases, and the "Mafia Kings"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>The mirror effect: what ownership reveals about you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>Why the "proven system" is a dangerous illusion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>The Lunch Test that saves franchisees thousands</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#D4AF37]/10 backdrop-blur rounded-xl p-6 border border-[#D4AF37]/30">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">
                  From the Author
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  "I've owned four franchises. I've been in the trenches with brands like Yoga Six, Image Studios, and Massage Envy. This book contains the hard truths that the glossy brochures at franchise expos will never tell you."
                </p>
                <p className="text-[#D4AF37] font-semibold text-sm">
                  — Charles Stovall
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#1E2B42] text-sm mb-1">100% FREE - No Gimmicks</p>
                    <p className="text-gray-600 text-sm">Get instant access to the complete guide. No credit card required. Your information stays private.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Download className="w-8 h-8 text-[#1E2B42]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-2 text-center">
                  Get Your Free Copy
                </h3>
                <p className="text-gray-600 text-center text-sm mb-6">
                  Enter your details below for instant access
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
                      placeholder="john@email.com"
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
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D4AF37] hover:bg-[#c9a432] text-[#1E2B42] font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                    data-testid="button-submit"
                  >
                    <Download size={20} />
                    {isSubmitting ? "Preparing Download..." : "Download The Black Book Now"}
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your information is safe. We never share or sell your data.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <img 
                    src="/charles-headshot.jpeg" 
                    alt="Charles Stovall" 
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="text-center sm:text-left">
                    <h4 className="text-base font-bold text-white mb-1">
                      About the Author
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Charles Stovall is a franchise owner, advisor, and advocate based in Charleston, SC. With experience owning four franchise concepts, he shares the unfiltered truth about what it really takes to succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-400 text-xs">
            © 2026 Charles Stovall. All Rights Reserved.
          </p>
          <a href="/" className="text-gray-400 text-xs hover:text-white transition">
            Back to Main Site
          </a>
        </div>
      </footer>
    </div>
  );
}
