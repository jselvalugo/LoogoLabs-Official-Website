import { pgTable, uuid, timestamp, text, integer, jsonb, numeric, boolean } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull(),
  // Which quiz this lead came from — 'ai_receptionist', 'reputation_autopilot', or a
  // niche quiz source from src/lib/nicheQuizzes.js (e.g. 'quiz_dental').
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
  // CRM pipeline stage: new | contacted | qualified | proposal | won | lost.
  status: text('status').default('new'),
  // The visitor's own submission details (quiz extras, partnership form).
  notes: text('notes').default(''),
  // site_sessions.id of the visit this lead came from (Analytics consent only).
  session_id: uuid('session_id'),
  // Admin-maintained CRM fields.
  phone: text('phone'),
  company: text('company'),
  deal_value: numeric('deal_value'),
  follow_up_at: timestamp('follow_up_at'),
  updated_at: timestamp('updated_at').defaultNow(),
});

// CRM timeline for a lead: notes, logged calls/emails/meetings, stage changes.
export const lead_activity = pgTable('lead_activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  lead_id: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull().default('note'),
  body: text('body').notNull().default(''),
  created_at: timestamp('created_at').defaultNow(),
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
  // At most one row is true (partial unique index posts_one_featured).
  featured: boolean('featured').notNull().default(false),
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
  // site_sessions.id of the visit this proposal came from (Analytics consent only).
  session_id: uuid('session_id'),
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

// Multi-tenant CRM (crm.loogolabs.com) — see the create_crm migration.
export const crm_instances = pgTable('crm_instances', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  // active | suspended — a suspended instance cannot sign in.
  status: text('status').notNull().default('active'),
  created_at: timestamp('created_at').defaultNow(),
});

export const crm_users = pgTable('crm_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: uuid('instance_id').notNull().references(() => crm_instances.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  name: text('name').notNull().default(''),
  password_hash: text('password_hash').notNull(),
  // owner | member
  role: text('role').notNull().default('member'),
  created_at: timestamp('created_at').defaultNow(),
  last_login_at: timestamp('last_login_at'),
});

export const crm_sessions = pgTable('crm_sessions', {
  token_hash: text('token_hash').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => crm_users.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow(),
  expires_at: timestamp('expires_at').notNull(),
});

export const crm_contacts = pgTable('crm_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: uuid('instance_id').notNull().references(() => crm_instances.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  company: text('company').notNull().default(''),
  email: text('email').notNull().default(''),
  phone: text('phone').notNull().default(''),
  // lead | qualified | proposal | won | lost
  stage: text('stage').notNull().default('lead'),
  value: numeric('value'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const crm_notes = pgTable('crm_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: uuid('instance_id').notNull().references(() => crm_instances.id, { onDelete: 'cascade' }),
  contact_id: uuid('contact_id').notNull().references(() => crm_contacts.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').references(() => crm_users.id, { onDelete: 'set null' }),
  body: text('body').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
