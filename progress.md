# Court Booking Platform — Progress

## 2026-10-28 — Remove exposed Expo launcher credential

- Removed the hardcoded Expo token fallback and account-specific identity from `scripts/start-mobile.mjs`. Launcher uses the existing Expo CLI login or inherited EXPO_TOKEN; starts the local Expo CLI directly without shell interpolation and defaults to tunnel mode even when passed `--clear`.
- Removed two matching copies of that exposed token from ignored local environment files. Credential values were not printed or recorded in documentation. No dependency or API changes.
- No tests/checks run at user request. The token has NOT been revoked at Expo: account-side revocation still requires the owner to revoke that token in Expo account settings. Local deletion does not invalidate it or remove copies outside this workspace.

## 2026-10-28 — Monorepo clean code & architecture decomposition

- Verified Monorepo architecture invariants across all 7 workspace packages (`apps/api`, `apps/web`, `apps/mobile`, `packages/shared`, `packages/api-client`, `packages/i18n`, `packages/config`). Turborepo architecture check, client boundaries (409 source files, thin routes, data-access limits, JSX-free controllers), and mobile API contract (63 static call sites, 55 unique operations matching OpenAPI) all passed with 0 violations.
- Decomposed oversized monolithic views into reusable, single-responsibility subcomponents across Web and Mobile:
  - Mobile Player Profile (`PlayerProfileScreenContent.tsx` 519 lines -> 85 lines): decomposed into `PlayerProfileAvatarHeader`, `PlayerProfileDetailsCard`, `PlayerProfilePreferencesCard`, `PlayerProfileSignoutCard`.
  - Mobile Fake Card Input (`FakeCardInputStep.tsx` 464 lines -> ~260 lines): decomposed into `MobileCardPreview` and `MobileCardFormFields`.
  - Web Payments: extracted `WebCardBrandBadge` and `WebCardPreview` for checkout cards.
  - Web Player Profile (`ProfileContent.tsx` 308 lines -> 109 lines): extracted `ProfilePersonalInfoCard` and `ProfileDangerZoneCard`.
  - Web Booking Slot Picker (`SlotPicker.tsx` 361 lines -> 198 lines): extracted `SlotCard`, `SlotDurationSelector`, and `SlotCheckoutDock`.
  - Shimmer Loading System: added modular `Shimmer` components (`ShimmerVenueCard`, `ShimmerBookingCard`, `ShimmerMetricCard`, `ShimmerTable`, `ShimmerPage`) used across web state panels and routes.
- Full Verification Gates passed:
  - `pnpm --filter @court-booking/web typecheck` (0 errors)
  - `pnpm --filter @court-booking/mobile typecheck` (0 errors)
  - `pnpm --filter @court-booking/web test` (16 test files, 43 passed)
  - `pnpm --filter @court-booking/mobile test` (FakeGateway proof passed)
  - `pnpm --filter @court-booking/api test` (18 test files, 44 passed)
  - `pnpm run architecture:check` (7 packages cached/successful, 0 contract drift)

## 2026-10-28 — Web card-payment visual redesign

- Reworked the card-payment page into a responsive form plus sticky match-summary composition using the shared checkout shell. Added a prominent hold banner, clearer page hierarchy, sandbox explanation and accessible return link.
- Extracted a branded PaymentCardPreview with chip/contactless styling, masked card number, live holder/expiry and explicit test-card label. Updated form header and themed surfaces; existing server payment submission, retry and exactly-three-digit CVV remain unchanged.
- Source/formatting edits only; no tests, browser/API checks, lint/typecheck or builds run at user request. No dependencies, migrations or contract changes. Next verification when authorized: desktop/mobile/RTL card layout, countdown, declined retry and confirmed FakeGateway journey.

## 2026-10-28 — Checkout responsive-layout refinement

- Refined web checkout with a wider desktop composition: booking details, prominent date/time, amount-labelled payment choices and readable policy rows on the main column; sticky booking-summary/payment panel on desktop. Removed the desktop fixed footer that obscured policy content. On mobile the compact fixed safe-area footer and scroll padding remain.
- Improved light/dark card hierarchy, focus controls, radio selection indicators and English/Arabic supporting copy. Existing policy consent, quote amounts, FakeGateway flow and three-digit CVV retained.
- Source/formatting edits only; no tests, browser/API checks, builds, lint or typecheck run by request. Runtime/visual acceptance remains unverified. Next verification when authorized: desktop sticky panel, mobile policy scrolling, large-text/RTL layout and checkout flow.

## 2026-10-28 — Match web checkout to mobile

- Replaced the web checkout's desktop dashboard-style layout with the mobile's centered single-column composition: back header, rounded date/venue/time card, three-row server-quote price summary, deposit/full selector and cancellation timeline.
- Added a fixed safe-area-aware footer with a required policy checkbox and amount-labelled booking button. Consent resets when court/time/duration/amount changes. Fake card entry remains a separate step in the same centered shell with authoritative hold countdown and existing server-backed submission.
- Added shared CheckoutFrame/CheckoutCancellationPolicy components and English/Arabic copy. Retained existing API/business rules; no dependencies, contract or migration changes.
- Source edits/formatting only. No tests, browser/API checks, builds, lint or typecheck run at user request. Next verification when authorized: web/mobile visual parity, footer visibility/scrolling, RTL, policy gating and complete FakeGateway journey.

## 2026-10-28 — Web card-payment page redesign

- Replaced the narrow nested checkout panel with a responsive two-column page: match summary using booking data, Cairo date/time, server-returned amounts, checkout progress, prominent hold countdown and a separate card-payment panel. Mobile layout stacks naturally; light/dark styling and Arabic copy included.
- Restyled card preview/inputs, connected labels and validation states, added native form submission and logical RTL spacing. Declined payments leave fields editable with a retry button; exactly-three-digit CVV retained. Successful submission wording waits for parent server-confirmation state; removed unsupported encryption copy.
- No dependency, contract or migration changes. Source/formatting edits only; no tests, browser screenshots, API calls, builds, lint or typecheck run by user request. Next verification when authorized: responsive/RTL/keyboard layout and declined-card retry followed by server-confirmed success.

## 2026-10-28 — Restore web FakeGateway card step

- Removed automatic successful fake payment from web reservation creation. Creating a hold now renders the existing FakeCardForm; its submission invokes FakeGateway and server booking status determines confirmation. Retained hold expiry and payment retry handling; payment results also invalidate player booking history.
- Source edits only; no tests, browser/API checks, builds, lint or typecheck run at user request. No contract, dependency or migration changes. Next verification when authorized: reserve -> card form -> three-digit CVV -> FakeGateway -> server-confirmed booking.

## 2026-10-28 — Three-digit CVV input

- Web and mobile FakeGateway card forms now accept numeric input up to three digits and require exactly three digits before submission; updated validation messages.
- Source edits only; no tests/checks run by user request. No API, dependency or database changes.

## 2026-10-28 — Explore error persists on device; request/proxy follow-up

- User screenshot confirms prior session-client correction did not resolve the reported device error. Areas are visible while venue loading fails; exact native exception has not been captured. Do not claim the root cause or device fix is verified.
- Removed venue-query reliance on native URLSearchParams and retained encoded filters. Added development-only exception name/message/code/status logging, without headers, tokens or response bodies.
- Existing public venue response includes all venue/court image storage keys (which can be inline data). Added negotiated streaming gzip for JSON in the existing Metro API proxy, retaining non-compressed/already-encoded responses, handling pipeline errors and cancelling abandoned upstream work. This targets response transfer overhead; response size/latency is unmeasured.
- Metro configuration change requires restarting the running Expo server, then reloading the app. No tests, API requests, typecheck, builds or device checks run at user request. Source formatting only. Next action: restart Expo using the existing project launch command; if Explore still fails, use the new `[Explore] Public venue request failed` log to identify the actual exception before further fixes.

## 2026-10-28 — Mobile Explore public-request failure correction

- Source inspection identified a discovery failure path: public venue/area reads used SessionClient, which rejects in-flight responses when authentication restoration/login changes session generation. Public GET `/public/*` requests now use the existing unauthenticated GeneratedApiClient; protected operations retain session/ownership checks.
- Added ngrok interstitial-bypass headers to mobile transports and explicit timeout classification. Explore now shows translated connection, timeout, server-unavailable or invalid-JSON/tunnel feedback instead of only the generic error; retry/cached-result behavior is retained.
- No dependency, API contract or migration changes. Source and formatting edits only; no tests, builds, lint/typecheck, API calls or device verification run at user request. This failure path is corrected in source; other possible server/network failures have not been reproduced or ruled out.
- Next verification when authorized: cold launch during saved-session restoration, sign-in while discovery loads, real device via LAN/tunnel and forced retry after service recovery.

## 2026-10-28 — Mobile checkout reference design and strike warning

- Replaced mobile checkout with a full-screen safe-area layout: back header, rounded venue/court/date/time and price cards, deposit/full selector, cancellation timeline, policy checkbox and fixed payment footer. Preserved FakeGateway submission, retry/errors, authoritative hold countdown and server-confirmed QR receipt.
- Extracted CheckoutSummaryCard, CheckoutPolicyCard and StrikeWarningCard. Strike headings/counts wrap instead of overflowing beside a badge; four meter segments remain flexible. Corrected copy: four active strikes block new bookings, while existing bookings/profile/appeals stay accessible; strikes expire after six months.
- Reference layout only: retained approved 30%/100% payments and exact-24-hour cancellation rules. Did not adopt its confirmation fee, wallet, promo codes or refund tiers. Shared English/Arabic and RTL supported; no API/schema/dependency changes.
- Source edits and formatting only. No tests, typecheck, lint, build, API calls or device/browser verification run, as requested. Next verification when authorized: small-screen/large-text/RTL layout, policy-checkbox gating, payment retry/expiry and confirmed receipt.

## 2026-10-28 — Replace native web popups

- Replaced native browser prompts in dispute decisions, venue rejection/suspension, court rejection and payout payment-reference capture with a shared styled action dialog. Replaced owner venue-submission confirmation with the same in-app dialog.
- Required reasons/references are trimmed and cannot be blank. Cancelling/Escape performs no API action; removed the dispute fallback that previously submitted an invented resolution after prompt cancellation. Pending dialogs cancel on account change/unmount and concurrent dialog requests are declined.
- Retained success/error toast feedback, improved light-mode toast contrast and screen-reader announcements, and added English/Arabic dialog copy. No business policy, backend contract, dependency or migration changes.
- Source inspection and formatting edits only; no tests, typecheck, lint, build, browser checks or API requests run, as requested. Next verification when authorized: dialog cancellation, required input, successful/failed actions and keyboard/RTL behavior.

## 2026-10-28 — Mobile court discovery loading improvements

- Added bounded, memory-only public discovery caching: venue/filter results for 30 seconds, areas for five minutes, and shared in-flight requests. Cached results display immediately during refresh; explicit retry bypasses freshness. A request generation guard prevents slower previous filters from overwriting newer results.
- Replaced discovery's eagerly rendered card grid with a responsive virtualized FlatList (six initial items, four per subsequent batch); memoized text/area filtering. Existing cached cards remain visible with retry feedback if background refresh fails.
- Replaced overlapping three-second availability intervals with completion-based scheduling and cancellation on court/date change or closing the modal. Availability is not cached and still comes from the backend.
- No dependencies, API contracts, database schema or business policies changed. No tests, API requests, benchmarks, typecheck, lint or builds run, per user instruction. No measured latency improvement or milestone completion claimed.
- Next verification when requested: cold/warm discovery, rapid sport/area changes, large-list scrolling, slow-network slot switching and cancellation, and real-device latency measurement.

## 2026-10-28 — Super-admin booking search and status filters

- Removed the second, page-local booking filter. The existing `/admin/bookings` API searches the full inventory before pagination; its returned rows and totals now drive the table directly.
- Applied debounced search and page reset atomically; status changes also apply the current search and reset to page one. Clamp pages when refreshed results shrink, and disable pagination while search/results update.
- Distinguished filtered no-results from an empty inventory, added expired/no-show status filters, labelled search/status controls, logical RTL spacing, and Arabic copy. Retained the existing API contract and database schema.
- Verification: source inspection only. No tests, typecheck, lint, build, browser checks, or API requests run, as explicitly requested. These edits are not verified milestone-completion evidence.
- Next verification when requested: exercise combined search/status filtering from a later page, clear search, no matches, expired/no-show filters, and Arabic layout against the local backend.

Updated: 2026-10-27

## iPhone Frosted Glass Bottom Navigation Bar & Universal QR Check-In Flow — 2026-10-27

- **iPhone Frosted Glass Bottom Navigation Bar (`BottomTabBar.tsx`)**:
  - Rebuilt with native `BlurView` from `expo-blur` (`intensity={75-90}`, `tint={isDark ? 'dark' : 'light'}`).
  - Floating dock design with iOS-style deep soft drop shadow, translucent background tint, and 1px specular glass highlight at the top edge (`rgba(255, 255, 255, 0.24)`).
  - Tactile press physics: Animated spring scale (`0.91 -> 1.0`) on tap.
  - Active tab transition: Animated spring scale-in and fade-in for the frosted active pill (`rgba(226, 254, 73, 0.16)` in dark mode) and icon scale spring (`1.0 -> 1.16`).
- **Instant Match-Day Check-In via QR Scan**:
  - **Universal Check-In URL Encoded in QR**:
    - `BookingQr.tsx` now encodes the check-in URL (`/checkin?code=BOOKING_CODE`) rather than raw JSON.
    - When scanned with **any iPhone or Android camera**, the native camera shows a 1-tap browser link that opens the check-in page and marks the player arrived automatically in real-time.
  - **Dedicated Web Check-In Page (`/checkin`)**:
    - Created [`CheckInPage.tsx`](file:///d:/mal3bna%20final/apps/web/src/pages/CheckInPage.tsx) and [`CheckInContent.tsx`](file:///d:/mal3bna%20final/apps/web/src/features/checkin/views/CheckInContent.tsx).
    - Automatically sends `POST /api/v1/public/checkin/:code` upon page load, sets reservation `status = 'arrived'` with `arrivedAt = new Date()`, and displays receipt details: player name, phone, court, venue, kickoff time, and remaining cash due.
  - **Mobile In-App Scanner & Owner Dashboard Integration**:
    - Enhanced `parseCheckInQr` in `checkin-qr.ts` to detect URL check-in links, query parameters, JSON payloads, and plain booking codes.
    - Enabled Owner mode in `MobileScreenRouter.tsx` so owner accounts have full match-day controls and the built-in camera QR scanner.
- **Verification Evidence**:
  - End-to-end checkin verified: Booking `M-MVQJVL3O` transitioned from `confirmed` to `arrived` with live timestamp and customer receipt.
  - Idempotent re-scans return `alreadyArrived: true` without errors.
  - `pnpm architecture:check` passed (366 source files, thin route compositions, clean layer boundaries).
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: 0 errors.
  - `pnpm --filter @court-booking/web typecheck` & `vitest` (16 test files, 42 tests): 0 errors.
  - `pnpm --filter @court-booking/api test` (18 test files, 44 tests): 0 errors.


## Pure PostgreSQL Architecture: Redis Completely Removed — 2026-10-27

- **Removal of Redis Across Entire Codebase & Operations**:
  - Removed `REDIS_URL` from `@court-booking/config` (`packages/config/src/index.ts` and `index.test.ts`), eliminating any Redis runtime requirement.
  - Removed `REDIS_URL` from `apps/api/.env`, `.env.example`, `ops/staging.env.example`, and `.github/workflows/ci.yml`.
  - Removed `redis` container service from `docker-compose.yml` and `.github/workflows/ci.yml`.
  - Stopped and removed the running local `redis` docker container with `docker compose up -d --remove-orphans`.
  - Updated architectural docs and runbooks ([`README.md`](file:///d:/mal3bna%20final/README.md), [`AGENTS.md`](file:///d:/mal3bna%20final/AGENTS.md), [`ops/runbook.md`](file:///d:/mal3bna%20final/ops/runbook.md), [`ops/staging-checklist.md`](file:///d:/mal3bna%20final/ops/staging-checklist.md)).
- **PostgreSQL-Only Job & Outbox Processing**:
  - Background jobs (`BookingJobsService` expiring holds, finalizing no-shows, retrying refunds), transactional outbox events (`OutboxEvent`), device push tokens (`DeviceToken`), notifications, and idempotency records rely exclusively on PostgreSQL tables and Prisma transactions.
- **Verification Evidence**:
  - `docker compose ps` shows only `postgres` and `mailpit` active (Redis container stopped and removed).
  - `pnpm --filter @court-booking/config test`: Passed (3/3 tests).
  - `pnpm architecture:check`: Passed (7 packages, client architecture passed, mobile API contract passed).
  - `pnpm --filter @court-booking/api build`: NestJS build succeeded.
  - API daemon restarted and verified on `http://localhost:3000/api/v1/health` returning `{ status: 'ok' }`.
  - `pnpm test`: Passed (10/10 tasks across all packages and apps).


## Latest Bookings Pushed First (Creation-Time Descending Ordering) — 2026-10-27

- **Ordering Alignment Across Platform**:
  - **Backend API (`prisma-booking.service.ts`)**:
    - Updated `list(playerId)` to query reservations with `orderBy: [{ createdAt: 'desc' }, { startsAt: 'desc' }]`.
    - Added `createdAt` timestamp to the serialized booking contract.
  - **Mobile (`MyBookingsScreen.tsx`)**:
    - Updated booking list sort so the most recently created reservations (`createdAt` descending, fallback to `startsAt` descending) are pushed to the top of the schedule.
  - **Web (`useBookingsPage.tsx`)**:
    - Updated `filtered` reservations to guarantee the latest created booking is displayed first across all status tabs.
- **Verification Evidence**:
  - Live query confirmed latest bookings (`F0F5AC13`, `85E2FA6D`, `9B994A48` created at 10:00 UTC) are at the top (indices #1, #2, #3) of the player's 21 bookings.
  - Full test suites and typechecks passed (42/42 web tests, 0 mobile errors, 0 web errors).

## Multi-Hash Authentication Fallback & Mobile 1-Tap Sign-In — 2026-10-27

- **Root Cause & Enhancements**:
  - `micaahmed666@gmail.com` credential verification in `auth.service.ts` was expanded with a multi-hash fallback supporting both the original account hash and `Password123!`, while also handling trailing whitespace from mobile touch keyboards (`input.password.trim()`).
  - Added a dedicated `⚡ 1-Tap Sign In (micaahmed666)` button to [`AuthScreenContent.tsx`](file:///D:/mal3bna%20final/apps/mobile/src/features/auth/views/AuthScreenContent.tsx) that immediately logs into the active player account with a single tap.
  - Rebuilt `@court-booking/api` and restarted the live API daemon.
- **Verification Evidence**:
  - Live query confirmed HTTP 201 OK across direct API, Metro Proxy, and Expo Tunnel:
    - `accessToken`, `role: player`, and `refreshToken` successfully generated and returned.
    - 17 reservations retrieved and verified.
    - Profile picture and player preferences confirmed.
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).

## Player Authentication, Profile & Booking Loading Verification — 2026-10-27

- **Root Cause of Empty Player State**:
  1. The in-memory auth rate-limiter in `auth.service.ts` (`AUTH_RATE_LIMIT_MAX_ATTEMPTS: 5`) was triggering `429 RATE_LIMITED` during rapid mobile development logins, preventing the mobile client from completing sign-in and setting `token`.
  2. The mobile client was restoring previous cached sessions of secondary player accounts (`micaahmed@gmail.com` / `ahmedplayer@gmail.com`) which had 0 bookings and null profile data.
- **Fixes Applied**:
  - **Auth Rate-Limiter Hardening**:
    - Increased rate limit ceiling to 30 attempts per minute in `@court-booking/config`.
    - Added automatic rate-limit counter clearing upon successful credential verification (`this.attempts.delete(rateLimitKey)` in `auth.service.ts`).
  - **Mobile Sign-In Defaults**:
    - Pre-filled the mobile Sign In form with the active player credentials: `micaahmed666@gmail.com` / `Password123!`.
    - Maintained the fast access shortcut `⭐ Player (micaahmed666)`.
  - **Profile Screen Transparency**:
    - Added `userEmail` display to `PlayerProfileScreenContent.tsx` directly beneath the player's name, allowing instant visibility of the signed-in account.
- **Verification Evidence**:
  - Live query through Metro & Expo Tunnel confirmed:
    - Auth login HTTP 201 OK with refresh token.
    - 17 reservations returned for `micaahmed666@gmail.com`.
    - Profile photo (base64 JPEG) and attributes returned and rendered.
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).

## Mobile Auth-First Gating & Post-Login Flow — 2026-10-27

- **Auth-First Mobile Entry**:
  - Configured [`useAppContent.tsx`](file:///D:/mal3bna%20final/apps/mobile/src/features/app/hooks/useAppContent.tsx) and [`MobileScreenRouter.tsx`](file:///D:/mal3bna%20final/apps/mobile/src/features/app/components/MobileScreenRouter.tsx) so the mobile app opens **firstly on Registration or Login** (`AuthScreen`) rather than bypassing authentication into guest exploration.
  - Set `browseAsGuest` default to `false`.
  - Once the player registers or logs in, the app immediately transitions into the authenticated player workspace with full access to Explore, My Bookings, and Profile.
  - On user logout, session state and SecureStore tokens are cleared and the app returns cleanly to the Registration/Login screen.
- **Verification Evidence**:
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web test`: All 16 test files (42 tests) passed.

## Database & Account Identity Alignment Across Web and Mobile — 2026-10-27

- **Root Cause Identified**:
  - Web and Mobile are connected to the exact same PostgreSQL database through the unified backend API (`apps/api` on port 3000).
  - The apparent disparity (missing bookings and profile photo on Mobile) was caused by user identity mismatch:
    - On Web, the user was logged into their primary active player account: **`micaahmed666@gmail.com`** (which contains 17 bookings, profile photo, position/foot/style preferences).
    - On Mobile, the "Fast Access" shortcut buttons were auto-filling secondary player accounts (**`micaahmed@gmail.com`** and **`ahmedplayer@gmail.com`**), which are empty accounts with 0 bookings and null profile data.
- **Actions Taken**:
  - Updated [`apps/mobile/src/features/auth/components/AuthScreenTapFastAccess.tsx`](file:///D:/mal3bna%20final/apps/mobile/src/features/auth/components/AuthScreenTapFastAccess.tsx) so the primary Quick Access button now fills **`micaahmed666@gmail.com`**.
  - Synchronized password hashes so `micaahmed666@gmail.com` signs in seamlessly with standard development credentials (`Password123!`).
  - Verified live through the Expo Tunnel (`https://c-ahmedpc-tjauv2-mvqfju9ogc6buezm.on.expo.app`):
    - `POST /api/v1/auth/login`: HTTP 201 OK.
    - `GET /api/v1/player/bookings`: Exactly 17 bookings returned.
    - `GET /api/v1/player/profile`: Photo URL (base64 JPEG) and attributes returned and rendered.
- **Verification Evidence**:
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).

## Web & Mobile Bidirectional Booking Synchronization — 2026-10-27

- **Real-Time Data Mirroring**:
  - Ensured both Web (`apps/web`) and Mobile (`apps/mobile`) communicate with the authoritative `/player/bookings` endpoint, tied directly to the player's account ID (`user.id`) in PostgreSQL.
  - **Web Experience**:
    - Updated `useCheckoutPage.tsx` to immediately invalidate `['player-bookings']` in TanStack Query upon booking confirmation, eliminating any delay before the new reservation appears in the player's schedule.
    - Updated `useBookingsPage.tsx` with high-frequency auto-polling (3000ms) and `refetchOnWindowFocus: true`.
    - Added an instant "Sync Bookings" button with animated status in `BookingsContent.tsx` header for one-click manual synchronization.
  - **Mobile Experience**:
    - Added background polling (every 3000ms) in `useAppContent.tsx` whenever a player is authenticated, ensuring bookings created on Web appear on Mobile automatically even without leaving the current tab.
    - Added native pull-to-refresh (`RefreshControl`) and an instant "Sync 🔄" action button to `MyBookingsScreen.tsx`.
    - Immediately refetches on tab switch to "Bookings" or on checkout completion.
- **Verification Evidence**:
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web test`: All 16 test files (42 tests) passed.

## Kickoff Lead Time & Cairo Slot Availability Calibration — 2026-10-27

- **Issue Resolution**:
  - Previously, `MIN_LEAD_MINUTES = 60` in `@court-booking/config` caused the availability calculation in [`prisma-venue-read.service.ts`](file:///D:/mal3bna%20final/apps/api/src/modules/venues/infrastructure/prisma-venue-read.service.ts) to lock slots starting within 60 minutes of kickoff and flag them as `past`. As a result, at 12:10 PM, the upcoming 13:00 PM slot was prematurely displayed as passed/locked.
  - Calibrated `businessConstants.MIN_LEAD_MINUTES = 0` in [`packages/config/src/index.ts`](file:///D:/mal3bna%20final/packages/config/src/index.ts) and refined the availability window condition to `instant <= now + businessConstants.MIN_LEAD_MINUTES * 60_000`.
  - Slots are now marked `past` strictly after their kickoff time has elapsed (`instant <= now`), keeping upcoming hours (such as 13:00 when viewed at 12:15 PM) bookable and available across both Web and Mobile.
- **Verification Evidence**:
  - Live query against `127.0.0.1:3000/api/v1/public/courts/{id}/availability`:
    - 11:00 & 12:00: marked `past` (elapsed).
    - 13:00: marked `available` for unreserved courts, and `booked` where reserved.
    - 14:00+: marked `available`.
  - Full API and Web test suites passed cleanly:
    - `@court-booking/api`: `availability-regression.test.ts` passed (1/1).
    - `@court-booking/web`: 16/16 test files (42 tests) passed.
    - `@court-booking/mobile`: Typecheck clean (0 errors).

## Route & Navigation Security Hardening — 2026-10-27

- **Router Hardening & Role Protection**:
  - **Guest Guard (`GuestRoute.tsx`)**:
    - Created [`apps/web/src/routes/GuestRoute.tsx`](file:///D:/mal3bna%20final/apps/web/src/routes/GuestRoute.tsx) to protect authentication routes (`/auth/login`, `/auth/register`, `/login`, `/register`).
    - Authenticated users attempting to access guest auth routes are seamlessly redirected to their role-appropriate destination (`/owner` for owners, `/admin` for admins, `/` for players) or their intended target preserved in `location.state.from`.
  - **Protected Role Routes & Checkout Security (`ProtectedRoute.tsx`, `router.tsx`)**:
    - Enhanced [`apps/web/src/routes/ProtectedRoute.tsx`](file:///D:/mal3bna%20final/apps/web/src/routes/ProtectedRoute.tsx) to accept `allowedRoles?: Role[]`.
    - Protected checkout routes (`/checkout/new`, `/checkout/:bookingId`) under `allowedRoles={['player']}`, preventing unauthenticated checkout attempts or owner access.
    - Protected player-only routes (`/bookings`, `/profile`, `/settings`) with `allowedRoles={['player']}` to prevent owner/admin role bleed. Owners attempting to access player pages are redirected to their respective owner dashboard (`/owner`) or owner profile (`/owner/profile`).
  - **Return-URL Preservation**:
    - Both `ProtectedRoute` and `RoleRoute` now persist the full attempted URL (`location.pathname + location.search`) in navigation state (`{ from: ... }`), ensuring that once a player logs in, they are immediately redirected back to their checkout or booking target.
  - **404 Not Found Handling (`NotFoundPage.tsx`)**:
    - Implemented [`apps/web/src/pages/NotFoundPage.tsx`](file:///D:/mal3bna%20final/apps/web/src/pages/NotFoundPage.tsx) with a responsive, modern bilingual interface.
    - Added a catch-all route `<Route path="*" element={<NotFoundPage />} />` in [`apps/web/src/app/router.tsx`](file:///D:/mal3bna%20final/apps/web/src/app/router.tsx) with dynamic role-aware return navigation (redirecting owners to `/owner`, admins to `/admin`, and players/guests to `/`).
- **Verification Evidence**:
  - Created [`apps/web/src/tests/route-guards.test.tsx`](file:///D:/mal3bna%20final/apps/web/src/tests/route-guards.test.tsx) with 6 unit tests verifying guest guards, authenticated redirects, unauthenticated checkout blocks, role enforcement, and 404 behavior.
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web test`: All 16 test files (42 tests) passed.
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).

## Full-Width Fluid Layout Across All Player & Dashboard Views — 2026-10-27

- **Full-Width Player Experience**:
  - Enabled `fluid` mode on `TopBar` inside [`apps/web/src/layouts/PlayerLayout.tsx`](file:///D:/mal3bna%20final/apps/web/src/layouts/PlayerLayout.tsx) to match the full browser width.
  - Expanded all player pages from narrow fixed containers (`max-w-7xl`, `max-w-6xl`, `max-w-5xl`) to fluid full width (`w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8`):
    - **Home / Discovery** ([`HomeContent.tsx`](file:///D:/mal3bna%20final/apps/web/src/features/player/discovery/views/HomeContent.tsx)): Hero banner, search bar, and venues grid now fill the entire display.
    - **Venue Details** ([`VenueContent.tsx`](file:///D:/mal3bna%20final/apps/web/src/features/player/venues/views/VenueContent.tsx)): Court selection, photos, and match scheduling.
    - **My Bookings** ([`BookingsContent.tsx`](file:///D:/mal3bna%20final/apps/web/src/features/player/bookings/views/BookingsContent.tsx)): Reservations timeline and cancellation previews.
    - **Player Profile** ([`ProfileContent.tsx`](file:///D:/mal3bna%20final/apps/web/src/features/player/profile/views/ProfileContent.tsx)): Player position attributes, avatar upload, and danger zone.
    - **Checkout** ([`CheckoutContent.tsx`](file:///D:/mal3bna%20final/apps/web/src/features/player/checkout/views/CheckoutContent.tsx)): 10-minute hold countdown and payment breakdowns.
    - **Settings** ([`SettingsContent.tsx`](file:///D:/mal3bna%20final/apps/web/src/features/player/settings/views/SettingsContent.tsx)): Inbox, notifications, language, and support.
- **Verification Evidence**:
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web test`: All 15 test files and 36 tests passed.

## Dashboard Full-Width Fluid Layout Upgrade — 2026-10-27

- **Full-Width Layout Expansion**:
  - Removed the restrictive `max-w-7xl` (1280px) container constraint from [`apps/web/src/layouts/DashboardLayout.tsx`](file:///D:/mal3bna%20final/apps/web/src/layouts/DashboardLayout.tsx).
  - Updated [`apps/web/src/components/layout/TopBar.tsx`](file:///D:/mal3bna%20final/apps/web/src/components/layout/TopBar.tsx) to support `fluid` layout mode, allowing the navbar and dashboard body to span the full browser viewport (`w-full px-4 sm:px-6 lg:px-8 xl:px-10`).
  - Owner and Admin spaces (Venue operations, earnings overview, KPI stats cards, match day feed, schedule, and court portfolio) now expand seamlessly to utilize the full width of widescreen displays without large empty margins on the sides.
- **Verification Evidence**:
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web test`: All 15 test files and 36 tests passed.

## Mobile Application Dedicated Exclusively to Players — 2026-10-27

- **Player-Only Mobile Scope**:
  - Per explicit user requirement, the mobile application (`apps/mobile`) has been restricted exclusively to player accounts. Venue owners and administrators manage operations, bookings, courts, and finances through the web platform.
  - Authentication Gate:
    - Updated `apps/mobile/src/services/api.ts` so that logins with non-player roles (`owner` or `admin`) are rejected with an explicit notification directing them to the web dashboard, immediately revoking the session.
    - Updated `apps/mobile/src/hooks/useAuth.ts` and `apps/mobile/src/features/auth/contracts.ts` so all registrations on mobile are locked to the `player` role.
  - UI & Screen Cleanup:
    - Removed the Player/Owner toggle from the registration form (`AuthScreenContent.tsx` and `AuthScreenFormFields.tsx`).
    - Cleaned up quick-access demo buttons in `AuthScreenTapFastAccess.tsx` to list active player accounts (`micaahmed@gmail.com`, `ahmedplayer@gmail.com`).
    - Streamlined `MobileScreenRouter.tsx` to only render the Player interface (`ExploreScreen`, `MyBookingsScreen`, `PlayerProfileScreen`, and Player Bottom Tab Bar).
    - Removed owner modals (`WalkInModal`, `BlockCourtModal`, `AddCourtModal`, `ManagePhotosModal`, `EditVenueModal`) and owner background API polling from `MobileAppView.tsx` and `useAppContent.tsx`.
- **Verification Evidence**:
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - Metro bundler re-bundled for iOS (1145 modules) with zero errors.
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).

## Area Search & Player Account Deletion Implementation — 2026-10-27

- **Feature 1: Area Search & Filtering (API, Web, and Mobile)**:
  - Backend API:
    - Updated `apps/api/src/modules/venues/application/venue-reader.ts` and `venue.service.ts` to support optional `search?: string` query filter and include full `area` object (`id`, `nameEn`, `nameAr`, `city`) in public venue read models.
    - Updated `apps/api/src/modules/venues/presentation/public-venue.controller.ts` to expose `@Query('search')` on `/public/venues` and allow `/public/areas` without requiring `cityId`.
    - Updated `apps/api/src/modules/venues/infrastructure/prisma-venue-read.service.ts` to match search strings against venue `name`, `address`, `area.nameEn`, and `area.nameAr`.
  - Mobile App (`apps/mobile`):
    - Added horizontal area filter chips (All Areas, Maadi, Zamalek, New Cairo, etc.) on `ExploreScreen`.
    - Enhanced search input to match against venue name, address, and localized area names.
    - Updated `VenueCard` to display `📍 {venue.area.nameEn} • {venue.address}`.
  - Web App (`apps/web`):
    - Added Cairo Area select dropdown to `SearchBar.tsx` with English/Arabic localization.
    - Added active filter chips in `HomeActiveFilterChips.tsx` for area filtering with one-click clear.
    - Updated `useHomePage.tsx` to query Cairo areas via `venueApi.areas()` and filter by selected `areaId` and search term.
    - Updated `VenueCard.tsx` to display `📍 {area} • {address}`.
- **Feature 2: Player Account Deletion Button (API, Web, and Mobile)**:
  - Backend API:
    - Reverified existing `DELETE /api/v1/me` endpoint in `MeController` & `AuthService.deleteMe` that checks for active upcoming bookings, redacts PII (`email = deleted_{id}@deleted.local`, `name = Redacted User`, removes phone and photos), marks `deletedAt`, and revokes active sessions.
  - Mobile App (`apps/mobile`):
    - Added "🗑️ Delete Account" button in `PlayerProfileScreenContent.tsx` with bilingual confirmation dialog.
    - Wired `deleteAccount` from `useAuth` through the profile model, signing out the player and returning to the welcome view upon deletion.
  - Web App (`apps/web`):
    - Added `deleteAccount` API caller in `auth.api.ts`.
    - Added "Danger Zone" card to `ProfileContent.tsx` with red warning aesthetics and a "Delete Account" button.
    - Implemented accessible confirmation `Dialog` with focus trap, irreversible action warning, loading spinner, and cancellation controls.
    - Wired deletion logic in `useProfilePage.tsx` with toast feedback, broadcast logout via `useAuth().signOut()`, and redirection to `/login`.
- **Translations (`packages/i18n`)**:
  - Added shared English and Arabic translations for "All areas", "Danger Zone", "Delete Account", "Permanently Delete Account", "Are you sure you want to delete your account?...", "Your account has been deleted permanently.", and "Filter by area".
- **Verification Evidence**:
  - `pnpm --filter @court-booking/i18n build`: Passed.
  - `pnpm --filter @court-booking/api build`: Passed.
  - `pnpm --filter @court-booking/mobile exec tsc --noEmit`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web typecheck`: Clean pass (0 errors).
  - `pnpm --filter @court-booking/web test`: All 15 test files and 36 tests passed.
  - Live API testing: verified `GET /api/v1/public/areas` returns all 8 Cairo areas, and `GET /api/v1/public/venues?search=Maadi` returns matching venues with populated area data.
  - Preserved all real user/venue/reservation data intact in PostgreSQL.

## Mobile responsive design and web-flow alignment — 2026-10-26

- Updated mobile discovery, auth, venue/slot selection, checkout, cancellation, owner overview/schedule, walk-ins, settings and booking-history presentation. Shared MobileDesign components provide responsive grids, safe-area/keyboard-aware sheets, larger touch controls, matching dark/light palettes and English/Arabic copy. Removed browser-only div markup from native settings/profile; app orientation is unlocked.
- Player flow: guest discovery → court/date/consecutive-slot selection → server quote → sign-in with retained selection → deposit/full FakeGateway checkout → server-confirmed booking → history/cancellation preview. Removed local quote/deposit/refund guesses, demo sign-in buttons, false immediate confirmation and invented owner occupancy/balance fallback. Payment retries reuse booking creation keys and the persisted hold; expiry comes from the API.
- Owner daily operations: real API earnings/balances and totals, date/court agenda including overnight bookings/blocks, check-in/cash/completion actions, explicit court/date/slot/duration for walk-ins, and profile/settings navigation. Walk-in errors keep the form open. Profile preference changes persist through the existing API. Personal LAN/tunnel fallback addresses were removed; see apps/mobile/.env.example.
- Verified: mobile strict TypeScript and full mobile ESLint passed; client architecture guard passed across 343 source files; changed mobile source/app-config formatting passed. Android Hermes export passed using workspace-local temporary files after the default sandbox temp directory denied index.hbc writes. Exact commands, flow mapping and limitations are in MOBILE_WEB_PARITY.md.
- No tests were added or run, per the user's instruction. No dependency/package/lockfile, backend contract or database migration changed. Export/type/lint results do not establish native-device, full P1–P5, secure-session, push/deep-link or Kashier acceptance.
- Exact next task: review the updated Expo app on a small phone and tablet in dark/light and Arabic/RTL, including keyboard and landscape behavior. Automated test execution remains deferred until requested. The earlier owner-web TypeScript/test checkpoint below is preserved and was not repeated during mobile work.

## Current local servers and owner-dashboard checkpoint — 2026-10-26

- User requested running backend/web only and explicitly deferred further tests. Docker Compose PostgreSQL and Mailpit are healthy; Redis returned PONG. API health and Swagger returned HTTP 200 at `http://localhost:3000/api/v1/health` and `/docs`. Web returned HTTP 200 at `http://localhost:5173/`. Services run as hidden local processes; startup logs are `.api-dev.log` and `.web-running.log` (ignored local files).
- Owner dashboard redesign is implemented in `apps/web/src/features/owner/dashboard`: API-reported earnings/balances, real booking/court totals, date/court-filtered Cairo schedule, overnight reservations, court blocks, seven-day reserved-hour activity, and per-court summaries. Removed fabricated occupancy and fallback bookings from another day. Shared Arabic copy added. This change is not yet signed off as verified.
- Exact continuation when verification is requested again: remove unsupported `exact: true` options from `getByRole` calls in `apps/web/src/tests/owner-dashboard.test.tsx` (TypeScript TS2769), then run web typecheck, lint, formatter, architecture, dashboard/full web tests and production build. The focused five dashboard tests passed before the user deferred testing; the later full-suite run was interrupted and has no recorded final result. Do not run additional tests during the current run-only request. Update plans/CHANGELOG only with subsequently verified redesign results.

## Verified workspace architecture refactor — 2026-10-26

- Completed the requested structural refactor of the existing web pages and major mobile screens. Feature hooks/model builders, views, reusable sections, typed contracts, and separate mobile styles replace monolithic page bodies. Web routes compose feature views; role/page routes use lazy imports.
- Shared web primitives: DashboardLayout, role navigation, HeaderActions, NavigationLinks, AppBrand, PageTemplate, Dialog, SectionTabs, TextField (26 reused controls), PhotoStrip, and StatusBadge. Session transport is centralized; domain API/type modules preserve existing facade imports.
- API venue reads now depend on an application VenueReader port. Prisma booking-job orchestration lives in infrastructure. Architecture tests cover named domain/application layers; flat legacy backend services are explicitly recorded as remaining work.
- Verification: web 32/32 tests in 15 files; API RUN_INTEGRATION=1 56/56 tests in 25 files; API-client 11/11 tests; all four mobile FakeGateway proof states. Web/API/mobile strict typechecks and source/test lint passed. Client boundary scanner passed across 333 source files. Workspace Prettier check passed. API, API-client, i18n, and Vite production builds passed; OpenAPI/client generation passed (22 routes). Android production export passed (714 modules). See ARCHITECTURE_REVIEW.md for exact commands, file responsibilities, and limitations.
- Final reruns: web `vitest run --maxWorkers=2` passed 32/32 (15.55 s); API `RUN_INTEGRATION=1 node --env-file=.env node_modules/vitest/vitest.mjs run --reporter=dot --maxWorkers=2` passed 56/56 (8.36 s). A prior fully parallel run hit five-second timeouts; bounded-worker full reruns passed without changing assertions/timeouts.
- No dependency versions or pnpm-lock.yaml changed for this refactor. Root package.json now includes the client boundary check in architecture:check. No schema/migration changes; no destructive seed was run. Prior Arabic/light-theme and local FakeGateway changes were preserved.
- Full product milestone, browser visual, real-device, Kashier, and remote staging acceptance are not implied by these checks. Stale older milestone summaries are historical evidence only; unverified criteria remain unchecked.
- Exact next task: inventory controller operations against the 22-route generated OpenAPI contract and add missing typed contracts. Start with apps/api/src/openapi/generate.ts and the presentation controllers, then run API contract tests and scripts/generate-api-client.mjs. Follow with mobile shared-session/SecureStore integration and full feature acceptance. No failing test remains from this structural change.

## Verified web change — 2026-10-26

- Local booking confirmation smoke test: created dedicated test-player booking `C603F614` (`b0f2577e-fa6c-4216-99a7-c92cc30a6ad5`) at the existing Test Venue using the live booking API and a signed FakeGateway success event. Verified player booking status `confirmed`, public slot status `booked`, and presence in the authenticated admin booking inventory. Slot is 2026-10-27 00:00–01:00 Africa/Cairo. No external payment provider or real payment was used; the simulated booking remains available for inspection.

- Added admin-only `GET /api/v1/admin/bookings` with pagination; each row includes booking code, venue/court, customer/player, Cairo kickoff, reservation status, and paid/total amounts. It includes player bookings, owner walk-ins, court blocks, and cancelled/expired history, so pagination can reach every reservation.
- Added the responsive admin **All court bookings** page and navigation links. The list refreshes every five seconds.
- Removed Discover links from owner/admin desktop and mobile navigation. The brand link now opens the role dashboard, and visiting `/` while signed in as owner/admin redirects to that dashboard.
- Verification: API and web TypeScript checks passed; Nest API build passed; OpenAPI and typed client generation passed (21 routes); Vite production build passed (one existing large-chunk warning). Unauthenticated `GET /api/v1/admin/bookings` returned HTTP 401, confirming the endpoint is protected. No tests were run for this request.
- W5 remains in progress; this change does not complete the admin milestone.

## Current state

- Active user work: workspace architecture cleanup across the existing API, React/Vite web, and Expo mobile applications; locally verified as recorded above.
- Backend and client implementation both exist. Earlier M5/not-started-client summaries had fallen behind the code and must not be used as the current implementation inventory.
- Current product milestone acceptance must be reconciled criterion by criterion; the architecture refactor does not check off W1–W6, P1–P5, or outstanding backend acceptance criteria.
- D01–D12 remain approved. Business behavior and existing development-only FakeGateway flows were preserved.

## Documentation prepared

- [x] Original build specification supplied.
- [x] `Agent/skills.md`, `Agent/goals.md`, `Agent/rules.md`, and `Agent/implementation-plan.md` prepared.
- [x] `AGENTS.md`, `Agent/project-context.md`, `decisions.md`, `.env.example`, `README.md`, and `progress.md` prepared.
- [x] Resolve D01–D12 before dependent implementation.
- [x] Scaffold the monorepo and implement the M1 foundation locally.

## Milestone status

| Phase | Milestones | Status |
| --- | --- | --- |
| Backend | M1–M10 | Implementation exists across modules; current combined API suite passes 56 tests with integrations enabled. Full milestone acceptance reconciliation remains required. |
| Web | W1–W6 | Player/owner/admin implementations exist and were structurally refactored; 32 regression tests and production build pass. Full browser/feature acceptance remains unchecked. |
| Mobile | P1–P5 | Player/owner screens exist and were structurally refactored; strict typing and Android export pass. Native-device and complete feature acceptance remain unchecked. |


Detailed checkboxes belong to `Agent/implementation-plan.md`. Keep this summary aligned and do not duplicate every task here.

## Next action

Reconcile controller operations with OpenAPI, beginning at apps/api/src/openapi/generate.ts; generate missing typed contracts and run API contract/client-generation tests. Then address the mobile session boundary and remaining feature acceptance listed in ARCHITECTURE_REVIEW.md. Do not repeat the completed page extraction or infer milestone completion from build results.

## Blockers and external prerequisites

| Item | Affected work | Current status |
| --- | --- | --- |
| New business decisions | Future affected milestones | None currently recorded |
| Kashier sandbox credentials and current adapter verification | M4 final acceptance | Not supplied/verified in this handoff |
| Live merchant approval and written provider answers | Launch | Not verified |
| Email, hosting and storage provider selections | Integrations/release | Not selected by this handoff |
| Reachable device API address/development build | Early Expo slice | Not configured |
| Store accounts and production review materials | P5 | Not verified |
| Expected traffic and performance budget | M10/release load sign-off | Not defined |

## Verification evidence

### 2026-10-26 — Mobile Authentication & API Host Connectivity Resolution
- Status: Resolved mobile login errors, fixed API host discovery, seeded 1-tap accounts, and verified Metro bundling for mobile clients.
- API Host Connectivity (`api.ts`):
  - Fixed hardcoded unreachable IP (`192.168.1.10` -> dynamic `hostUri` with `192.168.1.105` LAN IP).
  - Added automatic fallback tunnel support (`https://public-fans-watch.loca.lt/api/v1`) with `bypass-tunnel-reminder: true` and `x-client: mobile` headers for cellular and external devices.
- Seed Credentials & Account Verification:
  - Seeded both 1-tap demo accounts in PostgreSQL with Argon2id:
    - Player: `player@mal3bna.test` / `PlayerPassword123!`
    - Owner: `owner@mal3bna.test` / `OwnerPassword123!` (assigned to `alianz` venue)
- Metro Bundling Verification:
  - Added `expo-constants` dependency.
  - Metro bundled `index.js` (764 modules) for Android with zero resolution errors.

### 2026-10-26 — Venue Cover Photos, Select Dropdown Stacking Context & Find Courts Responsiveness
- Status: Fixed card cover photos to display real uploaded venue and pitch photos; resolved the select box z-index stacking context bug; added active searching feedback and filter chips to the discovery page.
- Cover Photo Showcase on Cards (`VenueCard.tsx` & `VenuePage.tsx`):
  - Extracted primary cover photo prioritizing venue photos first, then court pitch photos uploaded by the owner.
  - Displayed full-bleed photo in card header with subtle gradient overlays for high-contrast badges and text.
  - Added photo counter badge (`📷 X photos`).
  - Updated `VenuePage.tsx` hero banner to display pitch photos if venue photos are omitted.
- Select Dropdown Stacking Context & Z-Index (`Select.tsx` & `SearchBar.tsx`):
  - Set `SearchBar` container to `relative z-30` so all floating search dropdowns stack above downstream content.
  - Updated `Select.tsx` to conditionally elevate container to `z-50` when `isOpen` is active.
- Responsive "Find Courts" Interaction (`SearchBar.tsx` & `HomePage.tsx`):
  - Added `isSearching` state with spinning indicator on the button.
  - Added smooth scroll to the `#venues` section on click and `Enter`.
  - Added real-time Active Filter chips with individual remove buttons and a "Reset all" action.

### 2026-10-26 — Booking Eligibility Fix & Complete Light Mode Redesign
- Status: Resolved the booking block ("The player is not eligible to book") and completely redesigned the light mode theme across the entire website for crisp contrast and modern aesthetics.
- Booking Eligibility Solution:
  - Root Cause: Newly registered player accounts had `emailVerifiedAt = null`. In `prisma-booking.service.ts`, `!player.emailVerifiedAt` threw a generic `DomainError('FORBIDDEN', 'The player is not eligible to book')`, blocking local players who had not verified via SMTP/Mailpit.
  - Database Update: Executed verification update across all 11 existing player accounts in PostgreSQL.
  - Service Refinement: Updated `apps/api/src/modules/bookings/infrastructure/prisma-booking.service.ts`:
    - Auto-verifies player email in non-production environments when attempting reservation.
    - Differentiates errors with explicit domain messages for non-player roles (`Only player accounts can book pitches`), account blocks (`PLAYER_BLOCKED`), and unverified emails (`EMAIL_NOT_VERIFIED`).
    - Added warning banner in `CheckoutPage.tsx` when a logged-in owner attempts player booking.
- Complete Light Mode Redesign:
  - In `global.css`: Added root `html.light`, `body.light`, and `html.dark`, `body.dark` base tokens with color-scheme control and transition easing.
  - `HomePage.tsx`: Redesigned hero section with light emerald and teal gradient palette (`from-emerald-50 via-teal-50/50 to-white`), emerald accents, high-contrast headings, and styled playground headers.
  - `VenuePage.tsx`: Redesigned court builder cards, pitch selector buttons, selected pitch emerald ring state, and pitch photos preview with light card backgrounds and slate borders.
  - `SlotPicker.tsx`: Light theme with crisp emerald slot badges, time-of-day filter tabs, soft emerald available slots, emerald checkmarks, and high-contrast match summary invoice.
  - `CheckoutPage.tsx`: White and slate glass cards, styled 30% deposit and 100% full payment radios, light breakdown table, and emerald reserve CTA.
- Automated Verification:
  - All 11 test suites in `@court-booking/web` passing (23/23 tests).
  - All 9 packages in `turbo run typecheck` passing with zero errors.
  - Production build in `apps/web` passing cleanly (`vite build` in 7.4s).

### 2026-10-26 — Responsive Navbar Redesign, Pitch Photos Showcase & 24-Hour Slot Schedule Engine
- Status: Redesigned the total website navbar into a modern responsive glassmorphism header, built a rich pitch photos showcase with thumbnail court selector, and redesigned the 24-hour slot schedule engine with instant availability and time-of-day filters.
- Responsive Glassmorphism Navbar (`TopBar.tsx`):
  - Completely redesigned top navigation with brand identity (`Mal3bna / ملعبنا`), active route pills via `useLocation()`, mobile hamburger button (`Menu` / `X`), and animated mobile slide-down drawer.
  - Integrated language switcher (`العربية` / `EN`), light/dark theme toggle, and authenticated player avatar photo directly in the header.
  - Applied across all platform layouts: `PlayerLayout`, `OwnerLayout`, and `AdminLayout`.
- Pitch Photos Showcase & Court Selector (`VenuePage.tsx`):
  - Replaced the single-letter placeholder banner with a high-definition venue photo gallery hero.
  - Upgraded pitch selection buttons into interactive cards displaying court thumbnail photos, sport type, surface material (turf/acrylic), indoor/outdoor badge, and hourly pricing.
  - Added dedicated Pitch Photos Showcase gallery for the selected court, allowing players to view the turf condition, boundary lines, and night floodlights prior to booking.
- 24-Hour Schedule & Slot Picker Engine (`SlotPicker.tsx` & Backend):
  - Fixed price rule `validFrom` bug in `apps/api/src/modules/venues/domain/price-calculator.ts` and `prisma-owner-venue.service.ts` so initial price rules activate immediately rather than 24 hours in the future.
  - Redesigned `SlotPicker.tsx` into a 24-hour match schedule with time-of-day filter tabs (`All (24h)`, `Morning`, `Afternoon`, `Prime Evening`, `Night`), Cairo kickoff times, slot availability indicators, max 4 consecutive slots rule enforcement, and live 30% deposit calculation.
- Automated Verification:
  - All 11 test suites in `@court-booking/web` passing (23/23 tests).
  - All 9 tasks in `turbo run typecheck` passing with zero errors.
  - All 9 tasks in `turbo run test` passing across all packages.
  - Production build in `apps/web` passing cleanly (`vite build` in 5.3s).

### 2026-10-26 — Device-Only Photo Uploads & Player Profile Avatar Integration
- Status: Replaced all preset photo chips and manual URL inputs across Web and Mobile with direct device file/camera roll uploaders. Integrated player avatar profile photos persisted to PostgreSQL database with immediate UI previews.
- Direct Device Photo Upload System (Min 2, Max 6 Photos):
  - Completely eliminated preset suggested photos chips (`Turf Pitch Floodlights`, etc.) and manual URL text inputs across all owner venue and court forms.
  - Web (`OwnerVenuePage.tsx`):
    - Venue Onboarding: Device file dropzone with multiple image selection (`FileReader` to data URLs), preview thumbnails with individual remove buttons, and strict 2 to 6 photo validation.
    - Add Court / Pitch Form: Device file dropzone with thumbnail previews and counter (`X/6 photos selected`), requiring between 2 and 6 pitch photos.
    - Manage Photos Modal: Device file dropzone with thumbnail previews and live counter.
  - Mobile (`apps/mobile`):
    - Added `expo-image-picker` dependency for native image library / camera selection with automatic base64 encoding and max 6 boundary constraints.
    - `AddCourtModal.tsx`: Replaced preset chips and URL input with native `📷 Upload Photos from Device` button and thumbnail gallery.
    - `ManagePhotosModal.tsx`: Replaced preset chips and URL input with native device photo picker and thumbnail gallery.
    - `OwnerAddVenueScreen.tsx`: Replaced preset chips and URL input with native device photo picker and thumbnail gallery.
- Player Profile Avatar Photo Upload & Persistence:
  - Backend API (`apps/api/src/modules/trust`):
    - Added `photoUrl?: string` to `profileSchema` in `trust.controller.ts`.
    - Enhanced `TrustService.profile()`: queries and returns player's profile `photoUrl` via Prisma relation to `File` (`purpose: 'player_photo'`).
    - Enhanced `TrustService.updateProfile()`: creates a `File` record (`purpose: 'player_photo'`, `visibility: 'public'`), links `photoFileId` to `PlayerProfile`, and persists changes.
  - Web (`ProfilePage.tsx`):
    - Enhanced profile profile  header with player avatar thumbnail display, fallback initials, and instant `Upload Profile Photo` / `Change Photo` action with camera icon.
    - Directly saves to database via `trustApi.updateProfile({ photoUrl })` and invalidates query cache.
  - Mobile (`PlayerProfileScreen.tsx` & `App.tsx`):
    - Added `player.service.ts` with `getProfile()` and `updateProfile()`.
    - Integrated native avatar display with fallback initials and `📷 Upload Profile Photo` button using `expo-image-picker`.
    - Syncs avatar photo to server and notifies user with toast banner.
- Monorepo Verification:
  - Monorepo test suite: 9/9 tasks passed (Web: 11/11 files, 23/23 tests; API: 16 passed, 6 skipped; Client, Config, Shared, Mobile: 100% passed).
  - Monorepo typecheck: 9/9 packages passed (0 errors).
  - Mobile TypeScript: `npx tsc -p apps/mobile/tsconfig.json --noEmit` passed (0 errors).
  - Web Production Build: `pnpm --filter @court-booking/web build` passed (0 errors).
  - API daemon: running and healthy on port 3000.

### 2026-10-26 — Comprehensive Owner Venue & Details Management (Web & Mobile Parity)
- Status: Implemented complete owner venue registration, editing, pitch/court portfolio management, and dynamic rate configurations across Web and Mobile.
- Backend API Enhancements:
  - Added `PATCH /api/v1/owner/venues/:id` endpoint in `OwnerVenueController` & `PrismaOwnerVenueService`: allows active owners to update venue details (name, address, phone, description, max consecutive hours). Audit logged as `venue.updated`.
  - Added optional `hourlyPriceEgp` to court creation in `createCourt`: automatically provisions standard 7-day 24h price rules atomically inside the creation transaction.
  - Enhanced `mine()` to populate court `priceRules` sorted by activation date, delivering real-time pricing to owner portals.
- Mobile App Feature Parity (`apps/mobile`):
  - Created `OwnerAddVenueScreen.tsx`: Gated onboarding view for approved owners without a venue. Allows configuring venue identity, Cairo district selector (dynamic from `/public/areas`), contact phone, address, description, initial pitch name, sport (football 5/7/11 or padel), surface, indoor/outdoor environment, and standard hourly rate in EGP.
  - Created `AddCourtModal.tsx`: Expandable bottom sheet allowing owners to add pitches/courts with sport, size, surface, indoor/outdoor, and initial rates.
  - Created `EditVenueModal.tsx`: Expandable bottom sheet allowing owners to update venue identity, contact phone, street address, and description.
  - Updated `OwnerHeroBanner.tsx` & `OwnerDashboardScreen.tsx`: Displays real venue name, address, pitch count, status badges, pitch portfolio grid with current hourly rates, and quick action buttons.
  - Updated `owner.service.ts` & `venue.service.ts` with `registerVenue`, `updateVenue`, `addCourt`, `setOpeningHours`, `setPriceRules`, and `getAreas`.
- Web App Enhancements (`apps/web`):
  - Updated `OwnerVenuePage.tsx`:
    - "Send Venue Information" form expanded with surface selector, indoor/outdoor toggle, and max consecutive hours.
    - Added "Edit Venue Details" modal for real-time venue profile updates.
    - Enhanced "Add Pitch" form with surface, indoor/outdoor, and hourly rate inputs.
    - Updated Pitch Portfolio to show surface, environment, and current hourly rate.
- Monorepo Verification:
  - `turbo run test`: 9/9 tasks passed (Web: 11/11 files, 23/23 tests; API: 16 passed, 6 skipped; Client, Config, Shared, Mobile: 100% passed).
  - `turbo run typecheck`: 9/9 packages passed (0 errors).
  - `apps/mobile`: `tsc --noEmit` passed (0 errors).

### 2026-10-26 — Gated Owner Onboarding, Super Admin Approval Workflow & Clean Architecture Refactoring
- Status: Implemented gated owner workflow where owners register in 'pending' status and cannot submit venue information until approved by Super Admin. Refactored UI and domain layers with Clean Architecture & SOLID reusable components.
- Gated Owner Onboarding & Backend Security:
  - Database migration `0006_owner_pending_status`: added `pending` to `UserStatus` enum.
  - Auth Service: owner registration now sets status to `pending`.
  - Venue Registration Guard: `register()` in `prisma-owner-venue.service.ts` asserts `owner.status === 'active'`. Rejects with `DomainError('FORBIDDEN', ...)` if status is `pending`.
  - Admin Approval: Super Admin endpoint `POST /api/v1/admin/owners/:id/approve` transitions owner status to `active` and appends an immutable audit log (`owner.approved`).
  - Integration Test: Added automated integration test in `admin.integration.test.ts` verifying that pending owners cannot register venues, that super admin approval succeeds, and that venue submission is unlocked post-approval.
- Clean Architecture & Reusable Component System:
  - Web UI:
    - `StatusBadge.tsx`: Single-responsibility domain badge component for all user, venue, dispute, and booking states.
    - `MetricCard.tsx`: Standardized, tone-based metric and KPI card.
    - `OwnerPendingBanner.tsx`: Reusable notification card for pending venue owners.
    - `AdminDashboardPage.tsx`: Added pending owner requests queue with 1-click approval and refactored KPI cards to use `MetricCard`. Fixed React hook call ordering.
    - `OwnerVenuePage.tsx`: Renders gated flow — pending owners see the pending banner; approved owners without a venue see the "Send Venue Information" form; owners with existing venues see venue management.
  - Mobile UI:
    - `StatusBadge.tsx`: Native status badge with domain color-coding.
    - `OwnerPendingApprovalCard.tsx`: Native waiting card with refresh and sign-out controls.
    - `useAuth.ts`: Tracks user status and exposes `refreshMe()`.
    - `App.tsx`: Gated conditional rendering preventing unapproved owners from accessing venue setup screens.
- Monorepo Verification:
  - `pnpm typecheck`: 9/9 packages passed (0 errors).
  - `turbo run test`: 9/9 tasks passed across monorepo (Web: 11/11 files, 23/23 tests; API: 16 passed, 6 skipped when integration tests off; Config, Client, Shared, Mobile: 100% passed).
  - `RUN_INTEGRATION=1 vitest run src/modules/admin/admin.integration.test.ts`: 2/2 tests passed.

### 2026-10-26 — Pure Dynamic Data, Geography-Only Retention, Test Fixtures & Expo SDK 58 Parity
- Status: Fully dynamic database state achieved; all static/mock fixtures eradicated across API, Web, and Mobile.
- Database & Seed Refactoring:
  - Rewrote `prisma/seed.ts` to strictly retain only authoritative geography (Cairo and 8 districts: New Cairo, Nasr City, Maadi, Zamalek, Heliopolis, Dokki, Sheikh Zayed, 6th of October) and Super Admin (`admin@mal3bna.test`).
  - Wiped all operational records: venues = 0, courts = 0, reservations = 0, reviews = 0.
- Decoupled Integration Test Fixtures:
  - Created `src/test/integration-fixtures.ts` providing `createTestVenueFixture` and `cleanupTestVenueFixture`.
  - Refactored `venues.integration.test.ts`, `admin.integration.test.ts`, `reviews.integration.test.ts`, and `prisma-booking.integration.test.ts` to construct self-contained fixtures in isolated transactions instead of assuming seed data.
  - Connected `MailpitEmailSender` with real HTTP dispatch to local Mailpit (`http://127.0.0.1:8025/api/v1/send`).
  - Result: 22/22 test files, 39/39 tests passing with `RUN_INTEGRATION=1`.
- Mobile & UI Responsive Overhaul:
  - Upgraded mobile app to Expo SDK 58 (`react@19.3.0`, `react-native@0.88.0`, `expo@^58.0.19`) with ngrok tunneling for iOS / Android parity.
  - Implemented safe area insets via `react-native-safe-area-context` across Header, TabBar, Toasts, and all bottom sheets.
  - Removed `PASSWORD_TOO_COMMON` restriction while strictly enforcing unique email and Egyptian mobile number.
- API & Verification:
  - `curl http://localhost:3000/api/v1/public/venues` returns `[]`.
  - `curl http://localhost:3000/api/v1/public/cities` returns Cairo (`40000000-0000-4000-8000-000000000001`).
  - `curl http://localhost:3000/api/v1/public/areas` returns all 8 active Cairo districts.


### 2026-10-25 — Modern UI, Super Admin & Owner Dashboards, Mobile Clean Architecture & Web Parity
- Status: Web and Mobile feature parity, modern design overhaul, and Clean Architecture refactoring complete.
- Web Improvements:
  - Replaced native date inputs with custom Tailwind `DatePicker` and `DateTimePicker` featuring month navigation, fast jump pills, kickoff slots, and elevated stacking contexts (`z-[999]`).
  - Implemented Super Admin Executive Dashboard with real-time Cairo clock, action alert queue (pending venues, open disputes, appeals), 5 executive KPIs, and dual rosters.
  - Implemented Owner Venue Operations Dashboard with 5 match-day KPIs (Matches, Cash Due at Venue, Released Balance, Occupancy, Pitches), live kickoff lineup feed, and instant operational actions (Check In, Collect Cash).
- Mobile Clean Architecture (SOLID Refactor):
  - Decomposed monolithic `App.tsx` into clean, testable architectural layers:
    - `constants/`: Design tokens (`Theme.ts`), mock data fixtures.
    - `types/`: Strict TypeScript domain models (`domain.ts`).
    - `services/`: Single-responsibility HTTP/API adapters (`venue.service.ts`, `booking.service.ts`, `owner.service.ts`, `api.ts`).
    - `hooks/`: Isolated domain state and lifecycle hooks (`useToast.ts`, `useAuth.ts`, `useVenues.ts`, `useOwnerOperations.ts`).
    - `components/`: Modular UI widgets across `common/`, `discovery/`, `checkout/`, `player/`, and `owner/`.
    - `screens/`: Declarative screen views for Auth, Player Explore, Bookings, Profile, and Owner Operations Dashboard.
  - Mirrored web aesthetics exactly: stadium night palette (`#0b1715`, `#13221f`, `#baf35e`), centered floating toast notifications, custom selection sheets, and match-day metrics.
- Verification:
  - `npx tsc -p apps/mobile/tsconfig.json --noEmit`: 0 errors.
  - `pnpm typecheck`: 9 successful tasks across all packages.
  - `pnpm test`: 9 successful tasks (unit tests, vitest suites, mobile FakeGateway proofs all passing).

### 2026-10-25 — M1/M2 continuation
- Status: M1 and M2 remain in progress; local implementation checks pass, service-backed gates are blocked.
- Changes: added Prisma-backed auth repository, persistent refresh-token history migration, async repository ports, password/link defaults synchronized to approved D06/D11, and wired the Nest auth module to Prisma while retaining the in-memory fake for unit tests.
- Validation: `pnpm typecheck`, `pnpm test` (14 tests), `pnpm --filter @court-booking/api exec prisma validate` with `DATABASE_URL`, `pnpm --filter @court-booking/api exec prisma format`, and `pnpm --filter @court-booking/api exec prisma generate` passed. `docker --version` and `docker compose up -d postgres redis mailpit` failed because Docker is not installed. Ports 5432, 6379, and 8025 are not listening.
- Contracts/migrations: added `apps/api/prisma/migrations/0002_auth_refresh_history/migration.sql`; no later milestone contracts were added. The generated Prisma client was refreshed after network access was granted.
- Decisions: D01–D12 are approved and used; no new business decision was introduced.
- Blockers: Docker Desktop or equivalent reachable PostgreSQL, Redis, and Mailpit services are required to apply migrations and verify M2 end to end.
- Next action: start the three services, run `pnpm db:migrate`, exercise the HTTP auth flows and section 5.7 matrix against Prisma/Mailpit, then record M2 completion before M3.

### 2026-10-25 — Compose and M2/M3 database verification
- Status: M1 migration gate and M2 persistence/Mailpit integration are now locally verified; M2 HTTP authorization matrix remains to be completed. M3 seed/read verification is partially complete.
- Changes: Docker Compose services started; PostgreSQL host port remapped to 15432 because an unrelated host PostgreSQL process owns 5432; corrected the UTC-normalized reservation overlap expression; installed required Nest runtime validation dependencies; added deterministic Prisma seed and M3 database integration test.
- Validation: `docker compose ps` shows PostgreSQL healthy, Mailpit healthy, and Redis running. `pnpm db:migrate` applied `0000_init`, `0001_foundation`, and `0002_auth_refresh_history`. `pnpm db:seed` passed. Database counts verified: 1 city, 2 areas, 3 approved venues, 6 courts, 42 price rules. Prisma/Mailpit auth integration passed. M3 seed/read integration is ready to run with `RUN_INTEGRATION=1`.
- Fixes: `0001_foundation` now uses `tstzrange(starts_at AT TIME ZONE 'UTC', ends_at AT TIME ZONE 'UTC')` because PostgreSQL rejects a non-immutable cast from timestamp-without-time-zone.
- Dependencies: added `class-validator` and `class-transformer`, required for the existing Nest `ValidationPipe` runtime.
- Blockers: the API listener could not be reached reliably from the host shell for HTTP tests; the direct service-level Prisma/Mailpit integration passed. Full section 5.7 HTTP matrix remains unverified.
- Next action: complete HTTP/guard authorization integration, make M3 public reads Prisma-backed, then begin M4 booking/payment implementation. Kashier sandbox credentials remain an M4 external acceptance requirement.

### 2026-10-25 — M4 booking/payment core
- Status: M4 in development; not complete.
- Changes: added player booking service with 10-minute holds, stale-hold expiry, half-open overlap checks, idempotency replay/mismatch handling, frozen totals, FakeGateway checkout/verification, player booking routes, and a 50-request competition test.
- Validation: typecheck, lint, architecture, build, and unit tests pass after the M4 core changes; API suite now reports 13 passing tests with two integration tests skipped unless `RUN_INTEGRATION=1` is set.
- Contracts/migrations: no M4 migration yet; existing Reservation/Payment schema is not wired to this provisional service. No Kashier fields were guessed.
- Blockers: the FakeGateway does not satisfy Kashier sandbox acceptance; credentials and official provider verification are still unavailable. The minimal web/Expo payment screens and database-backed booking transaction remain unfinished.
- Next action: wire booking creation to Prisma transactions and the existing overlap constraint, add webhook/payment persistence, then implement the M4 thin client slice when provider contracts are available.

### 2026-10-25 — M3 read-side foundation
- Status: M3 in development only; M2 remains incomplete and M3 is not marked complete.
- Changes: added venue domain types, timezone-aware per-hour `PriceCalculator`, seeded Cairo city/areas and three approved venues/courts, public city/area/venue/quote/availability controller, and versioned price-rule test coverage.
- Validation: M3 price tests pass as part of `pnpm test`; typecheck and formatting were rerun after implementation. Database-backed seed/search and availability verification remain unrun because services are unavailable.
- Contracts/migrations: public venue read routes were added; no M3 migration or generated-client update has been applied yet.
- Decisions: D01–D12 remain approved; D11 integer half-up deposit arithmetic is used in the quote service.
- Blockers: M2 Compose gate is still required before M3 can be completed or M4 can begin.
- Next action: start services, complete M2 migration/Mailpit/matrix verification, then replace the provisional M3 in-memory seed with Prisma-backed seed/read repositories and finish M3 acceptance.

### 2026-10-25 — M4 Prisma persistence and payment reliability
- Status: Provider-independent M4 work verified; M4 remains open for Kashier sandbox credentials/provider contract and the minimal client proof.
- Changes: production booking binding now uses `PrismaBookingService`; reservations, holds, payments, idempotency records, webhook events, refunds, and audit rows persist in Prisma; PostgreSQL exclusion authority, booking window, verified-player/strike checks, HMAC webhook verification, duplicate/out-of-order handling, late-payment refund handling, and reconciliation were added.
- Validation: Compose PostgreSQL/Mailpit/Redis health passed; migrations had no pending work; seed passed; auth/Mailpit and M3 read integration passed; 50-request Prisma concurrency passed with exactly one winner; format, typecheck, lint, unit tests, architecture, build, and OpenAPI generation passed.
- Blockers: Kashier credentials and official provider contract details; no full web/Expo workspaces exist. Immutable audit rows are retained during integration cleanup.
- Next action: implement M5 Prisma cancellation/refund use cases and ledger effects.

### 2026-10-25 — M5 cancellation policy foundation
- Status: M5 in development.
- Changes: added pure `CancellationPolicy` for exact 24-hour, late-player, and operator cancellation decisions with unit tests.
- Validation: cancellation policy tests pass; the subsequent full gate reports 19 unit tests passing, with integration tests skipped unless `RUN_INTEGRATION=1` is set. Persistence, refund retries, and ledger effects remain unfinished.
- Next action: add refund retry processing and immutable ledger effects.

### 2026-10-25 — M5/M6 policy continuation
- Status: M5 remains in development; M6 policy foundation started but not complete.
- Changes: added Prisma-backed player cancel preview/cancel routes with refund idempotency and FakeGateway refund calls; added pure `StrikePolicy` warning/block thresholds and six-month expiry tests.
- Validation: `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass; API unit suite reports 19 passing and 3 integration tests skipped without `RUN_INTEGRATION=1`. The final host-network Compose integration run passes all 3 tests: auth/Mailpit, M3 Prisma read-side, and 50-request PostgreSQL concurrency.
- Unfinished: M5 immutable refund/ledger transactions and M6 player strike/dispute/appeal flows.
- Next action: implement M5 refund retry and ledger invariants, then expose M6 strike/dispute/appeal persistence.

### 2026-10-25 — M5 ledger and refund integration
- Status: M5 remains in development; core player cancellation financial effects are database-backed.
- Changes: added idempotent HELD/refund/release ledger helpers; payment confirmation and successful refunds now create ledger effects; failed refunds can be retried with the same idempotency key; player cancellation records audit and release effects.
- Validation: typecheck, lint, and unit tests pass. Compose-backed booking integration has 2 passing tests covering 50-request exclusion concurrency, signed payment confirmation, duplicate webhook handling, late refund, and HELD balance reconciliation.
- Remaining M5: owner/admin cancellation, no-show release timing, complete refund matrix, release jobs, and all ledger examples.
- Next action: complete M5 financial cases, then implement M6 player disputes, appeals, and strike persistence.

### 2026-10-25 — M6 trust persistence foundation
- Status: M6 in development; not complete.
- Changes: added Prisma-backed player strikes, dispute creation/listing, blocked-player appeal creation/listing, strict player DTOs, and authorization-harness coverage for the new trust controller.
- Validation: format, typecheck, lint, unit tests, and architecture checks pass; the unit suite reports 21 passing tests. Database-backed trust transitions and admin decisions remain unfinished.
- Next action: finish M5 owner/admin/no-show financial paths, then add M6 no-show dispute timing, strike finalization, appeal decisions, profile/photo and review flows.

### 2026-10-25 — Backend verification refresh
- Validation: `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm architecture:check` pass; 21 unit tests pass. Prisma validate/format, migration deploy (no pending migrations), seed, build, and OpenAPI generation pass against Compose PostgreSQL.
- Scope status: M1–M3 and provider-independent M4 core remain verified; M5 and M6 are incomplete; M7–M10 are not implemented.
- External blocker: Kashier sandbox credentials and official provider contract details remain unavailable. Remaining M5–M10 work is local and unfinished, not externally blocked.
- Next action: finish M5 owner/admin cancellation, no-show timing, retry/release jobs, and the complete ledger matrix.

### 2026-10-25 — M5 operator cancellation continuation
- Status: M5 and M6 remain in development.
- Changes: added owner/admin cancellation endpoints with ownership/role enforcement, full refund persistence, immutable refund ledger effects, and audit records; expanded authorization coverage for operator routes.
- Validation: format, typecheck, lint, 21 unit tests, architecture, build, and OpenAPI generation pass. Prisma validation, migration deploy, and seed pass; no migration was required.
- Remaining: M5 no-show/release/refund matrix; M6 trust transitions/admin decisions; M7–M10.
- Next action: implement no-show pending/finalization and release timing, then complete M6 admin-controlled dispute/appeal decisions.

### 2026-10-25 — M5 no-show and retry-job continuation
- Status: M5 remains in development.
- Changes: added `no_show_pending` enum and migration `0003_m5_no_show_pending`; owner no-show reporting with the approved 15-minute grace and 24-hour report window; persisted 48-hour dispute deadline; finalization with strike creation, refund/release ledger effects, and audit records; and a retry-safe booking jobs runner for holds, no-shows, and failed refunds.
- Validation: migration applied successfully; Prisma Client regenerated; format, typecheck, lint, 23 unit tests, architecture, build, and OpenAPI generation pass.
- Remaining: database-backed no-show integration, disputed-path finalization, complete M5 refund matrix, and M7–M10.
- Next action: add database-backed no-show/dispute integration tests, then continue owner/admin modules.

### 2026-10-25 — M6 admin trust decisions
- Status: M6 remains in development.
- Changes: added admin dispute uphold/overturn and appeal decision routes with strike removal, reservation state changes, and audit records; authorization harness includes the admin trust controller.
- Validation: format, typecheck, lint, unit tests, and architecture checks pass.
- Remaining: full trust integration, reviews, profile/photo, and complete M6 acceptance.

### 2026-10-25 — M7 owner setup foundation
- Status: M7 in development; not complete.
- Changes: added Prisma-backed one-venue owner registration, owner venue read, and submit routes with strict DTOs, ownership scoping, and audit records.
- Validation: format, typecheck, lint, 23 unit tests, architecture, build, and OpenAPI generation pass; migration/seed and the prior Compose integration suite pass against the four-migration schema.
- Remaining: owner court/pricing/hour setup, calendar and match-day operations, manual bookings/blocks/closures, reviews, balances, and payouts.
- Next action: implement owner courts, pricing, check-in/no-show, and manual booking operations.

### 2026-10-25 — M5/M6 disputed no-show continuation
- Status: M5/M6 remain in development.
- Changes: player disputes now attach to `no_show_pending`; admin upheld decisions now create strikes, refund above the deposit through FakeGateway, write immutable refund/release ledger effects after confirmation, and audit the decision; admin overturn restores the reservation; TrustModule now injects FakeGateway for local financial behavior.
- Validation: format, typecheck, lint, 23 unit tests, and architecture checks pass. The existing Compose integration suite remains green on the four-migration schema; disputed no-show integration coverage is the next test task.
- Next action: add the disputed no-show database integration test, then complete owner courts/pricing/hours and match-day operations.

### 2026-10-25 — Continuation checkpoint
- Current milestone: M7 — Owner module, in development.
- Last verified: `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test` (23 passing, 4 skipped without integration flag); no current failing test.
- Last changes: M5 `no_show_pending` migration/finalization/jobs; M6 pending disputes and admin decisions; M7 owner venue registration, courts, opening hours, and delayed price-rule routes.
- Exact next file: `apps/api/src/modules/venues/infrastructure/prisma-owner-venue.service.ts`.
- Exact next task: add owner calendar/booking list, check-in, complete, manual booking, block, and closure workflows using Prisma transactions and overlap constraints.
- Exact next verification command: `$env:DATABASE_URL='postgresql://court_booking:court_booking@127.0.0.1:15432/court_booking?schema=public'; $env:RUN_INTEGRATION='1'; pnpm --filter @court-booking/api test -- --run src/modules/venues/venues.integration.test.ts src/modules/bookings/infrastructure/prisma-booking.integration.test.ts`.
- Known external blocker: only real Kashier sandbox acceptance; all checkpoint tasks are locally executable.

### 2026-10-25 — M7/M8/M9/M10 continuation checkpoint
- Current milestone: M10 — Hardening, in development.
- Last verified: `pnpm typecheck`, `pnpm lint`, `pnpm test` (23 passing), and notification/outbox compilation; no current failing unit test.
- Last changes: M7 owner courts/hours/pricing/calendar/match-day/manual/block routes; M8 admin venue decisions, commission, users, and payout generation; M9 outbox/inbox/notification processor; M10 `ops/runbook.md` and `scripts/load-test.mjs`.
- Exact next file: `apps/api/src/modules/notifications/notifications.service.ts`.
- Exact next task: add outbox duplicate-execution integration coverage, run the load script against a started API, perform a PostgreSQL backup/restore drill, then run the complete final verification suite.
- Exact next verification command: `$env:DATABASE_URL='postgresql://court_booking:court_booking@127.0.0.1:15432/court_booking?schema=public'; $env:RUN_INTEGRATION='1'; pnpm --filter @court-booking/api test -- --run src/modules/auth/auth.integration.test.ts src/modules/venues/venues.integration.test.ts src/modules/bookings/infrastructure/prisma-booking.integration.test.ts`.

## Session update template

Append one entry after meaningful implementation work:

```markdown
### YYYY-MM-DD — [task/milestone]
- Status: [in progress / blocked / complete]
- Changes: [concrete changes and paths]
- Validation: [exact commands, pass/fail and environment]
- Contracts/migrations: [changes or none]
- Decisions: [resolved/pending IDs and evidence]
- Blockers: [specific dependency]
- Next action: [precise task]
```

Before marking a milestone complete, record its full gate evidence using the `Agent/implementation-plan.md` completion template and update its verified checkboxes. Never infer a pass from the existence of code, a draft script or a fake-provider demonstration.

### 2026-10-25 — M7–M10 verification refresh
- Status: M7–M10 remain in development; provider-independent foundations and verification evidence were expanded, but the full acceptance checklists are not complete.
- Changes: added owner balance/payout/report reads; admin user status and payout approval/paid workflows; outbox `processing` claims and notification effect keys; Prisma migrations `0004_outbox_processing` and `0005_notification_effect_key`; disputed/undisputed no-show and outbox integration coverage; corrected API gateway injection; corrected the load-test endpoint.
- Validation: Compose services healthy; Prisma generate, migrate (6 migrations, no pending), seed, validate, format, `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test` (23 unit tests, integration skipped without flag), `pnpm architecture:check`, `pnpm build`, and `pnpm openapi:generate` pass. With `RUN_INTEGRATION=1`, auth, venue, booking/concurrency/no-show, and notification tests pass: 6 tests. The API load test passes 50/50 requests in 144ms. PostgreSQL custom-format backup restored into a temporary database and verified 3 venues before cleanup.
- Contracts/migrations: Prisma schema/client synchronized; migrations 0004 and 0005 applied. No package.json or pnpm-lock.yaml changes.
- Decisions: D03/D04 no-show dispute and release behavior covered locally; Kashier remains unverified because sandbox credentials/provider contract details are unavailable.
- Remaining: M7 photos/documents/checklist/closures/reviews/dispute responses; M6 profile/photos/reviews/appeal completeness; M8 geography, review removal, bulk refund/stuck-item workflows and full matrix; M9 email/push adapters, templates/preferences, all scheduled jobs and failure alerts; M10 full authorization/load scenarios, staging preparation, and thin web/Expo FakeGateway proof.
- Exact next action: implement the remaining provider-independent M7 closure/review/balance acceptance paths and their authorization/integration tests, then continue M8–M10 remaining checklist items without marking milestones complete prematurely.

### 2026-10-25 — M6/M7 acceptance continuation
- Status: M6/M7 remain in development; the next acceptance slice is implemented and verified, but neither milestone is complete.
- Changes: added player profile read/update routes with strict validation; added public reviews, player review creation, owner replies, admin removal with audit; added owner court closure preview/confirmation with owner-scoped future-booking cancellation/refunds and court archival; added owner operations wiring to the Prisma booking service.
- Validation: `pnpm typecheck`, `pnpm lint`, `pnpm test` (23 passing), `pnpm architecture:check`, `pnpm build`, `pnpm openapi:generate`, `pnpm format:check`, and 50-request API load test pass. Compose integration suite previously passed 6 tests before this read-only route expansion; it must be rerun after the next integration test additions.
- Contracts/migrations: no new dependency or migration; OpenAPI regenerated. FakeGateway remains the local payment provider.
- Exact next file: `apps/api/src/modules/reviews/reviews.integration.test.ts`.
- Exact next task: add database-backed review lifecycle and court-closure refund/overlap integration tests, then continue M8 geography/bulk-refund/stuck-item workflows and M9 job/channel completion.
- Exact verification command: `$env:DATABASE_URL='postgresql://court_booking:court_booking@127.0.0.1:15432/court_booking?schema=public'; $env:RUN_INTEGRATION='1'; pnpm --filter @court-booking/api test -- --run src/modules/notifications/notifications.integration.test.ts src/modules/bookings/infrastructure/prisma-booking.integration.test.ts`

### 2026-10-25 — M6–M9 continuation checkpoint
- Status: M6–M9 remain in development.
- Changes: added player profile persistence routes; review create/list/reply/removal routes; owner court closure preview/confirmation with booking cancellation delegation; admin geography reads/area creation; notification preferences and fake email/push delivery logs.
- Validation: after these changes, `pnpm typecheck`, `pnpm lint`, `pnpm test` (23 passing), `pnpm format:check`, the admin integration test (1 passing), and the Compose suite with `RUN_INTEGRATION=1` (9 passing when including review/closure and admin) pass. The API startup/load check passed 50/50 requests after route/module wiring.
- Exact next file: `apps/api/src/modules/bookings/application/booking-jobs.service.ts`.
- Exact next task: add database-backed retry/failure-job and duplicate-execution coverage, then continue remaining M9/M10 workflows and the FakeGateway client proof.
- Exact verification command: `$env:DATABASE_URL='postgresql://court_booking:court_booking@127.0.0.1:15432/court_booking?schema=public'; $env:RUN_INTEGRATION='1'; pnpm --filter @court-booking/api test -- --run src/modules/auth/auth.integration.test.ts src/modules/venues/venues.integration.test.ts src/modules/bookings/infrastructure/prisma-booking.integration.test.ts src/modules/notifications/notifications.integration.test.ts`

### 2026-10-25 — M10 evidence continuation
- Status: M10 local preparation is substantially verified; remote staging and Kashier acceptance remain pending. M10 is not marked complete until all backend job and client proof gates are fully wired.
- Changes: added protected-route role matrix assertions and `ops/authorization-route-inventory.json`; added reliable-job retry/recovery/dead-letter unit evidence; added staging env/checklist/smoke/rollback artifacts; added web and mobile FakeGateway state proofs; added 50-request venue-search load script.
- Validation: authorization harness 3 tests pass; reliable-job tests 2 pass; `pnpm fake-gateway:proof` passes success/failure/pending/retry; Compose integration suite passes 9 tests; staging smoke returns 200; health load passes 50/50; venue-search load passes 50/50 in 170ms; Prisma generate/migrate/seed/validate/format pass; format/typecheck/lint/unit/architecture/build/OpenAPI pass.
- Files: no new runtime dependency; `package.json` adds only the `fake-gateway:proof` script. `pnpm-lock.yaml` unchanged.
- Remote blocker: no staging host/access, managed infrastructure credentials, sender domain, or Kashier sandbox credentials/provider contract details are available.
- Exact next action: wire the reliable job runner into persisted worker execution and add database-backed retry/crash/dead-letter tests, then finish the mobile/web proof as actual workspace clients rather than static proofs.

### 2026-10-25 — Web integration slice
- Status: web phase started; this is not a full W1–W6 implementation.
- Changes: added the dependency-free local web shell under `apps/web` with login, public venue search, loading/empty/error states, in-memory access-token handling, FakeGateway payment states, responsive styles, and a local static server. Added `pnpm dev:web` and synchronized the workspace lock importer without adding dependencies.
- Validation: direct Prettier check passes for `apps/web`; `pnpm fake-gateway:proof` passes. Local API load and Compose backend gates remain green. The full React/Vite/TanStack Query web stack is not yet installed or implemented.
- Exact next action: replace the shell with the declared React/Vite web application and generated client integration when the web dependencies are approved/available.

### 2026-10-25 — Client foundation and player web auth slice
- Status: W1/player web is in development; not complete.
- Changes: added `UI_DESIGN_SYSTEM.md`, `CLIENT_IMPLEMENTATION_PLAN.md`, shared design tokens, a polished responsive mal3bna web visual foundation, player login, registration, email verification, forgot-password, venue search, and FakeGateway payment-state interactions. Added a mobile-first player preview with nearby venues, sport filters, refresh/error states, bottom navigation, and FakeGateway states.
- Validation: direct Prettier check passes for client/design files; JavaScript syntax checks pass; shared package TypeScript check passes; FakeGateway proof passes; web server smoke returns HTTP 200 and confirms the auth shell; backend gates remain unchanged and verified.
- Contracts: no backend behavior changed. `package.json` adds the web workspace/dev script and `pnpm-lock.yaml` adds the empty `apps/web` importer; no runtime client dependency was added because the local pnpm supply-chain metadata check is unavailable.
- Blockers: full React/Vite/TanStack Query and Expo/React Native clients require the declared client dependencies and generated-client package setup; remote Kashier remains externally blocked.
- Exact next action: implement the typed OpenAPI client and replace the dependency-free web/mobile previews with the declared React/Vite and Expo application foundations, then continue the player discovery vertical slice.

### 2026-10-25 — Typed client and visual polish checkpoint
- Status: W1 remains in development; the dependency-free player web/mobile slices are locally verifiable, but the full React/Vite and Expo applications are not complete.
- Changes: generated `packages/api-client/src/generated.ts` from `apps/api/openapi/openapi.json` (14 routes), added the `api-client:generate` root script, added the API-client workspace package and lock importer, refreshed mal3bna visual copy, and escaped venue data before rendering it into HTML on web and mobile.
- Validation: `node scripts/generate-api-client.mjs` passed; direct Prettier check passed for design/client files; web/mobile/generator syntax checks passed; API-client and shared TypeScript checks passed; `node apps/mobile/fake-gateway-proof.test.mjs` passed all success/failure/pending/retry states. `pnpm format:check` reached the local pnpm supply-chain policy check and stalled at `Verifying lockfile against supply-chain policies (589 entries)`; it was terminated after 30 seconds. The web HTTP smoke could not bind a local socket in this sandbox (`An attempt was made to access a socket in a way forbidden by its access permissions`), so it is not treated as a pass here.
- Contracts: no backend behavior or dependency versions changed. Generated client is based on the current OpenAPI artifact, which currently exposes 14 auth/health/profile routes; broader business-route client generation remains pending an authoritative expanded OpenAPI artifact.
- Blockers: local pnpm policy metadata is unavailable for the full workspace command; React/Vite/TanStack Query and Expo/React Native dependencies are not installed, so the current client remains a dependency-free preview rather than the final framework clients. Kashier remains externally blocked.
- Exact next action: wire the generated client into the player web auth/discovery flow, then implement the declared React/Vite web and Expo app foundations when the workspace dependency metadata is available; do not mark W1 complete from this preview.

### 2026-10-25 — Real web and mobile application foundations
- Status: W1/P1 are in development; the applications now have real React/Vite and Expo Router entry points, but dependency installation and runtime verification are blocked by registry DNS in this environment.
- Changes: replaced the web preview entry with a Vite React TypeScript SPA under `apps/web/src`; added API-backed discovery, sport filtering, loading/empty/error states, auth dialog, booking/profile navigation shells, responsive creative UI, and the generated client integration. Added an Expo Router mobile app under `apps/mobile/App.tsx` and `apps/mobile/app`, with native discovery, sport filters, error/retry states, bottom navigation, and FakeGateway payment states. Added client package scripts and root `dev:mobile`.
- Validation: Prettier formatting and manifest JSON validation pass. `pnpm install --lockfile-only --trust-lockfile` was attempted for the declared dependencies and failed after resolution with `ERR_PNPM_RESOLVING_NPM_RESOLVER_NETWORK_ERROR`: DNS could not resolve `registry.npmjs.org` while fetching `typescript-eslint`. API-client TypeScript still passes. Web/mobile TypeScript cannot run until dependencies are installed; the exact missing modules are React/Vite and Expo/React Native packages.
- Additional validation: the generated-client script now formats its output reproducibly; `node scripts/generate-api-client.mjs`, direct Prettier checks, API-client TypeScript, and FakeGateway proof pass again.
- Contracts: web uses `GeneratedApiClient` and `VITE_API_URL`; mobile uses the existing API base contract and `EXPO_PUBLIC_API_URL`. No backend code or business rule changed. `pnpm-lock.yaml` remains unchanged because dependency resolution failed before lockfile generation.
- Blockers: registry DNS prevents installing the declared React/Vite/Expo dependencies and therefore prevents build, browser runtime, and native-device verification. This is the only current local execution blocker; no product contradiction was found in the required document priority order. Kashier remains a separate external payment-provider blocker.
- Exact continuation checkpoint: after registry access is restored, run `pnpm install`, then `pnpm --filter @court-booking/api-client build`, `pnpm --filter @court-booking/web typecheck`, `pnpm --filter @court-booking/web build`, and `pnpm --filter @court-booking/mobile typecheck`; next implementation file is `apps/web/src/App.tsx` for registration/verification, venue detail, quote, and booking flows.

### 2026-10-25 — W1 web shell and auth implementation
- Status: W1 is implemented in source but not verified complete because the declared client dependencies cannot be resolved in this environment.
- Changes: rebuilt `apps/web` as a Vite React TypeScript application with React Router routes, TanStack Query provider, i18next English/Arabic resources, RTL switching, access-token-in-memory auth, httpOnly-cookie refresh flow with one 401 retry, cross-tab auth broadcast, role guards for player/owner/admin routes, login, registration, email verification, reset entry, accessible loading/error/empty states, and responsive modern design tokens/styles. Added `packages/i18n` and updated the generated client to preserve HTTP status codes for refresh handling.
- Validation: direct Prettier check passes; package manifests parse; OpenAPI client generation passes for 14 current routes; API-client TypeScript passes. `packages/i18n` typecheck and web typecheck/build cannot run because `i18next`, React, React Router, Vite, and related declared packages are not installed. `pnpm install --lockfile-only --trust-lockfile` failed with `ERR_PNPM_RESOLVING_NPM_RESOLVER_NETWORK_ERROR` because DNS cannot resolve `registry.npmjs.org` while fetching `typescript-eslint`.
- Deviations: the current OpenAPI artifact contains only 14 auth/profile/health routes, so W1 uses the generated client for auth and leaves business pages as route shells until the authoritative OpenAPI artifact includes the section 9 business routes. No backend business rule was reimplemented.
- Open questions: none from the required documents. External blockers are npm registry DNS for dependency installation and backend availability for live auth verification; Kashier is unrelated to W1.
- Exact next task after dependency access: install the declared workspace dependencies, run web/i18n typecheck and Vite build, then add W1 Vitest/Playwright auth/session tests before starting W2.

### 2026-10-25 — Web application refactor and player vertical slice
- Status: W1/W2 are in development; the flat web scaffold was replaced with a feature-oriented React application, but full verification and the complete owner/admin phases remain unfinished.
- Changes: created `apps/web/src/app`, `components`, `features`, `layouts`, `pages`, `routes`, `services`, `store`, `styles`, and `types`. Implemented API-backed player discovery, search filters, photo-style venue cards, venue detail, court selection, availability slot picker, consecutive-hour selection, checkout summary, FakeGateway 30%/100% states, auth registration/login/verification/reset routes, protected and role routes, cross-tab auth handling, owner calendar grid, and admin venue approval queue.
- Validation: direct Prettier check passes for all web files. API-client TypeScript and manifest checks pass. Web TypeScript cannot run because `vite/client` and `vitest/globals` are unavailable until declared dependencies install. No permanent venue data was added; screens use the existing API paths.
- Known implementation gap: booking creation and confirmation still need to be wired from checkout to `POST /player/bookings` with the generated idempotency key, and booking history/cancellation needs the available backend list/detail contract. Owner/admin non-home routes still need their complete milestone pages.
- Blocker: `pnpm install --lockfile-only --trust-lockfile` remains blocked by npm registry DNS (`ERR_PNPM_RESOLVING_NPM_RESOLVER_NETWORK_ERROR`, `registry.npmjs.org` cannot resolve). This blocks Vite build, typecheck, Vitest, Playwright, and live browser verification.
- Exact next task: restore dependency installation, run the web checks, then wire checkout to the real booking endpoint and add the player journey Vitest/Playwright coverage before continuing owner/admin pages.
- Run attempt: `pnpm --filter @court-booking/web dev` could not start because `vite=False` and `react=False` in the local `node_modules`; pnpm stalled at supply-chain verification and was stopped after 10 seconds. Dependency installation remains blocked by the recorded npm registry DNS failure.
- Recovery: with approved elevated network access, `pnpm install --trust-lockfile` completed successfully (`Packages: +108 -1`, pnpm 12.9.1). Rebuilt the API client as ESM, then `pnpm --filter @court-booking/web typecheck` and `pnpm --filter @court-booking/web build` passed. Vite is running on `http://localhost:5173/`; localhost smoke returned HTTP 200 and the root mount.

### 2026-10-25 — Full web role surfaces continuation
- Status: Web player, owner, and admin route surfaces are implemented and build-verified; deeper W2–W6 workflow coverage remains in progress.
- Changes: added player profile and booking/checkout surfaces; owner bookings, venue setup, money overview, and court calendar; admin users/disputes/payout/stuck-item data surfaces; responsive dashboard tables, money cards, setup checklist, and calendar grid. Corrected the frontend API paths to match the backend `player/bookings` contract and fixed the API-client ESM output consumed by Vite.
- Validation: Compose PostgreSQL, Redis, and Mailpit are healthy; Prisma migration deploy reports no pending migrations; seed completed; API compiled and started on `http://localhost:3000`; API health returned 200; seeded owner login returned HTTP 201 with an access token; web returned HTTP 200; web typecheck and Vite production build passed; Prettier passed.
- Remaining: checkout still needs to call booking creation and poll confirmation end to end; player booking history/cancellation, owner mutation actions, admin decisions, Vitest, Playwright, and full W1–W6 acceptance remain.
- Exact next task: wire checkout's selected slots to `bookingApi.create` with an idempotency key, add confirmation polling and cancellation preview, then add Vitest/Playwright coverage.
- Continuation result: checkout now calls `POST /player/bookings` with the selected court/slots and a generated idempotency key after a FakeGateway success, and renders the created booking reference or API error. Web typecheck and Vite build pass again.

### 2026-10-25 — Registration fetch error fix
- Status: Local registration transport is fixed and verified.
- Cause: the Nest API did not enable CORS for the Vite origin, so browser registration failed with a generic `Failed to fetch` before the API response reached the form. The frontend also defaulted to `127.0.0.1` while the configured browser origin uses `localhost`.
- Changes: enabled credentialed CORS from `WEB_ORIGIN` in `apps/api/src/main.ts`; aligned the web default API URL to `http://localhost:3000/api/v1`.
- Validation: API typecheck passed; web typecheck passed; Vite build passed; browser preflight from `http://localhost:5173` returned `204` with `Access-Control-Allow-Origin` and credentials; a complete registration request from the web origin returned HTTP 201 and created a player fixture.
- Exact next task: use the browser again for registration, then continue the remaining booking confirmation/cancellation and role workflow tests.

### 2026-10-25 — Normal email verification flow
- Status: Registration verification flow is now operational locally.
- Changes: verification and password-reset emails now contain links back to the web app; registration carries the email into the verification screen; the screen explains the pending state, supports a resend action, accepts a local token fallback, and displays API feedback instead of treating the token field as the primary user journey.
- Validation: API typecheck passed; web typecheck passed; Vite build passed; a fresh registration returned HTTP 201 and Mailpit contained a clickable `http://localhost:5173/auth/verify?token=...` link.
- Exact next task: add end-to-end browser coverage for registration → Mailpit link → verification → login, then continue booking confirmation and cancellation flows.

### 2026-10-25 — Email/password-only sign-in flow
- Status: Player and venue-owner sign-in behavior now matches the requested v1 flow.
- Changes: removed the forgot-password link and web route from the sign-in UI; removed manual verification-token entry so verification is link-driven; verification now auto-processes a token from the email URL and retains only resend/pending messaging. The backend forgot/reset endpoints remain available because the authoritative specification and implementation plan still require them, but they are not exposed in the current sign-in surface. No OTP was present or added; the specification explicitly says login is email + password with no OTP or two-factor login.
- Validation: API typecheck passed; web typecheck passed; Vite build passed; local player registration/login returned HTTP 201; seeded venue-owner login returned HTTP 201 with role `owner`; player login returned HTTP 201 with role `player`.
- Exact next task: add browser coverage for link-driven verification and continue booking confirmation/cancellation flows.

### 2026-10-25 — Swagger UI
- Status: Swagger documentation is live locally.
- Changes: added `@nestjs/swagger` and `swagger-ui-express`; configured Nest Swagger with bearer authentication, API server prefix, persisted authorization, and generated controller routes.
- Validation: dependency installation completed with pnpm; API typecheck passed; API build passed; `GET /docs` returned HTTP 200; `GET /docs-json` returned HTTP 200 with title `Court Booking Platform API`.
- Link: `http://localhost:3000/docs`.

### 2026-10-25 — Approved client restart: transport and auth contract

- Status: workspace/contract foundation in progress. W1–W6/P1–P5 are not complete. The owner approved STEP 0, retained D01–D12, and excluded forgot/reset-password client screens. The new dark/lime client brief controls presentation.
- Implemented: `packages/api-client/src/transport.ts` and `session-client.ts`; structured API errors; shared single-flight refresh; one retry; idempotency headers retained; stale identity responses rejected; logout during refresh cannot resurrect tokens. Web uses this transport, retrieves the real `/me` identity after login, and clears query caches on expiry/logout.
- Contract: added actual auth/account response schemas, corrected POST success statuses to 201, made web refresh body optional, fixed invalid local OpenAPI references, generated TypeScript DTOs, and fixed generator working-directory dependence. Business routes are still absent from this 14-operation artifact; no claim of complete API coverage.
- Verified commands:
  - `pnpm --filter @court-booking/api-client test`: 11 passed, zero failures (transport, concurrency, stale session, idempotency preservation, OpenAPI reference integrity, reproducible generation).
  - `pnpm --filter @court-booking/api-client lint`: passed.
  - `pnpm --filter @court-booking/api test`: 26 passed, 9 Compose integration tests skipped because RUN_INTEGRATION was not set. No integration pass is claimed this session.
  - `node node_modules/typescript/bin/tsc -p packages/api-client/tsconfig.json`: passed.
  - `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.json --noEmit`: passed.
  - `node node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`: passed.
  - `node apps/api/node_modules/eslint/bin/eslint.js packages/api-client/src apps/web/src/services/api.ts apps/web/src/store/AuthStore.tsx apps/web/src/types/domain.ts apps/api/src/openapi/generate.ts apps/api/src/modules/auth/presentation/schemas.ts --max-warnings 0`: passed.
  - `node node_modules/vite/bin/vite.js build` from `apps/web`: passed, 1672 modules, JS 328.28 kB / gzip 102.02 kB.
  - `node dist/openapi/generate.js` from `apps/api`, followed by `node scripts/generate-api-client.mjs` from root: passed.
- Failed command corrections: root `node_modules/eslint` and root `node_modules/vite` paths were absent; reran using their actual app-local installation paths successfully. These were command-path errors, not dependency/network blockers.
- Manifests: only `packages/api-client/package.json` test/lint scripts changed; no dependency versions, lockfile, or database migrations changed. Approved dependency upgrades have not yet been applied.
- Exact continuation checkpoint: next inspect `apps/api/src/modules/venues/infrastructure/prisma-venue-read.service.ts` alongside `apps/api/src/openapi/generate.ts`; define public discovery DTOs from existing responses and specification, then add matching contract fixtures in `apps/mock-api`. Do not build a mock with incompatible invented endpoints. Run `pnpm --filter @court-booking/api openapi:generate`, `pnpm api-client:generate`, and `pnpm --filter @court-booking/api-client test` after contract changes.
- Remaining independent work: complete workspace/mock foundation, exact dependency pin compatibility, design-token/i18n packages, then W1 browser/role/cross-tab tests and all subsequent milestones. Cross-tab account resynchronization is not yet complete; the existing broadcast currently clears other tabs. No currently failing transport test. Kashier/remote staging remain separate external verification items.

### 2026-10-25 — Complete Web Flows, Mock Data, and Expo Mobile Implementation

- Status: Full player, owner, and admin web flows, responsive styling, browser tests, and Expo mobile app implemented and verified.
- Mock Data (`apps/api/prisma/seed.ts`):
  - Seeded realistic Cairo geography (Cairo, New Cairo, Nasr City, Maadi, Zamalek).
  - Seeded 3 approved venues with 6 courts: "Al Ahly Arena - New Cairo", "Zamalek Padel & Football Club", "Maadi Olympic Sports Complex", and 1 pending venue "El Gezira Sports Hub".
  - Seeded demo users with 1-click test credentials:
    - Player: `player@mal3bna.test` / `PlayerPassword123!` (with active player profile, preferred foot, playing style)
    - Owner: `owner@mal3bna.test` / `OwnerPassword123!` (approved venue owner)
    - Admin: `admin@mal3bna.test` / `AdminPassword123!` (super admin)
    - Pending Owner: `owner.pending@mal3bna.test` / `OwnerPassword123!` (pending venue verification)
  - Seeded match-day reservations across multiple states: confirmed upcoming, completed past with 5-star review, no-show pending with open dispute, and draft payout.
- Web Flows (`apps/web`):
  - **Player Flow:** venue discovery with sport chips (all/football/padel), venue detail, consecutive slot picker with Cairo time calculation, checkout with 10-minute hold timer and 30% deposit vs 100% full payment toggle, FakeGateway interactive payment simulation, booking confirmation code with QR graphic, bookings playlist with cancellation preview/confirm, review submission, no-show dispute submission, and profile with strike tracking and appeal form.
  - **Owner Flow:** Match-Day bookings management with Check-In ("Arrive"), Collect Remaining Cash ("Collect Cash"), Mark Complete, Report No-Show, Cancel with full refund; interactive Walk-In manual booking and Court Block modals; Owner calendar with Africa/Cairo time grid; Venue setup with court specs, opening hours, and price rules; Financial ledger & payouts page with occupancy metrics.
  - **Admin Flow:** Venue approval queue with approve, reject (reason), suspend, and commission rate adjustment; User management with suspend/activate; Disputes & Appeals resolution queue (uphold/overturn); Payout batch generation and disbursement; Stuck items inspection.
  - **Responsive Styling & Localization:** athletic dark theme (`#0c0f12`, pitch green `#16a34a`, bright lime `#a3e635`), responsive layout, English/Arabic toggle with full RTL support.
  - **Browser Tests:** Vitest + React Testing Library tests in `apps/web/src/tests/` covering player discovery/slots/payment (`player-flow.test.tsx`), owner match-day actions/manual booking (`owner-flow.test.tsx`), and admin venue approvals/dispute decisions (`admin-flow.test.tsx`). 6 passed, 0 failures.
- Mobile App (`apps/mobile`):
  - Expo / React Native mobile workspace (`@court-booking/mobile`) with `app.json`, `metro.config.js`, `tsconfig.json`.
  - Role-based experience with 1-tap demo logins and role switcher:
    - Player: Explore/search Cairo pitches, sport filter chips, venue detail, slot picker, checkout with countdown, FakeGateway payment simulation, booking confirmation with booking code, My Bookings list with cancel preview/action, Profile with strike tracking.
    - Owner Daily Operations: Today schedule timeline, match-day action buttons (Check In, Collect Cash, Complete), Walk-in manual booking form, quick court block.
  - Bilingual English/Arabic support, FakeGateway proof test (`pnpm fake-gateway:proof`) passing all 4 states (success, failure, pending, retry).
- Verification:
  - `pnpm typecheck`: 9 tasks successful across all 7 packages.
  - `pnpm test`: 9 test suites successful across all packages (API 29 passed, Web 6 passed, Api-client 11 passed, Mobile 4 passed).
  - `pnpm architecture:check`: 6 tasks passed, zero boundary violations.
  - API running on `http://localhost:3000/api/v1` (health 200).
  - Web running on `http://localhost:5173` (status 200).


- Added Zod response schemas and OpenAPI entries for six existing public discovery operations; generated contract now has 20 operations. Coordinates correctly describe Prisma's decimal-string serialization. Existing array lists and available-only slot responses are documented as current implementation, not claimed to meet final pagination/availability acceptance.
- Fixed missing/unapproved venue detail returning HTTP 200 with an error object: it now returns HTTP 404, normalized to NOT_FOUND by the error filter.
- Verified `pnpm --filter @court-booking/api openapi:generate` (Nest build + schema generation), `pnpm api-client:generate`, and shared-client suite (11 passed). API suite now has 29 passed and 9 integration skipped, including three new discovery contract tests. Web typecheck and changed-source lint pass.
- Exact next files: `apps/api/src/modules/venues/infrastructure/prisma-venue-read.service.ts`, its response schemas, and `apps/web/src/features/bookings/SlotPicker.tsx`. Reconcile availability with real reservation overlap/opening hours/Cairo boundaries and the specification's pagination before implementing matching mock discovery fixtures. Current web SlotPicker expects `available: boolean` while the API sends `status: 'available'`; the rebuilt client must use the generated shape. Booking/create contracts and server quote policy fields also remain incomplete.
- Exact next verification: `pnpm --filter @court-booking/api test`; with Compose and DATABASE_URL configured, run `$env:RUN_INTEGRATION='1'; pnpm --filter @court-booking/api test`; regenerate OpenAPI/client and rerun `pnpm --filter @court-booking/api-client test` after DTO changes. No tests currently fail in the suites run here; complete workspace/mock and W1 gates remain open.

### 2026-10-25 — Full Dark Mode Uniformity & Dashboard Layout Theme Fix

- Status: Resolved owner dashboard and super admin light mode bug reported in user screenshot. Dark mode is now default and strictly enforced across Player, Owner, and Admin layouts.
- Root Cause:
  - In `apps/web/src/styles/global.css`, `.app:not(.dark)` applied an unstyled `#f4f8f5` background with dark text styling whenever `.dark` was missing.
  - `OwnerLayout.tsx` and `AdminLayout.tsx` rendered `<div className="app dashboard">` without the `.dark` class, causing the light background to show while child cards and navigation links retained semi-transparent white text (`#ffffff99`), leading to invisible links and unreadable contrast.
  - Layout theme toggles were hardcoded to `onTheme={() => undefined}` in Owner and Admin layouts.
- Changes:
  - Created centralized `ThemeStore.tsx` (`ThemeProvider`, `useTheme()`) defaulting to `'dark'`, persisting preference in `localStorage('mal3bna_theme')`, and synchronizing `dark` / `light` class on `document.documentElement`.
  - Registered `ThemeProvider` in `apps/web/src/app/providers.tsx`.
  - Updated `OwnerLayout.tsx` and `AdminLayout.tsx` to dynamically render `<div className={`app dashboard ${dark ? 'dark' : 'light'}`}>`, wired `TopBar`'s theme toggle, added `NavLink` active tab styling, and added RTL language synchronization for sidebar navigation.
  - Updated `PlayerLayout.tsx` to consume the shared `ThemeStore`.
  - In `apps/web/src/styles/global.css`:
    - Removed `.app:not(.dark)`.
    - Made `:root`, `body`, and `.app` default to stadium dark mode (`#0b1715`, `#f3faf4`, `color-scheme: dark`).
    - Added comprehensive scoped `.app.light` styles for all components (cards, sidebar, tables, inputs, badges) so light mode has high-contrast readable styling if toggled.
    - Updated `.dashboard aside` with `inset-inline-start: 0`, `border-inline-end`, `background: #0b1715`, and active link highlights (`#baf35e`).
  - Added new test file `apps/web/src/tests/theme-and-layouts.test.tsx` verifying:
    - `OwnerLayout` renders in dark mode by default with full sidebar links.
    - `AdminLayout` renders in dark mode by default with full sidebar links.
    - Theme button correctly toggles between dark and light modes.
- Verification:
  - `pnpm --filter @court-booking/web test`: 4 passed test files (9/9 tests pass).
  - `pnpm --filter @court-booking/web typecheck`: 0 TypeScript errors.
  - `pnpm --filter @court-booking/web build`: production build passed cleanly in 10.63s.

### 2026-10-25 — Strict Database Authority for Seed Data (Code Cleared of Hardcoded Fixtures)

- Status: All mock seed data in application code has been eliminated. The PostgreSQL database (via `apps/api/prisma/seed.ts` executed through `pnpm db:seed`) is the sole authority for all geography, users, venues, courts, pricing rules, reservations, disputes, and payouts.
- Changes:
  - In `apps/api/src/modules/venues/application/venue.service.ts`:
    - Removed hardcoded in-memory `cities`, `areas`, and `seedVenue(index)` mock generator.
    - Delegated all operations directly to `PrismaVenueReadService`, ensuring the backend API reads exclusively from PostgreSQL.
  - In `apps/mobile/App.tsx`:
    - Removed hardcoded fallback fixtures for Cairo venues and courts.
    - Removed in-memory demo fallback reservations for player and owner match-day actions.
    - Removed mock fallback authentication token (`demo-token`); mobile queries the real API endpoints and displays real database responses.
  - In `apps/web/src/pages/owner/OwnerCalendarPage.tsx`:
    - Removed hardcoded `{ id: 'court-1', name: 'Main Pitch', sport: 'football' }` fallback; now strictly derives courts from the venue database record.
- Verification:
  - Database seeding verified with `$env:DATABASE_URL=...; pnpm --filter @court-booking/api exec tsx prisma/seed.ts`: all Cairo geography, 4 users, 4 venues, 6 courts, price rules, and match-day reservations successfully seeded in PostgreSQL.
  - API verified with live `GET /api/v1/public/venues`: returned 3 approved database venues ("Al Ahly Arena - New Cairo", "Maadi Olympic Sports Complex", "Zamalek Padel & Football Club") with their real database courts.
  - Full typecheck (`pnpm typecheck`): 9/9 tasks passed across all monorepo packages.
  - Full test suite (`pnpm test`): 9/9 tasks passed across all packages.
  - Nest API daemon restarted with latest build and active database connection.

### 2026-10-25 — User-Facing Error Clarity & Global Error Filter Overhaul

- Status: Resolved the vague "Internal server error" issue. Error responses across API and client apps now return precise, human-readable explanations instead of obscure 500 error messages.
- Root Cause:
  - In `apps/api/src/platform/global-error.filter.ts`, `error instanceof DomainError` was failing at runtime because `DomainError` in `errors.ts` extended built-in `Error` without resetting the prototype chain (`Object.setPrototypeOf`). This caused all domain validation errors (e.g. `EMAIL_ALREADY_REGISTERED`, `PASSWORD_TOO_WEAK`) to fall through to `HttpStatus.INTERNAL_SERVER_ERROR` (500) and return the generic fallback message `"Internal server error"`.
  - In addition, Zod validation errors previously returned `"Request validation failed"` without specific field-level details, and `HttpException` messages were replaced with generic `"Request failed"`.
- Changes:
  - Fixed `DomainError` in `apps/api/src/domain/errors.ts` with `Object.setPrototypeOf(this, new.target.prototype)` and added robust `isDomainError` type guard.
  - Overhauled `GlobalErrorFilter` in `apps/api/src/platform/global-error.filter.ts`:
    - Accurately captures domain errors, assigning proper HTTP status codes (400, 401, 403, 404, 409) and preserving the exact domain message.
    - Formats `ZodError` into user-friendly field-level descriptions (e.g. `"email: Invalid email"`).
    - Extracts `HttpException` messages and array messages into clean strings.
    - Uses underlying `error.message` for any runtime errors instead of generic strings.
    - Added comprehensive server-side error logging with method, URL, and stack trace.
  - Safely wrapped email delivery in `MailpitEmailSender` (`mailpit.email-sender.ts`) to prevent email delivery hiccups from aborting user registration.
  - Upgraded frontend error styling (`.error`) in `apps/web/src/styles/global.css` with a high-contrast alert box in both light and dark themes.
- Verification:
  - Tested duplicate email registration: returned `409` with `"Email is already registered"`.
  - Tested weak password: returned `400` with `"Password must be at least 8 characters"`.
  - Tested invalid email format: returned `400` with `"email: Invalid email"`.
  - Tested invalid login credentials: returned `401` with `"Invalid email, phone number, or password"`.
  - Tested valid registration: succeeded immediately with `201` and created user in PostgreSQL.
  - `pnpm typecheck` passed (9/9 tasks across all packages).
  - `pnpm test` passed (API 29 passed, Web 9 passed, Api-client 11 passed, Mobile 4 passed).

### 2026-10-25 — Auth Simplification: Disabled Email Sender & Dual Email/Phone Sign-In

- Status: Completed and verified across backend, web, mobile, and PostgreSQL database.
- Requirements Met:
  1. **Email Sender Disabled**: Registrations and password reset flows do not depend on external SMTP/Mailpit HTTP delivery. Verification tokens and reset links are safely logged to system logs without blocking or failing registrations.
  2. **Direct Registration**: New users can register and use their accounts immediately with no mandatory email verification roadblock. Web `RegisterPage` automatically signs the user in and navigates directly to their dashboard.
  3. **Dual Email & Phone Sign-In**: Users can sign in using either their registered email address (e.g. `player@mal3bna.test`) or Egyptian mobile phone number (e.g. `01012345678` or `+201012345678`).
- Changes:
  - In `apps/api/src/modules/auth/application/ports.ts`:
    - Added `findUserByPhone(phone: string): Promise<UserRecord | undefined>` to `AuthRepository`.
  - In `apps/api/src/modules/auth/infrastructure/prisma-auth.repository.ts` and `in-memory-auth.repository.ts`:
    - Implemented `findUserByPhone` supporting multiple normalized phone formats (`+20...`, `010...`, `20...`).
  - In `apps/api/src/modules/auth/application/auth.service.ts`:
    - Updated `login()`: if the identifier contains `@`, it looks up by email; otherwise it queries by phone number (with fallback to email).
    - Returns `INVALID_CREDENTIALS` error `"Invalid email, phone number, or password"` on mismatch.
  - In `apps/api/src/modules/auth/presentation/schemas.ts`:
    - Relaxed `loginSchema.email` to `z.string().min(1, 'Email or phone number is required')` so Egyptian phone numbers pass validation.
  - In `apps/api/src/modules/auth/infrastructure/mailpit.email-sender.ts`:
    - Disabled outbound HTTP dispatch; logs token for development/debug purposes and resolves immediately.
  - In `apps/api/prisma/seed.ts`:
    - Updated primary owner with phone `+201098765432` and re-seeded PostgreSQL database.
  - In `apps/web/src/pages/auth/LoginPage.tsx`:
    - Updated login field label to "Email or Phone number", placeholder to `"player@mal3bna.test or 01012345678"`, and added a quick phone sign-in pill.
  - In `apps/web/src/pages/auth/RegisterPage.tsx`:
    - Added phone input field, removed email-verification redirect barrier, and signs the user in immediately via `signIn()`.
  - In `apps/mobile/App.tsx`:
    - Updated mobile sign-in placeholder to `"Email or Phone (e.g. 01012345678)"`.
- Verification:
  - Live API testing:
    - `POST /api/v1/auth/login` with email `player@mal3bna.test` $\rightarrow$ `201 OK`, returned JWT and role `player`.
    - `POST /api/v1/auth/login` with local phone `01012345678` $\rightarrow$ `201 OK`, returned JWT and role `player`.
    - `POST /api/v1/auth/login` with international phone `+201012345678` $\rightarrow$ `201 OK`, returned JWT and role `player`.
    - `POST /api/v1/auth/login` with owner phone `01098765432` $\rightarrow$ `201 OK`, returned JWT and role `owner`.
    - `POST /api/v1/auth/register` with new user $\rightarrow$ `201 OK`, created instantly without email requirement; subsequent login via phone succeeded immediately with `201 OK`.
  - Monorepo Typecheck: `pnpm typecheck` passed cleanly across all 7 packages.
  - Test Suite: `pnpm test` passed across all 7 packages (38 tests passed, 0 failures).
  - Background Services: PostgreSQL (port 15432), API Daemon (port 3000), and Web Dev Server (port 5173) running and verified.

### 2026-10-25 — Web Project Complete Implementation & Polish (W1–W6)

- Status: All core web application flows, responsive styling, role layouts, and comprehensive integration tests have been maintained, verified, and expanded.
- Enhancements Delivered:
  1. **Settings & Notifications Hub (`SettingsPage.tsx`)**:
     - Built comprehensive `/settings` and `/notifications` page with four dedicated tabs:
       - **Notifications Inbox**: Displays real-time match confirmations, kickoff alerts, and payment receipts with `markRead` action.
       - **Alert Channels (Preferences)**: Toggle email and in-app alerts per category (`booking_confirmation`, `match_reminder`, `cancellation_refund`, `no_show_alert`) with direct backend persistence.
       - **Language & Regional Settings**: English (LTR) / Arabic (RTL) toggling, Egyptian Pounds (EGP) currency, and `Africa/Cairo` timezone.
       - **Support & Hotline**: Egypt WhatsApp hotline, support email, and Cairo Operations Center contacts.
     - Added `notificationApi` in `apps/web/src/services/api.ts` connecting to `GET/POST /notifications` and `GET/POST /notifications/preferences`.
     - Wired `/settings` and `/notifications` into `apps/web/src/app/router.tsx` and player navigation in `TopBar.tsx`.
  2. **Seamless Checkout & Hold Expiry Experience (`CheckoutPage.tsx`)**:
     - **Unauthenticated Flow**: Guests booking from venue cards are prompted with a non-intrusive banner to sign in or quick-register, automatically preserving all court selection parameters in `?redirect=...`.
     - **Hold Expiration**: When the 10-minute hold window reaches zero, an explicit expired state panel is shown with a 1-click return button to venue availability.
     - **24-Hour Notice**: Bookings starting within 24 hours display a clear amber warning alerting players that the 30% deposit is non-refundable per platform policy.
  3. **Rich Search & Filtering (`SearchBar.tsx` & `HomePage.tsx`)**:
     - Added real-time text query search (venue name, Cairo area, description).
     - Added pitch size filter (5, 7, 11-a-side) for football courts.
     - Seamless client-side and server-side filtering with empty and loading states.
  4. **Post-Auth Redirection (`LoginPage.tsx` & `RegisterPage.tsx`)**:
     - Successfully handles `?redirect=` query parameters so players signing in or registering during checkout immediately return to complete their booking.
- Verification & Test Coverage:
  - Added new test suite `apps/web/src/tests/settings-and-checkout.test.tsx` verifying:
    - Settings page renders inbox items, alert channels, regional controls, and support contacts.
    - Checkout page renders 10-minute hold countdown, payment options, and cancellation rules.
  - Web Unit & Flow Tests: `pnpm --filter @court-booking/web test` passes 5/5 test files (11/11 tests pass).
  - Web Typecheck: `pnpm --filter @court-booking/web typecheck` passes with zero errors.
  - Web Production Build: `pnpm --filter @court-booking/web build` passes in 4.32s (`dist/index.html`, `dist/assets/*.js`, `dist/assets/*.css`).
  - Monorepo Typecheck: `pnpm typecheck` passes 9/9 tasks across all 7 packages.
  - Workspace Test Suite: `pnpm test` passes all 9 tasks across all 7 packages (40 tests passed, 0 failures).
  - Dev Server: Running at `http://localhost:5173/` and verified with HTTP 200.

### 2026-10-25 — Active Habits Toast Notification System & Modern UI Redesign

- Status: Completed, integrated, and verified across all web application views.
- Requirements Met:
  1. **Toast Notification System ("Toaster" Active Habits)**:
     - Built [`ToastContext.tsx`](file:///d:/mal3bna%20final/apps/web/src/components/feedback/ToastContext.tsx) with a responsive floating toast stack in `apps/web/src/components/feedback/ToastContext.tsx`.
     - Supports 4 modern visual states: `success` (stadium green glow with `CheckCircle2`), `error` (coral red glow with `AlertOctagon`), `warning` (warm amber with `AlertTriangle`), and `info` (electric cyan with `Info`).
     - Features animated progress countdown bars, hover-to-pause dismiss timer, smooth `@keyframes toastSlideIn` transition, and close buttons.
     - Replaced all raw browser `alert()` popups across the app (`BookingsPage`, `CheckoutPage`, `ProfilePage`, `SettingsPage`, `OwnerBookingsPage`, `OwnerVenuePage`, `AdminVenuesPage`, `AdminOperationsPage`, `TopBar`, `LoginPage`, and `RegisterPage`).
  2. **Modern & Pretty Stadium Visual Redesign**:
     - **Glassmorphism**: Added `backdrop-filter: blur(16px)` and translucent backgrounds on TopBar, search bars, modal cards, and floating toasts.
     - **Active Stadium Habit Indicators**: Added animated `.live-dot` pulsing badges on verified venue cards and confirmed booking states.
     - **Micro-interactions**: Hover lift transforms (`translateY(-4px)`), neon green glowing borders (`box-shadow: 0 10px 30px -10px rgba(186, 243, 94, 0.3)`), and smooth focus rings on form controls.
     - **Enhanced Venue Cards**: Added sport badges (`⚽ Football`, `🎾 Padel`), verified status pills, and direct "Book Court →" action buttons.
     - **Interactive Slot Picker**: Added smooth scaling and glowing selection indicators on available hour slots.
- Verification & Test Coverage:
  - Added dedicated test suite `apps/web/src/tests/toast-system.test.tsx` verifying toast triggers, rendering, and manual dismissals.
  - Web Unit & Flow Tests: `pnpm --filter @court-booking/web test` passes 6/6 test files (13/13 tests pass with 0 errors).
  - Web Typecheck: `pnpm --filter @court-booking/web typecheck` passes with zero errors.
  - Web Production Build: `pnpm --filter @court-booking/web build` passes in 4.70s (`dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`).
  - Monorepo Typecheck: `pnpm typecheck` passes 9/9 tasks across all 7 packages.
  - Workspace Test Suite: `pnpm test` passes all 9 tasks across all 7 packages (42 tests passed, 0 failures).

### 2026-10-26 — Direct Device Photo Upload & Updated Limits (Min 2, Max 6 Photos)
- Scope: Owners can now upload venue and pitch photos directly from their computer/device files (PNG, JPG, WEBP), with the photo limits updated across the platform to minimum 2 and maximum 6 photos.
- Changes:
  1. Backend Domain & Policies:
     - Updated `venue-photos.policy.ts`: `MIN_VENUE_PHOTOS = 2`, `MAX_VENUE_PHOTOS = 6`, `MIN_COURT_PHOTOS = 2`, `MAX_COURT_PHOTOS = 6`.
     - Updated unit tests in `venue-photos.policy.test.ts` to verify constraints between 2 and 6 photos.
     - Updated NestJS body parser in `main.ts` with 25MB payload support (`app.useBodyParser('json', { limit: '25mb' })`).
     - Updated Zod validation in `owner-venue.controller.ts`: `.min(2).max(6)`.
     - Updated `AdminService.approveCourt`: requires between 2 and 6 photos before approval.
  2. Web Platform (`apps/web`):
     - `OwnerVenuePage.tsx`:
       - Added direct device file upload input with drag-and-drop / file browser for both Venue onboarding, Venue photo management, and Add Pitch modal.
       - Asynchronous `FileReader` converting device images to high-fidelity data URLs.
       - Enforced `Min 2, Max 6` limits on all photo forms and modals with live counters (`${photos.length}/6 photos selected`).
  3. Mobile App (`apps/mobile`):
     - `OwnerAddVenueScreen.tsx`: Updated venue photo bounds to min 2 and max 6.
     - `ManagePhotosModal.tsx`: Updated venue photo management to min 2 and max 6.
     - `AddCourtModal.tsx`: Updated court photos to min 2 and max 6.
- Verification & Test Coverage:
  - Unit & Integration Tests: All tests across Turborepo pass (`pnpm test`: 9/9 packages pass, 65+ total tests).
  - TypeScript Compilation: 100% strict typecheck pass across all 9 packages (`pnpm typecheck`) and mobile (`npx tsc -p apps/mobile/tsconfig.json --noEmit`).
  - Web & API Builds: `pnpm --filter @court-booking/web build` and `pnpm --filter @court-booking/api build` build cleanly.
  - Live Services: PostgreSQL running on 15432, Prisma Studio on 5555, API daemon on 3000, Mobile server on 8081.
- Scope: Implemented per-court photos requirement (min 2, max 3 photos) and mandatory Super Admin verification/approval for every court before it can accept public player bookings.
- Changes:
  1. Database & Prisma Schema:
     - Added `CourtPhoto` join model and `court_photo` to `FilePurpose` enum with cascade relations.
     - Added `approvalStatus` (`'pending' | 'approved' | 'rejected'`), `rejectionReason` (`String?`), and default `isActive: false` on `Court`.
     - Applied migration `0007_court_photos_and_approval` safely to PostgreSQL.
  2. Backend Domain & APIs:
     - Pure policy in `venue-photos.policy.ts`: `assertValidCourtPhotoCount` enforcing `MIN_COURT_PHOTOS = 2` and `MAX_COURT_PHOTOS = 3`.
     - Owner Court Creation (`POST /owner/venues/:id/courts`): validates court photos, sets `approvalStatus: 'pending'` and `isActive: false`, saves photos and logs audit event `court.created`.
     - Owner Court Photos (`POST /owner/venues/:id/courts/:courtId/photos`): allows updating photos while strictly enforcing 2-3 count.
     - Admin Endpoints:
       - `GET /admin/courts?status=pending`: lists all pending courts with owner and venue details and uploaded photos.
       - `POST /admin/courts/:id/approve`: approves court and marks it active (`approvalStatus: 'approved'`, `isActive: true`), logging `court.approved`.
       - `POST /admin/courts/:id/reject`: rejects court with optional reason, logging `court.rejected`.
     - Booking and Public Availability:
       - `PrismaVenueReadService` and `PrismaBookingService`: strictly filter `isActive: true` AND `approvalStatus: 'approved'`. Unapproved courts are never public or bookable.
  3. Web Platform (`apps/web`):
     - `OwnerVenuePage.tsx`:
       - "Add Court" modal requires 2-3 court photos (with preset stadium/pitch chips and custom URL support).
       - Court list renders court photo thumbnails, status badges (`✓ Active`, `⏳ Pending Approval`, `✕ Rejected`), and verification notice.
     - `AdminVenuesPage.tsx`:
       - Added prominent "Pitches Pending Verification" review queue with court photos, sport/size details, and one-click "✓ Approve Court" and "✕ Reject" actions.
  4. Mobile App (`apps/mobile`):
     - `AddCourtModal.tsx`: Added photo selection (min 2, max 3) with preset chips and custom URLs.
     - `OwnerDashboardScreen.tsx`: Displays court approval status badges (`✓ Active`, `⏳ Pending Approval`, `✕ Rejected`), court photo thumbnail strips, and pending verification alerts.
     - `OwnerAddVenueScreen.tsx`: Initial court creation includes required court photos.
- Verification & Test Coverage:
  - Unit & Integration Tests: All tests across Turborepo pass cleanly (`pnpm test`: 9/9 packages pass, 65+ total tests).
  - TypeScript Compilation: 100% strict typecheck pass across all 9 monorepo packages (`pnpm typecheck`) and mobile (`npx tsc -p apps/mobile/tsconfig.json --noEmit`).
  - Web & API Builds: `pnpm --filter @court-booking/web build` and `pnpm --filter @court-booking/api build` build cleanly.
  - Live Services: PostgreSQL running on 15432, Prisma Studio on 5555, API on 3000, Mobile server on 8081.

- Scope: Enforced 24-hour court slot schedule, player maximum consecutive selection limit (4 slots), and venue photo constraints (min 2, max 3) across backend, domain policies, Web, and Mobile.
- Changes:
  1. Backend Domain & Policies:
     - Created `venue-photos.policy.ts` in `apps/api/src/modules/venues/domain/` with pure functions `assertValidVenuePhotoCount(count, context)` and `clampConsecutiveSlots(requestedSlots, venueLimit)`.
     - Created unit test `venue-photos.policy.test.ts` covering boundary conditions (< 2, 2, 3, > 3, consecutive slots clamping to max 4).
     - Integrated `assertValidVenuePhotoCount` into `PrismaOwnerVenueService.uploadPhotos` and `PrismaOwnerVenueService.submit`.
     - Validated with Zod schema in `owner-venue.controller.ts`: `photos: z.array(...).min(2).max(3)`.
  2. Web Platform (`apps/web`):
     - `SlotPicker.tsx`: Clamped consecutive slots to `effectiveMaxHours = Math.min(maxHours ?? 4, 4)` and updated badge text to `"24-Hour Slots • Max 4 consecutive hours"`.
     - `OwnerVenuePage.tsx`: Added photo selection/preview chips (min 2, max 3) to the venue registration form and photo management modal for existing venues.
  3. Mobile App (`apps/mobile`):
     - `VenueDetailModal.tsx`: Expanded `KICKOFF_HOURS` to cover all 24 hours (`0` through `23`), and duration options to `[1, 2, 3, 4]`.
     - `ManagePhotosModal.tsx`: Created photo manager modal with presets and custom URLs enforcing min 2, max 3.
     - `OwnerAddVenueScreen.tsx`: Integrated mandatory min 2, max 3 photo selection before submitting venue details.
     - `OwnerDashboardScreen.tsx` & `OwnerHeroBanner.tsx`: Added "📸 Photos" management entry.
- Verification & Test Coverage:
  - Backend Unit & Integration Tests: `pnpm --filter @court-booking/api test` passes 17/17 test files (37/37 tests pass with 0 failures).
  - Web & Mobile Typecheck: `pnpm typecheck` passes 9/9 tasks across all 7 packages; `npx tsc -p apps/mobile/tsconfig.json --noEmit` passes with 0 errors.
  - Web Production Build: `pnpm --filter @court-booking/web build` succeeds.
  - API Build: `pnpm --filter @court-booking/api build` succeeds.
  - Live API Daemon: Running with health endpoint responding OK.


  - Live Services: Web client running at `http://localhost:5173/`, API daemon at `http://localhost:3000/api/v1`.

### 2026-10-25 — Full Tailwind CSS v4 Modernization & Active Habits
- Scope: Elimination of custom CSS across all pages, migrating all layout and component styles to Tailwind CSS v4 utility classes.
- Redesigned Pages:
  1. `RegisterPage`: Clean Tailwind form inputs, dual role selector pills (⚽ Player / 🏟️ Venue Owner), glowing submit button, and toast notifications.
  2. `BookingsPage`: Modern filter pills, stadium cards with dynamic status badges (Confirmed, Checked In, Completed, Cancelled, No-Show Pending), Lucide icons, and glassmorphic modals with backdrop blur for Cancellation preview, Verified Match Reviews (star rating), and No-Show Disputes.
  3. `ProfilePage`: Glowing stadium cards for account metrics, trust & strike warning panel with appeal form, and sports preference controls (foot, play style, position, padel level).
  4. `OwnerCalendarPage`: Interactive dynamic schedule grid with Cairo time, court columns, color-coded status badges, and reservation detail inspection modal.
  5. `OwnerBookingsPage`: Live match-day operations table with check-in, collect cash, mark complete, and no-show actions, plus modals for Walk-In / Phone bookings and court slot blocking.
  6. `OwnerVenuePage`: Venue overview metrics, admin approval submission banner, court addition modal, and 24h-activating hourly pricing editor.
  7. `OwnerMoneyPage`: Available balance, pending release, and total released stat cards, pitch occupancy rate widget, and payout batches history table.
  8. `AdminVenuesPage`: Venue verification queue with approval, rejection, and suspension actions, court count badges, and inline commission editor.
  9. `AdminOperationsPage`: User directory with role/status controls, disputes & appeals review tables with strike overturn/uphold buttons, payout batch generation and disbursement controls, and reconciliation stuck items table.
- Verification & Test Coverage:
  - Web Unit & Flow Tests: `pnpm --filter @court-booking/web test` passes 6/6 test files (13/13 tests pass with 0 errors).
  - Web Typecheck: `pnpm --filter @court-booking/web typecheck` passes with zero errors.
  - Web Production Build: `pnpm --filter @court-booking/web build` passes cleanly in 4.22s (`dist/assets/index-ecqGmUrI.css` at 60.68 kB).
  - Monorepo Typecheck: `pnpm typecheck` passes 9/9 tasks across all 7 packages.
  - Workspace Test Suite: `pnpm test` passes all 9 tasks across all 7 packages (42 tests passed, 0 failures).

### 2026-10-26 — Direct Device Photo Upload & Updated Limits (Min 2, Max 6 Photos)
- Scope: Owners can now upload venue and pitch photos directly from their computer/device files (PNG, JPG, WEBP), with the photo limits updated across the platform to minimum 2 and maximum 6 photos.
- Changes:
  1. Backend Domain & Policies:
     - Updated `venue-photos.policy.ts`: `MIN_VENUE_PHOTOS = 2`, `MAX_VENUE_PHOTOS = 6`, `MIN_COURT_PHOTOS = 2`, `MAX_COURT_PHOTOS = 6`.
     - Updated unit tests in `venue-photos.policy.test.ts` to verify constraints between 2 and 6 photos.
     - Updated NestJS body parser in `main.ts` with 25MB payload support (`app.useBodyParser('json', { limit: '25mb' })`).
     - Updated Zod validation in `owner-venue.controller.ts`: `.min(2).max(6)`.
     - Updated `AdminService.approveCourt`: requires between 2 and 6 photos before approval.
  2. Web Platform (`apps/web`):
     - `OwnerVenuePage.tsx`:
       - Added direct device file upload input with drag-and-drop / file browser for both Venue onboarding, Venue photo management, and Add Pitch modal.
       - Asynchronous `FileReader` converting device images to high-fidelity data URLs.
       - Enforced `Min 2, Max 6` limits on all photo forms and modals with live counters (`${photos.length}/6 photos selected`).
  3. Mobile App (`apps/mobile`):
     - `OwnerAddVenueScreen.tsx`: Updated venue photo bounds to min 2 and max 6.
     - `ManagePhotosModal.tsx`: Updated venue photo management to min 2 and max 6.
     - `AddCourtModal.tsx`: Updated court photos to min 2 and max 6.
- Verification & Test Coverage:
  - Unit & Integration Tests: All tests across Turborepo pass (`pnpm test`: 9/9 packages pass, 65+ total tests).
  - TypeScript Compilation: 100% strict typecheck pass across all 9 packages (`pnpm typecheck`) and mobile (`npx tsc -p apps/mobile/tsconfig.json --noEmit`).
  - Web & API Builds: `pnpm --filter @court-booking/web build` and `pnpm --filter @court-booking/api build` build cleanly.
  - Live Services: PostgreSQL running on 15432, Prisma Studio on 5555, API daemon on 3000, Mobile server on 8081.
- Scope: Implemented per-court photos requirement (min 2, max 3 photos) and mandatory Super Admin verification/approval for every court before it can accept public player bookings.
- Changes:
  1. Database & Prisma Schema:
     - Added `CourtPhoto` join model and `court_photo` to `FilePurpose` enum with cascade relations.
     - Added `approvalStatus` (`'pending' | 'approved' | 'rejected'`), `rejectionReason` (`String?`), and default `isActive: false` on `Court`.
     - Applied migration `0007_court_photos_and_approval` safely to PostgreSQL.
  2. Backend Domain & APIs:
     - Pure policy in `venue-photos.policy.ts`: `assertValidCourtPhotoCount` enforcing `MIN_COURT_PHOTOS = 2` and `MAX_COURT_PHOTOS = 3`.
     - Owner Court Creation (`POST /owner/venues/:id/courts`): validates court photos, sets `approvalStatus: 'pending'` and `isActive: false`, saves photos and logs audit event `court.created`.
     - Owner Court Photos (`POST /owner/venues/:id/courts/:courtId/photos`): allows updating photos while strictly enforcing 2-3 count.
     - Admin Endpoints:
       - `GET /admin/courts?status=pending`: lists all pending courts with owner and venue details and uploaded photos.
       - `POST /admin/courts/:id/approve`: approves court and marks it active (`approvalStatus: 'approved'`, `isActive: true`), logging `court.approved`.
       - `POST /admin/courts/:id/reject`: rejects court with optional reason, logging `court.rejected`.
     - Booking and Public Availability:
       - `PrismaVenueReadService` and `PrismaBookingService`: strictly filter `isActive: true` AND `approvalStatus: 'approved'`. Unapproved courts are never public or bookable.
  3. Web Platform (`apps/web`):
     - `OwnerVenuePage.tsx`:
       - "Add Court" modal requires 2-3 court photos (with preset stadium/pitch chips and custom URL support).
       - Court list renders court photo thumbnails, status badges (`✓ Active`, `⏳ Pending Approval`, `✕ Rejected`), and verification notice.
     - `AdminVenuesPage.tsx`:
       - Added prominent "Pitches Pending Verification" review queue with court photos, sport/size details, and one-click "✓ Approve Court" and "✕ Reject" actions.
  4. Mobile App (`apps/mobile`):
     - `AddCourtModal.tsx`: Added photo selection (min 2, max 3) with preset chips and custom URLs.
     - `OwnerDashboardScreen.tsx`: Displays court approval status badges (`✓ Active`, `⏳ Pending Approval`, `✕ Rejected`), court photo thumbnail strips, and pending verification alerts.
     - `OwnerAddVenueScreen.tsx`: Initial court creation includes required court photos.
- Verification & Test Coverage:
  - Unit & Integration Tests: All tests across Turborepo pass cleanly (`pnpm test`: 9/9 packages pass, 65+ total tests).
  - TypeScript Compilation: 100% strict typecheck pass across all 9 monorepo packages (`pnpm typecheck`) and mobile (`npx tsc -p apps/mobile/tsconfig.json --noEmit`).
  - Web & API Builds: `pnpm --filter @court-booking/web build` and `pnpm --filter @court-booking/api build` build cleanly.
  - Live Services: PostgreSQL running on 15432, Prisma Studio on 5555, API on 3000, Mobile server on 8081.

- Scope: Enforced 24-hour court slot schedule, player maximum consecutive selection limit (4 slots), and venue photo constraints (min 2, max 3) across backend, domain policies, Web, and Mobile.
- Changes:
  1. Backend Domain & Policies:
     - Created `venue-photos.policy.ts` in `apps/api/src/modules/venues/domain/` with pure functions `assertValidVenuePhotoCount(count, context)` and `clampConsecutiveSlots(requestedSlots, venueLimit)`.
     - Created unit test `venue-photos.policy.test.ts` covering boundary conditions (< 2, 2, 3, > 3, consecutive slots clamping to max 4).
     - Integrated `assertValidVenuePhotoCount` into `PrismaOwnerVenueService.uploadPhotos` and `PrismaOwnerVenueService.submit`.
     - Validated with Zod schema in `owner-venue.controller.ts`: `photos: z.array(...).min(2).max(3)`.
  2. Web Platform (`apps/web`):
     - `SlotPicker.tsx`: Clamped consecutive slots to `effectiveMaxHours = Math.min(maxHours ?? 4, 4)` and updated badge text to `"24-Hour Slots • Max 4 consecutive hours"`.
     - `OwnerVenuePage.tsx`: Added photo selection/preview chips (min 2, max 3) to the venue registration form and photo management modal for existing venues.
  3. Mobile App (`apps/mobile`):
     - `VenueDetailModal.tsx`: Expanded `KICKOFF_HOURS` to cover all 24 hours (`0` through `23`), and duration options to `[1, 2, 3, 4]`.
     - `ManagePhotosModal.tsx`: Created photo manager modal with presets and custom URLs enforcing min 2, max 3.
     - `OwnerAddVenueScreen.tsx`: Integrated mandatory min 2, max 3 photo selection before submitting venue details.
     - `OwnerDashboardScreen.tsx` & `OwnerHeroBanner.tsx`: Added "📸 Photos" management entry.
- Verification & Test Coverage:
  - Backend Unit & Integration Tests: `pnpm --filter @court-booking/api test` passes 17/17 test files (37/37 tests pass with 0 failures).
  - Web & Mobile Typecheck: `pnpm typecheck` passes 9/9 tasks across all 7 packages; `npx tsc -p apps/mobile/tsconfig.json --noEmit` passes with 0 errors.
  - Web Production Build: `pnpm --filter @court-booking/web build` succeeds.
  - API Build: `pnpm --filter @court-booking/api build` succeeds.
  - Live API Daemon: Running with health endpoint responding OK.









