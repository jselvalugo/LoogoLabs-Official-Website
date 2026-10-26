-- Automatic email signature and HTML ("code") emails.
--   crm_email_settings      one row per instance: the signature added under
--                           every marketing email, in text or HTML
--   crm_email_campaigns     body_format 'text' (the simple markup) or 'html';
--                           signature false leaves the signature off
-- Automation steps carry the same two fields inside their steps jsonb.
CREATE TABLE IF NOT EXISTS "crm_email_settings" (
	"instance_id" uuid PRIMARY KEY REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"signature" text NOT NULL DEFAULT '',
	"signature_format" text NOT NULL DEFAULT 'text',
	"updated_at" timestamp DEFAULT now()
);

ALTER TABLE "crm_email_campaigns" ADD COLUMN IF NOT EXISTS "body_format" text NOT NULL DEFAULT 'text';
ALTER TABLE "crm_email_campaigns" ADD COLUMN IF NOT EXISTS "signature" boolean NOT NULL DEFAULT true;
