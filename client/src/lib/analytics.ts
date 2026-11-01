import { LEAD_CONVERSION_SEND_TO, PHONE_CONVERSION_SEND_TO } from "@shared/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPhoneClick() {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  gtag("event", "phone_click");
  gtag("event", "conversion", {
    send_to: PHONE_CONVERSION_SEND_TO,
  });
}

let phoneClicksInstalled = false;

/** One listener for every tel: link, including links rendered later. */
export function installPhoneClickTracking() {
  if (phoneClicksInstalled || typeof document === "undefined") return;
  phoneClicksInstalled = true;
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a");
    if (!link) return;
    const href = (link.getAttribute("href") || "").trim().toLowerCase();
    if (!href.startsWith("tel:")) return;
    trackPhoneClick();
  });
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
