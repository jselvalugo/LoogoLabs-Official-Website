-- Links a quiz lead or Park Supply proposal to the browsing session it came
-- from, so Analytics can attribute leads and won revenue to a traffic source,
-- landing page and the posts read before converting. The id is the same random
-- per-tab id site_sessions uses, and it is only sent when the visitor accepted
-- Analytics cookies, so it stays null otherwise. No foreign key: the session
-- row can arrive after the form (heartbeats are batched every 15s).
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "session_id" uuid;
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "session_id" uuid;
CREATE INDEX IF NOT EXISTS "leads_session_id_idx" ON "leads" ("session_id");
CREATE INDEX IF NOT EXISTS "proposals_session_id_idx" ON "proposals" ("session_id");
