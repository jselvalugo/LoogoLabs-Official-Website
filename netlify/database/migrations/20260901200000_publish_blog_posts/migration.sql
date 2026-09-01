-- Publishes the 5 SEO-focused LoogoNews posts seeded by the prior migration.
-- Idempotent: only touches rows that aren't already published.

UPDATE posts
SET status = 'published', published_at = now()
WHERE slug IN (
  'missed-call-text-back-hvac',
  'dental-practice-lead-response-time',
  'salon-google-review-system',
  'real-estate-lead-response-time',
  'reduce-no-shows-appointment-reminders'
)
AND status != 'published';
