# Client implementation plan

## Mobile responsive alignment slice — 2026-10-26

- [x] Implement shared responsive native primitives and matching dark/light styling for the main player/owner journey; support compact phones, wider grids, RTL and scrollable keyboard-aware sheets.
- [x] Require authoritative quotes, server FakeGateway confirmation and cancellation previews; implement real owner schedule and explicit walk-in selection without placeholder occupancy/balances.
- [x] Pass mobile typecheck, source lint, client architecture check, formatting and Android export. Commands and exact limitations: MOBILE_WEB_PARITY.md / progress.md. No automated tests were run by user instruction.
- [ ] Native phone/tablet visual and interaction acceptance; full feature, secure-session, deep-link/push and external payment acceptance remain separate. No complete P milestone is claimed.

## Verified architecture maintenance — 2026-10-26

- [x] Refactor existing web role pages into thin routes, feature controllers, typed views, and reusable sections; share dashboard/navigation/forms/dialogs/tabs and split API/type modules.
- [x] Refactor major Expo screens and App composition into feature controllers/models, contracts, sections, and style modules.
- [x] Introduce the venue-read application port, move Prisma job orchestration to infrastructure, and enforce named-layer/client boundaries.
- [x] Verify web 32 tests, API 56 tests with RUN_INTEGRATION=1, API-client 11 tests, mobile four-state payment proof, strict app typechecks, lint, API/package/web builds, OpenAPI generation (22 routes), and Android export. Exact commands and scope are in ARCHITECTURE_REVIEW.md and progress.md.
- [ ] Reconcile full milestone acceptance against implemented endpoints/screens; this maintenance work does not complete product milestones.
- [ ] Complete controller/OpenAPI coverage and mobile shared-session integration before claiming complete typed-client/security acceptance.

The older milestone/status prose below is historical and has not been re-certified by this structural refactor. No unchecked business acceptance criterion was silently marked complete.

## Approved restart — 2026-10-25

STEP 0 approved by the owner. Execute workspace/mock foundation, W1–W6, then P1–P5 in the approved brief's order. Use the feature-oriented layout in that brief, React/Vite web, and Expo mobile. No forgot/reset-password screens; link-driven verification remains. D01–D12 override the brief's ambiguous last-minute cancellation copy.

### Verified foundation work

Discovery follow-up: OpenAPI now covers 20 operations, including six public discovery routes. Added response schemas and corrected unavailable venue detail to 404. API suite: 29 passed, 9 integration skipped. Mock fixtures must not reproduce the current availability/pagination omissions as completed behavior.

- [x] Shared transport exposes structured API errors and request IDs.
- [x] Concurrent 401s share one refresh; mutations preserve their idempotency keys on retry.
- [x] Session changes invalidate late responses and prevent stale refresh resurrection.
- [x] Auth/account response DTOs are generated from OpenAPI; web sign-in retrieves the actual account from `/me`.
- [x] Generator works reproducibly from the package directory; internal OpenAPI references resolve.
- [ ] Complete business endpoint contracts and matching mock server fixtures.
- [ ] Install and validate the approved exact dependency pins, shared design-token package, and complete English/Arabic catalogs.
- [ ] Finish W1 session/cross-tab, role, localization, component, and browser tests.

Evidence: `pnpm --filter @court-booking/api-client test` passes 11 tests; API unit suite passes 26 with 9 integration tests skipped; changed-source lint, API/web typechecks, and Vite production build pass. No complete milestone claim.

## Earlier implementation — historical, not completion evidence

- Local responsive shell and visual tokens.
- Login with access token kept in memory and refresh cookie delegated to the API.
- Registration and link verification; forgot/reset-password client screens excluded by the owner's decision.
- Public venue search and FakeGateway state proof.

## Next slices

1. Player web: discovery detail, quote/availability, checkout, booking history,
   cancellation preview, profile, trust, reviews, inbox.
2. Expo player/owner: secure session adapter, role routing, discovery,
   checkout deep-link proof, bookings, and owner daily operations.
3. Owner web: setup, calendar, courts, pricing, closures, money, reviews.
4. Admin web: approval queues, disputes, payouts, geography, audit, failures.
5. Client regression: component/state tests, Playwright critical journeys,
   accessibility, responsive and offline states.

## Contract rule

Use the generated OpenAPI document and backend DTO behavior. Clients do not
calculate refund, strike, commission, availability, or eligibility decisions.
Kashier remains outside local client acceptance; FakeGateway is the provider.

## 2026-10-28 — Mobile checkout and trust UI implementation note

- Implemented reference-inspired full-screen checkout, reusable summary and policy cards, consent checkbox and fixed FakeGateway action; preserved approved payment/refund rules and server-confirmed receipt flow.
- Replaced overflowing strike warning with a reusable wrapping card and correct four-strike access wording. Shared English/Arabic and RTL layouts included.
- Source and formatting edits only. Tests, API calls, builds and device verification deliberately unrun at user request; acceptance remains pending.

