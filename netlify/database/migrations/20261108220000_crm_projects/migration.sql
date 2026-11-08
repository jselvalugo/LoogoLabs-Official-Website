-- CRM projects: delivery work for a client, after the deal is won. Each project
-- follows one lifecycle (lifecycle column): 'agency' (start to finish, the
-- default) or 'evergreen' (ongoing, no set end). Stages per lifecycle live in
-- src/crm/entities.js. Status reports are dated health check-ins on a project.

CREATE TABLE IF NOT EXISTS "crm_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"company_id" uuid REFERENCES "crm_companies" ("id") ON DELETE SET NULL,
	"contact_id" uuid REFERENCES "crm_contacts" ("id") ON DELETE SET NULL,
	"opportunity_id" uuid REFERENCES "crm_opportunities" ("id") ON DELETE SET NULL,
	"lifecycle" text NOT NULL DEFAULT 'agency',
	"stage" text NOT NULL DEFAULT 'intake',
	"health" text NOT NULL DEFAULT 'on_track',
	"start_date" date, "target_end_date" date,
	"report_cadence" text, "next_report_date" date,
	"billing" text, "budget" numeric,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"description" text,
	"stage_changed_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	"last_report_at" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_projects_instance_idx" ON "crm_projects" ("instance_id", "updated_at");
CREATE INDEX IF NOT EXISTS "crm_projects_company_idx" ON "crm_projects" ("company_id");

CREATE TABLE IF NOT EXISTS "crm_project_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"project_id" uuid NOT NULL REFERENCES "crm_projects" ("id") ON DELETE CASCADE,
	"report_date" date NOT NULL,
	"health" text NOT NULL DEFAULT 'on_track',
	"stage" text,
	"summary" text NOT NULL,
	"accomplishments" text, "next_steps" text, "blockers" text,
	"user_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"author_label" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_project_reports_project_idx" ON "crm_project_reports" ("project_id", "report_date");
