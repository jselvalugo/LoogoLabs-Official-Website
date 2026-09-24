import { pgTable, uuid, timestamp, text, integer, jsonb, numeric } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull(),
  // Which quiz this lead came from — 'ai_receptionist' or 'reputation_autopilot'.
  source: text('source').default('ai_receptionist'),
  business_type: text('business_type'),
  missed_calls: text('missed_calls'),
  pain_point: text('pain_point'),
  decision_maker: text('decision_maker'),
  // Reputation Autopilot's own quiz questions — null on AI Receptionist rows.
  job_volume: text('job_volume'),
  review_pain_point: text('review_pain_point'),
  // IP-derived location (Netlify's built-in geolocation) — city/region accuracy, not precise.
  city: text('city'),
  region: text('region'),
  country: text('country'),
  status: text('status').default('new'),
  notes: text('notes').default(''),
});

// One row per (deduplicated, one-per-session) blog post view, so views can be
// broken down by location and by date — the posts.views counter alone can only
// ever show a running total.
export const post_views = pgTable('post_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  post_slug: text('post_slug').notNull(),
  city: text('city'),
  region: text('region'),
  country: text('country'),
  created_at: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').default(''),
  content: text('content').notNull().default(''),
  tags: text('tags').default(''),
  status: text('status').default('draft'),
  views: integer('views').default(0),
  author: text('author').default('Loogo Labs'),
  read_time: integer('read_time').default(5),
  published_at: timestamp('published_at'),
});

// Park Supply proposal submissions — see the create_proposals migration.
export const proposals = pgTable('proposals', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  number: text('number').notNull(),
  organization: text('organization'),
  contact: text('contact').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  project: text('project'),
  location: text('location'),
  scope: text('scope').default(''),
  // [{ sku, name, unit, qty, price, list_price }]
  lines: jsonb('lines').notNull().default([]),
  discount_pct: numeric('discount_pct').default('0'),
  shipping: numeric('shipping').default('0'),
  tax_pct: numeric('tax_pct').default('0'),
  subtotal: numeric('subtotal').default('0'),
  total: numeric('total').default('0'),
  // new → reviewing → sent → won | lost
  status: text('status').default('new'),
  admin_notes: text('admin_notes').default(''),
  city: text('city'),
  region: text('region'),
  country: text('country'),
});

// Engaged-time sessions for Analytics — see the create_site_sessions migration.
export const site_sessions = pgTable('site_sessions', {
  id: uuid('id').primaryKey(),
  started_at: timestamp('started_at').defaultNow(),
  last_seen_at: timestamp('last_seen_at').defaultNow(),
  active_seconds: integer('active_seconds').default(0),
  page_count: integer('page_count').default(1),
  landing_path: text('landing_path'),
  // { "/path": engagedSeconds }
  paths: jsonb('paths').notNull().default({}),
  referrer: text('referrer'),
  device: text('device'),
  city: text('city'),
  region: text('region'),
  country: text('country'),
});
