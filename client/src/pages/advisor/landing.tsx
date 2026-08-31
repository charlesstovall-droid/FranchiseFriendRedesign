import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DEFAULT_ADVISOR_COPY } from "@shared/advisor-copy";
import { AdvisorShell } from "@/components/advisor/AdvisorShell";
import { SEO } from "@/components/SEO";
import { advisorJson } from "@/lib/advisor-api";

export default function AdvisorLanding() {
  const [, setLocation] = useLocation();
  const [copy, setCopy] = useState(DEFAULT_ADVISOR_COPY);
  const [configured, setConfigured] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    advisorJson<{ configured: boolean; copy: typeof DEFAULT_ADVISOR_COPY }>("/api/advisor/status")
      .then((data) => {
        if (data.copy) setCopy(data.copy);
        setConfigured(data.configured);
      })
      .catch(() => undefined);
  }, []);

  const start = async () => {
    setStarting(true);
    setError("");
    try {
      await advisorJson("/api/advisor/conversations", { method: "POST" });
      setLocation("/advisor/conversation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start.");
      setStarting(false);
    }
  };

  return (
    <AdvisorShell
      right={
        <a href="/" className="text-[11px] uppercase tracking-[0.16em] text-[#12304C]/70 hover:text-[#12304C]">
          Franchise Friend
        </a>
      }
    >
      <SEO
        title="Ownership Advisor | Franchise Friend with Charles Stovall"
        description={copy.landingSupport}
        canonicalUrl="https://www.charlesstovall.com/advisor"
      />
      <section className="max-w-5xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#12304C]/60 mb-6">Ownership Advisor</p>
        <h1 className="advisor-display text-4xl md:text-6xl leading-[1.12] max-w-4xl">
          {copy.landingHero}
        </h1>
        <p className="mt-8 max-w-2xl text-lg md:text-xl leading-8 text-[#12304C]/85">
          {copy.landingSupport}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <button
            type="button"
            onClick={start}
            disabled={starting}
            className="inline-flex items-center justify-center bg-[#F2C740] text-[#12304C] px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-[#e3b833] disabled:opacity-60"
          >
            {starting ? "Opening the conversation" : copy.landingCta}
          </button>
          <p className="text-sm leading-6 text-[#12304C]/70 max-w-md">{copy.landingNearCta}</p>
        </div>
        {!configured ? (
          <p className="mt-6 text-sm border border-[#12304C]/20 px-4 py-3 max-w-xl">{copy.unconfiguredMessage}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-[#8a2b2b]">{error}</p> : null}

        <div className="mt-20 grid md:grid-cols-[1fr_1.3fr] gap-12 border-t border-[var(--advisor-line)] pt-12">
          <div>
            <h2 className="advisor-display text-3xl">{copy.whatYoullReceiveTitle}</h2>
          </div>
          <ol className="space-y-0">
            {copy.whatYoullReceive.map((item, i) => (
              <li key={item} className="flex gap-5 py-4 border-b border-[var(--advisor-line)]">
                <span className="text-[11px] tracking-[0.16em] uppercase text-[#12304C]/50 pt-1">0{i + 1}</span>
                <span className="text-lg leading-7">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-16 text-sm leading-7 text-[#12304C]/65 max-w-3xl">{copy.disclosure}</p>
      </section>
    </AdvisorShell>
  );
}
