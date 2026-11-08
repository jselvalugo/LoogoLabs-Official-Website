-- Scheduled email blasts. status 'scheduled' + scheduled_at: the email-worker
-- queues the blast once scheduled_at has passed. schedule_error keeps the
-- reason a scheduled blast went back to draft (e.g. its list was empty).
ALTER TABLE "crm_email_campaigns" ADD COLUMN IF NOT EXISTS "scheduled_at" timestamptz;
ALTER TABLE "crm_email_campaigns" ADD COLUMN IF NOT EXISTS "schedule_error" text;
CREATE INDEX IF NOT EXISTS "crm_email_campaigns_scheduled_idx" ON "crm_email_campaigns" ("scheduled_at") WHERE "status" = 'scheduled';
