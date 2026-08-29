export const SITE_ORIGIN = "https://www.charlesstovall.com";

export const LEAD_CONVERSION_SEND_TO = "AW-593191309/w4I0CPeau54cEI3D7ZoC";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) {
    return path.replace("https://charlesstovall.com", SITE_ORIGIN);
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized === "/" ? "/" : normalized}`;
}

export function toWwwCanonical(urlOrPath: string): string {
  if (!urlOrPath) return `${SITE_ORIGIN}/`;
  if (urlOrPath.startsWith("/")) {
    return absoluteUrl(urlOrPath);
  }
  return urlOrPath
    .replace("https://charlesstovall.com", SITE_ORIGIN)
    .replace("http://charlesstovall.com", SITE_ORIGIN)
    .replace("http://www.charlesstovall.com", SITE_ORIGIN);
}
