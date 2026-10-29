# Court Booking Platform: Build Specification

Updated 2026-10-25

This is the single source of truth for building a football and padel court booking platform for Egypt in three phases: backend, web, mobile. It is written to be handed to an AI coding agent, so every rule, number, and acceptance test is explicit.

## 0. Instructions for the AI agent

1. Read this whole document before writing code. Section numbers are referenced in the tasks.
2. The rules and numbers in section 2 are locked. Do not change them. If something is missing or contradictory, stop and list the question instead of inventing an answer.
3. Build in the order of sections 11, 12 and 13 (backend, then web, then mobile). Finish a milestone (code, tests, docs) before starting the next.
4. Business rules live only in the backend domain layer. Web and mobile display results and never re-implement rules such as refunds, strikes, or commission.
5. Follow the code standards in section 4. CI must enforce them.
6. Write the authorization test matrix (section 5.7) before the business endpoints, and run it against every new endpoint.
7. Never log secrets, tokens, passwords, or full payment payloads. Keep all secrets in environment variables.
8. Kashier: read the official docs at developers.kashier.io for exact field names and signature rules. Do not guess them. Use the fake gateway until sandbox keys exist.
9. Items marked **Assumption** are suggested defaults the owner has not confirmed. Implement them as named constants so they can change in one place.
10. Every milestone ends with: tests green, lint and architecture checks green, OpenAPI spec updated, a short CHANGELOG entry, and a demo script that shows the milestone working.

## 1. Product summary

Players find and book football and padel courts. Venue owners manage courts, prices, and bookings. The super admin approves venues, sets commission, and resolves disputes. Launch market is Egypt: currency EGP, time zone Africa/Cairo, default language English with Arabic (right-to-left) available in Settings.

| Role | Web | Mobile app | Purpose |
| --- | --- | --- | --- |
| Player | Yes | Yes | Search, book, pay a deposit, cancel, review, appeal |
| Venue owner | Yes (full) | Yes (daily operations only) | Manage venue, courts, prices, calendar, check-in |
| Super admin | Yes | No | Approve venues, commission, disputes, payouts, audit |

- One mobile app serves players and owners. Screens are chosen by the logged-in role.
- One role per account. Registration asks once: player or venue owner. It cannot change later. A person who is both uses two emails. Admin accounts are created only by a CLI or seed script, never through sign-up.
- Login is email + password. There is no OTP and no two-factor login in v1.
- Notification channels: email, mobile push, and an in-app inbox. There is no SMS.
- Each owner has one venue in v1. The schema supports several, and owner routes use `/owner/venue` without an ID.

## 2. Locked business rules

### 2.1 Booking and slots

- Booking is instant. There is no owner approval step.
- Slots are fixed 60 minutes and start on the hour. This applies to football and padel.
- One booking can cover several consecutive hours (maximum 4 by default, changeable per venue). It has one payment, one cancellation, and one strike.
- Players can book from 1 hour before kickoff up to 30 days ahead.
- A slot is held for 10 minutes while the player pays. If payment fails or times out, the hold expires and the slot is released.
- Players can browse without an account. A verified email and an active account are required to book.
- Rescheduling is not supported. The player cancels and rebooks.
- Venues that close after midnight are supported: the closing time can fall on the next day.

### 2.2 Courts and pricing

- Football courts have a size (5, 7, or 11 a side). The default is 5. The size is shown as a badge on every football court, in the slot picker, at checkout (with a warning when it is not 5), and on confirmations and reminders. Search can filter by size.
- Padel: one court equals one booking. Split pitches are out of v1.
- Price rules are set per court by day of week and time range. Each hour of a booking is priced separately and the breakdown is frozen on the booking.
- A price change applies only to future bookings and takes effect 24 hours after it is saved.

### 2.3 Payment and deposit

- The deposit is always 30% of the total price, the same for every venue.
- At checkout the player chooses: pay 30% now and 70% at the court, or pay 100% now.
- Online methods: card, mobile wallet, and InstaPay where Kashier supports them. **Assumption:** Fawry (pay at an outlet) is left out of v1 because it cannot finish inside a 10-minute hold.
- The remaining 70% is paid at the court. The owner taps Collected when the player pays in cash.
- Manual bookings (phone or walk-in) have no account, no online payment, no strikes, no automatic refunds, and no platform commission or financial-ledger effects. The whole amount is due at the venue. They still block availability and appear in operational and occupancy reports.

### 2.4 Cancellation and refunds

One function, `CancellationPolicy`, decides every case. The 24-hour line is measured from the start of the first hour.

| Who cancels | When | Result |
| --- | --- | --- |
| Player | 24 hours or more before | Everything paid is refunded |
| Player | Less than 24 hours before | The 30% deposit is lost. Anything paid above it (the other 70% of a 100% payment) is refunded |
| Venue owner or admin | Any time | Everything paid is refunded, no commission |
| Court closure or venue suspension | Any time | Every affected booking is cancelled with a full refund |

- Cancellation is all or nothing for a multi-hour booking.
- For a booking made less than 24 hours ahead, the 30% deposit is non-refundable from the moment it is paid. If the player paid 100%, the amount above the deposit is still refundable. Checkout must state this precisely.
- Only the admin can override the 24-hour rule, with a written reason, and every override is audit-logged.
- Gateway fees on refunds: the platform absorbs them. **Assumption.**

### 2.5 No-shows, strikes, disputes

1. The venue owner reports a no-show from 15 minutes after the start time until 24 hours after the end time.
2. The report is pending. The player is notified immediately and can dispute within 48 hours of that notification. A dispute goes to the admin.
3. With no dispute, the no-show becomes final when the 48-hour window expires. With a dispute, it becomes final only if the admin upholds it.
4. A confirmed no-show loses only the 30% deposit. Anything paid above it is refunded. It adds one strike per booking regardless of length; an overturned report creates no active strike.
5. Strikes expire after 6 months. The admin can remove a strike with a reason.
6. Players get a warning at strike 2 and strike 3.
7. At strike 4 the player is blocked from creating new bookings. They can still log in, view and manage existing bookings under normal policies, use their profile and inbox, and appeal. Existing upcoming bookings stay valid.
8. When old strikes expire and active strikes drop below 4, the block lifts automatically (daily job).
9. If the owner never reports a booking, it auto-completes 24 hours after its end time. An unmarked booking never creates a strike.
10. Strikes are visible to the venue owner only as a count on that venue's bookings.

### 2.6 Appeals

- A blocked player can appeal with a written explanation and optional proof. One appeal is open at a time.
- The admin can reject, unblock (clearing all active strikes), or remove specific strikes.
- After a rejection, the player waits 30 days before appealing again.
- If a strike is removed because the venue marked it wrongly, this is tracked per venue. Many overturned no-shows flag the venue.

### 2.7 Commission and money

- Commission is a percentage of the total booking price, set per venue by the admin. Minimum 10% (default), maximum 20% (**Assumption**). Stored as basis points: 1000 to 2000.
- The rate is copied onto each booking when it is made. A change affects future bookings only and is audit-logged.
- All online payments go to the platform's Kashier account. The platform deducts commission and pays the venue after the match. It never pays before.
- An owner may mark a booking complete only at or after its scheduled end. Completion and release never occur before the end.
- Money is released to the venue as follows: completed online bookings at completion or the 24-hour auto-complete; confirmed no-shows after both the booking end and the dispute window (or after an upholding admin decision); late player cancellations after any required refund succeeds.
- A pending or failed refund keeps all affected money in HELD. Post the successful refund and remaining commission/venue release atomically and idempotently. Retry safely and escalate repeated failures to the admin.
- Manual bookings create no commission, venue-balance, refund, or payout ledger entries.
- Payouts are weekly (**Assumption**), generated from released balance. The admin sends the money by bank transfer, Instapay, or wallet, then marks the payout paid. If a venue's balance is negative, it carries over.

Example: a 2-hour booking at 350 EGP per hour, 10% commission, 30% deposit.

| Item | Amount (EGP) |
| --- | --- |
| Total price | 700 |
| Paid online (30%) | 210 |
| Commission (10% of 700) | 70 |
| Venue share of the deposit | 140 |
| Paid in cash at the court (70%) | 490, goes straight to the venue |

### 2.8 Venue onboarding

1. The owner registers and enters name, area, map location, photos, phone, and description. There are no amenities.
2. The owner adds courts, opening hours, and prices, and uploads proof of ownership or management (private file).
3. The venue is pending until the admin reviews it. It does not appear in search and cannot take bookings.
4. Approved: the venue goes live and the owner gets an approval email and an in-app notification.
5. Rejected: the owner gets an email with the reason and can fix and resubmit.

After approval, location and sport changes require admin reapproval and take effect only after approval; the previous approved public values remain active meanwhile. Name, description, phone, and photos update immediately and are audit-logged. Opening-hour changes cannot invalidate existing reservations. Reject a conflicting change unless the owner completes the closure preview and full-refund flow. A court cannot be archived while it has future active reservations.

### 2.9 Player profile (all optional)

- Photo, preferred foot (right, left, both), playing style (playmaker, finisher, box-to-box, defensive, speedster, all-rounder), position (goalkeeper, defender, midfielder, winger, striker; up to 2), and area (from the shared areas list).
- Padel fields: side (left, right, both), hand (right, left), level (beginner, intermediate, advanced).
- In v1 the profile is visible only to the player. Venue owners see only the name, photo, and phone on a booking.
- Areas are one shared list (city, then area, with English and Arabic names) managed by the admin and used by venues, profiles, and search.

### 2.10 Reviews

- Only after a completed booking, once per booking, rating 1 to 5 with an optional comment.
- The owner can reply once and cannot delete. The admin can remove abusive reviews.

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

### 2.12 Approved technical defaults

- Idempotency records are retained for at least 24 hours. The same key, actor, operation, and request hash returns the stored response. A different request with the same key returns HTTP 409 and `IDEMPOTENCY_KEY_REUSED`; a matching request still processing returns HTTP 409 and `IDEMPOTENCY_IN_PROGRESS` with a retry hint.
- Percentage calculations use integer arithmetic and round half up to the nearest piastre. Refunds derive from frozen booking amounts so all components reconcile exactly.
- Minimum password length is 8 for players/owners and 12 for admins; reject commonly compromised passwords.
- Email-verification links last 24 hours. Password-reset links last 30 minutes. Both are hashed and single-use.
- Images accept JPEG, PNG, or WebP up to 10 MiB. Private proof/evidence accepts PDF, JPEG, or PNG up to 20 MiB. Validate detected content, declared type, size, purpose, and ownership.

## 3. Tech stack and repository

TypeScript everywhere, in one monorepo.

| Part | Choice | Notes |
| --- | --- | --- |
| Monorepo | pnpm workspaces + Turborepo | One repo, shared packages |
| API | Node.js + NestJS (modular monolith) | REST, OpenAPI generated from Zod schemas |
| Database | PostgreSQL + Prisma | Hand-written SQL migrations for constraints Prisma cannot express |
| Jobs | Redis + BullMQ | Separate worker process |
| Web | React + Vite + React Router + TanStack Query + React Hook Form + Zod + Tailwind | Roles: player, owner, admin |
| Mobile | React Native with Expo (Expo Router) | One app, player and owner screens |
| Payments | Kashier (payment sessions, hosted checkout, webhooks, refunds) | Behind a PaymentGateway interface |
| Email | Resend, SendGrid, or Amazon SES | Behind an EmailSender interface, own verified sender domain |
| Push | Expo Push | Behind a PushSender interface |
| Files | S3-compatible storage (S3 or Cloudflare R2) | Private bucket for documents and player photos |
| Errors and logs | Sentry + structured JSON logs | Every request has a requestId |
| CI/CD | GitHub Actions | Section 10 |

```
court-booking/
├── apps/
│   ├── api/            # NestJS: HTTP API and worker entrypoints
│   ├── web/            # React + Vite (player, owner, admin)
│   └── mobile/         # Expo (player + owner by role)
├── packages/
│   ├── shared/         # types, Zod schemas, constants (no business logic)
│   ├── api-client/     # typed API calls + TanStack Query hooks
│   ├── i18n/           # English and Arabic translation files
│   └── config/         # shared tsconfig, eslint, prettier
├── docker-compose.yml  # Postgres, Redis, Mailpit for local dev
├── turbo.json
└── pnpm-workspace.yaml
```

- `packages/shared` holds only types, Zod schemas, and constants (statuses, roles, court sizes, the constants table in 2.11 for display). Rules such as refunds and strikes stay in the API.
- `packages/api-client` is generated from the API's OpenAPI spec and used by both web and mobile.
- React Native in a monorepo: use the Expo monorepo guidance. If Metro fails to resolve workspace packages with pnpm, set `node-linker=hoisted` in `.npmrc`. Run the first mobile build in the first week to find this early.

## 4. Architecture and code standards

### 4.1 Modular monolith with clean architecture

One deployable API, split into modules: auth, users, geography, venues, courts, pricing, availability, bookings, payments, ledger, strikes, disputes-appeals, reviews, notifications, files, admin, jobs. Each core module has four layers and dependencies point inward only.

```
modules/bookings/
├── domain/            # pure TypeScript: no NestJS, no Prisma, no HTTP
│   ├── entities/      # Booking, PriceBreakdown
│   ├── value-objects/ # Money, TimeRange, BookingStatus
│   ├── policies/      # CancellationPolicy, DepositPolicy
│   ├── events/        # BookingConfirmed, BookingCancelled
│   └── repositories/  # interfaces only
├── application/       # use cases and ports (interfaces to outside services)
├── infrastructure/    # Prisma repositories, mappers, gateway adapters
└── presentation/      # controllers, DTOs, guards
```

| Layer | May import | Must never import |
| --- | --- | --- |
| domain | itself only | NestJS, Prisma, HTTP, any SDK |
| application | domain and its own ports | Prisma, Express, Kashier SDK |
| infrastructure | domain, application | presentation |
| presentation | application | domain internals, Prisma |

Full layers are required for the core modules: bookings, payments, ledger, strikes, commission, auth. Simple modules (geography, reviews, files) may use a lighter service plus repository. Do not over-engineer.

### 4.2 SOLID, applied

| Principle | Rule in this project |
| --- | --- |
| Single responsibility | A use case does one thing. Refund math lives in CancellationPolicy. Sending email lives in a notifier. Controllers hold no rules. |
| Open/closed | A new payment method, notification channel, or pricing rule is a new class, not an edit to working code. |
| Liskov | Every PaymentGateway implementation (Kashier, fake) behaves identically behind the interface. |
| Interface segregation | Small ports: BookingReader, BookingWriter, Notifier. |
| Dependency inversion | Use cases depend on PaymentGateway, never on KashierGateway. NestJS injects the real class. |

### 4.3 Patterns and conventions

- **Value objects:** `Money` (integer piastres, never floats), `TimeRange`, `BookingStatus`. Money values are integers everywhere, including the database and the API.
- **Rich entities:** a Booking protects its own state with methods such as `confirm()`, `cancel(decision)`, `markNoShow(now)`. No public setters. Illegal transitions throw domain errors.
- **Policies:** CancellationPolicy, DepositPolicy, StrikePolicy, CommissionPolicy, PriceCalculator are pure classes with unit tests.
- **Repositories:** every database access goes through an interface. No `findAll()` reachable from player or owner code.
- **Domain events and outbox:** side effects (ledger entries, reminders, emails, pushes) react to events. Notification requests are saved in an outbox table in the same transaction as the business change.
- **Injected clock:** logic calls `Clock.now()`, never `new Date()`, so tests can move time.
- **Domain errors:** `SlotAlreadyTakenError`, `PlayerBlockedError`, `HoldExpiredError`, and so on, translated to HTTP in one place. Error body: `{ code, message, details, requestId }`.
- **Time:** store UTC. Calculate slots in the venue's IANA time zone (Africa/Cairo), never a fixed offset. Test around midnight and daylight saving changes.
- **Idempotency:** `POST /player/bookings` and money actions require an `Idempotency-Key` header and follow the replay, mismatch, in-progress, and 24-hour retention rules in 2.12.

### 4.4 Clean code rules

- Names carry business meaning (`depositAmount`, not `amt2`). Functions are short and do one thing.
- No magic numbers. Every constant comes from the config module in 2.11.
- Controllers only validate (Zod), call one use case, and map the response.
- Never return database entities. Mappers build a response DTO per role with an allow-list of fields.
- TypeScript strict mode, no `any`, ESLint and Prettier enforced in CI.
- An architecture test (dependency-cruiser) fails the build if domain imports NestJS or Prisma, or if presentation imports infrastructure.

### 4.5 Testing levels

| Level | What | How |
| --- | --- | --- |
| Unit | Policies, entities, value objects | Plain tests, no database |
| Use case | Create, cancel, confirm booking, refunds | In-memory repositories and a fake gateway |
| Integration | Repositories, the overlap constraint, webhooks | Real PostgreSQL in Docker |
| Concurrency | 50 simultaneous requests for one slot | Exactly one succeeds |
| Authorization | Matrix in 5.7 for every endpoint | Automated, blocks the build |
| End to end | Main flows through the API | Few and focused |

## 5. Authentication and authorization

This is the most important part of the backend. Player, owner, and admin data must never mix. Several independent layers each stop a leak.

### 5.1 Authentication

- Email + password. Hash with argon2id. Minimum length is 8 for players/owners and 12 for admins; reject commonly compromised passwords.
- Access token: JWT valid 15 minutes, containing only user ID, role, and session ID.
- Refresh token: random value, stored hashed in `sessions` with device info and expiry. Rotate on every refresh. If an old token is reused, revoke the whole session family.
- Web: the refresh token travels in an httpOnly, secure, SameSite cookie, and the access token stays in memory. Mobile: both tokens are sent in the body (header `X-Client: mobile`) and stored in `expo-secure-store`. Never use localStorage for tokens.
- Logout revokes the session. Change password and 'log out of all devices' revoke every session.
- Email verification by hashed, single-use link valid for 24 hours (not OTP) is required before the first booking, and for owners before submitting a venue.
- Password reset by single-use link, valid 30 minutes, stored hashed. Responses never reveal whether an email exists.
- Rate limits on register, login, reset, and refresh, per IP and per email, with growing delays after failures.
- Account deletion (required by Apple and Google): `DELETE /me` anonymizes personal data and keeps financial and audit records. Block it while the account has upcoming bookings or an unpaid balance.
- There is no admin 2FA in v1. Compensate with CLI-only creation, a longer minimum password, stricter login limits, short sessions, and full audit logging. Keep the design ready to add TOTP later.
- Store `phone_verified` (default false) so OTP can be added later without redesign.

### 5.2 Roles and data separation

- `users` holds only login data: id, email, password hash, role, status, name, phone, language, email verification date.
- Role-specific data lives in separate tables: `player_profiles`, `owner_profiles`. Admin has no extra table.
- One role per account. The role comes from the token and is re-read from the database for sensitive actions, so a block or suspension takes effect at once.

### 5.3 Authorization layers

1. **Deny by default.** A global guard rejects every request unless the endpoint declares `@Public()` or `@Roles(...)`.
2. **Separate route spaces:** `/public`, `/player`, `/owner`, `/admin`, each with its own controllers and response DTOs.
3. **Ownership policies in the application layer.** The identity always comes from the token, never from the request body. Owner use cases load the venue through the logged-in owner (`findByIdForOwner(venueId, userId)`), and return 404, not 403, for resources that belong to someone else. Player queries are always scoped by `player_id = actor.userId`.
4. **Rule policies:** a blocked player cannot create bookings; a pending or suspended venue cannot take bookings or appear in search; only the admin overrides the 24-hour rule, changes commission, or removes a strike; owners mark no-shows only on their own venue and only inside the allowed window.
5. **Database backstop:** foreign keys, the composite `(court_id, venue_id)` key, check constraints, and the overlap constraint. Row-level security is optional later.

### 5.4 Who can see what

| Data | Player | Owner | Admin |
| --- | --- | --- | --- |
| Own account and profile | Yes | Yes | Yes |
| Venue public info (name, photos, prices, rating) | Yes | Yes | Yes |
| Own bookings | Yes | n/a | All |
| Bookings of own venue | No | Yes | Yes |
| Another venue's bookings | No | No | Yes |
| Player name, photo, phone on own venue's booking | n/a | Yes | Yes |
| Player email, other bookings, full strike history | n/a | No | Yes |
| Player strike count | n/a | Yes, on own venue's bookings | Yes |
| Card or wallet details | Never stored by us | Never | Never |
| Venue balance, payouts, ledger | No | Own venue only | All |
| Proof documents | No | Own only | Yes |
| Commission rate | No | Own rate | All |
| Audit log | No | No | Yes |
| Disputes and appeals | Own only | Own venue's disputes | All |

### 5.5 Preventing leaks

- Response DTOs are allow-lists per role. `password_hash` and tokens are never selected by default.
- Use UUIDs for all IDs. Return 404 for resources owned by someone else.
- Ignore any `userId`, `ownerId`, or `role` in request bodies. Zod schemas reject unknown fields.
- Documents and player photos live in a private bucket and are served through short-lived signed URLs, only to people allowed to see them. Venue photos are public.
- Every admin action and every sensitive owner action goes to the audit log (actor, target, old value, new value, reason, time).
- The Kashier webhook is public but protected only by its signature check.

### 5.6 Auth module structure

```
modules/auth/
├── domain/         # User, Role, Session, PasswordPolicy
├── application/
│   ├── ports/      # PasswordHasher, TokenService, SessionRepository, EmailSender
│   └── use-cases/  # Register, VerifyEmail, Login, Refresh, Logout,
│                   # RequestPasswordReset, ResetPassword, ChangePassword, DeleteAccount
├── infrastructure/ # Argon2Hasher, JwtTokenService, PrismaUserRepository
└── presentation/   # AuthController, JwtAuthGuard, RolesGuard, @Public, @Roles, @CurrentUser
```

Map roles to permissions internally (for example `booking:check-in`) so staff accounts can be added later by configuration.

### 5.7 Authorization test matrix (required for every endpoint)

| Caller | Expected |
| --- | --- |
| No token | 401 |
| Expired or revoked token | 401 |
| Wrong role | 403 |
| Right role, someone else's resource | 404 |
| Right role, own resource | 200 |
| Blocked player or suspended venue where it matters | The specific domain error |

Also test: refresh token reuse revokes the family, password change revokes sessions, the deny-by-default guard, and a route scan that fails the build if any route lacks a declaration.

## 6. Payments (Kashier) and the ledger

### 6.1 What Kashier provides

Checked against the [Kashier developer docs](https://developers.kashier.io/docs). Re-read them before integrating, because endpoints and fields can change.

- **Payment sessions:** the backend creates a session (`POST /v3/payment/sessions`, test host `https://test-api.kashier.io`, live host `https://api.kashier.io`, authenticated with an `api-key` header). The player pays on a Kashier-hosted checkout and is returned to a `merchantRedirectURL`. See [payment sessions](https://developers.kashier.io/docs/accept-payments/payment-sessions).
- **Verify a payment:** `GET /v3/payment/sessions/{sessionId}/payment` returns the transaction detail, including fees and refund totals. Confirm every payment on the server, through the webhook or this call, before confirming a booking.
- **Refunds:** full and partial refunds, plus void, are available through the API.
- **Webhooks:** Kashier sends server-to-server notifications for payment events.
- **Environments:** separate test and live environments with separate keys.
- Not found in the docs reviewed: marketplace split payments to sub-merchants. The design does not need them, because all money lands in the platform's account and the platform pays venues itself. Confirm this and the questions in 6.7 with Kashier before launch.

### 6.2 Module structure

```
modules/payments/
├── domain/          # Payment, Refund entities; PaymentStatus; repository interfaces
├── application/
│   ├── ports/       # PaymentGateway (createCheckout, getPayment, refund)
│   ├── start-checkout.use-case.ts
│   ├── handle-payment-webhook.use-case.ts
│   ├── refund-booking.use-case.ts
│   └── reconcile-pending-payments.use-case.ts
├── infrastructure/  # KashierGateway, KashierSignatureVerifier, FakeGateway (tests, local)
└── presentation/    # PaymentsController, KashierWebhookController
```

Only `KashierGateway` knows Kashier URLs, headers, and field names.

### 6.3 Payment flow

1. `POST /player/bookings` creates the reservation as `held` (10 minutes), then a Payment (`pending`) and a Kashier session for 30% or 100% of the total. It returns `checkoutUrl`.
2. The player pays on Kashier's page. Web redirects (or embeds). Mobile opens an in-app browser and returns by deep link. After returning, the client polls `GET /player/bookings/:id`. The client never decides that a payment succeeded.
3. Kashier calls `POST /webhooks/kashier`. The handler verifies the signature, stores the raw event with a unique event ID (duplicates are acknowledged and ignored), returns 200 quickly, and processes in the background.
4. Processing fetches the session from Kashier to verify, marks the Payment `paid`, confirms the booking, writes ledger entries, and queues notifications and reminders.
5. A reconciliation job asks Kashier about pending payments older than a few minutes, to catch lost webhooks.
6. Late payment: if payment succeeds after the hold expired and the slot is still free, confirm it. If the slot is taken, refund automatically and tell the player.

### 6.4 Refunds

`RefundBookingUseCase` asks `CancellationPolicy` for a decision, then calls the gateway. A Refund row has its own status: `requested`, `succeeded`, `failed`. Ledger entries are written only when the refund succeeds. Failed refunds are retried by a job with an idempotency key (never refund twice), then escalate to the admin's stuck-items queue.

| Case (booking total 700 EGP, deposit 210) | Refund |
| --- | --- |
| Player cancels 24h or more before | 210 (or 700 if paid in full) |
| Player cancels under 24h, paid 30% | 0 |
| Player cancels under 24h, paid 100% | 490 (partial refund) |
| Venue or admin cancels | Everything paid |

### 6.5 Ledger

Immutable rows. Integers in piastres. Never update or delete (enforce with a database trigger and restricted permissions). Fix mistakes with reversing entries. Each entry has a unique idempotency key.

**Accounts:** HELD (money the platform holds for bookings), VENUE_BALANCE (owed to the venue), COMMISSION (platform revenue), GATEWAY_FEES (platform expense), PAYOUTS (money already sent).

Example: 700 EGP booking, 10% commission, paid 30% online (210).

| Event | Entries (EGP) |
| --- | --- |
| Payment confirmed | HELD +210 |
| Match completed (release) | HELD −210, COMMISSION +70, VENUE_BALANCE +140 |
| Weekly payout of 140 | VENUE_BALANCE −140, PAYOUTS +140 |
| Paid 100% (700), completed | HELD +700, then HELD −700, COMMISSION +70, VENUE_BALANCE +630 |
| Cancelled 24h or more before | HELD +210, then HELD −210 (refund). No commission |
| Paid 100%, late cancel or no-show | HELD +700; refund 490 → HELD −490; release 210 → COMMISSION +70, VENUE_BALANCE +140 |
| Dispute overturned after payout | VENUE_BALANCE −amount (may go negative and carry over) |

- Commission is computed on the total price at the rate copied onto the booking.
- When Kashier reports the fee for a transaction, write a GATEWAY_FEES entry so the real margin per booking is visible.
- A nightly job checks the invariant: HELD equals paid minus refunded minus released. A mismatch alerts the admin.
- Payouts include only released amounts. They are generated from the ledger, never typed by hand.

### 6.6 Checkout rules

- Slots can be held only for the duration in HOLD_MINUTES. Show a visible countdown.
- Show the cancellation rule and the court size before the player pays. Warn when the booking starts within 24 hours.
- Apple Pay and recurring payments are not used in v1.

### 6.7 Questions to ask Kashier before launch

1. May the platform hold funds that partly belong to venues, and what documents or contract does that need?
2. How many days until settlement reaches the platform's bank account? This sets how often venues can be paid.
3. Are transaction fees returned on refunds?
4. Refund limits: time limits, partial refund rules, and differences between card and wallet refunds.
5. How is the webhook signature calculated, and are failed deliveries retried?
6. Can payouts to bank accounts or wallets be automated later through the Dashboard API?
7. Is a payment identity (card fingerprint or wallet number) available for blocking repeat offenders?

## 7. Notifications and background jobs

### 7.1 Notification design

Business code never sends email or push directly. It publishes a domain event. The notification module reads it, writes a row to the **outbox** in the same database transaction as the business change, and a worker delivers it through the channels. This prevents a confirmed booking with no email.

```
modules/notifications/
├── domain/          # Notification, NotificationType, Recipient
├── application/     # ports: EmailSender, PushSender, TemplateRenderer; use cases
├── infrastructure/  # email provider adapter, ExpoPushSender, outbox worker
└── presentation/    # inbox, device registration, preferences endpoints
```

- Channels implement one `NotificationChannel` interface: Email, Push, Inbox. Adding SMS later means adding one class.
- Templates exist in English and Arabic (Arabic with right-to-left layout) and use the recipient's language.
- Email needs a verified sender domain with SPF, DKIM, and DMARC. Retry failed sends with backoff and keep a delivery log.
- Push: the app registers its Expo token after login (saved per device) and removes it at logout. Remove tokens Expo reports as invalid. Every push carries a deep link and opens only what the logged-in user may access. Keep push text short and free of sensitive detail.
- Inbox: every notification is also written to the in-app inbox, so nothing is lost if an email lands in spam or a push is dismissed.
- A notification is addressed to one user ID taken from the booking, never from request input.

### 7.2 Which channel for which event

| Event | Push | Email |
| --- | --- | --- |
| Booking confirmed | Yes | Yes (receipt) |
| Day-before reminder | Yes | Yes |
| A few hours before | Yes | No |
| Venue cancelled, refund issued | Yes | Yes |
| No-show marked | Yes | Yes |
| Strike 2 and 3 warnings | Yes | Yes |
| Blocked, appeal decision | Yes | Yes |
| Review request | Yes | No |
| Owner: new booking, player cancelled | Yes | Optional |
| Owner: dispute and decision, venue approved or rejected, payout sent | Yes | Yes |
| Email verification, password reset | No | Yes |

Rule: push for time-sensitive events, email for things the user may need to keep. Users can switch push and optional emails off per category in Settings. Account and receipt emails always send.

### 7.3 Background jobs (BullMQ, separate worker process)

Jobs must be safe to run twice. Periodic jobs query the database for work instead of using one timer per booking.

| Job | Frequency | Does |
| --- | --- | --- |
| Expire holds | 30 s | Marks overdue `held` reservations `expired` |
| Process webhook events | On arrival | Handles stored Kashier events with retries |
| Reconcile payments | A few minutes | Checks pending payments with Kashier |
| Dispatch outbox | A few seconds | Sends pending notifications |
| Retry failed refunds | A few minutes | Retries, then escalates to the admin |
| Day-before reminders | Hourly | Confirmed bookings about 24 hours away with no reminder sent |
| Hours-before reminders | 10 min | Bookings about 2 hours away with no reminder sent |
| Auto-complete bookings | Hourly | Completes unmarked bookings 24h after end |
| Release finished bookings | Hourly | Writes ledger release entries once a booking can no longer change |
| Expire strikes | Daily | Marks strikes older than 6 months expired and lifts blocks below 4 |
| Weekly payouts | Weekly | Creates a draft payout per venue from released balance |
| Ledger integrity check | Nightly | Verifies the HELD invariant |
| Clean-up | Daily | Removes expired sessions, used tokens, old logs |

- Reminders use flags on the booking (`day_reminder_sent_at`, `hours_reminder_sent_at`). A cancelled booking simply stops matching.
- Every job has a retry policy with backoff and a dead-letter state. Use locks so two workers never process the same item.
- Use a job monitor (Bull Board) behind the admin guard. Alert the admin by email on repeated failures.
- The admin has a stuck-items screen: failed refunds, failed emails, failed webhooks.

## 8. Database schema (PostgreSQL)

### 8.1 Conventions

- UUID primary keys, `timestamptz` columns stored in UTC, `created_at` and `updated_at` on every table.
- Money is an integer in piastres. Commission is in basis points (1000 = 10%).
- No hard deletes on money, bookings, or trust tables. Venues and courts are archived.
- Prisma cannot express exclusion constraints, partial indexes, check constraints, or triggers. Write those as hand-written SQL migrations next to the Prisma ones.
- Enable `btree_gist` for the overlap constraint.

### 8.2 Identity and files

| Table | Key columns | Notes |
| --- | --- | --- |
| users | id, email (case-insensitive unique), password_hash, role (player, owner, admin), status (active, blocked, suspended), name, phone, language (en, ar), email_verified_at, phone_verified (false), deleted_at | One role per account. Phone is unique among players only (partial unique index). |
| player_profiles | user_id (PK, FK), photo_file_id, preferred_foot, playing_style, position_1, position_2, area_id, padel_side, padel_hand, padel_level | All optional |
| owner_profiles | user_id (PK, FK) | |
| sessions | id, user_id, refresh_token_hash, family_id, client (web, mobile), device_info, expires_at, revoked_at, last_used_at | Rotation and reuse detection |
| email_verification_tokens, password_reset_tokens | user_id, token_hash, expires_at, used_at | Single use, hashed |
| device_tokens | user_id, expo_token (unique), platform, last_seen_at | Removed at logout |
| files | id, uploaded_by, purpose, visibility (public, private), storage_key, mime_type, size | |

### 8.3 Geography, venues, courts, pricing

| Table | Key columns | Notes |
| --- | --- | --- |
| cities | id, name_en, name_ar, is_active | Admin managed |
| areas | id, city_id, name_en, name_ar, is_active | Admin managed |
| venues | id, owner_id, area_id, name, description, phone, latitude, longitude, address, time_zone (Africa/Cairo), status (pending, approved, rejected, suspended), rejection_reason, commission_bp, max_hours_per_booking (4), archived_at | Check: commission_bp between 1000 and 2000 |
| venue_revisions | id, venue_id, requested_by, proposed_location, proposed_sport_changes, status (pending, approved, rejected), reviewed_by, decision_reason | Major changes stay inactive until approval; existing approved public values remain live |
| venue_photos | venue_id, file_id, sort_order | |
| venue_documents | venue_id, file_id, type | Private files |
| courts | id, venue_id, name, sport (football, padel), size (5, 7, 11; null for padel), surface, is_indoor, is_active | Football requires a size |
| opening_hours | venue_id, day_of_week, open_minute, close_minute | close_minute may exceed 1440 for venues open past midnight |
| price_rules | id, court_id, day_of_week, start_minute, end_minute, price_cents, valid_from, valid_to | Versioned: a change inserts a new row valid 24 hours later and closes the old one |
| commission_changes | venue_id, old_bp, new_bp, changed_by | Also written to the audit log |

### 8.4 Reservations (bookings, manual bookings, blocks) in one table

| Column | Notes |
| --- | --- |
| id, court_id, venue_id | Composite foreign key (court_id, venue_id) so they cannot disagree |
| kind | booking (player), manual (phone or walk-in), block |
| status | held, confirmed, arrived, completed, no_show_pending, no_show, cancelled, expired |
| starts_at, ends_at | UTC, on the hour, whole hours |
| player_id | Required for booking |
| customer_name, customer_phone | Required for manual |
| block_reason | Required for block |
| hold_expires_at | Set while held |
| total_cents, deposit_cents, payment_option (deposit, full), paid_cents, due_at_venue_cents | |
| commission_bp | Copied from the venue for player bookings; null for manual bookings and blocks |
| price_breakdown | JSONB hour-by-hour snapshot |
| booking_code | Unique, short, used for QR and manual entry |
| confirmed_at, arrived_at, completed_at, no_show_marked_at, cancelled_at, cancelled_by_role, cancel_reason | |
| venue_collected_at, collected_by | The 70% paid in cash |
| auto_completed, released_at | Release marks the ledger release entries written |
| day_reminder_sent_at, hours_reminder_sent_at | For reminder jobs |

Check constraints enforce the required fields for each `kind`.

The overlap rule, in a hand-written migration:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE reservations ADD CONSTRAINT no_overlap
EXCLUDE USING gist (
  court_id WITH =,
  tstzrange(starts_at, ends_at) WITH &&
) WHERE (status IN ('held','confirmed','arrived','completed','no_show_pending','no_show'));
```

- Blocks use status `confirmed` while active and `cancelled` when removed, so blocks, manual bookings, and online bookings compete for the same slots.
- Expired holds keep blocking until their status changes. The expiry job runs every 30 seconds, and the create-booking code first marks stale holds on that court and time as expired, then retries once.
- Indexes: (court_id, starts_at), (venue_id, starts_at), (player_id, starts_at DESC); partial indexes on hold_expires_at where status = held, on ends_at where status in (confirmed, arrived), and on starts_at for reminders.

### 8.5 Payments, ledger, payouts

| Table | Key columns | Notes |
| --- | --- | --- |
| payments | id, reservation_id, amount_cents, status (pending, paid, failed, expired), gateway_session_id (unique), gateway_transaction_id, method, fee_cents, paid_at | No card data stored |
| refunds | id, payment_id, reservation_id, amount_cents, reason, status (requested, succeeded, failed), idempotency_key (unique), gateway_refund_id, attempts, last_error | |
| webhook_events | id, provider, event_id (unique), raw_payload, signature_valid, status (received, processed, failed), received_at, processed_at | |
| ledger_entries | id, reservation_id, venue_id, account, amount_cents (signed), type, payment_id, refund_id, payout_id, idempotency_key (unique) | Immutable by trigger |
| payouts | id, venue_id, period_start, period_end, amount_cents, status (draft, approved, paid), paid_at, payment_reference, approved_by | |

### 8.6 Trust, reviews, notifications, audit

| Table | Key columns | Notes |
| --- | --- | --- |
| strikes | id, player_id, reservation_id (unique), venue_id, expires_at, removed_at, removed_by, removed_reason | Active when not removed and not expired |
| disputes | id, reservation_id, strike_id (nullable until upheld), player_message, evidence_file_id, owner_response, status (open, upheld, overturned), decided_by, decided_at, decision_note | One per reported no-show |
| appeals | id, player_id, message, proof_file_id, status (open, rejected, unblocked, strikes_removed), decided_by, decided_at, next_allowed_at | One open at a time |
| blocked_identifiers | type (email, phone, payment_fingerprint), value_hash, reason, created_by | |
| reviews | id, reservation_id (unique), player_id, venue_id, rating, comment, status (visible, removed), removed_by, owner_reply, owner_replied_at | |
| outbox_events | id, type, payload, status (pending, sent, failed), attempts | Written in the business transaction |
| notifications | id, user_id, type, title, body, link, read_at | In-app inbox |
| notification_preferences | user_id, category, email_enabled, push_enabled | |
| delivery_log | notification_id, channel, status, error, sent_at | |
| audit_logs | id, actor_id, actor_role, action, target_type, target_id, old_value, new_value, reason, created_at | Immutable, admin read only |

### 8.7 Relationship map

```
users ─┬─ player_profiles ── areas ── cities
       ├─ owner_profiles ── venues ─┬─ courts ── price_rules
       │                            ├─ opening_hours
       │                            ├─ venue_photos / venue_documents
       │                            └─ commission_changes
       ├─ sessions, device_tokens, notifications
       └─ strikes, appeals

reservations (court, venue, player?) ─┬─ payments ── refunds
                                       ├─ ledger_entries ── payouts
                                       ├─ strikes ── disputes
                                       └─ reviews
```

## 9. API

### 9.1 Conventions

- Base path `/api/v1`, JSON only. OpenAPI is generated from Zod schemas and the typed client in `packages/api-client` is generated from it.
- Route spaces: `/public`, `/auth`, `/player`, `/owner`, `/admin`, shared authenticated routes (`/me`, `/notifications`, `/devices`, `/files`), and `/webhooks`.
- Times are ISO UTC, money is integer piastres, IDs are UUIDs, lists use cursor pagination.
- Error codes include: SLOT_TAKEN, PLAYER_BLOCKED, EMAIL_NOT_VERIFIED, VENUE_NOT_BOOKABLE, OUTSIDE_BOOKING_WINDOW, TOO_MANY_HOURS, HOLD_EXPIRED, NOT_FOUND, FORBIDDEN, VALIDATION_FAILED, RATE_LIMITED.
- `POST /player/bookings` and money actions require an `Idempotency-Key` header and the behavior in 2.12.
- Strict rate limits on `/auth/*`, moderate limits on public search.
- A venue that is not `approved` can use setup and read endpoints, but cannot take bookings or appear in public search.

### 9.2 Auth and account

| Endpoint | Who | Notes |
| --- | --- | --- |
| POST /auth/register | Public | Body role: player or owner. Never admin |
| POST /auth/verify-email, /auth/resend-verification | Public | Link token |
| POST /auth/login, /auth/refresh | Public | Rotation and reuse detection |
| POST /auth/logout, /auth/logout-all | Logged in | |
| POST /auth/forgot-password, /auth/reset-password | Public | Same response whether or not the email exists |
| POST /auth/change-password | Logged in | Revokes every session, including current; login is required again |
| GET, PATCH /me | Logged in | Name, phone, language |
| DELETE /me | Logged in | Anonymize; blocked with upcoming bookings or unpaid balance |

### 9.3 Public (no login)

| Endpoint | Purpose |
| --- | --- |
| GET /public/cities, GET /public/areas?cityId= | Areas lists |
| GET /public/venues?areaId&sport&size&date&hour&cursor | Search approved venues with availability |
| GET /public/venues/:id | Details, photos, courts, rating |
| GET /public/venues/:id/reviews | Visible reviews |
| GET /public/courts/:id/availability?date= | Slots with price and status |
| GET /public/courts/:id/quote?startsAt&hours | Price breakdown, deposit, cancellation rule text |

Public responses never include owner details, documents, or commission.

### 9.4 Player

| Endpoint | Rule |
| --- | --- |
| GET, PATCH /player/profile | Foot, style, up to 2 positions, area, padel fields, photo |
| GET /player/strikes | Active strikes and expiry dates |
| POST /player/bookings | Verified email and active account. Checks window, hours limit, consecutive hours. Creates hold, payment, returns checkoutUrl. SLOT_TAKEN includes nearby alternatives |
| POST /player/bookings/:id/checkout | New checkout while the hold is valid |
| GET /player/bookings?scope=upcoming or past | Own only |
| GET /player/bookings/:id | Own only. Status, payment status, code, QR data. Clients poll this after paying |
| GET /player/bookings/:id/cancel-preview | Exactly what would be refunded or lost |
| POST /player/bookings/:id/cancel | Applies CancellationPolicy |
| POST /player/bookings/:id/review | Completed only, once |
| POST /player/bookings/:id/dispute | No-show only, within 48 hours |
| GET, POST /player/appeals | Only while blocked, one open at a time, 30-day wait after a rejection |

A blocked player can still log in and read their data and appeal. Only booking creation returns PLAYER_BLOCKED.

### 9.5 Owner

The venue is always found through the logged-in owner. No endpoint takes a venue ID from the body.

| Endpoint | Notes |
| --- | --- |
| POST /owner/venue | Register (status pending) |
| GET, PATCH /owner/venue | Immediate fields update directly; location or sport changes create a pending revision and keep approved public values live |
| POST /owner/venue/photos, DELETE /owner/venue/photos/:id | |
| POST /owner/venue/documents | Private proof files |
| POST /owner/venue/submit, GET /owner/venue/checklist | Submit or resubmit; what is missing |
| GET, PUT /owner/venue/opening-hours | Supports closing after midnight |
| GET, POST /owner/courts; PATCH /owner/courts/:id; POST /owner/courts/:id/archive | Football needs a size; archive requires no future active bookings or the closure/refund flow |
| GET, PUT /owner/courts/:id/price-rules | Writes a new version valid after 24 hours and returns the effective time |
| GET /owner/calendar?from&to&courtId | Own venue's reservations |
| GET /owner/bookings?status&date&search | Own venue only |
| GET /owner/bookings/lookup?code= | QR scan and code entry |
| GET /owner/bookings/:id | Player name, photo, phone, strike count. Never email or history |
| POST /owner/bookings/:id/arrive, /collect, /complete | Valid transitions only; complete is allowed only at or after scheduled end |
| POST /owner/bookings/:id/no-show | Creates a pending report after the 15-minute grace and within 24 hours of end |
| POST /owner/bookings/:id/cancel | Reason required, full refund |
| POST /owner/manual-bookings | Name, phone, court, hours |
| POST /owner/blocks, DELETE /owner/blocks/:id | Fails if a booking already occupies the slot |
| POST /owner/courts/:id/closures/preview, POST /owner/courts/:id/closures | Preview affected bookings; confirm to cancel with full refunds, then block |
| GET /owner/reviews; POST /owner/reviews/:id/reply, /report | One reply per review |
| GET /owner/disputes; POST /owner/disputes/:id/response | The owner's side |
| GET /owner/balance, /owner/ledger, /owner/payouts | Own venue only |
| GET /owner/reports/bookings?from&to | Counts, hours, amounts |

### 9.6 Admin

Admin accounts are created only by CLI. Every write records an audit entry and requires a reason where it overrides a rule.

| Area | Endpoints |
| --- | --- |
| Dashboard | GET /admin/dashboard |
| Venues | GET /admin/venues?status, GET /admin/venues/:id (signed document links), POST approve, reject, suspend, reactivate, PATCH commission (10 to 20%) |
| Users | GET /admin/users?search, GET /admin/users/:id, POST block, unblock; POST /admin/strikes/:id/remove |
| Appeals | GET /admin/appeals, POST /admin/appeals/:id/decide (reject, unblock, remove strikes) |
| Disputes | GET /admin/disputes, POST /admin/disputes/:id/decide (uphold, overturn) |
| Bookings | GET /admin/bookings, GET /admin/bookings/:id, POST cancel, POST refund (override of the 24-hour rule) |
| Reviews | POST /admin/reviews/:id/remove |
| Geography | GET, POST, PATCH /admin/cities and /admin/areas |
| Money | GET /admin/ledger, GET /admin/payouts, POST approve, POST mark-paid |
| Stuck items | GET /admin/failed-refunds with retry; failed emails and webhooks |
| Audit | GET /admin/audit-logs?actor&action&target&date |
| Jobs | /admin/queues (Bull Board) |

Approval and rejection send the owner emails through the outbox.

### 9.7 Shared and system

| Endpoint | Notes |
| --- | --- |
| GET /notifications; POST /notifications/:id/read, /read-all | Own inbox |
| GET, PUT /notifications/preferences | Per category |
| POST /devices; DELETE /devices/:token | Push token registration |
| POST /files/upload-url, POST /files/:id/confirm, GET /files/:id/url | Direct upload with signed URL; server checks size and type; signed read URLs only for permitted users |
| POST /webhooks/kashier | No login; signature check; stores event; returns 200 quickly |
| GET /health | For hosting checks and uptime monitoring |

## 10. Deployment and operations

### 10.1 Environments

| Environment | Purpose | Data | Payments |
| --- | --- | --- | --- |
| Local | Development with Docker Compose (Postgres, Redis, Mailpit for email capture) | Seed data | Fake gateway |
| Staging | Same setup as production, used for QA and demos | Test data | Kashier test environment |
| Production | Real users | Real data | Kashier live environment |

Each environment has its own database, Redis, storage bucket, Kashier keys, and email domain. Nothing is shared between environments.

### 10.2 Hosting (suggested defaults, provider-neutral)

- **API and worker:** the same Docker image started two ways (`api` and `worker`), on a container platform (Fly.io, Render, Railway, or AWS ECS). At least two API instances in production behind a load balancer. **Assumption:** pick a region close to Egypt (a Middle East or nearby European region) and confirm latency before launch.
- **Database:** managed PostgreSQL with automated daily backups and point-in-time recovery. Never run the production database inside a container you manage yourself.
- **Redis:** managed Redis with persistence enabled, because queued jobs live there.
- **Files:** S3-compatible bucket. One public bucket for venue photos (served through a CDN), one private bucket for documents and player photos (signed URLs only).
- **Web:** static hosting with a CDN (Cloudflare Pages, Vercel, or Netlify) for the React build.
- **DNS and TLS:** Cloudflare or equivalent. HTTPS only, HSTS enabled. Separate subdomains: `app.`, `api.`, and `staging.` variants.
- **Mobile:** Expo Application Services (EAS) for builds, store submission, and over-the-air updates of JavaScript-only changes.

### 10.3 CI/CD (GitHub Actions)

1. On every pull request: install, lint, type-check, architecture check, unit and use-case tests, integration tests against a Postgres service container, authorization matrix, OpenAPI diff check. Only affected apps build (Turborepo cache).
2. On merge to `main`: build the API image, run database migrations as a separate release step (never at app start), deploy to staging, run smoke tests.
3. Production deploys are manual approval from `main` (a tagged release). Migrations must be backward compatible with the previous app version (expand, then contract), so a rollback never breaks.
4. Keep a one-command rollback to the previous image.

### 10.4 Secrets and configuration

- Environment variables loaded and validated with a Zod schema at startup. The app refuses to start if one is missing.
- Secrets live in the hosting platform's secret manager, never in the repo or logs. Rotate JWT secrets, Kashier keys, and email keys on a schedule and after any suspected leak.
- `.env.example` documents every variable. CORS allows only the known web origins. Use `helmet` headers and a request size limit.

### 10.5 Observability and backups

- JSON logs with `requestId`, user ID, and route. Redact tokens, passwords, and payment payloads.
- Sentry for the API, worker, web, and mobile. Uptime checks on `/health`. Alerts for: failed jobs, growing queues, webhook failures, refund failures, ledger invariant failures, error-rate spikes.
- Backups: daily automated database backups, point-in-time recovery, and a restore drill before launch and then quarterly. Back up the private bucket too.
- Migrations are tested on a copy of production-shaped data before release.

### 10.6 Security and privacy checklist

- Dependency scanning (Dependabot or equivalent) and lockfile review in CI.
- Rate limiting at the edge and in the app. No stack traces in responses.
- File uploads: limit size and type, rename on upload, never serve user files from the API origin without signed URLs.
- Publish a privacy policy and terms of service (required by the app stores). Ask a lawyer to check them against Egypt's personal data protection law (Law 151 of 2020), and to review the money-holding setup with an accountant.
- Provide account deletion in the app (stores require it) and a way to contact support (a contact form or WhatsApp link).

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

### M5. Cancellation, refunds, ledger

- [ ] `CancellationPolicy` with unit tests for every case in 2.4, including the 24-hour boundary.
- [ ] Cancel preview and cancel endpoints, refund records and retries, owner and admin cancellation paths.
- [ ] Ledger entries for every case in 6.5, release logic, integrity check.

**Done when:** every row of the refund and ledger tables in 6.4 and 6.5 is a passing test.

### M6. Player features

- [ ] Profile and photo (file upload with signed URLs), strikes list, reviews, disputes, appeals, blocking checks.
- [ ] `StrikePolicy`: warnings at 2 and 3, block at 4, expiry after 6 months.

**Done when:** a player can progress from 0 to 4 strikes, get blocked, appeal, and be unblocked, all through the API.

### M7. Owner module

- [ ] Venue registration, photos, documents, submit, checklist, opening hours, courts, price rules with 24-hour delay.
- [ ] Calendar, bookings list, lookup by code, arrive, collect, complete, no-show (with grace and window), cancel, manual bookings, blocks, court closures with bulk refunds.
- [ ] Reviews and replies, dispute responses, balance, ledger, payouts view, reports.

**Done when:** a new venue can be registered, approved (by seed or CLI until M8), set up, and run through a full day of bookings via the API alone.

### M8. Admin module

- [ ] Approval and rejection with emails, commission changes within 10 to 20%, suspend and reactivate with bulk refunds.
- [ ] Users, strikes removal, appeals, disputes, bookings overrides, review removal, geography management.
- [ ] Payout generation and approval, mark-paid, stuck-items queue, dashboard, audit log queries.

**Done when:** the admin can approve a venue, set commission, decide an appeal and a dispute, and run a payout without touching the database.

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

## 12. Phase 2: Web (React)

**Goal:** all three roles can use the platform from a browser, on top of the finished API.

### 12.1 Architecture

```
apps/web/src/
├── app/            # router, providers (query client, auth, i18n, theme)
├── features/
│   ├── auth/       # login, register, verify, reset
│   ├── discovery/  # search, venue page, slot picker
│   ├── booking/    # checkout, payment return, my bookings, cancel
│   ├── player/     # profile, strikes, appeals, reviews, settings
│   ├── owner/      # setup, calendar, bookings, money, reviews
│   └── admin/      # approvals, users, disputes, payouts, audit
└── shared/         # ui components, hooks, utils
```

- Server state: TanStack Query hooks from `packages/api-client`. Local UI state stays in components. No business rule is re-implemented. The UI shows what the API returns (for example the cancel preview text and refund amounts).
- Forms: React Hook Form with Zod schemas from `packages/shared`. Show API field errors next to fields.
- Layouts per role (public, player, owner, admin) with route guards by role. A logged-in user who opens another role's route is redirected to their own home.
- Code-split by role so a player never downloads the admin bundle.

### 12.2 Auth handling

- Access token held in memory. Refresh token in the httpOnly cookie. On a 401 the client refreshes once, retries the request, and on failure logs out.
- One login page. Registration asks once whether the user is a player or a venue owner.
- Players who are not logged in can browse and view slots. The login prompt appears only when they press Book.
- Unverified email: show a banner with a resend button. Booking and venue submission are blocked by the API until verified.
- Blocked player: show a persistent blocked notice with strike dates and appeal access. The player can use existing bookings, profile, inbox, cancellation under normal policy, and appeals; only new booking creation is blocked.
- One browser profile has one active account. Login, logout, or account change synchronizes across tabs, clears account-specific caches, and redirects each tab to a route allowed for the current role. Simultaneous roles require separate browser profiles or an incognito session.

### 12.3 Language and layout

- English is the default. The Arabic switch is in Settings (and the header for logged-out visitors). It is saved on the account with `PATCH /me` and in local storage for visitors.
- All text comes from `packages/i18n` translation files. No hard-coded strings.
- Arabic sets `dir=rtl`. Use Tailwind logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) instead of left and right. Mirror icons that show direction.
- Use an Arabic-capable font with a Latin fallback. **Assumption:** show Latin digits in both languages. Format dates, times, and EGP amounts with `Intl`, always in the venue's time zone.
- Venue names, descriptions, and area names appear as entered. Areas have English and Arabic names.

### 12.4 Design system

- Tokens for color, spacing, radius, type scale, and shadows. Light theme first. Mobile-first responsive layouts.
- Components: Button, Input, Select, DatePicker, Dialog, Toast, Badge, Tabs, Table, EmptyState, Skeleton, StatusBadge (booking and payment status), CourtSizeBadge, SlotGrid, Countdown, PriceBreakdown, RatingStars, FileUpload, Calendar grid.
- Every list and detail has loading, empty, and error states. Accessibility: keyboard navigation, visible focus, labelled controls, sufficient contrast.

### 12.5 Pages by role

**Public and player**

| Route | Page |
| --- | --- |
| `/` | Search: sport, city or area, date, time, football size filter, list and map views |
| `/venues/:id` | Photos, map, phone, courts, reviews, date picker, slot grid with prices |
| `/checkout/:bookingId` | Summary, court size, cancellation rule, 30% or 100% choice, 10-minute countdown, pay button |
| `/payment/return` | Polls the booking until confirmed, failed, or expired |
| `/bookings`, `/bookings/:id` | Upcoming and past, code and QR, payment status, cancel with preview, review, dispute |
| `/profile` | Photo, foot, style, positions, area, padel fields, strike status |
| `/appeal` | Blocked screen and appeal form |
| `/notifications`, `/settings` | Inbox, language, notification preferences, delete account, support link |

**Owner**

| Route | Page |
| --- | --- |
| `/owner/setup` | Checklist of what is missing before the venue can go live, and approval status |
| `/owner` | Today: arrivals, amounts due, quick actions |
| `/owner/calendar` | Day (courts as columns, hours as rows), week and month; color by status; click for details |
| `/owner/bookings`, `/owner/bookings/:id` | List with filters and code search; details with arrive, collect, complete, no-show, cancel |
| `/owner/manual-booking` | Court, date, hours, name, phone |
| `/owner/venue`, `/owner/hours`, `/owner/courts`, `/owner/pricing` | Venue profile, photos, documents, opening hours, courts, price rules with the effective-time notice |
| `/owner/closures` | Close a court: shows affected bookings before confirming |
| `/owner/reviews`, `/owner/disputes` | Reply to reviews, respond to no-show disputes |
| `/owner/balance`, `/owner/payouts`, `/owner/reports` | Balance and how it is calculated, payout history, booking reports |

**Admin**

| Route | Page |
| --- | --- |
| `/admin` | Dashboard |
| `/admin/venues`, `/admin/venues/:id` | Approval queue, documents, approve or reject with reason, commission (10 to 20%), suspend |
| `/admin/users`, `/admin/users/:id` | Search, history, strikes, block, remove strike |
| `/admin/appeals`, `/admin/disputes` | Decision screens with both sides shown |
| `/admin/bookings` | All bookings, override and manual refund with required reason |
| `/admin/payouts`, `/admin/ledger` | Generated payouts, approve, mark paid, ledger view |
| `/admin/areas`, `/admin/reviews`, `/admin/stuck`, `/admin/audit` | Geography, review removal, failed refunds and emails and webhooks, audit log |

### 12.6 Behaviors that must be right

- **Slot picker:** select one slot or several consecutive hours (up to the venue's limit). Disable unavailable and past slots, and slots starting within 1 hour. Show per-hour prices and the total.
- **Checkout:** countdown from the hold's expiry. At zero, show an expired message and a button to go back. If `SLOT_TAKEN` comes back, show the alternatives from the error. For a booking within 24 hours, warn that the 30% deposit is non-refundable; a full payment still refunds the amount above the deposit.
- **After paying:** the return page never assumes success. It reads the booking status from the API.
- **Cancel:** always call the cancel preview first and show the exact amount refunded or lost.
- **Owner calendar:** status colors for deposit paid, fully paid, arrived, completed, no-show, cancelled, blocked, manual. A booking shows 'Deposit paid, X due at court' or 'Fully paid'. On small screens show one court at a time with a court switcher.
- **Venue not approved:** owners see a banner explaining the status and can still set up courts and prices.
- **Admin overrides:** require a reason field and show a confirmation with the exact effect.

### 12.7 Milestones

**W1. Shell and auth**

- [ ] App shell, router, role guards, providers, i18n with RTL, design system basics, generated API client.
- [ ] Register, verify, login, reset, session refresh, blocked and unverified states.

**W2. Player flow**

- [ ] Search, venue page, slot picker, checkout, payment return, my bookings, cancel flow.
- [ ] Profile, strikes, appeal, reviews, notifications inbox, settings, account deletion.

**W3. Owner setup**

- [ ] Registration, setup checklist, venue profile and photos, documents, hours, courts, pricing.

**W4. Owner operations**

- [ ] Calendar, bookings, match-day actions, manual bookings, blocks, closures, reviews, disputes, balance, payouts, reports.

**W5. Admin panel**

- [ ] All admin pages in the table above.

**W6. Polish and release**

- [ ] Arabic translation review, accessibility pass, responsive pass, Sentry, end-to-end tests for the main flows (Playwright), performance pass, production build deployed to staging.

**Phase 2 is done when** a venue can sign up, get approved, and run a full day of bookings entirely from the web, a player can book and pay end to end, and the admin can run approvals, disputes, and payouts.

## 13. Phase 3: Mobile (React Native with Expo)

**Goal:** one app for players and owners, built on the stable API and the typed client.

### 13.1 Architecture

```
apps/mobile/
├── app/                      # Expo Router
│   ├── (auth)/               # login, register, verify, reset
│   ├── (player)/(tabs)/      # explore, bookings, inbox, profile
│   ├── (owner)/(tabs)/       # today, calendar, scan, bookings, more
│   └── _layout.tsx           # reads the role and routes to the right group
├── features/                 # same feature split as web where it makes sense
└── shared/                   # ui components, hooks, native helpers
```

- The role comes from the session. After login the app sends the user to the player or owner group. A user can never open the other group.
- Reuse `packages/api-client`, `packages/shared`, and `packages/i18n`. Do not copy API calls or types.
- Tokens in `expo-secure-store`, sent in the body and header (`X-Client: mobile`). On a 401, refresh once, then log out.
- Use an Expo development build (not only Expo Go) so native modules work.

### 13.2 Player screens

- Explore (search with filters, venue cards, map), venue page, slot picker, checkout with countdown, payment return, confirmation with code and QR.
- My bookings (upcoming and past), booking detail with cancel preview and cancel, review, dispute.
- Profile with photo from the camera or gallery, foot, style, positions, area, padel fields, strike status.
- Blocked screen and appeal. Inbox. Settings (language, notification categories, delete account, support).

### 13.3 Owner screens (daily operations only)

- **Today:** the day's calendar across all courts, amounts due, quick actions.
- **Calendar:** day view with a court switcher.
- **Scan:** camera QR scan or typed code, then the booking opens with Arrived, Collected, Complete, and No-show buttons (no-show only after the grace period).
- **Bookings:** list and detail, cancel with reason.
- **More:** manual booking, quick slot block, notifications, language, log out.

Web only for owners: venue registration and documents, courts, opening hours, price rules, court closures, reviews, balance, payouts, and reports.

### 13.4 Native capabilities

- **Push:** `expo-notifications`. Ask permission at a sensible moment (after the first booking, or on the owner's first launch). Register the Expo token with `POST /devices` after login and remove it at logout. Notification taps deep-link to the booking, appeal, or inbox screen, but only open what the logged-in user may see.
- **QR scan:** `expo-camera` barcode scanning with a manual code field as fallback.
- **Checkout:** open Kashier's hosted page in an in-app browser (`expo-web-browser`). The return URL is a deep link such as `courtapp://payment/return?booking=ID`. The return screen polls the booking.
- **Photos:** `expo-image-picker`, then upload with a signed URL. Compress before upload.
- **Language:** English by default. Switching to Arabic sets RTL and reloads the app (React Native needs a restart for layout direction to change). Warn the user before switching.
- **Offline:** show cached last data with a clear offline banner. Never queue payments or check-ins offline.

### 13.5 Release

- EAS build profiles: development, staging (staging API), production. Environment values come from build profiles, never from the repo.
- Apple Developer account and Google Play account. Set bundle and package IDs, icons, splash, store listings in English and Arabic, screenshots.
- Required by the stores: privacy policy URL, in-app account deletion, and data safety and privacy forms. Prepare test accounts (player, owner) and review notes for App Review.
- A court booking is a real-world service, so payment through an outside gateway is generally allowed. Check the current store guidelines before submitting.
- Distribute through TestFlight and Google Play internal testing first. Use EAS Update for JavaScript-only fixes. Track crashes in Sentry.

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

## 16. Risks

- **Venues bypassing the app** (booking by phone or WhatsApp to avoid commission). Make the app better than the alternative: reminders, reviews, no-show protection, and booking history. Do not show the venue's phone number prominently.
- **Cold start.** A marketplace with no courts is useless. Sign up friendly venues before public launch.
- **False no-shows.** Mitigated by the grace period, the dispute flow, and per-venue tracking of overturned decisions.
- **Account dodging** after a block, because there is no OTP. Mitigated by the deposit itself, unique phone numbers among players, rate limits, and payment identity blocking if available. `phone_verified` is ready if OTP is added later.
- **Email as the main channel** may be read late. Push on mobile covers time-sensitive events, and the inbox keeps everything.
- **Holding venue money** needs legal and accounting review, and an agreement with Kashier.
- **Late discovery of integration problems.** Mitigated by the vertical slice in M4.

## 17. Later (not in these phases)

- Split payment between friends and open matches ('3 spots left'), padel player matching, and a player directory (profile fields already exist).
- Recurring weekly bookings for fixed teams.
- Split pitches (one large pitch equals two smaller ones).
- Staff accounts with limited permissions, and multiple venues per owner.
- Detailed analytics and reports, promo codes, memberships, featured venues.
- Fawry and other pay-at-outlet methods with a longer hold.
- Phone OTP, admin 2FA, browser push, SMS reminders.
- Automated venue payouts through Kashier, if supported.

## 18. Starting prompt for the AI agent

Give the agent this document and this prompt.

```
You are building the Court Booking Platform described in the attached specification.

Rules:
1. Read the whole specification first. Section 2 (business rules) and section 5
   (authorization) are mandatory and not negotiable.
2. Work in the milestone order of sections 11, 12, 13: M1 to M10 (backend),
   then W1 to W6 (web), then P1 to P5 (mobile). Finish and verify one
   milestone before starting the next.
3. Follow clean architecture and SOLID as in section 4. The architecture test
   must pass. Business rules live only in the backend domain layer.
4. Write tests with the code, including the authorization matrix (5.7) for every
   endpoint. Do not mark a milestone done with failing tests.
5. Do not guess Kashier details. Read https://developers.kashier.io/docs. Use the
   fake gateway until sandbox keys exist.
6. If a rule is missing or contradicts another, stop and ask. Do not invent.
7. Treat items marked Assumption as configurable constants.
8. After each milestone, report: what was built, tests run and results, deviations
   from the specification, and open questions.

Start with M1 (Foundation) and report when it is done.
```

## 19. Sources

- [Kashier developer documentation](https://developers.kashier.io/docs), checked 2026-10-25
- [Kashier payment sessions](https://developers.kashier.io/docs/accept-payments/payment-sessions)
- [Kashier accept payments](https://developers.kashier.io/docs/accept-payments)
