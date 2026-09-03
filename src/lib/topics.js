// Topic hubs: the layer that turns a pile of tagged posts into a site structure.
//
// content/topics.mjs holds the editorial definitions; this module holds the
// matching logic, and it is imported by the React pages, the build-time
// generator, and the Netlify functions alike. Framework-free on purpose — see
// the note at the top of lib/seo.js.

import { topics } from '../../content/topics.mjs';

export const TOPICS = topics;

export const TOPIC_BASE = '/loogonews/topic';

/** Canonical path for a topic hub. */
export const topicPath = (slug) => `${TOPIC_BASE}/${slug}`;

// A hub with almost nothing behind it is a thin page, so it stays out of the
// index until it has earned its place. Nine curated topics all clear this today;
// the guard is for the tenth one somebody adds in a hurry.
export const TOPIC_MIN_POSTS = 3;

/** A post's tags field is a comma-separated string in both the DB and posts.mjs. */
export const splitTags = (tags) =>
  String(tags || '').split(',').map((t) => t.trim()).filter(Boolean);

const norm = (tag) => String(tag || '').trim().toLowerCase();

export const TOPIC_BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t]));

// tag → topics carrying it. Built once; a tag may belong to several topics.
const TOPICS_BY_TAG = new Map();
for (const topic of TOPICS) {
  for (const tag of topic.tags) {
    const key = norm(tag);
    if (!TOPICS_BY_TAG.has(key)) TOPICS_BY_TAG.set(key, []);
    TOPICS_BY_TAG.get(key).push(topic);
  }
}

export const topicBySlug = (slug) => TOPIC_BY_SLUG.get(String(slug || '')) ?? null;

/** Every topic matching any of these tags, in TOPICS order, deduplicated. */
export function topicsForTags(tags) {
  const wanted = new Set();
  for (const tag of Array.isArray(tags) ? tags : splitTags(tags)) {
    for (const topic of TOPICS_BY_TAG.get(norm(tag)) ?? []) wanted.add(topic.slug);
  }
  return TOPICS.filter((t) => wanted.has(t.slug));
}

/** Every topic a post belongs to. */
export const topicsForPost = (post) => (post ? topicsForTags(post.tags) : []);

/** The single topic a post is filed under first — used for breadcrumbs. */
export const primaryTopicForPost = (post) => topicsForPost(post)[0] ?? null;

/** The posts in a topic, keeping the order they were given in (newest first). */
export function postsInTopic(topic, posts = []) {
  if (!topic) return [];
  const wanted = new Set(topic.tags.map(norm));
  return posts.filter((post) => splitTags(post.tags).some((tag) => wanted.has(norm(tag))));
}

/** True when a hub has enough behind it to be worth indexing. */
export const isTopicIndexable = (count) => count >= TOPIC_MIN_POSTS;

/**
 * Posts to recommend beside `post`, most related first.
 *
 * A shared topic counts for more than a shared tag: two posts under
 * "Lead Follow-Up" are about the same job even when one is tagged HVAC and the
 * other Real Estate. Ties break towards the newer post. Posts with nothing in
 * common are used only to pad a short list, so the block is never empty and
 * never a dead end for a crawler.
 */
export function relatedPosts(post, posts = [], limit = 3) {
  if (!post) return [];
  const mine = new Set(splitTags(post.tags).map(norm));
  const myTopics = new Set(topicsForPost(post).map((t) => t.slug));

  const scored = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedTags = splitTags(p.tags).filter((tag) => mine.has(norm(tag))).length;
      const sharedTopics = topicsForPost(p).filter((t) => myTopics.has(t.slug)).length;
      return { post: p, score: sharedTopics * 3 + sharedTags };
    });

  const related = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const filler = scored.filter((s) => s.score === 0);
  return [...related, ...filler].slice(0, limit).map((s) => s.post);
}
