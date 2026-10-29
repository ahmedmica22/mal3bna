ALTER TABLE "Notification" ADD COLUMN "outbox_event_id" UUID;
CREATE UNIQUE INDEX "Notification_outbox_event_id_key" ON "Notification"("outbox_event_id");
