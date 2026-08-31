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
import { sendEmail } from "./gmail";
import { sitemapUrls } from "./seo";
import { mountPlainSiteFiles } from "./plain-files";
import { registerAdvisorRoutes } from "./advisor/routes";

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
  mountPlainSiteFiles(app);

  // Dynamic Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const podcasts = await storage.getAllPodcasts();
    const pageUrls = sitemapUrls().map((loc) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`).join("");
    const podcastUrls = podcasts.map(p => `
  <url>
    <loc>https://www.charlesstovall.com/podcasts#episode-${p.id}</loc>
    <lastmod>${(p.publishedAt ? new Date(p.publishedAt) : new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pageUrls}
  ${podcastUrls}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Redirect /home to /
  app.get("/home", (req, res) => {
    res.redirect(301, "/");
  });

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
        // Get admin's actual member record if it exists
        const adminMember = await storage.getMemberByEmail(email);
        const adminId = adminMember?.id || "admin";
        
        // Update last login for admin if they have a database record
        if (adminMember) {
          await storage.updateMemberLastLogin(adminMember.id);
        }
        
        if (req.session) {
          req.session.memberId = adminId;
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
        return res.json({ success: true, member: { id: adminId, email, name: "Charles Stovall", isAdmin: true } });
      }

      // Check if member exists
      const member = await storage.getMemberByEmail(email);
      if (!member) {
        return res.status(401).json({ success: false, error: "No account found with this email. Please contact Charles for an invitation." });
      }

      // Update last login time
      const updatedMember = await storage.updateMemberLastLogin(member.id);

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

      res.json({ success: true, member: updatedMember || member });
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
      const rawBody = req.body && typeof req.body === "object" ? { ...req.body } : {};
      if (!rawBody.name && (rawBody.firstName || rawBody.lastName)) {
        rawBody.name = `${rawBody.firstName || ""} ${rawBody.lastName || ""}`.trim();
      }
      const validatedData = insertLeadSchema.parse(rawBody);
      const lead = await storage.createLead(validatedData);
      
      // Send email notification to Charles for every lead, regardless of type
      try {
        console.log(`[Email] Attempting to send lead notification for ${validatedData.leadType} lead from ${validatedData.name}`);

        const receivedAt = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #1E2B42;">New Lead Received</h2>
            <p><strong>Date/Time:</strong> ${receivedAt} ET</p>
            <p><strong>Lead ID:</strong> ${lead.id}</p>
            <p><strong>Lead Type:</strong> ${validatedData.leadType}</p>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
            ${validatedData.phone ? `<p><strong>Phone:</strong> <a href="tel:${validatedData.phone}">${validatedData.phone}</a></p>` : ""}
            ${validatedData.liquidCapital ? `<p><strong>Liquid Capital:</strong> ${validatedData.liquidCapital}</p>` : ""}
            ${validatedData.timeline ? `<p><strong>Timeline:</strong> ${validatedData.timeline}</p>` : ""}
            ${validatedData.message ? `<p><strong>Message:</strong></p><p style="background: #f5f5f5; padding: 15px; border-radius: 4px;">${validatedData.message}</p>` : ""}
          </div>
        `;

        const result = await sendEmail(
          "charles.stovall@gmail.com",
          `New Lead: ${validatedData.leadType} — ${validatedData.name}`,
          htmlContent
        );
        
        console.log(`[Email] Lead notification sent successfully to charles.stovall@gmail.com - ID: ${result.id}`);
      } catch (emailError) {
        console.error("[Email] Error sending lead notification email:", emailError);
        // Don't fail the lead creation if email fails
      }

      // Auto-responder email to the lead
      try {
        const firstName = validatedData.name
          ? validatedData.name.trim().split(/\s+/)[0].charAt(0).toUpperCase() + validatedData.name.trim().split(/\s+/)[0].slice(1).toLowerCase()
          : "there";

        const autoResponderHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <p>Hi ${firstName},</p>
            <p>Thanks for reaching out. I got your information and I'll personally be in touch within one business day.</p>
            <p>If you'd rather skip the wait and pick a time directly on my calendar, here's my link:<br>
            <a href="https://calendly.com/charles-stovall/intro">https://calendly.com/charles-stovall/intro</a></p>
            <p>I'll be calling from <strong>(919) 827-3921</strong> — feel free to save it so you don't miss the call.</p>
            <p>Talk soon,<br>
            <strong>Charles Stovall</strong><br>
            Franchise Friend<br>
            <a href="mailto:charles.stovall@gmail.com">charles.stovall@gmail.com</a></p>
          </div>
        `;

        await sendEmail(
          validatedData.email,
          `Thanks for reaching out, ${firstName} — next steps inside`,
          autoResponderHtml,
          "charles.stovall@gmail.com"
        );

        console.log(`[Email] Auto-responder sent to ${validatedData.email}`);
      } catch (autoResponderError) {
        console.error("[Email] Error sending auto-responder email:", autoResponderError);
        // Don't fail the lead creation if auto-responder fails
      }

      try {
        const webhookResponse = await fetch("https://services.leadconnectorhq.com/hooks/YKqvXX2cVlnW9pthrGCU/webhook-trigger/3c0fe0ed-c3c0-46d2-8a04-a8fc140ffd6f", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || "",
            message: validatedData.message || "",
            leadType: validatedData.leadType,
          }),
        });
        console.log(`[Webhook] Lead data sent to LeadConnector - Status: ${webhookResponse.status}`);
      } catch (webhookError) {
        console.error("[Webhook] Error sending lead to LeadConnector:", webhookError);
      }
      
      const wantsHtml =
        req.is("application/x-www-form-urlencoded") ||
        req.is("multipart/form-data");
      if (wantsHtml) {
        return res.redirect(303, "/thank-you-ad");
      }

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

  // Admin-only middleware: requires x-admin-token header matching ADMIN_API_TOKEN env var.
  // Returns 401 if the env var is not set or the header doesn't match.
  // Apply only to sensitive read endpoints — never to POST /api/leads (forms must stay public).
  function requireAdminToken(req: any, res: any, next: any) {
    const token = process.env.ADMIN_API_TOKEN;
    if (!token || req.headers["x-admin-token"] !== token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  }

  app.get("/api/leads", requireAdminToken, async (req, res) => {
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

  app.post("/api/brands", async (req, res) => {
    try {
      const { memberId, name, website, devPersonName, devPersonEmail, devPersonPhone } = req.body;
      if (!memberId || !name || !website) {
        return res.status(400).json({ success: false, error: "Member ID, name, and website required" });
      }
      const brand = await storage.createBrand({
        memberId,
        name,
        website,
        devPersonName,
        devPersonEmail,
        devPersonPhone,
      });
      res.json({ success: true, brand });
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ success: false, error: "Failed to create brand" });
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
      const doc = new PDFDocument({ size: "letter", margin: 45, bufferPages: true });
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
      const margin = 45;
      const pageWidth = 612 - 2 * margin;

      const addSectionHeader = (title: string) => {
        doc.rect(margin - 10, doc.y - 2, pageWidth + 20, 22).fill(navyBlue);
        doc.fontSize(12).font("Helvetica-Bold").fillColor(gold).text(title, margin, doc.y + 4);
        doc.moveDown(1.4);
      };

      // Title Page
      doc.fontSize(36).font("Helvetica-Bold").fillColor(navyBlue).text("Phase 1 Exploration Guide", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(16).font("Helvetica-Bold").fillColor(gold).text("Deep Dive into Your Franchise Brands", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(11).fillColor("#666666").text("By Charles Stovall - Franchise Friend", { align: "center" });
      doc.moveDown(1);

      doc.strokeColor(gold).lineWidth(2).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
      doc.moveDown(0.8);

      doc.fontSize(11).font("Helvetica").fillColor("#333333").text(
        "Now that you've clarified your ideal day and priorities, it's time to explore your target franchise brands in depth. This guide walks you through key areas to investigate with each franchisor, ensuring you gather the information needed to make an informed evaluation.",
        { width: pageWidth, align: "left", lineGap: 3 }
      );
      doc.moveDown(1.2);

      // Section 1
      addSectionHeader("1. Get to Know the Company");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Understand the founders' vision and company track record.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• Who are the founders and what inspired them to franchise?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• How many successful franchisees do they have?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What are the company's core values and culture?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What's their track record of helping locations succeed?", { width: pageWidth });
      doc.moveDown(0.9);

      // Section 2
      addSectionHeader("2. The Business Model (Owner's Perspective)");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Understand what your day-to-day role will look like.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• What does the owner actually do day-to-day?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• How do they acquire and retain customers?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What critical skills are needed to succeed?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What separates top performers from average owners?", { width: pageWidth });
      doc.moveDown(0.9);

      // Section 3
      addSectionHeader("3. The Customer & Market");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Validate real demand and customer value.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• Who is the typical customer?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What specific problems does this business solve?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Why do customers choose this franchise over competitors?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Is this a sustainable, long-term business model?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• How is pricing structured and competitive?", { width: pageWidth });
      doc.moveDown(0.9);

      // Section 4
      addSectionHeader("4. Support, Training & Infrastructure");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Assess the support systems and resources available.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• What initial training is provided and for how long?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What ongoing support do they offer franchisees?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What software and technology systems are included?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• How accessible and responsive is corporate support?", { width: pageWidth });
      doc.moveDown(0.9);

      // Section 5
      addSectionHeader("5. Financial Snapshot");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Understand investment required and unit economics.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• Total startup costs (franchise fee, equipment, inventory, marketing)?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Recommended working capital?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Timeline to break-even and positive cash flow?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Typical revenues and profit margins for mature units?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What ongoing fees (royalties, marketing fund) should you expect?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• How are most franchisees funding their investment?", { width: pageWidth });
      doc.moveDown(0.9);

      doc.addPage();

      // Section 6
      addSectionHeader("6. Territory & Growth Potential");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Explore opportunities in your target area.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• Do they have operating locations in your area?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What specific territories are available?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• What's the potential for multi-unit ownership?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Are there protected territories or competing franchisees?", { width: pageWidth });
      doc.moveDown(0.9);

      // Section 7
      addSectionHeader("7. Questions for the Franchisor Representative");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Vet the person and team helping you.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• How long have you worked with this company?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• How many franchisees have you helped bring on?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Which franchisees you've brought in have been most successful?", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Can you connect me with 5-10 owners I can speak with directly?", { width: pageWidth });
      doc.moveDown(0.9);

      // Section 8
      addSectionHeader("What to Share About Yourself");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Be ready to discuss your background and priorities.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("• Your ideal day blueprint and top 3-5 priorities", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Investment range and financing capability", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Skills, background, and what you want to be doing", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Comfort level with marketing, managing people, and systems", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Why you're interested in this specific business", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("• Location preferences and territory interests", { width: pageWidth });
      doc.moveDown(1.2);

      // Action Plan
      addSectionHeader("Your Exploration Action Plan");
      doc.fontSize(10).fillColor("#333333").text("1. Review the Franchise Disclosure Document (FDD) from the franchisor", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("2. Schedule calls with corporate to dive deeper into each area", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("3. Take detailed notes and look for consistency and transparency", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("4. Request referrals to current franchisees—both successful and struggling", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("5. Identify any red flags or concerns from your conversations", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("6. Prepare for Phase 2: Validate everything with actual owners", { width: pageWidth });
      doc.moveDown(1.2);

      doc.strokeColor(gold).lineWidth(1.5).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
      doc.moveDown(0.8);

      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Ready to Deepen Your Exploration?", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#333333").text("Schedule a call with Charles to discuss what you've learned.", { align: "center", width: pageWidth });
      doc.fontSize(10).fillColor(gold).text("calendly.com/charles-stovall/intro", { align: "center" });

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      }
    }
  });

  // Final Decision Checklist PDF endpoint
  app.get("/api/download/final-decision-checklist", (req, res) => {
    try {
      const doc = new PDFDocument({ size: "letter", margin: 45, bufferPages: true });
      const chunks: any[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdf = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Final-Decision-Checklist.pdf");
        res.setHeader("Content-Length", pdf.length);
        res.send(pdf);
      });
      
      doc.on('error', (err: any) => {
        console.error("PDF generation error:", err);
        res.status(500).json({ success: false, error: "Failed to generate PDF" });
      });

      const navyBlue = "#1E2B42";
      const gold = "#F3AE1B";
      const margin = 45;
      const pageWidth = 612 - 2 * margin;

      const addSectionHeader = (title: string) => {
        doc.rect(margin - 10, doc.y - 2, pageWidth + 20, 22).fill(navyBlue);
        doc.fontSize(12).font("Helvetica-Bold").fillColor(gold).text(title, margin, doc.y + 4);
        doc.moveDown(1.4);
      };

      // Title Page
      doc.fontSize(36).font("Helvetica-Bold").fillColor(navyBlue).text("Final Decision Checklist", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(16).font("Helvetica-Bold").fillColor(gold).text("Your Franchise Investment Decision Framework", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(11).fillColor("#666666").text("By Charles Stovall - Franchise Friend", { align: "center" });
      doc.moveDown(1);

      doc.strokeColor(gold).lineWidth(2).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
      doc.moveDown(0.8);

      doc.fontSize(11).font("Helvetica").fillColor("#333333").text(
        "You've completed your research, validation, and Discovery Day. Now it's time to make your final decision. This checklist helps you evaluate whether this franchise truly aligns with your ideal day, goals, and values.",
        { width: pageWidth, align: "left", lineGap: 3 }
      );
      doc.moveDown(1.2);

      // Section 1
      addSectionHeader("1. Does This Franchise Fit Your Ideal Day?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Evaluate alignment with your personal vision.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ Daily schedule matches what I want (hours, location, work type)", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I can maintain the work-life balance I defined", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ The business model leverages my natural strengths", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I can see myself doing this long-term", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ The lifestyle supports my family and personal goals", { width: pageWidth });
      doc.moveDown(1);

      // Section 2
      addSectionHeader("2. Does the Financial Picture Make Sense?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Verify numbers align with your investment capacity.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ Total startup costs are within my budget", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I have adequate working capital beyond initial investment", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Timeline to profitability is realistic and acceptable", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Projected revenues and margins are believable", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ All fees (royalties, marketing, etc.) are clear and reasonable", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Financing options work for my situation", { width: pageWidth });
      doc.moveDown(1);

      // Section 3
      addSectionHeader("3. Is the Franchisor a Trustworthy Partner?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Assess the relationship and support system.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ Corporate leadership and team are competent and honest", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Support systems are responsive and genuinely helpful", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Training is comprehensive and ongoing", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ They provide marketing/tech/operational support as promised", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Track record shows franchisee success and support", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Communication style and values align with mine", { width: pageWidth });
      doc.moveDown(1);

      // Section 4
      addSectionHeader("4. Are the Franchisees Satisfied?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Validate reality through owner experiences.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ Majority of franchisees I spoke with are profitable", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ They would make the same investment decision again", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ They feel supported by corporate when issues arise", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Their day-to-day reality matches corporate promises", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Even struggling owners don't regret the decision", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Growth/multi-unit opportunities are real", { width: pageWidth });
      doc.moveDown(1);

      doc.addPage();

      // Section 5
      addSectionHeader("5. Does This Align With My Values?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Ensure cultural and values fit.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ The industry and business model align with my values", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I'm comfortable with the product/service quality standards", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ The community of franchisees feels supportive and collaborative", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Corporate culture reflects the values I care about", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I feel good about the impact I'll make in my community", { width: pageWidth });
      doc.moveDown(1.2);

      // Section 6
      addSectionHeader("6. Have I Done Due Diligence?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Confirm all essential homework is complete.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ I reviewed the Franchise Disclosure Document thoroughly", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I had an attorney review the franchise agreement", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I had an accountant review the financials", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I spoke with at least 5-10 current franchisees", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I spoke with at least one former franchisee", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ Item 19 financial data makes sense for my market", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I've confirmed territory availability in my area", { width: pageWidth });
      doc.moveDown(1.2);

      // Section 7
      addSectionHeader("7. Am I Ready to Commit?");
      doc.fontSize(10).font("Helvetica-Bold").fillColor(navyBlue).text("Final personal readiness check.", { width: pageWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("☐ I'm mentally ready for the responsibility and risk", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ My family/support system is on board with this decision", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I understand what success requires from me", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I'm not rushing into this for the wrong reasons", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I'm excited and energized about this opportunity", { width: pageWidth });
      doc.fontSize(10).fillColor("#333333").text("☐ I trust my gut feeling about this franchise", { width: pageWidth });
      doc.moveDown(1.5);

      // Final section
      doc.strokeColor(gold).lineWidth(1.5).moveTo(margin, doc.y).lineTo(margin + pageWidth, doc.y).stroke();
      doc.moveDown(0.8);

      doc.fontSize(11).font("Helvetica-Bold").fillColor(navyBlue).text("Ready to Move Forward?", { align: "center" });
      doc.moveDown(0.4);
      doc.fontSize(10).fillColor("#333333").text("If you've checked the majority of these boxes, you're ready to move forward.", { align: "center", width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#333333").text("If concerns remain, revisit those areas with corporate or franchisees.", { align: "center", width: pageWidth });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor(gold).text("Next step: Schedule a call with Charles to discuss your decision.", { align: "center" });
      doc.fontSize(10).fillColor(gold).text("calendly.com/charles-stovall/intro", { align: "center" });

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
  // Book request endpoint
  app.post("/api/request-book", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "Email required" });
      }

      // Send email to Charles notifying him of the book request
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
          to: process.env.EMAIL_USER || 'charles@franchisefriend.net',
          subject: 'New Book Request from franchisefriend.net',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #1E2B42;">New Book Request</h2>
              <p>Someone has requested "The Reality of Business Ownership" guide:</p>
              <p style="margin: 20px 0;">
                <strong>Email:</strong> ${email}
              </p>
              <p style="color: #666; font-size: 14px;">
                Please send them a copy of the guide at your convenience.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending book request email:", emailError);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing book request:", error);
      res.status(500).json({ success: false, error: "Failed to process request" });
    }
  });

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

  await registerAdvisorRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
