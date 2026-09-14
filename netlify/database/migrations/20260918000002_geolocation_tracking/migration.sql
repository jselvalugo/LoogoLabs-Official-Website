-- Adds IP-derived location (city/region accuracy, from Netlify's built-in
-- geolocation) to leads, and a per-view events table for blog posts so views
-- can be broken down by location and by date instead of just a running total.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "region" text;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "country" text;

CREATE TABLE IF NOT EXISTS "post_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"post_slug" text NOT NULL,
	"city" text,
	"region" text,
	"country" text,
	"created_at" timestamp DEFAULT now()
);
