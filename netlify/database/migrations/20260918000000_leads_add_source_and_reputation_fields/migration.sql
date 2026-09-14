-- Adds a `source` tag so the leads table can hold submissions from more
-- than one quiz, plus the two quiz-specific columns Reputation Autopilot
-- needs. Existing rows (all from the AI Receptionist quiz) default to
-- 'ai_receptionist' so nothing already in the table needs backfilling.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'ai_receptionist';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "job_volume" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "review_pain_point" text;
