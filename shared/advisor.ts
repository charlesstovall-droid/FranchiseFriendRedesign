import { z } from "zod";

export const ADVISOR_CHAPTERS = [
  "why_now",
  "ideal_life",
  "owner_role",
  "financial_reality",
  "strengths_preferences",
  "family_constraints",
  "risk_decision_style",
  "ownership_thesis",
] as const;

export type AdvisorChapter = (typeof ADVISOR_CHAPTERS)[number];

export const CHAPTER_LABELS: Record<AdvisorChapter, string> = {
  why_now: "Why Now",
  ideal_life: "Ideal Life",
  owner_role: "Owner Role",
  financial_reality: "Financial Reality",
  strengths_preferences: "Strengths and Preferences",
  family_constraints: "Family and Constraints",
  risk_decision_style: "Risk and Decision Style",
  ownership_thesis: "Ownership Thesis",
};

export const CANDIDATE_STATUSES = ["started", "in_progress", "completed", "archived"] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export const BOOKING_STATUSES = ["not_decided", "booked", "declined"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const FIT_INDICATORS = [
  "Strong alignment",
  "Worth exploring",
  "Requires clarification",
  "Potential conflict",
  "Higher-risk assumption",
] as const;
export type FitIndicator = (typeof FIT_INDICATORS)[number];

export const INPUT_MODES = [
  "written",
  "written_with_suggestions",
  "ranked",
  "range",
  "tradeoff",
  "scenario",
] as const;
export type InputMode = (typeof INPUT_MODES)[number];

export const PROFILE_FIELD_KEYS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "city",
  "state",
  "whyOwnershipNow",
  "currentCareerOrBusiness",
  "desiredChange",
  "idealDay",
  "desiredWeeklyInvolvement",
  "preferredOwnerRole",
  "incomeGoal",
  "incomeReplacementTimeline",
  "liquidCapitalRange",
  "comfortableInvestmentAmount",
  "financingInterest",
  "minimumEmergencyReserve",
  "spouseOrPartnerAlignment",
  "geographicRequirements",
  "employeeTolerance",
  "salesComfort",
  "communityInvolvementPreference",
  "b2bVsConsumer",
  "recurringRevenuePreference",
  "brickAndMortarTolerance",
  "buildoutTolerance",
  "desiredNumberOfLocations",
  "riskTolerance",
  "decisionStyle",
  "timelineToAct",
  "mainConcerns",
  "statedNonNegotiables",
] as const;

export type ProfileFieldKey = (typeof PROFILE_FIELD_KEYS)[number];

export const extractedProfileSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  whyOwnershipNow: z.string().nullable().optional(),
  currentCareerOrBusiness: z.string().nullable().optional(),
  desiredChange: z.string().nullable().optional(),
  idealDay: z.string().nullable().optional(),
  desiredWeeklyInvolvement: z.string().nullable().optional(),
  preferredOwnerRole: z.string().nullable().optional(),
  incomeGoal: z.string().nullable().optional(),
  incomeReplacementTimeline: z.string().nullable().optional(),
  liquidCapitalRange: z.string().nullable().optional(),
  comfortableInvestmentAmount: z.string().nullable().optional(),
  financingInterest: z.string().nullable().optional(),
  minimumEmergencyReserve: z.string().nullable().optional(),
  spouseOrPartnerAlignment: z.string().nullable().optional(),
  geographicRequirements: z.string().nullable().optional(),
  employeeTolerance: z.string().nullable().optional(),
  salesComfort: z.string().nullable().optional(),
  communityInvolvementPreference: z.string().nullable().optional(),
  b2bVsConsumer: z.string().nullable().optional(),
  recurringRevenuePreference: z.string().nullable().optional(),
  brickAndMortarTolerance: z.string().nullable().optional(),
  buildoutTolerance: z.string().nullable().optional(),
  desiredNumberOfLocations: z.string().nullable().optional(),
  riskTolerance: z.string().nullable().optional(),
  decisionStyle: z.string().nullable().optional(),
  timelineToAct: z.string().nullable().optional(),
  mainConcerns: z.string().nullable().optional(),
  statedNonNegotiables: z.string().nullable().optional(),
});

export type ExtractedProfile = z.infer<typeof extractedProfileSchema>;

export const contradictionSchema = z.object({
  tension: z.string(),
  question: z.string(),
});

export const turnOutputSchema = z.object({
  candidate_message: z.string().min(1),
  current_chapter: z.enum(ADVISOR_CHAPTERS),
  extracted_candidate_data: extractedProfileSchema.default({}),
  confidence_by_field: z.record(z.string(), z.number().min(0).max(1)).default({}),
  contradictions_detected: z.array(contradictionSchema).default([]),
  follow_up_reason: z.string().nullable().default(null),
  next_question: z.string().default(""),
  suggested_answers: z.array(z.string()).max(5).default([]),
  input_mode: z.enum(INPUT_MODES).default("written"),
  ready_for_thesis: z.boolean().default(false),
  safety_flags: z.array(z.string()).default([]),
  asked_for_contact: z.boolean().default(false),
  financial_disclaimer_needed: z.boolean().default(false),
});

export type TurnOutput = z.infer<typeof turnOutputSchema>;

export const thesisSectionSchema = z.object({
  title: z.string(),
  body: z.string(),
  indicator: z.enum(FIT_INDICATORS).nullable().optional(),
});

export const ownershipThesisSchema = z.object({
  whyOwnershipIsBeingConsidered: thesisSectionSchema,
  whatCandidateWantsOwnershipToCreate: thesisSectionSchema,
  recommendedOwnerRole: thesisSectionSchema,
  financialFramework: thesisSectionSchema,
  businessCharacteristicsThatMayFit: thesisSectionSchema,
  businessCharacteristicsToApproachCarefully: thesisSectionSchema,
  strengthsTheCandidateBrings: thesisSectionSchema,
  potentialConflictsOrBlindSpots: thesisSectionSchema,
  questionsStillRequiringHumanJudgment: thesisSectionSchema,
  recommendedNextStep: thesisSectionSchema,
  namedBrands: z
    .array(
      z.object({
        name: z.string(),
        reason: z.string(),
        disclaimer: z.string(),
      }),
    )
    .default([]),
  conclusion: z.string(),
});

export type OwnershipThesis = z.infer<typeof ownershipThesisSchema>;

export const meetingBriefSchema = z.object({
  candidateInOneParagraph: z.string(),
  whatTheySayTheyWant: z.string(),
  whatTheyMayActuallyBeSolvingFor: z.string(),
  financialReality: z.string(),
  familyOrLifestyleConstraints: z.string(),
  contradictionsToExplore: z.string(),
  likelyDecisionStyle: z.string(),
  suitableBusinessModelCharacteristics: z.string(),
  modelsToApproachCarefully: z.string(),
  threeQuestionsChuckShouldAskNext: z.array(z.string()).min(1).max(5),
  suggestedOpeningForTheStrategyCall: z.string(),
  suggestedFollowUpEmail: z.string(),
});

export type MeetingBrief = z.infer<typeof meetingBriefSchema>;

export const HUBSPOT_ADVISOR_PROPERTIES = [
  { name: "ownership_advisor_status", label: "Ownership Advisor Status", type: "string" },
  { name: "ownership_why_now", label: "Ownership Why Now", type: "string" },
  { name: "desired_owner_role", label: "Desired Owner Role", type: "string" },
  { name: "income_goal", label: "Income Goal", type: "string" },
  { name: "income_timeline", label: "Income Timeline", type: "string" },
  { name: "liquid_capital_range", label: "Liquid Capital Range", type: "string" },
  { name: "comfortable_investment", label: "Comfortable Investment", type: "string" },
  { name: "financing_interest", label: "Financing Interest", type: "string" },
  { name: "spouse_alignment", label: "Spouse Alignment", type: "string" },
  { name: "employee_tolerance", label: "Employee Tolerance", type: "string" },
  { name: "sales_comfort", label: "Sales Comfort", type: "string" },
  { name: "recurring_revenue_preference", label: "Recurring Revenue Preference", type: "string" },
  { name: "brick_and_mortar_tolerance", label: "Brick and Mortar Tolerance", type: "string" },
  { name: "ownership_timeline", label: "Ownership Timeline", type: "string" },
  { name: "risk_tolerance", label: "Risk Tolerance", type: "string" },
  { name: "ownership_fit_summary", label: "Ownership Fit Summary", type: "string" },
  { name: "ownership_primary_conflict", label: "Ownership Primary Conflict", type: "string" },
  { name: "ownership_report_url", label: "Ownership Report URL", type: "string" },
  { name: "ownership_assessment_completed_at", label: "Ownership Assessment Completed At", type: "datetime" },
  { name: "ownership_call_booked", label: "Ownership Call Booked", type: "string" },
] as const;

export const DEFAULT_CALENDLY_URL = "https://calendly.com/charles-stovall/intro";

export const THESIS_CONCLUSION =
  "This profile is not a franchise recommendation. It is a framework for having a more productive conversation about which ownership models may or may not fit your life.";

export const CALL_HANDOFF =
  "Your profile gives us enough information to have a much more useful conversation. If you would like, you can review it personally with Chuck and decide whether exploring actual businesses makes sense.";

export const FINANCIAL_DISCLAIMER =
  "Please provide comfortable ranges rather than exact account balances. This information is used only to help frame an appropriate ownership conversation.";

export const OPENING_QUESTION =
  "Before we talk about businesses, what's happening in your life that has you considering ownership right now?";

export const BANNED_CANDIDATE_PHRASES = [
  "Congratulations!",
  "Amazing!",
  "That's exciting!",
  "That is exciting!",
  "Based on your answers, we found your perfect match!",
  "perfect franchise",
  "perfect match",
];

export const ANALYTICS_EVENTS = [
  "advisor_start",
  "chapter_complete",
  "drop_off_chapter",
  "thesis_complete",
  "contact_submit",
  "report_download",
  "booking_link_click",
  "booking_confirmed",
  "candidate_return",
  "deletion_request",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];
