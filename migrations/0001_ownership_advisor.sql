-- Additive Ownership Advisor tables. Safe to run more than once.
-- Canonical source: server/advisor/migrate.ts
-- Preferred path on Replit: the server calls ensureAdvisorTables() on boot.

CREATE TABLE IF NOT EXISTS advisor_candidates (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text,
    last_name text,
    email text,
    phone text,
    city text,
    state text,
    resume_token varchar(128) NOT NULL UNIQUE,
    report_token varchar(128) UNIQUE,
    deletion_token varchar(128) NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'started',
    booking_status text NOT NULL DEFAULT 'not_decided',
    privacy_consent_at timestamp,
    ai_disclosure_acknowledged_at timestamp,
    archived_at timestamp,
    last_active_at timestamp NOT NULL DEFAULT now(),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );

CREATE INDEX IF NOT EXISTS advisor_candidates_email_idx ON advisor_candidates (email);

CREATE INDEX IF NOT EXISTS advisor_candidates_status_idx ON advisor_candidates (status);

CREATE TABLE IF NOT EXISTS advisor_conversations (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar NOT NULL REFERENCES advisor_candidates(id) ON DELETE CASCADE,
    current_chapter text NOT NULL DEFAULT 'why_now',
    status text NOT NULL DEFAULT 'active',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_conversation_messages (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id varchar NOT NULL REFERENCES advisor_conversations(id) ON DELETE CASCADE,
    role text NOT NULL,
    content text NOT NULL,
    chapter text,
    input_type text,
    created_at timestamp NOT NULL DEFAULT now()
  );

CREATE INDEX IF NOT EXISTS advisor_messages_conversation_idx ON advisor_conversation_messages (conversation_id);

CREATE TABLE IF NOT EXISTS advisor_candidate_profiles (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar NOT NULL UNIQUE REFERENCES advisor_candidates(id) ON DELETE CASCADE,
    why_ownership_now text,
    current_career_or_business text,
    desired_change text,
    ideal_day text,
    desired_weekly_involvement text,
    preferred_owner_role text,
    income_goal text,
    income_replacement_timeline text,
    liquid_capital_range text,
    comfortable_investment_amount text,
    financing_interest text,
    minimum_emergency_reserve text,
    spouse_or_partner_alignment text,
    geographic_requirements text,
    employee_tolerance text,
    sales_comfort text,
    community_involvement_preference text,
    b2b_vs_consumer text,
    recurring_revenue_preference text,
    brick_and_mortar_tolerance text,
    buildout_tolerance text,
    desired_number_of_locations text,
    risk_tolerance text,
    decision_style text,
    timeline_to_act text,
    main_concerns text,
    stated_non_negotiables text,
    contradictions_identified jsonb DEFAULT '[]'::jsonb,
    recommended_next_questions jsonb DEFAULT '[]'::jsonb,
    confidence_by_field jsonb DEFAULT '{}'::jsonb,
    raw_extracted jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_ownership_reports (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar NOT NULL REFERENCES advisor_candidates(id) ON DELETE CASCADE,
    conversation_id varchar REFERENCES advisor_conversations(id) ON DELETE SET NULL,
    report_token varchar(128) NOT NULL UNIQUE,
    thesis jsonb NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_briefs (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar NOT NULL REFERENCES advisor_candidates(id) ON DELETE CASCADE,
    report_id varchar REFERENCES advisor_ownership_reports(id) ON DELETE SET NULL,
    brief jsonb NOT NULL,
    edited_brief jsonb,
    private_notes text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_approved_brands (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name text NOT NULL,
    category text,
    investment_range text,
    min_liquidity text,
    owner_role text,
    employee_profile text,
    sales_model text,
    recurring_revenue_characteristics text,
    brick_and_mortar_requirements text,
    buildout_level text,
    typical_development_structure text,
    available_territories text,
    fdd_year text,
    sba_directory_status text,
    chuck_notes text,
    approved_for_ai boolean NOT NULL DEFAULT false,
    date_last_verified timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_brand_fit_reasons (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id varchar NOT NULL REFERENCES advisor_ownership_reports(id) ON DELETE CASCADE,
    brand_id varchar NOT NULL REFERENCES advisor_approved_brands(id) ON DELETE CASCADE,
    reason text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_hubspot_sync_events (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar REFERENCES advisor_candidates(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    status text NOT NULL,
    request_summary text,
    response_summary text,
    error text,
    created_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_booking_events (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar NOT NULL REFERENCES advisor_candidates(id) ON DELETE CASCADE,
    status text NOT NULL,
    calendly_url text,
    created_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_audit_log (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type text NOT NULL,
    actor_id text,
    action text NOT NULL,
    entity_type text,
    entity_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp NOT NULL DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS advisor_analytics_events (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar,
    event_name text NOT NULL,
    chapter text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp NOT NULL DEFAULT now()
  );

CREATE INDEX IF NOT EXISTS advisor_analytics_event_idx ON advisor_analytics_events (event_name);

CREATE TABLE IF NOT EXISTS advisor_admin_settings (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    key varchar(128) NOT NULL UNIQUE,
    value jsonb NOT NULL,
    updated_at timestamp NOT NULL DEFAULT now(),
    updated_by text
  );

CREATE TABLE IF NOT EXISTS advisor_deletion_requests (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id varchar REFERENCES advisor_candidates(id) ON DELETE SET NULL,
    email text,
    token_provided text,
    message text,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp NOT NULL DEFAULT now(),
    resolved_at timestamp
  );

