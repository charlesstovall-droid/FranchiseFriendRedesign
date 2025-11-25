import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPodcastSchema, insertInvitationSchema } from "@shared/schema";
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
  // Auth routes
  app.post("/api/auth/login", async (req: any, res: any) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email required" });
      }

      // Check if member exists
      const member = await storage.getMemberByEmail(email);
      if (!member) {
        return res.status(401).json({ success: false, error: "No account found with this email. Please contact Charles for an invitation." });
      }

      // Store member info in session
      if (req.session) {
        req.session.memberId = member.id;
        req.session.memberEmail = member.email;
        req.session.memberName = member.name;
      }

      res.json({ success: true, member });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req: any, res: any) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ success: false, error: "Logout failed" });
        }
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
  });

  app.get("/api/auth/me", async (req: any, res: any) => {
    try {
      if (!req.session?.memberEmail) {
        return res.status(401).json({ success: false, error: "Not logged in" });
      }

      const member = await storage.getMemberByEmail(req.session.memberEmail);
      if (!member) {
        if (req.session) {
          req.session.destroy(() => {});
        }
        return res.status(401).json({ success: false, error: "Session invalid" });
      }

      res.json({ success: true, member });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
  });

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

  // Member invitation routes
  app.post("/api/invitations/send", async (req, res) => {
    try {
      const { email, name } = req.body;
      if (!email || !name) {
        return res.status(400).json({ success: false, error: "Email and name required" });
      }
      const invitation = await storage.createInvitation(email, name);
      res.json({ success: true, invitation });
    } catch (error: any) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/members/redeem", async (req, res) => {
    try {
      const { code, email, name } = req.body;
      if (!code || !email || !name) {
        return res.status(400).json({ success: false, error: "Code, email, and name required" });
      }
      const invitation = await storage.getInvitationByCode(code);
      if (!invitation) {
        return res.status(404).json({ success: false, error: "Invalid invitation code" });
      }
      if (invitation.isUsed) {
        return res.status(400).json({ success: false, error: "Invitation already used" });
      }
      const member = await storage.redeemInvitation(code, email, name);
      res.json({ success: true, member });
    } catch (error: any) {
      console.error("Error redeeming invitation:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/members/:email", async (req, res) => {
    try {
      const member = await storage.getMemberByEmail(req.params.email);
      if (!member) {
        return res.status(404).json({ success: false, error: "Member not found" });
      }
      res.json({ success: true, member });
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ success: false, error: "Failed to fetch member" });
    }
  });

  app.post("/api/members/:email/progress", async (req, res) => {
    try {
      const { phase, complete } = req.body;
      if (!phase || complete === undefined) {
        return res.status(400).json({ success: false, error: "Phase and complete required" });
      }
      await storage.updateMemberProgress(req.params.email, phase, complete);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ success: false, error: "Failed to update progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
