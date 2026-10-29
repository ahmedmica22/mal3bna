# Court Booking Platform — Decision Register

Updated 2026-10-25.

## Authority

D01–D12 below are **APPROVED** by the project owner on 2026-10-25. They clarify and amend the affected parts of `Agent/court-booking-platform-spec.md`. The specification and companion documents have been synchronized with these decisions.

Future changes require a new dated decision. Do not silently reinterpret an approved boundary or replace it with an older conversation requirement.

## Approved decisions

### D01 — Exact 24-hour cancellation

- Status: APPROVED
- Decision: A player cancellation is free when `bookingStart - cancellationTime >= 24 hours`. Exact equality qualifies.
- Result: Refund everything paid; charge no commission.
- Required tests: Just before, exactly at, and just after the 24-hour boundary.
- Affected work: M5 cancellation policy and client cancellation copy.

### D02 — Late cancellation after full payment

- Status: APPROVED
- Decision: For a player cancellation less than 24 hours before start, the 30% deposit is retained. Any amount paid above the deposit is refunded.
- Result: Deposit payment receives no refund; full payment receives a 70% refund.
- Required tests: Deposit and full-payment cases on both sides of the boundary.
- Affected work: M5, W2, P2.

### D03 — Confirmed no-show after full payment

- Status: APPROVED
- Decision: A confirmed no-show retains only the 30% deposit. Any amount paid above the deposit is refunded.
- Result: Deposit payment receives no refund; full payment receives a 70% refund.
- Required tests: Deposit/full payments, refund retry, and ledger effects.
- Affected work: M5–M6.

### D04 — No-show report, dispute, strike, and release timing

- Status: APPROVED
- Decision:
  - The owner may report a no-show from 15 minutes after the booking starts until 24 hours after it ends.
  - A report is pending, immediately notifies the player, and opens a 48-hour dispute window measured from the report notification.
  - With no dispute, the no-show and its single strike become final when the 48-hour window expires.
  - With a dispute, the no-show and strike become final only if the admin upholds it. An overturned report creates no active strike.
  - Funds are never released before the booking ends. For an undisputed report, release occurs after both the booking end and dispute deadline. For a disputed report, release waits for the admin decision and any required refund.
- Required tests: Earliest/latest report, disputed/undisputed paths, strike timing, notification timestamp, and release timing.
- Affected work: M5–M9.

### D05 — Completion timing

- Status: APPROVED
- Decision: An owner may mark a booking complete only at or after its scheduled end. Completion and any associated release cannot occur before the end.
- Required tests: One instant before, exactly at, and after the scheduled end.
- Affected work: M5 and M7.

### D06 — Password change session revocation

- Status: APPROVED
- Decision: Changing a password revokes every session, including the current one. The user must sign in again on every device.
- Required tests: Current and other web/mobile sessions become unusable.
- Affected work: M2.

### D07 — Blocked-player access

- Status: APPROVED
- Decision: Four active strikes block creation of new bookings only. The player can still sign in, view/manage existing bookings subject to normal policies, access profile and inbox, and submit/view an appeal. Clients display a persistent block notice.
- Required tests: All allowed reads/actions remain available; booking creation returns `PLAYER_BLOCKED`.
- Affected work: M6, W1–W2, P1–P2.

### D08 — Manual-booking commission

- Status: APPROVED
- Decision: Phone/walk-in manual bookings incur no platform commission because the platform did not acquire or process the customer/payment.
- Result: They block availability and appear in operational/occupancy reports, but create no payment, refund, commission, venue-balance, or payout ledger entries.
- Required tests: Slot overlap/reporting behavior and absence of money effects.
- Affected work: M5, M7, M8.

### D09 — Changes to approved venues

- Status: APPROVED
- Decision:
  - Location and sport changes require admin reapproval and take effect only after approval. Existing approved public values remain active while the revision is pending.
  - Name, description, phone, and photos update immediately and are audit-logged.
  - Price changes follow the approved 24-hour delayed activation.
  - Opening-hour changes may not invalidate an existing reservation; reject a conflicting change unless the owner uses the closure workflow.
  - A court cannot be archived while it has future active reservations. The owner must preview affected bookings, confirm closure, issue full refunds, and then block/archive the court.
- Required tests: Pending revision visibility, conflicts, closure preview, bulk cancellation/refunds, and audit.
- Affected work: M7–M8.

### D10 — Multiple browser tabs and accounts

- Status: APPROVED
- Decision: One browser profile has one active platform session/account. Logging in as another account synchronizes the identity change across tabs, clears account-specific caches, and redirects each tab to an allowed route for the new role. Simultaneous roles require separate browser profiles or an incognito session.
- Required tests: Cross-tab login/logout/account change, cache clearing, and role redirects.
- Affected work: W1.

### D11 — Technical limits and deterministic behavior

- Status: APPROVED
- Decision:
  - Keep idempotency records for at least 24 hours.
  - Same key, actor, operation, and request hash returns the stored response.
  - Reusing a key with a different request returns HTTP 409 with `IDEMPOTENCY_KEY_REUSED`.
  - A matching request still in progress returns HTTP 409 with `IDEMPOTENCY_IN_PROGRESS` and a retry hint.
  - Calculate percentage money with integer arithmetic and round half up to the nearest piastre. Derive refunds from frozen booking amounts so components reconcile exactly.
  - Minimum password length is 8 for players/owners and 12 for admins; reject commonly compromised passwords.
  - Access tokens last 15 minutes, refresh sessions 30 days, password-reset links 30 minutes, and email-verification links 24 hours. Verification/reset tokens are hashed and single-use.
  - Images: JPEG, PNG, or WebP up to 10 MiB. Private proof/evidence documents: PDF, JPEG, or PNG up to 20 MiB. Validate detected content, declared type, size, purpose, and ownership.
- Required tests: Idempotency replay/mismatch/in-progress/expiry; rounding boundaries; password/link expiry; upload type/size/authorization.
- Affected work: M1–M5 and files.

### D12 — Refund failure before release

- Status: APPROVED
- Decision: If a required refund is pending or failed, keep all affected money in `HELD`. Do not recognize commission or venue balance until the refund succeeds. After success, post the refund and the remaining release atomically/idempotently. Retry safely and escalate repeated failures to the admin.
- Required tests: Failure/retry/crash cases, no premature payout, unique effects, and HELD reconciliation.
- Affected work: M5 and M9.

### Client brief approval — 2026-10-25

- The owner approved the new web/mobile STEP 0 plan and milestone order: workspace/mock foundation, W1–W6, then P1–P5.
- D01–D12 remain authoritative, including exact-24-hour free cancellation and refunding amounts above the deposit on late cancellation.
- Forgot/reset-password client screens remain excluded. Backend recovery endpoints are retained; no OTP or manual verification-token form is introduced.
- The approved client brief's stadium-at-night dark/lime design supersedes earlier light-first client guidance. Backend business rules remain unchanged.

## Remaining provisional assumptions (unchanged)

These are unchanged from specification section 15 and are not D01–D12 conflicts:

| Topic | Current default |
| --- | --- |
| Gateway/refund fees | Platform absorbs them |
| Payout schedule | Weekly from released funds |
| Commission maximum | 20%; minimum 10% |
| Fawry | Excluded from v1 |
| Padel slots | 60 minutes |
| Refresh lifetime | 30 days |
| Late-cancel deposit release | After any required refund succeeds |
| Payout method | Manual bank transfer, InstaPay, or wallet; validate with venues |
| Arabic digits | Latin digits |
| Payment-identity blocking | Only if Kashier provides a suitable identifier |
| Price activation delay | 24 hours |

## External confirmation gates

- Kashier: permission to hold venue funds, settlement timing, refund fees/limits, webhook signatures/retries, payout capabilities, and payment-identity availability.
- Infrastructure: email/storage/hosting providers, region, expected traffic, and performance budget.
- Release: legal/accounting review, verified sender domain, live credentials, store accounts, and review requirements.

