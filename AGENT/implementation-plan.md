# Court Booking Platform — Implementation Plan

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

Source: `Agent/court-booking-platform-spec.md`, updated 2026-10-25. These companion instructions derive from that specification; they do not replace it.

Source SHA-256: `02dd58daada1d183866775301a2d3ef042ab6efbe32c9e25e0f865c7ab7c082f`

Status: M5 implementation in progress. M1–M3 local implementation and Compose checks are present. M4 provider-independent persistence and concurrency work is verified; Kashier/thin-client acceptance remains open. M5 cancellation policy foundation is started.

## Execution contract

### Approved client restart — 2026-10-25

Discovery follow-up: six public operations now documented (20 total); unavailable venue detail returns 404/NOT_FOUND. Three added contract tests bring API unit results to 29 passed, with 9 integration skipped. Shared-client suite remains 11 passing. Availability reservation/opening-hour correctness, cursor pagination, full mock fixtures, and W1 browser acceptance remain unchecked.

The owner approved the attached client brief and STEP 0 plan: workspace/mock foundation, W1–W6, P1–P5. This authorizes client work despite the older backend-first restriction; it does not establish completion of unfinished backend gates. D01–D12 are retained. Forgot/reset-password client screens are excluded, and the brief's dark/lime design supersedes light-first client guidance.

Verified foundation slice: 11 shared-client transport/contract tests pass; auth response schemas and corrected HTTP response codes are generated; web uses actual `/me` identity and clears caches on session expiry/logout. API unit suite: 26 passing, 9 integration skipped. API/web typechecks, changed-source lint, and Vite build pass. Business endpoint contracts, mock server, dependency pin upgrades, tokens/i18n, and full W1 acceptance remain unfinished. No milestone checkbox is changed.

Read the specification first, then `Agent/skills.md`, `Agent/goals.md`, and `Agent/rules.md`. Implement a complete backend before full web, and full web before full mobile. Retain M4's deliberately small web/Expo integration proof and the early mobile build required by source section 3. Do not postpone concurrency, authorization or payment reliability until the UI exists.

The milestone checklists below are copied from the source. Use its full schema, endpoint inventory, role pages and acceptance cases as the detailed task catalog; these checklists are not permission to omit endpoints. Track each implemented route against source section 9 and every client page against sections 12–13.

## Approved decisions

D01–D12 were approved by the project owner on 2026-10-25 and synchronized into the specification. `decisions.md` contains the exact boundary behavior and required tests.

| Decision group | Approved behavior | Milestones |
| --- | --- | --- |
| D01–D03 | Exact 24 hours is free cancellation; late cancellation and confirmed no-show retain only the 30% deposit | M5–M6 |
| D04–D05 | No-show remains pending through dispute handling; strikes/releases wait; completion cannot precede booking end | M5–M9 |
| D06–D07 | Password change revokes all sessions; a strike block prevents only new bookings | M2, M6 |
| D08–D09 | Manual bookings carry no commission; major venue changes require reapproval and closures protect/refund bookings | M5, M7–M8 |
| D10 | A browser profile has one synchronized active account across tabs | W1 |
| D11 | Idempotency, rounding, password/link, and upload defaults are fixed in specification 2.12 | M1–M5 |
| D12 | Required refunds must succeed before commission or venue release | M5, M9 |

## Provisional assumptions inventory

## 15. Open decisions and assumptions

The agent implements the suggestion as a named constant or configuration until the owner decides.

| # | Decision | Current default |
| --- | --- | --- |
| 1 | Who bears gateway fees, including on refunds | The platform, from its commission |
| 2 | Payout schedule | Weekly, for released amounts |
| 3 | Maximum commission | 20% (minimum 10% is fixed) |
| 4 | Fawry (pay at an outlet) | Left out of v1 because of the 10-minute hold |
| 5 | Padel slot length | 60 minutes, same as football |
| 6 | Refresh token lifetime | 30 days |
| 7 | When late-cancel deposits are released to the venue | After any required refund succeeds (approved D12) |
| 8 | Payout method to venues (bank transfer, Instapay, wallet) | To be confirmed with real venues; the admin sends money manually in v1 |
| 9 | Digits in Arabic mode | Latin digits |
| 10 | Blocking by payment identity | Only if Kashier exposes one (question 7 in 6.7) |
| 11 | Venue price change delay | 24 hours |

## Dependency adjustments within the source milestone order

- M1: create outbox/event and money schemas, idempotency persistence design and immutable-ledger/audit migration foundations. Add domain clock and shared contract tooling early.
- M2: establish the authorization test harness before business routes. Use a minimal transactional verification/reset email outbox with Mailpit so auth flows can actually be demonstrated; full delivery features remain M9.
- M3: implement approved seed venues and pricing/read-side permissions without prematurely building all owner screens.
- M4: implement booking events, payment reconciliation and hold-expiry jobs now, because the vertical slice depends on them. Provision `api-client`, minimal web and Expo shells early enough to test workspace wiring in week one. Sandbox credentials are a hard gate for M4's final acceptance; fake tests permit local progress only.
- M5: establish cancellation, refunds and immutable ledger effects. If M4 needs payment ledger writes, wire minimal payment-confirmation entries there and complete all financial cases here. Domain events, financial effects and notification intents must have an explicit atomic boundary; do not defer consistency to M9.
- M6: implement player-facing disputes/appeals and policy tests; seed or test-only application fixtures can exercise admin decisions until M8 exposes those endpoints. Temporary test helpers must never be public production routes.
- M7: add owner no-show/check-in/manual operations; exercise M6 trust policies end to end. Use the source's temporary CLI/seed approval until M8.
- M8: expose all admin decisions and payout workflows with audit requirements; replace temporary demonstration steps with real admin flows.
- M9: complete all channel adapters/templates, inbox/preferences, scheduled jobs, monitoring and recovery; consolidate rather than duplicate jobs already required by M4/M5.
- M10: run integrated security, concurrency, financial, failure-recovery and staging verification before full client implementation.

## Phase 1 task checklist

## 11. Phase 1: Backend

**Goal:** a complete, tested API for all three roles, usable before any screen exists.

Every milestone ends with the checks from section 0, item 10. Tick tasks as they are done.

### M1. Foundation

- [ ] Create the monorepo (pnpm, Turborepo), packages `shared`, `config`, and the `api` skeleton in NestJS.
- [ ] Docker Compose with Postgres, Redis, Mailpit. Env validation with Zod.
- [ ] Prisma schema for sections 8.2 to 8.6, hand-written SQL migrations for constraints, triggers, partial indexes.
- [ ] Config module with every constant in 2.11.
- [ ] Clock, Money, TimeRange, domain error base classes, global error filter, request ID, structured logging.
- [ ] CI pipeline with lint, type check, architecture test, and tests.
- [ ] OpenAPI generation from Zod schemas.

**Done when:** `pnpm test` and CI pass on an empty app with the database and migrations applied.

### M2. Auth and the authorization harness

- [ ] Register (player or owner), verify email, login, refresh with rotation and reuse detection, logout, logout-all, forgot and reset password, change password, `GET/PATCH /me`, `DELETE /me`.
- [ ] Guards: deny-by-default, `@Public`, `@Roles`, `@CurrentUser`. Rate limiting.
- [ ] Admin creation CLI.
- [ ] Test harness that runs the section 5.7 matrix for every route, plus the route scan.

**Done when:** all auth flows work against Mailpit, and the matrix runs in CI.

### M1/M2 continuation record — 2026-10-25

- Status: M1 and M2 are not marked complete because their service-backed acceptance gates are unavailable in this environment.
- M1 evidence: foundation workspace, Prisma schema/migrations, config, primitives, CI, OpenAPI generation, and local checks already exist. Docker/PostgreSQL migration application remains unverified.
- M2 delivered: Prisma-backed auth repository, persisted refresh-token history for rotation/reuse detection, async repository port, approved password/link timing defaults, Argon2id/JWT/session flows, deny-by-default guards, route scan, admin CLI, and Mailpit adapter.
- Validation: `pnpm typecheck` passed; `pnpm test` passed with 14 tests; Prisma format, validation, client generation, build/lint/architecture/OpenAPI checks passed in the current implementation history. The current machine cannot run `docker compose up -d postgres redis mailpit`; ports 5432, 6379, and 8025 are unavailable.
- Contracts/migrations: added `0002_auth_refresh_history/migration.sql`; generated Prisma client refreshed. No M3 or later route/schema work started.
- Decisions: D01–D12 approved and synchronized; D06 all-session password revocation and D11 exact auth limits are implemented.
- External blocker: Docker Desktop or reachable PostgreSQL, Redis, and Mailpit services are required for M2 migration, end-to-end email, and CI-equivalent authorization verification.
- Next action: start services, apply migrations, run the complete M2 HTTP/auth/Mailpit/matrix gate, and only then update M2 checkboxes and begin M3.

### M3 development record — 2026-10-25

- Status: Development started independently while M2's external service gate is blocked; M3 is not complete and its checklist remains unchecked.
- Delivered locally: venue/court/geography types, timezone-aware hourly price calculation with rule version validity, seeded Cairo read fixtures, public city/area/venue/quote/availability controllers, and price version tests.
- Validation: typecheck, formatting, and the API test suite pass locally after the M3 changes. Prisma-backed seed/read behavior and database integration are not verified.
- Next action: finish M2 service verification, then implement M3 Prisma repositories/seed command and full public endpoint acceptance before advancing to M4.

### Compose verification record — 2026-10-25

- PostgreSQL, Redis, and Mailpit started successfully with Docker Compose. PostgreSQL uses host port 15432 because host port 5432 is occupied by an unrelated PostgreSQL process.
- Migrations `0000_init`, `0001_foundation`, and `0002_auth_refresh_history` applied successfully after correcting the overlap constraint to use a UTC-normalized immutable expression.
- `pnpm db:seed` passed and produced 1 city, 2 areas, 3 approved venues, 6 courts, and 42 price rules.
- Prisma/Mailpit auth integration passed: registration persisted, verification mail was delivered, verification succeeded, refresh rotated, and reuse revoked the session family.
- M2 is not complete until the section 5.7 HTTP matrix and route-level integration pass. M3 is not complete until public reads use the Prisma repository and its integration suite passes.

### M3. Venues, courts, pricing, availability (read side) and seed data

- [ ] Cities and areas, venues, courts, opening hours, price rules with versioning.
- [ ] `PriceCalculator` (each hour priced separately, midnight crossing, snapshot).
- [ ] Availability and quote endpoints, public search.
- [ ] Seed script with a city, areas, 3 venues, and courts. Venues are created this way until the owner endpoints exist.

**Done when:** search and availability return correct slots and prices for overnight venues and across a price-rule change.

### M4. Booking engine and payments: the vertical slice

- [ ] Reservations with the overlap constraint, 10-minute holds, stale-hold handling, booking window and hours limit.
- [ ] `POST /player/bookings` with idempotency, `GET /player/bookings/:id`.
- [ ] Payments module: PaymentGateway port, FakeGateway, KashierGateway against the test environment, webhook handler with signature check, stored events, idempotent processing, reconciliation job, late-payment handling.
- [ ] A bare web page and one Expo screen that run this flow end to end (register, search, book, pay in the sandbox, see the booking). This proves the monorepo, shared types, React Native setup, and payments early.

**Done when:** a person can book and pay in the Kashier test environment from both the web page and the Expo screen, and a 50-request concurrency test books a slot exactly once.

### M4 development record — 2026-10-25

- Status: In development; not complete.
- Delivered locally: hold/expiry and overlap policy, idempotency replay/mismatch behavior, FakeGateway checkout/verification, player booking controller, and 50-request competition test.
- Validation: typecheck, lint, architecture, build, and unit tests pass. Compose-backed M2/M3 integration tests pass separately with `RUN_INTEGRATION=1`.
- Not delivered: Prisma transactional reservation/payment persistence, webhook verification/reconciliation, Kashier adapter, minimal web/Expo screens, and end-to-end sandbox payment.
- External blocker: Kashier sandbox credentials and current official provider contract are required for final M4 acceptance; local FakeGateway work continues independently.
- Next action: implement the Prisma booking/payment transaction and webhook persistence before adding the thin client proof.

### M4 provider-independent verification record — 2026-10-25

- Status: Provider-independent M4 implementation verified; milestone remains open for Kashier sandbox and the minimal web/Expo proof.
- Delivered: Prisma transactional booking creation using the PostgreSQL reservation exclusion constraint; persisted holds/payments/idempotency/webhook/refund/audit state; HMAC signature checks; duplicate/out-of-order and late-payment handling; retry reconciliation; and a database-backed 50-request concurrency test.
- Validation: Compose services healthy; migrations have no pending work; seed passes; auth/Mailpit and venue read integration pass; Prisma concurrency integration passes with exactly one winner; format, typecheck, lint, unit tests, architecture, build, and OpenAPI generation pass.
- External gate: Kashier credentials and official provider fields/signature contract are not supplied, so no Kashier adapter or sandbox claim is made. No full web/mobile phase was started.
- Next action: implement M5 Prisma cancellation/refund and ledger persistence.

### M5. Cancellation, refunds, ledger

- [ ] `CancellationPolicy` with unit tests for every case in 2.4, including the 24-hour boundary.
- [ ] Cancel preview and cancel endpoints, refund records and retries, owner and admin cancellation paths.
- [ ] Ledger entries for every case in 6.5, release logic, integrity check.

### M5 development record — 2026-10-25

- Status: In development.
- Delivered: `CancellationPolicy` pure domain primitive and exact-boundary/late/operator unit tests.
- Next action: add cancel preview/cancel use cases, refund retries, and immutable ledger effects before marking M5 complete.

### M5/M6 continuation record — 2026-10-25

- Status: M5 remains in development; M6 policy foundation started.
- Delivered: player cancel preview/cancel routes with refund idempotency and FakeGateway refund calls; `StrikePolicy` warning/block thresholds and six-month expiry tests.
- Validation: format, typecheck, lint, and unit test gates pass; API unit suite reports 17 passing tests.
- Next action: complete M5 refund retry and ledger invariants, then build M6 strike/dispute/appeal persistence.

### M5 ledger integration record — 2026-10-25

- Status: M5 remains in development.
- Delivered: idempotent HELD/refund/release ledger helpers; payment confirmation and successful refunds write immutable ledger rows; retry-safe failed refund processing; player cancellation audit/release effects.
- Validation: Compose-backed booking integration has 2 passing tests covering 50-request concurrency, signed payment confirmation, duplicate webhook handling, late refund, and HELD reconciliation.
- Remaining work: owner/admin cancellation, no-show/dispute release timing, complete refund matrix, release jobs, and full ledger examples.
- Next action: finish M5 financial cases, then implement M6 player trust persistence and protected routes.

### M6 trust persistence foundation — 2026-10-25

- Status: M6 in development; not complete.
- Delivered: Prisma-backed player strike/dispute/appeal reads and writes, blocked-player appeal eligibility, strict DTO validation, and authorization route-scan coverage.
- Validation: format, typecheck, lint, unit tests, and architecture checks pass; 21 unit tests pass. Trust transition integration and admin decisions are not yet verified.
- Next action: complete M5 financial/no-show paths, then add M6 no-show timing, strike finalization, appeal decisions, profile/photo, and reviews.

**Done when:** every row of the refund and ledger tables in 6.4 and 6.5 is a passing test.

### M6. Player features

- [ ] Profile and photo (file upload with signed URLs), strikes list, reviews, disputes, appeals, blocking checks.
- [ ] `StrikePolicy`: warnings at 2 and 3, block at 4, expiry after 6 months.

**Done when:** a player can progress from 0 to 4 strikes, get blocked, appeal, and be unblocked, all through the API.

### Backend verification refresh — 2026-10-25

- Validation: format, typecheck, lint, unit tests, architecture, Prisma validate/format, migration deploy, seed, build, and OpenAPI generation pass. The unit suite has 21 passing tests; Compose coverage includes auth/Mailpit, venue reads, booking concurrency, webhook replay, refund, and HELD reconciliation.
- Status: M5 and M6 remain in development; M7–M10 are not started. No milestone is marked complete without its full acceptance matrix.
- External blocker: Kashier sandbox credentials and official contract details only; the remaining milestone work is unfinished local implementation.

### M5 operator cancellation continuation — 2026-10-25

- Status: M5 remains in development.
- Delivered: owner/admin cancellation routes with role and venue ownership enforcement, full refund persistence, immutable refund ledger effects, and audit records.
- Validation: format, typecheck, lint, 21 unit tests, architecture, build, OpenAPI, Prisma validation, migration deploy, and seed pass.
- Remaining: no-show pending/finalization, release timing/jobs, full refund matrix, and complete M5 acceptance.

### M5 no-show and retry-job continuation — 2026-10-25

- Status: M5 remains in development.
- Delivered: `no_show_pending` migration, owner report timing, 48-hour dispute window, finalization/strike/refund/release logic, and retry-safe booking jobs runner.
- Validation: migration applied, Prisma Client regenerated, format/typecheck/lint/unit/architecture/build/OpenAPI checks pass.
- Remaining: database-backed no-show/dispute integration and complete M5 financial acceptance matrix.

### M6 admin trust decisions — 2026-10-25

- Status: M6 remains in development.
- Delivered: admin dispute uphold/overturn and appeal decision routes with strike removal, reservation transitions, and audit records.
- Remaining: full trust integration, reviews, profile/photo, and complete M6 acceptance.

### M7. Owner module

- [ ] Venue registration, photos, documents, submit, checklist, opening hours, courts, price rules with 24-hour delay.
- [ ] Calendar, bookings list, lookup by code, arrive, collect, complete, no-show (with grace and window), cancel, manual bookings, blocks, court closures with bulk refunds.
- [ ] Reviews and replies, dispute responses, balance, ledger, payouts view, reports.

**Done when:** a new venue can be registered, approved (by seed or CLI until M8), set up, and run through a full day of bookings via the API alone.

### M7 owner setup foundation — 2026-10-25

- Status: M7 remains in development.
- Delivered: Prisma-backed one-venue owner registration, owner venue read/submit routes, strict DTO validation, ownership scoping, and audit records.
- Validation: format, typecheck, lint, 23 unit tests, architecture, build, OpenAPI, migration/seed, and prior Compose integration checks pass.
- Remaining: court/pricing/hour setup, calendar, match-day operations, manual bookings/blocks/closures, reviews, balances, and payouts.

### M5/M6 disputed no-show continuation — 2026-10-25

- Status: M5/M6 remain in development.
- Delivered: pending no-show disputes, admin uphold/overturn state transitions, FakeGateway refund handling for upheld disputes, immutable refund/release effects, and audit records.
- Validation: format, typecheck, lint, 23 unit tests, architecture checks, and existing Compose integration pass.
- Next action: add disputed no-show database integration coverage, then continue M7 owner operations.

### M8. Admin module

- [ ] Approval and rejection with emails, commission changes within 10 to 20%, suspend and reactivate with bulk refunds.
- [ ] Users, strikes removal, appeals, disputes, bookings overrides, review removal, geography management.
- [ ] Payout generation and approval, mark-paid, stuck-items queue, dashboard, audit log queries.

**Done when:** the admin can approve a venue, set commission, decide an appeal and a dispute, and run a payout without touching the database.

### M7/M8/M9/M10 continuation record — 2026-10-25

- M7 delivered: owner court, opening-hour, delayed pricing, booking list, arrive, complete, collect, manual booking, and block routes with Prisma ownership scoping.
- M8 delivered: admin venue decisions, commission bounds/change audit, users listing, and ledger-derived payout generation.
- M9 delivered: transactional outbox enqueue port, persisted notification inbox, read state, and retryable outbox processor.
- M10 delivered: operational runbook and repeatable local load-test script; final backup/restore and full load verification remain to run.
- Status: M7–M10 remain in development until database integration, load, backup/restore, and final authorization evidence pass.

### M7–M10 verification refresh — 2026-10-25

- Delivered: owner balance/payout/report reads; admin user status and payout state transitions; claimed/idempotent outbox delivery; M5 disputed/undisputed no-show integration; M10 load and backup/restore drills; API dependency-injection startup fix.
- Validation: `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test` (23 passing), `pnpm architecture:check`, `pnpm build`, `pnpm openapi:generate`, Prisma validate/format, migration deploy (6 migrations, no pending), and seed pass. Compose integration with `RUN_INTEGRATION=1` passes 6 tests including 50-way booking concurrency, auth/Mailpit, venue read-side, no-show dispute/finalization, and outbox duplicate processing. Load test passes 50/50. Backup/restore drill verifies 3 venues.
- Contracts/migrations: added `0004_outbox_processing` and `0005_notification_effect_key`; generated OpenAPI refreshed. No dependency manifest changes.
- Status: M7, M8, M9, and M10 are not complete; their unchecked requirements remain authoritative and must not be marked complete from these partial results.
- Next action: finish the remaining M7 closure/review/document workflows and M8/M9/M10 acceptance checklist items, then add the thin FakeGateway client proof.

### M6–M9 continuation checkpoint — 2026-10-25

- Delivered: player profile routes, review lifecycle routes, owner court closure workflow, admin geography routes, notification preferences, and delivery-log channel fan-out.
- Validation: typecheck, lint, unit tests (23 passing), format, architecture, build, OpenAPI, and API load checks pass.
- Status: M6–M9 remain incomplete pending database-backed review/closure/preference tests and remaining acceptance checklist items.
- Next action: add the database integration tests named in `progress.md`, then continue M8 bulk refunds/stuck items and M9 scheduled jobs/failure alerts.

### M6/M7 integration verification — 2026-10-25

- Delivered: database-backed review create/reply/remove lifecycle and isolated court closure preview/cancellation/archive coverage.
- Validation: review/closure integration tests pass 2/2; the complete Compose integration set passes 8/8 when combined with auth, venue, booking/no-show, and notification tests.
- Next action: add admin integration coverage and continue the remaining M8/M9/M10 acceptance checklist.

### M8 admin workflow continuation — 2026-10-25

- Delivered: admin stuck-refund listing, bounded bulk booking cancellation, and Prisma-backed geography/user/payout workflows.
- Validation: typecheck, lint, build, and prior architecture/format/unit gates pass after wiring `BookingsModule` into `AdminModule`.
- Next action: add `admin.integration.test.ts` for role/authorization and database state transitions before continuing M9/M10.

### M8 admin integration verification — 2026-10-25

- Validation: admin geography/status/bulk-cancel integration test passes 1/1 against Compose PostgreSQL; implementation typecheck/lint/build remain green.
- Next action: verify notification preference-controlled channels and retry/failure behavior, then complete M9/M10 remaining work.

### M6/M7 acceptance continuation — 2026-10-25

- Delivered: player profile read/update; public/player/owner/admin review routes; owner court closure preview/confirmation with cancellation/refund delegation and court archival.
- Validation: typecheck, lint, unit tests (23 passing), architecture, build, OpenAPI, format, and API load test pass.
- Status: M6 and M7 remain incomplete until database-backed review/closure tests and the remaining checklist requirements pass.
- Next action: add review and closure integration tests, then continue M8 bulk-refund/geography/stuck-item work and M9 channels/jobs.

### M10 evidence continuation — 2026-10-25

- Delivered: protected-route inventory and role matrix assertions; retry/recovery/dead-letter runner evidence; staging env/checklist/smoke/rollback artifacts; FakeGateway web/mobile state proofs; venue-search load script.
- Validation: authorization 3 tests, job runner 2 tests, FakeGateway proof, 9 Compose integration tests, 50/50 health load, 50/50 venue-search load in 170ms, Prisma/migration/seed, format/typecheck/lint/architecture/build/OpenAPI all pass.
- Status: M10 remains locally in development because persisted worker failure integration, full HTTP booking-load scenario, and actual web/Expo workspace clients are not complete. Remote staging/Kashier verification is separately pending.
- Next action: persist worker job state and complete database-backed retry/crash/dead-letter tests, then replace static client proof with the minimal declared web/Expo clients.

### Web integration slice — 2026-10-25

- Delivered: dependency-free `apps/web` local shell with login, venue search, API error/loading/empty states, and FakeGateway payment-state proof; `pnpm dev:web` runner.
- Validation: web files pass direct Prettier formatting; FakeGateway proof passes. No runtime dependency was added; the lockfile received an empty workspace importer for `apps/web`.
- Scope: this begins the web phase and does not claim W1–W6 completion.

### W1/player web foundation — 2026-10-25

- Delivered: design system and client plan documents, shared design tokens, player web auth forms for login/registration/verification/reset request, responsive venue-search shell, and mobile-first player preview.
- Validation: client formatting, JavaScript syntax, shared TypeScript, FakeGateway proof, and web HTTP smoke pass.
- Status: W1 remains incomplete until the generated typed client, React/Vite app, Expo app, and full auth/session regression tests are in place.
- Next action: create the generated OpenAPI client package and wire the player discovery/booking vertical slice.

### Typed client and visual polish checkpoint — 2026-10-25

- Delivered: `packages/api-client` workspace package, reproducible OpenAPI metadata generation for 14 current routes, shared client generation script, refreshed mal3bna visual copy, and HTML escaping in web/mobile venue cards.
- Validation: generator, direct Prettier, client/shared TypeScript, JavaScript syntax, and FakeGateway proof pass. The root `pnpm format:check` cannot complete locally because pnpm stalls at its supply-chain policy metadata check; the local web HTTP smoke could not bind a socket in the restricted runner.
- Status: W1 remains incomplete. The current OpenAPI artifact is limited to 14 auth/health/profile routes, and no React/Vite or Expo runtime dependencies are installed.
- Exact next action: wire the generated client into the player auth/discovery slice, then replace the previews with the declared React/Vite and Expo foundations once dependency installation is available.

### Real client foundations — 2026-10-25

- Delivered: real Vite/React/TypeScript web entry points under `apps/web/src` with generated-client discovery, responsive navigation, authentication dialog, and loading/empty/error states; real Expo Router/React Native entry points under `apps/mobile` with native discovery, filters, retry, navigation, and FakeGateway state proof.
- Validation: direct Prettier and manifest validation pass. Dependency installation was attempted with `pnpm install --lockfile-only --trust-lockfile` and failed at registry DNS resolution for `registry.npmjs.org`; framework typecheck/build cannot be claimed until installation succeeds.
- Additional validation: generated-client formatting is now reproducible; generator, direct Prettier, API-client TypeScript, and FakeGateway proof pass.
- Status: W1/P1 remain incomplete. Registration/verification, venue detail/quote/availability, booking/checkout, secure mobile sessions, and owner/admin surfaces are still next.
- Contracts: no backend change; web and mobile consume the existing API base contract and generated client where available.
- Exact next action: restore npm registry access, install declared workspace dependencies, run web/mobile typecheck and build, then continue the player discovery-to-booking vertical slice.

### W1 web shell and auth — 2026-10-25

- Delivered: Vite/React web app structure, React Router shell, TanStack Query provider, shared i18n package with English/Arabic RTL switching, in-memory access token plus cookie refresh-once client behavior, cross-tab auth broadcast, role guards, login/register/verify/reset routes, and accessible responsive design foundations.
- Validation: Prettier, API-client generation, API-client TypeScript, and manifest validation pass. Full W1 typecheck/build/test gates are blocked by npm registry DNS; `pnpm install --lockfile-only --trust-lockfile` failed resolving `registry.npmjs.org` while fetching `typescript-eslint`.
- Status: W1 is not marked complete. The generated OpenAPI artifact currently exposes 14 routes; business-route client generation and live auth verification remain pending.
- Exact next action: restore dependency installation, run web/i18n typecheck and build, add Vitest and Playwright auth/session coverage, and only then mark W1 verified.

### Web application refactor and player vertical slice — 2026-10-25

- Delivered: organized feature-oriented React/Vite structure; API-backed discovery/search; venue detail and court selection; availability slot grid with consecutive selection; FakeGateway checkout states; auth routes; protected/role routing; owner calendar grid; admin venue approval queue; responsive dark pitch-green design system.
- Validation: Prettier passes and API-client TypeScript passes. Web typecheck is blocked before source analysis because `vite/client` and `vitest/globals` are not installed. Dependency installation remains blocked by npm registry DNS.
- Status: W1/W2 remain incomplete. Checkout booking creation/confirmation, booking history/cancellation, and complete owner/admin page inventories are next. Do not mark these milestones complete.
- Exact next action: install declared dependencies, run build/typecheck/tests, then connect checkout to the real booking endpoint and implement the remaining player journey tests.
- Verification refresh: elevated `pnpm install --trust-lockfile` completed successfully; API-client ESM build, web typecheck, and Vite production build passed. The dev server is running at `http://localhost:5173/` and returns HTTP 200.

### M9. Notifications and jobs

- [ ] Outbox, email channel, push channel, inbox, preferences, English and Arabic templates.
- [ ] Every job in 7.3, plus the job monitor and failure alerts.

**Done when:** every event in 7.2 produces the right notifications, and jobs pass tests with a controllable clock.

### M10. Hardening and staging

- [ ] Full authorization matrix, concurrency tests, ledger invariant tests, webhook replay tests.
- [ ] Load test of search and booking creation.
- [ ] Deploy to staging with the Kashier test environment, seed data, backups configured, restore drill done.
- [ ] Postman or OpenAPI collection and a short operations runbook.

**Phase 1 is done when** every flow in this document works through the API, all tests pass in CI, and staging runs the full system.

## Phase 2 task checklist

Prerequisites: M10 accepted; stable OpenAPI/client; authentication transport implemented; approved cross-tab behavior and policy copy applied. Build source section 12 pages and behaviors, including the full public/player, owner and admin inventories.

### 12.7 Milestones

**W1. Shell and auth**

- [ ] App shell, router, role guards, providers, i18n with RTL, design system basics, generated API client.
- [ ] Register, verify, login, reset, session refresh, blocked and unverified states.

**W2. Player flow**

- 2026-10-28 card-payment redesign: responsive form/summary shell, branded masked test-card preview and clearer countdown/sandbox messaging. Source and formatting only; browser/tests unrun at user request; milestone acceptance unchanged.

- 2026-10-28 responsive refinement: desktop checkout gains a wider main column plus sticky payment summary to avoid policy overlap; mobile retains its fixed safe-area action. Source and formatting only; visual/runtime verification unrun at user request.

- 2026-10-28 visual parity update: web checkout matches the mobile single-column summary/policy/options/footer composition with required policy consent; fake card step reuses the same shell. Source/formatting only; runtime and milestone acceptance unverified at user request.

- 2026-10-28 card-payment UI source update: responsive two-column reservation summary and refreshed fake card form, hold countdown/progress, accessible fields, Arabic copy and editable declined-payment retry. Three-digit CVV and server-authoritative confirmation retained. Formatting only; tests/browser acceptance unrun at user request; W2 completion status unchanged.

- [ ] Search, venue page, slot picker, checkout, payment return, my bookings, cancel flow.
- [ ] Profile, strikes, appeal, reviews, notifications inbox, settings, account deletion.

**W3. Owner setup**

- [ ] Registration, setup checklist, venue profile and photos, documents, hours, courts, pricing.

**W4. Owner operations**

- [ ] Calendar, bookings, match-day actions, manual bookings, blocks, closures, reviews, disputes, balance, payouts, reports.

**W5. Admin panel**

- 2026-10-28 interaction update: replace native dispute/venue/court/payout prompts with shared in-app required-input dialogs and toast outcomes; owner submission uses a styled confirmation. Cancel performs no action. Source changes only; checks unrun at user request and acceptance remains unverified.

- 2026-10-28 targeted correction: admin booking search now uses API-filtered pages without a second page-local filter; search/status resets, loading-aware pagination, no-match feedback, missing status controls and Arabic/RTL copy updated. Source changes only; tests/checks deliberately unrun at user request. W5 acceptance remains unchecked.

- [ ] All admin pages in the table above.
- Implemented on 2026-10-26: role-protected, paginated all-reservations inventory at `/admin/bookings`, including player, manual, block, and historical/cancelled records; page refreshes every five seconds. Added OpenAPI and generated-client route metadata. W5 remains incomplete pending its other acceptance criteria.

**W6. Polish and release**

- [ ] Arabic translation review, accessibility pass, responsive pass, Sentry, end-to-end tests for the main flows (Playwright), performance pass, production build deployed to staging.

**Phase 2 is done when** a venue can sign up, get approved, and run a full day of bookings entirely from the web, a player can book and pay end to end, and the admin can run approvals, disputes, and payouts.

## Phase 3 task checklist

- 2026-10-28 Explore correction: public discovery reads no longer fail when session restoration changes identity mid-request; tunnel headers and translated error classification added. Source-only correction; runtime/device acceptance unverified by user request.

- 2026-10-28 mobile UI source update: full-screen reference-inspired checkout with fixed policy/payment footer, reusable summary/policy components and responsive strike-warning card. Approved payment/cancellation/access rules retained. Formatting only; tests/device acceptance unrun by user request. No phase completion claimed.

- 2026-10-28 mobile discovery optimization: bounded public read cache and request deduplication, virtualized responsive card list, filter race protection, and non-overlapping/cancelable live-slot polling. Tests and performance measurements unrun at user request; mobile acceptance checkboxes remain unchanged.

Prerequisites: backend and web acceptance; early Expo build already proven; stable typed client; mobile auth/deep-link contracts; development credentials and devices available. Implement every screen and native capability in source section 13, including reset/verification, review/dispute, settings and account deletion even where a short milestone bullet omits them.

### 13.6 Milestones

**P1. Shell and auth**

- [ ] Expo app, monorepo packages wired, role routing, secure storage, i18n with RTL, generated client, login and register.

**P2. Player flow**

- [ ] Search, venue, slot picker, checkout with in-app browser and deep link return, bookings, cancel, profile with photo, appeal, inbox.

**P3. Owner operations**

- [ ] Today, calendar, QR scan and code entry, match-day actions, manual booking, quick block, cancel.

**P4. Push and polish**

- [ ] Token registration, all notification deep links, preferences, offline banner, accessibility, Arabic review, Sentry.

**P5. Release**

- [ ] Store accounts and listings, privacy and deletion requirements, TestFlight and Play internal builds, review submission.

**Phase 3 is done when** both roles can do their daily work from the app, and the app is published to the stores or in review with production configuration.

## Critical verification scenarios

| Area | Cases required before sign-off |
| --- | --- |
| Booking | Adjacent slots; multi-hour overlap; manual/block competition; 50 concurrent requests; stale holds; exactly lead/advance/max-hours limits |
| Time/pricing | Overnight venue; Cairo DST; per-hour price breakdown; delayed price activation; snapshot immutability |
| Payments | Deposit/full; server verification; bad signature; duplicate/reordered/lost events; gateway timeout; checkout retry; late paid/free slot and late paid/taken slot |
| Refunds/ledger | Each source example; approved D01 exact 24-hour boundary; partial refund; failed/duplicate refund; release retry; negative balance; payout replay; immutable rows; HELD reconciliation |
| Trust | No-show grace and marking-window edges; dispute deadline; approved D04 strike timing; one strike per booking; warnings at 2/3; block at 4; expiry; rejected appeal wait; overturn after payout |
| Authorization | Every protected endpoint across identity/role/ownership/state cases; public endpoint allow-lists; signed files; no player-email/history leakage; route declaration scan |
| Session | Rotation/reuse; revoke/logout/password reset; concurrent refresh; role/account cache changes; blocked player preserves existing bookings |
| Delivery | Transaction rollback leaves no delivered message; retry/crash deduplication; invalid push cleanup; cancelled booking reminders suppressed; English/Arabic templates |
| Clients | Search-to-payment-to-confirmation; cancellation preview; owner match-day actions; admin disputes/payout; QR fallback; deep links; RTL; keyboard/accessibility; offline mutation restriction |
| Operations | Fresh migrations; rollback compatibility; API/worker restart; dead-letter replay; secret redaction; restore drill; staging smoke; agreed load budget |

## Milestone completion record

For every milestone, append this record and update only verified task checkboxes:

```markdown
### Milestone [ID] — [status]
- Delivered: [features/endpoints/screens]
- Source coverage: [sections and route/page checklist]
- Validation: [exact commands, results, environment]
- Contracts/migrations: [changes; generated client updated]
- Demo: [repeatable command/script]
- CHANGELOG: [entry]
- Deviations/decisions: [IDs and approved resolutions]
- External blockers: [credentials, devices, provider answers]
- Remaining work: [specific tasks]
```

## Final launch gate

## 14. Launch checklist

- [ ] Talk to 3 to 5 real venue owners to validate prices, slot length (60 minutes, including padel), and the payout method.
- [ ] Kashier merchant account approved for live use, the questions in 6.7 answered in writing, and the live keys stored as secrets.
- [ ] Accountant and lawyer reviewed how the platform holds and pays out venue money, the terms of service, and the privacy policy.
- [ ] Sender domain verified (SPF, DKIM, DMARC) and a test of every email in English and Arabic, including how they look in common mail apps.
- [ ] Production backups running and one restore drill completed.
- [ ] Authorization matrix, concurrency, ledger invariant, and webhook replay tests green on the release build.
- [ ] Load test of search and booking creation at several times the expected launch traffic.
- [ ] A pilot with 2 to 3 friendly venues and real players before opening to everyone. Seed the areas list for the launch city.
- [ ] Support contact (form or WhatsApp) staffed, and an admin on call for disputes and failed refunds.
- [ ] Store listings approved or in review.

Production deployment follows source section 10's manual approval from a tagged main release. Prepare a reviewable release with test evidence, migration/rollback steps and configured observability before that approval. Store publication and live merchant activation require their external accounts and reviews; do not describe them as completed from local tests.
