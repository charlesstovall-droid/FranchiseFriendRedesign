import { SITE_ORIGIN, absoluteUrl, BOOKING_URL } from "../shared/site";
import {
  featuredGoogleReviews,
  GOOGLE_REVIEW_COUNT,
  GOOGLE_REVIEW_RATING,
} from "../shared/google-reviews";
import {
  GOOGLE_SITE_VERIFICATION,
  LOCAL_BUSINESS_ID,
  NAP,
  NAP_GEO,
  OG_IMAGE_URL,
  ORGANIZATION_ID,
  PERSON_ID,
  SAME_AS,
  formattedAddressLine,
  postalAddress,
} from "../shared/nap";
import { charlestonFaqItems, executiveFaqItems, faqPageSchema, siteFaqItems } from "../shared/faq";
import { blogPosts, getPostBySlug } from "../client/src/data/blog-posts";
import { DEFAULT_ADVISOR_COPY } from "../shared/advisor-copy";
import {
  localMarketJsonLd,
  mountPleasantPage,
  southCarolinaPage,
  type Inline,
  type LocalMarketPage,
} from "../shared/local-markets";
import {
  questionIndex,
  questionPages,
  type QuestionPage,
} from "../shared/questions";
import {
  charlestonAreaPlaces,
  charlestonServing,
  cityPageLinks,
  mountPleasantNeighborhoods,
  mountPleasantServing,
} from "../shared/service-areas";
import { servicePages, type Inline as ServiceInline, type ServicePage } from "../shared/services";
import {
  trustedPartnerSteps,
  trustedPartnersJsonLd,
  trustedPartnersPage,
  type TrustedPartner,
} from "../shared/trusted-partners";

export interface SeoPage {
  title: string;
  description: string;
  /** Omitted on not-found pages so the response has no canonical URL. */
  canonical?: string;
  /** Soft-404 guard: emit noindex and do not emit a canonical URL. */
  noindex?: boolean;
  type?: "website" | "article";
  ogTitle?: string;
  bodyHtml?: string;
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: object | object[];
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLdScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: NAP.personName,
    alternateName: [...NAP.alternateNames],
    jobTitle: "Franchise Consultant",
    description:
      "Franchise consultant based in Mt Pleasant, SC. Built 30 franchise locations across 4 brands and exited to private equity.",
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/charles-headshot.jpeg`,
    email: NAP.email,
    telephone: NAP.telephone,
    sameAs: [...SAME_AS],
    knowsAbout: [
      "Franchise Consulting",
      "Business Ownership",
      "Due Diligence",
      "FDD Review",
      "Franchise Selection",
    ],
    worksFor: { "@id": ORGANIZATION_ID },
    address: postalAddress(),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": LOCAL_BUSINESS_ID,
    name: NAP.name,
    alternateName: [...NAP.alternateNames],
    image: OG_IMAGE_URL,
    description:
      "Franchise consulting, FDD review, and due diligence based in Mt Pleasant, SC for prospective franchise owners nationwide.",
    url: `${SITE_ORIGIN}/`,
    telephone: NAP.telephone,
    email: NAP.email,
    priceRange: "Free consultation",
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: NAP_GEO.latitude,
      longitude: NAP_GEO.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Mount Pleasant SC" },
      { "@type": "City", name: "Charleston SC" },
      { "@type": "AdministrativeArea", name: "Charleston County" },
      { "@type": "State", name: "South Carolina" },
      { "@type": "Country", name: "United States" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Free franchise consultation",
      itemListElement: [
        {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
          itemOffered: {
            "@type": "Service",
            name: "Free franchise consultation",
          },
        },
      ],
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    sameAs: [...SAME_AS],
    founder: { "@id": PERSON_ID },
    parentOrganization: { "@id": ORGANIZATION_ID },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_REVIEW_RATING,
      reviewCount: GOOGLE_REVIEW_COUNT,
      bestRating: "5",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: NAP.name,
    alternateName: [...NAP.alternateNames],
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/cs-shield-logo.png`,
    },
    image: OG_IMAGE_URL,
    telephone: NAP.telephone,
    email: NAP.email,
    address: postalAddress(),
    sameAs: [...SAME_AS],
  };
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: NAP.alternateNames[0],
    alternateName: NAP.name,
    url: SITE_ORIGIN,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

function podcastJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "Charles Stovall's Franchise Friend Podcast",
    description:
      "Expert insights on franchise consulting, business strategy, and entrepreneurship from Charles Stovall",
    url: absoluteUrl("/podcasts"),
    author: { "@id": PERSON_ID },
    image: `${SITE_ORIGIN}/podcast-artwork.png`,
    webFeed: `${SITE_ORIGIN}/podcast/feed.xml`,
  };
}

export function sitewideJsonLd(): object[] {
  return [personJsonLd(), localBusinessJsonLd(), organizationJsonLd(), websiteJsonLd(), podcastJsonLd()];
}

export function blogPostingJsonLd(post: {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  category?: string;
}): object {
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const description = (() => {
    const excerpt = stripHtml(post.excerpt);
    if (excerpt.length >= 120 && excerpt.length <= 160) return excerpt;
    return `${excerpt} ${stripHtml(post.content)}`.substring(0, 155).trim() + "...";
  })();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: OG_IMAGE_URL,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: canonical,
    url: canonical,
    articleSection: post.category,
    inLanguage: "en-US",
  };
}

function renderFaqHtml(items: { question: string; answer: string }[], heading = "FAQ"): string {
  const entries = items
    .map(
      (item) =>
        `<div><dt>${escapeHtml(item.question)}</dt><dd>${escapeHtml(item.answer)}</dd></div>`,
    )
    .join("");
  return `<section><h2>${escapeHtml(heading)}</h2><dl>${entries}</dl></section>`;
}

function napBlockHtml(): string {
  return `
<address>
  <p>${escapeHtml(NAP.name)}</p>
  <p>${escapeHtml(NAP.streetAddress)}</p>
  <p>${escapeHtml(NAP.addressLocality)}, ${escapeHtml(NAP.addressRegion)} ${escapeHtml(NAP.postalCode)}</p>
  <p><a href="tel:9198273921">${escapeHtml(NAP.telephoneDisplay)}</a></p>
</address>`.trim();
}

export function renderHomeHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-headshot.jpeg" alt="Charles Stovall, franchise consultant in Mt Pleasant, SC, seated for a headshot" />
<article>
  <p>Charles Stovall · Your Franchise Friend · Charleston, SC</p>
  <h1>Invest in Yourself. Do it with someone who has done it.</h1>
  <p>You are weighing a six or seven figure decision. Before you sign an FDD, talk to a consultant who built 30 franchise locations across 4 brands and exited to private equity. Honest answers, real numbers.</p>
  <p>${GOOGLE_REVIEW_RATING} · ${GOOGLE_REVIEW_COUNT} Google Reviews</p>
  <p>Brands built, scaled and exited. Featured in Inc. 500, Entrepreneur, and Business RadioX. Boost Mobile, Massage Envy, YogaSix, Image Studios.</p>
  <h2>You get an operator in your corner before you sign.</h2>
  <p>I've signed leases, made payroll on slow months, and negotiated multi-unit deals, so I read a deal like someone who has to live with it.</p>
  <h3>What I do for you</h3>
  <ol>
    <li><strong>Pressure-test Item 19</strong> — We turn the franchisor's numbers into your unit math: labor, rent, ramp time, and working capital, before you commit.</li>
    <li><strong>Read the deal like an operator</strong> — Territory, the lease, the development schedule, and the clauses that bite in year two.</li>
    <li><strong>Tell you no</strong> — If a concept isn't right for your money, time, or goals, I'll say so.</li>
    <li><strong>Validation calls with real owners</strong> — You talk with people who run the units. I send you in with the questions that get honest answers.</li>
  </ol>
  <p>30 locations built · 4 brands · Retail, wellness, fitness, salon suites · Sold to private equity</p>
  <p>Boost Mobile, Massage Envy, YogaSix, Image Studios</p>
  <p><a href="${BOOKING_URL}">Book a Call</a> · <a href="/blog/how-i-read-an-fdd-in-20-minutes">How I read an FDD in 20 minutes</a></p>
  <ul>
    <li>30 locations built and exited</li>
    <li>4 franchise brands owned</li>
    <li>Private equity exit</li>
    <li>5.0 Google rating</li>
  </ul>
  <h2>Four phases. Zero pressure.</h2>
  <p>A structured path from first conversation to a confident yes or a confident no. Most clients move through it in 6 to 10 weeks.</p>
  <ol>
    <li><strong>Intro Call</strong> — A real conversation about your goals, capital, timeline, and lifestyle.</li>
    <li><strong>Your Profile</strong> — Background, strengths, and financial picture.</li>
    <li><strong>Matched Options</strong> — Owner-operator, semi-absentee, or multi-unit. Side-by-side comparisons included.</li>
    <li><strong>Due Diligence</strong> — FDD review, validation calls with current franchisees, funding strategy, and discovery day prep.</li>
  </ol>
  <h2>Rated ${GOOGLE_REVIEW_RATING} by the people who took the leap.</h2>
  ${featuredGoogleReviews
    .map(
      (review) =>
        `<blockquote><p>${escapeHtml(review.text)}</p><footer>${escapeHtml(review.author)} · Google Review</footer></blockquote>`,
    )
    .join("\n  ")}
  <h2>Built for people making a serious investment.</h2>
  <h3>Leaving the W-2 behind</h3>
  <p>You have 15 to 25 years of executive experience and want to own your outcome. We focus on concepts where your leadership skills transfer and the model matches your risk tolerance.</p>
  <h3>Diversifying your income</h3>
  <p>You want a cash-flowing asset alongside your market portfolio. We target semi-absentee and manager-run models with strong Item 19s and a path to multiple units.</p>
  <h3>Going multi-unit from day one</h3>
  <p>You are thinking in territories, not storefronts. Having scaled 1 location to 30, I will help you structure development agreements and avoid the mistakes that stall growth.</p>
  <h2>The team I'd put around you.</h2>
  <ul>
    ${trustedPartnersPage.sections
      .flatMap((section) =>
        section.partners.map(
          (partner) =>
            `<li><a href="/trusted-partners#${escapeHtml(section.id)}"><img src="${escapeHtml(partner.logo.src)}" alt="${escapeHtml(partner.firm)}" width="${partner.logo.width}" height="${partner.logo.height}" /></a></li>`,
        ),
      )
      .join("\n    ")}
  </ul>
  <p><a href="/trusted-partners">Meet my trusted partners</a></p>
  <h2>Find Your Freedom.</h2>
  <p>Book a free, no-obligation consultation. Worst case, you leave with a clearer picture of franchising. Best case, you find the business that changes your family's trajectory.</p>
  <p><a href="/charleston">Charleston franchise consulting</a> · <a href="/mount-pleasant">Mount Pleasant franchise consultant</a> · <a href="/south-carolina">South Carolina franchise consultant</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a> · <a href="/about">About Charles</a></p>
  <nav>
    <a href="/blog">Blog</a>
    <a href="/podcasts">Podcast</a>
    <a href="/faq">FAQ</a>
    <a href="/franchise-brands">Franchise Brands</a>
    <a href="/home-based-franchises">Home-Based Franchises</a>
    <a href="/charleston">Charleston</a>
    <a href="/mount-pleasant">Mount Pleasant</a>
    <a href="/south-carolina">South Carolina</a>
    <a href="/executive-access">Executive Access</a>
    <a href="/privacy-policy">Privacy</a>
  </nav>
  <h2>Buyer questions</h2>
  <ul>
    <li><a href="/questions">Questions I get before someone signs</a></li>
    <li><a href="/questions/liquidity-after-opening">How much liquidity should I retain after opening?</a></li>
    <li><a href="/questions/semi-absentee-franchise">What does semi-absentee really require?</a></li>
    <li><a href="/questions/validate-item-19">How do I validate Item 19?</a></li>
    <li><a href="/questions/franchise-vs-existing-business">Franchise startup vs buying an existing business</a></li>
    <li><a href="/questions/low-employee-franchises">Which businesses require fewer employees?</a></li>
  </ul>
  <h2>From the blog</h2>
  <ul>
    <li><a href="/blog/fdd-red-flags">FDD Red Flags I Learned the Hard Way</a></li>
    <li><a href="/blog/how-i-read-an-fdd-in-20-minutes">How I Actually Read an FDD in 20 Minutes</a></li>
    <li><a href="/blog/franchise-mistakes-first-time-buyers">The 7 Biggest Franchise Mistakes That Cost First-Time Buyers</a></li>
  </ul>
  <h2>Start here</h2>
  <ul>
    <li><a href="/buy-a-franchise">Buy a franchise</a></li>
    <li><a href="/semi-absentee-franchise-consultant">Semi-absentee franchise consultant</a></li>
    <li><a href="/charleston">Franchise Consultant Charleston SC</a></li>
  </ul>
  <p><a href="/south-carolina">Serving all of South Carolina</a></p>
  <p>Free to you, no cost to work with me.</p>
  <p><a href="${BOOKING_URL}">Book a consultation</a> · <a href="tel:9198273921">919.827.3921</a> · <a href="mailto:charles@franchisefriend.net">charles@franchisefriend.net</a></p>
  ${napBlockHtml()}
</article>
`.trim();
}

export function renderExecutiveAccessHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-headshot.jpeg" alt="Charles Stovall, franchise consultant in Charleston and Mt. Pleasant, SC" />
<article>
  <p>Charles Stovall · Charleston / Mt. Pleasant, SC</p>
  <h1>Keep the W-2. Buy a model that can run without you.</h1>
  <p>I built 30 locations and sold into private equity. Now I help executives match capital to a franchise model — then read the FDD like an operator, not a tourist.</p>
  <p>Semi-absentee only works if the labor, the cash, and Item 19 agree. Most decks skip that part.</p>
  <h2>How the assessment works</h2>
  <ol>
    <li>Capital and calendar — what you can write, and what you can manage while the W-2 still pays.</li>
    <li>Match the model — unit economics that survive a normal month, not a perfect ramp.</li>
    <li>Read the file — Item 19, Item 7, Item 20. Then you decide.</li>
  </ol>
  <p>Proof I actually operated: 30 locations. A PE exit. Charleston / Mt. Pleasant, working with executives nationwide.</p>
  ${renderFaqHtml(executiveFaqItems, "Executive Access FAQ")}
</article>
<form id="executive-assessment-form" action="/api/leads" method="POST">
  <h2>Request your executive assessment</h2>
  <p>First name, last name, email, and phone. I'll follow up to book the call.</p>
  <label>First name <input type="text" name="firstName" required autocomplete="given-name" /></label>
  <label>Last name <input type="text" name="lastName" required autocomplete="family-name" /></label>
  <label>Email <input type="email" name="email" required autocomplete="email" /></label>
  <label>Phone <input type="tel" name="phone" required autocomplete="tel" /></label>
  <input type="hidden" name="leadType" value="executive-ad" />
  <input type="hidden" name="message" value="Executive Access — Franchise Assessment" />
  <button type="submit">Request the assessment</button>
</form>
<p><a href="${BOOKING_URL}">Book a call</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
${napBlockHtml()}
`.trim();
}

export function renderCharlestonHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-homepage-portrait.jpg" alt="Charles Stovall, franchise consultant in Mt Pleasant, SC, photographed for the Charleston page" />
<article>
  <p>Charleston · Mt. Pleasant · Daniel Island · the Lowcountry</p>
  <h1>Franchise Consultant Charleston SC</h1>
  <p>Own a Business in Charleston. Without Starting One From Scratch.</p>
  <p>I live in this market. I help Lowcountry executives, military retirees, and professionals match capital to a franchise — then read the FDD like someone who has made payroll.</p>
  <p>A national average does not know what labor costs in Mt. Pleasant, or whether the territory on Daniel Island is already spoken for.</p>
  <p>30 locations built. A PE exit. Charleston resident.</p>
  <h2>The Lowcountry is not a national slide.</h2>
  <p>I know which concepts are already saturated in Mount Pleasant, where territories are still open in Summerville, and what's working on Daniel Island. National firms do not sit in those rooms.</p>
  <p>When we read an FDD together, you get an operator's view of Item 19, labor, and occupancy in this market — not a highlight reel built for a cheaper city. If the concept is wrong for Charleston, I will say so.</p>
  <p>The town I live in has its own page, and so does the state: <a href="/mount-pleasant">Mount Pleasant franchise consultant</a> and <a href="/south-carolina">South Carolina franchise consultant</a>. Read <a href="/blog/fdd-red-flags">FDD red flags</a> and <a href="/blog/how-i-read-an-fdd-in-20-minutes">how I read an FDD in 20 minutes</a> before you fall in love with a brand.</p>
  ${renderServingHtml("charleston")}
  <h2>How it works</h2>
  <ol>
    <li>Discover — a 15-minute call on capital, goals, timeline, and lifestyle. No pitch. Just whether this market and this buyer fit.</li>
    <li>Match — two to four vetted franchise brands that can live in the Lowcountry. Real financials. Honest assessment.</li>
    <li>Decide — due diligence, validation calls with existing franchisees, close support. You move at your own pace.</li>
  </ol>
  <h2>We can sit in the same city.</h2>
  <p>Coffee at Second State, breakfast, or a call — whatever fits your calendar. You work with me from discovery through close. No handoffs. No junior reps. No call center.</p>
  <p>I typically work with buyers who have $100K+ in liquid capital. Many Charleston clients invest $150K–$500K in proven concepts. Semi-absentee is on the table if the labor model can stand a normal month without you behind the counter.</p>
  ${renderFaqHtml(charlestonFaqItems, "Charleston FAQ")}
</article>
<form id="charleston-consultation-form" action="/api/leads" method="POST">
  <h2>Request a Charleston consultation</h2>
  <p>I'll follow up to book the call. Bring capital and a neighborhood in mind.</p>
  <label>First name <input type="text" name="firstName" required autocomplete="given-name" /></label>
  <label>Last name <input type="text" name="lastName" autocomplete="family-name" /></label>
  <label>Email <input type="email" name="email" required autocomplete="email" /></label>
  <label>Phone <input type="tel" name="phone" required autocomplete="tel" /></label>
  <label>Liquid capital
    <select name="liquidCapital">
      <option value="">Select range</option>
      <option value="Under $50K">Under $50K</option>
      <option value="$50K–$150K">$50K–$150K</option>
      <option value="$150K–$500K">$150K–$500K</option>
      <option value="$500K+">$500K+</option>
    </select>
  </label>
  <label>Timeline
    <select name="timeline">
      <option value="">Select timeline</option>
      <option value="0–3 months">0–3 months</option>
      <option value="3–6 months">3–6 months</option>
      <option value="6–12 months">6–12 months</option>
      <option value="Just exploring">Just exploring</option>
    </select>
  </label>
  <label>Neighborhood <input type="text" name="area" placeholder="Mt. Pleasant, Daniel Island…" /></label>
  <input type="hidden" name="leadType" value="charleston-ad" />
  <input type="hidden" name="message" value="Charleston Ad Landing Page" />
  <button type="submit">Request the call</button>
</form>
<p><a href="${BOOKING_URL}">Book a call</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
${napBlockHtml()}
`.trim();
}

function renderInlines(parts: Inline[]): string {
  return parts
    .map((part) =>
      typeof part === "string"
        ? escapeHtml(part)
        : `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`,
    )
    .join("");
}

export function renderLocalMarketHtml(page: LocalMarketPage): string {
  const formId = `${page.path.slice(1)}-consultation-form`;
  const sections = page.sections
    .map(
      (section) => `<section>
  ${section.kicker ? `<p>${escapeHtml(section.kicker)}</p>` : ""}
  <h2>${escapeHtml(section.heading)}</h2>
  ${section.paragraphs.map((paragraph) => `<p>${renderInlines(paragraph)}</p>`).join("\n  ")}
</section>`,
    )
    .join("\n");
  const steps = page.steps
    .map((step) => `<li><strong>${escapeHtml(step.title)}</strong> — ${escapeHtml(step.desc)}</li>`)
    .join("");
  const sources = page.sources
    .map((source) => `<li><a href="${escapeHtml(source.href)}">${escapeHtml(source.label)}</a></li>`)
    .join("");

  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-homepage-portrait.jpg" alt="${escapeHtml(page.portraitAlt)}" />
<article>
  <p>${escapeHtml(page.kicker)}</p>
  <h1>${escapeHtml(page.h1)} ${escapeHtml(page.h1Sub)}</h1>
  ${page.lede.map((paragraph) => `<p>${renderInlines(paragraph)}</p>`).join("\n  ")}
  <p>${escapeHtml(page.proof)}</p>
  ${sections}
  ${page.path === "/mount-pleasant" ? renderServingHtml("mount-pleasant") : renderCityNavHtml()}
  <h2>${escapeHtml(page.stepsHeading)}</h2>
  <ol>${steps}</ol>
  ${renderFaqHtml(page.faqs, page.faqHeading)}
  <section>
    <h2>Sources</h2>
    <p>${escapeHtml(page.sourcesIntro)}</p>
    <ul>${sources}</ul>
  </section>
</article>
<form id="${formId}" action="/api/leads" method="POST">
  <h2>${escapeHtml(page.formHeading)}</h2>
  <p>${escapeHtml(page.formNote)}</p>
  <label>First name <input type="text" name="firstName" required autocomplete="given-name" /></label>
  <label>Last name <input type="text" name="lastName" autocomplete="family-name" /></label>
  <label>Email <input type="email" name="email" required autocomplete="email" /></label>
  <label>Phone <input type="tel" name="phone" required autocomplete="tel" /></label>
  <label>Liquid capital
    <select name="liquidCapital">
      <option value="">Select range</option>
      <option value="Under $50K">Under $50K</option>
      <option value="$50K–$150K">$50K–$150K</option>
      <option value="$150K–$500K">$150K–$500K</option>
      <option value="$500K+">$500K+</option>
    </select>
  </label>
  <label>Timeline
    <select name="timeline">
      <option value="">Select timeline</option>
      <option value="0–3 months">0–3 months</option>
      <option value="3–6 months">3–6 months</option>
      <option value="6–12 months">6–12 months</option>
      <option value="Just exploring">Just exploring</option>
    </select>
  </label>
  <label>Neighborhood <input type="text" name="area" placeholder="${escapeHtml(page.areaPlaceholder)}" /></label>
  <input type="hidden" name="leadType" value="${escapeHtml(page.leadType)}" />
  <input type="hidden" name="message" value="${escapeHtml(page.message)}" />
  <button type="submit">Request the call</button>
</form>
<p><a href="${BOOKING_URL}">Book a call</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
<p><a href="/charleston">Charleston franchise consulting</a> · <a href="/mount-pleasant">Mount Pleasant</a> · <a href="/south-carolina">South Carolina</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a> · <a href="/blog/how-i-read-an-fdd-in-20-minutes">How I Read an FDD</a></p>
${napBlockHtml()}
`.trim();
}

function renderHomeBasedHtml(): string {
  return `
<article>
  <h1>Own a Franchise From Your Kitchen Table</h1>
  <p>Home-based franchise opportunities under $75K that you can run remotely, part-time, or alongside a full-time job. Charles Stovall matches brands to your budget, schedule, and goals.</p>
  <h2>Benefits of home-based franchises</h2>
  <ul>
    <li>Lower overhead — no commercial rent</li>
    <li>Flexible schedule compatible with family life</li>
    <li>Proven systems with training and franchisor support</li>
    <li>Scalable — grow from one to multiple territories</li>
  </ul>
  <p>Contact: <a href="tel:9198273921">(919) 827-3921</a></p>
</article>
`.trim();
}

function renderBlogIndexHtml(): string {
  const links = blogPosts
    .map((post) => `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></li>`)
    .join("");
  return `
<nav>
  <h1>Franchise Insights &amp; Resources</h1>
  <p>Expert franchise consulting articles and guides by Charles Stovall.</p>
  <p><a href="/charleston">Charleston franchise consulting</a> · <a href="/questions">Buyer questions</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a> · <a href="/blog/how-i-read-an-fdd-in-20-minutes">How I Read an FDD</a></p>
  <ul>
    ${links}
  </ul>
</nav>
`.trim();
}

function renderFaqPageHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<article>
  <h1>Franchise Consulting FAQ</h1>
  <p>Everything you need to know about working with a franchise consultant.</p>
  <p>Free to you, no cost to work with me.</p>
  <p>If you are still deciding whether ownership should look like a franchise, read <a href="/blog/is-buying-a-franchise-a-good-decision">Is buying a franchise a good decision?</a></p>
  ${renderFaqHtml(siteFaqItems, "Questions")}
  ${napBlockHtml()}
</article>
`.trim();
}

export function renderAboutHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-headshot.jpeg" alt="Charles Stovall, franchise consultant in Mt Pleasant, SC, headshot near Charleston" />
<article>
  <h1>About Charles Stovall</h1>
  <p>${escapeHtml(NAP.name)}</p>
  <p>I opened my first franchise location in 2013. By 2017 I had scaled to 20 units across multiple states, and I went on to build and operate 30 locations across four very different brands before selling to private equity.</p>
  <p>Most franchise consultants have never signed a lease, made payroll on a slow month, or negotiated a multi-unit development agreement. I have done all three, many times over.</p>
  <p>When we review an FDD together, you get an operator's read on Item 19, territory, labor model, and unit economics. If a concept is not right for you, I will tell you.</p>
  <ul>
    <li>30 locations built and exited</li>
    <li>4 franchise brands owned</li>
    <li>Private equity exit</li>
    <li>Based in Mt Pleasant, SC — work with buyers nationwide</li>
  </ul>
  <p><a href="/charleston">Charleston franchise consulting</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a> · <a href="${BOOKING_URL}">Book a consultation</a></p>
  ${napBlockHtml()}
</article>
`.trim();
}

function renderQuestionArticle(page: QuestionPage): string {
  const sections = page.sections
    .map((section) => {
      const paragraphs = section.paragraphs
        .map((paragraph) => `<p>${renderInlines(paragraph)}</p>`)
        .join("\n");
      const bullets = section.bullets?.length
        ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      return `<section><h2>${escapeHtml(section.heading)}</h2>\n${paragraphs}\n${bullets}</section>`;
    })
    .join("\n");
  const sources = page.sources.length
    ? `<section><h2>Sources</h2><ul>${page.sources
        .map((source) => `<li><a href="${escapeHtml(source.href)}">${escapeHtml(source.label)}</a></li>`)
        .join("")}</ul></section>`
    : "";
  const related = `<section><h2>Keep reading</h2><ul>${page.related
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join("")}</ul></section>`;

  return `<article>
  <p><a href="/questions">Buyer questions</a></p>
  <h1>${escapeHtml(page.h1)}</h1>
  ${page.lede.map((paragraph) => `<p>${renderInlines(paragraph)}</p>`).join("\n  ")}
  ${sections}
  ${renderFaqHtml(page.faqs, "FAQ")}
  ${sources}
  ${related}
  <section>
    <h2>${escapeHtml(page.ctaHeading)}</h2>
    <p>${renderInlines(page.ctaBody)}</p>
  </section>
</article>`;
}

function questionArticleJsonLd(page: QuestionPage): object {
  const canonical = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: canonical,
    url: canonical,
    inLanguage: "en-US",
  };
}

function questionSeoPage(page: QuestionPage): SeoPage {
  return {
    title: page.title,
    description: page.description,
    canonical: absoluteUrl(page.path),
    type: "article",
    bodyHtml: renderQuestionArticle(page),
    jsonLd: [questionArticleJsonLd(page), faqPageSchema(page.faqs)],
  };
}

function renderQuestionIndexHtml(): string {
  const items = questionPages
    .map(
      (page) =>
        `<li><h2><a href="${escapeHtml(page.path)}">${escapeHtml(page.h1)}</a></h2><p>${renderInlines(page.lede[0])}</p></li>`,
    )
    .join("\n");
  return `<article>
  <h1>${escapeHtml(questionIndex.h1)}</h1>
  ${questionIndex.lede.map((paragraph) => `<p>${renderInlines(paragraph)}</p>`).join("\n  ")}
  <ul>
    ${items}
  </ul>
  <p><a href="${BOOKING_URL}">Book a call</a> · <a href="/advisor">Try the advisor</a></p>
</article>`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderBlogPostHtml(slug: string): SeoPage | null {
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: "Post Not Found | Charles Stovall",
      description: "The blog post you're looking for doesn't exist. Browse our franchise consulting articles and guides.",
      noindex: true,
      bodyHtml: `<article><h1>Post Not Found</h1><p>The blog post you're looking for doesn't exist.</p><p><a href="/blog">Back to Blog</a></p></article>`,
    };
  }

  const description = (() => {
    const excerpt = stripHtml(post.excerpt);
    if (excerpt.length >= 120 && excerpt.length <= 160) return excerpt;
    return `${excerpt} ${stripHtml(post.content)}`.substring(0, 155).trim() + "...";
  })();

  const jsonLd: object[] = [blogPostingJsonLd(post)];
  if (post.faqs && post.faqs.length > 0) {
    jsonLd.push(faqPageSchema(post.faqs));
  }

  return {
    title: `${post.title} | Charles Stovall`,
    description,
    canonical: absoluteUrl(`/blog/${post.slug}`),
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.date,
    jsonLd,
    bodyHtml: `<article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.date)}</p>${post.content}</article>`,
  };
}

export function renderAdvisorHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<article>
  <p>Franchise Friend Ownership Advisor</p>
  <h1>Before you choose a franchise, understand what should actually fit your life.</h1>
  <p>The Franchise Friend Ownership Advisor helps you think through your goals, finances, desired role and lifestyle before anyone tries to sell you a business.</p>
  <p>${escapeHtml(DEFAULT_ADVISOR_COPY.landingNearCta)}</p>
  <h2>What You'll Receive</h2>
  <ul>
    <li>A personalized Ownership Thesis</li>
    <li>The business characteristics that may fit you</li>
    <li>Potential conflicts or blind spots to consider</li>
    <li>Practical questions to guide your research</li>
    <li>A clearer next step</li>
  </ul>
  <p>Franchise Friend's consulting service is generally free to candidates because participating franchisors may pay a referral fee if a candidate purchases a franchise. The advisor is designed for education and preparation, not legal, tax, investment or earnings advice.</p>
  <p><a href="/advisor/conversation">Build My Ownership Profile</a></p>
</article>
`.trim();
}

function renderCityNavHtml(): string {
  const links = cityPageLinks
    .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
    .join(" · ");
  return `<nav aria-label="City pages"><p>${links}</p></nav>`;
}

function renderPlaceList(label: string, places: readonly string[]): string {
  const items = places.map((place) => `<li>${escapeHtml(place)}</li>`).join("");
  return `<h3>${escapeHtml(label)}</h3><ul>${items}</ul>`;
}

function renderServingHtml(which: "mount-pleasant" | "charleston"): string {
  const copy = which === "mount-pleasant" ? mountPleasantServing : charlestonServing;
  return `<section>
  <p>Serving</p>
  <h2>${escapeHtml(copy.heading)}</h2>
  <p>${escapeHtml(copy.intro)}</p>
  ${renderPlaceList("Mount Pleasant", mountPleasantNeighborhoods)}
  ${renderPlaceList("Around Charleston", charlestonAreaPlaces)}
  ${renderCityNavHtml()}
</section>`;
}

function renderServiceInlines(parts: ServiceInline[]): string {
  return parts
    .map((part) =>
      typeof part === "string"
        ? escapeHtml(part)
        : `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`,
    )
    .join("");
}

function renderServiceHtml(page: ServicePage): string {
  const answer = page.answer.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n  ");
  const checklist = page.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const related = page.related
    .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a></li>`)
    .join("");
  return `<article>
  <h1>${escapeHtml(page.h1)}</h1>
  ${answer}
  <p>${renderServiceInlines(page.bridge)}</p>
  <p><a href="${BOOKING_URL}">Book a consult</a></p>
  <h2>${escapeHtml(page.checklistTitle)}</h2>
  <ul>${checklist}</ul>
  ${renderFaqHtml(page.faqs, "FAQ")}
  <h2>Keep going</h2>
  <ul>${related}</ul>
  <p><a href="${BOOKING_URL}">Book a consult</a></p>
  ${napBlockHtml()}
</article>`;
}

function renderPartnerCard(partner: TrustedPartner): string {
  const logo = `<img src="${escapeHtml(partner.logo.src)}" alt="${escapeHtml(partner.logo.alt)}" width="${partner.logo.width}" height="${partner.logo.height}" />`;
  const headshot = partner.headshot
    ? `<img src="${escapeHtml(partner.headshot.src)}" alt="${escapeHtml(partner.headshot.alt)}" width="${partner.headshot.width}" height="${partner.headshot.height}" />`
    : "";
  const person = partner.person
    ? `<p>${escapeHtml(partner.person)}${partner.role ? ` · ${escapeHtml(partner.role)}` : ""}</p>`
    : "";
  return `<article>
    ${logo}
    ${headshot}
    <h3>${escapeHtml(partner.firm)}</h3>
    ${person}
    <p>${escapeHtml(partner.description[0])} ${escapeHtml(partner.description[1])}</p>
    <p><a href="${escapeHtml(partner.url)}" target="_blank" rel="noopener noreferrer">Visit ${escapeHtml(partner.firm)}</a></p>
  </article>`;
}

function renderTrustedPartnersHtml(): string {
  const page = trustedPartnersPage;
  const sections = page.sections
    .map((section) => {
      const cards = section.partners.map(renderPartnerCard).join("\n");
      return `<section>
    <h2>${escapeHtml(section.title)}</h2>
    <p>${escapeHtml(section.lead)}</p>
    ${cards}
  </section>`;
    })
    .join("\n");
  const questions = page.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const reading = page.reading
    .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a></li>`)
    .join("");
  const steps = trustedPartnerSteps
    .map((step) => `<a href="#${escapeHtml(step.id)}">${escapeHtml(step.label)}</a>`)
    .join(" · ");
  return `<article>
  <h1>${escapeHtml(page.h1)}</h1>
  ${page.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n  ")}
  <p>Your operator · Charles Stovall</p>
  <nav>${steps}</nav>
  ${sections}
  <p>${escapeHtml(page.footnote)}</p>
  <h2>${escapeHtml(page.questionsTitle)}</h2>
  <ul>${questions}</ul>
  <h2>${escapeHtml(page.readingTitle)}</h2>
  <ul>${reading}</ul>
  <p><a href="${escapeHtml(page.ctaHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(page.ctaLabel)}</a></p>
</article>`;
}

function serviceSeoPage(page: ServicePage): SeoPage {
  return {
    title: page.title,
    description: page.description,
    canonical: absoluteUrl(page.path),
    bodyHtml: renderServiceHtml(page),
    jsonLd: faqPageSchema(page.faqs),
  };
}

function webPageJsonLd(name: string, description: string, path: string): object {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    description,
    inLanguage: "en-US",
  };
}

function renderSpeakingHtml(): string {
  return `
<article>
  <p>Podcast &amp; Media Guest</p>
  <h1>The Franchise Expert Your Audience Needs to Hear</h1>
  <p>Charles Stovall · Franchise Advisor &amp; Multi-Unit Owner · Charleston, SC — Available Nationwide</p>
  <p>I've personally owned and scaled 20 franchise locations across four different concepts — Massage Envy, Image Studios, YogaSix, and more. I've navigated mergers, acquisitions, million-dollar build-outs, and the reality of Year 1 ownership.</p>
  <p>Franchising isn't just about fast food. It can be a sophisticated investment vehicle that replaces a corporate salary and builds something meant to last.</p>
  <ul>
    <li>20 Franchise Locations Scaled</li>
    <li>4+ Franchise Concepts Owned</li>
    <li>$1.4M+ Active Build-out Experience</li>
    <li>100+ Clients Guided</li>
  </ul>
  <h2>Core Podcast Topics</h2>
  <p>Each topic comes with real stories, actionable frameworks, and candid insight.</p>
  <ul>
    <li><strong>The &quot;Franchise Friend&quot; Framework</strong> — How to identify which franchise brands actually align with lifestyle, income goals, and risk tolerance.</li>
    <li><strong>Financing Franchise Ownership in 2026</strong> — SBA loans, ROBS (401k rollovers), portfolio lending, and deal structures.</li>
    <li><strong>From 1 Location to 20: The Multi-Unit Playbook</strong> — Scaling from a single Massage Envy in Virginia to 20 locations across the Southeast.</li>
    <li><strong>The Corporate Refugee Roadmap</strong> — Semi-absentee versus owner-operator models, and Year 1 reality versus expectations.</li>
    <li><strong>AI &amp; Technology in Modern Franchising</strong> — Scheduling, marketing automation, and tech-forward brands.</li>
    <li><strong>Reading the FDD Like a Pro</strong> — Item 19, territory traps, renewal clauses, and the red flags that can cost six figures.</li>
  </ul>
  <h2>I Don't Give Textbook Answers</h2>
  <p>Your audience doesn't want another corporate talking head reading from a script. They want someone who's been in the trenches — who's signed personal guarantees, managed payroll for 200+ employees, and built a business from a single location to a multi-state operation.</p>
  <h2>Let's Make Your Next Episode Unforgettable</h2>
  <p>I'm ready to bring real franchise stories, actionable advice, and the kind of energy that keeps an audience hitting play.</p>
  <p><a href="${BOOKING_URL}">Book Me for Your Show</a> · <a href="mailto:charles@franchisefriend.net">charles@franchisefriend.net</a> · <a href="tel:9198273921">(919) 827-3921</a> · <a href="/podcasts">The Franchise Friend Podcast</a></p>
</article>`.trim();
}

const FEATURED_FRANCHISE_BRANDS: readonly (readonly [string, string])[] = [
  ["1-800 Water Damage", "Water Damage Restoration"],
  ["1-800-Packouts", "Packout Services"],
  ["1-800-STRIPER", "Parking Lot Striping"],
  ["2nd Family", "Senior Care"],
  ["360° Painting", "Painting Services"],
  ["4Ever Young", "Medical Spa/Anti-Aging"],
  ["76 Fence", "Fence Installation"],
  ["Accelerated Waste Solutions", "Waste Management"],
  ["Ace Handyman Services", "Handyman Services"],
  ["All Dogs Unleashed", "Dog Training"],
  ["All Dry", "Water Damage Restoration"],
  ["Alloy Personal Training", "Fitness"],
  ["Always Best Care Senior Services (US)", "Senior Care"],
  ["Art of Drawers", "Interior Organization"],
  ["Assisted Living Locators", "Senior Care Placement"],
  ["Aussie Pet Mobile", "Pet Grooming"],
  ["Bar-B-Clean", "BBQ Grill Cleaning"],
  ["Bath Tune-Up", "Bathroom Remodeling"],
  ["beem Light Sauna", "Wellness/Sauna Services"],
  ["Benetrends", "Financial Services"],
  ["Big Frog Custom T-Shirts & More", "Custom T-Shirts/Retail"],
  ["Bio-One", "Biohazard/Crime Scene Cleanup"],
  ["Blingle!", "Holiday Lighting"],
  ["Bloomin' Blinds", "Blinds/Window Coverings"],
  ["Blue Kangaroo Packoutz", "Packout Services"],
  ["Blue Moon Estate Sales", "Estate Sales"],
  ["Body20", "Fitness/EMS Training"],
  ["Boost Home Healthcare", "Home Healthcare"],
  ["British Swim School", "Swim Lessons"],
  ["Budget Blinds", "Blinds/Window Coverings"],
  ["Bumble Bee Blinds", "Blinds/Window Coverings"],
  ["Cabinet IQ", "Cabinet Refacing"],
  ["CarePatrol", "Senior Care Placement"],
  ["Cascadia Pizza", "Food Trucks"],
  ["CertaPro Painters", "Interior/Exterior Painting"],
  ["Chatime", "Bubble Tea"],
  ["CMIT Solutions", "IT Services"],
  ["ComForCare Home Care", "Senior Home Care"],
  ["COOL-BINZ", "Dumpster Rental"],
  ["CoolVu Glass and Surface Solutions", "Window Film/Glass Treatment"],
  ["Creative Colors International", "Flooring/Color Consulting"],
  ["D1 Sports Training", "Athletic Training"],
  ["Degree Wellness", "Fitness/Wellness"],
  ["Deka Lash", "Eyelash Extensions"],
  ["dermani MEDSPA®", "Medical Spa"],
  ["Discover Strength", "Fitness"],
  ["DonutNV", "Food Trucks"],
  ["ecomaids", "Green Cleaning"],
  ["Ellie Mental Health", "Mental Health Services"],
  ["ERA Group", "Real Estate"],
  ["EverLine Coatings", "Parking Lot Coating"],
  ["Exercise Coach", "Fitness Training"],
  ["Express Employment Professionals", "Staffing Services"],
  ["Face Foundrie", "Skincare/Cosmetics"],
  ["Fastest Labs", "Drug Testing"],
  ["Fibrenew", "Leather/Vinyl Repair"],
  ["FirstLight Home Care", "Senior Home Care"],
  ["Fish Window Cleaning", "Window Cleaning"],
  ["Five Star Bath Solutions", "Bathroom Remodeling"],
  ["Floor Coverings International", "Flooring Sales"],
  ["Floyd's 99 Barbershop", "Barbershop"],
  ["FocalPoint Coaching", "Business Coaching"],
  ["FranFund", "Franchise Financing"],
  ["Fundraising University", "Fundraising Services"],
  ["Furry Land Mobile Grooming", "Pet Grooming"],
  ["Gatsby Glass", "Glass Repair"],
  ["goGLOW", "Beauty/Tanning"],
  ["Gotcha Covered", "Blinds/Shades"],
  ["Groovy Hues", "Painting/Art"],
  ["Hallmark Homecare", "Senior Home Care"],
  ["HealthSource Chiropractic", "Chiropractic"],
  ["Heights Wellness Retreat", "Wellness"],
  ["Hello Sugar", "Sugar/Wax Services"],
  ["Heroes Lawn Care", "Lawn Care"],
  ["HOMEstretch", "Real Estate"],
  ["House Doctors", "Handyman Services"],
  ["Hunters-Humbug", "Pest Control"],
  ["iFlex", "Fitness"],
  ["iFOAM", "Spray Foam Insulation"],
  ["Image Studios", "Photography"],
  ["Insulation Commandos", "Insulation Services"],
  ["ISI® Elite Training", "Athletic Training"],
  ["Ivybrook Academy", "Education"],
];

function renderFranchiseBrandsHtml(): string {
  const items = FEATURED_FRANCHISE_BRANDS.map(
    ([name, industry]) => `<li><strong>${escapeHtml(name)}</strong> — ${escapeHtml(industry)}</li>`,
  ).join("");
  return `
<article>
  <h1>Verified Franchise Opportunities</h1>
  <p>Browse ${FEATURED_FRANCHISE_BRANDS.length}+ carefully selected franchise brands.</p>
  <p>Information about franchise brands is for educational purposes. Each franchise has unique requirements and opportunities.</p>
  <ul>${items}</ul>
  <p><a href="${BOOKING_URL}">Book a Consultation</a></p>
</article>`.trim();
}

function renderPrivacyPolicyHtml(): string {
  return `
<article>
  <h1>Privacy Policy</h1>
  <p>Last updated: March 10, 2026</p>
  <h2>Introduction</h2>
  <p>Charles Stovall ("we," "us," or "our") operates the website charlesstovall.com (the "Site"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site or submit information through our forms.</p>
  <h2>Information We Collect</h2>
  <p>Personal information you provide includes first and last name, email address, phone number, contact-form messages, and survey responses such as investment preferences, timeline, and business style.</p>
  <p>Information collected automatically includes IP address and approximate location, browser and device, pages visited, referring URLs, and cookies.</p>
  <h2>How We Use Your Information</h2>
  <ul>
    <li>Respond to your inquiries and consultation requests</li>
    <li>Match you with relevant franchise opportunities</li>
    <li>Send you information related to franchise consulting services</li>
    <li>Improve the website, content, and user experience</li>
    <li>Analyze website traffic and usage patterns</li>
    <li>Comply with legal obligations</li>
  </ul>
  <h2>Cookies and Tracking Technologies</h2>
  <p>The Site uses Google Analytics and Google Ads to measure performance and understand how visitors use the Site, plus session cookies to maintain a browsing session.</p>
  <h2>Third-Party Services</h2>
  <ul>
    <li>HubSpot, for scheduling consultation calls</li>
    <li>Google Ads and Google Analytics, for advertising, conversion tracking, and website analytics</li>
    <li>LeadConnector (GoHighLevel), for CRM and lead management</li>
    <li>YouTube, for embedded video</li>
  </ul>
  <h2>How We Share Your Information</h2>
  <p>We do not sell your personal information. We may share it with franchise brands you express interest in, with service providers who assist in operating the Site, and when required by law.</p>
  <h2>Data Retention</h2>
  <p>We retain personal information for as long as necessary to fulfill the purposes described in this policy, or as required by law.</p>
  <h2>Your Rights</h2>
  <p>Depending on your location, you may access, correct, or delete your personal data, opt out of marketing communications, and request information about how your data is used.</p>
  <h2>Children's Privacy</h2>
  <p>Our Site is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
  <h2>Ownership Advisor</h2>
  <p>If you use the Franchise Friend Ownership Advisor at <a href="/advisor">/advisor</a>, your conversation, profile, and Ownership Thesis are stored so you can resume later and so Charles can prepare for a strategy call. You can request deletion at <a href="/advisor/privacy">/advisor/privacy</a>.</p>
  <h2>Contact Us</h2>
  <p>Charles Stovall Your Franchise Friend</p>
  <p>1531 N Lakeshore Dr, Mt Pleasant, SC 29466</p>
  <p><a href="mailto:CStovall@FranChoice.com">CStovall@FranChoice.com</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
</article>`.trim();
}

function renderExecutiveProcessHtml(): string {
  return `
<article>
  <p>Our Process</p>
  <h1>How We Find Your Perfect Franchise Match</h1>
  <p>I do the heavy lifting so you don't waste time on bad fits.</p>
  <ol>
    <li><strong>Discovery Call</strong> — We start with a confidential conversation about your goals, lifestyle preferences, investment capacity, and timeline. This helps me understand exactly what you're looking for.</li>
    <li><strong>Franchise Matching</strong> — I screen 4,000+ franchise brands to identify the best fits for your specific situation. No generic lists — only carefully vetted opportunities that match your criteria.</li>
    <li><strong>Brand Introductions</strong> — I connect you directly with franchise development teams for the brands that interest you.</li>
    <li><strong>Due Diligence Support</strong> — I guide you through validation calls, FDD review, and the decision-making process.</li>
  </ol>
  <h2>Ready to Get Started?</h2>
  <p>100% Confidential. No pressure. No obligation.</p>
  <p><a href="${BOOKING_URL}">Start Your Discovery Call</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
</article>`.trim();
}

function renderExecutiveAboutHtml(): string {
  return `
<img src="/charles-headshot.jpeg" alt="Charles Stovall, franchise consultant in Mt Pleasant, SC, headshot" />
<article>
  <p>Meet Your Consultant</p>
  <h1>Your Franchise Advisor: Charles Stovall</h1>
  <ul>
    <li>15+ years in franchise consulting</li>
    <li>Helped 500+ people achieve their dream of business ownership</li>
    <li>Personalized guidance through your franchise journey</li>
    <li>Based in Charleston, SC — work with clients nationwide</li>
  </ul>
  <h2>My Philosophy</h2>
  <p>I'm not here to sell you a franchise. I'm here to help you find the RIGHT franchise for YOUR goals.</p>
  <p>100% Confidential. No Obligation.</p>
  <h2>Let's Talk About Your Future</h2>
  <p>Schedule a no-pressure conversation about your goals. No sales pitch. Just an honest conversation.</p>
  <p><a href="${BOOKING_URL}">Schedule Your Intro Call</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
</article>`.trim();
}

function renderExecutiveInvestmentHtml(): string {
  return `
<article>
  <p>Investment Opportunities</p>
  <h1>Executive-Level Franchise Investment Opportunities</h1>
  <p>Explore your path to business ownership with expert guidance.</p>
  <p>For corporate executives and investors with $150K+ liquid capital seeking proven business models.</p>
  <h2>Models I Specialize In</h2>
  <ul>
    <li><strong>Flexible Ownership Models</strong> — Find a franchise that fits your lifestyle, whether you want hands-on involvement or prefer to oversee operations.</li>
    <li><strong>Manager-Run Business Models</strong> — Build a team to handle daily operations while you focus on the vision and growth of your business.</li>
    <li><strong>Growth-Focused Opportunities</strong> — Explore franchise models designed for expansion and long-term business building.</li>
    <li><strong>Proven Service Franchises</strong> — Essential services that help communities, from restoration to senior care to professional services.</li>
  </ul>
  <h2>Realize Your Dream of Business Ownership</h2>
  <p>I help you find the right franchise that aligns with your goals, values, and desired lifestyle. The key is discovering the match for who you are and what you want to achieve.</p>
  <h2>Explore Your Options</h2>
  <p>Let's discuss which investment models align with your goals, timeline, and capital.</p>
  <p><a href="${BOOKING_URL}">Book Your Consultation</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
</article>`.trim();
}

const STATIC_PAGES: Record<string, SeoPage> = {
  "/": {
    title: "Charles Stovall | Your Franchise Friend — Franchise Consulting for Serious Investors",
    description: "Considering a six-figure franchise investment? Work with Charles Stovall, a consultant who built and exited 30 franchise locations across 4 brands.",
    canonical: absoluteUrl("/"),
    bodyHtml: renderHomeHtml(),
  },
  "/blog": {
    title: "Franchise Insights & Resources | Charles Stovall - Franchise Consultant",
    description: "Expert franchise consulting articles, guides, and market insights for Charleston SC entrepreneurs. Learn about franchise financing, industry trends, and business ownership opportunities.",
    canonical: absoluteUrl("/blog"),
    bodyHtml: renderBlogIndexHtml(),
  },
  "/executive-access": {
    title: "Executive Access | Semi-Absentee Franchise Opportunities for Executives | Charles Stovall",
    description: "Charles Stovall helps executives in Charleston and nationwide match capital to a franchise model they can run without leaving the W-2. Assessment, FDD review, Item 19.",
    canonical: absoluteUrl("/executive-access"),
    bodyHtml: renderExecutiveAccessHtml(),
    jsonLd: faqPageSchema(executiveFaqItems),
  },
  "/executive-access/process": {
    title: "How We Find Your Perfect Franchise Match | Charles Stovall",
    description: "I do the heavy lifting so you don't waste time on bad fits: a discovery call, franchise matching, brand introductions, and due diligence support.",
    canonical: absoluteUrl("/executive-access/process"),
    bodyHtml: renderExecutiveProcessHtml(),
    jsonLd: webPageJsonLd(
      "How We Find Your Perfect Franchise Match | Charles Stovall",
      "I do the heavy lifting so you don't waste time on bad fits: a discovery call, franchise matching, brand introductions, and due diligence support.",
      "/executive-access/process",
    ),
  },
  "/executive-access/about": {
    title: "Your Franchise Advisor: Charles Stovall | Executive Access",
    description: "Meet Charles Stovall, franchise advisor in Charleston, SC. He helps clients find the right franchise for their goals, with confidential guidance and no obligation.",
    canonical: absoluteUrl("/executive-access/about"),
    bodyHtml: renderExecutiveAboutHtml(),
    jsonLd: webPageJsonLd(
      "Your Franchise Advisor: Charles Stovall | Executive Access",
      "Meet Charles Stovall, franchise advisor in Charleston, SC. He helps clients find the right franchise for their goals, with confidential guidance and no obligation.",
      "/executive-access/about",
    ),
  },
  "/executive-access/investment": {
    title: "Executive-Level Franchise Investment Opportunities | Charles Stovall",
    description: "Franchise investment models for executives and investors with $150K+ liquid capital: flexible ownership, manager-run concepts, and proven service brands.",
    canonical: absoluteUrl("/executive-access/investment"),
    bodyHtml: renderExecutiveInvestmentHtml(),
    jsonLd: webPageJsonLd(
      "Executive-Level Franchise Investment Opportunities | Charles Stovall",
      "Franchise investment models for executives and investors with $150K+ liquid capital: flexible ownership, manager-run concepts, and proven service brands.",
      "/executive-access/investment",
    ),
  },
  "/speaking": {
    title: "The Franchise Expert Your Audience Needs to Hear | Charles Stovall",
    description: "Book Charles Stovall as a podcast and media guest. Topics include franchise matching, FDD review, multi-unit scaling, financing, and the corporate-to-owner path.",
    canonical: absoluteUrl("/speaking"),
    bodyHtml: renderSpeakingHtml(),
    jsonLd: webPageJsonLd(
      "The Franchise Expert Your Audience Needs to Hear | Charles Stovall",
      "Book Charles Stovall as a podcast and media guest. Topics include franchise matching, FDD review, multi-unit scaling, financing, and the corporate-to-owner path.",
      "/speaking",
    ),
  },
  "/franchise-brands": {
    title: "Verified Franchise Opportunities | Charles Stovall",
    description: "Browse carefully selected franchise brands across home services, senior care, fitness, and wellness. Charles Stovall lists them for educational purposes.",
    canonical: absoluteUrl("/franchise-brands"),
    bodyHtml: renderFranchiseBrandsHtml(),
    jsonLd: webPageJsonLd(
      "Verified Franchise Opportunities | Charles Stovall",
      "Browse carefully selected franchise brands across home services, senior care, fitness, and wellness. Charles Stovall lists them for educational purposes.",
      "/franchise-brands",
    ),
  },
  "/privacy-policy": {
    title: "Privacy Policy | Charles Stovall",
    description: "How Charles Stovall collects, uses, shares, and safeguards information when you visit charlesstovall.com or submit a form. Updated March 10, 2026.",
    canonical: absoluteUrl("/privacy-policy"),
    bodyHtml: renderPrivacyPolicyHtml(),
    jsonLd: webPageJsonLd(
      "Privacy Policy | Charles Stovall",
      "How Charles Stovall collects, uses, shares, and safeguards information when you visit charlesstovall.com or submit a form. Updated March 10, 2026.",
      "/privacy-policy",
    ),
  },
  "/home-based-franchises": {
    title: "Home-Based Franchise Opportunities | Work From Home Franchises | Charles Stovall",
    description: "Home-based franchise opportunities under $75K. Charles Stovall matches work-from-home franchise brands to your budget, schedule, and goals.",
    canonical: absoluteUrl("/home-based-franchises"),
    bodyHtml: renderHomeBasedHtml(),
  },
  "/thank-you-ad": {
    title: "Thank You | Charles Stovall",
    description: "Your request has been received. Charles will follow up to schedule your consultation.",
    canonical: absoluteUrl("/thank-you-ad"),
  },
  "/faq": {
    title: "Franchise Consulting FAQ | Charles Stovall",
    description: "Everything you need to know about working with a franchise consultant. Get answers about franchise costs, discovery process, financing, and more.",
    canonical: absoluteUrl("/faq"),
    bodyHtml: renderFaqPageHtml(),
    jsonLd: faqPageSchema(siteFaqItems),
  },
  "/podcasts": {
    title: "Franchise Friend Podcast | Charles Stovall",
    description: "Expert insights on franchise consulting, business strategy, and entrepreneurship from Charles Stovall.",
    canonical: absoluteUrl("/podcasts"),
  },
  "/charleston": {
    title: "Franchise Consultant Charleston SC | Charles Stovall",
    description: "Franchise consultant in Charleston, SC. Charles Stovall lives in Mount Pleasant and reads the FDD for Daniel Island, the islands, and the Lowcountry.",
    canonical: absoluteUrl("/charleston"),
    bodyHtml: renderCharlestonHtml(),
    jsonLd: faqPageSchema(charlestonFaqItems),
  },
  "/mount-pleasant": {
    title: mountPleasantPage.title,
    description: mountPleasantPage.description,
    canonical: absoluteUrl("/mount-pleasant"),
    bodyHtml: renderLocalMarketHtml(mountPleasantPage),
    jsonLd: localMarketJsonLd(mountPleasantPage),
  },
  "/south-carolina": {
    title: southCarolinaPage.title,
    description: southCarolinaPage.description,
    canonical: absoluteUrl("/south-carolina"),
    bodyHtml: renderLocalMarketHtml(southCarolinaPage),
    jsonLd: localMarketJsonLd(southCarolinaPage),
  },
  "/about": {
    title: "About Charles Stovall | Your Franchise Friend",
    description: `Charles Stovall — franchise consultant at ${formattedAddressLine()}. Built 30 locations across 4 brands and exited to private equity.`,
    canonical: absoluteUrl("/about"),
    bodyHtml: renderAboutHtml(),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": absoluteUrl("/about"),
      url: absoluteUrl("/about"),
      name: "About Charles Stovall",
      mainEntity: { "@id": PERSON_ID },
    },
  },
  "/trusted-partners": {
    title: trustedPartnersPage.title,
    description: trustedPartnersPage.description,
    canonical: absoluteUrl(trustedPartnersPage.path),
    bodyHtml: renderTrustedPartnersHtml(),
    jsonLd: trustedPartnersJsonLd(),
  },
  "/advisor": {
    title: "Ownership Advisor | Franchise Friend with Charles Stovall",
    description: "Before you choose a franchise, understand what should actually fit your life. A private, guided conversation built from Chuck Stovall's ownership experience.",
    canonical: absoluteUrl("/advisor"),
    bodyHtml: renderAdvisorHtml(),
  },
  "/questions": {
    title: questionIndex.title,
    description: questionIndex.description,
    canonical: absoluteUrl("/questions"),
    bodyHtml: renderQuestionIndexHtml(),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: questionIndex.h1,
      itemListElement: questionPages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.h1,
        url: absoluteUrl(page.path),
      })),
    },
  },
  ...Object.fromEntries(questionPages.map((page) => [page.path, questionSeoPage(page)])),
  ...Object.fromEntries(servicePages.map((page) => [page.path, serviceSeoPage(page)])),
};

/** Exact paths registered in client/src/App.tsx, plus the static SEO pages. */
const CLIENT_EXACT_PATHS = new Set<string>([
  ...Object.keys(STATIC_PAGES),
  "/speaking",
  "/franchise-brands",
  "/podcast-admin",
  "/members-admin",
  "/client-portal",
  "/phase1",
  "/phase2",
  "/phase3",
  "/phase4",
  "/executive-access/process",
  "/executive-access/about",
  "/executive-access/investment",
  "/home-franchise-results",
  "/privacy-policy",
  "/advisor/conversation",
  "/advisor/privacy",
  "/admin/advisor/login",
  "/admin/advisor/brands",
  "/admin/advisor/settings",
  "/admin/advisor/analytics",
  "/admin/advisor",
]);

const DYNAMIC_APP_PATHS: RegExp[] = [
  /^\/advisor\/report\/[^/]+$/,
  /^\/advisor\/resume\/[^/]+$/,
  /^\/admin\/advisor\/candidates\/[^/]+$/,
];

export function normalizeRoutePath(pathname: string): string {
  const raw = pathname.split("#")[0].split("?")[0];
  const path = !raw || raw === "*" ? "/" : raw.startsWith("/") ? raw : `/${raw}`;
  const trimmed = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return trimmed === "/index.html" ? "/" : trimmed;
}

function blogSlugFromPath(pathname: string): string | null {
  const normalized = normalizeRoutePath(pathname);
  if (!normalized.startsWith("/blog/")) return null;
  const slug = normalized.slice("/blog/".length);
  if (!slug || slug.includes("/")) return null;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** True when the SPA has a real page for this path. Unknown blog slugs are not known. */
export function isKnownAppPath(pathname: string): boolean {
  const normalized = normalizeRoutePath(pathname);
  if (CLIENT_EXACT_PATHS.has(normalized)) return true;
  if (DYNAMIC_APP_PATHS.some((pattern) => pattern.test(normalized))) return true;
  const slug = blogSlugFromPath(normalized);
  return slug != null && Boolean(getPostBySlug(slug));
}

/** HTTP status for the HTML document. Unknown routes and unknown blog slugs are 404. */
export function statusForPath(pathname: string): 200 | 404 {
  return isKnownAppPath(pathname) ? 200 : 404;
}

export function resolveSeoPage(pathname: string): SeoPage | null {
  const path = pathname.split("?")[0];
  const normalized = normalizeRoutePath(path);

  const slug = blogSlugFromPath(normalized);
  if (slug) {
    return renderBlogPostHtml(slug);
  }

  return STATIC_PAGES[normalized] || STATIC_PAGES[path] || null;
}

function replaceOrInsert(html: string, pattern: RegExp, tag: string): string {
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceJsonLd(html: string, scripts: object[]): string {
  const stripped = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
  const block = scripts.map(jsonLdScript).join("\n    ");
  return stripped.replace("</head>", `    ${block}\n  </head>`);
}

function injectGoogleSiteVerification(html: string): string {
  const tag = `<meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}" />`;
  return replaceOrInsert(html, /<meta name="google-site-verification"[^>]*>/, tag);
}

/** Express `app.use("*")` mounts the full path, so `req.path` becomes `/`. Always prefer originalUrl. */
export function pathnameFromRequest(req: {
  originalUrl?: string;
  url?: string;
  path?: string;
}): string {
  const raw = req.originalUrl || req.url || req.path || "/";
  const path = raw.split("#")[0].split("?")[0];
  if (!path || path === "*") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

const GENERIC_NOT_FOUND_TITLE = "404 Page Not Found";
const GENERIC_NOT_FOUND_BODY = `<h1>404 Page Not Found</h1><p>Did you forget to add the page to the router?</p>`;

function applyNotFoundHtml(html: string, page: SeoPage | null): string {
  const title = page?.title || GENERIC_NOT_FOUND_TITLE;
  const description = page?.description || "Did you forget to add the page to the router?";
  const bodyHtml = page?.bodyHtml || GENERIC_NOT_FOUND_BODY;

  let next = html;
  next = next.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
  next = next.replace(/<meta\s+property=["']og:url["'][^>]*>\s*/gi, "");
  next = next.replace(/<meta\s+name=["']twitter:url["'][^>]*>\s*/gi, "");
  next = replaceOrInsert(
    next,
    /<meta name="robots"[^>]*>/,
    `<meta name="robots" content="noindex" />`,
  );
  next = replaceOrInsert(next, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  next = replaceOrInsert(
    next,
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );

  if (bodyHtml) {
    next = next.replace(/<div id="root"><\/div>/, `<div id="root">${bodyHtml}</div>`);
  }

  return next;
}

export function applySeoToHtml(html: string, pathname: string): string {
  const normalized = normalizeRoutePath(pathnameFromRequest({ originalUrl: pathname, path: pathname }));
  const page = resolveSeoPage(normalized);

  let next = html;
  next = injectGoogleSiteVerification(next);
  next = replaceOrInsert(
    next,
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${OG_IMAGE_URL}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${OG_IMAGE_URL}" />`,
  );

  const pageJsonLd = page?.noindex
    ? []
    : page?.jsonLd
      ? Array.isArray(page.jsonLd)
        ? page.jsonLd
        : [page.jsonLd]
      : [];
  next = replaceJsonLd(next, [...sitewideJsonLd(), ...pageJsonLd]);

  if (page?.noindex || !isKnownAppPath(normalized)) {
    return applyNotFoundHtml(next, page?.noindex ? page : null);
  }

  if (!page?.canonical) {
    return next;
  }

  next = replaceOrInsert(next, /<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  next = replaceOrInsert(
    next,
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${page.canonical}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${page.canonical}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeHtml(page.ogTitle || page.title)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="${page.type || "website"}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="twitter:url"[^>]*>/,
    `<meta name="twitter:url" content="${page.canonical}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeHtml(page.ogTitle || page.title)}" />`,
  );
  next = replaceOrInsert(
    next,
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
  );

  if (page.publishedTime) {
    next = replaceOrInsert(
      next,
      /<meta property="article:published_time"[^>]*>/,
      `<meta property="article:published_time" content="${escapeHtml(page.publishedTime)}" />`,
    );
  }
  if (page.modifiedTime) {
    next = replaceOrInsert(
      next,
      /<meta property="article:modified_time"[^>]*>/,
      `<meta property="article:modified_time" content="${escapeHtml(page.modifiedTime)}" />`,
    );
  }

  if (page.bodyHtml) {
    next = next.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${page.bodyHtml}</div>`,
    );
  }

  return next;
}

export function sitemapUrls(): string[] {
  const staticUrls = [
    "/",
    "/about",
    "/blog",
    "/executive-access",
    "/executive-access/process",
    "/executive-access/about",
    "/executive-access/investment",
    "/home-based-franchises",
    "/podcasts",
    "/faq",
    "/franchise-brands",
    "/charleston",
    "/mount-pleasant",
    "/south-carolina",
    "/speaking",
    "/advisor",
    "/questions",
    "/trusted-partners",
    ...questionPages.map((page) => page.path),
    ...servicePages.map((page) => page.path),
  ];
  return [
    ...staticUrls.map((path) => absoluteUrl(path)),
    ...blogPosts.map((post) => absoluteUrl(`/blog/${post.slug}`)),
  ];
}

export { SITE_ORIGIN };
