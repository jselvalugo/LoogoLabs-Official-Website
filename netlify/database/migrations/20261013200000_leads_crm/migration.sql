-- Turns the leads table into a lightweight CRM: pipeline stage (the existing
-- `status` column), deal value, next follow-up date, contact fields the admin
-- can fill in, and a per-lead activity timeline (notes, calls, emails, stage
-- changes). `notes` stays the visitor's own submission details, untouched.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "company" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "deal_value" numeric;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "follow_up_at" timestamp;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
UPDATE "leads" SET "status" = 'new' WHERE "status" IS NULL;

CREATE TABLE IF NOT EXISTS "lead_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"lead_id" uuid NOT NULL REFERENCES "leads" ("id") ON DELETE CASCADE,
	"kind" text NOT NULL DEFAULT 'note',
	"body" text NOT NULL DEFAULT '',
	"created_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "lead_activity_lead_id_idx" ON "lead_activity" ("lead_id", "created_at");
