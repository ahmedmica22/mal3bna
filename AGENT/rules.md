# Court Booking Platform — Agent Rules

Source: `Agent/court-booking-platform-spec.md`, updated 2026-10-25. These companion instructions derive from that specification; they do not replace it.

## 1. Authority and workflow

1. Read the full specification and all four companion files before writing code. Source sections 2 and 5 are mandatory. The source overrides these summaries; a contradiction within the source requires a decision rather than a guessed interpretation.
2. Execute M1–M10, W1–W6, P1–P5 in order. The source explicitly allows the minimal web/Expo vertical slice at M4 and an early mobile build; these do not authorize building full client features early.
3. Finish code, tests, docs and gates for one milestone before advancing. Do not mark an externally blocked milestone complete.
4. Preserve assumptions as named configuration values, clearly labelled provisional. Do not change locked numeric values or resolve business conflicts silently.
5. Do not add deferred features, change the stack, replace Kashier with Stripe, switch to subscription revenue, enable multiple venues per owner, or remove Arabic support based on older plans.
6. Use `Agent/implementation-plan.md` for dependency ordering, decisions and progress. Record the specific blocked task and continue only unrelated work.

## 2. Architecture and SOLID

- Use the monorepo and module layout from source sections 3–4. Keep framework/SDK/database code outside domain code.
- Domain imports itself only; application imports domain and its ports; infrastructure imports domain/application; presentation imports application. Presentation never imports infrastructure or domain internals.
- Full layers apply to auth, bookings, payments, ledger, commission and strikes. Simpler modules may use a service/repository structure.
- Controllers validate strict Zod input, call a use case and map output. No pricing, refund, strike or commission rules in controllers or clients.
- Use small interfaces and injected adapters. Fake and real gateways must honor the same behavior contract.
- Rich entities protect legal state transitions; pure policies calculate decisions. Use Clock.now() in business logic, not direct system time.
- Keep shared packages free of backend business logic. Generate OpenAPI from schemas and the typed API client from OpenAPI; regenerate rather than hand-edit generated output.

## 3. Data, reservations and money

- Use UUIDs, UTC timestamptz storage, IANA venue time zones, integer piastres and basis points. Never use floating-point money or fixed UTC offsets.
- Centralize source section 2.11 constants. Freeze per-hour price breakdowns and commission rates on bookings. Price changes activate after the specified delay.
- Use hand-written SQL migrations for PostgreSQL checks, partial indexes, overlap exclusion constraints and immutability triggers alongside Prisma migrations.
- Player bookings, manual reservations and blocks share the overlap constraint. Expire stale holds transactionally on create and retry once as specified. Keep half-open reservation ranges so adjacent hours do not overlap.
- `POST /player/bookings` and money actions require Idempotency-Key. Persist replay outcomes atomically and apply the approved 24-hour retention, replay, mismatch, and in-progress behavior from specification 2.12.
- Ledger rows and audit history are immutable. Correct financial errors with reversing entries. Use unique effect keys to prevent duplicate releases, refunds and payouts.
- Refund completion, not merely a request to the gateway, triggers refund ledger entries. Failed refunds remain visible and retry safely before escalation.
- Release only according to the agreed source policy. Payouts are generated from released balances, never typed in manually; negative venue balances carry forward.
- Archive venues/courts and preserve financial/trust records. Account deletion anonymizes eligible personal data without deleting required history.

## 4. Authentication, ownership and privacy

- Deny all routes unless explicitly public or role-declared. Apply ownership checks in application use cases and scoped repository methods.
- Derive actor identity from authenticated context. Reject unknown input fields and attempted ownership/role overrides, except the explicitly allowed player/owner registration role choice.
- Return 401 for missing/expired/revoked credentials, 403 for wrong role and 404 for another user's resource. Apply the matrix only where relevant: public routes are intentionally public; successful creates may return 201 or 204 instead of literal 200.
- Create the authorization matrix and route-declaration scan in M2 before business endpoints. Add cases for every new route, sensitive state and output DTO.
- Use Argon2id, hashed rotating refresh tokens, session-family reuse revocation, hashed single-use verification/reset links and auth rate limits.
- Web: access token in memory, refresh token in Secure/HttpOnly/SameSite cookie; never store tokens in localStorage. Mobile: SecureStore with the defined mobile exchange. Access tokens authenticate ordinary requests in the Authorization header; token response bodies are not a replacement for bearer authentication.
- Implement cookie/CORS and CSRF defenses appropriate to the chosen deployment origins. `X-Client: mobile` is a client-flow signal, never an authorization bypass.
- Invalidate revoked sessions and re-read current account state for sensitive actions. A strike-blocked player can read existing bookings and appeal; do not treat a login block as the strike policy.
- Allow-list DTO fields by role. Owners see only permitted player details and venue-scoped strike count, never emails, full histories or other venue data.
- Private proof documents/player photos require authorized short-lived signed URLs. Venue photos may be public. Validate upload type, size, purpose and ownership before confirmation.
- Log every admin write and sensitive owner action, including actor, target, old/new values, time and required reasons. Redact credentials and sensitive fields from audit payloads too.

## 5. Payment and asynchronous reliability

- Consult official Kashier documentation during integration for current signatures, payload fields, verification and refund behavior. Do not trust redirect query parameters as proof of payment.
- Keep provider URLs/headers/field names inside adapters. FakeGateway is the local default; isolate test and live credentials.
- Verify webhook signatures, persist/deduplicate events, acknowledge promptly, then process in workers and verify payments server-side. Validate expected booking/session, amount and currency.
- Store notification intents transactionally with business changes. Deliver externally after commit through idempotent workers. Never send email/push directly from domain code.
- Use database-backed work discovery, locks, retries/backoff, deduplication and dead-letter recovery. Do not assume exactly-once queue delivery.
- Late successful payments must re-acquire availability atomically; confirm only if still free, otherwise refund and notify.
- Persist webhook payloads only in protected storage as required by the source; do not log full payloads. Define retention/redaction before production.

## 6. Client behavior

- Use React/Vite for web and React Native/Expo for mobile. Reuse schemas, translations and the generated client; keep backend policies authoritative.
- TanStack Query manages server state; component state manages local UI. Clear sensitive cached queries on logout or account/role change.
- Refresh once after an eligible 401, retry once and end the session on failure. Coordinate concurrent refresh requests to avoid rotation races.
- Role guards redirect to permitted home routes. Define cross-tab identity changes before W1; never leave a previous account's privileged data visible after a shared session changes.
- Checkout displays court size, hourly breakdown, payment choice, policy, API-based hold expiry and warnings. The return screen polls the API. Cancellation always displays a fresh server cancel preview.
- Provide loading, empty, error, pending and offline states as appropriate. Use accessible controls, keyboard focus, clear labels and responsive layouts.
- All UI copy comes from shared translations. English default, Arabic RTL, logical spacing and venue-time-zone formatting; light theme first.
- Mobile contains no admin UI and only specified owner daily operations. Deep links must recheck session role and resource access. Never queue payments/check-ins offline.

## 7. Verification and operations

- Enforce strict TypeScript, no any, ESLint, Prettier and dependency-cruiser rules. Prefer business names, small functions and no magic numbers.
- Unit-test policies/entities with a controllable clock; test use cases with fakes; test database invariants with real PostgreSQL.
- Test 50-way overlap competition, authorization/output privacy, payment/refund replay and crash recovery, ledger invariants and all relevant time boundaries.
- Each milestone requires green applicable tests, lint, type/architecture checks, updated OpenAPI/client when contracts change, a CHANGELOG entry and repeatable demo script. Never fabricate test results.
- Validate environment configuration at startup. Keep secrets out of source/logs; supply `.env.example` and separate environment resources.
- Ship API and worker as distinct processes. Run migrations as a release step, use backward-compatible expand/contract migrations, and document rollback.
- Require staging smoke tests, monitoring/alerts, backup restore verification and source launch gates before production. Obtain the source-required manual release approval for production deployment.
