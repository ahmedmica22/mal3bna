# Court Booking Platform — AI Agent Instructions

Updated: 2026-10-25

This is the primary entry point for every AI coding session. It consolidates the essential project context, goals, skills, and rules. The separate documents remain the detailed references.

## 1. Authority and reading order

Read before coding:

1. `AGENTS.md` — this consolidated guide.
2. `Agent/court-booking-platform-spec.md` — authoritative product/build specification.
3. `decisions.md` — pending questions and approved clarifications.
4. `Agent/implementation-plan.md` — ordered milestones and acceptance work.
5. `progress.md` — verified status, blockers, and next task.
6. `Agent/project-context.md`, `Agent/goals.md`, `Agent/skills.md`, and `Agent/rules.md` — extended guidance.
7. `README.md` and `.env.example` — onboarding and configuration.

User instructions govern the requested work. The specification is the product authority. Only an expressly approved, dated decision may clarify or amend it. Pending recommendations are not approved. If requirements conflict, block only the affected task, document the conflict, and continue independent work. Never import requirements from older conversations or unrelated projects.

## 2. Project context

Build an Egypt-focused football and padel court-booking marketplace with venue operations and super-admin oversight.

- Visitors browse approved venues, courts, availability, prices, and reviews.
- Players book consecutive hourly slots, pay online, cancel, review, dispute no-shows, and appeal blocks.
- Owners register one venue in v1, configure courts/prices/hours, manage reservations, and perform match-day actions.
- Super admins approve venues, manage users/geography, resolve disputes/appeals, control commission/payouts, inspect failures, and read audit history.

Use EGP, `Africa/Cairo`, English by default, and Arabic with RTL.

| Application | Roles | Purpose |
| --- | --- | --- |
| Web | Visitor, player, owner, admin | Complete browser experience |
| Mobile | Player and owner | Player features and owner daily operations |
| API/worker | Authorized clients/system jobs | Authoritative rules, data, integrations, and background work |

One account has one immutable role. Players and owners self-register; admins are created only through CLI/seed. Mobile contains no admin UI. Advanced owner setup/management stays web-only where specified.

### Locked business summary

- Instant booking; no owner approval.
- Fixed 60-minute football/padel slots starting on the hour.
- Consecutive hours up to the venue limit, default four.
- Booking window: one hour before kickoff through 30 days ahead.
- Payment hold: 10 minutes.
- Pay 30% online plus 70% at venue, or pay 100% online.
- No rescheduling; cancel and rebook.
- Price each hour by court/day/time and freeze the breakdown on the booking.
- Price changes activate after 24 hours for future bookings.
- Football sizes: 5, 7, or 11. One padel court equals one booking.
- Four active strikes block new bookings; strikes expire after six months. Existing data/bookings and appeals remain accessible.
- Only approved venues are public/bookable.
- One review per completed booking.

Cancellation, no-show, release, manual-booking money, venue edits, cross-tab sessions, and technical limits follow the approved D01–D12 entries in `decisions.md`.

### Current state

- Application code has started; M1 foundation and M2 auth implementation are present.
- Current milestone: M5 — Cancellation, Refunds and Ledger.
- D01–D12 were approved on 2026-10-25 and synchronized into the specification.
- Kashier sandbox credentials, providers, hosting, store accounts, and performance targets are not established.
- README commands and `.env.example` are proposed until M1 verifies them.

Always re-check `progress.md`, which becomes the current-state authority as implementation proceeds.

## 3. Goals

Deliver a reliable marketplace and venue-operations system with a backend strong enough for both web and mobile.

| Role | Required outcome |
| --- | --- |
| Player | Browse, quote, book, pay 30%/100%, cancel with exact preview, review, dispute, and appeal |
| Owner | Submit/operate one venue, configure courts/pricing/hours, check in players, collect cash, inspect money |
| Admin | Manage approvals, suspensions, commission, users, disputes, appeals, payouts, geography, audit, and failures |

### Phase outcomes

1. **Backend M1–M10:** Complete API, strict authorization, database-enforced booking correctness, retry-safe payments/refunds/jobs, correct ledger, and staging operations.
2. **Web W1–W6:** All specified role flows with English/Arabic, RTL, responsive layouts, and accessibility.
3. **Mobile P1–P5:** One Expo app for player flows and owner daily operations with secure sessions, payment deep links, QR, and push.

M4 may include only a minimal web/Expo payment slice to prove integration. An early Expo build is required; full client development still follows backend completion.

### Quality outcomes

- Authorization matrix proves role/ownership separation for every protected endpoint.
- Fifty simultaneous requests for one slot produce exactly one reservation.
- Specification refund/ledger examples pass; retries never duplicate money effects.
- Time tests cover boundaries, midnight, overnight venues, and Cairo DST.
- Strict typing, lint, architecture, migration, OpenAPI, and generated-client checks pass.
- Required loading, empty, error, offline, localization, RTL, and accessibility states work.
- Staging has monitoring, recovery instructions, backups, and a restore drill.

Do not invent performance targets. Agree on traffic and latency/error budgets before load-test sign-off.

### Out of scope

Do not add split payments, open matches, player matching/directory, recurring bookings, split pitches, staff accounts, multiple venues per owner, promo codes, memberships, featured venues, Fawry, phone OTP, admin 2FA, browser push, SMS, or automated payouts unless the specification is formally amended.

## 4. Required skills

| Capability | Apply it here |
| --- | --- |
| TypeScript monorepos | Strict TypeScript, pnpm workspaces, Turborepo, shared packages |
| NestJS/clean architecture | Modular monolith with domain, application, infrastructure, presentation |
| SOLID/domain modeling | Small use cases, rich entities, value objects, policies, ports, injected clock |
| PostgreSQL/Prisma | Transactions, constraints, partial indexes, exclusion constraints, immutable triggers |
| Auth/security | Argon2id, JWT sessions, refresh rotation, ownership scoping, role DTOs |
| Payments | PaymentGateway, FakeGateway, Kashier checkout/server verification, replay safety |
| Financial systems | Integer piastres, basis points, immutable ledger, refunds, releases, payouts |
| Async reliability | PostgreSQL transactional outbox, locks, backoff, deduplication, dead letters |
| React web | Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind |
| Expo mobile | Expo Router, SecureStore, development builds, deep links, QR, push |
| Localization | Shared English/Arabic catalogs, logical CSS, RTL, Cairo time |
| Operations | Docker, CI, migrations, secrets, monitoring, backups, rollback, staging |

Use current official documentation for Kashier, Expo/native modules, and app-store requirements. Never guess provider fields/signatures/policies. FakeGateway supports local work but does not prove sandbox integration.

## 5. Architecture and rules

Use one TypeScript monorepo:

```text
court-booking/
├── apps/
│   ├── api/       # NestJS API and worker entry points
│   ├── web/       # React, Vite, React Router
│   └── mobile/    # React Native, Expo Router
└── packages/
    ├── shared/    # Types, Zod schemas, display constants
    ├── api-client/# Generated API client/query hooks
    ├── i18n/      # English/Arabic translations
    └── config/    # Shared TS/lint/format config
```

### Architecture

- Business rules live only in backend domain code. Clients never calculate refunds, strikes, commission, release, or eligibility.
- Core modules use `domain`, `application`, `infrastructure`, and `presentation`.
- Domain imports itself only; application imports domain/ports; infrastructure imports domain/application; presentation imports application.
- Domain cannot import NestJS, Prisma, HTTP, or provider SDKs.
- Controllers validate strict Zod input, call one use case, and map an allow-listed DTO.
- Use rich entities, pure policies, small ports, repositories, domain events, transactional outbox, and injected clock.
- Keep shared packages free of backend business logic.
- Generate OpenAPI from schemas and the typed client from OpenAPI; never hand-edit generated code.

### Data, reservations, and money

- Use UUIDs, UTC `timestamptz`, venue IANA time zones, integer piastres, and basis points. Never use floating-point money or fixed offsets.
- Centralize specification section 2.11 constants.
- Freeze hourly prices and commission rates on bookings.
- Use SQL migrations for checks, partial indexes, overlap exclusions, and immutability Prisma cannot express.
- Player bookings, manual bookings, and blocks share one database overlap constraint. Use half-open ranges.
- Require `Idempotency-Key` for booking creation/money actions. Persist replay results atomically and reject key reuse with different payloads.
- Ledger/audit rows are immutable; correct errors with reversing entries.
- Write refund ledger entries only after confirmed refunds.
- Generate payouts from released ledger balances; never type amounts manually.
- Archive venues/courts and retain required financial/audit/trust records.

### Authentication, ownership, and privacy

- Deny every route unless explicitly public or role-declared.
- Derive identity from authentication, never ownership fields in request bodies.
- Enforce ownership in application use cases/scoped repositories.
- Return 401 for invalid credentials, 403 for wrong role, and 404 for another user's resource.
- Build the authorization matrix/route scan in M2 before business endpoints.
- Use Argon2id, rotating hashed refresh tokens, family reuse revocation, hashed single-use links, and rate limits.
- Web: access token in memory; refresh token in Secure/HttpOnly/SameSite cookie. Never use localStorage for tokens.
- Mobile: SecureStore. `X-Client: mobile` never bypasses authorization.
- Use role-specific DTO allow-lists. Owners never receive player email/full history/other-venue data.
- Protect documents/player photos with authorized short-lived signed URLs. Venue photos may be public.
- Audit admin writes and sensitive owner actions; redact credentials and sensitive values.

### Payments, jobs, and notifications

- Keep Kashier URLs, headers, and fields inside its adapter.
- Never trust redirects as payment proof. Verify signatures/payment server-side, including booking/session, amount, and currency.
- Store/deduplicate webhook events, acknowledge quickly, and process with workers.
- Persist notification intents through the transactional outbox; domain code never sends email/push directly.
- Make workers safe for at-least-once delivery using unique effect keys, locks, backoff, and dead-letter recovery.
- Late payments atomically recheck availability: confirm if free; otherwise refund and notify.
- Never log secrets, passwords, tokens, or complete payment payloads.

### Web and mobile

- Use generated API client and TanStack Query for server state; keep UI state local.
- Coordinate concurrent refresh and clear user-specific caches on logout/account change.
- Client route guards improve UX; backend authorization remains mandatory.
- Checkout shows court size, hourly prices, payment option, policy, warnings, and authoritative hold expiry.
- Payment return fetches/polls the API and never assumes success.
- Cancellation displays a fresh server preview.
- All copy comes from shared translations. Support English, Arabic, RTL, and venue-time formatting.
- Provide loading, empty, error, pending, offline, responsive, and accessible states.
- Mobile never queues payments/check-ins offline. Deep links re-check role/resource access.

## 6. Work procedure

1. Inspect the repository and scripts; preserve unrelated user work.
2. Read `progress.md`, the current milestone, relevant source sections, and approved or newly pending decisions.
3. Implement the smallest coherent task with policy, integration, and authorization tests.
4. Synchronize migrations, DTOs, OpenAPI, generated client, translations, and environment docs.
5. Run relevant checks and the milestone gate; report actual commands/results/environment.
6. Update only verified `Agent/implementation-plan.md` checkboxes.
7. Update `progress.md` with evidence, blockers, and exact next action.
8. Add the required CHANGELOG entry and repeatable milestone demo.

Execute M1–M10, then W1–W6, then P1–P5. Finish and verify one milestone before advancing. Continue unrelated work when a decision blocks only one task.

## 7. Verification and operations

- Enforce strict TypeScript without `any`, ESLint, Prettier, and dependency checks.
- Unit-test policies/entities/value objects with an injected clock.
- Test use cases with fakes and database invariants with real PostgreSQL.
- Test 50-way booking concurrency, authorization/output privacy, webhook replay, payment/refund crash recovery, ledger invariants, and time boundaries.
- Every milestone requires passing applicable tests, lint, type/architecture checks, updated contracts, CHANGELOG, and demo.
- Validate environment config at startup. Commit only `.env.example`, never secrets.
- Ship API and worker separately.
- Run backward-compatible migrations as a release step; document rollback.
- Require staging smoke tests, monitoring, backup restoration, and launch gates before production.
- Never fabricate results. External credentials/services/devices may be blockers.

## 8. Commands and configuration

This handoff contains documentation, not a runnable application. README commands and `.env.example` names are proposed until M1 implements and verifies them.

Use environment variables for secrets/deployment configuration. Do not scatter locked business constants through arbitrary environment values. `VITE_*` and `EXPO_PUBLIC_*` are public build values and must never contain secrets.

## 9. End-of-task report

Report what changed and why, exact validation/results, contract or migration changes, decisions resolved/pending, external blockers/untested limitations, and the next task. Keep `progress.md` factual. Code existence or a fake-provider demo is not completion evidence.

