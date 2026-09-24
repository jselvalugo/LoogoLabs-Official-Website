-- One row per browser-tab session, for session duration in Analytics. The id
-- is generated client-side (sessionStorage) so heartbeats from the same tab
-- upsert the same row. `active_seconds` counts engaged time only: tab visible
-- and the visitor active within the last minute. `paths` maps each path seen
-- in the session to the engaged seconds spent on it. Only recorded for
-- visitors who accepted the Analytics cookie category.
CREATE TABLE IF NOT EXISTS "site_sessions" (
  "id" uuid PRIMARY KEY,
  "started_at" timestamp DEFAULT now(),
  "last_seen_at" timestamp DEFAULT now(),
  "active_seconds" integer DEFAULT 0,
  "page_count" integer DEFAULT 1,
  "landing_path" text,
  "paths" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "referrer" text,
  "device" text,
  "city" text,
  "region" text,
  "country" text
);
CREATE INDEX IF NOT EXISTS "site_sessions_started_at_idx" ON "site_sessions" ("started_at" DESC);
