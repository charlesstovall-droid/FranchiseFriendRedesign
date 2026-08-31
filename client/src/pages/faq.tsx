import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { faqPageSchema, siteFaqItems as faqItems } from "@shared/faq";

const faqSchema = faqPageSchema(faqItems);

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
