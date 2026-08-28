import { useState } from "react";
import { useLocation } from "wouter";
import { Phone, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackConversion } from "@/lib/analytics";
import { absoluteUrl } from "@shared/site";

const reviews = [
  {
    quote: "Charles is a great teacher and leader, and has found me several franchise opportunities to consider. I appreciate his approach on all matters including the various different franchise opportunities.",
    name: "Mark Murrel",
    title: "Principal, Murrel Investments",
  },
  {
    quote: "Charles helped guide me through the process of starting a franchise. He was patient and took the time to learn about my background and work history and then helped me strategize a plan for my future.",
    name: "Chad Tinney",
    title: "Redbox+ Owner",
  },
  {
    quote: "Charles helped me research 3 separate franchises. Without his guidance, my wife and I would have never known what the process entailed. With his industry insight we were able to find and fund our first franchise.",
    name: "Joe Bosso",
    title: "Atlanta, GA",
  },
];

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
    <div className="min-h-screen bg-[#F7F4EC] text-[#1a2332]">
      <SEO
        title="Executive Access | Semi-Absentee Franchise Opportunities for Executives | Charles Stovall"
        description="Charles Stovall helps executives in Charleston and nationwide match capital to a franchise model they can run without leaving the W-2. Assessment, FDD review, Item 19."
        canonicalUrl={absoluteUrl("/executive-access")}
      />

      <header className="bg-[#0A1F3C] text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/cs-shield-logo.png" alt="Charles Stovall" className="w-10 h-10 object-contain" />
            <div className="leading-tight">
              <p className="font-serif font-bold text-sm">Charles Stovall</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9a84c]">Franchise Friend</p>
            </div>
          </a>
          <div className="flex items-center gap-3 text-sm">
            <a
              href="tel:9198273921"
              className="inline-flex items-center gap-2 text-white/90 hover:text-[#c9a84c]"
              data-testid="button-call-top"
            >
              <Phone size={16} />
              <span className="hidden sm:inline">(919) 827-3921</span>
            </a>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center h-10 px-4 rounded-md bg-[#c9a84c] text-[#0A1F3C] font-semibold hover:bg-[#b8953f]"
            >
              Book a call
            </a>
          </div>
        </div>
      </header>

      <section className="bg-[#0A1F3C] text-white pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-[#7dceb0] text-xs font-semibold tracking-[0.22em] uppercase mb-4">
              Charleston / Mt. Pleasant, SC
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.12] mb-6">
              Keep the W-2. Buy a model that can run without you.
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-xl leading-relaxed mb-6">
              I'm Charles Stovall. I built 30 locations and sold into private equity. Now I help executives match capital to a franchise — then read the FDD like someone who has made payroll.
            </p>
            <p className="text-base text-white/65 max-w-xl leading-relaxed mb-8">
              Your resume got you the corner office. It will not get you a clean Item 19. Semi-absentee only works if the labor, the cash, and the file agree.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              {[
                { stat: "30", label: "Locations built" },
                { stat: "PE", label: "Exit, then this" },
                { stat: "FDD", label: "Read like an operator" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-lg px-3 py-4">
                  <p className="font-serif text-2xl text-[#c9a84c] font-bold">{item.stat}</p>
                  <p className="text-xs text-white/60 mt-1 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F7F4EC] text-[#1a2332] rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <h2 className="font-serif text-2xl font-bold mb-2">Request your executive assessment</h2>
            <p className="text-sm text-[#1a2332]/65 mb-6">
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
                    className="mt-1 w-full h-12 px-3 rounded-lg border border-[#1a2332]/15 bg-white text-base focus:outline-none focus:border-[#c9a84c]"
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
                    className="mt-1 w-full h-12 px-3 rounded-lg border border-[#1a2332]/15 bg-white text-base focus:outline-none focus:border-[#c9a84c]"
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
                  className="mt-1 w-full h-12 px-3 rounded-lg border border-[#1a2332]/15 bg-white text-base focus:outline-none focus:border-[#c9a84c]"
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
                  className="mt-1 w-full h-12 px-3 rounded-lg border border-[#1a2332]/15 bg-white text-base focus:outline-none focus:border-[#c9a84c]"
                  data-testid="input-phone"
                />
              </label>
              <input type="hidden" name="leadType" value="executive-ad" />
              <input type="hidden" name="message" value="Executive Access — Franchise Assessment" />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 h-14 bg-[#0A1F3C] hover:bg-[#122c54] text-white font-bold rounded-lg disabled:opacity-50"
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

      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="/charles-headshot.jpeg"
            alt="Charles Stovall, franchise consultant in Charleston and Mt. Pleasant, SC"
            className="w-full max-w-md mx-auto rounded-2xl object-cover border-4 border-[#c9a84c]"
          />
          <div>
            <p className="text-[#0A1F3C] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The operator version</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5">
              I don't match you to a logo. I match capital to a model.
            </h2>
            <p className="text-[#1a2332]/70 leading-relaxed mb-4">
              If the only way the deal works is a perfect ramp and a cheap manager, you didn't buy a business. You bought a story. I spent years on the other side of that story — 30 units, then a PE exit — and I still live in the Charleston / Mt. Pleasant market I send people into.
            </p>
            <p className="text-[#1a2332]/70 leading-relaxed mb-8">
              Executives keep the W-2 on purpose. The question is whether the franchise can stand a normal month without you behind the counter. That's Item 19, labor, and occupancy — not a highlight reel.
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0A1F3C] font-bold px-6 py-3 rounded-lg hover:bg-[#b8953f]"
            >
              Request the assessment
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Three things we actually do
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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
              <div key={step.num} className="border border-[#1a2332]/10 rounded-xl p-7 bg-[#F7F4EC]">
                <p className="text-[#7dceb0] font-serif text-3xl font-bold mb-3">{step.num}</p>
                <h3 className="font-serif text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-[#1a2332]/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            What buyers actually said
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <blockquote key={review.name} className="bg-white border border-[#1a2332]/10 rounded-xl p-7">
                <p className="text-[#1a2332]/75 leading-relaxed mb-5">“{review.quote}”</p>
                <footer>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-[#1a2332]/50">{review.title}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1F3C] text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to look at the file?</h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Request the assessment or book the call. Bring capital, a calendar, and a willingness to walk if Item 19 is cute and useless.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0A1F3C] font-bold px-8 py-4 rounded-lg hover:bg-[#b8953f]"
            >
              Request the assessment
            </button>
            <a
              href="https://calendly.com/charles-stovall/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/25 px-8 py-4 rounded-lg hover:bg-white/5"
            >
              Book a call
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#081628] text-white/60 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/cs-shield-logo.png" alt="" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-white font-serif font-bold">Charles Stovall</p>
              <p className="text-xs">Franchise consultant · Charleston / Mt. Pleasant, SC</p>
            </div>
          </div>
          <div className="text-sm space-y-1">
            <a href="tel:9198273921" className="block hover:text-[#c9a84c]">(919) 827-3921</a>
            <a href="/" className="block hover:text-[#c9a84c]">Main site</a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Charles Stovall</p>
        </div>
      </footer>
    </div>
  );
}
