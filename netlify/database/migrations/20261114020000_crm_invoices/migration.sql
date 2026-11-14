-- Invoices in the CRM. An invoice is billed to a prospect or client (linked
-- company / contact / project, with its own bill-to details so a prospect who
-- is not yet a contact can still be invoiced), holds line items, and is sent
-- by email from a coded, per-instance template (netlify/lib/invoice-templates/).
--
-- crm_invoices.name      the invoice number, e.g. INV-2026-001 (unique per instance)
-- crm_invoices.template  the coded template id used to render and send it
-- crm_invoice_items      line items; amount = quantity * unit_price

CREATE TABLE IF NOT EXISTS "crm_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"status" text NOT NULL DEFAULT 'draft',
	"template" text,
	"company_id" uuid REFERENCES "crm_companies" ("id") ON DELETE SET NULL,
	"contact_id" uuid REFERENCES "crm_contacts" ("id") ON DELETE SET NULL,
	"project_id" uuid REFERENCES "crm_projects" ("id") ON DELETE SET NULL,
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
	"payment_link" text,
	"terms" text,
	"notes" text,
	"paid_at" date,
	"payment_method" text,
	"sent_at" timestamp,
	"sent_to" text,
	"owner_id" uuid REFERENCES "crm_users" ("id") ON DELETE SET NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "crm_invoices_number_idx" ON "crm_invoices" ("instance_id", "name");
CREATE INDEX IF NOT EXISTS "crm_invoices_instance_idx" ON "crm_invoices" ("instance_id", "updated_at");

CREATE TABLE IF NOT EXISTS "crm_invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"invoice_id" uuid NOT NULL REFERENCES "crm_invoices" ("id") ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS "crm_invoice_items_invoice_idx" ON "crm_invoice_items" ("invoice_id", "position");
