# Credentials Chuck needs to turn the advisor all the way on

None of these belong in the git repo.

| Variable | Why | Needed to |
| --- | --- | --- |
| `DATABASE_URL` | Existing Neon / Replit Postgres | Persist candidates, transcripts, theses |
| `OPENAI_API_KEY` | Server-side model calls | Run the conversation and write the thesis |
| `SESSION_SECRET` | Existing session cookie | Keep admin and resume sessions honest in production |
| `APP_BASE_URL` | Public site origin | Build private report links |
| `CALENDLY_URL` | Defaults to `https://calendly.com/charles-stovall/intro` | Booking handoff |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Existing CRM, if Chuck wants sync | Create/update contacts and notes |
| `ADMIN_EMAIL` | Defaults to `charles@franchisefriend.net` | Password login at `/admin/advisor/login` |
| `ADMIN_PASSWORD` | New, only if Chuck wants password login | Same |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Already used for member admin | Existing admin session also unlocks the advisor desk |

Clerk is documented and unused in v1.

Without `OPENAI_API_KEY`, the landing page still works and explains that the advisor is not configured.

Without `HUBSPOT_PRIVATE_APP_TOKEN`, conversations, theses, PDFs, and the dashboard still work.
