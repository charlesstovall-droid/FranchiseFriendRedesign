import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SEO } from "@/components/SEO";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What does a franchise consultant do?",
    answer: "A franchise consultant acts as your personal guide through the franchise discovery process. I help you identify opportunities that align with your goals, budget, and lifestyle — saving you months of research and helping you avoid costly mistakes. Think of me as a matchmaker between you and the right franchise investment."
  },
  {
    id: "2",
    question: "How much does it cost to hire a franchise consultant?",
    answer: "My franchise consulting services are completely free to you. I'm compensated by the franchise brands when a successful match is made, so you get expert guidance at no cost. There's no obligation, no hidden fees, and no pressure."
  },
  {
    id: "3",
    question: "How do I know which franchise is the right fit for me?",
    answer: "That's exactly what we figure out together. Through a detailed questionnaire and a one-on-one Zoom consultation, I learn about your interests, skills, investment range, and preferred territory. From there, I present franchise options tailored specifically to you — not a one-size-fits-all list."
  },
  {
    id: "4",
    question: "How much money do I need to invest in a franchise?",
    answer: "Franchise investments vary widely — from as low as $50,000 to over $1 million depending on the brand and industry. During our consultation, I'll help you understand what's realistic for your budget and connect you with franchise opportunities that match your financial goals."
  },
  {
    id: "5",
    question: "Do I need business experience to own a franchise?",
    answer: "Not necessarily. Many franchise systems are specifically designed for first-time business owners and provide comprehensive training, support, and a proven playbook. During our discovery process, I'll match you with brands that align with your experience level and strengths."
  },
  {
    id: "6",
    question: "What franchise industries can I explore?",
    answer: "I work across a wide range of industries including home services, fitness, health and wellness, senior care, food service, education, cleaning, real estate services, pet care, and many more. I have access to 700+ franchise brands, including top-rated opportunities from Franchise Business Review's Top 200."
  },
  {
    id: "7",
    question: "How long does the franchise discovery process take?",
    answer: "Most people go from initial consultation to narrowing down their top franchise choices within a few weeks. The full process — from first call to signing a franchise agreement — typically takes 30 to 90 days depending on your pace and comfort level."
  },
  {
    id: "8",
    question: "Can I use my 401(k) or retirement funds to buy a franchise?",
    answer: "Yes, many franchise owners use a strategy called ROBS (Rollover for Business Startups) to invest their retirement funds into a franchise without early withdrawal penalties. I can connect you with financial experts who specialize in franchise funding options including ROBS, SBA loans, and more."
  },
  {
    id: "9",
    question: "What's the first step to getting started?",
    answer: "It's simple — fill out my short franchise questionnaire and then book a free consultation on my calendar. From there, I'll take the lead and walk you through everything."
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Franchise Consulting FAQ | Charles Stovall"
        description="Everything you need to know about working with a franchise consultant. Get answers about franchise costs, discovery process, financing, and more."
        canonicalUrl="/faq"
        schema={faqSchema}
      />
      <Navbar />
      
      <section className="pt-24 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Franchise Consulting FAQ</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Everything you need to know about working with a franchise consultant
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-0 border-b border-border"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="border-t border-border"
              >
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full py-5 text-left group flex items-center justify-between gap-4"
                  data-testid={`button-faq-${item.id}`}
                >
                  <h3 className="font-semibold text-primary group-hover:text-accent-pop transition-colors text-lg pr-4">
                    {item.question}
                  </h3>
                  <span className={`text-2xl text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openId === item.id ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>

                {openId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="pb-5"
                  >
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {item.id === "9" ? (
                        <>
                          It's simple — fill out my short{" "}
                          <a
                            href="https://entree.franchoice.com/cq/index/pr63svil69jn3u37x2cfhhty7hhb4tgaziigjd7qtqgicplixo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary underline hover:text-accent-pop transition-colors"
                          >
                            franchise questionnaire
                          </a>{" "}
                          and then{" "}
                          <a
                            href="https://calendly.com/charles-stovall/consult"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary underline hover:text-accent-pop transition-colors"
                          >
                            book a free consultation
                          </a>{" "}
                          on my calendar. From there, I'll take the lead and walk you through everything.
                        </>
                      ) : (
                        item.answer
                      )}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

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
