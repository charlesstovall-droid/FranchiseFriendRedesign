import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { absoluteUrl } from "@shared/site";
import { Compass, Landmark, Scale } from "lucide-react";
import {
  trustedPartnerSteps,
  trustedPartnersJsonLd,
  trustedPartnersPage,
  type TrustedPartner,
} from "@shared/trusted-partners";
import "./trusted-partners.css";

const stepIcons = {
  funding: Landmark,
  "financial-planning": Compass,
  "franchise-attorneys": Scale,
} as const;

function PartnerMark({ partner }: { partner: TrustedPartner }) {
  const plate = partner.logo.plate === "navy" ? "is-navy" : "is-ivory";

  return (
    <div className="partner-mark">
      <span className={`partner-plate ${plate}`}>
        <img
          src={partner.logo.src}
          alt={partner.logo.alt}
          width={partner.logo.width}
          height={partner.logo.height}
          data-logo={partner.id}
          className="partner-logo"
        />
      </span>
    </div>
  );
}

function PartnerPerson({ partner }: { partner: TrustedPartner }) {
  if (!partner.person) return null;

  return (
    <div className="partner-person">
      {partner.headshot ? (
        <span className="partner-headshot" data-person={partner.id}>
          <img
            src={partner.headshot.src}
            alt={partner.headshot.alt}
            width={partner.headshot.width}
            height={partner.headshot.height}
          />
        </span>
      ) : null}
      <p className="partner-person-copy">
        <span className="partner-person-name">{partner.person}</span>
        {partner.role ? <span className="partner-person-role"> · {partner.role}</span> : null}
      </p>
    </div>
  );
}

function PartnerVisit({ partner }: { partner: TrustedPartner }) {
  return (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="partner-visit">
      Visit {partner.firm}
      <span aria-hidden="true">→</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function PartnerEntry({ partner, solo }: { partner: TrustedPartner; solo: boolean }) {
  if (solo) {
    return (
      <article className="partner-entry is-solo" id={partner.id}>
        <PartnerMark partner={partner} />
        <span className="partner-rule" aria-hidden="true" />
        <div className="partner-solo-body">
          <div className="partner-identity">
            <h3>{partner.firm}</h3>
            <PartnerPerson partner={partner} />
          </div>
          <div className="partner-aside">
            <p className="partner-description">
              {partner.description[0]} {partner.description[1]}
            </p>
            <PartnerVisit partner={partner} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="partner-entry" id={partner.id}>
      <PartnerMark partner={partner} />
      <span className="partner-rule" aria-hidden="true" />
      <h3>{partner.firm}</h3>
      <PartnerPerson partner={partner} />
      <p className="partner-description">
        {partner.description[0]} {partner.description[1]}
      </p>
      <PartnerVisit partner={partner} />
    </article>
  );
}

function TeamLogo({ partner }: { partner: TrustedPartner }) {
  const plate = partner.logo.plate === "navy" ? "is-navy" : "is-ivory";

  return (
    <a href={`#${partner.id}`} className={plate} data-logo={partner.id}>
      <img
        src={partner.logo.src}
        alt={partner.firm}
        width={partner.logo.width}
        height={partner.logo.height}
        data-logo={partner.id}
      />
    </a>
  );
}

export default function TrustedPartners() {
  const page = trustedPartnersPage;
  const teamSections = trustedPartnerSteps
    .map((step) => {
      const section = page.sections.find((item) => item.id === step.id);
      return section ? { step, section } : null;
    })
    .filter((item): item is { step: (typeof trustedPartnerSteps)[number]; section: (typeof page.sections)[number] } => item !== null);

  return (
    <div className="trusted-partners-page">
      <SEO
        title={page.title}
        description={page.description}
        canonicalUrl={absoluteUrl(page.path)}
        schema={trustedPartnersJsonLd()}
      />
      <Navbar />
      <div className="trusted-fade">
        <header className="tp-hero">
          <div className="tp-wrap tp-hero-grid">
            <div>
              <p className="tp-kicker">Partners I trust</p>
              <h1>{page.h1}</h1>
              <div className="tp-subhead">
                {page.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <aside className="tp-team" aria-label="Your team">
              <div className="tp-operator">
                <img
                  src="/charles-homepage-portrait.jpg"
                  alt="Charles Stovall"
                  width={1201}
                  height={1600}
                />
                <p>
                  <span className="tp-operator-kicker">Your operator</span>
                  <strong>Charles Stovall</strong>
                </p>
              </div>
              <div className="tp-team-groups">
                {teamSections.map(({ step, section }) => (
                  <div className="tp-team-group" key={step.id}>
                    <a className="tp-role" href={`#${section.id}`}>
                      {step.role}
                    </a>
                    <div className="tp-team-logos">
                      {section.partners.map((partner) => (
                        <TeamLogo key={partner.id} partner={partner} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </header>

        <nav className="tp-steps" aria-label="Partner roles">
          <div className="tp-wrap tp-step-row">
            {trustedPartnerSteps.map((step) => {
              const Icon = stepIcons[step.id];
              return (
                <a className="tp-step" href={`#${step.id}`} key={step.id}>
                  <span className="tp-step-icon">
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="tp-step-label">{step.label}</span>
                </a>
              );
            })}
          </div>
        </nav>

        <main>
          {page.sections.map((section) => {
            const solo = section.partners.length === 1;
            return (
              <section
                key={section.id}
                id={section.id}
                className={solo ? "partner-section is-single" : "partner-section"}
              >
                <div className="tp-wrap">
                  <div className="partner-section-head">
                    <h2>{section.title}</h2>
                    <p>{section.lead}</p>
                  </div>
                  <div className={solo ? "partner-list is-solo" : "partner-list"}>
                    {section.partners.map((partner) => (
                      <PartnerEntry key={partner.id} partner={partner} solo={solo} />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          <div className="tp-wrap tp-footnote-wrap">
            <p className="tp-footnote">{page.footnote}</p>
          </div>

          <section className="tp-questions">
            <div className="tp-wrap">
              <h2>{page.questionsTitle}</h2>
              <ul>
                {page.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="tp-reading">
            <div className="tp-wrap">
              <h2>{page.readingTitle}</h2>
              <ul>
                {page.reading.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="tp-cta">
            <div className="tp-wrap">
              <h2>{page.ctaHeading}</h2>
              <p>{page.ctaBody}</p>
              <p>
                <a href={page.ctaHref} target="_blank" rel="noopener noreferrer" className="tp-button">
                  {page.ctaLabel}
                </a>
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
