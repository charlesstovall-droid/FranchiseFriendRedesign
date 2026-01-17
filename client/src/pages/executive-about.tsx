import { useEffect } from "react";
import { CheckCircle, MapPin, Users, Briefcase, Shield } from "lucide-react";

export default function ExecutiveAbout() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const credentials = [
    { icon: Briefcase, text: "15+ years in franchise consulting" },
    { icon: Users, text: "Helped 500+ people achieve their dream of business ownership" },
    { icon: Shield, text: "Personalized guidance through your franchise journey" },
    { icon: MapPin, text: "Based in Charleston, SC — work with clients nationwide" },
  ];

  return (
    <div className="min-h-screen bg-[#1E2B42] flex flex-col">
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                Meet Your Consultant
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Your Franchise Advisor:
              <br />
              <span className="text-[#D4AF37]">Charles Stovall</span>
            </h1>
          </div>

          {/* About Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="flex justify-center">
              <img 
                src="/charles-headshot.jpeg" 
                alt="Charles Stovall" 
                className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
              />
            </div>
            
            <div className="space-y-6">
              {credentials.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <p className="text-gray-300">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10 mb-12">
            <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">My Philosophy</h3>
            <p className="text-xl text-gray-300 text-center italic max-w-2xl mx-auto">
              "I'm not here to sell you a franchise. I'm here to help you find the RIGHT franchise for YOUR goals."
            </p>
          </div>

          {/* Trust Builders */}
          <div className="bg-[#D4AF37]/10 backdrop-blur rounded-xl p-8 border border-[#D4AF37]/30 mb-12">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                <p className="text-white font-semibold">Free Consultation</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                <p className="text-white font-semibold">100% Confidential</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                <p className="text-white font-semibold">No Obligation</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-serif font-bold text-[#1E2B42] mb-4">
              Let's Talk About Your Future
            </h3>
            <p className="text-gray-600 mb-6">
              Schedule a free, no-pressure conversation about your goals.
            </p>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1E2B42] hover:bg-[#2a3d5c] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200"
            >
              Schedule Your Free Intro Call
            </a>
            <p className="text-xs text-gray-500 mt-4">
              No sales pitch. Just an honest conversation.
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
