-- Email marketing for the CRM, sent through Resend. The audience is its own
-- list (crm_email_subscribers), kept apart from business contacts on purpose.
--   crm_email_subscribers  the marketing list: email, tags, subscribed or not
--   crm_email_campaigns    one-off newsletters to everyone or one tag
--   crm_email_sequences    automations: a drip of emails a new subscriber gets
--   crm_email_enrollments  where each subscriber is in each sequence
--   crm_email_sends        the outbox and send log; the email-worker function
--                          drains it within the daily cap (EMAIL_DAILY_LIMIT)
CREATE TABLE IF NOT EXISTS "crm_email_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"email" text NOT NULL,
	"name" text,
	"tags" text[] NOT NULL DEFAULT '{}',
	"status" text NOT NULL DEFAULT 'subscribed',
	"source" text,
	"unsubscribe_token" text NOT NULL UNIQUE,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	UNIQUE ("instance_id", "email")
);
CREATE INDEX IF NOT EXISTS "crm_email_subscribers_instance_idx" ON "crm_email_subscribers" ("instance_id", "created_at");

CREATE TABLE IF NOT EXISTS "crm_email_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"subject" text NOT NULL DEFAULT '',
	"preheader" text,
	"body" text NOT NULL DEFAULT '',
	"audience_tag" text,
	"status" text NOT NULL DEFAULT 'draft',
	"recipients" integer NOT NULL DEFAULT 0,
	"created_by" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_email_campaigns_instance_idx" ON "crm_email_campaigns" ("instance_id", "updated_at");

CREATE TABLE IF NOT EXISTS "crm_email_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"trigger_tag" text,
	"steps" jsonb NOT NULL DEFAULT '[]'::jsonb,
	"active" boolean NOT NULL DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_email_sequences_instance_idx" ON "crm_email_sequences" ("instance_id");

CREATE TABLE IF NOT EXISTS "crm_email_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sequence_id" uuid NOT NULL REFERENCES "crm_email_sequences" ("id") ON DELETE CASCADE,
	"subscriber_id" uuid NOT NULL REFERENCES "crm_email_subscribers" ("id") ON DELETE CASCADE,
	"step" integer NOT NULL DEFAULT 0,
	"next_at" timestamp,
	"status" text NOT NULL DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	UNIQUE ("sequence_id", "subscriber_id")
);
CREATE INDEX IF NOT EXISTS "crm_email_enrollments_due_idx" ON "crm_email_enrollments" ("next_at") WHERE "status" = 'active';

CREATE TABLE IF NOT EXISTS "crm_email_sends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"subscriber_id" uuid NOT NULL REFERENCES "crm_email_subscribers" ("id") ON DELETE CASCADE,
	"campaign_id" uuid REFERENCES "crm_email_campaigns" ("id") ON DELETE CASCADE,
	"sequence_id" uuid REFERENCES "crm_email_sequences" ("id") ON DELETE CASCADE,
	"step" integer,
	"status" text NOT NULL DEFAULT 'queued',
	"resend_id" text,
	"error" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	UNIQUE ("campaign_id", "subscriber_id"),
	UNIQUE ("sequence_id", "step", "subscriber_id")
);
CREATE INDEX IF NOT EXISTS "crm_email_sends_queue_idx" ON "crm_email_sends" ("created_at") WHERE "status" = 'queued';
CREATE INDEX IF NOT EXISTS "crm_email_sends_sent_idx" ON "crm_email_sends" ("sent_at");
