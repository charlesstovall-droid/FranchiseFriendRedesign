import { useState } from "react";
import { useLocation } from "wouter";
import { Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackConversion } from "@/lib/analytics";
import { absoluteUrl } from "@shared/site";
import heroPhoto from "@assets/IMG_2636_1763927193167.jpeg";

export default function ExecutiveLanding() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: "Executive Access — Franchise Assessment",
          leadType: "executive-ad",
        }),
      });
      if (!res.ok) {
        throw new Error("Submission failed");
      }
      trackConversion("executive-ad");
      setLocation("/thank-you-ad");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Call (919) 827-3921 or try again.");
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("executive-assessment-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A1F3C] text-[#F7F4EC]">
      <SEO
        title="Executive Access | Semi-Absentee Franchise Opportunities for Executives | Charles Stovall"
        description="Charles Stovall helps executives in Charleston and nationwide match capital to a franchise model they can run without leaving the W-2. Assessment, FDD review, Item 19."
        canonicalUrl={absoluteUrl("/executive-access")}
      />

      <section className="relative min-h-screen overflow-hidden">
        <img
          src={heroPhoto}
          alt="Charles Stovall, franchise consultant in Charleston and Mt. Pleasant, SC"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-[72%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F3C]/92 via-[#0A1F3C]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F3C]/70 via-transparent to-[#0A1F3C]/25" />

        <header className="relative z-10 flex items-center justify-between gap-4 px-5 md:px-10 pt-6">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/cs-shield-logo.png"
              alt="Charles Stovall"
              className="h-11 w-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            />
            <span className="sr-only">Charles Stovall</span>
          </a>
          <div className="flex items-center gap-5 text-sm">
            <a
              href="tel:9198273921"
              className="inline-flex items-center gap-2 text-[#F7F4EC]/90 hover:text-[#c9a84c]"
              data-testid="button-call-top"
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

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-16 grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] gap-10 lg:gap-16 items-end min-h-[calc(100vh-5rem)]">
          <div className="max-w-xl">
            <p className="text-[#c9a84c] text-[11px] font-semibold tracking-[0.28em] uppercase mb-5">
              Charleston / Mt. Pleasant, SC
            </p>
            <h1 className="font-serif text-[2.35rem] sm:text-5xl lg:text-[56px] font-bold leading-[1.08] text-[#F7F4EC] mb-6">
              Keep the W-2. Buy a model that can run without you.
            </h1>
            <p className="text-lg md:text-xl text-[#F7F4EC]/80 leading-relaxed mb-5">
              I'm Charles Stovall. I built 30 locations and sold into private equity. Now I help executives match capital to a franchise — then read the FDD like someone who has made payroll.
            </p>
            <p className="text-base text-[#F7F4EC]/65 leading-relaxed mb-8">
              Your resume got you the corner office. It will not get you a clean Item 19. Semi-absentee only works if the labor, the cash, and the file agree.
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#F7F4EC]/45">
              30 locations built · PE exit · FDD read like an operator
            </p>
          </div>

          <div className="bg-[#F7F4EC]/95 text-[#1a2332] p-6 md:p-7 backdrop-blur-sm shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <h2 className="font-serif text-2xl font-bold mb-2">Request your executive assessment</h2>
            <p className="text-sm text-[#1a2332]/65 mb-5">
              Four fields. I'll follow up to book the call and look at capital versus the model.
            </p>
            <form id="executive-assessment-form" action="/api/leads" method="POST" onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
                    data-testid="input-first-name"
                  />
                </label>
                <label className="block text-xs font-semibold">
                  Last name
                  <input
                    type="text"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full h-12 px-3 bg-white border border-[#1a2332]/12 text-base focus:outline-none focus:border-[#c9a84c]"
                    data-testid="input-last-name"
                  />
                </label>
              </div>
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
                  data-testid="input-email"
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
                  data-testid="input-phone"
                />
              </label>
              <input type="hidden" name="leadType" value="executive-ad" />
              <input type="hidden" name="message" value="Executive Access — Franchise Assessment" />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#0A1F3C] hover:bg-[#122c54] text-[#F7F4EC] font-bold disabled:opacity-50"
                data-testid="button-submit"
              >
                {isSubmitting ? "Sending…" : "Request the assessment"}
              </button>
            </form>
            <p className="text-xs text-[#1a2332]/50 text-center mt-4">
              Or <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-[#0A1F3C]">book a time on Calendly</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0A1F3C] text-[#F7F4EC] py-20 md:py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <p className="text-[#c9a84c] text-[11px] font-semibold tracking-[0.24em] uppercase mb-4">The operator version</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
            I don't match you to a logo. I match capital to a model.
          </h2>
          <p className="text-[#F7F4EC]/70 leading-relaxed mb-4">
            If the only way the deal works is a perfect ramp and a cheap manager, you didn't buy a business. You bought a story. I spent years on the other side of that story — 30 units, then a PE exit — and I still live in the Charleston / Mt. Pleasant market I send people into.
          </p>
          <p className="text-[#F7F4EC]/70 leading-relaxed mb-10">
            Executives keep the W-2 on purpose. The question is whether the franchise can stand a normal month without you behind the counter. That's Item 19, labor, and occupancy — not a highlight reel.
          </p>
          <button
            onClick={scrollToForm}
            className="text-[#c9a84c] font-semibold tracking-wide hover:text-[#e0c56a]"
          >
            Request the assessment
          </button>
        </div>
      </section>

      <section className="bg-[#081628] py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-14">
            Three things we actually do
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {[
              {
                num: "01",
                title: "Capital and calendar",
                desc: "What you can write, what you can finance, and how many hours you can give while the W-2 still pays. If those numbers don't fit, we stop early.",
              },
              {
                num: "02",
                title: "Match the model",
                desc: "Semi-absentee or executive-model brands where the unit economics survive a normal month — not just the slide with the best lighting.",
              },
              {
                num: "03",
                title: "Read the file",
                desc: "Item 19 if they give it. Item 7 versus the cash you'll actually need. Item 20 for who left. Then validation calls. Then you decide.",
              },
            ].map((step) => (
              <div key={step.num}>
                <p className="text-[#c9a84c] font-serif text-sm tracking-[0.2em] mb-3">{step.num}</p>
                <h3 className="font-serif text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-[#F7F4EC]/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0A1F3C] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-5 md:px-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to look at the file?</h2>
          <p className="text-[#F7F4EC]/65 mb-8 leading-relaxed">
            Request the assessment or book the call. Bring capital, a calendar, and a willingness to walk if Item 19 is cute and useless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center bg-[#c9a84c] text-[#0A1F3C] font-bold px-8 py-4 hover:bg-[#b8953f]"
            >
              Request the assessment
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
          <p>Charles Stovall · Charleston / Mt. Pleasant, SC</p>
        </div>
        <div className="flex gap-5">
          <a href="tel:9198273921" className="hover:text-[#c9a84c]">(919) 827-3921</a>
          <a href="/" className="hover:text-[#c9a84c]">Main site</a>
        </div>
      </footer>
    </div>
  );
}
