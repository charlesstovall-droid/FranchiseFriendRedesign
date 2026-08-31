import type { Express } from "express";

import { GOOGLE_VERIFICATION_BODY, GOOGLE_VERIFICATION_FILENAME, renderLlmsTxt } from "../shared/nap";

/**
 * Serve crawler/verification files before the SPA catch-all so they never
 * return the React shell.
 */
export function mountPlainSiteFiles(app: Express) {
  app.get(`/${GOOGLE_VERIFICATION_FILENAME}`, (_req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(GOOGLE_VERIFICATION_BODY);
  });

  app.get("/llms.txt", (_req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(renderLlmsTxt());
  });
}
