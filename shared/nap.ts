import { SITE_ORIGIN, absoluteUrl } from "./site";

/** Locked NAP — must match schema, footer, and any visible address. */
export const NAP = {
  name: "Charles Stovall Your Franchise Friend",
  personName: "Charles Stovall",
  alternateNames: ["Your Franchise Friend", "Franchise Friend"] as const,
  streetAddress: "1531 N Lakeshore Dr",
  addressLocality: "Mt Pleasant",
  addressRegion: "SC",
  postalCode: "29466",
  addressCountry: "US",
  telephone: "+1-919-827-3921",
  telephoneDisplay: "(919) 827-3921",
  email: "CStovall@FranChoice.com",
} as const;

/**
 * US Census Bureau Geocoder (Public_AR_Current), queried 2026-08-31 for
 * "1531 N Lakeshore Dr, Mt Pleasant, SC 29466".
 * Do not use downtown Charleston 32.7765,-79.9311.
 */
export const NAP_GEO = {
  latitude: 32.829845904339,
  longitude: -79.799492020957,
  source: "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress",
} as const;

export const SAME_AS = [
  "https://www.linkedin.com/in/charles-stovall/",
  "https://x.com/chuckstovall",
  "https://www.instagram.com/thefranchisefriend",
  "https://www.franchoice.com/our-consultants/charles-stovall/",
  "https://business.mountpleasantchamber.org/list/member/platypi-consultants-dba-franchise-friend-4116",
] as const;

export const PERSON_ID = `${SITE_ORIGIN}/#person`;
export const LOCAL_BUSINESS_ID = `${SITE_ORIGIN}/#localbusiness`;
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

export const OG_IMAGE_URL = `${SITE_ORIGIN}/opengraph.jpg`;

export const GOOGLE_SITE_VERIFICATION = "0v6wsrPepL27hE8x_WTn7zj2y2apW9g2_K1NqQQkHTw";
export const GOOGLE_VERIFICATION_FILENAME = "googleed0f55d99999dbb1.html";
export const GOOGLE_VERIFICATION_BODY = "google-site-verification: googleed0f55d99999dbb1.html";

export function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: NAP.streetAddress,
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
    postalCode: NAP.postalCode,
    addressCountry: NAP.addressCountry,
  };
}

export function formattedAddressLine(): string {
  return `${NAP.streetAddress}, ${NAP.addressLocality}, ${NAP.addressRegion} ${NAP.postalCode}`;
}

export function renderLlmsTxt(): string {
  return [
    NAP.name,
    `alternateName: ${NAP.alternateNames.join(", ")}`,
    "",
    NAP.streetAddress,
    `${NAP.addressLocality}, ${NAP.addressRegion} ${NAP.postalCode}`,
    "United States",
    `Telephone: ${NAP.telephone}`,
    "",
    absoluteUrl("/"),
    absoluteUrl("/charleston"),
    absoluteUrl("/executive-access"),
    absoluteUrl("/blog/fdd-red-flags"),
    absoluteUrl("/faq"),
    absoluteUrl("/about"),
    "https://www.franchoice.com/our-consultants/charles-stovall/",
    "https://business.mountpleasantchamber.org/list/member/platypi-consultants-dba-franchise-friend-4116",
    "",
  ].join("\n");
}
