# Court Booking Platform

An Egypt-focused football and padel booking marketplace with venue management, a super-admin web panel, and one player/owner mobile app.

**Current status:** API, React/Vite web, and Expo mobile implementations are present. See [progress.md](progress.md) for verified results and remaining acceptance work, and [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) for the component/layer structure. Build and regression evidence does not certify every product milestone or production readiness.

## Documents

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Agent entry point, reading order and working procedure |
| `Agent/project-context.md` | Quick product, architecture and current-state briefing |
| `Agent/court-booking-platform-spec.md` | Authoritative full product/build specification |
| `Agent/skills.md` | Required technical expertise and practices |
| `Agent/goals.md` | Scope and acceptance criteria |
| `Agent/rules.md` | Architecture, security and coding requirements |
| `Agent/implementation-plan.md` | Backend, web and mobile task checklists |
| `decisions.md` | Pending questions and approved decision history |
| `progress.md` | Verified state, blockers and next action |
| `.env.example` | Proposed environment variables; no real secrets |

Keep `AGENTS.md`, `README.md`, `.env.example`, `decisions.md`, and `progress.md` at the repository root. Keep the six planning documents inside `Agent/`. Give the coding agent `AGENTS.md` first and instruct it to read all linked documents.

## Stack and layout

TypeScript; pnpm workspaces and Turborepo; NestJS modular monolith; PostgreSQL/Prisma (for database, transactional outbox, and job queues); React/Vite; Expo. Shared contracts, generated API client, translations and config live in `packages/shared`, `packages/api-client`, `packages/i18n`, `packages/config`. Applications live in `apps/api`, `apps/web`, `apps/mobile`. API and worker run as separate processes.

Kashier is behind a PaymentGateway interface. Use FakeGateway locally until sandbox integration is available. Currency is EGP; stored amounts are integer piastres; display in Africa/Cairo time. English defaults with Arabic/RTL support.

## Setup contract for M1 — not runnable yet

Install a compatible Node.js release, pnpm, Docker/Compose and Git. During M1, pin tested versions in package.json/packageManager, engine constraints and the lockfile; avoid relying on a globally installed latest version.

Copy the configuration template using the command for your shell:

```powershell
Copy-Item .env.example .env
```

```bash
cp .env.example .env
```

Fill required local values privately. Proposed Compose service names are `postgres` and `mailpit`; align them with the implementation. The DATABASE_URL example assumes commands run on the host; containers need service hostnames instead of localhost.

The coding agent should implement and document these root scripts, or replace this table with actual verified equivalents:

| Proposed command | Intended purpose | Available now? |
| --- | --- | --- |
| `pnpm install` | Install workspace dependencies | No package manifest yet |
| `docker compose up -d postgres mailpit` | Start local backing services | Compose file built |
| `pnpm db:migrate` | Apply development migrations | Script built |
| `pnpm db:seed` | Create deterministic local fixtures | Script built |
| `pnpm dev:api` | Start NestJS API | Script built |
| `pnpm dev:worker` | Start worker (Postgres outbox/jobs) | Script built |
| `pnpm dev:web` | Start Vite web app when scaffolded | Script built |
| `pnpm dev:mobile` | Start Expo development workflow when scaffolded | Script built |
| `pnpm lint` / `pnpm typecheck` / `pnpm format:check` | Static checks | Scripts built |
| `pnpm architecture:check` | Validate dependency boundaries | Script built |
| `pnpm test` / `pnpm test:integration` / `pnpm test:authorization` | Backend verification | Scripts built |
| `pnpm openapi:generate` / `pnpm client:generate` | Generate contracts and client | Scripts built |
| `pnpm build` | Build affected apps/packages | Script built |

Never use a destructive reset against staging/production. Keep seed data and test identities local/staging only. Create admins through the implemented CLI, with credentials supplied securely; never document a reusable admin password.

## Planned local addresses

These are template defaults, not running services: API `http://localhost:3000/api/v1`; web `http://localhost:5173`; Mailpit UI proposed `http://localhost:8025`; Postgres 15432 (or 5432). Map actual Compose ports and document the implemented OpenAPI/health URLs during M1.

A physical phone needs a reachable host address or development tunnel, not localhost. Expo requires a development build for native modules. Provider webhook delivery needs a reachable HTTPS endpoint. Separate test/live keys and all backing resources per environment.

## Workflow and verification

Follow M1–M10, W1–W6, P1–P5, with the source-authorized early mobile build and M4 thin client slice. Start with M1 now. Resolve decisions before their dependent tasks, and update progress.md after work.

Every milestone requires relevant passing tests, lint/types/architecture checks, updated contracts, a CHANGELOG entry and demo evidence. Financial verification includes source refund/ledger cases, concurrency and replay tests. FakeGateway tests do not satisfy real Kashier sandbox acceptance.

## Configuration and production

.env.example is a proposed configuration contract. Implement Zod startup validation, remove unused fields and require enabled-adapter settings. Commit no real secrets. VITE_* and EXPO_PUBLIC_* are public build values. Keep business constants centrally in code/config as the source requires.

Use source section 10 for staging, CI/CD, separate API/worker processes, release migrations, manual production approval, rollback, alerts and backups. The launch checklist in section 14 remains mandatory. Production hosting/provider choices and live credentials are not established by these documents.
