# Court Booking Platform — Project Context

Updated: 2026-10-25

## Purpose

This file gives an AI coding agent a fast orientation at the start of a session. It is a summary, not the source of truth. Read `AGENTS.md` first, then the complete documents it references. When this summary differs from the specification or an approved entry in `decisions.md`, follow those authoritative documents.

## Product

Build an Egypt-focused marketplace and venue-management platform for booking football and padel courts.

- Visitors browse venues, courts, availability, prices and reviews without signing in.
- Players register, book one or more consecutive hourly slots, pay online, manage bookings, review completed visits, dispute no-shows and appeal account blocks.
- Venue owners register one venue in v1, configure courts and pricing, manage the calendar and perform match-day actions.
- Super admins approve venues, manage users and geography, resolve disputes and appeals, control commission and payouts, inspect failures and read audit history.

The launch currency is EGP, the business time zone is `Africa/Cairo`, English is the default language, and Arabic with right-to-left layout is required.

## Applications and roles

| Application | Supported roles | Main responsibility |
| --- | --- | --- |
| Web | Visitor, player, owner, super admin | Complete browser experience for all roles |
| Mobile | Player and owner | Player experience and owner daily operations |
| API and worker | All authorized clients and system jobs | Authoritative business rules, persistence, integrations and asynchronous work |

One account has exactly one role. Players and owners can register; admin accounts are created only through a CLI or seed process. The mobile application contains no admin interface. Owner setup, documents, courts, prices, closures, reviews and financial reports remain web-only where the specification says so.

## Locked business summary

- Booking is instant and does not require owner approval.
- Football and padel use 60-minute slots starting on the hour.
- A player may reserve consecutive hours up to the venue limit, default four.
- Booking opens from one hour before kickoff to 30 days in advance.
- A payment hold lasts 10 minutes.
- The player chooses either a 30% online deposit with 70% due at the venue or 100% online payment.
- There is no rescheduling. A player cancels and creates a new booking.
- Pricing is set per court, weekday and time range. Each hour is priced independently, and the booking stores an immutable price breakdown.
- Price changes affect future bookings after a 24-hour delay.
- Football courts have a required size: 5, 7 or 11 a side. Padel uses one court per booking.
- Strikes expire after six months; four active strikes block new bookings while preserving access to existing data and appeals.
- Approved venues alone appear publicly and accept online bookings.
- Reviews require a completed booking and are limited to one review per booking.

D01–D12 resolve cancellation, no-show, release, manual-booking money, venue edits, cross-tab sessions, and technical defaults. Use `decisions.md` for exact boundaries.

## Architecture and stack

Use one TypeScript monorepo:

```text
court-booking/
├── apps/
│   ├── api/       # NestJS API and worker entry points
│   ├── web/       # React, Vite and React Router
│   └── mobile/    # React Native, Expo and Expo Router
└── packages/
    ├── shared/    # Types, Zod schemas and display constants
    ├── api-client/# Generated typed API calls and query hooks
    ├── i18n/      # English and Arabic resources
    └── config/    # Shared TypeScript, lint and formatting config
```

Core technology choices:

- pnpm workspaces and Turborepo
- NestJS modular monolith with clean architecture
- PostgreSQL and Prisma, plus hand-written SQL for database guarantees Prisma cannot express
- Redis and BullMQ with a separate worker process
- React, Vite, React Router, TanStack Query, React Hook Form, Zod and Tailwind
- React Native with Expo Router and secure token storage
- Kashier behind a `PaymentGateway` interface; `FakeGateway` for local work
- Email and push providers behind interfaces
- S3-compatible public/private storage
- OpenAPI-generated typed client, structured logs, Sentry and GitHub Actions

## Architectural boundaries

Business rules live in the backend domain layer. Web and mobile display API results and never calculate refunds, strikes, commissions, releases or booking eligibility.

Core modules use `domain`, `application`, `infrastructure` and `presentation` layers. Dependencies point inward. Domain code cannot import NestJS, Prisma, HTTP or provider SDKs. Controllers validate input, invoke one use case and map role-specific response DTOs.

Use rich entities, pure policies, small ports, repositories, domain events, a transactional outbox and an injected clock. Store money as integer piastres and commission as basis points. Store timestamps in UTC and calculate local schedules using the venue's IANA time zone.

## Security and reliability priorities

- Deny routes by default and explicitly declare public or allowed roles.
- Scope resources to the authenticated actor in application use cases and repository queries.
- Return role-specific allow-listed DTOs. Never leak another player's or venue's private data.
- Use Argon2id passwords, short-lived access JWTs, hashed rotating refresh tokens and session-family reuse detection.
- Keep web access tokens in memory and refresh tokens in secure HttpOnly cookies. Use Expo SecureStore on mobile. Never store tokens in localStorage.
- Enforce reservation overlap prevention in PostgreSQL. Availability checks alone are insufficient.
- Require idempotency for booking creation and money-changing operations.
- Verify payment success on the server. Do not trust redirects or client state.
- Keep ledger and audit entries immutable. Correct money errors with reversing entries.
- Make jobs, webhooks, notifications, refunds, releases and payouts safe to retry.
- Never log secrets, passwords, tokens or complete payment payloads.

## Implementation order

Follow `Agent/implementation-plan.md`:

1. Backend M1–M10.
2. Web W1–W6.
3. Mobile P1–P5.

The specification permits a minimal web page and Expo screen during M4 to prove the booking/payment integration. It also requires an early Expo monorepo build. These exceptions do not move full client development ahead of the backend.

Every milestone ends with applicable tests, lint, type and architecture checks, updated OpenAPI and generated client contracts, a CHANGELOG entry and a repeatable demo. Record verified results in `progress.md`; do not mark work complete based only on code existence.

## Current state

- Planning documents are prepared.
- Application code has not been started.
- Current milestone: M1 — Foundation.
- D01–D12 in `decisions.md` were approved on 2026-10-25 and synchronized into the specification.
- Kashier sandbox credentials, provider choices, hosting, store accounts and performance targets are not established by this handoff.
- `.env.example` and README commands are proposed contracts until M1 implements and verifies them.

## Document map

| File | Use |
| --- | --- |
| `AGENTS.md` | Start here; authority, reading order and agent workflow |
| `Agent/court-booking-platform-spec.md` | Full authoritative product and build specification |
| `decisions.md` | Pending questions and approved clarifications |
| `Agent/rules.md` | Mandatory engineering, security and verification rules |
| `Agent/goals.md` | Product scope and acceptance outcomes |
| `Agent/skills.md` | Capabilities and practices expected from the coding agent |
| `Agent/implementation-plan.md` | Ordered milestone checklists and decision dependencies |
| `progress.md` | Verified current status, blockers and exact next action |
| `README.md` | Repository onboarding and commands once implemented |
| `.env.example` | Proposed configuration names with blank secrets |
| `Agent/project-context.md` | This quick session briefing |

## Session-start instruction

Use this prompt in a new coding session:

```text
Read AGENTS.md first, then every document it references. Use
Agent/project-context.md only as a quick orientation. Check decisions.md and
progress.md for current state. Continue from the next verified unfinished task
in Agent/implementation-plan.md.
Use approved decisions as requirements; do not treat future pending
recommendations as approved. Run the relevant checks and update progress.md.
```
