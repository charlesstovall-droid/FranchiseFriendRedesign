import type { Express, Request, Response } from "express";
import { z } from "zod";
import {
  CALL_HANDOFF,
  DEFAULT_CALENDLY_URL,
  THESIS_CONCLUSION,
  type AdvisorChapter,
  type OwnershipThesis,
} from "@shared/advisor";
import { DEFAULT_ADVISOR_COPY } from "@shared/advisor-copy";
import { adminConfigured, establishAdvisorAdminSession, isExistingAdminSession, loginRateOk, requireAdvisorAdmin, verifyAdvisorAdminPassword } from "./auth";
import { brandsToCsv, csvToBrandRows } from "./csv";
import { detectFollowUpHints } from "./followups";
import { ensureHubspotProperties, isHubspotConfigured, upsertAdvisorContact } from "./hubspot";
import { ensureAdvisorTables } from "./migrate";
import { AdvisorNotConfiguredError, isAdvisorConfigured, isOpenAiAuthFailure } from "./ai/provider";
import { runAdvisorTurn, runBriefGeneration, runThesisGeneration } from "./ai/orchestrator";
import { renderOwnershipThesisPdf } from "./pdf";
import { contactReady, primaryConflict, profileFromRow, summarizeProfile } from "./profile";
import { clientKey, rateLimit } from "./rate-limit";
import { publicCopyFromSettings } from "./settings";
import * as store from "./storage";
import { getAppBaseUrl } from "./tokens";

const turnBody = z.object({
  message: z.string().trim().min(1).max(4000),
  inputType: z.string().max(40).optional(),
});

const contactBody = z.object({
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type CandidateSession = {
  advisorResumeToken?: string;
  advisorConversationId?: string;
  advisorAdmin?: boolean;
  advisorAdminEmail?: string;
  memberEmail?: string;
};

function sessionOf(req: Request) {
  return req.session as unknown as CandidateSession;
}

function publicCandidate(candidate: { firstName: string | null; status: string; bookingStatus: string; resumeToken: string; reportToken: string | null }) {
  return {
    firstName: candidate.firstName,
    status: candidate.status,
    bookingStatus: candidate.bookingStatus,
    resumeToken: candidate.resumeToken,
    reportToken: candidate.reportToken,
  };
}

async function loadSessionCandidate(req: Request) {
  const token = sessionOf(req).advisorResumeToken;
  if (!token) return null;
  const candidate = await store.getCandidateByResumeToken(token);
  if (!candidate || candidate.archivedAt) return null;
  return candidate;
}

export async function registerAdvisorRoutes(app: Express) {
  try {
    await ensureAdvisorTables();
  } catch (error) {
    console.error("[advisor] Failed to ensure tables:", error);
  }

  app.get("/api/advisor/status", async (_req, res) => {
    const settings = await store.getSettingsMap().catch(() => ({}));
    res.json({
      configured: isAdvisorConfigured(),
      hubspot: isHubspotConfigured(),
      copy: publicCopyFromSettings(settings),
    });
  });

  app.get("/api/advisor/copy", async (_req, res) => {
    const settings = await store.getSettingsMap();
    res.json({ copy: publicCopyFromSettings(settings) });
  });

  app.post("/api/advisor/conversations", async (req, res) => {
    try {
      const limited = rateLimit({ key: clientKey(req, "advisor-start"), limit: 20, windowMs: 10 * 60 * 1000 });
      if (!limited.ok) return res.status(429).json({ error: "Please wait a moment before starting again." });

      const settings = await store.getSettingsMap();
      const copy = publicCopyFromSettings(settings);
      const { candidate, conversation } = await store.createCandidateSession();
      const opening = copy.openingMessage || DEFAULT_ADVISOR_COPY.openingMessage;
      await store.addMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: opening,
        chapter: "why_now",
      });
      await store.trackEvent({ candidateId: candidate.id, eventName: "advisor_start", chapter: "why_now" });
      await store.writeAudit({ actorType: "candidate", actorId: candidate.id, action: "conversation_started" });

      const session = sessionOf(req);
      session.advisorResumeToken = candidate.resumeToken;
      session.advisorConversationId = conversation.id;

      res.json({
        configured: isAdvisorConfigured(),
        resumeToken: candidate.resumeToken,
        conversationId: conversation.id,
        chapter: "why_now",
        openingMessage: opening,
        copy,
      });
    } catch (error) {
      console.error("[advisor] start failed:", error);
      res.status(500).json({ error: "Could not start the conversation." });
    }
  });

  app.get("/api/advisor/conversations/current", async (req, res) => {
    const candidate = await loadSessionCandidate(req);
    if (!candidate) return res.status(404).json({ error: "No active conversation" });
    const bundle = await store.getCandidateBundle(candidate.id);
    if (!bundle) return res.status(404).json({ error: "Conversation not found" });
    res.json({
      configured: isAdvisorConfigured(),
      candidate: publicCandidate(candidate),
      chapter: bundle.conversation?.currentChapter || "why_now",
      messages: bundle.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        chapter: m.chapter,
        createdAt: m.createdAt,
      })),
      hasThesis: Boolean(bundle.report),
      reportToken: bundle.report?.reportToken || candidate.reportToken,
    });
  });

  app.get("/api/advisor/resume/:token", async (req, res) => {
    const candidate = await store.getCandidateByResumeToken(req.params.token);
    if (!candidate || candidate.archivedAt) return res.status(404).json({ error: "This resume link is not valid." });
    const session = sessionOf(req);
    session.advisorResumeToken = candidate.resumeToken;
    const conversation = await store.getConversationByCandidate(candidate.id);
    if (conversation) session.advisorConversationId = conversation.id;
    await store.trackEvent({ candidateId: candidate.id, eventName: "candidate_return", chapter: conversation?.currentChapter });
    res.json({
      ok: true,
      resumeToken: candidate.resumeToken,
      reportToken: candidate.reportToken,
      status: candidate.status,
    });
  });

  app.post("/api/advisor/conversations/:token/consent", async (req, res) => {
    const candidate = await store.getCandidateByResumeToken(req.params.token);
    if (!candidate) return res.status(404).json({ error: "Not found" });
    await store.touchCandidate(candidate.id, {
      privacyConsentAt: new Date(),
      aiDisclosureAcknowledgedAt: new Date(),
    });
    res.json({ ok: true });
  });

  app.post("/api/advisor/conversations/:token/turns", async (req, res) => {
    const limited = rateLimit({ key: clientKey(req, "advisor-turn"), limit: 20, windowMs: 10 * 60 * 1000 });
    if (!limited.ok) return res.status(429).json({ error: "Please wait a moment before sending another answer." });

    const parsed = turnBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Please share a written answer." });

    const candidate = await store.getCandidateByResumeToken(req.params.token);
    if (!candidate || candidate.archivedAt) return res.status(404).json({ error: "Conversation not found." });
    const conversation = await store.getConversationByCandidate(candidate.id);
    if (!conversation) return res.status(404).json({ error: "Conversation not found." });

    if (!isAdvisorConfigured()) {
      return res.status(503).json({
        error: DEFAULT_ADVISOR_COPY.unconfiguredMessage,
        configured: false,
      });
    }

    try {
      const settings = await store.getSettingsMap();
      const profileRow = await store.getProfile(candidate.id);
      const messages = await store.getRecentMessages(conversation.id, 12);
      const brands = await store.listAiApprovedBrands();
      const priorReasons = ((profileRow?.contradictionsIdentified as Array<{ tension: string }> | undefined) || []).map((c) => c.tension);

      await store.addMessage({
        conversationId: conversation.id,
        role: "user",
        content: parsed.data.message,
        chapter: conversation.currentChapter,
        inputType: parsed.data.inputType || "written",
      });

      const { output, mergedProfile } = await runAdvisorTurn({
        settings,
        chapter: conversation.currentChapter as AdvisorChapter,
        profile: { ...profileRow, firstName: candidate.firstName, lastName: candidate.lastName, email: candidate.email, phone: candidate.phone, city: candidate.city, state: candidate.state },
        messages,
        userMessage: parsed.data.message,
        priorFollowUpReasons: priorReasons,
        approvedBrands: brands,
      });

      await store.updateProfile(candidate.id, mergedProfile, {
        contradictionsIdentified: output.contradictions_detected,
        recommendedNextQuestions: output.next_question ? [output.next_question] : [],
        confidenceByField: output.confidence_by_field,
        rawExtracted: output.extracted_candidate_data,
      });
      await store.updateConversation(conversation.id, { currentChapter: output.current_chapter });
      if (output.current_chapter !== conversation.currentChapter) {
        await store.trackEvent({
          candidateId: candidate.id,
          eventName: "chapter_complete",
          chapter: conversation.currentChapter,
        });
      }

      const assistantText = output.candidate_message;
      await store.addMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: assistantText,
        chapter: output.current_chapter,
      });

      res.json({
        configured: true,
        message: assistantText,
        chapter: output.current_chapter,
        suggestedAnswers: output.suggested_answers,
        inputMode: output.input_mode,
        readyForThesis: output.ready_for_thesis,
        askedForContact: output.asked_for_contact,
        financialDisclaimerNeeded: output.financial_disclaimer_needed,
        firstName: mergedProfile.firstName || candidate.firstName,
        resumeToken: candidate.resumeToken,
      });
    } catch (error) {
      if (error instanceof AdvisorNotConfiguredError || isOpenAiAuthFailure(error)) {
        const message = error instanceof Error ? error.message : "unconfigured";
        console.error("[advisor] turn failed:", message);
        return res.status(503).json({ error: DEFAULT_ADVISOR_COPY.unconfiguredMessage, configured: false });
      }
      console.error("[advisor] turn failed:", error instanceof Error ? error.message : error);
      res.status(500).json({ error: "I could not take that turn. Please try once more." });
    }
  });

  app.post("/api/advisor/conversations/:token/thesis", async (req, res) => {
    const limited = rateLimit({ key: clientKey(req, "advisor-thesis"), limit: 8, windowMs: 10 * 60 * 1000 });
    if (!limited.ok) return res.status(429).json({ error: "Please wait a moment before generating again." });
    const candidate = await store.getCandidateByResumeToken(req.params.token);
    if (!candidate) return res.status(404).json({ error: "Conversation not found." });
    if (!isAdvisorConfigured()) {
      return res.status(503).json({ error: DEFAULT_ADVISOR_COPY.unconfiguredMessage, configured: false });
    }
    try {
      const thesis = await generateAndStoreThesis(candidate.id, req);
      res.json({
        reportToken: thesis.reportToken,
        reportUrl: `${getAppBaseUrl(req)}/advisor/report/${thesis.reportToken}`,
        thesis: thesis.thesis,
        handoff: CALL_HANDOFF,
      });
    } catch (error) {
      console.error("[advisor] thesis failed:", error);
      res.status(500).json({ error: "The Ownership Thesis could not be written yet. Try again in a moment." });
    }
  });

  app.get("/api/advisor/reports/:token", async (req, res) => {
    const report = await store.getReportByToken(req.params.token);
    if (!report) return res.status(404).json({ error: "This report link is not valid." });
    const candidate = await store.getCandidateById(report.candidateId);
    if (!candidate || candidate.archivedAt) return res.status(404).json({ error: "This report link is not valid." });
    const settings = await store.getSettingsMap();
    const copy = publicCopyFromSettings(settings);
    res.json({
      thesis: report.thesis,
      conclusion: THESIS_CONCLUSION,
      handoff: copy.callHandoff,
      bookingCta: copy.bookingCta,
      calendlyUrl: process.env.CALENDLY_URL || copy.calendlyUrl || DEFAULT_CALENDLY_URL,
      firstName: candidate.firstName,
      hasContact: Boolean(candidate.email),
      bookingStatus: candidate.bookingStatus,
      resumeToken: candidate.resumeToken,
    });
  });

  app.get("/api/advisor/reports/:token/pdf", async (req, res) => {
    const report = await store.getReportByToken(req.params.token);
    if (!report) return res.status(404).json({ error: "This report link is not valid." });
    const candidate = await store.getCandidateById(report.candidateId);
    const pdf = await renderOwnershipThesisPdf({
      thesis: report.thesis as OwnershipThesis,
      candidateName: [candidate?.firstName, candidate?.lastName].filter(Boolean).join(" ") || undefined,
      reportUrl: `${getAppBaseUrl(req)}/advisor/report/${report.reportToken}`,
    });
    await store.trackEvent({ candidateId: report.candidateId, eventName: "report_download" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="ownership-thesis.pdf"');
    res.send(pdf);
  });

  app.post("/api/advisor/reports/:token/contact", async (req, res) => {
    const parsed = contactBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "A valid email and phone are required to save or share the thesis." });
    const report = await store.getReportByToken(req.params.token);
    const candidate = report
      ? await store.getCandidateById(report.candidateId)
      : await store.getCandidateByResumeToken(req.params.token);
    if (!candidate) return res.status(404).json({ error: "Not found" });
    const profile = await store.getProfile(candidate.id);
    await store.touchCandidate(candidate.id, {
      firstName: parsed.data.firstName || candidate.firstName,
      lastName: parsed.data.lastName || candidate.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
    });
    await store.updateProfile(candidate.id, {
      ...profileFromRow(profile as Record<string, unknown>),
      firstName: parsed.data.firstName || candidate.firstName,
      lastName: parsed.data.lastName || candidate.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
    });
    await store.trackEvent({ candidateId: candidate.id, eventName: "contact_submit" });
    const reportUrl = candidate.reportToken ? `${getAppBaseUrl(req)}/advisor/report/${candidate.reportToken}` : null;
    const sync = await upsertAdvisorContact({
      candidateId: candidate.id,
      email: parsed.data.email,
      firstName: parsed.data.firstName || candidate.firstName,
      lastName: parsed.data.lastName || candidate.lastName,
      phone: parsed.data.phone,
      profile: profileFromRow(profile as Record<string, unknown>),
      status: candidate.status,
      reportUrl,
      bookingStatus: candidate.bookingStatus,
      contradictions: (profile?.contradictionsIdentified as Array<{ tension: string; question: string }>) || [],
      completedAt: candidate.status === "completed" ? candidate.updatedAt : null,
      note: `Ownership Advisor summary\n\n${summarizeProfile(profileFromRow(profile as Record<string, unknown>))}\n\nPrimary conflict: ${primaryConflict(profile?.contradictionsIdentified as Array<{ tension: string; question: string }>) || "none recorded"}`,
    });
    res.json({
      ok: true,
      reportUrl,
      resumeUrl: `${getAppBaseUrl(req)}/advisor/resume/${candidate.resumeToken}`,
      hubspot: { synced: Boolean(sync.contactId), skipped: sync.skipped },
    });
  });

  app.post("/api/advisor/reports/:token/booking", async (req, res) => {
    const status = z.enum(["booked", "declined", "not_decided"]).safeParse(req.body?.status);
    if (!status.success) return res.status(400).json({ error: "Invalid booking status" });
    const report = await store.getReportByToken(req.params.token);
    const candidate = report
      ? await store.getCandidateById(report.candidateId)
      : await store.getCandidateByResumeToken(req.params.token);
    if (!candidate) return res.status(404).json({ error: "Not found" });
    const calendlyUrl = process.env.CALENDLY_URL || DEFAULT_CALENDLY_URL;
    await store.addBookingEvent(candidate.id, status.data, calendlyUrl);
    if (status.data === "booked") {
      await store.trackEvent({ candidateId: candidate.id, eventName: "booking_confirmed" });
    } else if (req.body?.clicked) {
      await store.trackEvent({ candidateId: candidate.id, eventName: "booking_link_click" });
    }
    if (candidate.email) {
      const profile = await store.getProfile(candidate.id);
      await upsertAdvisorContact({
        candidateId: candidate.id,
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        phone: candidate.phone,
        profile: profileFromRow(profile as Record<string, unknown>),
        status: candidate.status,
        reportUrl: candidate.reportToken ? `${getAppBaseUrl(req)}/advisor/report/${candidate.reportToken}` : null,
        bookingStatus: status.data,
        contradictions: (profile?.contradictionsIdentified as Array<{ tension: string; question: string }>) || [],
      });
    }
    res.json({ ok: true, bookingStatus: status.data, calendlyUrl });
  });

  app.post("/api/advisor/deletion-requests", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!email && !token) return res.status(400).json({ error: "Email or private link is required." });
    let candidate = email ? await store.findCandidateByEmail(email) : undefined;
    if (!candidate && token) {
      candidate = (await store.getCandidateByResumeToken(token)) || (await store.getCandidateByReportToken(token));
    }
    await store.createDeletionRequest({
      candidateId: candidate?.id,
      email: email || candidate?.email || undefined,
      tokenProvided: token || undefined,
      message,
    });
    await store.trackEvent({ candidateId: candidate?.id, eventName: "deletion_request" });
    res.json({ ok: true });
  });

  app.post("/api/advisor/admin/login", async (req, res) => {
    const limited = loginRateOk(req);
    if (!limited.ok) return res.status(429).json({ error: `Too many attempts. Try again in ${limited.retryAfterSec} seconds.` });
    const parsed = loginBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Email and password are required." });
    const ok = await verifyAdvisorAdminPassword(parsed.data.email, parsed.data.password);
    if (!ok) return res.status(401).json({ error: "Those credentials are not valid." });
    await establishAdvisorAdminSession(req, parsed.data.email);
    await store.writeAudit({ actorType: "admin", actorId: parsed.data.email, action: "admin_login" }).catch(() => undefined);
    res.json({ ok: true, email: parsed.data.email });
  });

  app.post("/api/advisor/admin/logout", (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  app.get("/api/advisor/admin/me", (req, res) => {
    if (!isExistingAdminSession(req)) return res.status(401).json({ error: "Unauthorized" });
    res.json({
      ok: true,
      email: sessionOf(req).advisorAdminEmail || sessionOf(req).memberEmail,
      auth: adminConfigured(),
    });
  });

  app.get("/api/advisor/admin/candidates", requireAdvisorAdmin, async (req, res) => {
    const rows = await store.listCandidates({
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      status: typeof req.query.status === "string" ? req.query.status : undefined,
      bookingStatus: typeof req.query.booking === "string" ? req.query.booking : undefined,
      capital: typeof req.query.capital === "string" ? req.query.capital : undefined,
      timeline: typeof req.query.timeline === "string" ? req.query.timeline : undefined,
      role: typeof req.query.role === "string" ? req.query.role : undefined,
      conflict: typeof req.query.conflict === "string" ? req.query.conflict : undefined,
      includeArchived: req.query.archived === "1",
    });
    res.json({
      candidates: rows.map((row) => ({
        id: row.candidate.id,
        firstName: row.candidate.firstName,
        lastName: row.candidate.lastName,
        email: row.candidate.email,
        phone: row.candidate.phone,
        city: row.candidate.city,
        state: row.candidate.state,
        status: row.candidate.status,
        bookingStatus: row.candidate.bookingStatus,
        liquidCapitalRange: row.profile?.liquidCapitalRange,
        timeline: row.profile?.timelineToAct || row.profile?.incomeReplacementTimeline,
        preferredOwnerRole: row.profile?.preferredOwnerRole,
        primaryConflict: primaryConflict(row.profile?.contradictionsIdentified as Array<{ tension: string; question: string }>),
        lastActiveAt: row.candidate.lastActiveAt,
        createdAt: row.candidate.createdAt,
        reportToken: row.candidate.reportToken,
        hasReport: Boolean(row.report),
      })),
    });
  });

  app.get("/api/advisor/admin/candidates/:id", requireAdvisorAdmin, async (req, res) => {
    const bundle = await store.getCandidateBundle(req.params.id);
    if (!bundle) return res.status(404).json({ error: "Candidate not found" });
    res.json({
      ...bundle,
      reportUrl: bundle.candidate.reportToken ? `${getAppBaseUrl(req)}/advisor/report/${bundle.candidate.reportToken}` : null,
      resumeUrl: `${getAppBaseUrl(req)}/advisor/resume/${bundle.candidate.resumeToken}`,
      hubspotConfigured: isHubspotConfigured(),
    });
  });

  app.post("/api/advisor/admin/candidates/:id/archive", requireAdvisorAdmin, async (req, res) => {
    await store.archiveCandidate(req.params.id);
    await store.writeAudit({ actorType: "admin", action: "archive_candidate", entityId: req.params.id });
    res.json({ ok: true });
  });

  app.post("/api/advisor/admin/candidates/:id/delete", requireAdvisorAdmin, async (req, res) => {
    await store.fulfillDeletion(req.params.id);
    await store.writeAudit({ actorType: "admin", action: "delete_candidate", entityId: req.params.id });
    res.json({ ok: true });
  });

  app.patch("/api/advisor/admin/candidates/:id/brief", requireAdvisorAdmin, async (req, res) => {
    const updated = await store.updateBriefEdits(req.params.id, {
      editedBrief: req.body?.editedBrief,
      privateNotes: req.body?.privateNotes,
    });
    res.json({ brief: updated });
  });

  app.post("/api/advisor/admin/candidates/:id/brief/regenerate", requireAdvisorAdmin, async (req, res) => {
    if (!isAdvisorConfigured()) return res.status(503).json({ error: "OpenAI is not configured." });
    const bundle = await store.getCandidateBundle(req.params.id);
    if (!bundle?.report) return res.status(400).json({ error: "Generate a thesis before the meeting brief." });
    const settings = await store.getSettingsMap();
    const brief = await runBriefGeneration({
      settings,
      profile: bundle.profile as Record<string, unknown>,
      thesis: bundle.report.thesis as OwnershipThesis,
      firstName: bundle.candidate.firstName,
    });
    const saved = await store.saveBrief({
      candidateId: bundle.candidate.id,
      reportId: bundle.report.id,
      brief,
    });
    res.json({ brief: saved });
  });

  app.get("/api/advisor/admin/brands", requireAdvisorAdmin, async (_req, res) => {
    res.json({ brands: await store.listApprovedBrands() });
  });

  app.post("/api/advisor/admin/brands", requireAdvisorAdmin, async (req, res) => {
    const name = String(req.body?.brandName || "").trim();
    if (!name) return res.status(400).json({ error: "Brand name is required." });
    const brand = await store.createApprovedBrand({
      brandName: name,
      category: req.body.category,
      investmentRange: req.body.investmentRange,
      minLiquidity: req.body.minLiquidity,
      ownerRole: req.body.ownerRole,
      employeeProfile: req.body.employeeProfile,
      salesModel: req.body.salesModel,
      recurringRevenueCharacteristics: req.body.recurringRevenueCharacteristics,
      brickAndMortarRequirements: req.body.brickAndMortarRequirements,
      buildoutLevel: req.body.buildoutLevel,
      typicalDevelopmentStructure: req.body.typicalDevelopmentStructure,
      availableTerritories: req.body.availableTerritories,
      fddYear: req.body.fddYear,
      sbaDirectoryStatus: req.body.sbaDirectoryStatus,
      chuckNotes: req.body.chuckNotes,
      approvedForAi: Boolean(req.body.approvedForAi),
      dateLastVerified: req.body.dateLastVerified ? new Date(req.body.dateLastVerified) : null,
    });
    res.json({ brand });
  });

  app.patch("/api/advisor/admin/brands/:id", requireAdvisorAdmin, async (req, res) => {
    const brand = await store.updateApprovedBrand(req.params.id, {
      ...req.body,
      dateLastVerified: req.body.dateLastVerified ? new Date(req.body.dateLastVerified) : req.body.dateLastVerified,
      updatedAt: new Date(),
    });
    res.json({ brand });
  });

  app.delete("/api/advisor/admin/brands/:id", requireAdvisorAdmin, async (req, res) => {
    await store.deleteApprovedBrand(req.params.id);
    res.json({ ok: true });
  });

  app.get("/api/advisor/admin/brands/export.csv", requireAdvisorAdmin, async (_req, res) => {
    const csv = brandsToCsv(await store.listApprovedBrands());
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=approved-brands.csv");
    res.send(csv);
  });

  app.post("/api/advisor/admin/brands/import", requireAdvisorAdmin, async (req, res) => {
    const csv = typeof req.body?.csv === "string" ? req.body.csv : "";
    if (!csv.trim()) return res.status(400).json({ error: "CSV text is required." });
    const rows = csvToBrandRows(csv);
    let imported = 0;
    for (const row of rows) {
      const brandName = row.brandName || row.BrandName || row.name;
      if (!brandName) continue;
      await store.createApprovedBrand({
        brandName,
        category: row.category,
        investmentRange: row.investmentRange,
        minLiquidity: row.minLiquidity,
        ownerRole: row.ownerRole,
        employeeProfile: row.employeeProfile,
        salesModel: row.salesModel,
        recurringRevenueCharacteristics: row.recurringRevenueCharacteristics,
        brickAndMortarRequirements: row.brickAndMortarRequirements,
        buildoutLevel: row.buildoutLevel,
        typicalDevelopmentStructure: row.typicalDevelopmentStructure,
        availableTerritories: row.availableTerritories,
        fddYear: row.fddYear,
        sbaDirectoryStatus: row.sbaDirectoryStatus,
        chuckNotes: row.chuckNotes,
        approvedForAi: /^(1|true|yes)$/i.test(row.approvedForAi || ""),
        dateLastVerified: row.dateLastVerified ? new Date(row.dateLastVerified) : null,
      });
      imported += 1;
    }
    res.json({ imported });
  });

  app.get("/api/advisor/admin/settings", requireAdvisorAdmin, async (_req, res) => {
    res.json({ settings: await store.getSettingsMap() });
  });

  app.put("/api/advisor/admin/settings", requireAdvisorAdmin, async (req, res) => {
    const entries = req.body?.settings;
    if (!entries || typeof entries !== "object") return res.status(400).json({ error: "settings object required" });
    for (const [key, value] of Object.entries(entries)) {
      await store.upsertSetting(key, value, "admin");
    }
    res.json({ settings: await store.getSettingsMap() });
  });

  app.get("/api/advisor/admin/analytics", requireAdvisorAdmin, async (_req, res) => {
    res.json(await store.analyticsSummary());
  });

  app.get("/api/advisor/admin/hubspot-events", requireAdvisorAdmin, async (_req, res) => {
    res.json({ events: await store.listHubspotEvents() });
  });

  app.post("/api/advisor/admin/hubspot-properties", requireAdvisorAdmin, async (_req, res) => {
    res.json(await ensureHubspotProperties());
  });

  app.get("/api/advisor/admin/deletion-requests", requireAdvisorAdmin, async (_req, res) => {
    res.json({ requests: await store.listDeletionRequests() });
  });

  app.post("/api/advisor/admin/deletion-requests/:id/resolve", requireAdvisorAdmin, async (req, res) => {
    const row = await store.resolveDeletionRequest(req.params.id);
    if (row?.candidateId && req.body?.deleteData) {
      await store.fulfillDeletion(row.candidateId);
    }
    res.json({ request: row });
  });
}

async function generateAndStoreThesis(candidateId: string, req: Request) {
  const bundle = await store.getCandidateBundle(candidateId);
  if (!bundle?.conversation) throw new Error("Conversation missing");
  const settings = await store.getSettingsMap();
  const brands = await store.listAiApprovedBrands();
  const thesis = await runThesisGeneration({
    settings,
    profile: {
      ...bundle.profile,
      firstName: bundle.candidate.firstName,
      lastName: bundle.candidate.lastName,
      email: bundle.candidate.email,
      phone: bundle.candidate.phone,
    } as Record<string, unknown>,
    contradictions: (bundle.profile?.contradictionsIdentified as Array<{ tension: string; question: string }>) || [],
    approvedBrands: brands,
  });
  const report = await store.saveReport({
    candidateId,
    conversationId: bundle.conversation.id,
    thesis,
  });
  const named = thesis.namedBrands || [];
  if (named.length) {
    const approved = await store.listApprovedBrands();
    await store.replaceBrandFitReasons(
      report.id,
      named
        .map((item) => {
          const brand = approved.find((b) => b.brandName.toLowerCase() === item.name.toLowerCase());
          return brand ? { brandId: brand.id, reason: item.reason } : null;
        })
        .filter((row): row is { brandId: string; reason: string } => Boolean(row)),
    );
  }
  const brief = await runBriefGeneration({
    settings,
    profile: bundle.profile as Record<string, unknown>,
    thesis,
    firstName: bundle.candidate.firstName,
  });
  await store.saveBrief({ candidateId, reportId: report.id, brief });
  await store.trackEvent({ candidateId, eventName: "thesis_complete", chapter: "ownership_thesis" });
  await store.updateConversation(bundle.conversation.id, { currentChapter: "ownership_thesis", status: "completed" });

  if (contactReady({ email: bundle.candidate.email })) {
    await upsertAdvisorContact({
      candidateId,
      email: bundle.candidate.email as string,
      firstName: bundle.candidate.firstName,
      lastName: bundle.candidate.lastName,
      phone: bundle.candidate.phone,
      profile: profileFromRow(bundle.profile as Record<string, unknown>),
      status: "completed",
      reportUrl: `${getAppBaseUrl(req)}/advisor/report/${report.reportToken}`,
      bookingStatus: bundle.candidate.bookingStatus,
      contradictions: (bundle.profile?.contradictionsIdentified as Array<{ tension: string; question: string }>) || [],
      completedAt: new Date(),
      note: `Ownership Advisor thesis completed.\n\n${summarizeProfile(profileFromRow(bundle.profile as Record<string, unknown>))}`,
    });
  }

  return report;
}

export { detectFollowUpHints };
