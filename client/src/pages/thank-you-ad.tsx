import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function ThankYouAd() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-593191309/w4I0CPeau54cEI3D7ZoC",
        value: 1.0,
        currency: "USD",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1E2B42] flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Your request has been received.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">
            What Happens Next?
          </h2>
          <ul className="space-y-4 text-left text-gray-300">
            <li className="flex items-start gap-3">
              <span className="bg-[#D4AF37] text-[#1E2B42] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
              <span>Charles will personally review your information within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#D4AF37] text-[#1E2B42] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
              <span>You'll receive a call or email to schedule your confidential consultation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#D4AF37] text-[#1E2B42] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
              <span>Together, we'll explore franchise opportunities matched to your goals</span>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            Questions? Call <a href="tel:919-827-3921" className="text-[#D4AF37] hover:underline">(919) 827-3921</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Charles Stovall | Certified Franchise Consultant | Charleston, SC
          </p>
        </div>
      </div>
    </div>
  );
}
