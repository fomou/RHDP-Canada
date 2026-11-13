## Goal

Join RHDP by paying the **60,00 $** package (50 $ adhésion + 10 $ frais) via **Stripe Checkout**, with charges settled in the DB.

## Entities

`Membership`, `Charge`, `Payment`, `PaymentAllocation`.

## Work (summary)

- Create membership on signup/activation; generate charges (`ADHESION`, `FRAIS_DOSSIER`)
- `POST /api/payments/checkout` → Stripe Checkout Session → session URL
- Webhook on success: `Payment` + `PaymentAllocation`, mark charges paid
- `GET /api/payments/me` for status
- Deprecate fixed PaymentIntent path
- Frontend: fee selection, Stripe redirect, success/cancel, dashboard unpaid/paid strip

## Exit criteria

Test-mode Stripe completes a checkout and charges show as paid after webhook (sequence diagram satisfied).

## Depends on

MVP 1 (identity + authenticated member).
