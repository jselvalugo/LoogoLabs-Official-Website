---
name: utm-tracking-plan
description: Build consistent UTM-tagged links and a campaign tracking plan (naming convention, link sheet, conversion events) so every channel reports cleanly in GA4 and ad platforms. Use when asked for UTMs, tracking links, a naming convention, or "why is my traffic showing as direct/unassigned".
---

# UTM & Tracking Plan

Give every link a clean, predictable UTM so reporting works the first time.

## 1. Collect

- Landing page URL(s)
- Campaign name and dates
- Channels and placements (e.g. Meta feed, Google Search, newsletter, Instagram bio, partner post)
- Any existing naming convention the user already uses — **keep theirs** if they have one.

## 2. The convention (default)

All lowercase, words joined with hyphens, no spaces, no special characters.

| Parameter | Answers | Allowed values (default) |
|---|---|---|
| `utm_source` | Who sent the visit | `google`, `meta`, `linkedin`, `tiktok`, `newsletter`, `instagram`, partner name |
| `utm_medium` | What kind of traffic | `cpc`, `paid-social`, `email`, `social`, `referral`, `affiliate`, `qr` |
| `utm_campaign` | Which campaign | `yyyy-mm-short-name`, e.g. `2026-11-black-friday` |
| `utm_content` | Which ad or link | angle or creative, e.g. `pain-video-a` |
| `utm_term` | Paid keyword / audience | optional |

GA4 groups traffic into default channels by `utm_medium` and `utm_source`. Use `cpc` for paid search, and `paid-social` (or `paid`) for paid social so traffic lands in the paid channel group rather than "Unassigned". Never put UTMs on internal links between pages of the same site — it starts a new session and breaks attribution.

## 3. Output

1. **Naming convention** — the table above, adjusted to the user's channels.
2. **Link sheet** as a table and as CSV:

```
channel,placement,utm_source,utm_medium,utm_campaign,utm_content,final_url
```

Build `final_url` by appending parameters with `?` (or `&` if the URL already has a query string). URL-encode anything that isn't a-z, 0-9 or hyphen.

3. **Conversion events** — list the events the campaign needs (e.g. `generate_lead`, `sign_up`, `purchase`, `book_call`), where each fires, and which should be marked as key events in GA4 and imported into the ad platforms.
4. **QA checklist**:
   - Click every link; confirm the page loads and parameters survive any redirect.
   - Check GA4 Realtime for the source/medium.
   - Confirm ad platforms' auto-tagging (gclid, fbclid) is on and not stripped.

## Rules

- Consistency beats perfection: one spelling per source, forever.
- Tag only the links you'll actually report on; more parameters are not more insight.
- If the user reports "direct / unassigned" spikes, check for missing or mis-cased mediums before anything else.
