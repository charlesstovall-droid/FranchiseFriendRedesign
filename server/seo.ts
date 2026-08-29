import { SITE_ORIGIN, absoluteUrl } from "../shared/site";
import { blogPosts, getPostBySlug } from "../client/src/data/blog-posts";

export interface SeoPage {
  title: string;
  description: string;
  canonical: string;
  type?: "website" | "article";
  ogTitle?: string;
  bodyHtml?: string;
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  <p><a href="https://calendly.com/charles-stovall/intro">Book a consultation</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
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
`.trim();
}

export function renderCharlestonHtml(): string {
  return `
<img src="/cs-shield-logo.png" alt="Charles Stovall" />
<img src="/charles-headshot.jpeg" alt="Charles Stovall, Charleston franchise consultant" />
<article>
  <p>Charleston · Mount Pleasant · Daniel Island · the Lowcountry</p>
  <h1>Own a Business in Charleston. Without Starting One From Scratch.</h1>
  <p>I'm Charles Stovall — a Charleston-based franchise consultant. I help Lowcountry executives, military retirees, and professionals find franchise brands that fit their capital, lifestyle, and goals.</p>
  <h2>Why a local consultant matters</h2>
  <p>National firms don't know the Lowcountry. I know which concepts are underserved here and which ones are already saturated in Mount Pleasant. Where territories are still open in Summerville. What's working on Daniel Island.</p>
  <p>We can meet in person — coffee at Second State, breakfast at Hominy Grill, or a call. You work with me directly from discovery through close. No handoffs, no junior reps, no call center.</p>
  <h2>How it works</h2>
  <ol>
    <li>Discover — a 15-minute call on capital, goals, timeline, and lifestyle. No pitch. Just listening.</li>
    <li>Match — 2–4 vetted franchise brands that fit your profile. Real financials, honest assessment.</li>
    <li>Decide — due diligence, validation calls with existing franchisees, close support. You move at your own pace.</li>
  </ol>
  <h2>About Charles</h2>
  <p>I've spent 15+ years helping corporate professionals and executives make the transition to franchise ownership. I'm based in Charleston because I believe the Lowcountry is one of the best markets in the country for the right franchise concepts — and I want to be the advisor who knows that market inside and out. If franchising isn't right for you, I'll tell you.</p>
  <h2>Frequently asked questions</h2>
  <h3>Why work with a local Charleston consultant vs. a national firm?</h3>
  <p>Because I live here. I know which Lowcountry markets are underserved, which concepts are already saturated in Mount Pleasant, and which SBA lenders and franchise attorneys in Charleston are ready to move fast. That local context doesn't exist in a call center.</p>
  <h3>What investment level do you work with?</h3>
  <p>I typically work with clients who have $100K+ in liquid capital. Many Charleston clients invest $150K–$500K in proven, established concepts. We'll discuss financing options — including SBA loans and 401(k) rollovers — on our first call.</p>
  <h3>Do I need to quit my job to own a franchise?</h3>
  <p>Not at all. Many of the models I recommend are semi-absentee — you can keep your income while building equity. It's one of the things we'll map out together based on your schedule and goals.</p>
</article>
<form id="charleston-consultation-form" action="/api/leads" method="POST">
  <h2>Request a Charleston consultation</h2>
  <p>First name, last name, email, and phone. I'll follow up within one business day.</p>
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
  <label>What area of Charleston are you in? <input type="text" name="area" placeholder="e.g. Mount Pleasant, Summerville, Downtown" /></label>
  <input type="hidden" name="leadType" value="charleston-ad" />
  <input type="hidden" name="message" value="Charleston Ad Landing Page" />
  <button type="submit">Book My 15-Min Call</button>
</form>
<p><a href="https://calendly.com/charles-stovall/intro">Book a call on Calendly</a> · <a href="tel:9198273921">(919) 827-3921</a></p>
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
  <ul>
    ${links}
  </ul>
</nav>
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

  return {
    title: `${post.title} | Charles Stovall`,
    description,
    canonical: absoluteUrl(`/blog/${post.slug}`),
    type: "article",
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
    description: "Franchise consulting for buyers in Charleston, Mt. Pleasant, and the Lowcountry.",
    canonical: absoluteUrl("/charleston"),
    bodyHtml: renderCharlestonHtml(),
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
  if (!page) {
    return html;
  }

  let next = html;
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
