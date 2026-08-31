export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Questions already shown on /faq (client bundle). */
export const siteFaqItems: FaqItem[] = [
  {
    id: "1",
    question: "What does a franchise consultant do?",
    answer:
      "A franchise consultant acts as your personal guide through the franchise discovery process. I help you identify opportunities that align with your goals, budget, and lifestyle — saving you months of research and helping you avoid costly mistakes. Think of me as a matchmaker between you and the right franchise investment.",
  },
  {
    id: "2",
    question: "How much does it cost to hire a franchise consultant?",
    answer:
      "My franchise consulting services are completely free to you. I'm compensated by the franchise brands when a successful match is made, so you get expert guidance at no cost. There's no obligation, no hidden fees, and no pressure.",
  },
  {
    id: "3",
    question: "How do I know which franchise is the right fit for me?",
    answer:
      "That's exactly what we figure out together. Through a detailed questionnaire and a one-on-one Zoom consultation, I learn about your interests, skills, investment range, and preferred territory. From there, I present franchise options tailored specifically to you — not a one-size-fits-all list.",
  },
  {
    id: "4",
    question: "How much money do I need to invest in a franchise?",
    answer:
      "Franchise investments vary widely — from as low as $50,000 to over $1 million depending on the brand and industry. During our consultation, I'll help you understand what's realistic for your budget and connect you with franchise opportunities that match your financial goals.",
  },
  {
    id: "5",
    question: "Do I need business experience to own a franchise?",
    answer:
      "Not necessarily. Many franchise systems are specifically designed for first-time business owners and provide comprehensive training, support, and a proven playbook. During our discovery process, I'll match you with brands that align with your experience level and strengths.",
  },
  {
    id: "6",
    question: "What franchise industries can I explore?",
    answer:
      "I work across a wide range of industries including home services, fitness, health and wellness, senior care, food service, education, cleaning, real estate services, pet care, and many more. I have access to 700+ franchise brands, including top-rated opportunities from Franchise Business Review's Top 200.",
  },
  {
    id: "7",
    question: "How long does the franchise discovery process take?",
    answer:
      "Most people go from initial consultation to narrowing down their top franchise choices within a few weeks. The full process — from first call to signing a franchise agreement — typically takes 30 to 90 days depending on your pace and comfort level.",
  },
  {
    id: "8",
    question: "Can I use my 401(k) or retirement funds to buy a franchise?",
    answer:
      "Yes, many franchise owners use a strategy called ROBS (Rollover for Business Startups) to invest their retirement funds into a franchise without early withdrawal penalties. I can connect you with financial experts who specialize in franchise funding options including ROBS, SBA loans, and more.",
  },
  {
    id: "9",
    question: "What's the first step to getting started?",
    answer:
      "It's simple — fill out my short franchise questionnaire and then book a free consultation on my calendar. From there, I'll take the lead and walk you through everything.",
  },
];

/** Q&A already stated in /charleston page copy (labor / rent / Item 19). */
export const charlestonFaqItems: FaqItem[] = [
  {
    id: "ch-labor",
    question: "Does a national average tell you what labor costs in Mt. Pleasant?",
    answer:
      "A national average does not know what labor costs in Mt. Pleasant, or whether the territory on Daniel Island is already spoken for.",
  },
  {
    id: "ch-item19",
    question: "What do you look at in an FDD for Charleston?",
    answer:
      "When we read an FDD together, you get an operator's view of Item 19, labor, and occupancy in this market — not a highlight reel built for a cheaper city. If the concept is wrong for Charleston, I will say so.",
  },
  {
    id: "ch-process",
    question: "How does working with you in Charleston work?",
    answer:
      "Discover — a 15-minute call on capital, goals, timeline, and lifestyle. Match — two to four vetted franchise brands that can live in the Lowcountry. Decide — due diligence, validation calls with existing franchisees, close support. You move at your own pace.",
  },
  {
    id: "ch-meet",
    question: "Can we sit down in the same city?",
    answer:
      "Coffee at Second State, breakfast, or a call — whatever fits your calendar. You work with me from discovery through close. No handoffs. No junior reps. No call center.",
  },
  {
    id: "ch-capital",
    question: "What capital do Charleston buyers typically bring?",
    answer:
      "I typically work with buyers who have $100K+ in liquid capital. Many Charleston clients invest $150K–$500K in proven concepts.",
  },
  {
    id: "ch-semi",
    question: "Does semi-absentee work in this market?",
    answer:
      "Semi-absentee is on the table if the labor model can stand a normal month without you behind the counter.",
  },
];

/** Q&A already stated in /executive-access page copy (labor / Item 19). */
export const executiveFaqItems: FaqItem[] = [
  {
    id: "ex-w2",
    question: "Can I keep the W-2 and still buy a franchise?",
    answer:
      "Keep the W-2. Buy a model that can run without you. Semi-absentee only works if the labor, the cash, and the file agree.",
  },
  {
    id: "ex-item19",
    question: "What does reading the file actually mean?",
    answer:
      "That's Item 19, labor, and occupancy — not a highlight reel. Item 19 if they give it. Item 7 versus the cash you'll actually need. Item 20 for who left. Then validation calls. Then you decide.",
  },
  {
    id: "ex-labor",
    question: "Why does the labor model matter for semi-absentee?",
    answer:
      "The question is whether the franchise can stand a normal month without you behind the counter. If the only way the deal works is a perfect ramp and a cheap manager, you didn't buy a business.",
  },
  {
    id: "ex-assess",
    question: "How does the executive assessment work?",
    answer:
      "Capital and calendar — what you can write, and what you can manage while the W-2 still pays. Match the model — unit economics that survive a normal month, not a perfect ramp. Read the file. If those numbers don't fit, we stop early.",
  },
  {
    id: "ex-where",
    question: "Where do you work from?",
    answer:
      "I still live in the Charleston / Mt. Pleasant market I send people into. Proof I actually operated: 30 locations. A PE exit. Working with executives nationwide.",
  },
];

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
