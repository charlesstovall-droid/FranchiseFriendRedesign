import type { Request, Response, NextFunction } from "express";

export const AD_LANDING_REDIRECTS: Record<string, string> = {
  "/executive/access": "/executive-access",
  "/executive/ownership": "/executive-access",
  "/home-based/franchises": "/home-based-franchises",
};

/** Retired Black Book URLs go home — not /advisor. */
export const BLACK_BOOK_REDIRECTS: Record<string, string> = {
  "/black-book": "/",
  "/blackbook": "/",
  "/the-blackbook-of-franchising": "/",
  "/black-book-of-franchising": "/",
  "/the-black-book-of-franchising": "/",
  "/free-franchise-guide": "/",
  "/thank-you-franchise-guide": "/",
};

/** Old Franchise Readiness Assessment URLs go to Ownership Advisor. */
export const OLD_ASSESSMENT_REDIRECTS: Record<string, string> = {
  "/franchise-assessment": "/advisor",
  "/assessment": "/advisor",
  "/franchise-quiz": "/advisor",
  "/readiness": "/advisor",
};

export const ALL_SEO_REDIRECTS: Record<string, string> = {
  ...AD_LANDING_REDIRECTS,
  ...BLACK_BOOK_REDIRECTS,
  ...OLD_ASSESSMENT_REDIRECTS,
};

function pathWithoutTrailingSlash(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function seoRedirects(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return next();
  }

  const path = req.path;
  if (path.startsWith("/api") || path.startsWith("/assets")) {
    return next();
  }

  const trimmed = pathWithoutTrailingSlash(path);
  const destination = ALL_SEO_REDIRECTS[path] || ALL_SEO_REDIRECTS[trimmed];
  if (destination) {
    return res.redirect(301, destination);
  }

  if (path.length > 1 && path.endsWith("/")) {
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(301, trimmed + query);
  }

  next();
}
