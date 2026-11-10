/**
 * Service pages. One source for the React pages and the crawler HTML in server/seo.ts.
 */

export const CONSULT_CALENDLY = "https://calendly.com/charles-stovall/consult";

export type Inline = string | { text: string; href: string };

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceLink {
  href: string;
  text: string;
}

export interface ServicePage {
  path: "/buy-a-franchise" | "/semi-absentee-franchise-consultant";
  title: string;
  description: string;
  h1: string;
  answer: string[];
  bridge: Inline[];
  checklistTitle: string;
  checklist: string[];
  faqs: ServiceFaq[];
  related: ServiceLink[];
}

export const servicePages: ServicePage[] = [
  {
    path: "/buy-a-franchise",
    title: "Buy a Franchise | Charles Stovall, Your Franchise Friend",
    description:
      "Buying a franchise starts with capital, the week you want, and the FDD. Charles Stovall, in Mt Pleasant, SC, reads Item 19, Item 7, and Item 20 with you.",
    h1: "If you are going to buy a franchise, start with the file.",
    answer: [
      "Buying a franchise is a six-figure decision dressed up as a brochure. I start with three things: what you can write a check for, how you want the week to feel, and whether the model still works after a normal month of labor and rent.",
      "I built 30 franchise locations across four brands and sold to private equity. I live in Mt Pleasant, South Carolina. When we sit down, you get an operator's read, not a tour of logos. If the concept is wrong for you, I will say so before you spend a month on it.",
      "The work is the same whether the pin is Shem Creek, Daniel Island, or a city in another state. We match the model, then we read the FDD.",
    ],
    bridge: [
      "If you want the order I use on a first pass, read ",
      { text: "how I read an FDD in 20 minutes", href: "/blog/how-i-read-an-fdd-in-20-minutes" },
      " and ",
      { text: "FDD red flags", href: "/blog/fdd-red-flags" },
      ". The cash you should still have after opening is its own question: ",
      { text: "liquidity after opening", href: "/questions/liquidity-after-opening" },
      ". If you are still deciding whether to buy at all, start with ",
      { text: "Is buying a franchise a good decision?", href: "/blog/is-buying-a-franchise-a-good-decision" },
      ".",
    ],
    checklistTitle: "What I want in hand before you fall in love with a brand",
    checklist: [
      "Liquid capital, and the cash you will still have the morning after opening",
      "Owner-operator, semi-absentee, or multi-unit, picked on purpose",
      "The town or neighborhood you actually mean",
      "Item 19, if they publish one, read for a median and a sample, not a highlight",
      "Item 7 priced against a real space, not the low end of the range",
      "Item 20: who opened, who transferred, who left",
      "Validation calls with owners the salesperson did not hand you",
      "A yes you can explain, or a no you can walk away with",
    ],
    faqs: [
      {
        question: "What is the first step if I want to buy a franchise?",
        answer:
          "A conversation about capital, calendar, and the kind of week you want. Then a short list. Then the FDD. Book a consult and bring a number you can actually write.",
      },
      {
        question: "Do I have to live in Charleston to work with you?",
        answer:
          "No. I live in Mt Pleasant and I know this market cold. I also work with buyers in other states. The file is the file. Local rent and local wages are what change.",
      },
      {
        question: "Which part of the FDD do you read first?",
        answer:
          "Item 20, then Item 19, then the working-capital line in Item 7. If those three do not hold, the rest of the brochure can wait.",
      },
    ],
    related: [
      { href: "/questions", text: "Buyer questions" },
      { href: "/semi-absentee-franchise-consultant", text: "Semi-absentee franchise consultant" },
      { href: "/charleston", text: "Franchise Consultant Charleston SC" },
      { href: "/mount-pleasant", text: "Franchise consultant in Mount Pleasant" },
    ],
  },
  {
    path: "/semi-absentee-franchise-consultant",
    title: "Semi-Absentee Franchise Consultant | Charles Stovall",
    description:
      "Semi-absentee still needs a general manager and your hours. Charles Stovall, in Mt Pleasant, SC, reads the labor model before you keep a W-2 and buy.",
    h1: "Semi-absentee still needs a manager and your hours.",
    answer: [
      "Semi-absentee means the unit can run a normal Tuesday without you behind the counter. It does not mean the business runs itself, and it does not mean a Sunday dashboard is ownership.",
      "Call me when you want to keep a W-2, or keep a calendar that is already full, and still own the asset. I have operated multi-unit brands. The first question is whether the labor model pays a real general manager and still leaves room on a careful month.",
      "If the only way the deal works is your unpaid time on the floor, you bought a job. I will say that early.",
    ],
    bridge: [
      "The longer version of the hours is ",
      { text: "what semi-absentee really requires", href: "/questions/semi-absentee-franchise" },
      ". Executives who want the same test on a shorter page can start at ",
      { text: "Executive Access", href: "/executive-access" },
      ".",
    ],
    checklistTitle: "The semi-absentee checklist I actually use",
    checklist: [
      "A general manager you would trust with the keys",
      "Ten to twenty hours a week from you in the first year, and more while you hire",
      "A labor model that survives a normal month without your unpaid shifts",
      "Item 19 you can turn into a conservative view of the unit",
      "Item 7 with a reserve, not a perfect ramp",
      "Item 20 owners who describe management, not covering shifts",
      "A territory you can visit when something breaks",
      "A stop rule: if it needs you on the floor, we stop",
    ],
    faqs: [
      {
        question: "Can I keep my job and buy a franchise?",
        answer:
          "Sometimes. Only if the model stands a normal month without you behind the counter. If it needs your unpaid time, you bought a job.",
      },
      {
        question: "How many hours is semi-absentee?",
        answer:
          "Plan on 10 to 20 hours a week early, and more during hiring. I wrote the detail on the semi-absentee question page, and I will hold a specific brand to that test.",
      },
      {
        question: "Where do you work from?",
        answer:
          "Mt Pleasant, South Carolina, at 1531 N Lakeshore Dr. Coffee in town, or a call if you are somewhere else.",
      },
    ],
    related: [
      { href: "/questions/semi-absentee-franchise", text: "What semi-absentee really requires" },
      { href: "/buy-a-franchise", text: "Buy a franchise" },
      { href: "/charleston", text: "Franchise Consultant Charleston SC" },
      { href: "/blog/fdd-red-flags", text: "FDD red flags" },
    ],
  },
];

export function getServicePage(path: string): ServicePage | undefined {
  return servicePages.find((page) => page.path === path);
}
