# HubSpot properties for the Ownership Advisor

Sync is server-side only. The browser never receives `HUBSPOT_PRIVATE_APP_TOKEN`.

When a candidate provides an email, the server searches HubSpot by email, updates or creates one contact, writes the properties below, adds a short CRM note, and stores the full transcript and thesis in this app's Postgres database. Report URLs are private token links.

If the token is missing, the advisor still works. Events are written to `advisor_hubspot_sync_events` as skipped.

## Create properties automatically

```bash
npm run advisor:hubspot-properties
```

The private app needs permission to read and write contacts and notes.

## Create properties in the HubSpot UI

Settings → Data Management → Properties → Contact properties. Create each of these as single-line or multi-line text, except `ownership_assessment_completed_at` (date/datetime):

| Internal name | Label |
| --- | --- |
| ownership_advisor_status | Ownership Advisor Status |
| ownership_why_now | Ownership Why Now |
| desired_owner_role | Desired Owner Role |
| income_goal | Income Goal |
| income_timeline | Income Timeline |
| liquid_capital_range | Liquid Capital Range |
| comfortable_investment | Comfortable Investment |
| financing_interest | Financing Interest |
| spouse_alignment | Spouse Alignment |
| employee_tolerance | Employee Tolerance |
| sales_comfort | Sales Comfort |
| recurring_revenue_preference | Recurring Revenue Preference |
| brick_and_mortar_tolerance | Brick and Mortar Tolerance |
| ownership_timeline | Ownership Timeline |
| risk_tolerance | Risk Tolerance |
| ownership_fit_summary | Ownership Fit Summary |
| ownership_primary_conflict | Ownership Primary Conflict |
| ownership_report_url | Ownership Report URL |
| ownership_assessment_completed_at | Ownership Assessment Completed At |
| ownership_call_booked | Ownership Call Booked |

Do not put full transcripts into HubSpot fields.
