import { useEffect } from "react";
import { TrendingUp, Clock, Building2, Shield, CheckCircle } from "lucide-react";

export default function ExecutiveInvestment() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const models = [
    {
      icon: Clock,
      title: "Semi-Absentee Franchises",
      description: "Keep your executive position while building equity in a business. Invest 10-15 hours per week to oversee operations."
    },
    {
      icon: Building2,
      title: "Manager-Run Business Models",
      description: "Hire a team to run day-to-day operations while you focus on strategic growth and investment returns."
    },
    {
      icon: TrendingUp,
      title: "Multi-Unit Investment Opportunities",
      description: "Build a portfolio of franchise locations to maximize revenue potential and create generational wealth."
    },
    {
      icon: Shield,
      title: "Recession-Resistant Service Franchises",
      description: "Essential services that perform well in any economy—from restoration to senior care to B2B services."
    },
  ];

  return (
    <div className="min-h-screen bg-[#1E2B42] flex flex-col">
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                Investment Opportunities
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Executive-Level
              <br />
              <span className="text-[#D4AF37]">Franchise Investment Opportunities</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Build wealth through business ownership without quitting your day job.
            </p>
          </div>

          {/* Target Audience */}
          <div className="bg-[#D4AF37]/10 backdrop-blur rounded-xl p-6 border border-[#D4AF37]/30 text-center mb-12">
            <p className="text-white">
              <span className="font-bold">For:</span> Corporate executives and investors with <span className="text-[#D4AF37] font-bold">$150K+ liquid capital</span> seeking proven business models.
            </p>
          </div>

          {/* Investment Models */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">
              Models I Specialize In
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {models.map((model, index) => {
                const Icon = model.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10"
                  >
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white mb-2">{model.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{model.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Income Potential */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10 mb-12">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">Build a Portfolio Business</h3>
                <p className="text-gray-300 leading-relaxed">
                  Many of my clients build portfolio businesses generating <span className="text-[#D4AF37] font-semibold">$200K-$500K+ annually</span> while maintaining their executive careers. The key is finding the right model for your goals and lifestyle.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-4">
              Explore Your Options
            </h3>
            <p className="text-gray-600 mb-6">
              Let's discuss which investment models align with your goals, timeline, and capital.
            </p>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1E2B42] hover:bg-[#2a3d5c] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200"
            >
              Book Your Free Consultation
            </a>
            <p className="text-xs text-gray-500 mt-4">
              Free, confidential consultation. No pressure. No obligation.
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
