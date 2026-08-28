import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackConversion } from "@/lib/analytics";
import { absoluteUrl } from "@shared/site";

export default function ThankYouAd() {
  useEffect(() => {
    trackConversion("thank-you-ad");
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1F3C] flex items-center justify-center px-4">
      <SEO
        title="Thank You | Charles Stovall"
        description="Your request has been received. Charles will follow up to schedule your consultation."
        canonicalUrl={absoluteUrl("/thank-you-ad")}
      />
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#c9a84c] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#0A1F3C]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-white/70 mb-6">
            Your request has been received.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-serif font-bold text-[#c9a84c] mb-4">
            What Happens Next?
          </h2>
          <ul className="space-y-4 text-left text-white/75">
            <li className="flex items-start gap-3">
              <span className="bg-[#c9a84c] text-[#0A1F3C] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
              <span>Charles will personally review your information within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#c9a84c] text-[#0A1F3C] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
              <span>You'll receive a call or email to schedule your consultation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#c9a84c] text-[#0A1F3C] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
              <span>Together, we'll look at capital, the model, and the FDD</span>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-white/50 text-sm">
            Questions? Call <a href="tel:9198273921" className="text-[#c9a84c] hover:underline">(919) 827-3921</a>
            {" "}or{" "}
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">book a call</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            Charles Stovall · Charleston / Mt. Pleasant, SC
          </p>
        </div>
      </div>
    </div>
  );
}
