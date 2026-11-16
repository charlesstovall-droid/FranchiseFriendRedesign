import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { absoluteUrl } from "@shared/site";
import {
  trustedPartnersJsonLd,
  trustedPartnersPage,
  type TrustedPartner,
} from "@shared/trusted-partners";
import "./trusted-partners.css";

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
      <article className="partner-entry is-solo">
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
    <article className="partner-entry">
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

export default function TrustedPartners() {
  const page = trustedPartnersPage;

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
          <div className="tp-wrap">
            <p className="tp-kicker">Partners I trust</p>
            <h1>{page.h1}</h1>
          </div>
        </header>

        <main>
          <div className="tp-wrap">
            <div className="tp-intro">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

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
