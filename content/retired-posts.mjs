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

  // H2 AI voice agents → ai-voice-after-hours-plumbing (2026-11-08)
  'ai-voice-booking-auto-repair': 'ai-voice-after-hours-plumbing',
  'ai-voice-intake-law-firm': 'ai-voice-after-hours-plumbing',
  'ai-voice-handoff-veterinary-clinic': 'ai-voice-after-hours-plumbing',
  'ai-follow-up-messaging-gym': 'ai-voice-after-hours-plumbing',

  // H3 Reviews and reputation → pressure-washing-review-request-automation (2026-11-08)
  'salon-google-review-system': 'pressure-washing-review-request-automation',
  'restaurant-review-response-reputation': 'pressure-washing-review-request-automation',
  'copy-paste-review-responses-worse': 'pressure-washing-review-request-automation',

  // H4 Estimate follow-up and pipeline → painting-contractor-estimate-follow-up (2026-11-08)
  'electrician-quote-follow-up-sequence': 'painting-contractor-estimate-follow-up',
  'remodeling-crm-pipeline-follow-up': 'painting-contractor-estimate-follow-up',
  'solar-installer-pipeline-stale-deals': 'painting-contractor-estimate-follow-up',
  'wedding-venue-long-cycle-nurture': 'painting-contractor-estimate-follow-up',
  'auto-glass-chip-repair-quote-follow-up-before-first-frost': 'painting-contractor-estimate-follow-up',
  'real-estate-after-the-holidays-seller-call-booked': 'painting-contractor-estimate-follow-up',
  'auto-repair-declined-repairs-revisit-date': 'painting-contractor-estimate-follow-up',

  // H5 Booking and no-shows → reduce-no-shows-appointment-reminders (2026-11-08)
  'barbershop-online-booking-interruptions': 'reduce-no-shows-appointment-reminders',
  'dog-grooming-cancellation-waitlist': 'reduce-no-shows-appointment-reminders',
  'photography-studio-booking-automation': 'reduce-no-shows-appointment-reminders',
  'photographer-deposit-holds-the-date': 'reduce-no-shows-appointment-reminders',
  'tattoo-studio-design-approval-date-before-the-session': 'reduce-no-shows-appointment-reminders',
  'mobile-detailing-booking-form-slot-length': 'reduce-no-shows-appointment-reminders',

  // H6 Retention and reactivation → gym-membership-retention-management (2026-11-08)
  'restaurant-email-sms-reengagement': 'gym-membership-retention-management',
  'optometry-annual-recall-sequence': 'gym-membership-retention-management',
  'personal-training-trial-conversion-pipeline': 'gym-membership-retention-management',
  'yoga-studio-intro-offer-second-class-booked': 'gym-membership-retention-management',
  'laser-clinic-book-whole-package-at-checkout': 'gym-membership-retention-management',
  'tutoring-center-block-renewal-note-at-session-six': 'gym-membership-retention-management',
  'driving-school-stalled-students-between-lessons': 'gym-membership-retention-management',
  'dental-year-end-benefits-treatment-plans': 'gym-membership-retention-management',
  'cleaning-company-seasonal-residents-return': 'gym-membership-retention-management',
  'preschool-tour-follow-up-same-afternoon': 'gym-membership-retention-management',
  'septic-pumping-next-due-date-logged-at-the-visit': 'gym-membership-retention-management',
  'hvac-maintenance-agreement-recurring-billing': 'gym-membership-retention-management',

  // H7 Email and SMS list craft → pest-control-list-segmentation (2026-11-08)
  'self-storage-message-testing': 'pest-control-list-segmentation',
  'appliance-repair-quiet-hours-send-timing': 'pest-control-list-segmentation',

  // H8 Measurement and attribution → cleaning-company-multi-location-reporting (2026-11-08)
  'med-spa-marketing-channel-roi': 'cleaning-company-multi-location-reporting',
  'music-school-self-reported-lead-source': 'cleaning-company-multi-location-reporting',
  'locksmith-lead-source-tracking': 'cleaning-company-multi-location-reporting',
  'catering-company-booking-analytics-capacity': 'cleaning-company-multi-location-reporting',

  // H9 CRM that the team actually uses → insurance-agency-contact-data-hygiene (2026-11-08)
  'roofing-unified-inbox-conversation-history': 'insurance-agency-contact-data-hygiene',
  'tree-service-system-adoption': 'insurance-agency-contact-data-hygiene',
  'property-management-workflow-automation': 'insurance-agency-contact-data-hygiene',
  'bookkeeping-client-onboarding-first-week': 'insurance-agency-contact-data-hygiene',
  'hot-tub-service-promise-note-on-the-record-after-every-call': 'insurance-agency-contact-data-hygiene',

  // H10 Local growth and referrals → moving-company-referral-partners (2026-11-08)
  'handyman-celebration-own-one-town': 'moving-company-referral-partners',

  // H11 Holiday-season campaigns → salon-december-chair-hours-regulars-first (2026-11-08)
  'appliance-repair-thanksgiving-fixed-by-cutoff-date': 'salon-december-chair-hours-regulars-first',
  'bakery-thanksgiving-pie-orders-close-date-pickup-windows': 'salon-december-chair-hours-regulars-first',
  'catering-holiday-party-headcount-lock-date': 'salon-december-chair-hours-regulars-first',
  'photographer-holiday-card-session-last-order-date': 'salon-december-chair-hours-regulars-first',
  'electrician-holiday-lights-reserved-service-block': 'salon-december-chair-hours-regulars-first',
  'holiday-lighting-book-install-and-takedown': 'salon-december-chair-hours-regulars-first',
  'massage-therapy-gift-certificate-recipient-booking-nudge': 'salon-december-chair-hours-regulars-first',
  'dog-boarding-vaccine-records-before-thanksgiving': 'salon-december-chair-hours-regulars-first',
  'counseling-practice-holiday-weeks-skip-dates-in-october': 'salon-december-chair-hours-regulars-first',
  'veterinary-holiday-hours-emergency-referral-text': 'salon-december-chair-hours-regulars-first',
  'home-care-family-note-before-thanksgiving-visit': 'salon-december-chair-hours-regulars-first',
  'remodeler-holiday-pause-dates-for-open-jobs': 'salon-december-chair-hours-regulars-first',
  'party-bus-holiday-group-run-sheet-text-ten-days-out': 'salon-december-chair-hours-regulars-first',
  'christmas-tree-delivery-ceiling-height-before-the-tree-is-cut': 'salon-december-chair-hours-regulars-first',
  'plumber-pre-thanksgiving-kitchen-drain-check': 'salon-december-chair-hours-regulars-first',

  // H12 Weather and seasonal outreach → lawn-care-fall-transition-after-last-mow (2026-11-08)
  'gutter-cleaning-rain-day-reschedule-list': 'lawn-care-fall-transition-after-last-mow',
  'chimney-sweep-first-cold-snap-waves': 'lawn-care-fall-transition-after-last-mow',
  'snow-removal-renewal-cutoff-before-first-storm': 'lawn-care-fall-transition-after-last-mow',
  'sprinkler-blowout-assigned-week-default-yes': 'lawn-care-fall-transition-after-last-mow',
  'tire-shop-winter-swap-week-text-before-first-snow': 'lawn-care-fall-transition-after-last-mow',
  'plumber-shutoff-valve-photo-before-first-freeze': 'lawn-care-fall-transition-after-last-mow',
  'heating-oil-propane-gauge-reading-text-will-call-customers': 'lawn-care-fall-transition-after-last-mow',
  'firewood-delivery-where-to-dump-text-before-first-cold-snap': 'lawn-care-fall-transition-after-last-mow',
  'generator-service-nameplate-photo-text-before-the-first-outage': 'lawn-care-fall-transition-after-last-mow',
  'tree-service-leaf-off-look-up-text-before-first-storm': 'lawn-care-fall-transition-after-last-mow',
  'window-installer-cold-day-rule-told-before-december-install': 'lawn-care-fall-transition-after-last-mow',
  'window-cleaning-daylight-saving-last-start-time': 'lawn-care-fall-transition-after-last-mow',
  'landscape-lighting-dusk-walkthrough-after-clocks-change': 'lawn-care-fall-transition-after-last-mow',
  'boat-yard-winterization-add-ons-approved-in-haul-out-text': 'lawn-care-fall-transition-after-last-mow',
  'party-rental-weather-call-time-stated-at-booking': 'lawn-care-fall-transition-after-last-mow',

  // H13 Confirmation texts that prevent bad reviews → pressure-washing-photo-quote-before-site-visit (2026-11-08)
  'carpet-cleaning-prep-text-before-the-van-arrives': 'pressure-washing-photo-quote-before-site-visit',
  'house-cleaning-first-visit-entry-plan-text-after-booking': 'pressure-washing-photo-quote-before-site-visit',
  'junk-removal-wont-take-list-in-booking-confirmation': 'pressure-washing-photo-quote-before-site-visit',
  'dumpster-rental-weight-limit-stated-in-booking-text': 'pressure-washing-photo-quote-before-site-visit',
  'mobile-notary-id-and-signers-confirmed-at-booking': 'pressure-washing-photo-quote-before-site-visit',
  'moving-company-building-rules-before-month-end-move': 'pressure-washing-photo-quote-before-site-visit',
  'flooring-installer-material-acclimation-start-date-text': 'pressure-washing-photo-quote-before-site-visit',
  'dance-studio-costume-fee-stated-at-signup': 'pressure-washing-photo-quote-before-site-visit',
  'driveway-sealcoating-keep-off-time-texted-same-evening': 'pressure-washing-photo-quote-before-site-visit',
  'auto-body-shop-rental-coverage-end-date-in-drop-off-text': 'pressure-washing-photo-quote-before-site-visit',
  'fence-installer-permit-wait-status-text': 'pressure-washing-photo-quote-before-site-visit',
  'pest-control-rodent-job-what-to-expect-text': 'pressure-washing-photo-quote-before-site-visit',
  'alterations-shop-ready-for-pickup-unclaimed-garments': 'pressure-washing-photo-quote-before-site-visit',
  'home-inspector-report-delivered-deadline-text': 'pressure-washing-photo-quote-before-site-visit',
  'tax-preparer-extension-clients-one-missing-document': 'pressure-washing-photo-quote-before-site-visit',
  'bookkeeper-missing-payee-forms-list-before-year-end': 'pressure-washing-photo-quote-before-site-visit',
  'pet-sitter-visit-done-text-while-owner-is-away': 'pressure-washing-photo-quote-before-site-visit',

  // H14 Fake proof and FTC rules → review-gating-illegal-ftc-rule (2026-11-08)
  'buying-followers-fraud-ftc-rule': 'review-gating-illegal-ftc-rule',

  // H15 Guarantees that are a red flag → lead-guarantee-lie-local-marketing (2026-11-08)
  'guaranteed-page-1-seo-numbers-trick': 'lead-guarantee-lie-local-marketing',

  // Retired outright: operations topics with no marketing angle (2026-11-08)
  'landscaping-payments-invoicing': null,
  'physical-therapy-home-program-discharge': null,
};
