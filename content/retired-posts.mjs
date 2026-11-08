// Posts folded into a stronger guide during the November 2026 blog consolidation.
//
// Each entry maps a retired slug to the post that replaced it. Two scripts read
// this file:
//
//   * scripts/generate-post-migration.mjs sets every retired slug to
//     status 'archived', so it leaves /news, the API and the admin feed.
//   * scripts/generate-seo-assets.mjs writes a 301 for each one into
//     dist/_redirects (/news/<slug> and /es/news/<slug>), so old links,
//     bookmarks and search results land on the guide instead of a 404.
//
// A retired slug must not also appear in content/posts.mjs. To retire more
// posts: remove them from posts.mjs, add them here pointing at their hub (or
// at null to send them to the /news index), then regenerate the migration.
//
// Plan and reasoning: "Loogo Labs Blog Consolidation Plan" in the Loogo Labs project.

export const retiredPosts = {
  // H1 Speed to lead → 5-minute-rule-local-service-business-leads (2026-11-08)
  'dental-practice-lead-response-time': '5-minute-rule-local-service-business-leads',
  'real-estate-lead-response-time': '5-minute-rule-local-service-business-leads',
  'why-marketing-works-but-calendar-is-empty': '5-minute-rule-local-service-business-leads',
  'crm-not-the-problem-follow-up-system-is': '5-minute-rule-local-service-business-leads',
  'missed-call-text-back-hvac': '5-minute-rule-local-service-business-leads',
  'agency-incentive-follow-up-speed': '5-minute-rule-local-service-business-leads',
  'chiropractic-lead-assignment-ownership': '5-minute-rule-local-service-business-leads',
  'locksmith-lockout-price-range-text-before-dispatch': '5-minute-rule-local-service-business-leads',
  'florist-sympathy-order-service-time-before-the-card': '5-minute-rule-local-service-business-leads',
  'hvac-first-heat-smell-text-triage': '5-minute-rule-local-service-business-leads',
};
