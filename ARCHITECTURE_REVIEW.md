# Workspace architecture review and refactor

Verified: 2026-10-26. Scope: existing React web pages, Expo screens, shared client boundaries, and affected API dependencies. This is structural verification, not certification that all product milestones are complete.

## Findings and changes

| Area            | Previous responsibility mix                                                                          | Implemented structure                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Web routes      | Queries, mutations, state, forms, tables, dialogs, and layout in the same page                       | Thin route composition; feature hooks, typed view models, views, and substantial sections                  |
| Player          | Discovery, venue selection, checkout, booking management, profile, and settings mixed with rendering | Separate `features/player` modules, plus auth and shared payment components                                |
| Owner           | Venue onboarding/configuration, calendar, booking actions, money, and profile in large pages         | Separate owner features; onboarding hook, booking rows, form sections, and dialogs                         |
| Admin           | Approval, booking inventory, users, disputes, payouts, and reconciliation in large pages             | Separate admin features with table rows, operational sections, and view composition                        |
| Role navigation | Repeated owner/admin shells and desktop/mobile links                                                 | Shared `DashboardLayout`, role navigation configuration, `NavigationLinks`, `AppBrand`, and header actions |
| Common UI       | Repeated modal keyboard behavior, inputs, settings buttons, photo rendering                          | Shared `Dialog`, `TextField`, `SectionTabs`, `PhotoStrip`, `PageTemplate`, and status badges               |
| Web API/types   | One large service and domain-type module                                                             | Domain API modules with one session transport; grouped type modules and compatibility barrels              |
| Route loading   | Eager imports for every role                                                                         | Lazy page imports and a translated Suspense state                                                          |
| Mobile          | App orchestration and large screen/modal bodies                                                      | Feature controllers/model builders, explicit contracts, views, sections, and separate style modules        |
| API venue reads | Application and public controller depended on a concrete Prisma adapter                              | Application `VenueReader` port; module wiring selects the Prisma implementation                            |
| Booking jobs    | Prisma orchestration inside the application layer                                                    | Job orchestration moved to infrastructure                                                                  |

## How to add or change a page

```text
web/src/pages/<role>/ExamplePage.tsx
  -> features/<role>/<feature>/hooks/useExamplePage.tsx
  -> features/<role>/<feature>/views/ExampleContent.tsx
       -> components/MeaningfulSection.tsx
       -> shared components/forms, ui, feedback, layout

feature hook -> services/<domain>.api.ts -> services/http.ts
                                         -> packages/api-client
```

The route selects the view state and composes it. The hook owns server state, actions, and page state. Views and sections receive typed props and do not fetch data. Feature types derive from controller results; shared transport/DTO types live outside rendering code. Shared primitives own reusable interaction behavior, while each feature owns its form submission and business-facing copy. Backend rules remain server-side.

For mobile, existing screen exports remain stable. Stateful behavior belongs in feature hooks; pure screen-model builders use `create…Model` names rather than hook names. Screen sections receive explicit contracts and use the feature style module. Small existing presentational screens remain components; a new folder is not required for every component.

Use shared UI when the interaction or visual responsibility is actually repeated. Do not add one-element wrappers simply to reproduce a directory diagram. Settings, for example, composes its sidebar and four functional panels directly.

## Enforced boundaries

- `scripts/check-client-architecture.mjs` scans web/mobile TypeScript source. Routes and feature views/components cannot import services or TanStack Query, call `fetch`, or import backend/Prisma implementation. Feature hooks cannot contain JSX. Web route files have a composition-size guard.
- The root `architecture:check` command includes this scanner and the existing API check.
- API architecture tests scan all domain folders for framework/upward imports and all application folders for Prisma/infrastructure/presentation imports.
- Strict typing and lint now pass across API, web, mobile, the API client, and i18n. Unsafe mobile error casts and integration-test `any` placeholders were removed.
- `Dialog` owns focus trapping, Escape, scroll locking, and trigger focus restoration. `TextField` associates labels, errors, and hints. `SectionTabs` implements keyboard navigation and RTL-aware arrows.
- `.gitignore` excludes generated output, local environment values, caches, and installed dependencies.

These checks cover the stated patterns, not every possible transitive dependency or architectural violation. Flat legacy backend modules outside named layers still need use-case/port separation.

## Verification evidence

Commands use the installed Node 22 runtime directly with the repository's installed tooling. No dependency installation or version upgrade was required.

| Working directory     | Command (prefix `node`)                                                                                                                                               | Result                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `apps/web`            | `node_modules/vitest/vitest.mjs run --maxWorkers=2`                                                                                                                   | 32 tests passed in 15 files                                                                     |
| `apps/api`            | `--env-file=.env node_modules/vitest/vitest.mjs run --reporter=dot --maxWorkers=2` with `RUN_INTEGRATION=1`                                                           | 56 tests passed in 25 files; database/Mailpit integrations enabled                              |
| root                  | `node_modules/typescript/bin/tsc -p apps/{web,mobile,api}/tsconfig.json --noEmit` (one command per app)                                                               | All three passed                                                                                |
| root                  | `apps/api/node_modules/eslint/bin/eslint.js apps/api/src apps/web/src apps/mobile/src apps/mobile/App.tsx packages/api-client/src packages/i18n/src --max-warnings 0` | Passed, including tests                                                                         |
| root                  | `scripts/check-client-architecture.mjs`                                                                                                                               | Passed; routes, presentation imports, and JSX-free controllers checked                          |
| `apps/api`            | `node_modules/@nestjs/cli/bin/nest.js build`, then `dist/openapi/generate.js`                                                                                         | API build and OpenAPI generation passed                                                         |
| root                  | `scripts/generate-api-client.mjs`                                                                                                                                     | Generated metadata for 22 contract routes                                                       |
| root                  | `node_modules/typescript/bin/tsc -p packages/api-client/tsconfig.json`, then `-p packages/i18n/tsconfig.json`                                                         | Both package builds passed; i18n emits ESM                                                      |
| `packages/api-client` | `--test tests/*.test.mjs`                                                                                                                                             | 11 tests passed, including refresh concurrency, identity isolation, and reproducible generation |
| root                  | `apps/web/node_modules/vite/bin/vite.js build apps/web`                                                                                                               | Production build passed; lazy page chunks replace the previous oversized entry                  |
| `apps/mobile`         | `fake-gateway-proof.test.mjs`                                                                                                                                         | Success, failure, pending, and retry assertions passed                                          |
| `apps/mobile`         | `node_modules/expo/bin/cli export --platform android --output-dir <external evidence directory>` with `EXPO_OFFLINE=1 CI=1`                                           | Android production bundle exported; 714 modules, Hermes bundle about 1.8 MB                     |

Workspace formatting: `node node_modules/prettier/bin/prettier.cjs --check .` passed. An initial fully parallel verification run exceeded the default five-second timeout in checkout, auth, and venue tests. The complete suites subsequently passed with `--maxWorkers=2` (web 32/32 in 15.55 seconds, API 56/56 in 8.36 seconds); no assertion was removed and timeouts were not increased.

New shared-UI tests exercise labelled validation, dialog focus/escape/restoration, and tab keyboard selection. Existing tests cover checkout/payment retry, slot selection, auth restoration/guards, owner actions, admin actions, localization, and layout composition. Database regression tests run against the existing local schema; no migration or destructive seed was needed for a structural refactor.

## Remaining engineering work

1. Audit and extend the generated API contract: it currently documents 22 routes and does not prove coverage of every controller operation. Compatibility service/type barrels intentionally preserve existing callers.
2. Separate the large flat admin, trust, notifications, and reviews persistence services into explicit application use cases and ports, with behavior tests before moving financial or trust logic. The booking persistence adapter also remains substantial.
3. Replace the mobile legacy LAN/tunnel fallback transport with the shared session client and secure refresh-token storage. The existing mobile auth/API behavior was preserved; an Android export does not prove secure session, native-device, push, or store acceptance.
4. Continue the feature-acceptance audit rather than relying on stale milestone summary tables. Full browser journeys, responsive visual comparisons, real-device verification, Kashier sandbox acceptance, and remote staging verification were not performed by this refactor.
5. Consolidate remaining one-off visual tokens and complete translation coverage under their own UI acceptance checks. File extraction alone does not establish localization completeness.

Next task: inventory every controller operation against generated OpenAPI and add missing typed contracts before replacing compatibility DTOs or changing mobile session behavior. Keep that work separate from this verified structural change.
