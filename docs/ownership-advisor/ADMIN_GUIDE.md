# Ownership Advisor admin guide

Open `/admin/advisor`. Candidates never see this desk.

## Candidates

Search and filter by completion, booking, capital range, timeline, desired role, and primary conflict.

Each candidate file includes:

- Ownership Thesis
- Full transcript
- Chuck Meeting Brief (editable)
- Private notes
- Archive and deletion

The brief has twelve sections, including three questions to ask next, a suggested opening, and a follow-up email.

## Approved brands

The brand list starts empty on purpose. Do not invent brands.

The advisor may recommend business-model characteristics without naming a franchise. It may name a franchise only when:

- the brand is in this database
- Approved for AI consideration is on
- the row looks current
- the copy says it is an option to investigate, not an endorsement

CSV import and export are on the brands page.

## Copy and prompts

The settings editor stores opening copy, system instructions, chapter prompts, suggested buttons, disclosure, report wording, booking link, HubSpot property mapping, and follow-up email templates. Edit JSON and save. No code deploy is required for copy changes.

## Analytics

First-party events only: starts, chapter completion, drop-off, thesis completions, contact submissions, report downloads, booking clicks, confirmed bookings, returning candidates, average completion time.

## Privacy

`/advisor/privacy` collects deletion requests. Fulfill them from the candidate file or by deleting the candidate record. Retention days live in settings (`retention_days`, default 730).

## Booking

The candidate CTA uses `https://calendly.com/charles-stovall/intro` unless you change `CALENDLY_URL` or the booking link in settings. Booking can be marked booked, declined, or not decided.
