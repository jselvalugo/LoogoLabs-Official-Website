-- Quote and invoice numbers only go up. Each workspace keeps the last number it
-- used per prefix and year (LL-2026 for quotes, INV-2026 for invoices), so a
-- deleted quote or invoice never frees its number for reuse, and a number that
-- is typed by hand must be higher than the last one used.

CREATE TABLE IF NOT EXISTS "crm_doc_counters" (
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"prefix" text NOT NULL,
	"year" integer NOT NULL,
	"last" integer NOT NULL DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	PRIMARY KEY ("instance_id", "prefix", "year")
);

-- Seed from what already exists.
INSERT INTO "crm_doc_counters" ("instance_id", "prefix", "year", "last")
SELECT instance_id, split_part(name, '-', 1), split_part(name, '-', 2)::int, max(split_part(name, '-', 3)::int)
FROM (
	SELECT instance_id, name FROM crm_quotes WHERE name ~ '^[A-Z]+-[0-9]{4}-[0-9]+$'
	UNION ALL
	SELECT instance_id, name FROM crm_invoices WHERE name ~ '^[A-Z]+-[0-9]{4}-[0-9]+$'
) n
GROUP BY 1, 2, 3
ON CONFLICT ("instance_id", "prefix", "year") DO UPDATE SET "last" = GREATEST("crm_doc_counters"."last", EXCLUDED."last");
