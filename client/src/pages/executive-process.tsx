import { useEffect } from "react";
import { CheckCircle, Phone } from "lucide-react";

export default function ExecutiveProcess() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const steps = [
    {
      number: "1",
      title: "Discovery Call",
      description: "We start with a confidential conversation about your goals, lifestyle preferences, investment capacity, and timeline. This helps me understand exactly what you're looking for."
    },
    {
      number: "2", 
      title: "Franchise Matching",
      description: "I screen 4,000+ franchise brands to identify the best fits for YOUR specific situation. No generic lists—only carefully vetted opportunities that match your criteria."
    },
    {
      number: "3",
      title: "Brand Introductions",
      description: "I connect you directly with franchise development teams for the brands that interest you. You'll have insider access and a warm introduction that opens doors."
    },
    {
      number: "4",
      title: "Due Diligence Support",
      description: "I guide you through validation calls, FDD review, and the decision-making process. You'll never feel alone or overwhelmed during this critical phase."
    }
  ];

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
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                Our Process
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              How We Find Your
              <br />
              <span className="text-[#D4AF37]">Perfect Franchise Match</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              I do the heavy lifting so you don't waste time on bad fits.
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-6 mb-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 flex gap-6"
              >
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1E2B42] font-bold text-lg">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No Cost Section */}
          <div className="bg-[#D4AF37]/10 backdrop-blur rounded-xl p-8 border border-[#D4AF37]/30 text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
              <h3 className="text-xl font-serif font-bold text-white">No Cost to You</h3>
            </div>
            <p className="text-gray-300 max-w-xl mx-auto">
              My services are 100% free to you. Franchises pay my fee only if we find a match—similar to how an executive recruiter works.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Book your free discovery call and let's find your perfect franchise match.
            </p>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1E2B42] hover:bg-[#2a3d5c] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200"
            >
              Start Your Discovery Call
            </a>
            <p className="text-xs text-gray-500 mt-4">
              100% Confidential. No pressure. No obligation.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
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
