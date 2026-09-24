-- Park Supply proposal submissions (/park-supply). Kept out of `leads` so the
-- quiz-funnel analytics are not skewed, and so line items can be stored as
-- structured data instead of text. `lines` holds the submitted
-- [{ sku, name, unit, qty, price, list_price }]; totals are recomputed
-- server-side from those lines.
CREATE TABLE IF NOT EXISTS "proposals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "number" text NOT NULL,
  "organization" text,
  "contact" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "project" text,
  "location" text,
  "scope" text DEFAULT '',
  "lines" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "discount_pct" numeric DEFAULT 0,
  "shipping" numeric DEFAULT 0,
  "tax_pct" numeric DEFAULT 0,
  "subtotal" numeric DEFAULT 0,
  "total" numeric DEFAULT 0,
  "status" text DEFAULT 'new',
  "admin_notes" text DEFAULT '',
  "city" text,
  "region" text,
  "country" text
);
CREATE INDEX IF NOT EXISTS "proposals_created_at_idx" ON "proposals" ("created_at" DESC);
