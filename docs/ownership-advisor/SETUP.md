# Ownership Advisor setup

The Franchise Friend Ownership Advisor is a separate product surface inside this Replit app. It does not replace the marketing site.

## Stack fit

The live site is already React + Express + Drizzle + PostgreSQL, with express-session in Postgres. The advisor uses that same stack.

- Candidate routes: `/advisor`, `/advisor/conversation`, `/advisor/report/:token`, `/advisor/resume/:token`, `/advisor/privacy`
- Chuck dashboard: `/admin/advisor` (never linked from candidate pages)
- API: `/api/advisor/*`

## Database

Production candidate data is stored in PostgreSQL. It is never kept only in memory.

On boot, `ensureAdvisorTables()` runs additive `CREATE TABLE IF NOT EXISTS` statements through the standard `pg` driver. That is the Replit-safe path and works with Neon or Replit Postgres. Advisor reads and writes also use `pg`, so candidate data is not tied to Neon HTTP.

You can also run:

```bash
npm run db:push
```

Do not drop existing `leads`, `members`, `podcasts`, or `brands` tables. Advisor tables are prefixed `advisor_`.

## Environment

Copy values from `.env.example`. Never put secrets in client code.

Required for a live conversation: `DATABASE_URL`, `OPENAI_API_KEY`.

Useful in production: `SESSION_SECRET`, `APP_BASE_URL`, `CALENDLY_URL`, `HUBSPOT_PRIVATE_APP_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

If `OPENAI_API_KEY` is missing, `/advisor` still renders and explains that the advisor is not configured yet.

## Admin access

Any of these work:

1. Existing Franchise Friend admin session (`charles@franchisefriend.net` Google or member-admin login)
2. `/admin/advisor/login` with `ADMIN_EMAIL` + `ADMIN_PASSWORD`

Login is rate-limited. Sessions are httpOnly cookies.

Candidates do not use Replit Auth and are not asked to create accounts.

## Local / Replit run

```bash
npm install
npm run dev
```

Then open `/advisor` and `/admin/advisor/login`.

```bash
npm run advisor:test
```

## HubSpot properties

If `HUBSPOT_PRIVATE_APP_TOKEN` is present:

```bash
npm run advisor:hubspot-properties
```

If the token is missing, the advisor still works. Sync events are logged as skipped. See `HUBSPOT_PROPERTIES.md`.
