-- The 20260901210900 batch inserted posts as 'published' without a published_at.
-- The public feed orders by published_at DESC, so those rows sorted above everything
-- (NULLs first in Postgres) and rendered with a blank date on the blog and post pages.
-- Backfill from created_at so ordering and dates are correct.
-- Idempotent: only touches published rows that are still missing a date.

UPDATE posts
SET published_at = COALESCE(created_at, now())
WHERE status = 'published'
  AND published_at IS NULL;
