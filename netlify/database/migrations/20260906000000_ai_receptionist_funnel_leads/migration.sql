-- Repurposes the (previously unused) leads table to capture AI Receptionist
-- funnel results: the visitor's contact info plus their quiz answers.
ALTER TABLE "leads" DROP COLUMN IF EXISTS "company";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "industry";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "data_problem";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "decision_it_feeds";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "referral";
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "business_type" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "missed_calls" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "pain_point" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "decision_maker" text;
