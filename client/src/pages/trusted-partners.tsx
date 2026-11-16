import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { absoluteUrl } from "@shared/site";
import {
  trustedPartnersJsonLd,
  trustedPartnersPage,
  type TrustedPartner,
} from "@shared/trusted-partners";

function PartnerCard({ partner }: { partner: TrustedPartner }) {
  const logoPlate =
    partner.logo.plate === "navy"
      ? "bg-[#12304C] px-4 py-3"
      : "bg-white px-1 py-1";

  return (
    <article className="flex h-full flex-col border border-[#12304C]/12 bg-white p-6 md:p-7">
      <div className={`mb-6 flex h-20 items-center ${logoPlate}`}>
        <img
          src={partner.logo.src}
          alt={partner.logo.alt}
          width={partner.logo.width}
          height={partner.logo.height}
          className="max-h-16 w-auto max-w-full object-contain object-left"
        />
      </div>

      {partner.headshot ? (
        <div className="mb-5">
          <img
            src={partner.headshot.src}
            alt={partner.headshot.alt}
            width={partner.headshot.width}
            height={partner.headshot.height}
            className={
              partner.headshot.frame === "avatar"
                ? "h-24 w-24 rounded-full object-cover"
                : "h-44 w-auto max-w-[9rem] object-contain object-bottom"
            }
          />
        </div>
      ) : null}

      <h3 className="font-serif text-2xl font-bold text-[#12304C]">{partner.firm}</h3>
      {partner.person ? (
        <p className="mt-1 text-sm font-semibold tracking-wide text-[#12304C]/75">
          {partner.person}
          {partner.role ? <span className="font-normal"> · {partner.role}</span> : null}
        </p>
      ) : null}
      <p className="mt-4 flex-1 leading-7 text-[#12304C]/90">
        {partner.description[0]} {partner.description[1]}
      </p>
      <p className="mt-6">
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#12304C] underline decoration-[#9BD7B3] underline-offset-4 hover:decoration-[#F2C740]"
        >
          Visit {partner.firm}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </article>
  );
}

export default function TrustedPartners() {
  const page = trustedPartnersPage;

  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#12304C]">
      <SEO
        title={page.title}
        description={page.description}
        canonicalUrl={absoluteUrl(page.path)}
        schema={trustedPartnersJsonLd()}
      />
      <Navbar />
      <header className="bg-[#12304C] pb-14 pt-40 text-[#F4ECE1]">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[#F2C740]">Partners I trust</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-5xl">{page.h1}</h1>
        </div>
      </header>

      <main className="trusted-fade container mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="max-w-3xl space-y-5 text-lg leading-8">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="mt-14">
            <h2 className="font-serif text-3xl font-bold">{section.title}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#12304C]/85">{section.lead}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {section.partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-10 max-w-3xl border-t border-[#12304C]/15 pt-6 text-sm leading-6 text-[#12304C]/70">
          {page.footnote}
        </p>

        <section className="mt-14 max-w-3xl">
          <h2 className="font-serif text-2xl font-bold">{page.questionsTitle}</h2>
          <ul className="mt-5 space-y-3">
            {page.questions.map((question) => (
              <li key={question} className="flex gap-3 leading-7">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#9BD7B3]" aria-hidden="true" />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="font-serif text-2xl font-bold">{page.readingTitle}</h2>
          <ul className="mt-4 space-y-2 leading-7">
            {page.reading.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-semibold underline decoration-[#9BD7B3] underline-offset-4 hover:decoration-[#F2C740]"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 max-w-3xl bg-[#12304C] p-8 text-[#F4ECE1] md:p-10">
          <h2 className="font-serif text-2xl font-bold">{page.ctaHeading}</h2>
          <p className="mt-4 leading-8 text-[#F4ECE1]/90">{page.ctaBody}</p>
          <p className="mt-6">
            <a
              href={page.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#F2C740] px-6 py-3 font-semibold text-[#12304C] hover:bg-[#e3b833]"
            >
              {page.ctaLabel}
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
