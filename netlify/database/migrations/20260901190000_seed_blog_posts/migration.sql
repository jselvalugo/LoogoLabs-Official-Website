-- Seeds the 5 SEO-focused LoogoNews posts as drafts for human review before publishing.
-- Idempotent: safe to re-run, existing slugs are left untouched.

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time)
VALUES ('The Missed Call That Cost an HVAC Company $4,200', 'missed-call-text-back-hvac', 'Every unanswered call is a lead calling your competitor next — here is the fix that costs nothing to run.', 'Last July, a homeowner''s AC quit on a 97-degree Tuesday. She called three HVAC companies in eleven minutes. Two went to voicemail. One didn''t pick up either — but texted her back in under a minute: "Sorry we missed your call — this is Coastline Air. What''s going on with your system?" She replied with her address before the other two companies called her back.

That was a $4,200 job. It went to the company that answered a text, not a phone.

## The number you''re not tracking

Every HVAC owner I talk to can tell me their close rate on calls they actually took. Almost none can tell me how many calls they never got the chance to close, because nobody was in the truck, on another line, or the call rang out after hours.

Run this audit for one week: pull your call log and count every call under two minutes that didn''t come from a repeat customer. Those are likely unanswered calls or hang-ups. Then check how many of those numbers called back. Most owners are surprised the number is close to zero. A missed call isn''t a maybe. It''s a customer who is already dialing the next name on the list.

## What actually closes the gap

A missed-call text-back does one thing: the second a call goes unanswered, the caller gets an automatic text asking what they need. No hold music, no "leave a message." Just a real response, seconds after the ring stops.

For a homeowner standing in a hot house, that text is the difference between "someone''s on it" and "nobody''s picking up, next call." It doesn''t need to be clever. It needs to be fast.

### What it should say

- Acknowledge the missed call by name if you can
- Ask one direct question about what they need
- Set an expectation ("someone will call you back within 15 minutes")

That last part matters more than people think. A text that doesn''t get followed by a real callback is worse than no text — it tells the customer you''re automated, not attentive.

## Where this breaks down

I''ve seen contractors set up the text-back and stop there. The automation sends the message, a lead replies, and it sits in an inbox nobody''s watching until the next morning. By then the job''s gone.

The text buys you the first response. A person still has to close it. If dispatch or the office isn''t checking replies within a few minutes during business hours, you''ve built a faster way to ignore people — not a faster way to book them.

## The next step

Pull last week''s call log tonight. Count the calls that went unreturned within five minutes. Multiply that by your average ticket. That''s not a hypothetical number — that''s revenue that rang your phone and hung up on someone else.

Fix the response time before you fix anything else in your marketing. A better ad that feeds a slow callback is just a faster way to lose the same leads.', 'Missed Call Text-Back, HVAC, Lead Follow-Up', 'draft', 'David Selva', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time)
VALUES ('Why Your Dental Practice Is Losing New Patients Before the Front Desk Even Calls Back', 'dental-practice-lead-response-time', 'The practice that responds in five minutes wins the new patient. The one that responds tomorrow morning gets the voicemail.', 'A woman searches "emergency dentist near me" at 8:40 on a Tuesday night. She fills out the contact form on three practice websites because she doesn''t know which one will actually call her back. Two send an automated "we''ll be in touch during business hours" email. One sends a text within ninety seconds: "Hi Sarah, this is Riverside Dental — we got your message about the tooth pain. Can you come in tomorrow at 9am or 2pm?"

She''s not calling the other two practices back. She already has an appointment.

## Speed decides more than your website does

Practices spend real money on SEO, ads, and a nice website to get that form filled out. Then the lead sits in an inbox until someone gets to it the next morning. By then, she''s already booked somewhere else.

The data on this isn''t close: contacting a new lead within five minutes makes them dramatically more likely to convert than contacting them an hour later. Every hour after that, the odds keep dropping. Your marketing spend doesn''t fail at the ad. It fails at the follow-up.

## What "instant" actually needs to look like

- A text within two minutes of a form submission, not an email that lands in a promotions folder
- A specific ask — a time, not "someone will reach out soon"
- A real name attached, not "Riverside Dental Team"

New patients aren''t comparing your reviews at 9pm. They''re comparing who replies first.

## The part practices skip

Automated follow-up isn''t a replacement for the front desk — it''s what buys the front desk time. The text confirms you got the message and sets an expectation. A person still has to call and lock in the visit, ideally the same day.

I''ve watched practices set this up, get excited about the instant reply, and then let the actual phone call slip to "whenever someone has a minute." The lead cools off in exactly the window you just worked to shrink.

## What this looks like over a quarter

Practices that treat lead response like a clinical protocol — same standard every time, no exceptions — consistently book more of their form fills into actual appointments than practices where response time depends on who''s at the desk and how busy the day is. Consistency beats cleverness here.

## The next step

Look at your form submissions from the last two weeks. For each one, find the timestamp of the actual first contact — not when it was assigned, when the patient heard back. If most of those gaps are measured in hours, that''s not a marketing problem. That''s the fix that will move your numbers before anything else you try.', 'Lead Follow-Up, Dental Practices, Speed to Lead', 'draft', 'David Selva', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time)
VALUES ('The Google Review System Most Salon Owners Never Build', 'salon-google-review-system', 'Asking for reviews by hand doesn’t scale past your fifth client of the day — here is what does.', 'A stylist finishes a color correction that took three hours and left a client thrilled enough to post a before-and-after on her own Instagram. Nobody asks her for a Google review. She means to leave one. She doesn''t, because by the time she''s home, she''s onto the next thing.

That''s not a client problem. That''s a timing problem.

## Reviews get left in a narrow window

The best time to ask for a review is inside the first hour after the appointment, while the result is still fresh and the client is still looking in the mirror. Ask a week later and you''re competing with everything else in her life. Most salons ask at checkout, verbally, which depends entirely on whether the front desk remembers and whether the client has two free minutes standing there.

That''s why review counts stall even for salons doing genuinely great work. It''s not a quality problem. It''s a follow-through problem.

## What a real system looks like

- An automatic text or email that goes out shortly after the appointment ends, not at checkout
- A direct link to the Google review page — not a search, a click
- One clear ask, no paragraph of context

### The part owners get wrong

Sending the same request to every client, every time, works fine — you don''t need to get clever with the wording. What kills response rates is timing, not phrasing. A request sent the next morning gets ignored. A request sent an hour after the appointment, while she''s still admiring the color in her car mirror, gets answered.

## The compounding effect

A salon booking 15 color services a week that converts even a third of those into reviews adds roughly 20 new reviews a month. Over six months, that''s a review count competitors spend years accumulating by asking occasionally. Review count and recency both factor into how salons show up in local search — a steady stream beats a burst you did once for a launch.

## Watching for problems, not just praise

The same system that captures happy clients should flag the ones who aren''t. A quick internal check-in — "how did everything go?" — before the public review ask catches a bad experience before it becomes a public one-star post instead of a private conversation you can actually fix.

## The next step

Time your next ten review requests against the actual appointment end time, not checkout time. If most go out same-day but hours later, tighten that window first. The ask itself rarely needs work. When it goes out does.', 'Reputation Management, Salons & Spas, Google Reviews', 'draft', 'David Selva', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time)
VALUES ('The First Five Minutes After a Lead Fills Out Your Form Decide the Deal', 'real-estate-lead-response-time', 'Real estate leads go cold fast — the agent who calls first usually wins, not the agent with the better listing photos.', 'A buyer scrolling listings at 9pm requests info on three properties, each from a different agent''s site. Two agents call the next morning. One texts within four minutes: "Hi — saw you''re interested in the Maple St listing, it''s still available, want to see it this weekend?"

She books a showing with the agent who texted. The other two never get a call back.

## Leads don''t wait for business hours

Real estate leads come in whenever someone happens to be scrolling — often nights and weekends, exactly when agents are least likely to be checking their inbox. A lead that sits for even a couple of hours has usually already reached out to two or three other agents by the time you see it.

This isn''t about being more available than everyone else. It''s about being fast the one time it matters — the first contact.

## What the first message needs

- Reference the specific property, not a generic "thanks for your interest"
- Ask a direct question that requires a reply — a showing time, not "let me know if you have questions"
- Come from a text, since most leads respond to texts faster than email or a voicemail they''ll never listen to

An instant automated response buys the first few minutes. It''s not a substitute for the agent actually calling. It''s what keeps the lead warm until that call happens.

## Where agents lose leads they already generated

Plenty of agents pay for leads through paid ads or portal subscriptions and then let the follow-up slide because they''re mid-showing with someone else. That''s not a lead-generation problem — the lead already existed. It''s a follow-up problem, and it''s the more expensive one, because you already paid to generate that contact.

### A simple standard to hold yourself to

- First response inside 5 minutes, any hour
- A specific next step offered in that response, not just an acknowledgment
- A second touch within 24 hours if the first gets no reply

## Why this matters more in a slower market

When inventory is tight and buyers are competing for showings, speed matters less — everyone''s motivated. When the market slows and buyers are casually browsing, the agent who responds fastest is usually the only one who gets a reply at all. Slow markets punish slow follow-up hardest.

## The next step

Pull your last 20 leads and time the gap between form submission and first real contact — not assignment, contact. If the gap is measured in hours rather than minutes, that''s the leak. Fix that before spending another dollar on lead generation.', 'Lead Follow-Up, Real Estate, Speed to Lead', 'draft', 'David Selva', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time)
VALUES ('No-Shows Aren’t a People Problem — They’re a Systems Problem', 'reduce-no-shows-appointment-reminders', 'A single reminder text the night before does more for your schedule than any policy about cancellation fees.', 'An electrician books six appointments for a Thursday. Two people don''t answer the door. Neither had bad intentions — one forgot, the other double-booked without realizing the conflict until the truck was already outside. Two no-shows on a six-job day isn''t a scheduling problem. It''s a third of the day''s revenue, gone, with the truck already burning gas to get there.

Most owners respond to no-shows with a policy — a cancellation fee, a stricter booking process. That treats the customer like the problem. Usually, the actual problem is that nobody reminded them.

## People forget. That''s the whole explanation.

Appointments get booked days or weeks in advance, often through a form or a call that happens once and is never mentioned again until the truck shows up. Between booking and appointment, life happens. A single reminder the day before, with a simple confirm-or-reschedule option, catches most of what would otherwise be a no-show.

## What a real reminder sequence looks like

- Confirmation immediately after booking, so there''s a record of the appointment in writing
- A reminder 24 hours before, with a way to confirm or reschedule in one tap
- A shorter reminder 1 hour before, for the day-of forgetters

That middle step does the heavy lifting. It''s far enough out that a reschedule doesn''t waste a truck roll, and close enough that the appointment is still top of mind.

### Why the 1-hour reminder matters separately

The 24-hour reminder catches people who forgot they booked at all. The 1-hour reminder catches people who remembered but got pulled into something else and need a nudge. They''re solving two different failure points — skip either one and you''re only catching half the problem.

## What this is worth in real numbers

Contractors who put a proper two-touch reminder sequence in place typically see no-shows drop by something in the 40–60% range, depending on how bad the starting point was. On a schedule running five or six jobs a day, that''s not a minor efficiency gain — it''s the difference between a profitable Thursday and a half-wasted one.

## The part that still needs a human

Reminders reduce no-shows. They don''t eliminate reschedules, and a reschedule handled badly — no easy way to pick a new time, a callback that takes two days — turns into a no-show anyway, just a later one. The system should make rebooking as easy as the original booking was.

## The next step

Look at your last month of appointments and count the no-shows. Multiply that by your average ticket. That number is what a two-text reminder sequence is worth to you before you touch anything else in your scheduling process.', 'Booking & Scheduling, No-Show Reduction, Automation', 'draft', 'David Selva', 3)
ON CONFLICT (slug) DO NOTHING;
