-- Client retention & reporting for the CRM. Each client is a crm_companies row.
--   crm_client_portals   white-label branding + the share token for the
--                        client's portal (performance dashboard + approvals)
--   crm_client_metrics   ad spend / views / engagement / conversions per
--                        period and channel, shown on that dashboard
--   crm_approvals        drafts and video cuts waiting on the client
--   crm_approval_comments  client and team comments, optionally pinned to a
--                        moment in the video
--   crm_recaps           shareable post-campaign one-pagers
-- Share tokens are unguessable and are the only thing a client needs.
CREATE TABLE IF NOT EXISTS "crm_client_portals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"company_id" uuid NOT NULL REFERENCES "crm_companies" ("id") ON DELETE CASCADE,
	"display_name" text,
	"logo_url" text,
	"brand_color" text DEFAULT '#1A1A18',
	"agency_name" text,
	"welcome" text,
	"monthly_fee" numeric,
	"share_token" text NOT NULL UNIQUE,
	"active" boolean NOT NULL DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	UNIQUE ("company_id")
);
CREATE INDEX IF NOT EXISTS "crm_client_portals_instance_idx" ON "crm_client_portals" ("instance_id");

CREATE TABLE IF NOT EXISTS "crm_client_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"company_id" uuid NOT NULL REFERENCES "crm_companies" ("id") ON DELETE CASCADE,
	"period" date NOT NULL,
	"channel" text NOT NULL DEFAULT 'All channels',
	"spend" numeric NOT NULL DEFAULT 0,
	"views" numeric NOT NULL DEFAULT 0,
	"engagement" numeric NOT NULL DEFAULT 0,
	"conversions" numeric NOT NULL DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_client_metrics_company_idx" ON "crm_client_metrics" ("company_id", "period");

CREATE TABLE IF NOT EXISTS "crm_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"company_id" uuid NOT NULL REFERENCES "crm_companies" ("id") ON DELETE CASCADE,
	"title" text NOT NULL,
	"kind" text NOT NULL DEFAULT 'video',
	"media_url" text,
	"body" text,
	"version" integer NOT NULL DEFAULT 1,
	"status" text NOT NULL DEFAULT 'pending',
	"due_date" date,
	"decided_at" timestamp,
	"decided_by" text,
	"created_by" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_approvals_instance_idx" ON "crm_approvals" ("instance_id", "updated_at");
CREATE INDEX IF NOT EXISTS "crm_approvals_company_idx" ON "crm_approvals" ("company_id");

CREATE TABLE IF NOT EXISTS "crm_approval_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"approval_id" uuid NOT NULL REFERENCES "crm_approvals" ("id") ON DELETE CASCADE,
	"version" integer NOT NULL DEFAULT 1,
	"author" text NOT NULL DEFAULT '',
	"from_client" boolean NOT NULL DEFAULT true,
	"timestamp_sec" numeric,
	"body" text NOT NULL,
	"resolved" boolean NOT NULL DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_approval_comments_approval_idx" ON "crm_approval_comments" ("approval_id", "created_at");

CREATE TABLE IF NOT EXISTS "crm_recaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"company_id" uuid NOT NULL REFERENCES "crm_companies" ("id") ON DELETE CASCADE,
	"title" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"summary" text,
	"metrics" jsonb NOT NULL DEFAULT '[]'::jsonb,
	"highlights" jsonb NOT NULL DEFAULT '[]'::jsonb,
	"next_steps" text,
	"published" boolean NOT NULL DEFAULT false,
	"share_token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_recaps_instance_idx" ON "crm_recaps" ("instance_id", "updated_at");
