-- Key numbers pulled from an uploaded report, confirmed by the user, for the
-- branded PDF status report. metrics: [{ label, value, unit }] where unit is
-- '' | '%' | '$'. breakdown: { title, columns: [..], rows: [[..], ..] } or null.
ALTER TABLE "crm_project_sources" ADD COLUMN IF NOT EXISTS "metrics" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "crm_project_sources" ADD COLUMN IF NOT EXISTS "breakdown" jsonb;
