/**
 * Buyer question pages. One source for the React pages and the crawler HTML in server/seo.ts.
 * Rules of thumb are Charles's operating practice, not published statistics.
 */

export type Inline = string | { text: string; href: string };

export interface QuestionSection {
  heading: string;
  paragraphs: Inline[][];
  bullets?: string[];
}

export interface QuestionFaq {
  question: string;
  answer: string;
}

export interface QuestionSource {
  label: string;
  href: string;
}

export interface QuestionLink {
  href: string;
  label: string;
}

export interface QuestionPage {
  slug: string;
  path: `/questions/${string}`;
  title: string;
  description: string;
  h1: string;
  lede: Inline[][];
  sections: QuestionSection[];
  faqs: QuestionFaq[];
  sources: QuestionSource[];
  related: QuestionLink[];
  ctaHeading: string;
  ctaBody: Inline[];
}

export interface QuestionIndex {
  path: "/questions";
  title: string;
  description: string;
  h1: string;
  lede: Inline[][];
}

const FTC_RULE = "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-436";
const FTC_GUIDE = "https://www.ftc.gov/business-guidance/resources/franchise-rule-compliance-guide";
const FTC_BUYING = "https://www.ftc.gov/system/files/documents/plain-language/pdf-0127_buying-a-franchise.pdf";
const SBA_7A = "https://www.sba.gov/loans/7a-loans/";
const SBA_DIRECTORY =
  "https://www.sba.gov/business-guide/plan-your-business/buy-existing-business-or-franchise/sba-franchise-directory";
const SBA_BUY = "https://www.sba.gov/business-guide/plan-your-business/buy-existing-business-or-franchise";
const CALENDLY = "https://calendly.com/charles-stovall/intro";

function p(...parts: Inline[]): Inline[] {
  return parts;
}

function link(text: string, href: string): Inline {
  return { text, href };
}

const fddRedFlags = link("FDD red flags I learned the hard way", "/blog/fdd-red-flags");
const fddRead = link("how I read an FDD in 20 minutes", "/blog/how-i-read-an-fdd-in-20-minutes");
const mistakes = link(
  "the mistakes that cost first-time buyers",
  "/blog/franchise-mistakes-first-time-buyers",
);
const advisor = link("the advisor", "/advisor");

export const questionIndex: QuestionIndex = {
  path: "/questions",
  title: "Franchise Questions Buyers Actually Ask | Charles Stovall",
  description:
    "Straight answers on cash after opening, semi-absentee hours, Item 19, a startup versus an existing business, and models with fewer employees.",
  h1: "Questions I get before someone signs",
  lede: [
    p(
      "Buyers ask the same handful of questions once the brochure is closed. These are the answers I give from Mount Pleasant, after building 30 franchise locations across four brands and selling to private equity.",
    ),
    p(
      "They are short on purpose. If a concept is wrong for you, I will say so. The longer file read lives in ",
      fddRedFlags,
      " and ",
      fddRead,
      ".",
    ),
  ],
};

export const questionPages: QuestionPage[] = [
  {
    slug: "liquidity-after-opening",
    path: "/questions/liquidity-after-opening",
    title: "How Much Liquidity Should I Retain After Opening a Franchise? | Charles Stovall",
    description:
      "Keep cash after you open, separate from Item 7. My rule of thumb is six months of fixed costs, and I will say when the model cannot hold it.",
    h1: "How much liquidity should I retain after opening?",
    lede: [
      p(
        "The cash you should still have the morning after opening is not the Item 7 total. Item 7 is the franchisor's estimate of what it costs to get the doors open, and the working-capital line inside it is usually a short, tidy ramp.",
      ),
      p(
        "My rule of thumb, after 30 locations, is to keep at least six months of fixed costs in a separate account on opening day. If the deal only works by spending that money to finish the build, you are not ready to open.",
      ),
    ],
    sections: [
      {
        heading: "Three piles people mix together",
        paragraphs: [
          p(
            "The first pile opens the business. Franchise fee, build-out, equipment, deposits, inventory, grand-opening ads. That is Item 7. The low end of the range is a marketing number. I start at the high end, then I ask owners what they actually wrote checks for.",
          ),
          p(
            "The second pile is the ramp. Item 7 includes additional funds for the opening period. The ",
            link("FTC Franchise Rule", FTC_RULE),
            " makes a franchisor disclose that estimate. It does not make the line survive a late landlord, a bad hire, and a quiet first quarter. I have never seen all three go right together.",
          ),
          p(
            "The third pile is liquidity after opening: cash you do not spend to get open, so payroll, rent, royalties, and the loan still clear if sales are late. Move it to finish construction and you did not have a reserve. You had a hole.",
          ),
        ],
      },
      {
        heading: "The six-month rule of thumb",
        paragraphs: [
          p(
            "Six months of fixed costs. Not six months of hoped-for revenue. Fixed means rent and CAM, insurance, debt service, software, royalties and the brand fund on a conservative sales guess, and the payroll you cannot cut without closing.",
          ),
          p(
            "If a paycheck still covers the house, I leave your draw out of those six months. If the franchise is how the family eats, a modest draw goes in. Mixing the two is how a spreadsheet starts lying. I want this answered in writing:",
          ),
        ],
        bullets: [
          "High end of Item 7, plus what the last few openers actually spent.",
          "Six months of fixed costs in cash, in an account construction cannot touch.",
          "A named backup for the first general manager.",
          "Insurance, deposits, and the first franchise payments on a calendar.",
          "Household bills for the same six months, if the paycheck is going away.",
          "The cash a lender still wants to see after you inject equity.",
        ],
      },
      {
        heading: "Questions worth asking out loud",
        paragraphs: [
          p(
            "Ask the franchisor, then ask owners what was in the bank the Monday after opening, and again ninety days later. A letter is not cash. Undrawn loans and retirement money still in a plan do not make payroll. If you are keeping a job, a real general manager belongs in the fixed costs. That week is ",
            link("what semi-absentee really requires", "/questions/semi-absentee-franchise"),
            ".",
          ),
          p(
            "An ",
            link("SBA 7(a) loan", SBA_7A),
            " can sit in the stack when the brand is on the ",
            link("SBA Franchise Directory", SBA_DIRECTORY),
            ". The SBA says a listing is not an endorsement and does not mean the business will succeed. Read Item 7 the way I do in ",
            fddRedFlags,
            ". Running out of cash on the open is also one of ",
            mistakes,
            ".",
          ),
        ],
        bullets: [
          "What does the additional-funds line assume, in months, and which costs sit inside it?",
          "What did recent openings spend against the Item 7 high?",
          "How many months until a new unit covered fixed costs from operations, not from the owner's pocket?",
          "If the first six months come in softer than the middle of Item 19, what breaks first?",
          "Do you require cash after opening, or only a net-worth figure to qualify?",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the Item 7 working-capital line the same as a reserve?",
        answer:
          "No. Item 7 estimates the open, including additional funds. A reserve is cash you still hold after that spend. I keep them in different accounts.",
      },
      {
        question: "What if the franchisor says three months is enough?",
        answer:
          "Treat that as a claim to test. I still want six months of fixed costs unless recent openers can show a boring ramp and name the costs in it.",
      },
      {
        question: "Does the reserve change if I am semi-absentee?",
        answer:
          "It gets stricter. You are paying a general manager from the start, and you may not be in the unit to catch a slow week. Price that wage into the fixed-cost number before you decide the reserve is extra.",
      },
    ],
    sources: [
      { label: "FTC Franchise Rule, 16 CFR Part 436", href: FTC_RULE },
      { label: "FTC Franchise Rule Compliance Guide", href: FTC_GUIDE },
      { label: "SBA 7(a) loans", href: SBA_7A },
      { label: "SBA Franchise Directory", href: SBA_DIRECTORY },
    ],
    related: [
      { href: "/questions/semi-absentee-franchise", label: "What semi-absentee really requires" },
      { href: "/questions/validate-item-19", label: "How I validate Item 19" },
      { href: "/blog/fdd-red-flags", label: "FDD red flags" },
      { href: "/blog/franchise-mistakes-first-time-buyers", label: "Mistakes first-time buyers make" },
      { href: "/advisor", label: "Try the advisor" },
    ],
    ctaHeading: "Pressure-test the reserve before you sign",
    ctaBody: [
      "If you have an Item 7 and a real budget, I will read them like an operator and tell you if the leftover cash is a reserve or a wish. ",
      link("Book a call", CALENDLY),
      ", or start with ",
      advisor,
      " if you are still sorting what kind of business should fit the life.",
    ],
  },
  {
    slug: "semi-absentee-franchise",
    path: "/questions/semi-absentee-franchise",
    title: "What Does a Semi-Absentee Franchise Really Require? | Charles Stovall",
    description:
      "Semi-absentee still needs a general manager you trust and about 10 to 20 hours a week early. Here is what that model actually asks of you.",
    h1: "What does semi-absentee really require?",
    lede: [
      p(
        "Semi-absentee means the unit can run a normal Tuesday without you behind the counter. It does not mean the business runs itself, and it does not mean a Sunday dashboard is ownership.",
      ),
      p(
        "Early on, plan on a general manager you would trust with the keys, and plan on 10 to 20 hours a week from you. Some weeks, especially while you are hiring, will run past that. If the deck says five hours from day one, ask for an owner in year one who is actually living it.",
      ),
    ],
    sections: [
      {
        heading: "What the phrase is doing in a sales call",
        paragraphs: [
          p(
            "“Semi-absentee” is supposed to mean you are not the labor. Sometimes the model only works if you are, and the hope is you will not notice until after you sign. I let the phrase stand when three things are true: the math pays a real general manager and still leaves profit on a careful month, the work is teachable without your face, and Item 20 owners describe management rather than covering shifts. If the page only works with your unpaid time, you bought a job. That shows up in ",
            mistakes,
            ". I start the file the way I describe in ",
            fddRead,
            ".",
          ),
        ],
      },
      {
        heading: "What the hours actually are",
        paragraphs: [
          p(
            "My rule of thumb for a true manager-run unit, early, is 10 to 20 hours a week. They will not arrive as a neat block on Thursday afternoon.",
          ),
        ],
        bullets: [
          "A weekly sit-down with the GM on the numbers that moved: sales, labor, reviews, cash.",
          "Hiring, and the second hire. Your GM needs a backup, or you become the backup.",
          "The problems that should not wait: a no-show, a review with a name on it, a vendor who did not deliver.",
          "Local decisions the brand will not make for you. A slow Tuesday. A lease conversation. A school or a shop that could send work.",
        ],
      },
      {
        heading: "The manager is the model",
        paragraphs: [
          p(
            "A strong GM is not a shift lead with a new title. Pay someone who can hire and tell you the truth when the week was bad, or you will hire twice. I will not invent a salary. Ask owners in a market like yours what they pay, fully loaded, and put that number in the fixed costs. Price the reserve as if the wage starts before revenue. That cash question is ",
            link("liquidity after opening", "/questions/liquidity-after-opening"),
            ". If Item 19 mixes owner-operators with manager-run units, do not average them. ",
            link("Validating Item 19", "/questions/validate-item-19"),
            " is that page. The cute versions are in ",
            fddRedFlags,
            ".",
          ),
        ],
        bullets: [
          "What do semi-absentee owners pay a GM, fully loaded, in a market like mine?",
          "What share of owners kept a W-2 through year one, and can I call three of them?",
          "What happens, in practice, when the manager quits in month four?",
          "Is there an assistant or a key holder, or am I the backup plan?",
          "Which Item 19 columns are franchisee units with a manager, and which are owner-operated or company stores?",
        ],
      },
      {
        heading: "The tradeoff, said plainly",
        paragraphs: [
          p(
            "Profit will be lower than an owner-operated unit because you paid for the role you are not filling. That is the point. If you need the manager's wage as your income, you are understaffed. Ten distracted hours are worse than ten hours on a weekly rhythm. I do not use the word passive. Managed is the honest word.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: "Can I keep my job?",
        answer:
          "Often, if the labor model stands without you and your job can live with 10 to 20 hours that sometimes land early. The first 90 days are the test. If training keeps you on site full time for months, say that out loud before you call it semi-absentee.",
      },
      {
        question: "What if I cannot find a GM before I open?",
        answer:
          "Then you are the GM until you do. Price your time that way, and do not open on a promise that someone will turn up. I have watched that someone arrive after the reserve was already thin.",
      },
      {
        question: "Is semi-absentee the same as passive income?",
        answer:
          "No. You still own the payroll, the lease, and the result. A manager runs the Tuesday. You still have to notice when the Tuesday is wrong.",
      },
    ],
    sources: [
      { label: "FTC Franchise Rule Compliance Guide", href: FTC_GUIDE },
      { label: "FTC, Buying a Franchise", href: FTC_BUYING },
    ],
    related: [
      { href: "/questions/liquidity-after-opening", label: "Liquidity after opening" },
      { href: "/questions/low-employee-franchises", label: "Businesses with fewer employees" },
      { href: "/questions/validate-item-19", label: "How I validate Item 19" },
      { href: "/blog/fdd-red-flags", label: "FDD red flags" },
      { href: "/blog/how-i-read-an-fdd-in-20-minutes", label: "How I read an FDD in 20 minutes" },
      { href: "/blog/franchise-mistakes-first-time-buyers", label: "Mistakes first-time buyers make" },
      { href: "/advisor", label: "Try the advisor" },
    ],
    ctaHeading: "If you want the week, not the slogan",
    ctaBody: [
      "Bring the brand and the calendar you actually have. I will tell you whether the labor model can stand a normal month without you. ",
      link("Book a call", CALENDLY),
      ", or use ",
      advisor,
      " if you are still deciding what role you want in the business at all.",
    ],
  },
  {
    slug: "validate-item-19",
    path: "/questions/validate-item-19",
    title: "How Do I Validate Item 19? | Charles Stovall",
    description:
      "Item 19 is useful only if you can rebuild it. Check the median against the average, see which units are included, and call the owners.",
    h1: "How do I validate Item 19?",
    lede: [
      p(
        "Item 19 is the only place a franchisor may put a financial performance representation in the FDD, and only if they choose to make one. The FTC does not require them to make one.",
      ),
      p(
        "Validating it means you can explain the table without the salesperson: what was measured, which units were included, and whether a careful owner in your situation could land near the middle. If you cannot do that after the footnotes and the calls, treat the page as missing.",
      ),
    ],
    sections: [
      {
        heading: "What the page is allowed to be",
        paragraphs: [
          p(
            "The ",
            link("FTC compliance guide", FTC_GUIDE),
            " requires a reasonable basis, written substantiation, a home in Item 19, and a warning that your results may differ. The ",
            link("FTC's consumer guide", FTC_BUYING),
            " says claims about sales, income, or profits belong there. No Item 19 is legal, and it is still a flag: you are modeling from calls with nothing written to check them against.",
          ),
          p(
            "A cute Item 19 is worse. I slow down for an average with no middle, sales with no costs, company stores dressed up as franchisees, or a subset that is the best group. The longer list is in ",
            fddRedFlags,
            ". The order I use is in ",
            fddRead,
            ".",
          ),
        ],
      },
      {
        heading: "Median, average, and which units count",
        paragraphs: [
          p(
            "An average can be one great unit and a pile of ordinary ones. A median is the middle. The Rule does not force a brand to publish both. I still want both, and the count. The guide does require them to say whether the figure is all outlets or a subset, and whether those outlets are franchised, company-owned, or an affiliate's. I write that down before I read a dollar.",
          ),
        ],
        bullets: [
          "Franchisee units, company-owned, affiliate, or a blend the footnote hopes you will skip?",
          "How many outlets were open, how many were measured, and why were the others left out?",
          "Are new units in the set, or only units open a full year?",
          "Is it a calendar year, a trailing twelve months, or a period someone chose?",
          "Are manager-run units separated from owner-operated units?",
          "Does the table show costs, or only the top line?",
        ],
      },
      {
        heading: "The calls that check the page",
        paragraphs: [
          p(
            "The FTC allows two extras outside a canned speech: the actual records of an outlet you are buying, or a supplement to Item 19 for a particular location. Any other number in a sales call does not go in my model unless they can point to it in the document.",
          ),
          p(
            "Then call a recent opener, a three-year owner, a multi-unit operator, and someone who left. Ask if they were in the group, where they sit against the median, and which costs the table skips. One glowing call is a testimonial. Five mixed calls are diligence. Build the P&L from the middle, with your wages and rent. A national average does not know Mount Pleasant labor. If that page misses fixed costs plus the ",
            link("reserve after opening", "/questions/liquidity-after-opening"),
            ", Item 19 told you no. I am not a lawyer. The page is a disclosure, not a promise.",
          ),
        ],
        bullets: [
          "Were you in the Item 19 group last year, and where did you land against the middle?",
          "What did you actually spend to open versus Item 7?",
          "Which costs do you pay that this table never shows?",
          "Did your first year look anything like this page?",
          "Which units got left out, and do you know why?",
          "Would you buy this brand again, knowing what you know?",
        ],
      },
    ],
    faqs: [
      {
        question: "What if the FDD has no Item 19?",
        answer:
          "You can still diligence the brand. You cannot pretend you have a performance number. Build from owner financials they are willing to share, from Item 7, and from Item 20. If owners will not share anything, that silence is the validation.",
      },
      {
        question: "Should I use the average as my sales guess?",
        answer:
          "No. I start at the median when they publish one, then I haircut for a new unit and for my market. An average is a fact about a group. It is a bad personal budget.",
      },
      {
        question: "Can a salesperson quote numbers that are not in Item 19?",
        answer:
          "Only in the narrow cases the FTC describes: actual records of an outlet you are buying, or a supplement to Item 19 for a particular location or circumstance. Anything else does not go in my model.",
      },
    ],
    sources: [
      { label: "FTC Franchise Rule Compliance Guide (Item 19)", href: FTC_GUIDE },
      { label: "FTC, Buying a Franchise", href: FTC_BUYING },
      { label: "FTC Franchise Rule, 16 CFR Part 436", href: FTC_RULE },
    ],
    related: [
      { href: "/questions/liquidity-after-opening", label: "Liquidity after opening" },
      { href: "/questions/franchise-vs-existing-business", label: "Startup versus an existing business" },
      { href: "/blog/fdd-red-flags", label: "FDD red flags" },
      { href: "/blog/how-i-read-an-fdd-in-20-minutes", label: "How I read an FDD in 20 minutes" },
      { href: "/blog/franchise-mistakes-first-time-buyers", label: "Mistakes first-time buyers make" },
      { href: "/advisor", label: "Try the advisor" },
    ],
    ctaHeading: "Bring the Item 19, not the highlight reel",
    ctaBody: [
      "If a table is in your inbox, we can mark the subset, the middle, and the calls you still need. ",
      link("Book a call", CALENDLY),
      ". If you do not have a brand yet, ",
      advisor,
      " is the quieter place to start.",
    ],
  },
  {
    slug: "franchise-vs-existing-business",
    path: "/questions/franchise-vs-existing-business",
    title: "Franchise Startup vs Buying an Existing Business | Charles Stovall",
    description:
      "A new franchise buys a system and a ramp you have to fund. An existing business buys cash flow and whatever the seller is tired of fixing.",
    h1: "Franchise startup vs buying an existing business",
    lede: [
      p(
        "A franchise startup buys a system, a brand, and a ramp you have to fund. An existing business buys customers, habits, and whatever the seller is ready to stop carrying.",
      ),
      p(
        "Neither is automatically safer. I pick by which risk you can actually carry: a slow open with a playbook other owners will talk about, or a faster start with less of a map and more cleanup.",
      ),
    ],
    sections: [
      {
        heading: "What you own on day one",
        paragraphs: [
          p(
            "On a new franchise, day one is a territory, a manual, training dates, and a build-out. Revenue is a forecast. The system is worth something only if owners will take your call and ",
            link("Item 19 can be validated", "/questions/validate-item-19"),
            ". On an existing business you can read tax returns and watch a Tuesday. You also inherit the lease, the team, the reviews, and the reason they are selling. Sellers know more than you. That gap is the risk.",
          ),
          p(
            "The ",
            link("SBA frames the choice", SBA_BUY),
            " as guidance versus control: more of the brand's rules and help, or more say and less of a map. Fair start. Not the whole underwriting. A franchise resale sits in between, cash flow plus a remodel and a culture you did not hire. I wrote ",
            link("why a resale can be a headache", "/blog/new-franchise-vs-resale-headache"),
            " for that case.",
          ),
        ],
      },
      {
        heading: "The same questions, both paths",
        paragraphs: [
          p(
            "The SBA also tells buyers to price the investment, be honest about skills, and read contracts, leases, and cash flow. Their checklist still says UFOC. Under the current ",
            link("FTC Franchise Rule", FTC_RULE),
            " the document is the FDD. Same job, current name. ",
            fddRedFlags,
            " is how I read the flags. ",
            mistakes,
            " is what happens when people skip them.",
          ),
        ],
        bullets: [
          "Can I see three years of tax returns, not a spreadsheet prepared for the sale?",
          "What cash is left after I write the check? A startup needs a reserve through the ramp. A purchase needs a reserve through the surprises.",
          "Who does the work on a normal Tuesday, and will they stay?",
          "What stops a customer from leaving when the name on the door changes, or before the name has a reputation?",
          "How do I get out later? A franchise transfer needs brand approval. A small shop needs a buyer who wants that shop.",
        ],
      },
      {
        heading: "Rules of thumb, not laws",
        paragraphs: [
          p(
            "If you have never run a business, a franchise with real training and owners who sound like operators is usually the cleaner first rep. If you already know the trade and the books are clean, an existing business can be the better buy. You are not paying a royalty to learn a job you can do, and you also have no brand to blame when the Tuesday is yours.",
          ),
          p(
            "If the seller cannot explain the last bad year in one sentence you can check, I slow down. People sell good businesses. They also sell just before a lease resets. Either path needs leftover cash. That is ",
            link("liquidity after opening", "/questions/liquidity-after-opening"),
            ", and it applies after a purchase too.",
          ),
        ],
        bullets: [
          "Franchisor: what do the 12 months after training week actually look like?",
          "Franchisor: what did recent startups spend versus Item 7, and when did fixed costs get covered from operations?",
          "Seller: why now, and who else have you told?",
          "Seller: which employee, if they quit in month two, breaks the week?",
          "Seller: what repair or equipment have you put off, and will you say it in writing?",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a franchise safer than a business someone is selling?",
        answer:
          "Not by itself. A franchise gives you a disclosure document and other owners to call. It does not give you a guaranteed result. An existing business gives you history. History can be good or bad, and you have to read it.",
      },
      {
        question: "Should I buy a franchise resale instead?",
        answer:
          "Only after you know why they are leaving and what the brand will make you spend to meet current standards. Cash flow on day one is not a discount if the remodel and the culture eat it.",
      },
      {
        question: "Which path needs more cash after closing?",
        answer:
          "Usually the startup, because revenue is still a forecast. A purchase can surprise you just as hard if every dollar went into the price. I want leftover cash either way.",
      },
    ],
    sources: [
      { label: "SBA, Buy an existing business or franchise", href: SBA_BUY },
      { label: "FTC Franchise Rule, 16 CFR Part 436", href: FTC_RULE },
      { label: "FTC, Buying a Franchise", href: FTC_BUYING },
    ],
    related: [
      { href: "/questions/validate-item-19", label: "How I validate Item 19" },
      { href: "/questions/liquidity-after-opening", label: "Liquidity after opening" },
      { href: "/questions/low-employee-franchises", label: "Businesses with fewer employees" },
      { href: "/blog/fdd-red-flags", label: "FDD red flags" },
      { href: "/blog/franchise-mistakes-first-time-buyers", label: "Mistakes first-time buyers make" },
      { href: "/blog/new-franchise-vs-resale-headache", label: "Why a resale can be a headache" },
      { href: "/advisor", label: "Try the advisor" },
    ],
    ctaHeading: "Pick the risk you can carry",
    ctaBody: [
      "Bring the FDD or the seller's numbers. I will tell you which story is skipping a document. ",
      link("Book a call", CALENDLY),
      ", or start with ",
      advisor,
      " if you are still deciding whether ownership should look like a startup at all.",
    ],
  },
  {
    slug: "low-employee-franchises",
    path: "/questions/low-employee-franchises",
    title: "Which Franchise Businesses Require Fewer Employees? | Charles Stovall",
    description:
      "Fewer employees can mean a simpler week or a job you cannot leave. How I read the labor model before I treat a small staff as a virtue.",
    h1: "Which businesses require fewer employees?",
    lede: [
      p(
        "The franchises that need fewer employees are usually the ones that are not staffing a shift all day: mobile and route service, some home-based business-to-business models, and owner-operated concepts built for one or two people.",
      ),
      p(
        "Fewer people is not the same as less work. Often the work sits with you, or with one hire you cannot afford to lose. I will not hand you a brand list and call it an answer. Bring the constraint. The file either agrees or it does not.",
      ),
    ],
    sections: [
      {
        heading: "What people mean when they ask",
        paragraphs: [
          p(
            "Sometimes they want a simpler week: fewer schedules, fewer no-shows. Fair. Sometimes they want ",
            link("semi-absentee", "/questions/semi-absentee-franchise"),
            " with almost no payroll. Those fight. A unit with no staff needs you. A unit that runs without you needs staff. You do not get both on day one. And “I do not want to be a boss” still means you manage someone, or you are the someone.",
          ),
        ],
      },
      {
        heading: "Models that tend to stay lean",
        paragraphs: [
          p(
            "These are categories, not brand picks, and not earnings claims. Whether one of them fits still depends on the FDD in front of you and on owners who will describe a real Tuesday.",
          ),
        ],
        bullets: [
          "Mobile and route service. One van and a defined job. Until volume pays for a second tech, you are the tech.",
          "Home-based business-to-business, when you sell and someone else delivers. Read who employs the crew. A contractor you still have to cover on Monday is not “no employees.”",
          "Referral businesses where the calendar is the constraint. One or two people, and the pipeline stops if you stop calling.",
          "Owner-operated specialty service. A lead and a helper. It is a job with a brand on it until a second crew exists.",
        ],
      },
      {
        heading: "How I check the claim in the file",
        paragraphs: [
          p(
            "A brochure can say “low labor.” Item 7, Item 15, and the owners are pickier. Item 15 says whether you must participate in the actual operation, and what limits they put on a supervisor if you do not. The ",
            link("compliance guide", FTC_GUIDE),
            " spells that out. I read it on the same pass as ",
            fddRead,
            ".",
          ),
          p(
            "My rule of thumb: a full week in the field means owner-operated. Ten to 20 hours plus one strong lead means a small team. Price that lead first. Restaurants, dawn-staffed studios, and “low labor” decks stay off my short list unless owners show me otherwise. Headcount is also a poor way to choose between ",
            link("a startup and an existing business", "/questions/franchise-vs-existing-business"),
            ".",
          ),
        ],
        bullets: [
          "Whose wages are in Item 7, and for how many months?",
          "If Item 19 shows costs, is a lead or a tech in there, or only an owner draw dressed up as profit?",
          "Does Item 15 let a trained manager run the unit, or does it require you on the tools?",
          "How many people were on the payroll in month six, and how many in month eighteen?",
          "What happens to revenue the week you are out?",
          "If you have no employees, what did you give up to keep it that way?",
        ],
      },
      {
        heading: "The tradeoff",
        paragraphs: [
          p(
            "Lean is easier to schedule and harder to leave. One resignation is a crisis, not a shift. If “fewer employees” means “I want evenings,” or “I do not want to manage people,” say which. Some models fit. Most that scale do not, because scaling is adding people on purpose. Staying tiny caps the week and usually the exit. ",
            mistakes,
            " includes buying a job when you thought you bought a business.",
          ),
        ],
      },
    ],
    faqs: [
      {
        question: "Are home-based franchises the same as low-employee franchises?",
        answer:
          "Often they overlap, and often they do not. Home-based describes the rent. It does not describe the payroll. Ask who delivers the service when you are on a sales call.",
      },
      {
        question: "Can a business with few employees still be semi-absentee?",
        answer:
          "Only if someone other than you can deliver the service. One excellent lead can do that. Zero employees cannot.",
      },
      {
        question: "Should I pick the brand with the smallest staff in the FDD?",
        answer:
          "Not from a table alone. A small staff can mean a clean model or an owner trapped in the van. Call the owners and ask what a Tuesday looks like before you treat headcount as a virtue.",
      },
    ],
    sources: [
      { label: "FTC Franchise Rule Compliance Guide (Item 15)", href: FTC_GUIDE },
      { label: "FTC Franchise Rule, 16 CFR Part 436", href: FTC_RULE },
    ],
    related: [
      { href: "/questions/semi-absentee-franchise", label: "What semi-absentee really requires" },
      { href: "/questions/franchise-vs-existing-business", label: "Startup versus an existing business" },
      { href: "/blog/how-i-read-an-fdd-in-20-minutes", label: "How I read an FDD in 20 minutes" },
      { href: "/blog/franchise-mistakes-first-time-buyers", label: "Mistakes first-time buyers make" },
      { href: "/blog/fdd-red-flags", label: "FDD red flags" },
      { href: "/advisor", label: "Try the advisor" },
    ],
    ctaHeading: "Name the constraint, then read the labor",
    ctaBody: [
      "Tell me whether you want fewer people, fewer hours, or both. I will tell you if a model can actually do that. ",
      link("Book a call", CALENDLY),
      ", or try ",
      advisor,
      " if you want to sort the role before you sort brands.",
    ],
  },
];

export function getQuestionBySlug(slug: string): QuestionPage | undefined {
  return questionPages.find((page) => page.slug === slug);
}

function inlineText(part: Inline): string {
  return typeof part === "string" ? part : part.text;
}

/** Visible article words: headline, answer, sections, FAQ, and the close. */
export function questionWordCount(page: QuestionPage): number {
  const chunks: string[] = [
    page.h1,
    ...page.lede.flat().map(inlineText),
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs.flat().map(inlineText),
      ...(section.bullets ?? []),
    ]),
    ...page.faqs.flatMap((item) => [item.question, item.answer]),
    page.ctaHeading,
    ...page.ctaBody.map(inlineText),
  ];
  return chunks.join(" ").split(/\s+/).filter(Boolean).length;
}
