## Goal

A real member can complete signup steps **Compte → Profil → Proches → Récapitulatif**, log in, and use a basic espace membre. **Paiement** is a stub that hands off to MVP 2.

## Entities

`User`, `Role`, `USER_ROLES`, `Member`, `FamilyMember` (signup Proches only).

## Out of scope

Stripe Checkout / charges / payments, news CMS, notifications, events, forgot-password email, full admin console.

## Child issues

See `MVP1-01` … `MVP1-22` and [`docs/mvp1-issues.md`](../docs/mvp1-issues.md).

## Exit criteria

- Fresh `docker compose up` + Flyway migrations create the identity schema
- User can complete `/adhesion` through récap; account + member (+ proches) persisted
- Login / logout works; `/espace-membre` shows and can edit profile
- Roles loaded from DB; demo user still seedable
- CI frontend lint/build + backend verify pass
- No Stripe checkout required
