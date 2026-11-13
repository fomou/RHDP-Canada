## Goal

Household covered by one membership; news and in-app alerts work.

## Entities

`FamilyMember` (richer UX beyond signup), `News`, `Notification`.

## Work (summary)

- Family CRUD in espace membre
- News CRUD for `ADMIN` / editor; public published list
- Notifications on charge due / payment success; list + mark read
- Replace static `frontend/lib/content.ts` news with API

## Exit criteria

Member manages family; published news appear live; payment/charge events create notifications.

## Depends on

MVP 1 (and preferably MVP 2 for payment-triggered notifications).
