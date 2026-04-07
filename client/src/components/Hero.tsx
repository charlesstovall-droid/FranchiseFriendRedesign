import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import charlesPhoto from "@assets/ImageStudios_KDP-3_websize_1775530552090.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden border-b-4 border-[#1a2332]">
      {/* Full-width background photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={charlesPhoto}
          alt="Charles Stovall, Franchise Consultant"
          className="w-full h-full object-contain object-right-top"
          style={{ objectPosition: "80% top" }}
        />
        {/* Navy left for text, fully transparent on right so photo shows clearly */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #1a2332 30%, rgba(26,35,50,0.6) 50%, rgba(26,35,50,0) 70%)" }} />
      </div>

      {/* Main content — left side */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl"
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

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed font-['Inter']">
            I guide people to franchise ownership with expertise, insight, and inside knowledge — helping you find the right opportunity, secure funding, and build lasting success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#c9a84c] text-[#1a2332] hover:bg-[#b8953f] font-bold text-base px-8 h-12 shadow-lg transition-all font-['Inter']">
                Start Your Search
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="#about">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-base h-12 transition-all font-['Inter']">
                Learn More
              </Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Checkmarks — bottom right, under Charles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-10 right-8 z-10 hidden md:flex flex-col gap-3"
      >
        <div className="flex items-center gap-2 bg-[#1a2332]/70 backdrop-blur px-4 py-2 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-[#c9a84c] flex-shrink-0" />
          <span className="text-white text-sm font-['Inter'] font-medium">Expert Guidance on Franchise Selection</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1a2332]/70 backdrop-blur px-4 py-2 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-[#c9a84c] flex-shrink-0" />
          <span className="text-white text-sm font-['Inter'] font-medium">Financial Planning & Funding Strategies</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1a2332]/70 backdrop-blur px-4 py-2 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-[#c9a84c] flex-shrink-0" />
          <span className="text-white text-sm font-['Inter'] font-medium">Exclusive Market Opportunities</span>
        </div>
      </motion.div>
    </section>
  );
}
