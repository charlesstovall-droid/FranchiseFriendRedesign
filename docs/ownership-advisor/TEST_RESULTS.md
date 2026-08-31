# Ownership Advisor test results

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

## Needs Chuck's live keys

These cannot be proven in this environment because `DATABASE_URL`, `OPENAI_API_KEY`, and `HUBSPOT_PRIVATE_APP_TOKEN` are not present here.

| Path | Needs |
| --- | --- |
| Full conversation through Ownership Thesis | `DATABASE_URL` + `OPENAI_API_KEY` |
| PDF download and private share link | `DATABASE_URL` + `OPENAI_API_KEY` |
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
