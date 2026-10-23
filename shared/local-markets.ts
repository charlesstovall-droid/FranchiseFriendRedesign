import { faqPageSchema, type FaqItem } from "./faq";
import { NAP, OG_IMAGE_URL, postalAddress } from "./nap";
import { absoluteUrl } from "./site";

export type Inline = string | { text: string; href: string };

export interface LocalSection {
  kicker?: string;
  heading: string;
  paragraphs: Inline[][];
}

export interface LocalStep {
  num: string;
  title: string;
  desc: string;
}

export interface LocalSource {
  label: string;
  href: string;
}

export interface LocalMarketPage {
  path: "/mount-pleasant" | "/south-carolina";
  title: string;
  description: string;
  leadType: string;
  message: string;
  kicker: string;
  h1: string;
  h1Sub: string;
  lede: Inline[][];
  proof: string;
  formHeading: string;
  formNote: string;
  areaPlaceholder: string;
  sections: LocalSection[];
  stepsHeading: string;
  steps: LocalStep[];
  faqHeading: string;
  faqs: FaqItem[];
  sourcesIntro: string;
  sources: LocalSource[];
  ctaHeading: string;
  ctaBody: string;
  portraitAlt: string;
}

function p(...parts: Inline[]): Inline[] {
  return parts;
}

const calendly = "https://calendly.com/charles-stovall/intro";

export const mountPleasantPage: LocalMarketPage = {
  path: "/mount-pleasant",
  title: "Franchise Consultant Mount Pleasant SC | Charles Stovall, Your Franchise Friend",
  description:
    "Franchise consultant in Mount Pleasant, SC. Charles Stovall lives here and reads Point Hope, Highway 41, housing costs, and the FDD like an operator.",
  leadType: "mount-pleasant",
  message: "Mount Pleasant Landing Page",
  kicker: "Mount Pleasant · Cainhoy · East Cooper",
  h1: "Mount Pleasant Is Where I Live.",
  h1Sub: "That Changes the File.",
  lede: [
    p(
      "I work from 1531 N Lakeshore Drive in this town. If you are buying a franchise here, the questions are what the house costs, who will take the job, and whether the territory is the town, Daniel Island, or the Cainhoy peninsula.",
    ),
    p(
      "Point Hope is the large master-planned community off Clements Ferry Road. It sits in the City of Charleston, on the Cainhoy peninsula in Berkeley County, near Daniel Island. It is part of the East Cooper growth corridor, and it is outside the Mount Pleasant town limits.",
    ),
  ],
  proof: "30 locations built · PE exit · Mount Pleasant resident",
  formHeading: "Request a Mount Pleasant consultation",
  formNote: "I'll follow up to book the call. Tell me which side of the Wando you mean.",
  areaPlaceholder: "Old Village, Cainhoy, Daniel Island…",
  sections: [
    {
      kicker: "The town, counted",
      heading: "Four places, four growth rates.",
      paragraphs: [
        p(
          "The Town of Mount Pleasant counted 67,843 people in the 2010 Census and 90,801 in the 2020 Census. The July 1, 2025 estimate is 95,469, up 4.9% from the April 1, 2020 estimates base. Berkeley County is estimated at 274,666, up 19.5%. Summerville is 53,177, up 4.6%. Charleston County, which contains the town, is 436,200, up 6.8%. One Charleston growth number pasted onto a Mount Pleasant territory blends four places.",
        ),
        p(
          "In the 2020–2024 American Community Survey, about 22.8% of Mount Pleasant residents are under 18 and 18.4% are 65 or older. About 68.4% of adults 25 and older have a bachelor's degree. Median household income is $124,755. The median owner-occupied house is $748,500 and median gross rent is $2,159, against $489,100 in Charleston County, $310,300 in Berkeley County, and $328,100 in Summerville.",
        ),
      ],
    },
    {
      kicker: "Cainhoy",
      heading: "Point Hope is a Charleston address on a Berkeley County peninsula.",
      paragraphs: [
        p(
          "The Daniel Island News, in October 2026, traced the tract from a Guggenheim retreat to the houses on Clements Ferry Road. I-526 opened in 1993. The City of Charleston annexed the property in 1995. In 2014 the city approved a planned unit development on the roughly 9,076-acre tract, up to 18,000 residential units. Point Hope Partners now expects closer to 9,000 homes and apartments, on about 43% of the acreage. Completed single-family homes were about 330, in First Light and Hopewell south of the road, with about 70 occupied at Del Webb on the north side. First single-family residents arrived in 2021.",
        ),
        p(
          "Philip Simmons Elementary and Middle opened in 2016 and the high school in 2017. A Publix center is open, with more than 35 businesses on the corridor. The site lists three public schools, a 55-and-older Del Webb, and a dog park at Hopewell. A federal wetland permit issued in May 2022 was upheld in May 2025. If the pin is on Clements Ferry, ask which city the territory actually covers.",
        ),
      ],
    },
    {
      kicker: "Roads and boxes",
      heading: "Clements Ferry, Highway 41, and the old U.S. 17 spine are three different bets.",
      paragraphs: [
        p(
          "Berkeley County finished Clements Ferry Phase 2 on October 11, 2024, a $75 million One Cent Sales Tax job: two added lanes, a median, and a path on 4.5 miles from Jack Primus Road to Highway 41. Phase 1, August 2019, ran from I-526 to Jack Primus, nearly nine miles combined. Councilman Josh Whitley told the Daniel Island News the road carries 25,000 cars a day. Point Hope donated more than 10 acres of frontage for the widening. Berkeley County, SCDOT, and the City studied Cainhoy traffic in 2017.",
        ),
        p(
          "Highway 41, inside the town, is planned as four lanes from Clements Ferry to Dunes West and Rivertowne, three lanes through the Phillips Community, four lanes again to U.S. 17, plus Laurel Hill Parkway over to Park West Boulevard. U.S. 17 is the older spine: Shem Creek on Coleman Boulevard, then Towne Centre and Belle Hall. Those boxes are leased. New everyday retail is at Point Hope. Daniel Island, across the Wando, is not the town. Read the exhibit before you trust a shade labeled East Cooper.",
        ),
      ],
    },
    {
      kicker: "Categories",
      heading: "Growth points at a few categories. It does not hand you one.",
      paragraphs: [
        p(
          "Home services split between a new Cainhoy roof and an established house whose owner will notice a sloppy crew. Kids' enrichment tracks the under-18 share, the income, and the Philip Simmons schools. Fitness and wellness track the degrees. Senior care tracks the 65-plus share and Del Webb. Pet tracks the yards, including the Hopewell dog park. 2022 retail sales were $2,823,633,000, $29,835 per person.",
        ),
      ],
    },
    {
      kicker: "The buy",
      heading: "Competition, rent, and labor are the deal.",
      paragraphs: [
        p(
          "Shem Creek, Towne Centre, and Belle Hall are crowded, and a lot of the new roofs sit outside the town limits. A metro ring can bill you Mount Pleasant occupancy for a Berkeley customer, or block Cainhoy because someone else holds Charleston. Item 7 is a guess until a real space is priced.",
        ),
        p(
          "I will not invent a wage. The rent a worker is shopping is $2,159 in town, $1,654 in Berkeley County, and $1,526 in Summerville. Mean travel time is 24.9 minutes. Semi-absentee works only when labor survives a normal month.",
        ),
        p(
          "Relocating buyers from the Northeast and Midwest often price the town like the suburb they left. I do not have Mount Pleasant arrivals by state. The 2024 Census compilation puts New York (18,300), Pennsylvania (7,400), Illinois (6,600), and Ohio (4,500) in the statewide top ten origins, behind North Carolina and with Florida and Georgia.",
        ),
      ],
    },
    {
      kicker: "How I help",
      heading: "We start with the place, then the brand.",
      paragraphs: [
        p(
          "Capital, goals, and whether you want the town or the growth beside it. I typically work with buyers who have $100K or more in liquid capital. Then a short list and the FDD: Item 19 if they publish one, Item 7 against a local cost, Item 20 for who left. If it is wrong for Mount Pleasant, I say so.",
        ),
        p(
          "The wider Lowcountry is on the ",
          { text: "Charleston page", href: "/charleston" },
          ". The rest of the state is on the ",
          { text: "South Carolina page", href: "/south-carolina" },
          ". Before you fall in love with a logo, read ",
          { text: "FDD red flags", href: "/blog/fdd-red-flags" },
          " and ",
          { text: "how I read an FDD in 20 minutes", href: "/blog/how-i-read-an-fdd-in-20-minutes" },
          ". Or ",
          { text: "book a consultation", href: calendly },
          ".",
        ),
      ],
    },
  ],
  stepsHeading: "How it works",
  steps: [
    {
      num: "01",
      title: "Discover",
      desc: "A short call on capital, goals, and whether you mean the town, Daniel Island, or Cainhoy. No pitch.",
    },
    {
      num: "02",
      title: "Match",
      desc: "Two to four brands that can live with Mount Pleasant housing and Mount Pleasant labor. Real financials.",
    },
    {
      num: "03",
      title: "Decide",
      desc: "The FDD, validation calls, and close support. You move at your own pace.",
    },
  ],
  faqHeading: "Mount Pleasant FAQ",
  faqs: [
    {
      id: "mp-point-hope",
      question: "Is Point Hope in Mount Pleasant?",
      answer:
        "No. It is on the Cainhoy peninsula in Berkeley County, inside the City of Charleston since the 1995 annexation, near Daniel Island. A Mount Pleasant territory does not automatically include it.",
    },
    {
      id: "mp-housing",
      question: "What does Mount Pleasant housing cost do to a franchise?",
      answer:
        "The town's median owner-occupied house is $748,500 and median rent is $2,159. Berkeley County's median house is $310,300. Summerville's is $328,100. Item 7 and the labor line have to clear that gap.",
    },
    {
      id: "mp-categories",
      question: "Which franchise categories are you looking at in Mount Pleasant?",
      answer:
        "Home services, kids' enrichment, fitness, pet, senior care, and health and wellness. The age mix, the income, and the new roofs at Point Hope, including Del Webb, are why. An open category is a separate question.",
    },
    {
      id: "mp-roads",
      question: "Do Clements Ferry Road and Highway 41 change the territory?",
      answer:
        "Yes. Clements Ferry is widened through to Highway 41. Highway 41 is the north-town project out to U.S. 17. Shem Creek, Towne Centre, and Belle Hall are the older core. Different roads, different rent.",
    },
    {
      id: "mp-help",
      question: "How do you help a buyer in Mount Pleasant?",
      answer:
        "I live here. We start with capital, goals, and which side of the Wando you want. I typically work with buyers who have $100K or more in liquid capital, then a short list, the FDD, and validation calls.",
    },
    {
      id: "mp-meet",
      question: "Can we sit down in town?",
      answer:
        "Yes. Coffee, breakfast, or a call, from the first conversation through close. Book a consultation or call (919) 827-3921.",
    },
  ],
  sourcesIntro:
    "Growth figures on this page come from pages I opened. If a number is not here, I did not use it. Census percent changes are from each place's April 1, 2020 estimates base to the July 1, 2025 estimate, Vintage 2025, unless I name the decennial census.",
  sources: [
    {
      label: "U.S. Census Bureau QuickFacts, Mount Pleasant town, South Carolina",
      href: "https://www.census.gov/quickfacts/fact/table/mountpleasanttownsouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Berkeley County, South Carolina",
      href: "https://www.census.gov/quickfacts/fact/table/berkeleycountysouthcarolina",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Charleston County, South Carolina",
      href: "https://www.census.gov/quickfacts/fact/table/charlestoncountysouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Summerville town, South Carolina",
      href: "https://www.census.gov/quickfacts/fact/table/summervilletownsouthcarolina",
    },
    {
      label: "The Daniel Island News, “Point Hope: Then and Now” (October 20, 2026)",
      href: "https://thedanielislandnews.com/news/point-hope-then-and-now",
    },
    {
      label: "Point Hope, official community site",
      href: "https://pointhopecharleston.com/",
    },
    {
      label: "Point Hope, Cainhoy development facts",
      href: "https://pointhopecharleston.com/development-facts/",
    },
    {
      label: "The Daniel Island News, “Clements Ferry Road Phase 2” (October 30, 2024)",
      href: "https://www.thedanielislandnews.com/news/clements-ferry-road-phase-2-early-completion-under-budget",
    },
    {
      label: "Highway 41 Corridor Improvements, Charleston County project site",
      href: "https://hwy41sc.com/",
    },
    {
      label: "USAFacts, state-to-state migration for South Carolina, compiled from U.S. Census Bureau data (2024)",
      href: "https://usafacts.org/answers/what-states-are-people-moving-to-and-from/state/south-carolina/",
    },
  ],
  ctaHeading: "Ready to look at Mount Pleasant with an operator?",
  ctaBody:
    "Request the call or book the time. Bring capital, a calendar, and the neighborhood you actually want to own in.",
  portraitAlt: "Charles Stovall, Mount Pleasant franchise consultant",
};

export const southCarolinaPage: LocalMarketPage = {
  path: "/south-carolina",
  title: "Franchise Consultant South Carolina | Charles Stovall",
  description:
    "Franchise consultant for South Carolina buyers. Charles Stovall on Charleston, the Upstate, Columbia, Myrtle Beach, and Hilton Head.",
  leadType: "south-carolina",
  message: "South Carolina Landing Page",
  kicker: "Charleston · Upstate · Columbia · Grand Strand · Lowcountry",
  h1: "South Carolina Is Not One Franchise Market.",
  h1Sub: "The county line is the file.",
  lede: [
    p(
      "I live in Mount Pleasant and work with buyers choosing a territory in this state, sometimes after a move. These markets do not share a labor model, a rent line, or an age mix. Pick the place, then we read the FDD against it.",
    ),
  ],
  proof: "30 locations built · PE exit · based in Mount Pleasant",
  formHeading: "Request a South Carolina consultation",
  formNote: "I'll follow up to book the call. Name the market you actually want to operate in.",
  areaPlaceholder: "Greenville, Bluffton, Myrtle Beach…",
  sections: [
    {
      kicker: "The state",
      heading: "The growth is real, and it is mostly people moving in.",
      paragraphs: [
        p(
          "Vintage 2025 puts South Carolina at 5,570,274 people on July 1, 2025, up 79,958 from a year earlier. That 1.5% gain was the fastest of any state, down from 1.8% the year before. Net domestic migration was 66,622. The April 1, 2020 estimates base was 5,118,250.",
        ),
        p(
          "Origins are a separate table. USAFacts' 2024 Census compilation lists inflows from North Carolina 33,200, New York 18,300, Florida 18,000, Georgia 16,000, Pennsylvania 7,400, Illinois 6,600, and Ohio 4,500, with California, Virginia, and Texas also in the top ten. I will not guess the share that landed in Mount Pleasant versus Greenville versus Horry County.",
        ),
        p(
          "The Department of Commerce lists a 5% corporate income tax, a cost of living 8.5% below the national average, and about 2.52 million people employed. It calls the Port of Charleston a 52-foot harbor, the deepest on the East Coast. BMW, Michelin, and Boeing show up on that page. That is a pitch to plants and headquarters. Your territory still has its own customer.",
        ),
      ],
    },
    {
      kicker: "Charleston metro",
      heading: "Charleston, Mount Pleasant, Summerville, and Berkeley County are a cluster, not a zip code.",
      paragraphs: [
        p(
          "Charleston County is estimated at 436,200, up 6.8%, median house $489,100. Mount Pleasant is 95,469, up 4.9%, median house $748,500, median income $124,755. Berkeley County is 274,666, up 19.5%, median house $310,300. Summerville is 53,177, up 4.6%, median house $328,100. The fast growth is in Berkeley. The expensive roofs are in Mount Pleasant.",
        ),
        p(
          "Point Hope, on the Cainhoy peninsula, is in the City of Charleston and Berkeley County, outside the Mount Pleasant limits. The ",
          { text: "Mount Pleasant page", href: "/mount-pleasant" },
          " and the ",
          { text: "Charleston page", href: "/charleston" },
          " are the local files. This one is the map.",
        ),
      ],
    },
    {
      kicker: "Upstate",
      heading: "Greenville and Spartanburg are workforce markets with cheaper houses than the coast.",
      paragraphs: [
        p(
          "Greenville County is estimated at 583,125, up 11.0%, median house $299,000, median household income $76,932. The city inside it is 75,310, up 5.9%, with a median house of $487,500. About 22.0% of the county is under 18. Spartanburg County is 380,857, up 16.1%, median house $233,300, median income $66,234, with about 22.9% under 18 and 25.1% of adults holding a bachelor's degree, against 41.3% in Greenville County. Commerce names BMW and Michelin. I will not invent a plant headcount. An Upstate rent line is a different deal from the coast.",
        ),
      ],
    },
    {
      kicker: "Midlands",
      heading: "Columbia is growing, and it is not a beach story.",
      paragraphs: [
        p(
          "Columbia is estimated at 147,035, up 7.5%. The 2020 Census count was 136,632. I do not have a sourced headcount for the statehouse or the university, so I will not invent one. The customer is a resident. January still counts.",
        ),
      ],
    },
    {
      kicker: "Grand Strand",
      heading: "Horry County is growing older, and Myrtle Beach retail is visitor money.",
      paragraphs: [
        p(
          "Horry County is estimated at 427,551, up 21.8%, with about 29.9% of residents 65 or older and 16.1% under 18. Myrtle Beach is 40,937, up 14.7%. City retail sales in 2022 were $88,837 per person, against a $60,394 median household income and a $388,800 median house. Mount Pleasant's retail figure was $29,835 per person. That gap is visitor money. Senior categories have an age base. Kids' categories are thinner. City labor-force participation is 58.6%.",
        ),
      ],
    },
    {
      kicker: "Beaufort County",
      heading: "Hilton Head barely grew. Bluffton did not.",
      paragraphs: [
        p(
          "Hilton Head Island is estimated at 38,196, up 1.4%. About 39.2% of residents are 65 or older and 11.9% are under 18. The median house is $687,400, median income is $94,657, and 49.8% of people 16 and older are in the labor force.",
        ),
        p(
          "Bluffton is estimated at 36,807, up 33.0%. The 2010 Census counted 12,530, and the 2020 Census counted 27,716. About 22.7% are under 18 and 24.6% are 65 or older. Median household income is $111,281, the median house is $492,100, and median rent is $2,256. Beaufort County is 204,433, up 9.3%, 31.2% age 65 or older, median house $455,600, labor-force participation 51.4%. A territory named Hilton Head that quietly includes Bluffton is a different business.",
        ),
      ],
    },
    {
      kicker: "How I help",
      heading: "Choose the market, then make the file tell the truth.",
      paragraphs: [
        p(
          "Home services, kids' enrichment, fitness, pet, senior care, and health and wellness show up in every market. The weights do not. Berkeley and Bluffton are still adding roofs. Hilton Head and Horry are heavy on ages 65 and older. A national Item 7 is a guess in all of them. I live in Mount Pleasant. The work is capital, the county you will actually operate in, two to four brands, then Item 19, Item 7, and Item 20. I typically work with buyers who have $100K or more in liquid capital. If the concept is wrong for that county, I say so.",
        ),
        p(
          "Start with the ",
          { text: "Charleston page", href: "/charleston" },
          " or the ",
          { text: "Mount Pleasant page", href: "/mount-pleasant" },
          " if the Lowcountry is the target. Read ",
          { text: "FDD red flags", href: "/blog/fdd-red-flags" },
          " and ",
          { text: "how I read an FDD in 20 minutes", href: "/blog/how-i-read-an-fdd-in-20-minutes" },
          " before discovery day. ",
          { text: "Book a consultation", href: calendly },
          " when you know which county you mean, or call (919) 827-3921 and we will sort that out first.",
        ),
      ],
    },
  ],
  stepsHeading: "How it works",
  steps: [
    {
      num: "01",
      title: "Pick the market",
      desc: "A short call on capital, goals, and which South Carolina market you will actually operate in. The state is not the territory.",
    },
    {
      num: "02",
      title: "Match",
      desc: "Two to four brands whose labor and occupancy can live in that county. Not a national average with a new city name.",
    },
    {
      num: "03",
      title: "Decide",
      desc: "Item 19, Item 7, Item 20, then validation calls. You move at your own pace.",
    },
  ],
  faqHeading: "South Carolina FAQ",
  faqs: [
    {
      id: "sc-one-market",
      question: "Is South Carolina one franchise market?",
      answer:
        "No. The state added people at a 1.5% clip, the fastest in the country that year. Berkeley County grew 19.5%. Mount Pleasant grew 4.9%. Hilton Head grew 1.4%. Bluffton grew 33%. Those are different businesses.",
    },
    {
      id: "sc-migration",
      question: "Where are new South Carolina residents moving from?",
      answer:
        "Census net domestic migration was 66,622 from July 2024 to July 2025. The 2024 origin list runs from North Carolina and New York through Florida, Georgia, Pennsylvania, Illinois, and Ohio. I do not have that split by town.",
    },
    {
      id: "sc-strand-upstate",
      question: "How is the Grand Strand different from the Upstate?",
      answer:
        "Horry County is up 21.8% and about 29.9% of residents are 65 or older. Myrtle Beach retail sales were $88,837 per person against a $60,394 median household income. Greenville County's median house is $299,000. Spartanburg County's is $233,300. Different labor, different rent.",
    },
    {
      id: "sc-beaufort",
      question: "Are Hilton Head and Bluffton the same territory?",
      answer:
        "No. Hilton Head is up 1.4%, with 39.2% of residents 65 or older and a $687,400 median house. Bluffton is up 33%, with median household income of $111,281. Same county. Different growth and a different labor pool.",
    },
    {
      id: "sc-columbia",
      question: "What about Columbia, Charleston, and Mount Pleasant?",
      answer:
        "Columbia is estimated at 147,035, up 7.5%. Charleston, Mount Pleasant, Summerville, and Berkeley County are a cluster. For the Lowcountry, start with the Charleston and Mount Pleasant pages, then Item 19, Item 7, and Item 20.",
    },
    {
      id: "sc-help",
      question: "How does a South Carolina search with you work?",
      answer:
        "A short call on capital and the market you will operate in, a short list of brands, then due diligence at your pace. I live in Mount Pleasant and work statewide. Book a consultation or call (919) 827-3921.",
    },
    {
      id: "sc-climate",
      question: "Does the state's business climate make every franchise easier?",
      answer:
        "Commerce lists a 5% corporate income tax and a deepwater port. That is the pitch to companies. Your deal still has to clear local rent, local labor, and the territory in the FDD.",
    },
  ],
  sourcesIntro:
    "Growth figures on this page come from pages I opened. Census percent changes are from each place's April 1, 2020 estimates base to the July 1, 2025 estimate, Vintage 2025, unless I name the decennial census. The state growth rate and the net domestic migration figure are from the Census Bureau's January 27, 2026 Vintage 2025 release. Department of Commerce figures are the department's own descriptions, not a second census.",
  sources: [
    {
      label: "U.S. Census Bureau, Vintage 2025 population estimates news release (January 27, 2026)",
      href: "https://www.census.gov/newsroom/press-releases/2026/population-growth-slows.html",
    },
    {
      label: "USAFacts, state-to-state migration for South Carolina, compiled from U.S. Census Bureau data (2024)",
      href: "https://usafacts.org/answers/what-states-are-people-moving-to-and-from/state/south-carolina/",
    },
    {
      label: "South Carolina Department of Commerce, Why South Carolina",
      href: "https://www.sccommerce.com/why-south-carolina",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Charleston County",
      href: "https://www.census.gov/quickfacts/fact/table/charlestoncountysouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Mount Pleasant town",
      href: "https://www.census.gov/quickfacts/fact/table/mountpleasanttownsouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Berkeley County",
      href: "https://www.census.gov/quickfacts/fact/table/berkeleycountysouthcarolina",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Summerville town",
      href: "https://www.census.gov/quickfacts/fact/table/summervilletownsouthcarolina",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Greenville County",
      href: "https://www.census.gov/quickfacts/fact/table/greenvillecountysouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Greenville city",
      href: "https://www.census.gov/quickfacts/fact/table/greenvillecitysouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Spartanburg County",
      href: "https://www.census.gov/quickfacts/fact/table/spartanburgcountysouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Columbia city",
      href: "https://www.census.gov/quickfacts/fact/table/columbiacitysouthcarolina",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Horry County",
      href: "https://www.census.gov/quickfacts/horrycountysouthcarolina",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Myrtle Beach, Hilton Head Island, Bluffton, and Greenville city",
      href: "https://www.census.gov/quickfacts/fact/table/myrtlebeachcitysouthcarolina,hiltonheadislandtownsouthcarolina,blufftontownsouthcarolina,greenvillecitysouthcarolina/PST045225",
    },
    {
      label: "U.S. Census Bureau QuickFacts, Beaufort County",
      href: "https://www.census.gov/quickfacts/fact/table/beaufortcountysouthcarolina/PST045225",
    },
  ],
  ctaHeading: "Ready to pick a South Carolina market with an operator?",
  ctaBody:
    "Request the call or book the time. Bring capital, a calendar, and the county you actually want to own in.",
  portraitAlt: "Charles Stovall, South Carolina franchise consultant",
};

export const localMarketPages = [mountPleasantPage, southCarolinaPage] as const;

function inlineText(part: Inline): string {
  return typeof part === "string" ? part : part.text;
}

export function localMarketJsonLd(page: LocalMarketPage): object[] {
  const url = absoluteUrl(page.path);
  const areaServed =
    page.path === "/mount-pleasant"
      ? [
          { "@type": "City", name: "Mount Pleasant" },
          { "@type": "AdministrativeArea", name: "Charleston County" },
          { "@type": "AdministrativeArea", name: "Berkeley County" },
        ]
      : { "@type": "State", name: "South Carolina" };

  return [
    {
      "@context": "https://schema.org",
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": `${url}#service`,
      name: NAP.name,
      url,
      telephone: NAP.telephoneDisplay,
      email: NAP.email,
      image: OG_IMAGE_URL,
      description: page.description,
      address: postalAddress(),
      areaServed,
    },
    faqPageSchema(page.faqs),
  ];
}

export function localMarketWordCount(page: LocalMarketPage): number {
  const chunks: string[] = [
    page.h1,
    page.h1Sub,
    ...page.lede.flat().map(inlineText),
    page.proof,
    ...page.sections.flatMap((section) => [
      section.kicker ?? "",
      section.heading,
      ...section.paragraphs.flat().map(inlineText),
    ]),
    page.stepsHeading,
    ...page.steps.flatMap((step) => [step.title, step.desc]),
    page.faqHeading,
    ...page.faqs.flatMap((item) => [item.question, item.answer]),
    page.ctaHeading,
    page.ctaBody,
  ];
  return chunks.join(" ").split(/\s+/).filter(Boolean).length;
}
