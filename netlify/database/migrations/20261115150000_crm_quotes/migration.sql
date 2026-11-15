-- Quotes in the CRM, alongside invoices. A quote has the same bill-to details,
-- line items and coded templates as an invoice; due_date is its "Valid until"
-- date. When a quote is accepted it can be turned into an invoice
-- (crm_quotes.invoice_id ↔ crm_invoices.quote_id).

CREATE TABLE IF NOT EXISTS "crm_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"status" text NOT NULL DEFAULT 'draft',
	"template" text,
	"company_id" uuid REFERENCES "crm_companies" ("id") ON DELETE SET NULL,
	"contact_id" uuid REFERENCES "crm_contacts" ("id") ON DELETE SET NULL,
	"project_id" uuid REFERENCES "crm_projects" ("id") ON DELETE SET NULL,
	"opportunity_id" uuid REFERENCES "crm_opportunities" ("id") ON DELETE SET NULL,
	"bill_to_name" text,
	"bill_to_title" text,
	"bill_to_company" text,
	"bill_to_email" text,
	"bill_to_phone" text,
	"bill_to_address" text,
	"issue_date" date,
	"due_date" date,
	"tax_rate" numeric,
	"discount" numeric,
	"terms" text,
	"notes" text,
	"accepted_at" date,
	"invoice_id" uuid REFERENCES "crm_invoices" ("id") ON DELETE SET NULL,
	"sent_at" timestamp,
	"sent_to" text,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "crm_quotes_number_idx" ON "crm_quotes" ("instance_id", "name");
CREATE INDEX IF NOT EXISTS "crm_quotes_instance_idx" ON "crm_quotes" ("instance_id", "updated_at");

CREATE TABLE IF NOT EXISTS "crm_quote_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"quote_id" uuid NOT NULL REFERENCES "crm_quotes" ("id") ON DELETE CASCADE,
	"position" integer NOT NULL DEFAULT 0,
	"description" text NOT NULL,
	"details" text,
	"quantity" numeric NOT NULL DEFAULT 1,
	"unit_price" numeric NOT NULL DEFAULT 0,
	"unit_label" text,
	"note" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "crm_quote_items_quote_idx" ON "crm_quote_items" ("quote_id", "position");

ALTER TABLE "crm_invoices" ADD COLUMN IF NOT EXISTS "quote_id" uuid REFERENCES "crm_quotes" ("id") ON DELETE SET NULL;
