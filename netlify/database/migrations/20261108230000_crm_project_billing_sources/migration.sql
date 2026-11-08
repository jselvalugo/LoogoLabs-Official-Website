-- Project billing, research sources and draft status reports, plus company
-- logos and social profiles.
--
-- crm_project_charges: the billing ledger (setup fee, monthly fees, one-off
-- charges), each due / paid / void. crm_project_sources: reports a user
-- uploads for research (Google Analytics, Meta, ...), stored as extracted text
-- so Claude can read them through the CRM MCP. Status reports get a status:
-- 'draft' (e.g. written by Claude, awaiting review) or 'final'.

ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "logo_url" text;
ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "instagram_url" text;
ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "facebook_url" text;
ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "tiktok_url" text;
ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "linkedin_url" text;
ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "youtube_url" text;
ALTER TABLE "crm_companies" ADD COLUMN IF NOT EXISTS "x_url" text;

ALTER TABLE "crm_projects" ADD COLUMN IF NOT EXISTS "setup_fee" numeric;
ALTER TABLE "crm_projects" ADD COLUMN IF NOT EXISTS "monthly_fee" numeric;
ALTER TABLE "crm_projects" ADD COLUMN IF NOT EXISTS "billing_day" numeric;

ALTER TABLE "crm_project_reports" ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'final';

CREATE TABLE IF NOT EXISTS "crm_project_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"project_id" uuid NOT NULL REFERENCES "crm_projects" ("id") ON DELETE CASCADE,
	"kind" text NOT NULL DEFAULT 'monthly',
	"description" text,
	"amount" numeric NOT NULL,
	"due_date" date,
	"period_start" date,
	"status" text NOT NULL DEFAULT 'due',
	"paid_at" date,
	"method" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_project_charges_project_idx" ON "crm_project_charges" ("project_id", "due_date");

CREATE TABLE IF NOT EXISTS "crm_project_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"project_id" uuid NOT NULL REFERENCES "crm_projects" ("id") ON DELETE CASCADE,
	"kind" text NOT NULL DEFAULT 'other',
	"title" text NOT NULL,
	"filename" text,
	"period_start" date,
	"period_end" date,
	"notes" text,
	"content" text NOT NULL,
	"content_chars" integer NOT NULL DEFAULT 0,
	"user_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"author_label" text,
	"created_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_project_sources_project_idx" ON "crm_project_sources" ("project_id", "created_at");
