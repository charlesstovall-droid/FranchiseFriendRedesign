import { useState } from "react";
import { useLocation } from "wouter";
import { Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackConversion } from "@/lib/analytics";
import { absoluteUrl } from "@shared/site";
import { NAP } from "@shared/nap";
import {
  localMarketJsonLd,
  type Inline,
  type LocalMarketPage,
} from "@shared/local-markets";
import portrait from "@assets/ImageStudios_KDP-3_websize_1775530552090.jpg";

function RichText({ parts, className }: { parts: Inline[]; className?: string }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index} className={className}>
            {part}
          </span>
        ) : (
          <a
            key={index}
            href={part.href}
            className="underline font-semibold underline-offset-4 hover:text-[#c9a84c]"
            {...(part.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {part.text}
          </a>
        ),
      )}
    </>
  );
}

export default function LocalMarketLanding({ page }: { page: LocalMarketPage }) {
  const [, setLocation] = useLocation();
  const formId = `${page.path.slice(1)}-consultation-form`;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    liquidCapital: "",
    timeline: "",
    area: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const messageParts = [page.message];
      if (formData.area) messageParts.push(`Area: ${formData.area}`);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          liquidCapital: formData.liquidCapital || undefined,
          timeline: formData.timeline || undefined,
          message: messageParts.join(" — "),
          leadType: page.leadType,
        }),
      });
      if (!res.ok) {
        throw new Error("Submission failed");
      }
      trackConversion(page.leadType);
      setLocation("/thank-you-ad");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Call (919) 827-3921 or try again.");
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById(formId)?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionTone = (index: number) =>
    index % 2 === 0
      ? "bg-[#F7F4EC] text-[#0A1F3C]"
      : "bg-[#0A1F3C] text-[#F7F4EC]";

  return (
    <div className="min-h-screen bg-[#0A1F3C] text-[#F7F4EC]">
      <SEO
        title={page.title}
        description={page.description}
        canonicalUrl={absoluteUrl(page.path)}
        schema={localMarketJsonLd(page)}
      />

      <section className="relative overflow-hidden bg-[#0A1F3C]">
        <header className="relative z-10 flex items-center justify-between gap-4 px-5 md:px-10 pt-5 md:pt-7">
          <a href="/" className="flex items-center gap-4">
            <img
              src="/cs-shield-logo.png"
              alt="Charles Stovall"
              className="h-24 w-24 md:h-32 md:w-32 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            />
            <span className="sr-only">Charles Stovall</span>
          </a>
          <div className="flex items-center gap-5 text-sm">
            <a
              href="tel:9198273921"
              className="inline-flex items-center gap-2 text-[#F7F4EC]/90 hover:text-[#c9a84c]"
            >
              <Phone size={16} />
              <span className="hidden sm:inline">(919) 827-3921</span>
            </a>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a84c] hover:text-[#e0c56a] font-semibold"
            >
              Book a call
            </a>
          </div>
        </header>

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-8">
          <div className="grid md:grid-cols-[minmax(0,1fr)_19rem] lg:grid-cols-[minmax(0,1fr)_21rem] gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-[#c9a84c] text-[11px] font-semibold tracking-[0.28em] uppercase mb-6">
                {page.kicker}
              </p>
              <h1 className="font-serif text-[2.6rem] sm:text-5xl lg:text-[64px] font-bold leading-[1.04] text-[#F7F4EC] max-w-3xl mb-6">
                {page.h1}
                <span className="block text-[#F7F4EC]/80">{page.h1Sub}</span>
              </h1>
              {page.lede.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? "text-lg md:text-xl text-[#F7F4EC]/80 leading-relaxed max-w-xl mb-4"
                      : "text-base text-[#F7F4EC]/60 leading-relaxed max-w-xl mb-8"
                  }
                >
                  <RichText parts={paragraph} />
                </p>
              ))}
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#F7F4EC]/45 mb-2 md:mb-0">
                {page.proof}
              </p>
            </div>
            <figure className="w-[15rem] sm:w-[17rem] md:w-full justify-self-start md:justify-self-end shrink-0">
              <img
                src={portrait}
                alt={page.portraitAlt}
                className="w-full aspect-[3/4] object-cover object-top shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
              />
            </figure>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pb-14">
          <div className="bg-[#F7F4EC] text-[#1a2332] p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">{page.formHeading}</h2>
                <p className="text-sm text-[#1a2332]/60 mt-1">{page.formNote}</p>
              </div>
              <p className="text-xs text-[#1a2332]/45">
                Or{" "}
                <a
                  href="https://calendly.com/charles-stovall/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-[#0A1F3C]"
                >
                  book a time on Calendly
                </a>
                .
              </p>
            </div>
            <form
              id={formId}
              action="/api/leads"
              method="POST"
              onSubmit={handleSubmit}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <label className="block text-xs font-semibold">
                First name
                <input
                  type="text"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                />
              </label>
              <label className="block text-xs font-semibold">
                Last name
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                />
              </label>
              <label className="block text-xs font-semibold">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                />
              </label>
              <label className="block text-xs font-semibold">
                Phone
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                />
              </label>
              <label className="block text-xs font-semibold">
                Liquid capital
                <select
                  name="liquidCapital"
                  value={formData.liquidCapital}
                  onChange={(e) => setFormData({ ...formData, liquidCapital: e.target.value })}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                >
                  <option value="">Select range</option>
                  <option value="Under $50K">Under $50K</option>
                  <option value="$50K–$150K">$50K–$150K</option>
                  <option value="$150K–$500K">$150K–$500K</option>
                  <option value="$500K+">$500K+</option>
                </select>
              </label>
              <label className="block text-xs font-semibold">
                Timeline
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                >
                  <option value="">Select timeline</option>
                  <option value="0–3 months">0–3 months</option>
                  <option value="3–6 months">3–6 months</option>
                  <option value="6–12 months">6–12 months</option>
                  <option value="Just exploring">Just exploring</option>
                </select>
              </label>
              <label className="block text-xs font-semibold sm:col-span-2 lg:col-span-1">
                Neighborhood
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder={page.areaPlaceholder}
                  className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                />
              </label>
              <input type="hidden" name="leadType" value={page.leadType} />
              <input type="hidden" name="message" value={page.message} />
              <div className="flex flex-col justify-end">
                {error && <p className="text-sm text-red-700 mb-2">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#0A1F3C] hover:bg-[#122c54] text-[#F7F4EC] font-bold disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : "Request the call"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {page.sections.map((section, index) => {
        const light = index % 2 === 0;
        return (
          <section key={section.heading} className={`${sectionTone(index)} py-20 md:py-24`}>
            <div className="max-w-3xl mx-auto px-5 md:px-10">
              {section.kicker && (
                <p
                  className={`text-[11px] font-semibold tracking-[0.24em] uppercase mb-4 ${
                    light ? "text-[#0A1F3C]/45" : "text-[#c9a84c]"
                  }`}
                >
                  {section.kicker}
                </p>
              )}
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraphIndex}
                  className={`leading-relaxed mb-4 ${light ? "text-[#0A1F3C]/70" : "text-[#F7F4EC]/70"}`}
                >
                  <RichText parts={paragraph} />
                </p>
              ))}
            </div>
          </section>
        );
      })}

      <section className="bg-[#081628] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-14">{page.stepsHeading}</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {page.steps.map((step) => (
              <div key={step.num}>
                <p className="text-[#c9a84c] font-serif text-sm tracking-[0.2em] mb-3">{step.num}</p>
                <h3 className="font-serif text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-[#F7F4EC]/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F4EC] text-[#0A1F3C] py-20 md:py-24 border-t border-[#0A1F3C]/10">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10">{page.faqHeading}</h2>
          <dl className="space-y-8">
            {page.faqs.map((item) => (
              <div key={item.id}>
                <dt className="font-serif text-xl font-bold mb-2">{item.question}</dt>
                <dd className="text-[#0A1F3C]/70 leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-[#F7F4EC] text-[#0A1F3C] pb-20">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <h2 className="font-serif text-2xl font-bold mb-4">Sources</h2>
          <p className="text-sm text-[#0A1F3C]/70 leading-relaxed mb-4">{page.sourcesIntro}</p>
          <ul className="space-y-2 text-sm">
            {page.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-[#c9a84c]"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 bg-[#0A1F3C] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{page.ctaHeading}</h2>
          <p className="text-[#F7F4EC]/65 mb-8 leading-relaxed">{page.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center bg-[#c9a84c] text-[#0A1F3C] font-bold px-8 py-4 hover:bg-[#b8953f]"
            >
              Request the call
            </button>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[#F7F4EC]/25 px-8 py-4 hover:bg-white/5"
            >
              Book a call
            </a>
          </div>
        </div>
      </section>

      <footer className="px-5 md:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[#F7F4EC]/45 text-sm">
        <div className="flex items-center gap-3">
          <img src="/cs-shield-logo.png" alt="" className="h-7 w-7 object-contain" />
          <p>
            Charles Stovall Your Franchise Friend · {NAP.streetAddress}, {NAP.addressLocality}, {NAP.addressRegion}{" "}
            {NAP.postalCode}
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href="tel:9198273921" className="hover:text-[#c9a84c]">
            (919) 827-3921
          </a>
          <a href="/charleston" className="hover:text-[#c9a84c]">
            Charleston
          </a>
          <a href="/mount-pleasant" className="hover:text-[#c9a84c]">
            Mount Pleasant
          </a>
          <a href="/south-carolina" className="hover:text-[#c9a84c]">
            South Carolina
          </a>
          <a href="/" className="hover:text-[#c9a84c]">
            Main site
          </a>
        </div>
      </footer>
    </div>
  );
}
