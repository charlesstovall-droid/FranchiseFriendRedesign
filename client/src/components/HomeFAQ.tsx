import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const faqItems = [
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
    question: "Can I use my 401(k) or retirement funds to buy a franchise?",
    answer: "Yes, many franchise owners use a strategy called ROBS (Rollover for Business Startups) to invest their retirement funds into a franchise without early withdrawal penalties. I can connect you with financial experts who specialize in franchise funding options including ROBS, SBA loans, and more."
  },
];

export function HomeFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
            Franchise Consulting FAQ
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about working with a franchise consultant
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="border-b border-border"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="border-t border-border"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full py-5 text-left group flex items-center justify-between gap-4"
                data-testid={`button-home-faq-${item.id}`}
              >
                <h3 className="font-semibold text-primary group-hover:text-accent-pop transition-colors text-lg pr-4">
                  {item.question}
                </h3>
                <span className={`text-2xl text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openId === item.id ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground leading-relaxed text-base pb-5">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link href="/faq">
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10 font-semibold"
              data-testid="button-view-all-faq"
            >
              View All Questions
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
