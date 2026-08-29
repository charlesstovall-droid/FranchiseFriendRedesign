import type { Request, Response, NextFunction } from "express";

export const AD_LANDING_REDIRECTS: Record<string, string> = {
  "/executive/access": "/executive-access",
  "/executive/ownership": "/executive-access",
  "/home-based/franchises": "/home-based-franchises",
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
  const destination = AD_LANDING_REDIRECTS[path] || AD_LANDING_REDIRECTS[trimmed];
  if (destination) {
    return res.redirect(301, destination);
  }

  if (path.length > 1 && path.endsWith("/")) {
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(301, trimmed + query);
  }

  next();
}
