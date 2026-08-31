import { SITE_ORIGIN, absoluteUrl } from "../shared/site";
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

export interface SeoPage {
  title: string;
  description: string;
  canonical: string;
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
    "@type": "LocalBusiness",
    "@id": LOCAL_BUSINESS_ID,
    name: NAP.name,
    alternateName: [...NAP.alternateNames],
    image: OG_IMAGE_URL,
    description:
      "Franchise consulting, FDD review, and due diligence based in Mt Pleasant, SC for prospective franchise owners nationwide.",
    url: `${SITE_ORIGIN}/`,
    telephone: NAP.telephone,
    email: NAP.email,
    priceRange: "$$",
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: NAP_GEO.latitude,
      longitude: NAP_GEO.longitude,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
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
<img src="/charles-headshot.jpeg" alt="Charles Stovall, franchise consultant in Charleston, SC" />
<article>
  <p>Charles Stovall · Your Franchise Friend · Charleston, SC</p>
  <h1>Invest in Yourself. Do it with someone who has done it.</h1>
  <p>You are weighing a six or seven figure decision. Before you sign an FDD, talk to a consultant who built 30 franchise locations across 4 brands and exited to private equity. Honest answers, real numbers.</p>
  <h2>I have sat on your side of the table.</h2>
  <p>Most franchise consultants have never signed a lease, made payroll on a slow month, or negotiated a multi-unit development agreement. I have done all three, many times over.</p>
  <p>I opened my first location in 2013. By 2017 I had scaled to 20 units across multiple states, and I went on to build and operate 30 locations across four very different brands before selling to private equity.</p>
  <p>When we review an FDD together, you get an operator's read on Item 19, territory, labor model, and unit economics. If a concept is not right for you, I will tell you.</p>
  <ul>
    <li>30 locations built and exited</li>
    <li>4 franchise brands owned</li>
    <li>Private equity exit</li>
  </ul>
  <h2>Four phases. Zero pressure.</h2>
  <ol>
    <li>Intro call — goals, capital, timeline, and lifestyle.</li>
    <li>Your profile — background, strengths, and financial picture.</li>
    <li>Matched options — owner-operator, semi-absentee, or multi-unit.</li>
    <li>Due diligence — FDD review, validation calls, funding, discovery day.</li>
  </ol>
  <p><a href="/charleston">Charleston franchise consulting</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a> · <a href="/about">About Charles</a></p>
  <p><a href="https://calendly.com/charles-stovall/intro">Book a consultation</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
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
<p><a href="https://calendly.com/charles-stovall/intro">Book a call on Calendly</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
${napBlockHtml()}
`.trim();
}

export function renderCharlestonHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-homepage-portrait.jpg" alt="Charles Stovall, Charleston franchise consultant" />
<article>
  <p>Charleston · Mt. Pleasant · Daniel Island · the Lowcountry</p>
  <h1>Own a Business in Charleston. Without Starting One From Scratch.</h1>
  <p>I live in this market. I help Lowcountry executives, military retirees, and professionals match capital to a franchise — then read the FDD like someone who has made payroll.</p>
  <p>A national average does not know what labor costs in Mt. Pleasant, or whether the territory on Daniel Island is already spoken for.</p>
  <p>30 locations built. A PE exit. Charleston resident.</p>
  <h2>The Lowcountry is not a national slide.</h2>
  <p>I know which concepts are already saturated in Mount Pleasant, where territories are still open in Summerville, and what's working on Daniel Island. National firms do not sit in those rooms.</p>
  <p>When we read an FDD together, you get an operator's view of Item 19, labor, and occupancy in this market — not a highlight reel built for a cheaper city. If the concept is wrong for Charleston, I will say so.</p>
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
<p><a href="https://calendly.com/charles-stovall/intro">Book a call on Calendly</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
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
  <p><a href="/charleston">Charleston franchise consulting</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a></p>
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
  ${renderFaqHtml(siteFaqItems, "Questions")}
  ${napBlockHtml()}
</article>
`.trim();
}

export function renderAboutHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-headshot.jpeg" alt="Charles Stovall, franchise consultant in Mt Pleasant, SC" />
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
  <p><a href="/charleston">Charleston franchise consulting</a> · <a href="/blog/fdd-red-flags">FDD Red Flags</a> · <a href="https://calendly.com/charles-stovall/intro">Book a consultation</a></p>
  ${napBlockHtml()}
</article>
`.trim();
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
      canonical: absoluteUrl("/blog"),
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
  "/franchise-assessment": {
    title: "Franchise Assessment | Charles Stovall",
    description: "Take the franchise questionnaire and see how ready you are for ownership.",
    canonical: absoluteUrl("/franchise-assessment"),
  },
  "/charleston": {
    title: "Charleston Franchise Consultant | Charles Stovall",
    description: "Franchise consulting for buyers in Charleston, Mt. Pleasant, Daniel Island, and the Lowcountry. Charles Stovall — operator, resident, FDD read like payroll.",
    canonical: absoluteUrl("/charleston"),
    bodyHtml: renderCharlestonHtml(),
    jsonLd: faqPageSchema(charlestonFaqItems),
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
};

export function resolveSeoPage(pathname: string): SeoPage | null {
  const path = pathname.split("?")[0];
  const normalized = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  if (normalized.startsWith("/blog/") && normalized !== "/blog/") {
    const slug = normalized.slice("/blog/".length);
    if (slug && !slug.includes("/")) {
      return renderBlogPostHtml(slug);
    }
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

export function applySeoToHtml(html: string, pathname: string): string {
  const page = resolveSeoPage(pathnameFromRequest({ originalUrl: pathname, path: pathname }));

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

  const pageJsonLd = page?.jsonLd
    ? Array.isArray(page.jsonLd)
      ? page.jsonLd
      : [page.jsonLd]
    : [];
  next = replaceJsonLd(next, [...sitewideJsonLd(), ...pageJsonLd]);

  if (!page) {
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
    "/home-based-franchises",
    "/podcasts",
    "/faq",
    "/franchise-brands",
    "/charleston",
    "/speaking",
  ];
  return [
    ...staticUrls.map((path) => absoluteUrl(path)),
    ...blogPosts.map((post) => absoluteUrl(`/blog/${post.slug}`)),
  ];
}

export { SITE_ORIGIN };
