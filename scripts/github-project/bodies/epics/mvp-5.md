## Goal

Operators can run the association without SQL; deploy safely.

## Work (summary)

- Admin UI: members, memberships, charges, payments, events, news moderation
- Role-gated APIs (`ADMIN`) with `@PreAuthorize`
- Payment history and allocation views
- Inquiry/contact form → persisted or emailed
- Prod checklist: Flyway-only schema, secrets, webhook signing, CORS, JWT TTL, no demo seeder in prod
- Expand CI for payment webhook and checkout

## Exit criteria

An admin can onboard, bill, publish, and audit payments without DB access; staging deploy documented in README.

## Depends on

MVP 2–4 features that admins operate on.
