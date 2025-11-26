import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPodcastSchema, insertInvitationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import PDFDocument from "pdfkit";

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

  // Ideal Day Blueprint PDF endpoint
  app.get("/api/download/ideal-day-blueprint", (req, res) => {
    try {
      const doc = new PDFDocument({ size: "letter", margin: 50 });
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=Ideal-Day-Blueprint.pdf");
      
      doc.pipe(res);

      // Title
      doc.fontSize(24).font("Helvetica-Bold").text("Your Ideal Day Blueprint", { align: "center" });
      doc.fontSize(12).font("Helvetica").text("A Guided Discovery Workbook", { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor("#666666").text("By Charles Stovall - Franchise Friend", { align: "center" });
      doc.moveDown(2);

      // Reset color
      doc.fillColor("#000000");

      // Introduction
      doc.fontSize(14).font("Helvetica-Bold").text("Introduction");
      doc.fontSize(11).font("Helvetica").text(
        "Before exploring franchise opportunities, it's essential to understand what success truly means to you. This workbook guides you through discovering your ideal day—the lifestyle, schedule, environment, and impact you want to create.",
        { align: "left" }
      );
      doc.moveDown(1);

      // Section 1: Morning Routine
      doc.fontSize(14).font("Helvetica-Bold").text("1. Your Morning Routine");
      doc.fontSize(10).font("Helvetica-Oblique").text("Reflect on how you'd like to start your day in an ideal franchise business.");
      doc.fontSize(11).font("Helvetica").text([
        "• What time do you ideally wake up?",
        "• How much time do you want before work begins?",
        "• Where are you? (home office, commute, etc.)",
        "• What activities energize you in the morning?",
        "• How involved do you want to be daily vs. delegating?"
      ], { align: "left", lineGap: 8 });
      doc.moveDown(1);
      doc.fontSize(10).text("Your reflection:", { font: "Helvetica-Oblique" });
      doc.fontSize(10).rect(doc.x, doc.y, 450, 80).stroke();
      doc.moveDown(5);

      // Section 2: Work Environment
      doc.fontSize(14).font("Helvetica-Bold").text("2. Your Work Environment");
      doc.fontSize(10).font("Helvetica-Oblique").text("Describe the physical and cultural environment where you'll thrive.");
      doc.fontSize(11).font("Helvetica").text([
        "• Will you work from home, an office, or be mobile?",
        "• Do you prefer hands-on or managerial work?",
        "• What's important: location, travel, team size?",
        "• Quiet, fast-paced, creative, structured—what suits you?",
        "• How much client/customer interaction do you want?"
      ], { align: "left", lineGap: 8 });
      doc.moveDown(1);
      doc.fontSize(10).text("Your reflection:", { font: "Helvetica-Oblique" });
      doc.fontSize(10).rect(doc.x, doc.y, 450, 80).stroke();
      doc.moveDown(5);

      // Section 3: Skills & Strengths
      doc.fontSize(14).font("Helvetica-Bold").text("3. Your Natural Strengths");
      doc.fontSize(10).font("Helvetica-Oblique").text("Identify what you do best and want to leverage.");
      doc.fontSize(11).font("Helvetica").text([
        "• What are your top 3-5 natural talents?",
        "• What past successes energize you most?",
        "• Are you a people person, systems thinker, or problem-solver?",
        "• What skills do you want to use daily?",
        "• What business aspects do you want to avoid?"
      ], { align: "left", lineGap: 8 });
      doc.moveDown(1);
      doc.fontSize(10).text("Your reflection:", { font: "Helvetica-Oblique" });
      doc.fontSize(10).rect(doc.x, doc.y, 450, 80).stroke();
      doc.moveDown(5);

      // New page
      doc.addPage();

      // Section 4: Financial Goals
      doc.fontSize(14).font("Helvetica-Bold").text("4. Financial & Investment Picture");
      doc.fontSize(10).font("Helvetica-Oblique").text("Clarify your investment capacity and income expectations.");
      doc.fontSize(11).font("Helvetica").text([
        "• What's your total investment range? ($, timeframe)",
        "• How much profit do you need annually?",
        "• Timeline to profitability: 6 months, 1 year, 3+ years?",
        "• Will you be the operator or investor-owner?",
        "• What's your risk tolerance?"
      ], { align: "left", lineGap: 8 });
      doc.moveDown(1);
      doc.fontSize(10).text("Your reflection:", { font: "Helvetica-Oblique" });
      doc.fontSize(10).rect(doc.x, doc.y, 450, 80).stroke();
      doc.moveDown(5);

      // Section 5: Values & Impact
      doc.fontSize(14).font("Helvetica-Bold").text("5. Your Values & Impact");
      doc.fontSize(10).font("Helvetica-Oblique").text("Define what matters most and the impact you want to make.");
      doc.fontSize(11).font("Helvetica").text([
        "• What values are non-negotiable for you?",
        "• What impact do you want? (community, customers, family)",
        "• Industry preferences? (health, education, services, etc.)",
        "• Do you want to grow a team or work solo?",
        "• Legacy: What do you want to be remembered for?"
      ], { align: "left", lineGap: 8 });
      doc.moveDown(1);
      doc.fontSize(10).text("Your reflection:", { font: "Helvetica-Oblique" });
      doc.fontSize(10).rect(doc.x, doc.y, 450, 80).stroke();
      doc.moveDown(5);

      // Section 6: Lifestyle Integration
      doc.fontSize(14).font("Helvetica-Bold").text("6. Lifestyle Integration");
      doc.fontSize(10).font("Helvetica-Oblique").text("Balance work with life outside the business.");
      doc.fontSize(11).font("Helvetica").text([
        "• Weekly schedule: how many days/hours working?",
        "• Time for family, hobbies, personal growth?",
        "• Vacation time you want annually?",
        "• Flexibility for seasonal variations?",
        "• Work-life balance priority: what's your ideal ratio?"
      ], { align: "left", lineGap: 8 });
      doc.moveDown(1);
      doc.fontSize(10).text("Your reflection:", { font: "Helvetica-Oblique" });
      doc.fontSize(10).rect(doc.x, doc.y, 450, 80).stroke();
      doc.moveDown(5);

      // New page
      doc.addPage();

      // Section 7: The Ideal Day Summary
      doc.fontSize(16).font("Helvetica-Bold").text("Your Ideal Day Summary");
      doc.fontSize(11).font("Helvetica").text(
        "Using everything you've reflected on above, write a detailed description of your ideal day. Paint the picture—from morning to evening, including details about your environment, the people you interact with, the work you do, and how you feel at the end of the day.",
        { align: "left", lineGap: 5 }
      );
      doc.moveDown(1);
      doc.fontSize(11).rect(doc.x, doc.y, 450, 180).stroke();
      doc.moveDown(12);

      // Next Steps
      doc.fontSize(14).font("Helvetica-Bold").text("Next Steps");
      doc.fontSize(11).font("Helvetica").text([
        "1. Complete this workbook thoughtfully—there are no right or wrong answers",
        "2. Review your ideal day description and identify 3-5 key priorities",
        "3. Share these insights with Charles during your discovery call",
        "4. Use this as your guide to evaluate franchise opportunities",
        "5. Revisit and refine your ideal day as you progress through the discovery process"
      ], { align: "left", lineGap: 10 });
      doc.moveDown(2);

      doc.fontSize(10).fillColor("#666666").text(
        "Ready to find your ideal franchise? Visit franchisefriend.net to explore 247+ verified opportunities.",
        { align: "center" }
      );

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ success: false, error: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
