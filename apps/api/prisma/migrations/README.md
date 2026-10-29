# Migration policy

`schema.prisma` is the typed model. The SQL migration owns PostgreSQL features Prisma cannot model: extensions, exclusion constraints, partial indexes, checks and immutable-row triggers. Review generated SQL against the hand-written foundation before applying it to a real database.

## Idempotency storage design

`IdempotencyRecord` scopes a client key to an actor and operation, hashes the request payload, and stores an in-progress/succeeded/failed outcome with the replay response. The unique `(actor_scope, operation, idempotency_key)` constraint prevents duplicate effects. `expires_at` and the in-progress state are storage foundations only; retention, mismatch, and concurrent in-flight outcomes remain pending under D11 and are not selected here.
