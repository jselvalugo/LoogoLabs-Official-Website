import { pgTable, uuid, timestamp, text, integer, jsonb, numeric, boolean, date } from 'drizzle-orm/pg-core';

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
  // At most one instance receives website form leads (see website_leads_into_crm).
  receives_website_leads: boolean('receives_website_leads').notNull().default(false),
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

// CRM records — columns match src/crm/entities.js; see the crm_full_data_model migration.
const crmOwner = () => uuid('owner_id').references(() => crm_users.id, { onDelete: 'set null' });
const crmInstance = () => uuid('instance_id').notNull().references(() => crm_instances.id, { onDelete: 'cascade' });

export const crm_companies = pgTable('crm_companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  name: text('name').notNull(),
  domain: text('domain'), website: text('website'), industry: text('industry'), type: text('type'),
  employees: numeric('employees'), annual_revenue: numeric('annual_revenue'), phone: text('phone'),
  address: text('address'), city: text('city'), state: text('state'), postal_code: text('postal_code'), country: text('country'),
  owner_id: crmOwner(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const crm_contacts = pgTable('crm_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  name: text('name').notNull(),
  title: text('title'),
  company_id: uuid('company_id').references(() => crm_companies.id, { onDelete: 'set null' }),
  email: text('email'), phone: text('phone'), mobile: text('mobile'),
  lifecycle: text('lifecycle'), source: text('source'), linkedin: text('linkedin'),
  address: text('address'), city: text('city'), state: text('state'), postal_code: text('postal_code'), country: text('country'),
  owner_id: crmOwner(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const crm_leads = pgTable('crm_leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  name: text('name').notNull(),
  company_name: text('company_name'), title: text('title'), email: text('email'), phone: text('phone'), website: text('website'),
  // new | contacted | qualified | unqualified | converted
  status: text('status').notNull().default('new'),
  rating: text('rating'), source: text('source'), estimated_value: numeric('estimated_value'),
  industry: text('industry'), city: text('city'), country: text('country'),
  owner_id: crmOwner(),
  description: text('description'),
  converted_at: timestamp('converted_at'),
  converted_company_id: uuid('converted_company_id').references(() => crm_companies.id, { onDelete: 'set null' }),
  converted_contact_id: uuid('converted_contact_id').references(() => crm_contacts.id, { onDelete: 'set null' }),
  converted_opportunity_id: uuid('converted_opportunity_id'),
  // The website form lead (leads table) this was copied from, if any.
  website_lead_id: uuid('website_lead_id').unique().references(() => leads.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const crm_opportunities = pgTable('crm_opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  name: text('name').notNull(),
  company_id: uuid('company_id').references(() => crm_companies.id, { onDelete: 'set null' }),
  contact_id: uuid('contact_id').references(() => crm_contacts.id, { onDelete: 'set null' }),
  // prospecting | qualification | proposal | negotiation | won | lost
  stage: text('stage').notNull().default('prospecting'),
  amount: numeric('amount'), probability: numeric('probability'), close_date: date('close_date'),
  type: text('type'), source: text('source'), next_step: text('next_step'), lost_reason: text('lost_reason'),
  owner_id: crmOwner(),
  description: text('description'),
  closed_at: timestamp('closed_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Timeline for any record above; entity_type is the entities.js key ('contacts', ...).
export const crm_activities = pgTable('crm_activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  entity_type: text('entity_type').notNull(),
  entity_id: uuid('entity_id').notNull(),
  // note | call | email | meeting | task
  type: text('type').notNull().default('note'),
  subject: text('subject'),
  body: text('body'),
  due_date: date('due_date'),
  completed_at: timestamp('completed_at'),
  owner_id: crmOwner(),
  user_id: uuid('user_id').references(() => crm_users.id, { onDelete: 'set null' }),
  // Set when written through the MCP, e.g. "Claude (Jose's laptop)".
  author_label: text('author_label'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Tokens for the Loogo Labs CRM MCP server, one instance each — see create_crm_api_tokens.
export const crm_api_tokens = pgTable('crm_api_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: uuid('instance_id').notNull().references(() => crm_instances.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default(''),
  token_hash: text('token_hash').notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
  last_used_at: timestamp('last_used_at'),
});

// Client retention & reporting — see the crm_client_reporting migration. A
// client is a crm_companies row; share tokens open /portal/<t> and /recap/<t>.
export const crm_client_portals = pgTable('crm_client_portals', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  company_id: uuid('company_id').notNull().unique().references(() => crm_companies.id, { onDelete: 'cascade' }),
  display_name: text('display_name'), logo_url: text('logo_url'), brand_color: text('brand_color').default('#1A1A18'),
  agency_name: text('agency_name'), welcome: text('welcome'), monthly_fee: numeric('monthly_fee'),
  share_token: text('share_token').notNull().unique(),
  active: boolean('active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const crm_client_metrics = pgTable('crm_client_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  company_id: uuid('company_id').notNull().references(() => crm_companies.id, { onDelete: 'cascade' }),
  period: date('period').notNull(),
  channel: text('channel').notNull().default('All channels'),
  spend: numeric('spend').notNull().default('0'), views: numeric('views').notNull().default('0'),
  engagement: numeric('engagement').notNull().default('0'), conversions: numeric('conversions').notNull().default('0'),
  created_at: timestamp('created_at').defaultNow(),
});

export const crm_approvals = pgTable('crm_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  company_id: uuid('company_id').notNull().references(() => crm_companies.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  // video | draft | image | other
  kind: text('kind').notNull().default('video'),
  media_url: text('media_url'), body: text('body'),
  version: integer('version').notNull().default(1),
  // pending | changes_requested | approved
  status: text('status').notNull().default('pending'),
  due_date: date('due_date'), decided_at: timestamp('decided_at'), decided_by: text('decided_by'),
  created_by: uuid('created_by').references(() => crm_users.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const crm_approval_comments = pgTable('crm_approval_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  approval_id: uuid('approval_id').notNull().references(() => crm_approvals.id, { onDelete: 'cascade' }),
  version: integer('version').notNull().default(1),
  author: text('author').notNull().default(''),
  from_client: boolean('from_client').notNull().default(true),
  timestamp_sec: numeric('timestamp_sec'),
  body: text('body').notNull(),
  resolved: boolean('resolved').notNull().default(false),
  created_at: timestamp('created_at').defaultNow(),
});

export const crm_recaps = pgTable('crm_recaps', {
  id: uuid('id').defaultRandom().primaryKey(),
  instance_id: crmInstance(),
  company_id: uuid('company_id').notNull().references(() => crm_companies.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  start_date: date('start_date'), end_date: date('end_date'),
  summary: text('summary'),
  // [{ label, value, note }]
  metrics: jsonb('metrics').notNull().default([]),
  // [{ title, body, image_url }]
  highlights: jsonb('highlights').notNull().default([]),
  next_steps: text('next_steps'),
  published: boolean('published').notNull().default(false),
  share_token: text('share_token').notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
