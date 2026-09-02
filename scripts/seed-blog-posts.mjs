// Seeds any LoogoNews post missing from the database as a draft, for review
// before publishing. Run with: npm run db:seed-posts
// Requires NETLIFY_DATABASE_URL in the environment (e.g. `netlify dev` or `netlify env:pull`).
//
// Post text lives in content/posts.mjs — the single source of truth shared with
// scripts/generate-post-migration.mjs. Existing slugs are never touched here; to
// revise a published post, edit content/posts.mjs and generate a migration.

import { getDatabase } from '@netlify/database';
import { posts } from '../content/posts.mjs';
import { readTime } from './generate-post-migration.mjs';

async function seed() {
  const { sql } = getDatabase();
  for (const post of posts) {
    const [row] = await sql`
      INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time)
      VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.tags}, 'draft', 'David Selva', ${readTime(post.content)})
      ON CONFLICT (slug) DO NOTHING
      RETURNING slug
    `;
    console.log(row ? `Inserted: ${post.slug}` : `Skipped (already exists): ${post.slug}`);
  }
}

seed()
  .then(() => {
    console.log('Done. New posts were inserted as drafts — review and publish from the admin panel.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
