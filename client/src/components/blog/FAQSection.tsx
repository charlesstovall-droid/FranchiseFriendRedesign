import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FAQ } from "@/data/blog-posts";

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white border border-border rounded-xl p-6 mt-10">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-secondary" />
        <h2 className="text-2xl font-serif font-bold text-primary">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left bg-secondary/5 hover:bg-secondary/10 transition-colors"
              data-testid={`faq-toggle-${index}`}
            >
              <span className="font-semibold text-primary pr-4">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-secondary transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} 
              />
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
