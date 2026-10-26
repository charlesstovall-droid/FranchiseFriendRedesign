import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { absoluteUrl } from "@shared/site";
import { faqPageSchema } from "@shared/faq";
import {
  getQuestionBySlug,
  questionIndex,
  questionPages,
  type Inline,
  type QuestionPage as QuestionPageData,
} from "@shared/questions";
import NotFound from "@/pages/not-found";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

function Rich({ parts, tone = "ink" }: { parts: Inline[]; tone?: "ink" | "cream" }) {
  const className =
    tone === "cream"
      ? "font-semibold text-[#F2C740] underline decoration-[#9BD7B3] underline-offset-4 hover:text-[#F4ECE1]"
      : "font-semibold text-[#12304C] underline decoration-[#9BD7B3] underline-offset-4 hover:decoration-[#F2C740]";
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <a
            key={index}
            href={part.href}
            className={className}
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

function articleSchema(page: QuestionPageData) {
  const canonical = absoluteUrl(page.path);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      author: { "@id": "https://www.charlesstovall.com/#person" },
      publisher: { "@id": "https://www.charlesstovall.com/#organization" },
      mainEntityOfPage: canonical,
      url: canonical,
      inLanguage: "en-US",
    },
    faqPageSchema(page.faqs),
  ];
}

export function QuestionPage() {
  const [, params] = useRoute("/questions/:slug");
  const page = params?.slug ? getQuestionBySlug(params.slug) : undefined;

  if (!page) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#12304C]">
      <SEO
        title={page.title}
        description={page.description}
        canonicalUrl={absoluteUrl(page.path)}
        type="article"
        schema={articleSchema(page)}
      />
      <Navbar />
      <header className="pt-40 pb-14 bg-[#12304C] text-[#F4ECE1]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <a href="/questions" className="text-xs uppercase tracking-[0.18em] text-[#F2C740] hover:text-[#F4ECE1]">
            Buyer questions
          </a>
          <h1 className="mt-4 text-4xl md:text-5xl font-serif font-bold leading-tight">{page.h1}</h1>
        </div>
      </header>
      <motion.article {...fade} className="container mx-auto px-4 md:px-6 max-w-3xl py-12" data-testid="question-article">
        <div className="space-y-5 text-lg leading-8 border-l-4 border-[#9BD7B3] pl-5">
          {page.lede.map((paragraph, index) => (
            <p key={index}>
              <Rich parts={paragraph} />
            </p>
          ))}
        </div>

        {page.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="font-serif text-2xl font-bold mb-4">{section.heading}</h2>
            <div className="space-y-4 leading-8 text-[#12304C]/90">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  <Rich parts={paragraph} />
                </p>
              ))}
            </div>
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {section.bullets.map((item) => (
                  <li key={item} className="flex gap-3 leading-7">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#9BD7B3]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="mt-14" data-testid="question-faq">
          <h2 className="font-serif text-2xl font-bold mb-4">FAQ</h2>
          <dl className="divide-y divide-[#12304C]/15 border-y border-[#12304C]/15">
            {page.faqs.map((item) => (
              <div key={item.question} className="py-5">
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-2 leading-7 text-[#12304C]/90">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {page.sources.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold mb-4">Sources</h2>
            <ul className="space-y-2 leading-7">
              {page.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#9BD7B3] underline-offset-4 hover:decoration-[#F2C740]"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold mb-4">Keep reading</h2>
          <ul className="space-y-2 leading-7">
            {page.related.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="underline decoration-[#9BD7B3] underline-offset-4 hover:decoration-[#F2C740]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 bg-[#12304C] text-[#F4ECE1] p-8 md:p-10">
          <h2 className="font-serif text-2xl font-bold">{page.ctaHeading}</h2>
          <p className="mt-4 leading-8 text-[#F4ECE1]/90">
            <Rich parts={page.ctaBody} tone="cream" />
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#F2C740] text-[#12304C] px-6 py-3 font-semibold hover:bg-[#e3b833]"
            >
              Book a call
            </a>
            <a
              href="/advisor"
              className="inline-flex items-center justify-center border border-[#9BD7B3] text-[#F4ECE1] px-6 py-3 font-semibold hover:bg-[#9BD7B3]/10"
            >
              Try the advisor
            </a>
          </div>
        </section>
      </motion.article>
      <Footer />
    </div>
  );
}

export default function QuestionsIndex() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: questionIndex.h1,
    itemListElement: questionPages.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.h1,
      url: absoluteUrl(page.path),
    })),
  };

  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#12304C]">
      <SEO
        title={questionIndex.title}
        description={questionIndex.description}
        canonicalUrl={absoluteUrl(questionIndex.path)}
        schema={listSchema}
      />
      <Navbar />
      <header className="pt-40 pb-14 bg-[#12304C] text-[#F4ECE1]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[#F2C740]">Charles Stovall · Your Franchise Friend</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-serif font-bold leading-tight">{questionIndex.h1}</h1>
        </div>
      </header>
      <motion.main {...fade} className="container mx-auto px-4 md:px-6 max-w-3xl py-12">
        <div className="space-y-5 text-lg leading-8">
          {questionIndex.lede.map((paragraph, index) => (
            <p key={index}>
              <Rich parts={paragraph} />
            </p>
          ))}
        </div>
        <ul className="mt-12 divide-y divide-[#12304C]/15 border-y border-[#12304C]/15">
          {questionPages.map((page) => (
            <li key={page.path} className="py-7">
              <a href={page.path} className="group" data-testid={`link-${page.slug}`}>
                <h2 className="font-serif text-2xl font-bold group-hover:underline decoration-[#F2C740] underline-offset-4">
                  {page.h1}
                </h2>
              </a>
              <p className="mt-3 leading-7 text-[#12304C]/85">
                <Rich parts={page.lede[0]} />
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href="https://calendly.com/charles-stovall/intro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#F2C740] text-[#12304C] px-6 py-3 font-semibold hover:bg-[#e3b833]"
          >
            Book a call
          </a>
          <a
            href="/advisor"
            className="inline-flex items-center justify-center border border-[#12304C] px-6 py-3 font-semibold hover:bg-[#12304C]/5"
          >
            Try the advisor
          </a>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
