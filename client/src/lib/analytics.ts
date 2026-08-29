import { LEAD_CONVERSION_SEND_TO } from "@shared/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackConversion(label?: string) {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") {
    console.warn("[trackConversion] gtag not available");
    return;
  }
  gtag("event", "conversion", {
    send_to: LEAD_CONVERSION_SEND_TO,
    value: 1.0,
    currency: "USD",
    transaction_id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  });
  if (label) {
    console.log(`[trackConversion] Fired for ${label}`);
  }
}
