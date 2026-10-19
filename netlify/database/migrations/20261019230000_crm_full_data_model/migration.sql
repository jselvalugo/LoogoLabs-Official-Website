-- Full CRM data model: companies, contacts, leads, opportunities and a shared
-- activity timeline (notes, calls, emails, meetings, tasks). Data only, no
-- automations. Columns match src/crm/entities.js.
--
-- Existing data is carried over: each distinct contact company text becomes a
-- company row, each contact with a stage past "lead" or a value becomes an
-- opportunity, and crm_notes become note activities on their contact.

CREATE TABLE IF NOT EXISTS "crm_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"domain" text, "website" text, "industry" text, "type" text,
	"employees" numeric, "annual_revenue" numeric, "phone" text,
	"address" text, "city" text, "state" text, "postal_code" text, "country" text,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_companies_instance_idx" ON "crm_companies" ("instance_id", "updated_at");

ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "company_id" uuid REFERENCES "crm_companies" ("id") ON DELETE SET NULL;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "mobile" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "lifecycle" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "source" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "linkedin" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "address" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "state" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "postal_code" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "country" text;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL;
ALTER TABLE "crm_contacts" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "crm_contacts" ALTER COLUMN "email" DROP NOT NULL, ALTER COLUMN "email" DROP DEFAULT;
ALTER TABLE "crm_contacts" ALTER COLUMN "phone" DROP NOT NULL, ALTER COLUMN "phone" DROP DEFAULT;
CREATE INDEX IF NOT EXISTS "crm_contacts_company_idx" ON "crm_contacts" ("company_id");

CREATE TABLE IF NOT EXISTS "crm_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"company_name" text, "title" text, "email" text, "phone" text, "website" text,
	"status" text NOT NULL DEFAULT 'new', "rating" text, "source" text,
	"estimated_value" numeric, "industry" text, "city" text, "country" text,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"description" text,
	"converted_at" timestamp,
	"converted_company_id" uuid REFERENCES "crm_companies" ("id") ON DELETE SET NULL,
	"converted_contact_id" uuid REFERENCES "crm_contacts" ("id") ON DELETE SET NULL,
	"converted_opportunity_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_leads_instance_idx" ON "crm_leads" ("instance_id", "updated_at");

CREATE TABLE IF NOT EXISTS "crm_opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"company_id" uuid REFERENCES "crm_companies" ("id") ON DELETE SET NULL,
	"contact_id" uuid REFERENCES "crm_contacts" ("id") ON DELETE SET NULL,
	"stage" text NOT NULL DEFAULT 'prospecting',
	"amount" numeric, "probability" numeric, "close_date" date,
	"type" text, "source" text, "next_step" text, "lost_reason" text,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"description" text,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_opportunities_instance_idx" ON "crm_opportunities" ("instance_id", "updated_at");
CREATE INDEX IF NOT EXISTS "crm_opportunities_company_idx" ON "crm_opportunities" ("company_id");
CREATE INDEX IF NOT EXISTS "crm_opportunities_contact_idx" ON "crm_opportunities" ("contact_id");

-- One timeline for every record type. entity_id is not a foreign key because
-- it can point at any of the four tables; the API deletes a record's
-- activities when it deletes the record.
CREATE TABLE IF NOT EXISTS "crm_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"type" text NOT NULL DEFAULT 'note',
	"subject" text,
	"body" text,
	"due_date" date,
	"completed_at" timestamp,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"user_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"author_label" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_activities_entity_idx" ON "crm_activities" ("entity_type", "entity_id", "created_at");
CREATE INDEX IF NOT EXISTS "crm_activities_instance_idx" ON "crm_activities" ("instance_id", "created_at");

-- ── Carry over existing data ────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_contacts' AND column_name = 'company') THEN
    INSERT INTO crm_companies (instance_id, name)
      SELECT DISTINCT instance_id, trim(company) FROM crm_contacts WHERE trim(company) <> '';
    UPDATE crm_contacts c SET company_id = co.id
      FROM crm_companies co WHERE co.instance_id = c.instance_id AND co.name = trim(c.company);

    INSERT INTO crm_opportunities (instance_id, name, company_id, contact_id, stage, amount, closed_at, created_at)
      SELECT instance_id,
        CASE WHEN trim(company) <> '' THEN trim(company) ELSE name END || ' deal',
        company_id, id,
        CASE stage WHEN 'qualified' THEN 'qualification' WHEN 'proposal' THEN 'proposal' WHEN 'won' THEN 'won' WHEN 'lost' THEN 'lost' ELSE 'prospecting' END,
        value,
        CASE WHEN stage IN ('won', 'lost') THEN updated_at END,
        created_at
      FROM crm_contacts WHERE stage <> 'lead' OR value IS NOT NULL;

    ALTER TABLE crm_contacts DROP COLUMN company, DROP COLUMN stage, DROP COLUMN value;
    UPDATE crm_contacts SET email = NULLIF(email, ''), phone = NULLIF(phone, '');
  END IF;

  IF to_regclass('crm_notes') IS NOT NULL THEN
    INSERT INTO crm_activities (instance_id, entity_type, entity_id, type, body, user_id, author_label, created_at, updated_at)
      SELECT instance_id, 'contacts', contact_id, 'note', body, user_id, author_label, created_at, created_at FROM crm_notes;
    DROP TABLE crm_notes;
  END IF;
END $$;
