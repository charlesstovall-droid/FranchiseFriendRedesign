import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Phone, Download, Shield } from "lucide-react";

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
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4">
                Free Download
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight text-center lg:text-left">
                The Black Book
                <br />
                <span className="text-[#D4AF37]">of Franchising</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 text-center lg:text-left">
                The Unfiltered Truth About Franchise Ownership
              </p>
              
              <div className="relative mb-8">
                <img 
                  src="/blackbook-cover.png" 
                  alt="The Black Book of Franchising" 
                  className="w-56 md:w-72 h-auto rounded-lg shadow-2xl"
                  data-testid="img-book-cover"
                />
                <div className="absolute -top-3 -right-3 bg-[#D4AF37] text-[#1E2B42] font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                  FREE
                </div>
              </div>

              <div className="text-gray-400 text-sm text-center lg:text-left">
                <p className="mb-2">By <span className="text-white font-semibold">Charles Stovall</span></p>
                <p>Franchise Owner | Advisor | Advocate</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-2 text-center">
                  Get Your Free Copy
                </h3>
                <p className="text-gray-600 text-center text-sm mb-6">
                  Enter your details for instant download
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
                    className="w-full bg-[#D4AF37] hover:bg-[#c9a432] text-[#1E2B42] font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-lg"
                    data-testid="button-submit"
                  >
                    <Download size={22} />
                    {isSubmitting ? "Preparing Download..." : "Download Now"}
                  </button>
                </form>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                  <Shield size={14} />
                  <p className="text-xs">Your information is safe. We never share your data.</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4">What You'll Learn:</h4>
                <ul className="space-y-3 text-gray-300 text-sm">
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
                    <span>Why the "proven system" is a dangerous illusion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>The Lunch Test that saves franchisees thousands</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-[#D4AF37]/10 backdrop-blur rounded-xl p-8 border border-[#D4AF37]/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src="/charles-headshot.jpeg" 
                alt="Charles Stovall" 
                className="w-24 h-24 rounded-full object-cover flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h4 className="text-xl font-bold text-white mb-2">About the Author</h4>
                <p className="text-gray-300 leading-relaxed">
                  "I've owned four franchises. I've been in the trenches with brands like Yoga Six, Image Studios, and Massage Envy. This book contains the hard truths that the glossy brochures at franchise expos will never tell you."
                </p>
                <p className="text-[#D4AF37] font-semibold mt-3">— Charles Stovall, Charleston SC</p>
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
