import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPodcastSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

function generateRSSFeed(baseUrl: string, podcastTitle: string, podcastDescription: string, episodes: any[]) {
  const episodeItems = episodes.map(ep => `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description || "")}</description>
      <enclosure url="${ep.audioUrl}" type="audio/mpeg" length="0"/>
      <pubDate>${new Date(ep.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="false">${ep.id}</guid>
      ${ep.duration ? `<duration>${ep.duration}</duration>` : ""}
      ${ep.episodeNumber ? `<episodeNumber>${ep.episodeNumber}</episodeNumber>` : ""}
      ${ep.artworkUrl ? `<image>${escapeXml(ep.artworkUrl)}</image>` : ""}
    </item>
  `).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${escapeXml(podcastTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(podcastDescription)}</description>
    <language>en-us</language>
    ${episodes[0]?.artworkUrl ? `<image><url>${episodes[0].artworkUrl}</url><title>${escapeXml(podcastTitle)}</title><link>${baseUrl}</link></image>` : ""}
    ${episodes.map(ep => ep.artworkUrl).filter(Boolean)[0] ? `<itunes:image href="${episodes.map(ep => ep.artworkUrl).filter(Boolean)[0]}"/>` : ""}
    ${episodeItems}
  </channel>
</rss>`;
}

function escapeXml(str: string = ""): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.json({ success: true, lead });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: validationError.message 
        });
      }
      console.error("Error creating lead:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to submit form. Please try again." 
      });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const { type } = req.query;
      const leads = type 
        ? await storage.getLeadsByType(type as string)
        : await storage.getAllLeads();
      res.json({ success: true, leads });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch leads" 
      });
    }
  });

  // Podcast routes
  app.post("/api/podcasts", async (req, res) => {
    try {
      const validatedData = insertPodcastSchema.parse(req.body);
      const podcast = await storage.createPodcast(validatedData);
      res.json({ success: true, podcast });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: validationError.message 
        });
      }
      console.error("Error creating podcast:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to upload podcast. Please try again." 
      });
    }
  });

  app.get("/api/podcasts", async (req, res) => {
    try {
      const podcasts = await storage.getAllPodcasts();
      res.json({ success: true, podcasts });
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch podcasts" 
      });
    }
  });

  app.delete("/api/podcasts/:id", async (req, res) => {
    try {
      const success = await storage.deletePodcast(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, error: "Podcast not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting podcast:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete podcast" 
      });
    }
  });

  // RSS Feed endpoint
  app.get("/podcast/feed.xml", async (req, res) => {
    try {
      const podcasts = await storage.getAllPodcasts();
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const rss = generateRSSFeed(
        baseUrl,
        "Charles Stovall's Franchise Friend Podcast",
        "Expert insights on franchise consulting, business strategy, and entrepreneurship",
        podcasts
      );
      res.type("application/rss+xml").send(rss);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
