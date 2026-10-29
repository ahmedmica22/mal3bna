# Staging preparation checklist

## Local release gate

1. Copy `ops/staging.env.example` to a secret-managed staging environment.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm --filter @court-booking/api prisma:generate`.
4. Run `pnpm db:migrate`.
5. Run `pnpm db:seed` only for a disposable staging database.
6. Run `pnpm build`, `pnpm openapi:generate`, and `node scripts/staging-smoke.mjs`.
7. Run the backup and restore drill from `ops/runbook.md`.
8. Confirm logs redact credentials, tokens, passwords, and payment payloads.

## Deployment and rollback

- Deploy the API and worker from the same immutable build artifact.
- Apply backward-compatible migrations before switching traffic.
- Verify `/api/v1/health`, auth registration, public venue search, and a FakeGateway booking smoke flow.
- Roll back application traffic to the previous artifact if smoke fails.
- Do not roll back an applied migration destructively. Use the documented forward-fix migration or restore a verified database backup during an approved recovery event.

## External pending items

- Remote staging host, DNS, managed database, mail sender, monitoring, and backup credentials are not available locally.
- Kashier sandbox credentials and provider contract details are required for provider acceptance only.
