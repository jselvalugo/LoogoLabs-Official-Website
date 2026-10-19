-- Multi-tenant CRM served at crm.loogolabs.com. Each instance is one client
-- workspace with its own users, contacts and notes; instances and their users
-- are created from the website /admin. Every data row carries instance_id and
-- every CRM query is scoped by it.
CREATE TABLE IF NOT EXISTS "crm_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"status" text NOT NULL DEFAULT 'active',
	"created_at" timestamp DEFAULT now()
);

-- Emails are unique across all instances so login needs only email + password.
CREATE TABLE IF NOT EXISTS "crm_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"email" text NOT NULL,
	"name" text NOT NULL DEFAULT '',
	"password_hash" text NOT NULL,
	"role" text NOT NULL DEFAULT 'member',
	"created_at" timestamp DEFAULT now(),
	"last_login_at" timestamp
);
CREATE UNIQUE INDEX IF NOT EXISTS "crm_users_email_idx" ON "crm_users" (lower("email"));

-- Only a SHA-256 of the session token is stored; the token itself lives in the browser.
CREATE TABLE IF NOT EXISTS "crm_sessions" (
	"token_hash" text PRIMARY KEY,
	"user_id" uuid NOT NULL REFERENCES "crm_users" ("id") ON DELETE CASCADE,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "crm_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"company" text NOT NULL DEFAULT '',
	"email" text NOT NULL DEFAULT '',
	"phone" text NOT NULL DEFAULT '',
	"stage" text NOT NULL DEFAULT 'lead',
	"value" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_contacts_instance_idx" ON "crm_contacts" ("instance_id", "updated_at");

CREATE TABLE IF NOT EXISTS "crm_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"contact_id" uuid NOT NULL REFERENCES "crm_contacts" ("id") ON DELETE CASCADE,
	"user_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_notes_instance_idx" ON "crm_notes" ("instance_id", "created_at");
