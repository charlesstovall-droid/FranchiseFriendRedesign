import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  leadType: text("lead_type").notNull(),
  liquidCapital: text("liquid_capital"),
  timeline: text("timeline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number is required"),
  liquidCapital: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const podcasts = pgTable("podcasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioUrl: varchar("audio_url", { length: 500 }).notNull(),
  artworkUrl: varchar("artwork_url", { length: 500 }),
  duration: integer("duration"),
  episodeNumber: integer("episode_number"),
  youtubeUrl: varchar("youtube_url", { length: 500 }),
  spotifyUrl: varchar("spotify_url", { length: 500 }),
  applePodcastsUrl: varchar("apple_podcasts_url", { length: 500 }),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPodcastSchema = createInsertSchema(podcasts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Podcast title is required"),
  audioUrl: z.string().url("Valid audio URL required"),
  artworkUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  spotifyUrl: z.string().url().optional().or(z.literal("")),
  applePodcastsUrl: z.string().url().optional().or(z.literal("")),
  duration: z.number().optional(),
  episodeNumber: z.number().optional(),
});

export type InsertPodcast = z.infer<typeof insertPodcastSchema>;
export type Podcast = typeof podcasts.$inferSelect;

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phase1Complete: boolean("phase_1_complete").default(false),
  phase2Complete: boolean("phase_2_complete").default(false),
  phase3Complete: boolean("phase_3_complete").default(false),
  phase4Complete: boolean("phase_4_complete").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitations = pgTable("invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  invitationCode: varchar("invitation_code", { length: 50 }).notNull().unique(),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  website: text("website").notNull(),
  logoUrl: text("logo_url"),
  devPersonName: text("dev_person_name"),
  devPersonEmail: text("dev_person_email"),
  devPersonPhone: text("dev_person_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const insertBrandSchema = z.object({
  memberId: z.string(),
  name: z.string().min(1),
  website: z.string().url(),
  logoUrl: z.string().url().optional(),
  devPersonName: z.string().optional(),
  devPersonEmail: z.string().email().optional(),
  devPersonPhone: z.string().optional(),
});

export const insertInvitationSchema = z.object({
  email: z.string().email(),
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

const uuidPk = () => varchar("id").primaryKey().default(sql`gen_random_uuid()`);

export const advisorCandidates = pgTable("advisor_candidates", {
  id: uuidPk(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  city: text("city"),
  state: text("state"),
  resumeToken: varchar("resume_token", { length: 128 }).notNull().unique(),
  reportToken: varchar("report_token", { length: 128 }).unique(),
  deletionToken: varchar("deletion_token", { length: 128 }).notNull().unique(),
  status: text("status").notNull().default("started"),
  bookingStatus: text("booking_status").notNull().default("not_decided"),
  privacyConsentAt: timestamp("privacy_consent_at"),
  aiDisclosureAcknowledgedAt: timestamp("ai_disclosure_acknowledged_at"),
  archivedAt: timestamp("archived_at"),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("advisor_candidates_email_idx").on(table.email),
  statusIdx: index("advisor_candidates_status_idx").on(table.status),
}));

export const advisorConversations = pgTable("advisor_conversations", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").notNull().references(() => advisorCandidates.id, { onDelete: "cascade" }),
  currentChapter: text("current_chapter").notNull().default("why_now"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const advisorConversationMessages = pgTable("advisor_conversation_messages", {
  id: uuidPk(),
  conversationId: varchar("conversation_id").notNull().references(() => advisorConversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  chapter: text("chapter"),
  inputType: text("input_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index("advisor_messages_conversation_idx").on(table.conversationId),
}));

export const advisorCandidateProfiles = pgTable("advisor_candidate_profiles", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").notNull().unique().references(() => advisorCandidates.id, { onDelete: "cascade" }),
  whyOwnershipNow: text("why_ownership_now"),
  currentCareerOrBusiness: text("current_career_or_business"),
  desiredChange: text("desired_change"),
  idealDay: text("ideal_day"),
  desiredWeeklyInvolvement: text("desired_weekly_involvement"),
  preferredOwnerRole: text("preferred_owner_role"),
  incomeGoal: text("income_goal"),
  incomeReplacementTimeline: text("income_replacement_timeline"),
  liquidCapitalRange: text("liquid_capital_range"),
  comfortableInvestmentAmount: text("comfortable_investment_amount"),
  financingInterest: text("financing_interest"),
  minimumEmergencyReserve: text("minimum_emergency_reserve"),
  spouseOrPartnerAlignment: text("spouse_or_partner_alignment"),
  geographicRequirements: text("geographic_requirements"),
  employeeTolerance: text("employee_tolerance"),
  salesComfort: text("sales_comfort"),
  communityInvolvementPreference: text("community_involvement_preference"),
  b2bVsConsumer: text("b2b_vs_consumer"),
  recurringRevenuePreference: text("recurring_revenue_preference"),
  brickAndMortarTolerance: text("brick_and_mortar_tolerance"),
  buildoutTolerance: text("buildout_tolerance"),
  desiredNumberOfLocations: text("desired_number_of_locations"),
  riskTolerance: text("risk_tolerance"),
  decisionStyle: text("decision_style"),
  timelineToAct: text("timeline_to_act"),
  mainConcerns: text("main_concerns"),
  statedNonNegotiables: text("stated_non_negotiables"),
  contradictionsIdentified: jsonb("contradictions_identified").$type<Array<{ tension: string; question: string }>>().default([]),
  recommendedNextQuestions: jsonb("recommended_next_questions").$type<string[]>().default([]),
  confidenceByField: jsonb("confidence_by_field").$type<Record<string, number>>().default({}),
  rawExtracted: jsonb("raw_extracted").$type<Record<string, unknown>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const advisorOwnershipReports = pgTable("advisor_ownership_reports", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").notNull().references(() => advisorCandidates.id, { onDelete: "cascade" }),
  conversationId: varchar("conversation_id").references(() => advisorConversations.id, { onDelete: "set null" }),
  reportToken: varchar("report_token", { length: 128 }).notNull().unique(),
  thesis: jsonb("thesis").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const advisorBriefs = pgTable("advisor_briefs", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").notNull().references(() => advisorCandidates.id, { onDelete: "cascade" }),
  reportId: varchar("report_id").references(() => advisorOwnershipReports.id, { onDelete: "set null" }),
  brief: jsonb("brief").$type<Record<string, unknown>>().notNull(),
  editedBrief: jsonb("edited_brief").$type<Record<string, unknown>>(),
  privateNotes: text("private_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const advisorApprovedBrands = pgTable("advisor_approved_brands", {
  id: uuidPk(),
  brandName: text("brand_name").notNull(),
  category: text("category"),
  investmentRange: text("investment_range"),
  minLiquidity: text("min_liquidity"),
  ownerRole: text("owner_role"),
  employeeProfile: text("employee_profile"),
  salesModel: text("sales_model"),
  recurringRevenueCharacteristics: text("recurring_revenue_characteristics"),
  brickAndMortarRequirements: text("brick_and_mortar_requirements"),
  buildoutLevel: text("buildout_level"),
  typicalDevelopmentStructure: text("typical_development_structure"),
  availableTerritories: text("available_territories"),
  fddYear: text("fdd_year"),
  sbaDirectoryStatus: text("sba_directory_status"),
  chuckNotes: text("chuck_notes"),
  approvedForAi: boolean("approved_for_ai").notNull().default(false),
  dateLastVerified: timestamp("date_last_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const advisorBrandFitReasons = pgTable("advisor_brand_fit_reasons", {
  id: uuidPk(),
  reportId: varchar("report_id").notNull().references(() => advisorOwnershipReports.id, { onDelete: "cascade" }),
  brandId: varchar("brand_id").notNull().references(() => advisorApprovedBrands.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const advisorHubspotSyncEvents = pgTable("advisor_hubspot_sync_events", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").references(() => advisorCandidates.id, { onDelete: "set null" }),
  eventType: text("event_type").notNull(),
  status: text("status").notNull(),
  requestSummary: text("request_summary"),
  responseSummary: text("response_summary"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const advisorBookingEvents = pgTable("advisor_booking_events", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").notNull().references(() => advisorCandidates.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  calendlyUrl: text("calendly_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const advisorAuditLog = pgTable("advisor_audit_log", {
  id: uuidPk(),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const advisorAnalyticsEvents = pgTable("advisor_analytics_events", {
  id: uuidPk(),
  candidateId: varchar("candidate_id"),
  eventName: text("event_name").notNull(),
  chapter: text("chapter"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  eventIdx: index("advisor_analytics_event_idx").on(table.eventName),
}));

export const advisorAdminSettings = pgTable("advisor_admin_settings", {
  id: uuidPk(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by"),
});

export const advisorDeletionRequests = pgTable("advisor_deletion_requests", {
  id: uuidPk(),
  candidateId: varchar("candidate_id").references(() => advisorCandidates.id, { onDelete: "set null" }),
  email: text("email"),
  tokenProvided: text("token_provided"),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export type AdvisorCandidate = typeof advisorCandidates.$inferSelect;
export type AdvisorConversation = typeof advisorConversations.$inferSelect;
export type AdvisorConversationMessage = typeof advisorConversationMessages.$inferSelect;
export type AdvisorCandidateProfile = typeof advisorCandidateProfiles.$inferSelect;
export type AdvisorOwnershipReport = typeof advisorOwnershipReports.$inferSelect;
export type AdvisorBrief = typeof advisorBriefs.$inferSelect;
export type AdvisorApprovedBrand = typeof advisorApprovedBrands.$inferSelect;
export type AdvisorAdminSetting = typeof advisorAdminSettings.$inferSelect;
