import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, BookOpen } from "lucide-react";

export default function BlackBook() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Create a simple PDF with the book content
      // For now, create a placeholder that triggers download
      const link = document.createElement('a');
      link.href = '/api/download-book';
      link.download = 'the-black-book-of-franchising.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-primary/5 to-background"
      style={{
        backgroundImage: 'url(/watermark.png)',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'bottom right',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '300px'
      }}
    >
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-12 font-medium">
          ← Back to Franchise Friend
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <BookOpen className="w-10 h-10 text-primary" />
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary">
                The Black Book<br />
                <span className="text-secondary">of Franchising</span>
              </h1>
            </motion.div>
            <p className="text-xl text-muted-foreground font-semibold">
              What every franchisor prays you never find
            </p>
          </div>

          {/* Book Cover Mockup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16 flex justify-center"
          >
            <div className="relative w-full max-w-sm h-80 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl border border-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-serif">The Black Book</p>
                <p className="text-sm text-gray-400">of Franchising</p>
                <p className="text-xs text-gray-500 mt-4">187 pages</p>
              </div>
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16 bg-secondary/5 border border-secondary/20 rounded-2xl p-8 md:p-10"
          >
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">
              Inside this 187-page guide:
            </h2>
            <ul className="space-y-4">
              {[
                "The 37 red-flag phrases buried in every FDD",
                "Franchises where 60%+ of owners lost money (Item 19 receipts)",
                "The 'renewal trap' that locks you in forever",
                "How brokers collect 6-figure checks to mislead you",
                "Real exits: who made 8 figures… and who walked away broke",
                "The silent million-dollar brands that never advertise",
                "Scripts that make franchisors sweat on Discovery Day",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-start gap-3 text-lg text-foreground"
                >
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl p-8 md:p-10 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold mb-2">
              Download your free PDF
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Get instant access to The Black Book. No email required.
            </p>

            <Button
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg h-12 mb-4"
              data-testid="button-download"
            >
              {isLoading ? "Preparing Download..." : "📥 Download PDF Now"}
            </Button>

            <p className="text-sm text-primary-foreground/70 text-center">
              187 pages of franchise insights and expert analysis
            </p>
          </motion.div>

          <p className="text-center text-muted-foreground text-sm">
            <span className="font-semibold">Why Charles created this:</span> Because
            if you're going to invest your life and fortune into a franchise, you
            deserve to know what nobody's telling you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
