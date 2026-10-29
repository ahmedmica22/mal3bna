CREATE TABLE "RefreshTokenHistory" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "consumed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshTokenHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RefreshTokenHistory_token_hash_key" ON "RefreshTokenHistory"("token_hash");
CREATE INDEX "RefreshTokenHistory_sessionId_idx" ON "RefreshTokenHistory"("sessionId");

ALTER TABLE "RefreshTokenHistory"
ADD CONSTRAINT "RefreshTokenHistory_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
