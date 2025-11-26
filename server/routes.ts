import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPodcastSchema, insertInvitationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
// @ts-ignore - pdfkit types not available
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
      const doc = new PDFDocument({ size: "letter", margin: 40, bufferPages: true });
      const chunks: any[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdf = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Ideal-Day-Blueprint.pdf");
        res.setHeader("Content-Length", pdf.length);
        res.send(pdf);
      });
      
      doc.on('error', (err) => {
        console.error("PDF generation error:", err);
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      });

      const navyBlue = "#1E2B42";
      const gold = "#F3AE1B";
      const margin = 40;
      const pageWidth = 612 - 2 * margin;

      // Helper to add ruled lines for writing
      const addWritingLines = (y: number, height = 60, lineCount = 3) => {
        const lineHeight = height / lineCount;
        for (let i = 0; i < lineCount; i++) {
          doc.moveTo(margin, y + i * lineHeight).lineTo(margin + pageWidth, y + i * lineHeight).stroke();
        }
        return y + height;
      };

      // Page 1: Title & Introduction
      doc.fontSize(28).font("Helvetica-Bold").fillColor(navyBlue).text("Your Ideal Day Blueprint", { align: "center" });
      doc.fontSize(14).font("Helvetica").fillColor(gold).text("A Guided Discovery Workbook", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#666666").text("By Charles Stovall - Franchise Friend", { align: "center" });
      doc.moveDown(1.5);

      doc.fontSize(11).fillColor("#000000").font("Helvetica").text(
        "Before exploring franchise opportunities, it's essential to understand what success truly means to you. This workbook guides you through discovering your ideal day—the lifestyle, schedule, environment, and impact you want to create.",
        { align: "left", width: pageWidth }
      );
      doc.moveDown(1.2);

      // Section 1
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("1. Your Morning Routine");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Reflect on how you'd like to start your day in an ideal franchise business.", { width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#000000").text("• What time do you wake up?  • How much time before work begins?  • Work from home, office, or mobile?\n• What activities energize you?  • How hands-on vs. delegated?", { width: pageWidth });
      doc.moveDown(0.4);
      let y = addWritingLines(doc.y, 50, 2);
      doc.moveDown(3);

      // Section 2
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("2. Your Work Environment");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Describe where and how you'll thrive professionally.", { width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#000000").text("• Physical space (office, home, mobile)?  • Hands-on or managerial?  • Team size preferences?\n• Pace & culture (quiet, fast-paced, creative)?  • Client interaction level?", { width: pageWidth });
      doc.moveDown(0.4);
      y = addWritingLines(doc.y, 50, 2);
      doc.moveDown(3);

      // Section 3
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("3. Your Natural Strengths");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Identify what you do best and want to use daily.", { width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#000000").text("• Top 3-5 natural talents?  • What past successes energize you?\n• Are you people-focused, systems-oriented, or problem-solver?  • What to avoid?", { width: pageWidth });
      doc.moveDown(0.4);
      y = addWritingLines(doc.y, 50, 2);
      doc.moveDown(2.5);

      // New page
      doc.addPage();

      // Section 4
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("4. Financial & Investment Picture");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Clarify your investment capacity and income expectations.", { width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#000000").text("• Total investment range & timeframe?  • Annual profit needed?  • Timeline to profitability?\n• Operator or investor-owner?  • Your risk tolerance?", { width: pageWidth });
      doc.moveDown(0.4);
      y = addWritingLines(doc.y, 50, 2);
      doc.moveDown(3);

      // Section 5
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("5. Your Values & Impact");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Define what matters most and the impact you want to make.", { width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#000000").text("• Non-negotiable values?  • Desired impact (community, family, customers)?\n• Industry preferences?  • Solo or team?  • Your legacy?", { width: pageWidth });
      doc.moveDown(0.4);
      y = addWritingLines(doc.y, 50, 2);
      doc.moveDown(3);

      // Section 6
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("6. Lifestyle Integration");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Balance work with your personal life.", { width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#000000").text("• Days/hours per week working?  • Family, hobbies, personal growth time?\n• Annual vacation desired?  • Seasonal flexibility?  • Ideal work-life ratio?", { width: pageWidth });
      doc.moveDown(0.4);
      y = addWritingLines(doc.y, 50, 2);
      doc.moveDown(2);

      // New page
      doc.addPage();

      // Section 7: Ideal Day Summary
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("Your Ideal Day Summary");
      doc.moveDown(0.5);
      doc.fontSize(9).font("Helvetica").fillColor("#000000").text(
        "Write a detailed description of your ideal day. Paint the picture from morning to evening—your environment, the people you interact with, the work you do, and how you feel at the end of the day.",
        { width: pageWidth }
      );
      doc.moveDown(0.5);
      
      for (let i = 0; i < 10; i++) {
        doc.moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
        doc.moveDown(0.28);
      }
      
      doc.moveDown(1.5);

      // Next Steps & Closing
      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Next Steps");
      doc.moveDown(0.3);
      doc.fontSize(9).font("Helvetica").fillColor("#000000").text([
        "1. Complete this workbook thoughtfully—there are no right or wrong answers",
        "2. Identify 3-5 key priorities from your ideal day vision",
        "3. Share these insights with Charles during your discovery call",
        "4. Use this as your guide when evaluating franchise opportunities",
        "5. Revisit and refine as you progress through the discovery process"
      ], { width: pageWidth, lineGap: 4 });

      doc.moveDown(1);
      doc.fontSize(9).fillColor("#666666").text(
        "Ready to find your ideal franchise? Visit franchisefriend.net to explore 247+ verified opportunities.",
        { align: "center", width: pageWidth }
      );

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      }
    }
  });

  // Business Reality Book PDF endpoint
  app.get("/api/download/business-reality-book", (req, res) => {
    try {
      const doc = new PDFDocument({ size: "letter", margin: 40, bufferPages: true });
      const chunks: any[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdf = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Business-Reality-Guide.pdf");
        res.setHeader("Content-Length", pdf.length);
        res.send(pdf);
      });
      
      doc.on('error', (err) => {
        console.error("PDF generation error:", err);
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      });

      const navyBlue = "#1E2B42";
      const gold = "#F3AE1B";
      const margin = 40;
      const pageWidth = 612 - 2 * margin;

      // Title Page
      doc.fontSize(32).font("Helvetica-Bold").fillColor(navyBlue).text("The Reality of Business Ownership", { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(18).font("Helvetica").fillColor(gold).text("An Honest Guide to Franchise Ownership", { align: "center" });
      doc.moveDown(2);
      doc.fontSize(11).fillColor("#000000").font("Helvetica").text(
        "By Charles Stovall - Franchise Friend\n\nSetting Expectations Before You Invest",
        { align: "center", width: pageWidth }
      );
      doc.moveDown(3);

      // Critical Opening
      doc.fontSize(13).font("Helvetica-Bold").fillColor(navyBlue).text("⚠ REALITY CHECK");
      doc.moveDown(0.4);
      doc.fontSize(11).fillColor("#C00000").font("Helvetica-Bold").text(
        "If you are looking for part-time work, this is NOT for you.",
        { width: pageWidth }
      );
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text(
        "Business ownership—whether franchise or independent—demands significant time, energy, and commitment. This is not a side project. This is your job. Treat it accordingly.",
        { width: pageWidth }
      );
      doc.moveDown(1.5);

      // TOC
      doc.fontSize(12).font("Helvetica-Bold").fillColor(navyBlue).text("What You'll Learn In This Guide");
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text([
        "• The Time Commitment Reality",
        "• Financial Realities & Investment Truths",
        "• Common Mistakes Business Owners Make",
        "• Lifestyle Expectations vs. Reality",
        "• Understanding Failure Rates",
        "• Questions You Must Answer Honestly"
      ], { width: pageWidth, lineGap: 6 });
      
      doc.addPage();

      // Section 1: Time Commitment
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("1. THE TIME COMMITMENT REALITY");
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text(
        "Let's be direct: most franchises require 50-70+ hours per week during the first 2-3 years.",
        { width: pageWidth }
      );
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("What This Looks Like:");
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#000000").text([
        "• 6-7 day work weeks in early growth phase",
        "• Working nights/weekends on administrative tasks",
        "• Being 'on call' for emergencies",
        "• Managing staff, finances, and operations simultaneously",
        "• Less vacation time than corporate jobs",
        "• Stress that follows you home"
      ], { width: pageWidth, lineGap: 4 });
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#666666").font("Helvetica-Italic").text(
        "The business owns you at first. After 3-5 years, if built correctly, you might own the business.",
        { width: pageWidth }
      );
      
      doc.moveDown(1.2);

      // Section 2: Financial Reality
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("2. FINANCIAL REALITIES & INVESTMENT TRUTHS");
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text([
        "Initial Investment: Most franchises cost $200K-$1M+ to launch. This covers the franchise fee, equipment, inventory, buildout, and working capital.",
        "",
        "Personal Funds Required: Expect to invest 25-40% of your own money. Lenders want to know you have skin in the game.",
        "",
        "First Year Losses: Many franchises are unprofitable in year one. Budget for 12-24 months before seeing positive cash flow.",
        "",
        "Your Paycheck: During growth phase, you might take little to no salary while reinvesting profits."
      ], { width: pageWidth, lineGap: 5 });
      doc.moveDown(1);

      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Hidden Costs Nobody Talks About:");
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#000000").text([
        "• Accounting & legal fees ($3K-$10K+ annually)",
        "• Insurance (liability, property, workers' comp)",
        "• Marketing & customer acquisition",
        "• Technology systems & software subscriptions",
        "• Employee training & turnover costs",
        "• Unexpected repairs & emergency expenses"
      ], { width: pageWidth, lineGap: 4 });

      doc.addPage();

      // Section 3: Common Mistakes
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("3. COMMON MISTAKES BUSINESS OWNERS MAKE");
      doc.moveDown(0.5);

      const mistakes = [
        { title: "Underestimating Time", desc: "Thinking you can run the business part-time or hire someone to run it while you stay hands-off. Wrong. You need to know every aspect intimately." },
        { title: "Overestimating Revenue", desc: "Franchisors' financial projections are often optimistic. Your market, location, and execution will differ. Add a 20% discount to any projections you see." },
        { title: "Ignoring the Franchise Agreement", desc: "Not fully understanding royalties, marketing fees, restrictions, and what the franchisor controls. Read it multiple times with a franchise lawyer." },
        { title: "Poor Location Selection", desc: "Choosing based on emotional reasons instead of demographics, foot traffic, competition, and visibility. Location can make or break a franchise." },
        { title: "Hiring Wrong", desc: "Rushing to hire family or friends instead of finding the right talent. Your team is everything. Hire slow, fire fast." },
        { title: "Ignoring Cash Flow", desc: "Confusing profit with cash. You can be profitable on paper but cash-poor. Track cash weekly, not just monthly." }
      ];

      mistakes.forEach((mistake, idx) => {
        doc.fontSize(10).font("Helvetica-Bold").fillColor(gold).text(`${idx + 1}. ${mistake.title}`);
        doc.moveDown(0.2);
        doc.fontSize(9).fillColor("#000000").font("Helvetica").text(mistake.desc, { width: pageWidth });
        doc.moveDown(0.5);
      });

      doc.addPage();

      // Section 4: Lifestyle Expectations
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("4. LIFESTYLE EXPECTATIONS VS. REALITY");
      doc.moveDown(0.5);

      doc.fontSize(10).font("Helvetica-Bold").fillColor("#0066CC").text("What You Hope:");
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor("#000000").text(
        "Be your own boss. Make your own schedule. Unlimited income potential. Control your future.",
        { width: pageWidth }
      );
      doc.moveDown(0.5);

      doc.fontSize(10).font("Helvetica-Bold").fillColor("#C00000").text("What You Get:");
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor("#000000").text([
        "• You ARE your own boss, but the franchise agreement limits your freedom",
        "• Your schedule is dictated by customer demand and staff needs",
        "• Income potential is real, but comes after years of work and reinvestment",
        "• You control operations, but must follow franchisor standards"
      ], { width: pageWidth, lineGap: 5 });
      doc.moveDown(1);

      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("The Honest Truth About Work-Life Balance:");
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text(
        "It doesn't exist during growth phase. Plan for your family to make sacrifices. Plan for missed events, late nights, and stress. If this doesn't align with your values, reconsider before investing.",
        { width: pageWidth }
      );

      doc.addPage();

      // Section 5: Failure Rates
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("5. UNDERSTANDING FAILURE RATES");
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor("#000000").font("Helvetica").text([
        "Industry Data: Approximately 50% of franchises fail within the first 5 years.",
        "",
        "What 'Failure' Means: Closing the business, walking away from investment, having to sell at a loss.",
        "",
        "Why Franchises Fail:",
        "• Location was wrong (traffic, demographics)",
        "• Owner burnout or unwillingness to do the work",
        "• Insufficient capital reserves",
        "• Poor management of staff and finances",
        "• Market changes (new competition, economic downturn)",
        "• Franchisor support fell short of promises"
      ], { width: pageWidth, lineGap: 5 });

      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#666666").font("Helvetica-Italic").text(
        "Franchises with LOWER failure rates share common traits: strong owner commitment, adequate capitalization, good locations, and proven franchisor support systems.",
        { width: pageWidth }
      );

      doc.addPage();

      // Section 6: Questions to Answer Honestly
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("6. QUESTIONS YOU MUST ANSWER HONESTLY");
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor("#000000").font("Helvetica").text([
        "Am I prepared to work 60+ hours per week for the next 2-3 years?",
        "",
        "Can my family handle me being less available for time, vacations, and events?",
        "",
        "Do I have enough capital (25-40% down) WITHOUT jeopardizing my family's security?",
        "",
        "Can I handle the stress of payroll, cash flow, and employee issues?",
        "",
        "Am I coachable? Can I follow the franchisor's system even if I disagree?",
        "",
        "If this fails, can I financially and emotionally recover?",
        "",
        "Why do I REALLY want to do this? (Be honest—is it escape? Status? Money? Passion?)",
        "",
        "Have I talked to 10+ franchisees from the same brand about their REAL experience?"
      ], { width: pageWidth, lineGap: 6 });

      doc.addPage();

      // Closing
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("FINAL THOUGHTS");
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor("#000000").font("Helvetica").text(
        "Franchise ownership CAN be incredibly rewarding. It can provide income, independence, and the satisfaction of building something. But it demands everything—your time, energy, capital, and emotional resilience.",
        { width: pageWidth }
      );
      doc.moveDown(0.8);

      doc.fontSize(10).fillColor("#000000").font("Helvetica").text(
        "If you're looking for a quick path to wealth or a part-time venture, this isn't it. But if you're willing to work hard, stay committed, and build systematically, you can create real success.",
        { width: pageWidth }
      );
      doc.moveDown(0.8);

      doc.fontSize(10).fillColor("#000000").font("Helvetica-Bold").text("The question isn't: 'Can I afford the investment?'");
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text(
        "The real question is: 'Am I willing to pay the price in time, energy, and sacrifice?'",
        { width: pageWidth }
      );
      doc.moveDown(1.5);

      doc.fontSize(11).fillColor(gold).font("Helvetica-Bold").text("Ready for the truth? Let's talk.", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#666666").font("Helvetica").text("Visit franchisefriend.net or schedule a consultation with Charles Stovall.", { align: "center" });

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
