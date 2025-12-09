import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPodcastSchema, insertInvitationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
// @ts-ignore - pdfkit types not available
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

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
  // Configure passport for Google OAuth
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
          const user = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
          };
          return done(null, user);
        }
      )
    );

    passport.serializeUser((user: any, done) => done(null, user));
    passport.deserializeUser((user: any, done) => done(null, user));

    // Google OAuth routes
    app.get(
      "/api/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/client-portal" }),
      async (req: any, res: any) => {
        try {
          const email = req.user?.email;
          if (!email) {
            return res.redirect("/client-portal?error=no-email");
          }

          // Only allow Charles for now
          if (email !== "charles@franchisefriend.net") {
            return res.redirect("/client-portal?error=unauthorized");
          }

          // Store in session
          if (req.session) {
            req.session.memberId = "admin";
            req.session.memberEmail = email;
            req.session.memberName = req.user?.name || "Charles";
          }

          res.redirect("/members-admin");
        } catch (error) {
          console.error("OAuth callback error:", error);
          res.redirect("/client-portal?error=callback-failed");
        }
      }
    );
  }

  // Auth routes
  app.post("/api/auth/login", async (req: any, res: any) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email required" });
      }

      // Check if admin
      if (email === "charles@franchisefriend.net") {
        if (req.session) {
          req.session.memberId = "admin";
          req.session.memberEmail = email;
          req.session.memberName = "Charles Stovall";
          req.session.isAdmin = true;
          await new Promise<void>((resolve) => {
            req.session.save((err: any) => {
              if (err) console.error("Session save error:", err);
              resolve();
            });
          });
        }
        return res.json({ success: true, member: { id: "admin", email, name: "Charles Stovall", isAdmin: true } });
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
        req.session.isAdmin = false;
        await new Promise<void>((resolve) => {
          req.session.save((err: any) => {
            if (err) console.error("Session save error:", err);
            resolve();
          });
        });
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

      // Check if admin
      if (req.session.isAdmin || req.session.memberId === "admin") {
        return res.json({ success: true, member: { id: "admin", email: req.session.memberEmail, name: req.session.memberName, isAdmin: true } });
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
  app.get("/api/invitations", async (req, res) => {
    try {
      const invitations = await storage.getAllInvitations();
      res.json({ success: true, invitations });
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/invitations/:id", async (req, res) => {
    try {
      const success = await storage.deleteInvitation(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, error: "Invitation not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting invitation:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/invitations/send", async (req, res) => {
    try {
      const { email, name, brands: brandData } = req.body;
      if (!email || !name) {
        return res.status(400).json({ success: false, error: "Email and name required" });
      }
      const invitation = await storage.createInvitation(email, name);
      
      // Store brands if provided
      if (brandData && brandData.length > 0) {
        try {
          const member = await storage.getMemberByEmail(email);
          if (member) {
            for (const brand of brandData) {
              await storage.createBrand({
                memberId: member.id,
                name: brand.name,
                website: brand.website,
                devPersonName: brand.devPersonName,
                devPersonEmail: brand.devPersonEmail,
                devPersonPhone: brand.devPersonPhone,
              });
            }
          }
        } catch (brandError) {
          console.error("Error storing brands:", brandError);
        }
      }

      // Send invitation email
      try {
        let transporter;
        if (process.env.EMAIL_SERVICE === "production") {
          transporter = nodemailer.createTransport({
            service: process.env.EMAIL_PROVIDER || "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
        } else {
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        }

        const mailOptions = {
          from: 'noreply@franchisefriend.net',
          to: email,
          subject: 'Your Exclusive Franchise Discovery Invitation - Charles Stovall',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #1E2B42;">You're Invited to the Franchise Discovery Process</h2>
              <p>Hi ${name},</p>
              <p>Charles Stovall has invited you to access the exclusive Franchise Friend Client Portal—a personalized journey through franchise discovery with proven guidance and real-world insights.</p>
              <p style="margin: 30px 0;">
                <strong>Your Invitation Code:</strong><br>
                <code style="background-color: #f5f5f5; padding: 15px; display: inline-block; font-size: 18px; font-weight: bold; border: 1px solid #ddd; border-radius: 4px; letter-spacing: 2px;">
                  ${invitation.invitationCode}
                </code>
              </p>
              <p style="margin: 30px 0;">
                <a href="https://franchisefriend.net/client-portal" style="background-color: #F3AE1B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Access Your Portal</a>
              </p>
              <h3 style="color: #1E2B42; margin-top: 40px;">How to Get Started:</h3>
              <ol style="color: #666;">
                <li>Visit the Client Portal link above</li>
                <li>Use your invitation code: <strong>${invitation.invitationCode}</strong></li>
                <li>Complete your profile</li>
                <li>Begin your guided franchise discovery journey</li>
              </ol>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This invitation is exclusive to you. If you have any questions, reach out to Charles directly.
              </p>
              <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                Best regards,<br>
                <strong>Charles Stovall</strong><br>
                Franchise Friend<br>
                <a href="https://franchisefriend.net" style="color: #F3AE1B; text-decoration: none;">franchisefriend.net</a>
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending invitation email:", emailError);
        // Don't fail the invitation creation if email fails
      }

      res.json({ success: true, invitation });
    } catch (error: any) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/members/redeem", async (req, res) => {
    try {
      const { code, email, name, brands: brandData } = req.body;
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
      const member = await storage.redeemInvitation(code, email, name, brandData);
      
      // Send welcome email after redemption
      try {
        let transporter;
        if (process.env.EMAIL_SERVICE === "production") {
          transporter = nodemailer.createTransport({
            service: process.env.EMAIL_PROVIDER || "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
        } else {
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        }

        const mailOptions = {
          from: 'noreply@franchisefriend.net',
          to: email,
          subject: 'Welcome to Your Franchise Discovery Journey - Charles Stovall',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #1E2B42;">Welcome to Franchise Friend, ${name}!</h2>
              <p>Your account is now active and ready to explore franchise opportunities aligned with your goals.</p>
              <p style="margin: 20px 0;">
                <a href="https://franchisefriend.net/phase1" style="background-color: #F3AE1B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Access Your Discovery Portal</a>
              </p>
              <h3 style="color: #1E2B42; margin-top: 30px;">What's Next:</h3>
              <ol style="color: #666;">
                <li>Start Phase 1: Discovery - Begin understanding your ideal franchise lifestyle</li>
                <li>Complete your Ideal Day Blueprint</li>
                <li>Explore verified franchises that match your profile</li>
                <li>Progress through Phases 2, 3, and 4 at your own pace</li>
              </ol>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Questions? Reach out to Charles directly—I'm here to guide you through every step.
              </p>
              <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                Best regards,<br>
                <strong>Charles Stovall</strong><br>
                Franchise Friend<br>
                <a href="https://franchisefriend.net" style="color: #F3AE1B; text-decoration: none;">franchisefriend.net</a>
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail if email fails - member account is already created
      }

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

  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json({ success: true, members });
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ success: false, error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:memberId/brands", async (req, res) => {
    try {
      const brands = await storage.getBrandsByMemberId(req.params.memberId);
      res.json({ success: true, brands });
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ success: false, error: "Failed to fetch brands" });
    }
  });

  app.put("/api/members/:id", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: "Name required" });
      }
      const member = await storage.updateMember(req.params.id, name);
      if (!member) {
        return res.status(404).json({ success: false, error: "Member not found" });
      }
      res.json({ success: true, member });
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(500).json({ success: false, error: "Failed to update member" });
    }
  });

  app.put("/api/brands/:id", async (req, res) => {
    try {
      const { name, website, logoUrl, devPersonName, devPersonEmail, devPersonPhone } = req.body;
      const updateData: any = {};
      if (name) updateData.name = name;
      if (website) updateData.website = website;
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
      if (devPersonName !== undefined) updateData.devPersonName = devPersonName;
      if (devPersonEmail !== undefined) updateData.devPersonEmail = devPersonEmail;
      if (devPersonPhone !== undefined) updateData.devPersonPhone = devPersonPhone;
      
      const brand = await storage.updateBrand(req.params.id, updateData);
      if (!brand) {
        return res.status(404).json({ success: false, error: "Brand not found" });
      }
      res.json({ success: true, brand });
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ success: false, error: "Failed to update brand" });
    }
  });

  app.delete("/api/brands/:id", async (req, res) => {
    try {
      const success = await storage.deleteBrand(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, error: "Brand not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ success: false, error: "Failed to delete brand" });
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
      const margin = 50;
      const pageWidth = 612 - 2 * margin;

      // Helper to add section header with background
      const addSectionHeader = (title: string) => {
        doc.rect(margin - 10, doc.y - 2, pageWidth + 20, 25).fill("#F5F5F5");
        doc.fontSize(13).font("Helvetica-Bold").fillColor(navyBlue).text(title, margin, doc.y + 5);
        doc.moveDown(1.8);
      };

      // Helper to add ruled lines for writing with better spacing
      const addWritingLines = (height = 60, lineCount = 3) => {
        const lineHeight = height / lineCount;
        for (let i = 0; i < lineCount; i++) {
          doc.moveTo(margin, doc.y + i * lineHeight).lineTo(margin + pageWidth, doc.y + i * lineHeight).stroke();
        }
        doc.moveDown(height / 72 + 0.3);
      };

      // Page 1: Title & Introduction
      doc.fontSize(32).font("Helvetica-Bold").fillColor(navyBlue).text("Your Ideal Day Blueprint", { align: "center" });
      doc.moveDown(0.2);
      doc.fontSize(15).font("Helvetica").fillColor(gold).text("A Guided Discovery Workbook", { align: "center" });
      doc.moveDown(0.1);
      doc.fontSize(11).fillColor("#999999").text("By Charles Stovall - Franchise Friend", { align: "center" });
      doc.moveDown(2);

      // Divider line
      doc.strokeColor("#CCCCCC").lineWidth(1).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
      doc.moveDown(1.5);

      doc.fontSize(11).fillColor("#333333").font("Helvetica").text(
        "Before exploring franchise opportunities, it's essential to understand what success truly means to you. This workbook guides you through discovering your ideal day—the lifestyle, schedule, environment, and impact you want to create.",
        { align: "left", width: pageWidth, lineGap: 4 }
      );
      doc.moveDown(2);

      // Section 1
      addSectionHeader("1. Your Morning Routine");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Reflect on how you'd like to start your day in an ideal franchise business.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• What time do you wake up?     • How much time before work begins?\n• Work from home, office, or mobile?     • What activities energize you?\n• How hands-on vs. delegated?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(0.8);
      addWritingLines(50, 2);
      doc.moveDown(0.5);

      // Section 2
      addSectionHeader("2. Your Work Environment");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Describe where and how you'll thrive professionally.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Physical space (office, home, mobile)?     • Hands-on or managerial?\n• Team size preferences?     • Pace & culture (quiet, fast-paced, creative)?\n• Client interaction level?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(0.8);
      addWritingLines(50, 2);
      doc.moveDown(0.5);

      // Section 3
      addSectionHeader("3. Your Natural Strengths");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Identify what you do best and want to use daily.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Top 3-5 natural talents?     • What past successes energize you?\n• Are you people-focused, systems-oriented, or problem-solver?\n• What should you avoid?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(0.8);
      addWritingLines(50, 2);
      doc.moveDown(1);

      // New page
      doc.addPage();

      // Section 4
      addSectionHeader("4. Financial & Investment Picture");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Clarify your investment capacity and income expectations.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Total investment range & timeframe?     • Annual profit needed?\n• Timeline to profitability?     • Operator or investor-owner?\n• Your risk tolerance?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(0.8);
      addWritingLines(50, 2);
      doc.moveDown(1.5);

      // Section 5
      addSectionHeader("5. Your Values & Impact");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Define what matters most and the impact you want to make.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Non-negotiable values?     • Desired impact (community, family, customers)?\n• Industry preferences?     • Solo or team?\n• Your legacy?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(0.8);
      addWritingLines(50, 2);
      doc.moveDown(1.5);

      // Section 6
      addSectionHeader("6. Lifestyle Integration");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Balance work with your personal life.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Days/hours per week working?     • Family, hobbies, personal growth time?\n• Annual vacation desired?     • Seasonal flexibility?\n• Ideal work-life ratio?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(0.8);
      addWritingLines(50, 2);
      doc.moveDown(1);

      // New page
      doc.addPage();

      // Section 7: Ideal Day Summary
      addSectionHeader("Your Ideal Day Summary");
      doc.fontSize(10).font("Helvetica").fillColor("#666666").text(
        "Write a detailed description of your ideal day. Paint the picture from morning to evening—your environment, the people you interact with, the work you do, and how you feel at the end of the day.",
        { width: pageWidth, lineGap: 3 }
      );
      doc.moveDown(1);
      
      for (let i = 0; i < 12; i++) {
        doc.strokeColor("#333333").lineWidth(0.5).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
        doc.moveDown(0.35);
      }
      
      doc.moveDown(1.5);

      // Next Steps & Closing
      addSectionHeader("Next Steps");
      doc.fontSize(9).font("Helvetica").fillColor("#333333").text([
        "1. Complete this workbook thoughtfully—there are no right or wrong answers",
        "2. Identify 3-5 key priorities from your ideal day vision",
        "3. Share these insights with Charles during your discovery call",
        "4. Use this as your guide when evaluating franchise opportunities",
        "5. Revisit and refine as you progress through the discovery process"
      ], { width: pageWidth, lineGap: 5 });

      doc.moveDown(1.5);
      doc.fontSize(9).fillColor("#666666").text(
        "Ready to take the next step? Schedule a consultation at calendly.com/charles-stovall/intro",
        { align: "center", width: pageWidth, lineGap: 2 }
      );

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      }
    }
  });

  // Phase 1 Exploration Guide PDF endpoint
  app.get("/api/download/phase1-exploration-guide", (req, res) => {
    try {
      const doc = new PDFDocument({ size: "letter", margin: 40, bufferPages: true });
      const chunks: any[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdf = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Phase-1-Exploration-Guide.pdf");
        res.setHeader("Content-Length", pdf.length);
        res.send(pdf);
      });
      
      doc.on('error', (err: any) => {
        console.error("PDF generation error:", err);
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      });

      const navyBlue = "#1E2B42";
      const gold = "#F3AE1B";
      const margin = 50;
      const pageWidth = 612 - 2 * margin;

      const addSectionHeader = (title: string) => {
        doc.rect(margin - 10, doc.y - 2, pageWidth + 20, 25).fill("#F5F5F5");
        doc.fontSize(13).font("Helvetica-Bold").fillColor(navyBlue).text(title, margin, doc.y + 5);
        doc.moveDown(1.8);
      };

      // Title Page
      doc.fontSize(32).font("Helvetica-Bold").fillColor(navyBlue).text("Phase 1 Exploration Guide", { align: "center" });
      doc.moveDown(0.2);
      doc.fontSize(15).font("Helvetica").fillColor(gold).text("Deep Dive into Your Franchise Brands", { align: "center" });
      doc.moveDown(0.1);
      doc.fontSize(11).fillColor("#999999").text("By Charles Stovall - Franchise Friend", { align: "center" });
      doc.moveDown(2);

      doc.strokeColor("#CCCCCC").lineWidth(1).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
      doc.moveDown(1.5);

      doc.fontSize(11).fillColor("#333333").font("Helvetica").text(
        "Now that you've defined your ideal day and personal priorities, it's time to explore your target franchise brands in depth. This guide walks you through the key areas to investigate with each franchisor, helping you gather the information needed to make an informed evaluation.",
        { align: "left", width: pageWidth, lineGap: 4 }
      );
      doc.moveDown(2);

      // Section 1
      addSectionHeader("1. Get to Know the Company");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Understand the founders' vision and the company's track record.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Who are the founders and what inspired them to franchise?\n• How many successful franchisees do they have?\n• What are the company's core values and culture?\n• What's their track record of helping locations succeed?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.2);

      // Section 2
      addSectionHeader("2. The Business Model (Owner's Perspective)");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Understand what your day-to-day role will look like.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• What does the owner actually do day-to-day?\n• How do they acquire and retain customers?\n• What are the critical skills to succeed in this franchise?\n• What separates top performers from average owners?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.2);

      // Section 3
      addSectionHeader("3. The Customer & Market");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Validate there's real demand and customer value.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Who is the typical customer?\n• What specific problems does this business solve?\n• Why do customers choose this franchise over competitors?\n• Is this a sustainable, long-term business model?\n• How is pricing structured? Is it competitive?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.2);

      // Section 4
      addSectionHeader("4. Support, Training & Infrastructure");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Assess the support systems and resources available to you.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• What initial training is provided and how long does it last?\n• What ongoing support do they offer franchisees?\n• What software and technology systems are included?\n• How accessible and responsive is corporate support?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.2);

      // Section 5
      addSectionHeader("5. Financial Snapshot");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Understand the investment required and unit economics.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Total startup costs (franchise fee, equipment, initial inventory, marketing)?\n• Recommended working capital?\n• Typical timeline to break-even and positive cash flow?\n• What are typical revenues and profit margins for mature units?\n• What ongoing fees (royalties, marketing fund, etc.) should you expect?\n• How are most franchisees funding their investment?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.2);

      doc.addPage();

      // Section 6
      addSectionHeader("6. Territory & Growth Potential");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Explore opportunities in your target area.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• Do they have operating locations in your area?\n• What specific territories are available?\n• What's the potential for multi-unit ownership down the road?\n• Are there any protected territories or competing franchisees?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.5);

      // Section 7
      addSectionHeader("7. Questions for the Franchisor Representative");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Vet the person and team helping you through the process.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("• How long have you worked with this company?\n• How many franchisees have you helped bring on?\n• Which franchisees you've brought in have been most successful?\n• Can you connect me with 5-10 owners I can speak with directly?", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.5);

      // Section 8
      addSectionHeader("Key Information You'll Need");
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text("Be ready to share your story and priorities when they ask.", { width: pageWidth });
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#333333").text("✓ Your ideal day blueprint and top 3-5 priorities\n✓ Your investment range and financing capability\n✓ Your skills, background, and what you want to be doing\n✓ Your comfort level with marketing, managing people, and following systems\n✓ Why you're interested in this specific business\n✓ Your location preferences and territory interests", { width: pageWidth, lineGap: 2 });
      doc.moveDown(1.5);

      // Next Steps
      addSectionHeader("Your Exploration Action Plan");
      doc.fontSize(9).font("Helvetica").fillColor("#333333").text([
        "1. Review the Franchise Disclosure Document (FDD) provided by the franchisor",
        "2. Schedule calls with corporate representatives to dive deeper into each area",
        "3. Take detailed notes on their responses—look for consistency and transparency",
        "4. Request referrals to current franchisees (ideally both successful and struggling owners)",
        "5. Compile your findings and identify any red flags or concerns",
        "6. Move forward to Phase 2: Evaluation to validate everything with actual owners"
      ], { width: pageWidth, lineGap: 5 });

      doc.moveDown(2);
      doc.fontSize(9).fillColor("#666666").text(
        "Ready to deepen your exploration? Schedule a call with Charles to discuss what you've learned: calendly.com/charles-stovall/intro",
        { align: "center", width: pageWidth, lineGap: 2 }
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
  // Email thank you endpoint
  app.post("/api/send-thank-you", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email required" });
      }

      // Create test account for development - in production, use SendGrid/AWS SES/etc
      let transporter;
      if (process.env.EMAIL_SERVICE === "production") {
        transporter = nodemailer.createTransport({
          service: process.env.EMAIL_PROVIDER || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
      } else {
        // Development: use Ethereal test email
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      const mailOptions = {
        from: 'noreply@franchisefriend.net',
        to: email,
        subject: 'Your Business Reality Guide + Thank You from Charles Stovall',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #1E2B42;">Thank You for Your Interest!</h2>
            <p>Hi there,</p>
            <p>Your copy of <strong>"The Reality of Business Ownership"</strong> is ready to download. This guide covers:</p>
            <ul>
              <li>The true time commitment (50-70+ hours per week)</li>
              <li>Real financial realities and hidden costs</li>
              <li>Common mistakes franchise owners make</li>
              <li>Lifestyle expectations vs. reality</li>
              <li>Critical questions to answer honestly</li>
            </ul>
            <p style="margin: 30px 0;">
              <a href="https://franchisefriend.net/client-portal" style="background-color: #F3AE1B; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Download Your Guide</a>
            </p>
            <p>This is the honest truth about business ownership—no sugarcoating, no promises of easy wealth.</p>
            <p>If you're ready to have a real conversation about your franchise journey, <strong>let's talk.</strong></p>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              Best regards,<br>
              <strong>Charles Stovall</strong><br>
              Franchise Friend<br>
              <a href="https://franchisefriend.net" style="color: #F3AE1B; text-decoration: none;">franchisefriend.net</a>
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Thank you email sent" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      // Don't fail the PDF download if email fails
      res.json({ success: true, message: "PDF ready (email delivery skipped)" });
    }
  });

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

  app.get("/api/download-book", (req, res) => {
    try {
      const doc = new PDFDocument({ size: "letter", margin: 50, bufferPages: true });
      const chunks: any[] = [];
      
      doc.on('data', (chunk: any) => chunks.push(chunk));
      doc.on('end', () => {
        const pdf = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=the-black-book-of-franchising.pdf");
        res.setHeader("Content-Length", pdf.length);
        res.send(pdf);
      });
      
      doc.on('error', (err: any) => {
        console.error("PDF generation error:", err);
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      });

      const navyBlue = "#1E2B42";
      const gold = "#F3AE1B";
      const green = "#9BD7B3";
      const red = "#C00000";
      const pageWidth = 512 - 2 * 10;

      // PAGE 1 - TITLE PAGE
      doc.fontSize(36).font("Helvetica-Bold").fillColor(navyBlue).text("The Black Book", { align: "center" });
      doc.fontSize(32).fillColor(gold).text("of Franchising", { align: "center" });
      doc.moveDown(1.5);
      doc.fontSize(16).fillColor(green).font("Helvetica-Bold").text("What Every Franchisor Prays You Never Find", { align: "center", width: pageWidth });
      doc.moveDown(2);
      doc.fontSize(12).fillColor("#333333").font("Helvetica").text("The hidden truths about franchise investing that franchisors don't want you to discover.", { align: "center", width: pageWidth });
      doc.moveDown(3);
      doc.fontSize(11).fillColor("#000000").text("By Charles Stovall\nFranchise Friend", { align: "center" });
      doc.moveDown(2);
      doc.fontSize(10).fillColor("#666666").text("187 Pages of Franchise Investment Intelligence", { align: "center" });

      doc.addPage();

      // PAGE 2 - TABLE OF CONTENTS
      doc.fontSize(18).font("Helvetica-Bold").fillColor(navyBlue).text("Table of Contents");
      doc.moveDown(1);
      doc.fontSize(10).fillColor("#000000").font("Helvetica").text([
        "Chapter 1: The Franchising Reality Check",
        "Chapter 2: 37 Red-Flag Phrases in Every FDD",
        "Chapter 3: Decoding Item 19 Financial Data",
        "Chapter 4: The Real Cost of Franchising",
        "Chapter 5: Why 60% of Franchisees Lose Money",
        "Chapter 6: The Renewal Trap",
        "Chapter 7: Understanding Broker Conflicts of Interest",
        "Chapter 8: Building Your Due Diligence Strategy",
        "Chapter 9: Critical Questions for Franchisors",
        "Chapter 10: Red Flags That Mean 'Run'",
        "Chapter 11: Negotiation Tactics That Work",
        "Chapter 12: Exit Strategies Before You Start"
      ], { width: pageWidth, lineGap: 8 });

      doc.addPage();

      // PAGE 3 - CHAPTER 1
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 1: The Franchising Reality Check");
      doc.moveDown(0.8);
      doc.fontSize(11).fillColor(red).font("Helvetica-Bold").text("If you're looking for part-time work, this is NOT for you.");
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor("#000000").text("Business ownership—whether franchise or independent—demands significant time, energy, and commitment. This is not a side project. This is your job.", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(11).fillColor(navyBlue).font("Helvetica-Bold").text("The Hard Facts:");
      doc.moveDown(0.5);
      doc.fontSize(9).text([
        "• Most franchisees work 50-70+ hours per week in their first 2-3 years",
        "• 6-7 day work weeks are common during the growth phase",
        "• You'll be working nights and weekends on administrative tasks",
        "• You'll be 'on call' for emergencies at all times",
        "• Managing staff, finances, and operations is your responsibility",
        "• Vacation time is limited, especially in early years",
        "• The stress of business ownership follows you home"
      ], { width: pageWidth, lineGap: 5 });
      doc.moveDown(1);
      doc.fontSize(10).fillColor("#000000").text("This isn't meant to discourage you. It's meant to set expectations. For the right person with the right attitude, franchising can be incredibly rewarding. But you need to enter with your eyes open.", { width: pageWidth });

      doc.addPage();

      // PAGE 4 - CHAPTER 2
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 2: 37 Red-Flag Phrases in Every FDD");
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#000000").text("The Franchise Disclosure Document is required by law, but it's written to protect the franchisor, not you. Every FDD contains standardized language designed to limit their liability. Here are the phrases you need to understand:", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(red).text([
        "1. 'Past performance is not a guarantee of future results'",
        "2. 'Item 19 - Financial Performance Representations'",
        "3. 'No representations regarding earnings potential'",
        "4. 'Franchisee may earn less than stated averages'",
        "5. 'Substantial variation in franchisee success'",
        "6. 'Franchise agreement may be terminated'",
        "7. 'Non-compete clause applies indefinitely'",
        "8. 'Franchisor may modify operations at any time'",
        "9. 'Royalties and fees are non-refundable'",
        "10. 'Transfer restrictions apply to franchise ownership'",
        "11. 'Franchisor may repurchase at lesser value'",
        "12. 'No profit guarantee is implied or expressed'"
      ], { width: pageWidth, lineGap: 4 });

      doc.addPage();

      // PAGE 5 - CHAPTER 3
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 3: Decoding Item 19 Financial Data");
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#000000").text("Item 19 is supposedly where franchisors share financial performance data. But here's what you need to know:", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(navyBlue).font("Helvetica-Bold").text("The Item 19 Reality:");
      doc.moveDown(0.4);
      doc.fontSize(9).text([
        "• Only ~50% of franchisors provide Item 19 data",
        "• They only provide it when performance is good",
        "• 'Average' means nothing - some franchisees earn 5x while others lose money",
        "• 60% or more of franchisees may lose money despite 'average' data",
        "• Does NOT include the cost of your labor",
        "• Does NOT include owner salary (which franchisees often don't take)",
        "• Does NOT account for personal debt or credit card cash advances",
        "• Historical data is past, not predictive of your future"
      ], { width: pageWidth, lineGap: 4 });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(red).font("Helvetica-Bold").text("What This Means:");
      doc.moveDown(0.3);
      doc.fontSize(9).text("If an 'average' franchisee earns $150K gross, they might actually lose money after expenses, labor, and debt service. Always ask for franchisees who are currently losing money - not just the success stories.", { width: pageWidth });

      doc.addPage();

      // PAGE 6 - CHAPTER 4
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 4: The Real Cost of Franchising");
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#000000").text("Most franchise costs go beyond the initial fee. Here's what you'll really pay:", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(9).fillColor(navyBlue).font("Helvetica-Bold").text("Typical Franchise Cost Breakdown:");
      doc.moveDown(0.4);
      doc.fontSize(9).text([
        "Initial Franchise Fee: $25,000 - $75,000",
        "Real Estate & Buildout: $150,000 - $500,000",
        "Equipment & Inventory: $50,000 - $200,000",
        "Working Capital (first 6-12 months): $30,000 - $100,000",
        "Training & Certification: $5,000 - $50,000",
        "Technology/POS Systems: $10,000 - $30,000",
        "Ongoing Royalties: 5-8% of gross revenue",
        "Marketing/Co-op Fees: 2-3% of gross revenue",
        "Insurance & Legal: $5,000 - $20,000/year"
      ], { width: pageWidth, lineGap: 4 });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(red).font("Helvetica-Bold").text("Total Investment Range: $275,000 - $975,000+");
      doc.moveDown(0.3);
      doc.fontSize(9).text("And you won't see a profit for 18-36 months if you're lucky.", { width: pageWidth });

      doc.addPage();

      // PAGE 7 - CHAPTER 5
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 5: Why 60% of Franchisees Lose Money");
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#000000").text("The statistics are stark. Despite franchises being 'proven systems,' the majority struggle. Here's why:", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(9).text([
        "1. Unsustainable royalty structures eat away at already thin margins",
        "2. Franchisees are required to use expensive franchisor suppliers",
        "3. Territory conflicts - franchisors oversaturate markets",
        "4. Rapid brand changes leave franchisees' marketing investments worthless",
        "5. Technology mandates create ongoing costs franchisees can't control",
        "6. Debt service on the initial investment crushes cash flow",
        "7. Hidden costs not disclosed in the initial franchise fee",
        "8. Franchisees lack control over pricing and operations",
        "9. Franchisor support is often minimal after you've signed",
        "10. Market changes make the franchise model suddenly irrelevant"
      ], { width: pageWidth, lineGap: 5 });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(navyBlue).font("Helvetica-Bold").text("The Bottom Line:");
      doc.moveDown(0.3);
      doc.fontSize(9).text("You're paying for a 'proven' system but still assuming all the business risk. The system proved it works for the franchisor—not necessarily for you.", { width: pageWidth });

      doc.addPage();

      // PAGE 8 - CHAPTER 6
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 6: The Renewal Trap");
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#000000").text("Your franchise agreement is typically 5-10 years. Here's what happens at renewal:", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(9).text([
        "Year 5 Arrives: Your franchise has built brand equity and customer base.",
        "",
        "Renewal Negotiation: Franchisor offers renewal with 'updated' terms:",
        "  • Increased royalty rates (from 6% to 7-8%)",
        "  • New technology requirements with high costs",
        "  • Expanded non-compete clause",
        "  • Franchisor retains option not to renew",
        "",
        "Your Options:",
        "  1. Accept the new terms (lose more profit)",
        "  2. Decline renewal (lose your business)",
        "  3. Sell the business (value drops significantly)",
        "",
        "The Trap: You built the business, but the franchisor controls renewal terms."
      ], { width: pageWidth, lineGap: 3 });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(red).font("Helvetica-Bold").text("This is how franchisors extract maximum value from franchisees over time.");

      doc.addPage();

      // PAGE 9 - CHAPTER 7
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 7: Broker Conflicts of Interest");
      doc.moveDown(0.8);
      doc.fontSize(10).fillColor("#000000").text("Franchise brokers claim to represent your interests, but they're paid by franchisors:", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(navyBlue).font("Helvetica-Bold").text("How Brokers Make Money:");
      doc.moveDown(0.3);
      doc.fontSize(9).text([
        "• Franchisors pay brokers 50% commission on franchise fees",
        "• A $50,000 franchise fee = $25,000 broker commission",
        "• A $100,000 franchise fee = $50,000 broker commission",
        "• Brokers earn MORE from expensive franchises",
        "• Brokers earn NOTHING if you don't buy"
      ], { width: pageWidth, lineGap: 4 });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(red).font("Helvetica-Bold").text("What This Means:");
      doc.moveDown(0.3);
      doc.fontSize(9).text("A broker's incentive is to get you to buy ANY franchise, and preferably an expensive one. They have no stake in your success. They get paid the moment you sign.", { width: pageWidth });
      doc.moveDown(1);
      doc.fontSize(9).fillColor(navyBlue).font("Helvetica-Bold").text("Red Flags with Brokers:");
      doc.moveDown(0.3);
      doc.fontSize(9).text("Recommending franchises without understanding your business goals • Rushing you to sign • Avoiding discussions about failure rates • Not connecting you with struggling franchisees • Discouraging legal review of the FDD", { width: pageWidth });

      doc.addPage();

      // PAGE 10 - CHAPTER 8
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 8: Your Due Diligence Strategy");
      doc.moveDown(0.8);
      doc.fontSize(11).fillColor(navyBlue).font("Helvetica-Bold").text("Step 1: Get Franchisee Contact List");
      doc.moveDown(0.3);
      doc.fontSize(9).text("The FDD includes a list of current franchisees. Contact at least 30 of them. Ask the franchisor for franchisees who've left - they won't provide this voluntarily.", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Step 2: Talk to Struggling Franchisees");
      doc.moveDown(0.3);
      doc.fontSize(9).text("Don't just talk to successful ones. Find franchisees who are losing money or barely breaking even. Ask them honestly: 'If you knew then what you know now, would you buy this franchise?'", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Step 3: Analyze Item 19 (If Provided)");
      doc.moveDown(0.3);
      doc.fontSize(9).text("Item 19 shows gross revenue, not profit. Calculate what franchisees actually earn after expenses, royalties, marketing fees, and debt service. Most numbers drop 40-60%.", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Step 4: Review Franchise Agreement");
      doc.moveDown(0.3);
      doc.fontSize(9).text("Have a franchise lawyer review it (not your regular lawyer). Understand termination clauses, transfer restrictions, non-compete terms, and renewal requirements.", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Step 5: Ask Hard Questions");
      doc.moveDown(0.3);
      doc.fontSize(9).text("See Chapter 9 for the specific questions to ask. Don't accept vague answers. If the franchisor won't answer clearly, that's a red flag.", { width: pageWidth });

      doc.addPage();

      // PAGE 11 - CHAPTER 9
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 9: Critical Questions for Franchisors");
      doc.moveDown(0.8);
      doc.fontSize(9).fillColor(navyBlue).font("Helvetica-Bold").text("Ask these questions. If you don't get clear answers, walk away:");
      doc.moveDown(0.8);
      doc.fontSize(9).text([
        "1. How many franchisees have you terminated or forced out in the past 3 years?",
        "",
        "2. What percentage of franchisees are currently profitable?",
        "",
        "3. What percentage renew their franchise at the 5-year mark?",
        "",
        "4. Can I speak with at least 10 franchisees who are currently losing money?",
        "",
        "5. What is the average franchisee failure rate in my territory?",
        "",
        "6. How has the royalty structure changed in the past 10 years?",
        "",
        "7. What happens to my business if you go bankrupt?",
        "",
        "8. What additional costs aren't listed in the franchise fee?",
        "",
        "9. What marketing support do you actually provide after year 1?",
        "",
        "10. Can I sell my franchise to anyone, or do you control buyers?"
      ], { width: pageWidth, lineGap: 4 });

      doc.addPage();

      // PAGE 12 - CHAPTER 10
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 10: Red Flags That Mean 'Run'");
      doc.moveDown(0.8);
      doc.fontSize(9).fillColor(red).font("Helvetica-Bold").text("If you see any of these, walk away:");
      doc.moveDown(0.8);
      doc.fontSize(9).text([
        "✗ Franchisor won't provide Item 19 data",
        "✗ Franchisor discourages legal review of the FDD",
        "✗ Franchisor won't connect you with current franchisees",
        "✗ Franchisor can't provide references from franchisees",
        "✗ Termination clause allows franchisor to end agreement at will",
        "✗ Franchisees can't sell without franchisor approval",
        "✗ Non-compete applies for 5+ years after exit",
        "✗ Franchisor has history of litigation with franchisees",
        "✗ Financial projections are 'estimates' with no support",
        "✗ Tech changes require expensive upgrades every 2-3 years",
        "✗ Most franchisees operate multiple units (sign of single-unit failure)",
        "✗ Franchisor pushes high-pressure signing before you're ready"
      ], { width: pageWidth, lineGap: 5 });

      doc.addPage();

      // PAGE 13 - CHAPTER 11 & CLOSING
      doc.fontSize(16).font("Helvetica-Bold").fillColor(navyBlue).text("Chapter 11: Negotiation Tactics");
      doc.moveDown(0.8);
      doc.fontSize(9).text([
        "• Royalty Rate: Try to negotiate lower (even 0.5% lower saves $50K+ over 10 years)",
        "• Territory: Get written guarantee of exclusive territory",
        "• Renewal: Negotiate renewable at same terms, not renegotiated rates",
        "• Exit Clause: Push for easier termination if performance targets aren't met",
        "• Transfers: Ensure you can sell to qualified buyers without franchisor blocking",
        "• Tech Costs: Cap annual technology fees",
        "• Training: Get written commitment for ongoing support"
      ], { width: pageWidth, lineGap: 4 });
      doc.moveDown(1.5);
      doc.fontSize(14).font("Helvetica-Bold").fillColor(navyBlue).text("Final Words");
      doc.moveDown(0.5);
      doc.fontSize(10).text("Franchising can work. But only if you do it with clear eyes and realistic expectations. You're not buying a guaranteed path to wealth. You're buying into a system with built-in limitations and risks.", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(10).text("The franchisors who deserve your money are transparent about failures, connect you with struggling franchisees, and structure deals fairly.", { width: pageWidth });
      doc.moveDown(0.8);
      doc.fontSize(11).fillColor(gold).font("Helvetica-Bold").text("Ready for honest guidance? Let's talk.", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#666666").text("Charles Stovall | Franchise Friend", { align: "center" });
      doc.fontSize(9).text("Schedule your consultation at franchisefriend.net", { align: "center" });

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
