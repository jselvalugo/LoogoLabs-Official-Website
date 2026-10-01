# Routine: write and feature a new LoogoNews post

The instructions a scheduled routine follows to publish one new LoogoNews post
and make it the **featured** post. Copy everything under "Prompt" into the
routine. The featured post appears in three places, all driven by one database
flag (`posts.featured`), so there is no page code to touch:

- **Homepage**: the "★ Featured on LoogoNews" line under the hero
- **/news**: the large dark spotlight panel at the top of the index
- **The post page**: the featured header, drop cap and reading-progress bar

Only one post can be featured at a time. Featuring a new post retires the
previous one into the regular LoogoNews feed: it stays published, at the same
URL, with its original publish date, views and text, and appears in the "All
posts" grid and the latest-posts lists in date order. Nothing is deleted or
re-dated.

---

## Prompt

You are publishing **one** new LoogoNews post on loogolabs.com and making it the
featured post. Work in the `jselvalugo/LoogoLabs-Official-Website` repository.
Follow the steps in order. If any step fails or a check doesn't hold, stop, do
not merge, and report exactly what failed.

### 1. Start clean

- `git fetch origin main`, then create `claude/featured-post-YYYY-MM-DD` (today's
  date) from `origin/main`. If that branch or an open PR for today already
  exists, stop: one post per day.
- `npm ci` if `node_modules` is missing.

### 2. Read the house rules, in full, before writing anything

- `brand/CONTENT-POLICY.md`: originality is absolute.
- `brand/BLOG-VOICE.md`: voice, reader and byline (first person, as David Selva).
- `brand/GHL-CONTEXT.md`: what the platform does. Never name the platform or any vendor.
- `brand/BLOG-TOPIC-LOG.md`: every topic + vertical pairing already used.

Also skim the **titles, excerpts and first paragraphs** of the 10 newest posts in
`content/posts.mjs`, only to avoid repeating their angle, opening or closing.
Do not reuse their wording.

### 3. Pick the topic

- Choose a topic + vertical pairing that is **not** in `brand/BLOG-TOPIC-LOG.md`
  and doesn't make the same argument as an existing post in a different vertical.
- It's the featured post, so pick the strongest idea available: one specific,
  practical problem a local service business owner has **this month** (season,
  holidays, year-end, weather), with a fix they can act on themselves.
- Before writing, state in one line each: the reader, the problem, the fix, and
  why it's timely. If you can't fill all four crisply, pick another topic.

### 4. Write the post — original work only

Write it yourself, from a blank page. Do **not** search the web, open other
blogs or articles, or paste in any outside text as a reference or "context".
No copying, paraphrasing or restructuring someone else's piece, no quotes from
others, no borrowed lists or frameworks, and no statistics, studies or figures
you can't stand behind — if a number isn't from your own reasoning ("if you
book 20 jobs a week…"), leave it out. Examples must be invented and clearly
illustrative, never real named businesses or people.

Add one object at the **top** of the `posts` array in `content/posts.mjs`:

```js
{
  slug: `short-keyword-slug`,        // lowercase, hyphens, unique in the file
  title: `Title Under ~70 Characters`,
  excerpt: `One sentence, the sharpest line of the post.`,
  tags: `Topic, Subtopic, Vertical`, // 2–3, comma-separated
  content: `Markdown body…`,
},
```

Requirements:

- **Excerpt**: shown as the pull quote on /news and as the standfirst on the
  post page. One sentence, under ~200 characters, no surrounding quote marks,
  and not a copy of a sentence from the body.
- **Title**: shown up to 84px tall; under ~70 characters, concrete, no clickbait.
- **First paragraph**: plain prose (it gets the drop cap). Open on the problem,
  not a preamble or a question to the reader.
- **Body**: 450–900 words, `##` section headings, short paragraphs.
  Only `##`, `###`, `-` lists, `>` quotes, `**bold**`, `*italic*`, `` `code` ``.
  No links, images, tables or HTML.
- Escape every backtick in text as `` \` `` (the strings are template literals);
  avoid `${` in text.
- End with **one** concrete thing the reader can check or change this week.
- Do not set `featured` in `content/posts.mjs`; that is step 6.

### 5. Generate the post migration

`npm run db:generate-post-migration -- new_post_<short_slug>`

Open the new `netlify/database/migrations/<stamp>_new_post_<short_slug>/migration.sql`
and confirm the new post is in it. The generator upserts every post; that's
expected — existing posts keep their `status` and `published_at`.

### 6. Note the outgoing featured post, then feature the new one

Before running anything, record the **current** featured post's slug and title:

- the slug in the newest `*_feature_*` folder under `netlify/database/migrations/`; or,
- if there is no such folder yet, the newest published post before today
  (that's what `20261001120000_posts_add_featured` featured); or the post
  marked ★ in /admin.

Then run `npm run db:feature-post -- <new-slug>` and confirm:

- its stamp sorts **after** the post migration from step 5;
- its SQL only contains the two `UPDATE "posts" SET "featured" = …` statements —
  nothing touches `status`, `published_at`, `views`, `slug` or text.

### 7. Confirm the outgoing post stays in the feed

- `git diff origin/main -- content/posts.mjs` shows **only** your new object
  added. The outgoing post (and every other post) is unchanged.
- Nothing in the diff deletes or re-dates any post.

After deploy it will show in the /news "All posts" grid and latest-posts lists
by its original date, with the standard post layout, at the same URL.

### 8. Log the topic

Append a row to `brand/BLOG-TOPIC-LOG.md`:
`- YYYY-MM-DD | <slug> | <vertical> | <topic>`

### 9. Check it

- `npm run build` must pass (it also regenerates the sitemap, RSS feed and the
  pre-rendered post page). Confirm the new slug appears in the generated sitemap.
- Count the body words and confirm 450–900.
- Re-read the post once against `brand/CONTENT-POLICY.md` and
  `brand/BLOG-VOICE.md`. Rewrite anything generic or machine-made: filler
  openers, "in today's world", "game-changer", "unlock", tidy rule-of-three
  lists, a summary paragraph that repeats the post. Never name the platform or
  a vendor.

### 10. Ship it

- Commit: `Add featured LoogoNews post: <title>`
- Push the branch and open a PR against `main` with the same title. Body:
  - **Title**, **Excerpt**, **Slug**, **Tags**, **Word count**
  - **Why this topic now**: one line
  - **Moved to archive**: `<previous title>` (`<previous slug>`) — un-featured
    only; still published, original date, still in latest posts.
- Merge once the checks pass. Netlify deploys `main` and applies both
  migrations; the post goes live already featured.
- After deploy, if you can, load `/news`, the new post's URL and the previous
  featured post's URL and confirm all three behave as described above.

### Rules

- One post per run. If no unused pairing fits, stop and say so — never reuse one.
- Never edit, delete or re-date an existing post, including the one being
  un-featured. Un-featuring only clears its flag.
- Never hand-write or edit migration SQL; always use the two npm scripts.
- Never touch page code, styles or other brand files in this routine.
