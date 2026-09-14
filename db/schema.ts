import { pgTable, uuid, timestamp, text, integer } from 'drizzle-orm/pg-core';

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
  status: text('status').default('new'),
  notes: text('notes').default(''),
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
