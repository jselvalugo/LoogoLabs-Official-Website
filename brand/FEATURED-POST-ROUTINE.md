# Routine: write and feature a new LoogoNews post

The instructions a scheduled routine follows to publish one new LoogoNews post
and make it the **featured** post. Copy everything under "Prompt" into the
routine. The featured post appears in three places, all driven by one database
flag (`posts.featured`), so there is no page code to touch:

- **Homepage**: the "★ Featured on LoogoNews" line under the hero
- **/news**: the large dark spotlight panel at the top of the index
- **The post page**: the featured header, drop cap and reading-progress bar

Only one post can be featured at a time. Featuring a new post retires the
previous one back into the regular LoogoNews archive: it stays published, at the
same URL, with its original publish date, views and text, and appears in the
"All posts" grid in date order. Nothing is deleted or re-dated.

---

## Prompt

You are publishing one new LoogoNews post on loogolabs.com and making it the
featured post. Work in the `jselvalugo/LoogoLabs-Official-Website` repository.

### 1. Start clean
- `git fetch origin main` and create a new branch from `origin/main` named
  `claude/featured-post-YYYY-MM-DD` (today's date).
- `npm ci` if `node_modules` is missing.

### 2. Read the house rules before writing anything
Read all four, in full:
- `brand/CONTENT-POLICY.md`: originality is absolute. Write from a blank page;
  no copying, no rewording someone else's article, no statistic you can't stand behind.
- `brand/BLOG-VOICE.md`: voice, reader and byline (first person, as David Selva).
- `brand/GHL-CONTEXT.md`: what the platform does. Never name the platform or any vendor.
- `brand/BLOG-TOPIC-LOG.md`: every topic + vertical pairing already used.

### 3. Pick the topic
- Choose a topic + vertical pairing that is **not** in `brand/BLOG-TOPIC-LOG.md`
  and doesn't make the same argument as an existing post in a new vertical.
- It is the featured post, so pick the strongest idea available: one specific,
  practical problem a local service business owner has this month, with a clear
  fix they can act on.

### 4. Write the post
Add one object at the **top** of the `posts` array in `content/posts.mjs`:

```js
{
  slug: `short-keyword-slug`,       // lowercase, hyphens, unique
  title: `Title Under ~70 Characters`,
  excerpt: `One sentence, the sharpest line of the post.`,
  tags: `Topic, Subtopic, Vertical`, // 2–3, comma-separated
  content: `Markdown body…`,
},
```

Requirements for the featured post:
- **Excerpt** matters more than usual: it is shown as the pull quote on /news
  and as the standfirst under the title on the post page. One sentence, under
  ~200 characters, no quote marks around it.
- **Title** is shown up to 84px tall; keep it under ~70 characters.
- **First paragraph is plain prose** (not a heading, list or quote), because it
  gets the drop cap. Open with the problem, not a preamble.
- Body: 450–900 words, `##` section headings, short paragraphs. Supported
  Markdown only: `##`, `###`, `- ` lists, `> ` quotes, `**bold**`, `*italic*`,
  `` `code` ``. No links, images or tables.
- Escape any backtick in the text as `` \` `` (the strings are template literals).
- Don't open or close the same way as a recent post. End with one concrete thing
  the reader can check or change this week.
- Do not set `featured` in `content/posts.mjs`; that is step 6.

### 5. Generate the post migration
```
npm run db:generate-post-migration -- new_post_<short_slug>
```
Open the new `netlify/database/migrations/<stamp>_new_post_<short_slug>/migration.sql`
and confirm the new post is in it. The generator upserts every post; that is
expected and safe (existing posts keep their dates and status).

### 6. Make it the featured post
```
npm run db:feature-post -- <slug>
```
This writes a second migration that un-features the current post and features
the new one. Check that its stamp sorts **after** the post migration (it will
if you run the commands in this order); the post must exist before it can be
featured.

### 7. Retire the previous featured post into the archive
The previous featured post must stay on the site as a normal post. Before
committing, confirm:
- Note its slug first: in `/admin` it is the post marked ★, or it is the slug
  in the most recent `*_feature_*` folder under `netlify/database/migrations/`.
- It is still in `content/posts.mjs`, unchanged. Do not remove, rename or edit it.
- The feature migration from step 6 only changes the `featured` column. It must
  not touch that post's `status`, `published_at`, `views`, `slug` or text.
- The post migration from step 5 leaves existing posts' `status` and
  `published_at` alone (it says so in its header), so the old post keeps its
  original date and its place in the feed.
- In the pull request body, list the previous featured post by title and slug
  under "Moved to archive", so there is a record of the hand-off.

After deploy, the old post shows in the /news "All posts" grid by its original
date, its page uses the standard post layout, and its URL keeps working.

### 8. Log the topic
Append a row to `brand/BLOG-TOPIC-LOG.md`:
`- YYYY-MM-DD | <slug> | <vertical> | <topic>`

### 9. Check it
- `npm run build` must pass (it also regenerates the sitemap, RSS feed and the
  pre-rendered post page).
- Re-read the post once, aloud in your head, against `brand/CONTENT-POLICY.md`.
  Rewrite anything that sounds generic or machine-made.

### 10. Ship it
- Commit: `Add featured LoogoNews post: <title>`.
- Push the branch and open a pull request against `main` titled the same, with
  the title, excerpt, slug and word count in the body, plus the
  "Moved to archive" line from step 7.
- Merge the pull request once the checks pass. Netlify deploys `main` and
  applies both migrations; the post goes live already featured.

### Rules
- One post per run. If you can't find a pairing that isn't already logged,
  stop and say so instead of reusing one.
- Never edit, delete or re-date an existing post as part of this routine,
  including the one being un-featured. Un-featuring only clears its flag.
- Never hand-write migration SQL; always use the two npm scripts above.
