-- Baseline snapshot only. Production already has these tables
-- (legacy app tables plus Ownership Advisor from PR #10 / ensureAdvisorTables).
-- Applying this file must be a no-op. Never DROP advisor_* tables.
SELECT 1;
