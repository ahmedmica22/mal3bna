# Court Booking Platform — Agent Skills

Source: `Agent/court-booking-platform-spec.md`, updated 2026-10-25. These companion instructions derive from that specification; they do not replace it.

## Purpose and use

Read the complete source specification, `Agent/goals.md`, `Agent/rules.md`, and `Agent/implementation-plan.md` before coding. This file describes required engineering capabilities and how to apply them. It is a project instruction document, not an automatically installed agent skill. Attach it to the coding agent or reference it from the agent's supported repository instruction file.

## Required capabilities

| Capability | Apply it here | Evidence of correct use |
| --- | --- | --- |
| TypeScript and monorepos | Strict TypeScript; pnpm workspaces, Turborepo; shared config and packages | Reproducible install, type checks and affected builds |
| NestJS and clean architecture | Modular monolith; domain, application, infrastructure, presentation | Dependency checks; framework-free policies and entities |
| SOLID and domain modeling | Small use cases, rich entities, Money and TimeRange, injected ports and Clock | Pure policy tests; adapters interchangeable with fakes |
| PostgreSQL and Prisma | Relational modeling, transactions, hand-written migrations, exclusion constraints | Real database tests; one winner in 50 competing slot requests |
| Authentication and authorization | Argon2id, JWT sessions, refresh rotation, ownership scoping, role DTOs | Complete route authorization matrix and leak tests |
| Payment integration | PaymentGateway, FakeGateway, Kashier hosted checkout and server verification | Duplicate/reordered webhook and reconciliation tests |
| Financial correctness | Integer piastres, basis points, immutable ledger, refunds, releases, payouts | Source financial examples and HELD invariant pass |
| Reliable background work | BullMQ, transactional outbox, retry/backoff, locks, dead-letter handling | Replays do not duplicate payments, refunds, releases or messages |
| React web | Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind | Complete role flows, accessible responsive states, Playwright coverage |
| Expo mobile | Expo Router, secure storage, development builds, deep links, QR and push | Device checkout return, role routing and permission tests |
| Localization | Shared English/Arabic catalogs, logical CSS, native RTL, Intl | Both languages reviewed with Africa/Cairo dates |
| Operations | Docker, GitHub Actions, migrations, secrets, monitoring, backups | Staging smoke tests, restore drill and rollback runbook |

## Backend specialization

- Model auth, users, geography, venues, courts, pricing, availability, bookings, payments, ledger/commission, strikes, disputes/appeals, reviews, notifications, files, admin and jobs with explicit module boundaries.
- Keep all policy decisions in API domain code. Clients may validate input shape and render API results, but must not decide refunds, strikes, commission, settlement or booking eligibility.
- Use repositories and ports for the database, payment gateway, email, push, storage and clock. Implement full layers for core modules; use lighter service/repository structures for simple modules as the specification permits.
- Freeze each booking's hourly price breakdown and commission rate. Test price activation, overnight opening hours, UTC conversion and Cairo daylight saving behavior.
- Enforce overlapping reservations in PostgreSQL for player bookings, manual bookings and blocks. Availability reads alone cannot prevent double booking.
- Design idempotency for actor, operation and request payload, with atomic uniqueness and replay behavior. Do not assume gateway retries or queue delivery happen only once.

## Web specialization

- Organize by feature under `app`, `features` and `shared`, with public/player/owner/admin layouts.
- Use the generated API client for server state. Keep local UI state near its component; do not add global state libraries without a concrete need.
- Handle loading, empty, error, stale and pending states, API field errors, countdown expiry and interrupted payment returns.
- Use in-memory access tokens and the server's refresh cookie flow. Coordinate refresh attempts, clear account-specific caches on session changes, and never expose a previous user's cached data.
- Treat route guards as presentation controls; backend authorization remains mandatory.

## Mobile specialization

- Reuse shared contracts, translations and the generated client; build native UI rather than copying DOM components.
- Use Expo SecureStore, development builds and role-specific route groups. Admin has no mobile interface.
- Open hosted checkout in an in-app browser, validate the return route, and fetch authoritative booking status after every return.
- Use camera QR scanning with manual code fallback, image picker with compression, and per-device push registration and cleanup.
- Show cached data offline with a banner; do not queue financial actions or check-ins offline.

## Research and verification discipline

- At implementation time, consult current official documentation for Kashier signatures/fields, Expo monorepos and native modules, and app-store submission requirements. The source's provider notes are a starting point, not permission to guess current APIs.
- Use FakeGateway locally until sandbox credentials exist. Never describe fake-gateway tests as completed Kashier integration.
- Add focused tests alongside behavior, then run each milestone's required gates. Report commands and actual results; label unavailable external checks as blocked.
- If a business choice is unresolved, record it in the decision register in `Agent/implementation-plan.md`. Do independent tasks; do not invent the dependent behavior.
