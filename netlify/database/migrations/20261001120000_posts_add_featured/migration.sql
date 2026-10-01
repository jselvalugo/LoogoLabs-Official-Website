-- Lets one LoogoNews post be marked as featured. The featured post gets its own
-- layout on /news and on its post page, plus a one-line link on the homepage.
--
-- The partial unique index allows at most one row with featured = true, so the
-- site can never show two featured posts. To change the featured post, clear the
-- old one before (or in the same statement as) setting the new one — see
-- scripts/feature-post.mjs, which generates that migration.
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS "posts_one_featured" ON "posts" ("featured") WHERE "featured";

-- Start with the newest published post, so the new layout has something to show.
UPDATE "posts" SET "featured" = true
WHERE "id" = (
  SELECT "id" FROM "posts" WHERE "status" = 'published'
  ORDER BY "published_at" DESC NULLS LAST LIMIT 1
)
AND NOT EXISTS (SELECT 1 FROM "posts" WHERE "featured");
