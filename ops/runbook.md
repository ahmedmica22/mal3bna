# Local and staging operations runbook

## Services

Start local dependencies with `docker compose up -d`. PostgreSQL is exposed on
host port `15432` in this workspace; Mailpit uses `8025` and
`1025`. Verify with `docker compose ps` and require PostgreSQL/Mailpit health.

## Release sequence

1. Validate environment variables without printing secrets.
2. Run `pnpm --filter @court-booking/api exec prisma validate`.
3. Run `pnpm db:migrate`.
4. Run `pnpm db:seed` only for development/staging fixtures.
5. Run format, typecheck, lint, architecture, tests, build, and OpenAPI generation.
6. Start API and worker separately and verify `/health`.

## Recovery

Take a PostgreSQL logical backup with `pg_dump`, store it outside the database
container, and restore into a fresh database with `pg_restore`. Never delete
the active database to test recovery. Failed refunds remain in `Refund` with a
stable idempotency key and are retried by the booking job runner.

## Security

Do not log passwords, tokens, signatures, complete payment payloads, or secrets.
Rotate JWT and provider credentials through the deployment secret store.
