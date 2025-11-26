import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

export function BlackBookCTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left: Book Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-start"
          >
            <div className="perspective" style={{ perspective: "1200px" }}>
              <motion.div
                whileHover={{ rotateY: 15, rotateX: -5 }}
                transition={{ duration: 0.3 }}
                className="relative w-80 h-96 origin-center"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(-5deg) rotateY(-15deg) rotateZ(-8deg)",
                }}
              >
                {/* Book Cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                  {/* Red accent stripe */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-secondary to-transparent"></div>

                  {/* Content */}
                  <div className="h-full flex flex-col items-center justify-center px-8 text-white relative z-10">
                    {/* Decorative elements */}
                    <div className="absolute top-12 right-8 w-20 h-20 border border-secondary/30 rounded-full"></div>
                    <div className="absolute bottom-16 left-6 w-12 h-12 bg-secondary/10 rounded-lg"></div>

                    {/* Main content */}
                    <h3 className="text-2xl font-serif font-bold text-center leading-tight mb-1">
                      The
                    </h3>
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-serif font-bold text-white mb-0">
                        Black Book
                      </h4>
                      <p className="text-xs text-secondary font-semibold tracking-wide">
                        OF FRANCHISING
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-secondary to-transparent mb-4"></div>

                    {/* Tagline */}
                    <p className="text-center text-xs text-gray-300 italic max-w-xs">
                      What Every Franchisor Prays You Never Find
                    </p>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                  </div>
                </div>

                {/* Book spine/3D effect */}
                <div
                  className="absolute top-0 right-full w-8 h-96 bg-gradient-to-r from-gray-950 to-black rounded-l-xl"
                  style={{
                    transform: "translateX(-100%) rotateY(-90deg)",
                    transformOrigin: "right center",
                    boxShadow: "-10px 20px 40px rgba(0,0,0,0.8)",
                  }}
                ></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              What every franchisor prays you never read
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              The Black Book of Franchising reveals the hidden truths about franchise investing—
              <span className="text-secondary font-semibold"> the red flags, the exit traps, and the real numbers</span> behind Item 19.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "37 red-flag phrases in every FDD",
                "Franchises where 60%+ of owners lost money",
                "The renewal trap nobody talks about",
                "Real exits: who made millions vs. who lost everything",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-400 mb-8">
              Free PDF. Zero spam. Just the truth.
            </p>

            <Link href="/black-book">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg h-12 px-8 group">
                Get The Black Book
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-xs text-gray-500 mt-6">
              Download instantly after providing your email
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}