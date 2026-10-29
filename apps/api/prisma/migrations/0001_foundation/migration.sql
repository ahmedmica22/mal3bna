CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prisma creates the tables from schema.prisma. These foundations are deliberately
-- hand-written because Prisma cannot express the invariants below.
CREATE OR REPLACE FUNCTION reject_immutable_row_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'immutable table: %', TG_TABLE_NAME; END; $$;

CREATE INDEX IF NOT EXISTS users_email_lower_idx ON "User" (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS player_phone_unique_idx ON "User" (phone) WHERE role = 'player' AND phone IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS active_appeal_per_player_idx ON "Appeal" ("playerId") WHERE status = 'open';
CREATE UNIQUE INDEX IF NOT EXISTS active_reservation_code_idx ON "Reservation" (booking_code) WHERE status <> 'cancelled' AND status <> 'expired';
CREATE INDEX IF NOT EXISTS held_expiry_idx ON "Reservation" (hold_expires_at) WHERE status = 'held';
CREATE INDEX IF NOT EXISTS reminder_start_idx ON "Reservation" (starts_at) WHERE status IN ('confirmed', 'arrived');

ALTER TABLE "Reservation" ADD CONSTRAINT reservation_no_overlap EXCLUDE USING gist (
  "courtId" WITH =,
  tstzrange(starts_at AT TIME ZONE 'UTC', ends_at AT TIME ZONE 'UTC') WITH &&
) WHERE (status IN ('held','confirmed','arrived','completed','no_show'));

ALTER TABLE "Venue" ADD CONSTRAINT venue_commission_range CHECK (commission_bp BETWEEN 1000 AND 2000);
ALTER TABLE "Venue" ADD CONSTRAINT venue_max_hours_positive CHECK (max_hours_per_booking > 0);
ALTER TABLE "Court" ADD CONSTRAINT football_size_required CHECK (sport <> 'football' OR size IN (5, 7, 11));
ALTER TABLE "OpeningHour" ADD CONSTRAINT opening_hour_range CHECK (day_of_week BETWEEN 0 AND 6 AND open_minute BETWEEN 0 AND 1439 AND close_minute > open_minute AND close_minute <= 2880);
ALTER TABLE "PriceRule" ADD CONSTRAINT price_rule_range CHECK (day_of_week BETWEEN 0 AND 6 AND start_minute BETWEEN 0 AND 1439 AND end_minute > start_minute AND end_minute <= 2880 AND price_piastres >= 0);
ALTER TABLE "Review" ADD CONSTRAINT review_rating_range CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE "LedgerEntry" ADD CONSTRAINT ledger_nonzero CHECK (amount_piastres <> 0);

CREATE TRIGGER ledger_immutable BEFORE UPDATE OR DELETE ON "LedgerEntry" FOR EACH ROW EXECUTE FUNCTION reject_immutable_row_change();
CREATE TRIGGER audit_immutable BEFORE UPDATE OR DELETE ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION reject_immutable_row_change();
