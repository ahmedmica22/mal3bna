# Court Booking Platform — Goals

Source: `Agent/court-booking-platform-spec.md`, updated 2026-10-25. These companion instructions derive from that specification; they do not replace it.

## Product outcome

Deliver an Egypt-focused marketplace for instant football and padel court bookings, coupled with venue daily operations and super-admin oversight. Use EGP, Africa/Cairo, English by default and Arabic with RTL. Build a complete backend first, then the web application, then one player/owner mobile application. The source permits an early thin web/Expo payment slice during backend development.

## Role outcomes

| Role | Required outcome | Channels |
| --- | --- | --- |
| Visitor/player | Browse, quote, book, pay 30% or 100%, manage bookings, cancel with preview, review, dispute and appeal | Web and mobile |
| Venue owner | Submit one venue in v1, manage courts/prices/hours, run bookings, check in players, collect cash and inspect money | Full web; mobile daily operations only |
| Super admin | Approvals, commission, suspensions, disputes/appeals, audited overrides, payouts, geography and failure recovery | Web only |

## Scope and product constraints

- One immutable role per account; player and owner self-registration, admin creation by CLI/seed only. Email/password and email verification links; no login OTP or 2FA in v1.
- One venue per owner in v1, with future-compatible schema. No multi-venue owner UI in these phases.
- Football sizes 5/7/11; padel one court per booking; fixed on-the-hour 60-minute slots; consecutive multi-hour reservations; no rescheduling.
- Online payments through Kashier, behind an adapter; manually recorded venue payouts. Venue owners collect the remaining cash after a deposit payment.
- Commission-based money flow as specified, not an owner-subscription or credit-wallet system.
- Email, mobile push and in-app inbox. Owner onboarding requires private proof documents and approval before public booking.
- Reviews, no-show disputes, strike warnings, blocking, expiry and appeals must work with role-specific privacy.
- Light theme first, shared English/Arabic translations, responsive accessible web and native RTL support.

## Locked policy reference

The complete source section 2 and approved D01–D12 decisions are authoritative. These constants are copied for planning visibility, not a second runtime policy implementation.

### 2.11 Constants (one config module, never scattered)

| Constant | Value |
| --- | --- |
| DEPOSIT_PERCENT | 30 |
| HOLD_MINUTES | 10 |
| SLOT_MINUTES | 60 |
| MAX_HOURS_DEFAULT | 4 |
| MIN_LEAD_MINUTES | 60 |
| MAX_ADVANCE_DAYS | 30 |
| FREE_CANCEL_HOURS | 24 |
| NO_SHOW_GRACE_MINUTES | 15 |
| NO_SHOW_MARK_WINDOW_HOURS | 24 (after end time) |
| AUTO_COMPLETE_HOURS | 24 (after end time) |
| DISPUTE_WINDOW_HOURS | 48 |
| STRIKES_TO_BLOCK | 4 |
| STRIKE_TTL_MONTHS | 6 |
| APPEAL_WAIT_DAYS | 30 |
| COMMISSION_MIN_BP / MAX_BP | 1000 / 2000 |
| PRICE_CHANGE_DELAY_HOURS | 24 |
| ACCESS_TOKEN_MINUTES | 15 |
| REFRESH_TOKEN_DAYS | 30 (**Assumption**) |
| RESET_TOKEN_MINUTES | 30 |
| MAX_POSITIONS | 2 |

## Phase acceptance

### Phase 1 — Backend (M1–M10)

All API flows in source sections 2–10 operate without requiring finished screens. Auth/ownership are enforced per endpoint. PostgreSQL prevents double booking; payment/refund/release actions tolerate retries; the ledger remains correct. Staging runs the API and worker with documented operations, backups and recovery. M4's thin web and Expo slice proves integration early.

### Phase 2 — Web (W1–W6)

A player books and pays, an owner registers and runs a full day, and an admin handles approval, dispute and payout entirely through the browser. Public/player, owner and admin routes use the stable generated client. Both languages, RTL, responsive layouts, accessibility and principal Playwright journeys pass.

### Phase 3 — Mobile (P1–P5)

One Expo app supports player bookings and owner daily operations with secure sessions, payment deep links, QR lookup and push. Setup, pricing, documents, closures, financial reporting and other web-only owner functions remain on web. Production-configured builds reach store review or publication after internal testing.

## Quality outcomes

| Outcome | Measurable acceptance |
| --- | --- |
| Data separation | Endpoint matrix rejects invalid identities/roles; other users' resources return 404; field allow-lists prevent leaks |
| Reservation correctness | 50 simultaneous requests for one available slot yield exactly one reservation |
| Financial correctness | All source refund/ledger examples pass; retries/replays create no duplicate financial effects; nightly HELD reconciliation passes |
| Time correctness | Tests cover hold expiry, windows, exact boundaries, midnight and Cairo DST |
| Maintainability | Strict types, lint, dependency rules, migrations, OpenAPI and generated-client checks pass |
| Operability | API/worker monitoring, dead-letter recovery, backups, restore drill and rollback documented and demonstrated |
| Usability | Loading/empty/error states, keyboard access, labelled inputs, English/Arabic and RTL verified |

Do not invent performance targets. Record expected launch traffic and an agreed latency/error budget before final load-test sign-off; test at several times that agreed traffic.

## Explicitly deferred

Source section 17 is the scope boundary: split payments, open matches/matching, player directory, recurring bookings, split pitches, staff accounts, multiple venues per owner, detailed analytics beyond specified reports, promo codes, memberships, featured venues, Fawry, phone OTP, admin 2FA, browser push, SMS and automated gateway payouts.

## Launch acceptance

Complete source section 14: validate with 3–5 owners; obtain Kashier live approval and written answers; complete legal/accounting review; verify bilingual email delivery; run restore and release checks; agree load targets; pilot with 2–3 venues; staff support; and prepare store review. No fake gateway or unresolved money-policy decision qualifies as production ready.
