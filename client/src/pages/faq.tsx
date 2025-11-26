import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "What is franchising and how does it work?",
    answer: "Franchising is a business model where a franchisor (the established brand) grants a franchisee (you) the right to operate a business using their brand, systems, and support. You pay an initial franchise fee and ongoing royalties in exchange for access to proven business systems, training, and ongoing support."
  },
  {
    id: "2",
    category: "Getting Started",
    question: "Is franchise ownership right for me?",
    answer: "Franchise ownership is ideal if you want to start a business with reduced risk, proven systems, and brand recognition. However, it requires capital investment, adherence to franchisor guidelines, and a willingness to follow established procedures. We recommend our discovery process to help you determine if it's the right fit for your goals and lifestyle."
  },
  {
    id: "3",
    category: "Financial",
    question: "How much money do I need to start a franchise?",
    answer: "Investment requirements vary significantly by franchise, ranging from $50,000 to over $1 million. Costs include the franchise fee, build-out, equipment, inventory, and working capital. We help you identify franchises aligned with your financial capacity and explore SBA loans and other financing options."
  },
  {
    id: "4",
    category: "Financial",
    question: "What are the typical ongoing costs of owning a franchise?",
    answer: "Ongoing costs typically include royalties (usually 5-8% of gross sales), marketing fund contributions, rent, employee salaries, inventory, and operational expenses. It's crucial to understand all these costs upfront to evaluate profitability."
  },
  {
    id: "5",
    category: "Financial",
    question: "How do I finance a franchise?",
    answer: "Common financing options include personal savings, bank loans, SBA loans, home equity lines of credit, and franchisor financing programs. SBA loans are particularly popular for franchises because they offer favorable terms and lower down payments. We can guide you through the financing process."
  },
  {
    id: "6",
    category: "Operations",
    question: "How much control do I have as a franchisee?",
    answer: "Franchisees operate with varying degrees of control depending on the franchise system. You must follow the franchisor's brand standards, operational procedures, and quality guidelines. However, you typically have autonomy in hiring, local marketing, and day-to-day operations within those parameters."
  },
  {
    id: "7",
    category: "Operations",
    question: "What kind of support can I expect from the franchisor?",
    answer: "Most franchisors provide initial training, ongoing support, operational manuals, marketing support, technology systems, and access to a network of other franchisees. The level and quality of support varies significantly between franchisors, so it's important to evaluate this carefully."
  },
  {
    id: "8",
    category: "Operations",
    question: "Do I need prior experience in the industry?",
    answer: "Not necessarily. Franchisors typically provide comprehensive training to help you succeed regardless of prior experience. However, some franchises may prefer candidates with relevant background. What's most important is your commitment to following systems and your ability to manage the business effectively."
  },
  {
    id: "9",
    category: "Decision Making",
    question: "What should I look for when evaluating a franchise opportunity?",
    answer: "Key factors include: brand reputation and longevity, financial performance of existing franchisees, quality of franchisor support, franchise agreement terms, startup costs and profitability, market demand, competition, and alignment with your personal goals and lifestyle. We provide detailed analysis to help you evaluate opportunities thoroughly."
  },
  {
    id: "10",
    category: "Decision Making",
    question: "What are the red flags I should watch for?",
    answer: "Red flags include: high failure rates, pressure to sign quickly, guaranteed returns, lack of transparency about costs or performance, poor franchisor communication, excessive restrictions, or franchisors who don't have established support systems. We help you identify concerns early in the evaluation process."
  },
  {
    id: "11",
    category: "Decision Making",
    question: "How long does the franchise evaluation process take?",
    answer: "The typical timeline is 3-6 months from initial interest to signing an agreement. This includes franchise discovery, financial analysis, franchisee interviews, legal review, and due diligence. Rushing this process increases risk, so we guide you through each phase methodically."
  },
  {
    id: "12",
    category: "Legal & Compliance",
    question: "What is the Franchise Disclosure Document (FDD)?",
    answer: "The FDD is a legal document franchisors must provide that details the franchise company, its history, litigation, bankruptcy, fees, obligations, and financial performance. It's essential reading for any potential franchisee. We recommend having a franchise attorney review it before making a decision."
  },
  {
    id: "13",
    category: "Legal & Compliance",
    question: "Should I hire a lawyer before signing a franchise agreement?",
    answer: "Absolutely. A franchise attorney should review your franchise agreement to ensure your interests are protected and to explain all obligations and restrictions. While it's an additional cost, it's a worthwhile investment to avoid costly mistakes."
  },
  {
    id: "14",
    category: "Success",
    question: "What's the failure rate for franchises?",
    answer: "While franchises have lower failure rates than independent businesses, not all succeed. Success depends on the franchisor's reputation, your execution, market conditions, and local competition. We focus on helping you choose opportunities with strong track records and realistic potential in your target market."
  },
  {
    id: "15",
    category: "Success",
    question: "How long before my franchise becomes profitable?",
    answer: "Profitability timelines vary widely depending on the franchise type and market conditions. Many franchisees break even within 2-4 years and become profitable by year 3-5. During our analysis, we project realistic timelines based on historical data from established franchisees."
  },
  {
    id: "16",
    category: "Charles's Support",
    question: "What makes your approach different?",
    answer: "We combine data-driven analysis with personal guidance. Unlike generic consultants, I take time to understand your specific goals, lifestyle preferences, and financial situation to recommend franchises that truly fit YOUR ideal day. We walk with you through the entire process from discovery to launch."
  },
  {
    id: "17",
    category: "Charles's Support",
    question: "How can I get started with Franchise Friend?",
    answer: "Schedule a complimentary consultation to discuss your goals and explore whether franchise ownership makes sense for you. If it's a good fit, we'll begin the discovery process to identify the best opportunities aligned with your vision. You can book a time at: calendly.com/charles-stovall/intro"
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqItems.map(item => item.category))).sort();
  const filteredItems = selectedCategory 
    ? faqItems.filter(item => item.category === selectedCategory)
    : faqItems;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-24 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Get answers to common questions about franchise ownership and our process.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h3 className="text-lg font-bold text-primary mb-4">Filter by Topic</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? "default" : "outline"}
                className={selectedCategory === null ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "border-secondary text-secondary hover:bg-secondary/10"}
                data-testid="button-filter-all"
              >
                All Questions
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "border-secondary text-secondary hover:bg-secondary/10"}
                  data-testid={`button-filter-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full px-6 py-4 bg-white border border-border rounded-lg hover:border-accent-pop/40 transition-all text-left group"
                  data-testid={`button-faq-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-primary group-hover:text-accent-pop transition-colors text-lg">
                        {item.question}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-secondary flex-shrink-0 transition-transform ${
                        openId === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {openId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">No questions found in this category.</p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 bg-gradient-to-r from-accent-pop/5 to-accent-pop/10 border border-accent-pop/30 rounded-lg text-center"
          >
            <h3 className="text-2xl font-bold text-primary mb-3">Didn't find your answer?</h3>
            <p className="text-muted-foreground mb-6">Schedule a consultation with Charles to discuss your specific questions and explore franchise opportunities.</p>
            <a 
              href="https://calendly.com/charles-stovall/intro" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-accent-pop hover:bg-accent-pop/90 text-primary font-semibold">
                Book Your Free Consultation
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
