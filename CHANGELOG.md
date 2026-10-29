# Changelog

## 2026-10-28 — Remove hardcoded Expo credential

- Remove launcher credential fallback/account identity and matching copies from ignored local env files. Use existing Expo login or an inherited environment token; invoke the local CLI directly and preserve tunnel defaults with additional flags.
- No tests/checks run. Expo account-side token revocation remains required and has not been performed.

## 2026-10-28 — Card-payment page redesign

- Add a responsive payment-form/booking-summary layout, prominent hold banner and extracted branded test-card preview with masked number, holder and expiry.
- Improve light/dark surfaces, sandbox messaging and Arabic copy; preserve FakeGateway behavior and three-digit CVV. No tests/checks run by request.

## 2026-10-28 — Checkout layout refinement

- Redesign checkout for desktop with separate booking details and sticky payment summary; retain compact mobile flow. Prevent desktop footer from covering cancellation content.
- Improve date/time presentation, payment choice cards, policy rows and theme/localization styling. No tests/checks run at user request.

## 2026-10-28 — Web checkout aligned with mobile

- Match the mobile checkout's single-column booking summary, rounded price card, cancellation timeline, payment options and fixed consent/payment footer on web.
- Reuse the centered checkout shell for fake card entry, preserving hold timer, three-digit CVV and server-backed confirmation. English/Arabic copy included. No tests/checks run at user request.

## 2026-10-28 — Redesigned web card checkout

- Add a responsive match-summary/payment layout, prominent hold countdown, checkout progress and refreshed card form with accessible labels and English/Arabic copy.
- Restore editing/retry after card decline and retain three-digit CVV. Remove unverified encryption claims; payment confirmation remains server-backed. No tests/checks run at user request.

## 2026-10-28 — Show web fake card checkout

- Stop auto-paying reservations before the card step. A created hold now opens FakeCardForm and payment confirmation follows its server-backed submission. Refresh player booking history after payment. No tests/checks run at user request.

## 2026-10-28 — Three-digit CVV

- Limit web/mobile FakeGateway CVV input and validation to exactly three numeric digits. No tests run at user request.

## 2026-10-28 — Explore device-error follow-up

- Replace native venue-query URLSearchParams usage with encoded query pairs. Add development-only discovery error diagnostics.
- Stream negotiated gzip for JSON through Metro's existing backend proxy and handle disconnects/stream failures. Restart Expo to load proxy changes.
- Prior device error remains unverified; no tests/API checks or performance measurements run at user request.

## 2026-10-28 — Mobile Explore request correction

- Route public discovery GETs through the public client so login/session restoration cannot reject their results as an account change. Keep protected request handling intact.
- Add ngrok warning bypass, classify transport timeouts and show actionable bilingual discovery errors. No tests/checks run at user request; runtime verification pending.

## 2026-10-28 — Mobile checkout and strike warning redesign

- Introduce a reference-inspired full-screen checkout with rounded booking/price cards, cancellation timeline, policy checkbox and fixed payment action. Preserve deposit/full FakeGateway, retry, hold expiry and confirmation behavior.
- Replace overflowing profile strike banner with a responsive reusable card and correct blocked-player access wording. Add shared English/Arabic copy and RTL layouts; retain approved payment/refund terms.
- Formatting only; no tests/checks run at user request. Device layout remains unverified. No dependency, contract or migration changes.

## 2026-10-28 — In-app dialogs and toast feedback

- Replace native web prompts/confirmation windows with a reusable accessible dialog for required action input. Keep outcome messages in toasts and stop dispute submission on cancellation instead of substituting a default audit note.
- Improve toast contrast in light mode, announce notifications accessibly, and translate dialog copy. No tests/checks run at user request.

## 2026-10-28 — Mobile court-loading optimization

- Cache and deduplicate public discovery requests, display cached results immediately, guard filter races, and virtualize venue cards rather than rendering the entire inventory.
- Prevent overlapping availability polling and cancel obsolete slot requests. Live availability remains uncached.
- Source changes only; no tests/checks or performance measurements run at the user's request. No dependency, contract or migration changes.

## 2026-10-28 — Super-admin booking search/filter correction

- Use server-filtered booking pages directly rather than filtering only the current seven rows a second time. Apply search/status changes with page resets and prevent paging through stale results.
- Add missing expired/no-show filters, accurate no-match feedback, accessible controls and Arabic/RTL search copy. No API, migration or dependency changes.
- No tests or verification commands run at the user's request; runtime behavior remains unverified.

## 2026-10-26 — Responsive mobile design and web-flow alignment

- Added reusable native design primitives, responsive venue/stat grids, tablet-width content, safe-area/keyboard-aware sheets, matching light/dark palettes, bilingual copy, accessible navigation controls and unlocked orientation.
- Aligned guest discovery, auth, server-priced consecutive slot selection, deposit/full FakeGateway payment, confirmation, history and server cancellation preview. Removed client-calculated financial guesses and premature payment confirmation; keep booking/payment retries tied to the same reservation.
- Reworked owner overview and schedule with actual earnings/balances, court/date filters, overnight reservations, blocks and daily actions. Walk-ins now select court/date/slot/duration and remain open on failure. Persist profile preference changes; remove browser-only native markup and hard-coded LAN/tunnel API fallback.
- Mobile typecheck, lint, formatting, architecture and Android Hermes export pass. Tests were not added/run by request; native-device and full feature acceptance remain unverified. No dependency upgrade or API/database migration.

## 2026-10-26 — Workspace architecture and component refactor

- Replaced large web page bodies with thin role routes, feature controllers, typed views, and reusable sections. Added lazy routes, shared dashboard/navigation, page templates, accessible dialogs/tabs/fields, and typed photo rendering. Split API services and shared view types by responsibility while keeping facade imports compatible.
- Refactored major Expo screens/modals and App orchestration into feature contracts/controllers/models, views/sections, and separate styles. Removed unsafe error/photo/navigation casts and unused state arguments.
- Added an application venue-read port, moved Prisma booking jobs to infrastructure, expanded API layer checks, and added a client architecture scanner to the root check. Fixed i18n ESM output and formatted existing source files flagged by the workspace formatter.
- Added shared-UI keyboard/label tests; verified web 32 tests, API 56 integration-enabled tests, API-client 11 tests, mobile four-state FakeGateway proof, strict app typechecks, source/test lint, API/package/Vite builds, OpenAPI/client generation, and Android export. See ARCHITECTURE_REVIEW.md for command evidence and remaining architectural risks.
- No dependency upgrades, lockfile changes, or database migrations. Preserved prior localization/theme and local test-payment work. Product acceptance and external provider/device/staging checks are separate.

## Unreleased — Approved client restart: transport and auth contract

- Added six public discovery operations to OpenAPI (20 total), serialized response schemas, and three contract tests. Fixed unavailable venue detail to return 404/NOT_FOUND. API suite now reports 29 passed with 9 integration skipped.

- Added structured API errors with request IDs and a shared in-memory session client with coordinated refresh, one retry, stable idempotency headers, and stale-account response protection.
- Web sign-in now loads the real account from `/me`; logout/session expiry clear account-specific query caches.
- Corrected auth OpenAPI response codes, response schemas, web refresh body optionality, and broken local schema references; generate auth DTO types and support generation from package working directories.
- Added 11 passing transport/contract tests. API unit suite: 26 passed, 9 integration tests skipped. Changed-source lint, API/web typechecks, and Vite build passed.
- Kept D01–D12 and excluded forgot/reset-password client screens as approved. No dependency version or database migration changed.

## 2026-10-25 — M7–M10 verification refresh

- Added owner balance, payout, and occupancy report reads plus admin user-status and payout state workflows.
- Added retry-safe outbox claiming and notification effect-key idempotency with migrations `0004_outbox_processing` and `0005_notification_effect_key`.
- Added database-backed disputed/undisputed no-show and notification integration tests, corrected API gateway injection, and verified 50-request load plus PostgreSQL backup/restore drills.

## 2026-10-25 — M6/M7 acceptance continuation

- Added player profile routes, review lifecycle routes, owner review replies, admin review removal, and owner court closure preview/confirmation with refund delegation and audit coverage.

## 2026-10-25 — M6–M9 continuation

- Added admin geography management, notification preferences, and fake email/push delivery-log fan-out for outbox processing.

## 2026-10-25 — M6/M7 integration verification

- Added database-backed review lifecycle and isolated court-closure integration coverage.

## 2026-10-25 — M8 admin workflow continuation

- Added admin stuck-refund visibility and bounded bulk booking cancellation workflows.

## 2026-10-25 — M8 admin integration verification

- Added database-backed coverage for admin user status, geography reads, and bulk cancellation.

## 2026-10-25 — M10 evidence continuation

- Added the protected-route inventory/matrix assertion, retry/recovery/dead-letter runner tests, staging preparation artifacts, FakeGateway client-state proofs, and a venue-search load scenario.

## 2026-10-25 — Web integration slice

- Added a dependency-free local web shell for login, venue search, and FakeGateway payment-state integration.

## 2026-10-25 — Client foundation and player web auth

- Added the shared UI design system/client plan, design tokens, player web authentication forms, responsive discovery shell, and mobile-first player preview.

## 2026-10-25 — M7–M10 backend continuation

- Added owner courts, opening hours, delayed pricing, booking operations, manual bookings, and blocks.
- Added admin venue decisions, commission changes, user listing, and ledger-derived payouts.
- Added transactional outbox/inbox notification processing and M10 operations/load-test artifacts.

## 2026-10-25 — M5 operator cancellation

- Added owner/admin cancellation endpoints with venue ownership checks, full refund persistence, immutable refund ledger effects, and audit records.

## 2026-10-25 — M5 no-show and retry jobs

- Added the persisted `no_show_pending` state, report timing, 48-hour dispute window, finalization/strike/refund/release logic, and retry-safe booking jobs runner.

## 2026-10-25 — M6 admin trust decisions

- Added admin dispute and appeal decision routes with strike removal and audit records.

## 2026-10-25 — M7 owner setup foundation

- Added Prisma-backed one-venue owner registration, read, submit, ownership scoping, strict DTOs, and audit records.

## 2026-10-25 — M5/M6 disputed no-show continuation

- Connected pending no-show disputes to admin uphold/overturn decisions, FakeGateway refunds, immutable ledger effects, strike creation, and audit records.

## 2026-10-25 — Backend verification refresh

- Re-ran formatting, typecheck, lint, unit tests, architecture, Prisma validation/format/migrations/seed, build, and OpenAPI generation against local Compose services.

## 2026-10-25 — M5 ledger integration

- Added immutable, idempotent HELD/refund/release ledger effects for payment confirmation and cancellation refunds.
- Added database-backed webhook replay, late-refund, and HELD invariant integration coverage.

## 2026-10-25 — M6 trust persistence foundation

- Added protected player strikes, disputes, and appeals persistence routes with strict DTO validation and authorization scan coverage.

## 2026-10-25 — M4 Prisma booking and payment reliability

- Replaced the production in-memory booking binding with Prisma transactional persistence.
- Added persisted holds, payments, idempotency, signed webhook events, late-payment refunds, reconciliation, audit records, and PostgreSQL exclusion-authority concurrency coverage.
- Added provider-independent HMAC webhook tests and FakeGateway refund support. Kashier sandbox verification remains blocked pending credentials and official contract details.

## 2026-10-25 — M5 cancellation policy foundation

- Added the pure cancellation/refund decision policy and exact 24-hour boundary tests.
- Added player cancel preview/cancel routes with idempotent refund records and FakeGateway refund support.
- Added the initial StrikePolicy primitive for M6 thresholds and expiry.

## Unreleased — M2 Auth and Authorization Harness

- Added auth domain/application flows, Argon2id hashing, JWT access tokens, rotating refresh sessions, verification/reset handling, profile routes, and admin creation CLI.
- Added deny-by-default authentication/role guards, route metadata, rate-limit policy, authorization route scan, and auth OpenAPI schemas/paths.
- Added Mailpit delivery adapter and CI Mailpit service configuration.
- M2 remains in progress pending Compose/CI integration verification; Prisma-backed persistence and refresh-token history are now wired.

## Unreleased — M3 Read-side foundation

- Added timezone-aware per-hour venue pricing, seeded Cairo geography/venues/courts, and public read-side venue, quote, and availability routes.
- M3 remains in development pending Prisma-backed seed/read verification; M2 integration remains the ordered gate.

## Unreleased — Compose and database verification

- Started PostgreSQL, Redis, and Mailpit through Compose; applied all three migrations and verified the deterministic M3 seed counts.
- Corrected the PostgreSQL UTC-normalized overlap constraint and added direct Prisma/Mailpit integration coverage.
- Added `class-validator` and `class-transformer` for Nest runtime validation.

## Unreleased — M4 booking/payment core

- Added provisional booking holds, stale-hold expiry, overlap protection, idempotency behavior, FakeGateway checkout verification, player booking routes, and concurrency coverage.
- M4 remains in development pending Prisma transaction wiring, webhook/payment persistence, Kashier sandbox verification, and the minimal client proof.

## Unreleased — M1 Foundation

- Added the pnpm/Turborepo monorepo foundation, shared contracts/config, NestJS API health skeleton, and domain primitives.
- Added local Postgres, Redis, and Mailpit Compose services plus validated environment configuration.
- Added the Prisma model covering identity, geography, venues, reservations, money, trust, notifications, and audit foundations.
- Added PostgreSQL migration foundations for overlap protection, partial indexes, checks, and immutable ledger/audit rows.
- Added CI checks, an OpenAPI artifact generator, and a repeatable M1 demo.

## Unreleased — Client foundation continuation

- Added a generated `@court-booking/api-client` package and `api-client:generate` script for the current OpenAPI artifact.
- Refined the mal3bna player web/mobile preview styling and escaped venue content before HTML rendering.
- Verified direct formatting, syntax, shared/API-client TypeScript, generator, and FakeGateway checks. Full framework client installation remains pending the local pnpm supply-chain metadata check.

## Unreleased — Real client application foundations

- Replaced the dependency-free web preview entry with a Vite/React/TypeScript SPA foundation using the generated API client, responsive discovery UI, authentication dialog, and role navigation shells.
- Added the Expo Router/React Native mobile foundation with native discovery, filters, retry states, bottom navigation, and FakeGateway payment states.
- Declared only the React/Vite and Expo dependencies required by the client applications. Installation is pending npm registry DNS recovery; no lockfile changes were made after the failed resolution.

## Unreleased — W1 web shell and auth

- Rebuilt `apps/web` as a React/Vite/TypeScript application with React Router, TanStack Query, shared i18n, English/Arabic RTL switching, role guards, and accessible auth routes.
- Added in-memory access-token handling, refresh-cookie retry behavior, cross-tab session synchronization, and player/owner/admin route boundaries.
- W1 verification remains pending until the declared dependencies can be installed and the typecheck, build, Vitest, Playwright, and live API auth checks run.

## Unreleased — Web application refactor

- Reorganized `apps/web` into app, component, feature, layout, page, route, service, store, style, and type modules.
- Added real API-backed player discovery, venue detail, court/slot selection, checkout and FakeGateway states, plus functional owner calendar and admin venue approval queue screens.
- Added responsive dark pitch-green styling with accessible focus states, loading/empty/error states, and role boundaries. Full browser verification remains blocked by unavailable npm dependencies.

## Unreleased — Web runtime recovery

- Installed the declared workspace dependencies after restoring elevated registry access.
- Corrected the API client package to emit ESM for Vite consumption.
- Verified web typecheck and production build; the Vite development server is available at `http://localhost:5173/`.

## Unreleased — Role surfaces continuation

- Added functional player profile, owner bookings/calendar/venue/money views, and admin operations data views.
- Verified Compose services, migrations, seed, API startup/health, seeded owner login, web startup, typecheck, and production build.

## Unreleased — Player booking wiring

- Connected successful FakeGateway checkout to `POST /player/bookings` with an idempotency key and booking-reference/error states.
- Re-verified web typecheck and production build.

## Unreleased — Browser registration transport fix

- Enabled credentialed API CORS for the configured web origin.
- Aligned the frontend default API URL with the local Vite/API hostnames.
- Verified preflight and complete registration from `http://localhost:5173` with HTTP 204/201 responses.

## Unreleased — Normal verification flow

- Added clickable verification and password-reset links to Mailpit email content.
- Improved the verification page with pending instructions, resend support, URL-token handling, and a local fallback token field.
- Verified registration and link delivery through the running API and Mailpit.

## Unreleased — Email/password-only sign-in

- Removed forgot-password navigation and manual verification-token entry from the web sign-in flow.
- Kept email verification as a clickable single-use link, with resend and pending states.
- Verified player and venue-owner registration/login roles against the local API.

## Unreleased — Swagger documentation

- Added live NestJS Swagger UI at `/docs` and JSON contract at `/docs-json` with bearer authentication support.
- Verified API typecheck, build, Swagger UI, and Swagger JSON endpoints.

## Unreleased — Admin booking inventory and role navigation

- Confirmed local test booking `C603F614` through a signed FakeGateway event; verified it is confirmed for the player, blocked in public availability, and visible through the authenticated admin booking endpoint. No real payment was taken.

- Added a protected, paginated admin inventory covering player bookings, manual reservations, court blocks, and historical statuses, with venue/court, customer, Cairo time, status, and payment totals.
- Added the admin bookings page with five-second refresh, updated the OpenAPI contract and generated route metadata, and removed Discover from owner/admin navigation. Owner/admin visits to `/` now return to their dashboards.
- Verified API/web typechecks, API and web production builds, OpenAPI/client generation, and that the admin endpoint rejects unauthenticated access with HTTP 401.
