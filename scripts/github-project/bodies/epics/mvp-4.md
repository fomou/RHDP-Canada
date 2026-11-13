## Goal

Announce an event → generate **10 $** contribution charges → members pay selected fees.

## Entities

`Event`, `Contribution` (membership, event, optional `charge_id`, amount, status).

## Work (summary)

- Event CRUD (admin); publish transitions status
- On publish: create `Contribution` + related `Charge` per active membership
- Extend checkout to accept selected charge IDs
- Events list/detail; dashboard pending contributions

## Exit criteria

Publishing an event creates payable charges and checkout can settle them like MVP 2.

## Depends on

MVP 2 (checkout + charges).
