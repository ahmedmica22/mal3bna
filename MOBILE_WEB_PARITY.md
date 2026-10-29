# Mobile alignment with the web

Implemented 2026-10-26. React Native/Expo remains the mobile application; no web page is embedded.

## Shared experience

- Charcoal/green/lime dark palette and mint/forest-green light palette match the web direction.
- `MobileDesign.tsx` supplies themed screens, panels, typography, labelled fields, actions and modal sheets. Copy is centralized in `constants/interface-copy.ts` for English/Arabic.
- Window-driven venue grids use one, two or three columns. Main content supports tablet widths instead of a fixed 640px canvas. Compact phones and large font settings reduce the statistics grid. Sheets use available height, scrollable content, keyboard avoidance and safe-area padding. Orientation is no longer locked to portrait.
- Header controls and bottom navigation have accessible labels and minimum touch targets. Arabic layouts use text alignment and directional containers. Settings and profile no longer contain browser-only `div` elements.

## Player journey

1. Browse/search venues and filter sport without signing in.
2. Open a venue, select a court/date/start time and consecutive hours using server availability. A server quote is required before checkout; local deposit and price estimates were removed.
3. Sign in when checkout requires it; retain the selected booking details and return to checkout after a player login. Demo-login buttons are removed from the auth view. Mobile rejects admin accounts.
4. Review court size, price, deposit/full-payment choice, Cairo kickoff and payment disclaimer. Create with a stable idempotency key, then invoke the existing development FakeGateway endpoint. Only a server-confirmed result opens confirmation. A failed payment leaves the reservation available for retry within checkout, with its authoritative hold-expiry countdown and inline error.
5. Open booking history with all/upcoming/completed filters. Cancellation loads `/player/bookings/:id/cancel-preview`; no client refund policy or guaranteed-refund message is used. Profile preference changes now call the API.

## Owner daily operations

- Overview shows API-reported earnings, available/pending balances, collected cash and real venue/booking figures. The placeholder 85% occupancy and invented balance fallback were removed.
- Overview/Schedule tabs expose a date/court-filtered agenda in Cairo time, including overnight reservations and blocks. Match-day actions retain backend authorization and validation.
- Walk-ins explicitly select a court and available hourly slot, customer details and price. The form keeps its state on failure and closes only when the API acknowledges saving. It no longer silently chooses the first court and next hour.
- Advanced setup/reporting and the admin application remain governed by the specification's web-only boundaries. This slice does not certify full W/P milestone parity.

## Configuration and verification

`EXPO_PUBLIC_API_URL` takes precedence. Otherwise the native client derives the LAN host from Expo; Android emulator/iOS simulator defaults remain available. The hard-coded personal LAN address and public tunnel fallback were removed. See `apps/mobile/.env.example` for tunnel/development-build configuration. No dependency upgrade, API/schema migration or lockfile change was required.

Static checks run with the installed Node 22 runtime from the repository root:

```powershell
node node_modules/typescript/bin/tsc -p apps/mobile/tsconfig.json --noEmit
node apps/api/node_modules/eslint/bin/eslint.js apps/mobile/src apps/mobile/App.tsx --max-warnings 0
node scripts/check-client-architecture.mjs
node node_modules/prettier/bin/prettier.cjs --check apps/mobile/src apps/mobile/app.json
```

Android export uses the installed Expo CLI from `apps/mobile` with `EXPO_OFFLINE=1`, `CI=1`, and `TEMP`/`TMP` pointing to `.expo/responsive-tmp`. The normal sandbox temp directory denied Hermes permission to write `index.hbc`; the workspace-local temp directory resolves that environment failure without changing the compiler or disabling Hermes.

```powershell
# Working directory: apps/mobile
$env:TEMP = (Resolve-Path .expo/responsive-tmp).Path
$env:TMP = $env:TEMP
$env:EXPO_OFFLINE = '1'
$env:CI = '1'
node node_modules/expo/bin/cli export --platform android --output-dir 'C:/Users/Ahmed/.codex/visualizations/2026/10/25/01a17243-f67b-7c10-8914-a4aa7ef37cd8/mobile-responsive-export'
```

Final result: Android bundled 705 modules in 10.173 seconds and emitted a 1.8 MB Hermes bundle and metadata. Mobile TypeScript, lint and changed-source formatting passed; the client architecture check passed across 343 source files.

No automated tests were added or run, following the user's instruction. A successful export/typecheck is not a native-device or full journey acceptance test. Phone/tablet visual review, keyboard/rotation/RTL interaction review, secure session persistence/refresh, notification/deep-link acceptance and real Kashier verification remain separate work. Existing legacy mobile flows outside this slice are not declared complete.
