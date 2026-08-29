import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import express, { type Express, type Request } from "express";

import runApp from "./app";
import { applySeoToHtml, pathnameFromRequest } from "./seo";

export async function serveStatic(app: Express, server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files with caching headers for performance
  app.use(express.static(distPath, {
    maxAge: '1d', // Cache static assets for 1 day
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Set longer cache for assets with hashed filenames
      if (filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Set shorter cache for HTML to ensure updates are seen
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  const indexPath = path.resolve(distPath, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf-8");

  // fall through to index.html if the file doesn't exist (SPA routing)
  // Do not use app.use("*") — Express treats * as the mount path and sets req.path to "/".
  app.use((req, res) => {
    const pathname = pathnameFromRequest(req);
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(applySeoToHtml(indexHtml, pathname));
  });
}

(async () => {
  await runApp(serveStatic);
})();
