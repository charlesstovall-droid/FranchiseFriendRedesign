# Ownership Advisor test results

## Verified in this environment

Local Postgres + `npm run dev` (no `XAI_API_KEY`):

- `/` Charleston and executive-access still return 200
- `/advisor` SSR includes the specified hero, What You'll Receive, disclosure, and CTA
- `POST /api/advisor/conversations` persists a candidate and the exact opening question
- Turns without an API key return the configured-not-yet message
- Resume token restores the conversation
- Admin password login works; candidate sessions receive 401 on `/api/advisor/admin/*`
- Approved brands list is empty
- Admin settings seed opening copy, system instructions, chapter prompts, booking link, and HubSpot mapping
- Candidate row and messages persist in PostgreSQL (`advisor_candidates`, `advisor_conversation_messages`)

Browser pass (desktop and ~400px): marketing homepage still uses its own styling; `/advisor` cream/navy/gold landing matches the specified copy; conversation consent and opening question are correct; `/admin/advisor` login and candidate list work; approved brands stay empty; candidate footer does not link to admin.

## Verified without live keys

Run:

```bash
npm run advisor:test
```

Verified in that suite:

- Exact public landing and conversation copy
- Profile merge (model output is validated, then applied; empty values do not wipe a name)
- Follow-up judgment for passive income, salary replacement, and dislike of sales
- Banned hype phrases and em dash cleanup
- Named-brand filter (unapproved names are stripped)
- Opaque resume/report tokens
- Password hashing
- Rate limiter
- Zod turn schema
- CSV import/export
- Additive SQL only (no `DROP TABLE`)
- HubSpot property list completeness
- Default copy does not include banned celebration language
- Unconfigured copy does not mention OpenAI
- Advisor is configured only when `XAI_API_KEY` is set (not `OPENAI_API_KEY`)
- Mocked xAI client uses `https://api.x.ai/v1` and `grok-4.6` with `json_schema`

## Needs Chuck's live keys

These cannot be proven end-to-end here because this environment has no production `XAI_API_KEY` or `HUBSPOT_PRIVATE_APP_TOKEN`. Local Postgres and admin password login were verified.

| Path | Needs |
| --- | --- |
| Full conversation through Ownership Thesis | `DATABASE_URL` + `XAI_API_KEY` |
| PDF download and private share link | `DATABASE_URL` + `XAI_API_KEY` |
| HubSpot create/update + note | `HUBSPOT_PRIVATE_APP_TOKEN` |
| Admin password login | `ADMIN_EMAIL` + `ADMIN_PASSWORD` |
| Existing admin session unlock | current Google / member-admin session |

## Manual review checklist

1. Marketing home, Charleston, executive-access, process, reviews, and lead forms still behave as before.
2. `/advisor` shows the specified hero, support, CTA, near-CTA, What You'll Receive, and disclosure.
3. Conversation opens with the specified first question.
4. Email and phone are not demanded before the thesis has value.
5. `/admin/advisor` is not linked from candidate pages.
6. Approved brands table is empty until Chuck adds real brands.
