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
            <div className="relative w-72 h-96 bg-gradient-to-br from-gray-800 to-black rounded-lg shadow-2xl border border-gray-700 flex flex-col items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <BookOpen className="w-24 h-24 text-gray-400 mb-6" />
              <h3 className="text-2xl font-serif font-bold text-center px-6">
                The Black Book
              </h3>
              <p className="text-gray-400 text-sm mt-2">of Franchising</p>
              <p className="text-gray-500 text-xs mt-6">187 pages</p>
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
              <a>
                <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg h-12 px-8 group">
                  Get The Black Book
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
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