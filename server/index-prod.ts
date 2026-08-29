import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";

import { type Express } from "express";

import runApp from "./app";
import { mountClientStatic } from "./serve-client";

export async function serveStatic(app: Express, server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  mountClientStatic(app, distPath);
}

(async () => {
  await runApp(serveStatic);
})();
