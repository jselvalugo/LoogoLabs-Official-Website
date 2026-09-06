import { pgTable, uuid, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull(),
  business_type: text('business_type'),
  missed_calls: text('missed_calls'),
  pain_point: text('pain_point'),
  decision_maker: text('decision_maker'),
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
