import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  advisorAdminSettings,
  advisorAnalyticsEvents,
  advisorApprovedBrands,
  advisorAuditLog,
  advisorBookingEvents,
  advisorBrandFitReasons,
  advisorBriefs,
  advisorCandidateProfiles,
  advisorCandidates,
  advisorConversationMessages,
  advisorConversations,
  advisorDeletionRequests,
  advisorHubspotSyncEvents,
  advisorOwnershipReports,
  type AdvisorApprovedBrand,
  type AdvisorBrief,
  type AdvisorCandidate,
  type AdvisorCandidateProfile,
  type AdvisorConversation,
  type AdvisorConversationMessage,
  type AdvisorOwnershipReport,
} from "@shared/schema";
import type { ExtractedProfile } from "@shared/advisor";
import { DEFAULT_SETTING_VALUES } from "./settings";
import { createOpaqueToken } from "./tokens";

export async function createCandidateSession() {
  const resumeToken = createOpaqueToken();
  const deletionToken = createOpaqueToken();
  const [candidate] = await db
    .insert(advisorCandidates)
    .values({ resumeToken, deletionToken, status: "started" })
    .returning();
  const [conversation] = await db
    .insert(advisorConversations)
    .values({ candidateId: candidate.id, currentChapter: "why_now" })
    .returning();
  await db.insert(advisorCandidateProfiles).values({ candidateId: candidate.id });
  return { candidate, conversation };
}

export async function getCandidateByResumeToken(token: string) {
  const [candidate] = await db.select().from(advisorCandidates).where(eq(advisorCandidates.resumeToken, token));
  return candidate;
}

export async function getCandidateByReportToken(token: string) {
  const [candidate] = await db.select().from(advisorCandidates).where(eq(advisorCandidates.reportToken, token));
  return candidate;
}

export async function getCandidateById(id: string) {
  const [candidate] = await db.select().from(advisorCandidates).where(eq(advisorCandidates.id, id));
  return candidate;
}

export async function getConversationByCandidate(candidateId: string) {
  const [conversation] = await db
    .select()
    .from(advisorConversations)
    .where(eq(advisorConversations.candidateId, candidateId))
    .orderBy(desc(advisorConversations.createdAt));
  return conversation;
}

export async function getConversationById(id: string) {
  const [conversation] = await db.select().from(advisorConversations).where(eq(advisorConversations.id, id));
  return conversation;
}

export async function touchCandidate(candidateId: string, patch: Partial<AdvisorCandidate> = {}) {
  const [updated] = await db
    .update(advisorCandidates)
    .set({ ...patch, lastActiveAt: new Date(), updatedAt: new Date() })
    .where(eq(advisorCandidates.id, candidateId))
    .returning();
  return updated;
}

export async function addMessage(input: {
  conversationId: string;
  role: "assistant" | "user" | "system";
  content: string;
  chapter?: string | null;
  inputType?: string | null;
}): Promise<AdvisorConversationMessage> {
  const [message] = await db
    .insert(advisorConversationMessages)
    .values({
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      chapter: input.chapter ?? null,
      inputType: input.inputType ?? null,
    })
    .returning();
  return message;
}

export async function getRecentMessages(conversationId: string, limit = 12): Promise<AdvisorConversationMessage[]> {
  const rows = await db
    .select()
    .from(advisorConversationMessages)
    .where(eq(advisorConversationMessages.conversationId, conversationId))
    .orderBy(desc(advisorConversationMessages.createdAt))
    .limit(limit);
  return rows.reverse();
}

export async function getAllMessages(conversationId: string): Promise<AdvisorConversationMessage[]> {
  return db
    .select()
    .from(advisorConversationMessages)
    .where(eq(advisorConversationMessages.conversationId, conversationId))
    .orderBy(advisorConversationMessages.createdAt);
}

export async function updateConversation(id: string, patch: Partial<AdvisorConversation>) {
  const [updated] = await db
    .update(advisorConversations)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(advisorConversations.id, id))
    .returning();
  return updated;
}

export async function getProfile(candidateId: string): Promise<AdvisorCandidateProfile | undefined> {
  const [profile] = await db
    .select()
    .from(advisorCandidateProfiles)
    .where(eq(advisorCandidateProfiles.candidateId, candidateId));
  return profile;
}

export async function updateProfile(
  candidateId: string,
  profile: ExtractedProfile,
  extras: {
    contradictionsIdentified?: Array<{ tension: string; question: string }>;
    recommendedNextQuestions?: string[];
    confidenceByField?: Record<string, number>;
    rawExtracted?: Record<string, unknown>;
  } = {},
) {
  const [updated] = await db
    .update(advisorCandidateProfiles)
    .set({
      whyOwnershipNow: profile.whyOwnershipNow ?? undefined,
      currentCareerOrBusiness: profile.currentCareerOrBusiness ?? undefined,
      desiredChange: profile.desiredChange ?? undefined,
      idealDay: profile.idealDay ?? undefined,
      desiredWeeklyInvolvement: profile.desiredWeeklyInvolvement ?? undefined,
      preferredOwnerRole: profile.preferredOwnerRole ?? undefined,
      incomeGoal: profile.incomeGoal ?? undefined,
      incomeReplacementTimeline: profile.incomeReplacementTimeline ?? undefined,
      liquidCapitalRange: profile.liquidCapitalRange ?? undefined,
      comfortableInvestmentAmount: profile.comfortableInvestmentAmount ?? undefined,
      financingInterest: profile.financingInterest ?? undefined,
      minimumEmergencyReserve: profile.minimumEmergencyReserve ?? undefined,
      spouseOrPartnerAlignment: profile.spouseOrPartnerAlignment ?? undefined,
      geographicRequirements: profile.geographicRequirements ?? undefined,
      employeeTolerance: profile.employeeTolerance ?? undefined,
      salesComfort: profile.salesComfort ?? undefined,
      communityInvolvementPreference: profile.communityInvolvementPreference ?? undefined,
      b2bVsConsumer: profile.b2bVsConsumer ?? undefined,
      recurringRevenuePreference: profile.recurringRevenuePreference ?? undefined,
      brickAndMortarTolerance: profile.brickAndMortarTolerance ?? undefined,
      buildoutTolerance: profile.buildoutTolerance ?? undefined,
      desiredNumberOfLocations: profile.desiredNumberOfLocations ?? undefined,
      riskTolerance: profile.riskTolerance ?? undefined,
      decisionStyle: profile.decisionStyle ?? undefined,
      timelineToAct: profile.timelineToAct ?? undefined,
      mainConcerns: profile.mainConcerns ?? undefined,
      statedNonNegotiables: profile.statedNonNegotiables ?? undefined,
      contradictionsIdentified: extras.contradictionsIdentified,
      recommendedNextQuestions: extras.recommendedNextQuestions,
      confidenceByField: extras.confidenceByField,
      rawExtracted: extras.rawExtracted,
      updatedAt: new Date(),
    })
    .where(eq(advisorCandidateProfiles.candidateId, candidateId))
    .returning();

  await touchCandidate(candidateId, {
    firstName: profile.firstName ?? undefined,
    lastName: profile.lastName ?? undefined,
    email: profile.email ?? undefined,
    phone: profile.phone ?? undefined,
    city: profile.city ?? undefined,
    state: profile.state ?? undefined,
    status: "in_progress",
  } as Partial<AdvisorCandidate>);

  return updated;
}

export async function saveReport(input: {
  candidateId: string;
  conversationId: string;
  thesis: Record<string, unknown>;
  reportToken?: string;
}): Promise<AdvisorOwnershipReport> {
  const token = input.reportToken || createOpaqueToken();
  const existing = await getReportByCandidate(input.candidateId);
  if (existing) {
    const [updated] = await db
      .update(advisorOwnershipReports)
      .set({ thesis: input.thesis, conversationId: input.conversationId, updatedAt: new Date() })
      .where(eq(advisorOwnershipReports.id, existing.id))
      .returning();
    await touchCandidate(input.candidateId, { reportToken: existing.reportToken, status: "completed" });
    return updated;
  }
  const [report] = await db
    .insert(advisorOwnershipReports)
    .values({
      candidateId: input.candidateId,
      conversationId: input.conversationId,
      reportToken: token,
      thesis: input.thesis,
    })
    .returning();
  await touchCandidate(input.candidateId, { reportToken: token, status: "completed" });
  return report;
}

export async function getReportByToken(token: string) {
  const [report] = await db.select().from(advisorOwnershipReports).where(eq(advisorOwnershipReports.reportToken, token));
  return report;
}

export async function getReportByCandidate(candidateId: string) {
  const [report] = await db
    .select()
    .from(advisorOwnershipReports)
    .where(eq(advisorOwnershipReports.candidateId, candidateId))
    .orderBy(desc(advisorOwnershipReports.createdAt));
  return report;
}

export async function saveBrief(input: {
  candidateId: string;
  reportId?: string | null;
  brief: Record<string, unknown>;
}): Promise<AdvisorBrief> {
  const existing = await getBriefByCandidate(input.candidateId);
  if (existing) {
    const [updated] = await db
      .update(advisorBriefs)
      .set({ brief: input.brief, reportId: input.reportId ?? existing.reportId, updatedAt: new Date() })
      .where(eq(advisorBriefs.id, existing.id))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(advisorBriefs)
    .values({
      candidateId: input.candidateId,
      reportId: input.reportId ?? null,
      brief: input.brief,
    })
    .returning();
  return created;
}

export async function getBriefByCandidate(candidateId: string) {
  const [brief] = await db.select().from(advisorBriefs).where(eq(advisorBriefs.candidateId, candidateId));
  return brief;
}

export async function updateBriefEdits(candidateId: string, patch: { editedBrief?: Record<string, unknown>; privateNotes?: string }) {
  const [updated] = await db
    .update(advisorBriefs)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(advisorBriefs.candidateId, candidateId))
    .returning();
  return updated;
}

export async function listCandidates(filters: {
  q?: string;
  status?: string;
  bookingStatus?: string;
  capital?: string;
  timeline?: string;
  role?: string;
  conflict?: string;
  includeArchived?: boolean;
}) {
  const conditions = [];
  if (!filters.includeArchived) {
    conditions.push(sql`${advisorCandidates.archivedAt} is null`);
  }
  if (filters.status) conditions.push(eq(advisorCandidates.status, filters.status));
  if (filters.bookingStatus) conditions.push(eq(advisorCandidates.bookingStatus, filters.bookingStatus));
  if (filters.q) {
    const like = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(advisorCandidates.firstName, like),
        ilike(advisorCandidates.lastName, like),
        ilike(advisorCandidates.email, like),
        ilike(advisorCandidates.phone, like),
        ilike(advisorCandidates.city, like),
      ),
    );
  }

  const rows = await db
    .select({
      candidate: advisorCandidates,
      profile: advisorCandidateProfiles,
      report: advisorOwnershipReports,
    })
    .from(advisorCandidates)
    .leftJoin(advisorCandidateProfiles, eq(advisorCandidateProfiles.candidateId, advisorCandidates.id))
    .leftJoin(advisorOwnershipReports, eq(advisorOwnershipReports.candidateId, advisorCandidates.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(advisorCandidates.lastActiveAt));

  return rows.filter((row) => {
    if (filters.capital && !(row.profile?.liquidCapitalRange || "").toLowerCase().includes(filters.capital.toLowerCase())) {
      return false;
    }
    if (filters.timeline && !(row.profile?.timelineToAct || row.profile?.incomeReplacementTimeline || "").toLowerCase().includes(filters.timeline.toLowerCase())) {
      return false;
    }
    if (filters.role && !(row.profile?.preferredOwnerRole || "").toLowerCase().includes(filters.role.toLowerCase())) {
      return false;
    }
    if (filters.conflict) {
      const contradictions = (row.profile?.contradictionsIdentified || []) as Array<{ tension: string }>;
      if (!contradictions.some((c) => (c.tension || "").toLowerCase().includes(filters.conflict!.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });
}

export async function archiveCandidate(id: string) {
  return touchCandidate(id, { archivedAt: new Date(), status: "archived" });
}

export async function listApprovedBrands(): Promise<AdvisorApprovedBrand[]> {
  return db.select().from(advisorApprovedBrands).orderBy(advisorApprovedBrands.brandName);
}

export async function listAiApprovedBrands(): Promise<AdvisorApprovedBrand[]> {
  return db
    .select()
    .from(advisorApprovedBrands)
    .where(eq(advisorApprovedBrands.approvedForAi, true))
    .orderBy(advisorApprovedBrands.brandName);
}

export async function createApprovedBrand(values: Partial<AdvisorApprovedBrand> & { brandName: string }) {
  const [brand] = await db.insert(advisorApprovedBrands).values(values).returning();
  return brand;
}

export async function updateApprovedBrand(id: string, values: Partial<AdvisorApprovedBrand>) {
  const [brand] = await db
    .update(advisorApprovedBrands)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(advisorApprovedBrands.id, id))
    .returning();
  return brand;
}

export async function deleteApprovedBrand(id: string) {
  await db.delete(advisorApprovedBrands).where(eq(advisorApprovedBrands.id, id));
}

export async function replaceBrandFitReasons(reportId: string, reasons: Array<{ brandId: string; reason: string }>) {
  await db.delete(advisorBrandFitReasons).where(eq(advisorBrandFitReasons.reportId, reportId));
  if (!reasons.length) return;
  await db.insert(advisorBrandFitReasons).values(reasons.map((r) => ({ reportId, brandId: r.brandId, reason: r.reason })));
}

export async function logHubspotEvent(event: {
  candidateId?: string | null;
  eventType: string;
  status: string;
  requestSummary?: string;
  responseSummary?: string;
  error?: string;
}) {
  const [row] = await db.insert(advisorHubspotSyncEvents).values(event).returning();
  return row;
}

export async function listHubspotEvents(limit = 50) {
  return db.select().from(advisorHubspotSyncEvents).orderBy(desc(advisorHubspotSyncEvents.createdAt)).limit(limit);
}

export async function addBookingEvent(candidateId: string, status: string, calendlyUrl?: string) {
  await db.insert(advisorBookingEvents).values({ candidateId, status, calendlyUrl });
  await touchCandidate(candidateId, { bookingStatus: status });
}

export async function writeAudit(event: {
  actorType: string;
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(advisorAuditLog).values(event);
}

export async function trackEvent(event: {
  candidateId?: string | null;
  eventName: string;
  chapter?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(advisorAnalyticsEvents).values(event);
}

export async function analyticsSummary() {
  const events = await db.select().from(advisorAnalyticsEvents);
  const counts: Record<string, number> = {};
  const chapterDrop: Record<string, number> = {};
  const completions: Date[] = [];
  const starts: Date[] = [];
  for (const event of events) {
    counts[event.eventName] = (counts[event.eventName] || 0) + 1;
    if (event.eventName === "drop_off_chapter" && event.chapter) {
      chapterDrop[event.chapter] = (chapterDrop[event.chapter] || 0) + 1;
    }
    if (event.eventName === "advisor_start") starts.push(event.createdAt);
    if (event.eventName === "thesis_complete") completions.push(event.createdAt);
  }
  const candidates = await db.select().from(advisorCandidates);
  const completed = candidates.filter((c) => c.status === "completed");
  const durations = completed
    .map((c) => c.updatedAt.getTime() - c.createdAt.getTime())
    .filter((ms) => ms > 0 && ms < 1000 * 60 * 60 * 24 * 14);
  const avgMs = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  return {
    counts,
    chapterDrop,
    starts: counts.advisor_start || 0,
    thesisCompletions: counts.thesis_complete || 0,
    contactSubmissions: counts.contact_submit || 0,
    reportDownloads: counts.report_download || 0,
    bookingLinkClicks: counts.booking_link_click || 0,
    confirmedBookings: counts.booking_confirmed || 0,
    returningCandidates: counts.candidate_return || 0,
    averageCompletionMinutes: Math.round(avgMs / 60000),
    totalCandidates: candidates.length,
  };
}

export async function getSettingsMap(): Promise<Record<string, unknown>> {
  const rows = await db.select().from(advisorAdminSettings);
  const map: Record<string, unknown> = { ...DEFAULT_SETTING_VALUES };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function upsertSetting(key: string, value: unknown, updatedBy?: string) {
  const [existing] = await db.select().from(advisorAdminSettings).where(eq(advisorAdminSettings.key, key));
  if (existing) {
    const [updated] = await db
      .update(advisorAdminSettings)
      .set({ value, updatedBy, updatedAt: new Date() })
      .where(eq(advisorAdminSettings.key, key))
      .returning();
    return updated;
  }
  const [created] = await db.insert(advisorAdminSettings).values({ key, value, updatedBy }).returning();
  return created;
}

export async function createDeletionRequest(input: {
  candidateId?: string | null;
  email?: string;
  tokenProvided?: string;
  message?: string;
}) {
  const [row] = await db.insert(advisorDeletionRequests).values(input).returning();
  return row;
}

export async function fulfillDeletion(candidateId: string) {
  await db.delete(advisorCandidates).where(eq(advisorCandidates.id, candidateId));
}

export async function listDeletionRequests() {
  return db.select().from(advisorDeletionRequests).orderBy(desc(advisorDeletionRequests.createdAt));
}

export async function resolveDeletionRequest(id: string) {
  const [row] = await db
    .update(advisorDeletionRequests)
    .set({ status: "resolved", resolvedAt: new Date() })
    .where(eq(advisorDeletionRequests.id, id))
    .returning();
  return row;
}

export async function findCandidateByEmail(email: string) {
  const [candidate] = await db.select().from(advisorCandidates).where(eq(advisorCandidates.email, email));
  return candidate;
}

export type CandidateBundle = {
  candidate: AdvisorCandidate;
  conversation: AdvisorConversation | undefined;
  profile: AdvisorCandidateProfile | undefined;
  report: AdvisorOwnershipReport | undefined;
  brief: AdvisorBrief | undefined;
  messages: AdvisorConversationMessage[];
};

export async function getCandidateBundle(candidateId: string): Promise<CandidateBundle | null> {
  const candidate = await getCandidateById(candidateId);
  if (!candidate) return null;
  const conversation = await getConversationByCandidate(candidateId);
  const profile = await getProfile(candidateId);
  const report = await getReportByCandidate(candidateId);
  const brief = await getBriefByCandidate(candidateId);
  const messages = conversation ? await getAllMessages(conversation.id) : [];
  return { candidate, conversation, profile, report, brief, messages };
}
