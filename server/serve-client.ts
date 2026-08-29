import fs from "node:fs";
import path from "node:path";

import type { Express, Response } from "express";
import express from "express";

import { applySeoToHtml, pathnameFromRequest } from "./seo";

function seoPathname(pathname: string): string {
  return pathname === "/index.html" ? "/" : pathname;
}

function sendSeoHtml(res: Response, indexHtml: string, pathname: string) {
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(applySeoToHtml(indexHtml, seoPathname(pathname)));
}

/**
 * Serve hashed assets as files, but never let express.static return the raw
 * index.html for `/`. That is the live homepage SSR bug: static's default
 * `index: "index.html"` short-circuits the SEO injector that every other
 * route (executive-access, blog) already hits.
 */
export function mountClientStatic(app: Express, distPath: string) {
  const indexPath = path.resolve(distPath, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf-8");

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }
    const pathname = pathnameFromRequest(req);
    if (pathname === "/" || pathname === "/index.html") {
      return sendSeoHtml(res, indexHtml, pathname);
    }
    next();
  });

  app.use(express.static(distPath, {
    index: false,
    maxAge: "1d",
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.includes("/assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
    },
  }));

  app.use((req, res) => {
    sendSeoHtml(res, indexHtml, pathnameFromRequest(req));
  });
}
