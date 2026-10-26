import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type SVGProps } from "react";
import { SEO } from "@/components/SEO";
import { featuredGoogleReviews, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEW_RATING } from "@shared/google-reviews";
import "./home.css";
import shield from "@/assets/home/shield.png";
import portrait from "@/assets/home/portrait.jpg";
import boost from "@/assets/home/boost.png";
import massageEnvy from "@/assets/home/massage-envy.png";
import yogaSix from "@/assets/home/yogasix.png";
import imageStudios from "@/assets/home/image-studios.png";
import incLogo from "@/assets/home/inc.png";
import entrepreneur from "@/assets/home/entrepreneur.png";
import radiox from "@/assets/home/radiox.png";
import franChoice from "@/assets/home/franchoice.png";
import fitCorporate from "@/assets/home/fit-corporate.jpg";
import fitPortfolio from "@/assets/home/fit-portfolio.jpg";
import fitEmpire from "@/assets/home/fit-empire.jpg";

const CALENDLY = "https://calendly.com/charles-stovall/intro";
const REVIEW_INTERVAL_MS = 9000;
const PHASE_LINE_MS = 700;

type LogoItem =
  | { kind: "dot" }
  | {
      kind: "logo";
      src: string;
      alt: string;
      width: number;
      height: number;
      label?: string;
      imgHeight?: number;
    };

const logos: LogoItem[] = [
  { kind: "logo", src: boost, alt: "Boost Mobile", width: 206, height: 80 },
  { kind: "logo", src: massageEnvy, alt: "Massage Envy", width: 430, height: 80 },
  { kind: "logo", src: yogaSix, alt: "YogaSix", width: 398, height: 80 },
  { kind: "logo", src: imageStudios, alt: "Image Studios", width: 637, height: 80 },
  { kind: "dot" },
  { kind: "logo", src: incLogo, alt: "Inc. magazine", width: 231, height: 80, label: "500" },
  { kind: "logo", src: entrepreneur, alt: "Entrepreneur magazine", width: 404, height: 80 },
  { kind: "logo", src: radiox, alt: "Business RadioX", width: 153, height: 80 },
  { kind: "dot" },
  { kind: "logo", src: franChoice, alt: "FranChoice", width: 199, height: 80, imgHeight: 44 },
  { kind: "dot" },
];

const phases: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Intro Call",
    body: "A real conversation about your goals, capital, timeline, and lifestyle. We decide together whether this process makes sense for you.",
    icon: <IconPhone />,
  },
  {
    title: "Your Profile",
    body: "A deeper dive into your background, strengths, and financial picture so the search is built around you, not a brand's sales quota.",
    icon: <IconPerson />,
  },
  {
    title: "Matched Options",
    body: "A short list of vetted concepts that fit your model: owner-operator, semi-absentee, or multi-unit. Side-by-side comparisons included.",
    icon: <IconColumns />,
  },
  {
    title: "Due Diligence",
    body: "FDD review, validation calls with current franchisees, funding strategy, and discovery day prep, all the way to a decision you trust.",
    icon: <IconSearch />,
  },
];

const reviews = featuredGoogleReviews;

const footerGroups = [
  {
    label: "Learn",
    links: [
      ["/blog", "Blog"],
      ["/questions", "Buyer Questions"],
      ["/podcasts", "Podcast"],
      ["/faq", "FAQ"],
      ["/franchise-brands", "Franchise Brands"],
      ["/home-based-franchises", "Home-Based Franchises"],
    ],
  },
  {
    label: "Places",
    links: [
      ["/charleston", "Charleston"],
      ["/mount-pleasant", "Mount Pleasant"],
      ["/south-carolina", "South Carolina"],
    ],
  },
  {
    label: "With Charles",
    links: [
      ["/executive-access", "Executive Access"],
      ["#partners", "Referral Partners"],
      ["/privacy-policy", "Privacy"],
    ],
  },
] as const;

function LogoItems({ clone = false }: { clone?: boolean }) {
  return (
    <>
      {logos.map((item, index) => {
        const key = `${clone ? "c" : "a"}-${index}`;
        if (item.kind === "dot") {
          return <span className={clone ? "marquee-dot is-clone" : "marquee-dot"} aria-hidden="true" key={key} />;
        }
        return (
          <div className={clone ? "marquee-item is-clone" : "marquee-item"} aria-hidden={clone || undefined} key={key}>
            <img
              src={item.src}
              alt={clone ? "" : item.alt}
              width={item.width}
              height={item.height}
              style={item.imgHeight ? { height: item.imgHeight } : undefined}
            />
            {item.label ? <span className={clone ? "inc500 is-clone" : "inc500"}>{clone ? null : item.label}</span> : null}
          </div>
        );
      })}
    </>
  );
}

function alignPhaseRail(journey: HTMLElement) {
  const rail = journey.querySelector<HTMLElement>(".phase-rail");
  const cards = Array.from(journey.querySelectorAll<HTMLElement>(".phase"));
  if (!rail || cards.length < 2) return;
  if (window.matchMedia("(max-width: 980px)").matches) return;
  const next = cards[1].getBoundingClientRect();
  const first = cards[0].getBoundingClientRect();
  if (first.bottom <= next.top + 1) return;

  const parent = journey.getBoundingClientRect();
  const last = cards[cards.length - 1].getBoundingClientRect();
  const anchor = cards[0].querySelector<HTMLElement>(".ph-top") ?? cards[0];
  const anchorBox = anchor.getBoundingClientRect();
  const height = 2;
  // Snap in viewport pixels so the 2px rule stays crisp, and tuck the ends
  // under the outer cards just enough to meet the borders without a gap.
  const topVp = Math.round(anchorBox.top + anchorBox.height / 2 - height / 2);
  const x1 = Math.floor(first.right);
  const x2 = Math.ceil(last.left);
  rail.style.top = `${topVp - parent.top}px`;
  rail.style.left = `${x1 - parent.left}px`;
  rail.style.width = `${Math.max(0, x2 - x1)}px`;
  rail.style.height = `${height}px`;
  rail.style.right = "auto";
  rail.style.bottom = "auto";
  rail.style.transform = "none";
}

function ReviewLayers({ active, tone }: { active: number; tone: "feature" | "card" }) {
  return (
    <>
      {reviews.map((review, index) => {
        const on = index === active;
        return (
          <div
            className={on ? "review-layer is-active" : "review-layer"}
            key={review.author}
            aria-hidden={on ? undefined : true}
          >
            {tone === "feature" ? (
              <>
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                <div>
                  <p>{review.text}</p>
                  <span className="who">
                    {review.author} · Google Review
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <div>
                  <p>"{review.text}"</p>
                  <span className="who">{review.author} · Google Review</span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);
  const phasePlayed = useRef(false);
  const [featured, setFeatured] = useState(0);
  const featuredRef = useRef(0);
  const [slots, setSlots] = useState(() => reviews.map((_, index) => index).filter((index) => index !== 0));
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const journey = phasesRef.current;
    if (!page || !journey) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let headingObserver: IntersectionObserver | null = null;
    let phaseObserver: IntersectionObserver | null = null;
    let settleTimer = 0;
    let frame = 0;
    let cancelled = false;

    const align = () => alignPhaseRail(journey);

    const settleHeadings = () => {
      headingObserver?.disconnect();
      headingObserver = null;
      const headings = Array.from(page.querySelectorAll<HTMLElement>(".fade-heading"));
      if (media.matches) {
        for (const node of headings) node.classList.remove("is-in", "is-seen");
        return;
      }
      const pending: HTMLElement[] = [];
      for (const node of headings) {
        const rect = node.getBoundingClientRect();
        const seen = rect.bottom > 0 && rect.top < window.innerHeight;
        if (seen) {
          node.classList.add("is-in", "is-seen");
        } else if (!node.classList.contains("is-in")) {
          pending.push(node);
        }
      }
      if (pending.length === 0) return;
      headingObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            headingObserver?.unobserve(entry.target);
          }
        },
        { threshold: 0.4, rootMargin: "0px 0px -6% 0px" },
      );
      for (const node of pending) headingObserver.observe(node);
    };

    const armPhases = () => {
      phaseObserver?.disconnect();
      phaseObserver = null;
      window.clearTimeout(settleTimer);
      if (media.matches) {
        journey.classList.remove("is-drawn", "is-settled");
        return;
      }
      align();
      if (phasePlayed.current) {
        journey.classList.add("is-drawn", "is-settled");
        return;
      }
      const rect = journey.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > rect.height * 0.2;
      const start = () => {
        if (phasePlayed.current) return;
        phasePlayed.current = true;
        align();
        journey.classList.add("is-drawn");
        settleTimer = window.setTimeout(() => journey.classList.add("is-settled"), PHASE_LINE_MS + 220);
        phaseObserver?.disconnect();
      };
      if (inView) {
        start();
        return;
      }
      phaseObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) start();
        },
        { threshold: 0.2 },
      );
      phaseObserver.observe(journey);
    };

    const apply = () => {
      setReduced(media.matches);
      if (media.matches) page.classList.remove("motion");
      else page.classList.add("motion");
      settleHeadings();
      armPhases();
    };

    apply();
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(align);
    };
    media.addEventListener("change", apply);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => {
      if (!cancelled && !media.matches) align();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      headingObserver?.disconnect();
      phaseObserver?.disconnect();
      media.removeEventListener("change", apply);
      window.removeEventListener("resize", onResize);
      page.classList.remove("motion");
    };
  }, []);

  const stepReview = (delta: number) => {
    const current = featuredRef.current;
    const next = (current + delta + reviews.length) % reviews.length;
    featuredRef.current = next;
    setFeatured(next);
    setSlots((currentSlots) => currentSlots.map((slot) => (slot === next ? current : slot)));
  };

  useEffect(() => {
    if (reduced || hoverPaused || userPaused) return;
    const id = window.setInterval(() => stepReview(1), REVIEW_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [hoverPaused, reduced, userPaused]);

  return (
    <div className="home-page" ref={pageRef}>
      <SEO
        title="Charles Stovall | Your Franchise Friend — Franchise Consulting for Serious Investors"
        description="Considering a six-figure franchise investment? Work with Charles Stovall, a consultant who built and exited 30 franchise locations across 4 brands."
        canonicalUrl="https://www.charlesstovall.com/"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Archivo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="ribbon">
        Your Franchise Friend · <span>SC — USA</span> · Consultations are always free
      </div>
      <header>
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="Charles Stovall home">
            <img className="shield" src={shield} alt="CS shield monogram" width={80} height={149} />
            <span>
              <span className="brand-name">Charles Stovall</span>
              <br />
              <span className="brand-tag">Your Franchise Friend</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#track-record">Track Record</a>
            <a href="#process">Process</a>
            <a href="#reviews">Reviews</a>
            <a href="#partners">Partners</a>
            <a className="btn btn-gold" href={CALENDLY} target="_blank" rel="noopener">
              Book a Call
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">For serious franchise investors</span>
              <h1 className="fade-heading">
                <span className="sage">Invest</span> in Yourself.
                <br />
                Do it with someone
                <br />
                who has done it.
              </h1>
              <p className="lede">
                You are weighing a six or seven figure decision. Before you sign an FDD, talk to a consultant who{" "}
                <strong>built 30 franchise locations across 4 brands and exited to private equity</strong>. Honest
                answers, real numbers.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-gold" href={CALENDLY} target="_blank" rel="noopener">
                  Book a Free Consultation
                </a>
                <a className="btn btn-ghost" href="#process">
                  See How It Works
                </a>
              </div>
            </div>
            <div className="portrait">
              <img className="portrait-badge" src={shield} alt="" aria-hidden="true" width={80} height={149} />
              <div className="portrait-frame">
                <img
                  src={portrait}
                  alt="Charles Stovall, franchise consultant, seated in a gray plaid blazer"
                  width={826}
                  height={1100}
                  fetchPriority="high"
                />
              </div>
              <div className="rating-card">
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <span className="score">{GOOGLE_REVIEW_RATING}</span>
                <span className="label">{GOOGLE_REVIEW_COUNT} Google Reviews</span>
              </div>
            </div>
          </div>
        </section>

        <div className="logos" aria-label="Brands owned and media features">
          <span className="logo-eyebrow">
            <b>Brands Built, Scaled & Exited</b> · Featured In · Affiliated With
          </span>
          <div className="marquee">
            <div className="marquee-track">
              <LogoItems />
              <LogoItems clone />
            </div>
          </div>
        </div>

        <div className="stats" id="track-record">
          <div className="wrap stats-grid">
            <div className="stat">
              <div className="num">
                <span>30</span>
              </div>
              <div className="cap">Locations Built & Exited</div>
            </div>
            <div className="stat">
              <div className="num">
                <span>4</span>
              </div>
              <div className="cap">Franchise Brands Owned</div>
            </div>
            <div className="stat">
              <div className="num">
                <em>PE</em>
              </div>
              <div className="cap">Private Equity Exit</div>
            </div>
            <div className="stat">
              <div className="num">
                <span>5.0</span>
                <span style={{ fontSize: ".55em" }}>★</span>
              </div>
              <div className="cap">Google Rating</div>
            </div>
          </div>
        </div>

        <section className="story">
          <div className="wrap story-grid">
            <div className="story-copy">
              <span className="eyebrow">Why work with me</span>
              <h2 className="fade-heading">
                I have sat on <span className="sage">your side</span> of the table.
              </h2>
              <p>
                Most franchise consultants have never signed a lease, made payroll on a slow month, or negotiated a
                multi-unit development agreement. I have done all three, many times over.
              </p>
              <p>
                I opened my first location in 2013. By 2017 I had scaled to 20 units across multiple states, and I went
                on to build and operate <strong>30 locations across four very different brands</strong> before selling
                to private equity.
              </p>
              <p>
                That experience changes the conversation. When we review an FDD together, you get an operator's read on
                Item 19, territory, labor model, and unit economics, not a sales pitch.{" "}
                <strong>If a concept is not right for you, I will tell you.</strong>
              </p>
            </div>
            <div className="brand-list" role="list">
              {[
                ["Boost Mobile", "Retail · Multi-State Scale"],
                ["Massage Envy", "Health & Wellness"],
                ["YogaSix", "Boutique Fitness"],
                ["Image Studios", "Salon Suites · Real Estate"],
              ].map(([name, role]) => (
                <div className="brand-row" role="listitem" key={name}>
                  <span className="b-name">{name}</span>
                  <span className="b-role">{role}</span>
                </div>
              ))}
              <div className="brand-row exit-row" role="listitem">
                <span className="b-name">Private Equity Exit</span>
                <span className="b-role">30 Locations Sold</span>
              </div>
            </div>
          </div>
        </section>

        <section id="process">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">The discovery process</span>
              <h2 className="fade-heading">
                Four phases. <span className="sage">Zero pressure.</span>
              </h2>
              <p>
                A structured path from first conversation to a confident yes or a confident no. Most clients move
                through it in 6 to 10 weeks.
              </p>
            </div>
            <div className="phases" ref={phasesRef}>
              <div className="phase-rail" aria-hidden="true">
                <span />
              </div>
              {phases.map((phase, index) => (
                <div className="phase" key={phase.title}>
                  <div className="ph-top">
                    <div className="ph-num">{index + 1}</div>
                    <span className="ph-icon">{phase.icon}</span>
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="reviews"
          id="reviews"
          onPointerEnter={() => setHoverPaused(true)}
          onPointerLeave={(event) => {
            if (!event.currentTarget.contains(document.activeElement)) setHoverPaused(false);
          }}
          onFocusCapture={() => setHoverPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoverPaused(false);
          }}
        >
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">From Google Reviews</span>
              <h2 className="fade-heading">
                Rated <span className="goldtext">{GOOGLE_REVIEW_RATING}</span> by the people who took the leap.
              </h2>
            </div>
            <div className="review-meta">
              <div className="big">{GOOGLE_REVIEW_RATING}</div>
              <div>
                <div className="stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <div className="sub">
                  Based on {GOOGLE_REVIEW_COUNT} Google reviews ·{" "}
                  <a
                    href="https://search.google.com/local/reviews?placeid=ChIJRbdi_zRz_ogR_IFxh2Ijx_g"
                    target="_blank"
                    rel="noopener"
                    style={{ color: "#9BD7B3", borderBottom: "1px solid rgba(155,215,179,.4)" }}
                  >
                    Read them all on Google
                  </a>
                  <br />
                  Charles Stovall, Your Franchise Friend
                </div>
              </div>
            </div>
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured Google reviews"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  stepReview(1);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  stepReview(-1);
                }
              }}
            >
              <div className="review-controls">
                <button type="button" onClick={() => stepReview(-1)} aria-label="Previous review">
                  Prev
                </button>
                <button type="button" onClick={() => stepReview(1)} aria-label="Next review">
                  Next
                </button>
                {reduced ? null : (
                  <button
                    type="button"
                    aria-pressed={userPaused}
                    onClick={() => setUserPaused((paused) => !paused)}
                  >
                    {userPaused ? "Play" : "Pause"}
                  </button>
                )}
                <span className="review-count">
                  {featured + 1} of {reviews.length}
                </span>
              </div>
              <div className="review-stage">
                <ReviewLayers active={featured} tone="feature" />
              </div>
              <div className="review-grid">
                {slots.map((slotIndex, slot) => (
                  <article className="review" key={slot} aria-label={`Review by ${reviews[slotIndex]?.author ?? ""}`}>
                    <ReviewLayers active={slotIndex} tone="card" />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Who this is for</span>
              <h2 className="fade-heading">
                Built for people making a <span className="sage">serious</span> investment.
              </h2>
              <p>
                This is not a directory or a lead form. It is a one-on-one advisory relationship for buyers who are
                ready to do real diligence.
              </p>
            </div>
            <div className="fit-grid">
              <FitCard
                chip="Corporate Escapee"
                title="Leaving the W-2 behind"
                image={fitCorporate}
                body="You have 15 to 25 years of executive experience and want to own your outcome. We focus on concepts where your leadership skills transfer and the model matches your risk tolerance."
              />
              <FitCard
                chip="Portfolio Investor"
                title="Diversifying your income"
                image={fitPortfolio}
                body="You want a cash-flowing asset alongside your market portfolio. We target semi-absentee and manager-run models with strong Item 19s and a path to multiple units."
              />
              <FitCard
                chip="Empire Builder"
                title="Going multi-unit from day one"
                image={fitEmpire}
                body="You are thinking in territories, not storefronts. Having scaled 1 location to 30, I will help you structure development agreements and avoid the mistakes that stall growth."
              />
            </div>
          </div>
        </section>

        <section className="partners" id="partners">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Good guidance includes the next step</span>
              <h2 className="fade-heading">
                Trusted <span className="sage">Referral Partners.</span>
              </h2>
              <p>
                Franchising is not the right answer for everyone. When a different kind of help is more useful, these
                are people and organizations I am glad to point you toward.
              </p>
            </div>
            <div className="partner-grid">
              <article className="partner-card">
                <span className="chip">Career transition</span>
                <h3>Franchising not the right fit? Let’s find your next direction.</h3>
                <p>
                  Your next chapter should fit your strengths, goals, and life. If business ownership isn’t your path, I
                  can connect you with professionals who can help you explore what comes next.
                </p>
                <div className="partner-name">Peter Sherer · Experience Matters</div>
                <p className="partner-detail">
                  Executive and senior-professional career-transition coaching to help clarify your strengths and next
                  steps.
                </p>
                <div className="partner-links">
                  <a href="mailto:peter@expmatters.com">Connect with Peter</a>
                  <a href="https://expmatters.com/" target="_blank" rel="noopener">
                    Visit Experience Matters
                  </a>
                </div>
              </article>
              <article className="partner-card">
                <span className="chip">Business funding</span>
                <h3>Ready for ownership? Explore your funding options.</h3>
                <p>
                  FranFund helps prospective business owners explore funding options as they consider a franchise or
                  other business opportunity.
                </p>
                <div className="partner-name">Tanielle Luepkes · FranFund</div>
                <p className="partner-detail">
                  Funding Consultant · <a href="tel:+18177304502">(817) 730-4502</a>
                </p>
                <div className="partner-links">
                  <a href="https://calendly.com/d/cvtm-4wx-bb8" target="_blank" rel="noopener">
                    Book a meeting
                  </a>
                  <a href="https://www.franfund.com/" target="_blank" rel="noopener">
                    Visit FranFund
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="final" id="book">
          <div className="wrap">
            <img className="shield-final" src={shield} alt="" aria-hidden="true" width={80} height={149} />
            <span className="eyebrow">The first step costs nothing</span>
            <h2 className="fade-heading">
              Find Your <span className="goldtext">Freedom.</span>
            </h2>
            <p>
              Book a free, no-obligation consultation. Worst case, you leave with a clearer picture of franchising.
              Best case, you find the business that changes your family's trajectory.
            </p>
            <a className="btn btn-gold" href={CALENDLY} target="_blank" rel="noopener">
              Book a Free Consultation
            </a>
            <div className="final-contact">
              <a href="tel:+19198273921">919.827.3921</a>
              <a href="mailto:charles@franchisefriend.net">charles@franchisefriend.net</a>
            </div>
            <SocialRow />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <div className="brand" style={{ gap: ".7rem" }}>
            <img className="shield" style={{ width: 26, height: "auto" }} src={shield} alt="" width={80} height={149} />
            <span className="brand-name">Charles Stovall</span>
          </div>
          <SocialRow compact />
          <nav className="foot-links" aria-label="Footer">
            {footerGroups.map((group) => (
              <div className="foot-group" key={group.label}>
                <span className="foot-label">{group.label}</span>
                {group.links.map(([href, label]) => (
                  <a href={href} key={href}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
          <div className="foot-note">
            © {new Date().getFullYear()} Charles Stovall · Your Franchise Friend · SC — USA
            <br />
            <span>Independent franchise consultant affiliated with FranChoice, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FitCard({ chip, title, body, image }: { chip: string; title: string; body: string; image: string }) {
  return (
    <div className="fit">
      <div className="fit-top">
        <span className="chip">{chip}</span>
        <span className="mini-arch">
          <img src={image} alt="" aria-hidden="true" width={300} height={380} />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function SocialRow({ compact = false }: { compact?: boolean }) {
  const className = compact ? "foot-socials" : "social-row";
  return (
    <div className={className}>
      <a href="https://www.linkedin.com/in/charles-stovall/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <IconLinkedIn />
      </a>
      <a href="https://www.instagram.com/thefranchisefriend/" target="_blank" rel="noopener" aria-label="Instagram">
        <IconInstagram />
      </a>
      <a href="https://x.com/chuckstovall" target="_blank" rel="noopener" aria-label="X (Twitter)">
        <IconX />
      </a>
      <a href="https://www.youtube.com/@thefranchisefriend" target="_blank" rel="noopener" aria-label="YouTube">
        <IconYouTube />
      </a>
      {compact ? null : (
        <>
          <a href="https://www.franchisefriend.net/podcast" target="_blank" rel="noopener" aria-label="Franchise Friend Podcast">
            <IconPodcast />
          </a>
          <a href="mailto:charles@franchisefriend.net" aria-label="Email">
            <IconMail />
          </a>
        </>
      )}
    </div>
  );
}

function svgProps(props?: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return { viewBox: "0 0 24 24", width: 22, height: 22, fill: "none", "aria-hidden": true, ...props };
}

function IconPhone() {
  return (
    <svg {...svgProps({ stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M7 3.5h2.2l1.2 3-1.7 1a11 11 0 0 0 5.8 5.8l1-1.7 3 1.2V15a2 2 0 0 1-2.2 2A13.5 13.5 0 0 1 5 8.7 2 2 0 0 1 7 3.5z" />
    </svg>
  );
}

function IconPerson() {
  return (
    <svg {...svgProps({ stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" })}>
      <circle cx="12" cy="8" r="3.1" />
      <path d="M5.5 19.2c1.2-3 3.4-4.4 6.5-4.4s5.3 1.4 6.5 4.4" />
    </svg>
  );
}

function IconColumns() {
  return (
    <svg {...svgProps({ stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" })}>
      <rect x="3.5" y="4.5" width="7" height="15" rx="1.4" />
      <rect x="13.5" y="4.5" width="7" height="15" rx="1.4" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg {...svgProps({ stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" })}>
      <circle cx="10.5" cy="10.5" r="5.2" />
      <path d="M14.4 14.4 19 19" />
      <path d="M8.4 10.5h4.2" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.11-4 0v5.6h-3v-11h3v1.77c1.4-2.59 7-2.78 7 2.48v6.75z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zm0-2.16c-3.26 0-3.67.01-4.95.07-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.13 1.38-.66.67-1.07 1.34-1.38 2.13-.3.76-.5 1.63-.56 2.91-.06 1.28-.07 1.69-.07 4.95s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13-.67-.66-1.34-1.07-2.13-1.38-.76-.3-1.63-.5-2.91-.56-1.28-.06-1.69-.07-4.95-.07zm0 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16 6.16-2.76 6.16-6.16-2.76-6.16-6.16-6.16zm0 10.16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.84-10.4c0 .8-.64 1.44-1.44 1.44s-1.44-.64-1.44-1.44.64-1.44 1.44-1.44 1.44.64 1.44 1.44z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817h-3.31l7.73-8.835-8.156-10.665h6.826l4.713 6.231zm-1.161 17.52h1.833l-11.83-15.644h-1.967z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

function IconPodcast() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-7H5a7 7 0 1 1 14 0h-2v7h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9zm-4 10h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H8zm8 0h-1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1zM11 19h2v3a8.9 8.9 0 0 1-2 0z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
