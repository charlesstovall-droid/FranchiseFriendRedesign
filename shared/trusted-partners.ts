/**
 * Trusted Partners. One source for the React page and the crawler HTML in server/seo.ts.
 */

import { PERSON_ID } from "./nap";
import { absoluteUrl } from "./site";
import { CONSULT_CALENDLY } from "./services";

export const TRUSTED_PARTNERS_PATH = "/trusted-partners";

export interface PartnerImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface TrustedPartner {
  id: string;
  firm: string;
  url: string;
  person?: string;
  role?: string;
  description: [string, string];
  logo: PartnerImage & { plate: "light" | "navy" };
  headshot?: PartnerImage & { frame: "avatar" | "portrait" };
}

export interface PartnerSection {
  id: string;
  title: string;
  lead: string;
  partners: TrustedPartner[];
}

export interface TrustedPartnersPage {
  path: typeof TRUSTED_PARTNERS_PATH;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  sections: PartnerSection[];
  footnote: string;
  questionsTitle: string;
  questions: string[];
  readingTitle: string;
  reading: { href: string; text: string }[];
  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
}

export const trustedPartnersPage: TrustedPartnersPage = {
  path: TRUSTED_PARTNERS_PATH,
  title: "Trusted Partners | Charles Stovall, Your Franchise Friend",
  description:
    "Funding, financial planning, and franchise attorneys Charles Stovall trusts and sends buyers to. Based in Mt Pleasant, SC.",
  h1: "People I trust and send clients to.",
  intro: [
    "Buying a franchise takes a team. I will read the file with you.",
    "I am not the lender, the planner, or the lawyer.",
  ],
  sections: [
    {
      id: "funding",
      title: "Funding",
      lead: "When the question is how to fund the franchise, these are the two firms I call.",
      partners: [
        {
          id: "franfund",
          firm: "FranFund",
          url: "https://www.franfund.com",
          person: "Tanielle Luepkes",
          role: "Funding Consultant",
          description: [
            "FranFund helps people fund a franchise by building a plan around their finances, including SBA and conventional loans and 401(k)/IRA rollover funding (ROBS).",
            "Their funding consultants walk you through the options and can issue a pre-approval.",
          ],
          logo: {
            src: "/partners/franfund-logo.png",
            alt: "FranFund logo",
            width: 292,
            height: 84,
            plate: "light",
          },
        },
        {
          id: "benetrends",
          firm: "Benetrends Financial",
          url: "https://www.benetrends.com",
          description: [
            "Benetrends has helped entrepreneurs fund franchises for nearly 40 years with 401(k)/IRA rollover funding (their Rainmaker Plan) and SBA and other business loans.",
            "They stay involved after funding with plan administration and ongoing support.",
          ],
          logo: {
            src: "/partners/benetrends-logo.png",
            alt: "Benetrends Financial logo",
            width: 640,
            height: 134,
            plate: "light",
          },
        },
      ],
    },
    {
      id: "financial-planning",
      title: "Financial Planning",
      lead: "Have this conversation before retirement money moves into a business.",
      partners: [
        {
          id: "coastal-strategic-capital",
          firm: "Coastal Strategic Capital",
          url: "https://www.coastalstrategiccapital.com",
          person: "Billy Petzold",
          role: "CDFA, Partner/Wealth Advisor (Charleston)",
          description: [
            "A Charleston wealth management firm that acts as a \"Family CFO\" for business owners, covering retirement, investments, tax, and business planning.",
            "Worth a conversation before you move retirement money into a business.",
          ],
          logo: {
            src: "/partners/coastal-strategic-capital-logo.png",
            alt: "Coastal Strategic Capital logo",
            width: 811,
            height: 60,
            plate: "light",
          },
          headshot: {
            src: "/partners/billy-petzold.jpg",
            alt: "Billy Petzold, wealth advisor at Coastal Strategic Capital in Charleston",
            width: 200,
            height: 200,
            frame: "avatar",
          },
        },
      ],
    },
    {
      id: "franchise-attorneys",
      title: "Franchise Attorneys",
      lead: "Have a franchise lawyer walk the FDD and the agreement before you sign.",
      partners: [
        {
          id: "kit-franchise-law",
          firm: "Kit Franchise Law",
          url: "https://kitfranchiselaw.com",
          person: "Kit Higgs",
          description: [
            "Kit's practice is franchise law only.",
            "He's a former general counsel at CycleBar who used to write FDDs, and now walks buyers through the FDD and franchise agreement cover to cover.",
          ],
          logo: {
            src: "/partners/kit-franchise-law-logo.png",
            alt: "Kit Franchise Law logo",
            width: 556,
            height: 120,
            plate: "light",
          },
          headshot: {
            src: "/partners/kit-higgs.webp",
            alt: "Kit Higgs, franchise attorney at Kit Franchise Law",
            width: 420,
            height: 741,
            frame: "portrait",
          },
        },
        {
          id: "barneslaw",
          firm: "BarnesLaw",
          url: "https://www.barneslaw.com",
          person: "Houston Barnes",
          description: [
            "BarnesLaw represents franchisees only.",
            "Houston started out drafting FDDs for franchisors and now reviews and negotiates them for buyers, with a flat-fee FDD review.",
          ],
          logo: {
            src: "/partners/barneslaw-logo.png",
            alt: "BarnesLaw logo",
            width: 640,
            height: 84,
            plate: "navy",
          },
          headshot: {
            src: "/partners/houston-barnes.webp",
            alt: "Houston Barnes, franchise attorney at BarnesLaw",
            width: 420,
            height: 761,
            frame: "portrait",
          },
        },
      ],
    },
    {
      id: "other",
      title: "Other people I trust",
      lead: "When franchising is not the right path, this is who I send people to.",
      partners: [
        {
          id: "experience-matters",
          firm: "Experience Matters",
          url: "https://expmatters.com",
          person: "Peter Sherer",
          role: "Executive transition coach",
          description: [
            "Peter Sherer founded Experience Matters in 2006 to coach executives and senior professionals through a career transition.",
            "The work is a structured process to clarify strengths, goals, and the next assignment.",
          ],
          logo: {
            src: "/partners/experience-matters-logo.png",
            alt: "Experience Matters logo",
            width: 427,
            height: 180,
            plate: "light",
          },
        },
      ],
    },
  ],
  footnote:
    "Each firm is independent. I don't speak for them, and they don't speak for me. Do your own diligence.",
  questionsTitle: "Questions to ask any partner",
  questions: [
    "Have you worked with franchise buyers, and what do you actually handle on a deal like mine?",
    "What do you need from me, and from the FDD, before you will give me a straight answer?",
    "If retirement money is in the plan, what moves, what stays put, and what is left if the first year is slow?",
    "On the FDD and the franchise agreement, what do you review line by line, and what do you leave with me?",
    "What does the next step look like, and what should I decide before I sign anything?",
  ],
  readingTitle: "Read this before you sign",
  reading: [
    { href: "/blog/how-i-read-an-fdd-in-20-minutes", text: "How I read an FDD in 20 minutes" },
    { href: "/blog/fdd-red-flags", text: "FDD red flags" },
    { href: "/questions/liquidity-after-opening", text: "Liquidity after opening" },
  ],
  ctaHeading: "Talk it through before you call them.",
  ctaBody:
    "Bring the brand and a number you can actually write. I will tell you what I would ask, and whether I would send you to one of these firms.",
  ctaLabel: "Book a call with Charles",
  ctaHref: CONSULT_CALENDLY,
};

export const trustedPartnerSteps = [
  { id: "funding", label: "Fund it", role: "Funding" },
  { id: "financial-planning", label: "Plan it", role: "Planning" },
  { id: "franchise-attorneys", label: "Protect it", role: "Legal" },
] as const;

export function trustedPartnerOrganizations(): TrustedPartner[] {
  return trustedPartnersPage.sections.flatMap((section) => section.partners);
}

export function trustedPartnerMarks(): { sectionId: string; partner: TrustedPartner }[] {
  return trustedPartnersPage.sections.flatMap((section) =>
    section.partners.map((partner) => ({ sectionId: section.id, partner })),
  );
}

export function trustedPartnersJsonLd(): object[] {
  const canonical = absoluteUrl(TRUSTED_PARTNERS_PATH);
  const partners = trustedPartnerOrganizations();
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": canonical,
      url: canonical,
      name: "Trusted Partners",
      description: trustedPartnersPage.description,
      about: { "@id": PERSON_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Partners I trust",
      itemListElement: partners.map((partner, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Organization",
          name: partner.firm,
          url: partner.url,
        },
      })),
    },
  ];
}
