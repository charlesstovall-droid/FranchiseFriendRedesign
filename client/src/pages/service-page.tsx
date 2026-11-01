import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { absoluteUrl } from "@shared/site";
import { NAP } from "@shared/nap";
import { faqPageSchema } from "@shared/faq";
import { CONSULT_CALENDLY, getServicePage, type Inline, type ServicePage } from "@shared/services";

function Rich({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <a
            key={index}
            href={part.href}
            className="font-semibold underline decoration-[#9BD7B3] underline-offset-4"
          >
            {part.text}
          </a>
        ),
      )}
    </>
  );
}

export function BuyAFranchisePage() {
  const page = getServicePage("/buy-a-franchise");
  return page ? <ServiceArticle page={page} /> : null;
}

export function SemiAbsenteeConsultantPage() {
  const page = getServicePage("/semi-absentee-franchise-consultant");
  return page ? <ServiceArticle page={page} /> : null;
}

function ServiceArticle({ page }: { page: ServicePage }) {
  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#12304C]">
      <SEO
        title={page.title}
        description={page.description}
        canonicalUrl={absoluteUrl(page.path)}
        schema={faqPageSchema(page.faqs)}
      />
      <Navbar />
      <article className="container mx-auto px-4 md:px-6 max-w-3xl pt-40 pb-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">{page.h1}</h1>
        <div className="space-y-5 text-lg leading-8">
          {page.answer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            <Rich parts={page.bridge} />
          </p>
        </div>
        <p className="mt-8">
          <a
            href={CONSULT_CALENDLY}
            className="inline-flex bg-[#F2C740] text-[#12304C] font-semibold px-6 py-3 rounded-full"
          >
            Book a consult
          </a>
        </p>

        <h2 className="font-serif text-2xl font-bold mt-14 mb-4">{page.checklistTitle}</h2>
        <ul className="space-y-3">
          {page.checklist.map((item) => (
            <li key={item} className="flex gap-3 leading-7">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#9BD7B3]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-serif text-2xl font-bold mt-14 mb-6">FAQ</h2>
        <dl className="space-y-6">
          {page.faqs.map((item) => (
            <div key={item.question}>
              <dt className="font-serif text-xl font-bold mb-2">{item.question}</dt>
              <dd className="leading-7 text-[#12304C]/85">{item.answer}</dd>
            </div>
          ))}
        </dl>

        <h2 className="font-serif text-2xl font-bold mt-14 mb-4">Keep going</h2>
        <ul className="space-y-2">
          {page.related.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="font-semibold underline decoration-[#9BD7B3] underline-offset-4">
                {link.text}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <a
            href={CONSULT_CALENDLY}
            className="inline-flex bg-[#12304C] text-[#F4ECE1] font-semibold px-6 py-3 rounded-full"
          >
            Book a consult
          </a>
        </p>

        <address className="mt-12 not-italic text-sm leading-6 text-[#12304C]/80">
          <p>{NAP.name}</p>
          <p>{NAP.streetAddress}</p>
          <p>
            {NAP.addressLocality}, {NAP.addressRegion} {NAP.postalCode}
          </p>
          <p>
            <a href="tel:9198273921" className="underline underline-offset-4">
              {NAP.telephoneDisplay}
            </a>
          </p>
        </address>
      </article>
      <Footer />
    </div>
  );
}
