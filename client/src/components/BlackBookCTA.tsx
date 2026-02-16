import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function BlackBookCTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img 
              src="/blackbook-cover.png" 
              alt="The Black Book of Franchising" 
              className="w-64 md:w-80 h-auto rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
              data-testid="img-blackbook-home"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Everything I Wish I Knew Before Buying My First Franchise
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              I wrote The Black Book of Franchising from years of firsthand experience—
              <span className="text-secondary font-semibold"> the lessons, the wins, and the hard-earned wisdom</span> that only comes from actually doing the work.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "How to read an FDD like a seasoned franchise owner",
                "The financial benchmarks that separate great brands from average ones",
                "What to ask existing franchisees (and what their answers really mean)",
                "How to build a business that fits your life—not the other way around",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-400 mb-8">
              Free guide. No strings attached. Just the knowledge I wish someone had handed me on day one.
            </p>

            <Link href="/free-franchise-guide">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg h-12 px-8 group">
                Download Your Free Copy
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-xs text-gray-500 mt-6">
              Instant download — just enter your email
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
