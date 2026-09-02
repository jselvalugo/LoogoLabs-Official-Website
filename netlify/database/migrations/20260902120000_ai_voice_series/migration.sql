-- LoogoNews series: AI and AI voice agents on the phone (5 posts), published live.
-- Idempotent: safe to re-run, existing slugs are left untouched.

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time, published_at)
VALUES ('The 2 A.M. Burst Pipe Call Your Plumbing Company Never Hears', 'ai-voice-after-hours-plumbing', 'After-hours calls do not go to your competitor because they are cheaper. They go there because somebody picked up.', 'A supply line lets go at 11:40 on a Sunday night. Water is coming through the kitchen ceiling. The homeowner does not open a browser and compare plumbers — they tap the first three numbers on the search page and hire whoever answers.

Two of those numbers ring out to voicemail with a message recorded in 2019. The third one answers on the second ring, asks whether the water is shut off yet, confirms the address, and puts the job on the on-call tech''s schedule for 12:15. That plumber did not out-market anyone. He answered.

## Voicemail is a decision

Most plumbing shops treat after-hours coverage as a staffing question: either somebody carries the phone or nobody does. Framed that way, the answer is usually nobody, because paying a person to sit through eleven quiet nights for the four calls that come in on the twelfth does not pencil out.

But the calls still come. What happens to them is not a neutral outcome — it is a decision to send emergency work, the highest-margin work you do, to whoever is awake.

## What an AI voice agent actually does on that call

An AI voice agent is not a robot receptionist reading a phone tree. It answers, holds a normal conversation, and works through the same intake your best dispatcher would:

- Confirms whether this is an active leak, a no-hot-water call, or something that can wait until Tuesday
- Tells the caller to shut off the main and where to find it, because that is the same thing you would say
- Captures name, address, and callback number, and repeats them back
- Books the emergency slot on the on-call calendar, or the first available morning slot if it can wait
- Sends you and the tech a text with the details before the caller has hung up

The caller gets an answer in eight seconds instead of a beep. You get a booked job on the schedule instead of a voicemail nobody plays until 7 a.m.

## Where it stops, and should

An AI voice agent is good at intake. It is not good at judgment calls that carry real money or real risk, and it should not be asked to make them.

It should not quote a repair price sight unseen. It should not promise an arrival window your on-call tech cannot hit. It should not talk a panicking homeowner through anything involving gas. Those calls need to route to a person immediately, and the handoff rule should be written before you turn the thing on — not discovered on a Saturday.

Set it up so that anything mentioning gas, sewage backup, or a commercial property rings a human right away. Everything else, it can handle end to end.

## What it is worth on your numbers

Do this arithmetic with your own figures rather than mine. Count the calls that hit voicemail outside business hours last month. Take the share of them that were real emergencies, and multiply by your average emergency ticket.

For a shop taking twenty after-hours calls a month with a $650 average emergency ticket, recovering even a third of them is more than $4,000 in monthly revenue that is already dialing your number. That is not new lead generation. It is the leads you have already paid to acquire, finally getting picked up.

## The next step

Call your own after-hours line tonight and listen to what a customer hears. If it is a beep, you have your answer — and the fix is a configuration problem, not a hiring one.', 'AI Voice Agents, Plumbing, After-Hours Calls', 'published', 'David Selva', 3, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time, published_at)
VALUES ('Your Service Advisor Is on the Phone While Three Cars Sit in the Lot', 'ai-voice-booking-auto-repair', 'The bottleneck in most repair shops is not the bays. It is the one person who has to answer the phone and check in customers at the same time.', 'Monday, 8:10 a.m. Three customers are standing at the counter and the phone has rung six times. Your service advisor can do one of those two jobs well. He cannot do both, so the phone loses — and every call that rolls to voicemail on a Monday morning is somebody who is already sitting in their driveway deciding where to take the car.

## The shop is not short on bays

Most independent shops I talk to assume growth means more lifts or another tech. Then we pull the call log and find sixty to eighty unanswered calls a month, clustered almost entirely between 7:30 and 9:30 a.m. and again right at close.

The capacity is there. The intake is what is broken. A bay that runs at 70% because the phone is busy is a scheduling problem wearing a staffing problem''s clothes.

## What booking on the call actually requires

Plenty of shops have a booking link. Almost nobody calling about a check engine light is going to use it — they called because they wanted to talk to somebody. So the booking has to happen on the phone, on that call, or it does not happen.

An AI voice agent handles that when it is wired into the same calendar your advisor uses:

- Asks year, make, model, and what the car is doing
- Sorts the call into the right service type, because a diagnostic and an oil change are not the same slot length
- Reads back real availability from the live schedule, not a generic "we open at eight"
- Books it, texts the customer a confirmation, and puts the notes on the ticket before your advisor sees it
- Sends the reminder the day before, and again an hour out

By the time your advisor looks at the schedule, the appointment is on it with the complaint written down.

## The honest limits

It will not diagnose the car over the phone, and you do not want it trying. It should not quote a repair, commit to a parts availability date, or negotiate on price. Those need eyes on the vehicle and a person who owns the number.

It also needs to know when to stop. A caller asking about a repair that is already in progress, a comeback, or a warranty dispute should get a human on the line — those calls are about trust, and an automated intake makes them worse, not better.

Draw that line on purpose: new appointments and routine questions go to the agent, anything involving an open ticket goes to a person.

## The math on a Monday morning

Take your last thirty days of call logs and count what went unanswered. Multiply the answerable share by your average repair order.

A shop missing fifty calls a month with a $480 average RO does not need a marketing budget to find another $10,000 in work. It needs the phone answered between 7:30 and 9:30 on a Monday.

## The next step

Pull your call report for last month and sort the missed calls by hour of day. The spike will be obvious, and it will tell you exactly which two hours of coverage are costing you the most.', 'AI Voice Agents, Auto Repair, Booking Automation', 'published', 'David Selva', 3, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time, published_at)
VALUES ('Most Law Firm Intake Calls Are Not Cases. That Is the Problem.', 'ai-voice-intake-law-firm', 'A paralegal who spends her morning on calls the firm will never take is the most expensive filter you own.', 'A small personal injury firm gets forty inbound calls in a week. Maybe six of them are cases the firm would actually sign. The other thirty-four are wrong practice area, outside the statute, no injury, already represented, or somebody who wants free advice about a neighbor''s fence.

Somebody has to sit through all forty to find the six. In most firms that somebody bills at a rate that makes it a genuinely bad use of the hour — and the six real cases wait on hold behind the thirty-four.

## Qualification is a script, not a judgment call

Here is the part firms underrate: the first ninety seconds of an intake call is not legal work. It is a fixed set of questions with a decision tree behind them. When did it happen. Were you injured. Were you treated. Was a report filed. Are you currently represented. What state.

That is a script. Your intake person already runs it from memory, and runs it slightly differently on a Friday afternoon than on a Tuesday morning. An AI voice agent runs the same script the same way at 6 a.m. on a Sunday as it does mid-week, and it never has to put call two on hold to finish call one.

## What it does with the answers

The value is not that a machine asked the questions. It is what happens in the thirty seconds after:

- Qualified callers get booked directly into an attorney consult slot while still on the phone
- Clear non-cases get a polite, accurate close and a referral note, without burning staff time
- Anything ambiguous is flagged and routed to a person with the answers already captured, so nobody starts from scratch
- Every call, signed or not, lands in the system with the intake answers attached and a source attribution

That last one quietly matters. Most firms cannot tell you which marketing spend produced the cases they actually signed, because the data lives in a paralegal''s memory of a phone call.

## The line you do not cross

An AI voice agent does not give legal advice, does not evaluate the merits of a claim, and does not tell anybody whether they have a case. It gathers facts and it schedules. Nothing else.

That is not a limitation to work around — it is the entire design constraint. Set it up so any question that starts with "do you think I can sue" gets a scheduled consult, not an answer. And review the transcripts weekly, because the calls it handled badly are the ones that tell you where the script is wrong.

## What the hour is worth

Take the number of unqualified calls your firm fields in a week and multiply by the six or seven minutes each one really consumes, including the reset before the next call. For most small firms that is several hours a week of paid staff time spent on people who were never going to be clients — and a real case somewhere in there that reached voicemail.

## The next step

Pull last month''s intake calls and mark each one signed, not signed, or never a fit. If more than two thirds land in that third bucket, your intake is not a staffing problem. It is a filtering problem, and filters can be built.', 'AI Voice Agents, Law Firms, Lead Qualification', 'published', 'David Selva', 3, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time, published_at)
VALUES ('The Calls Your AI Voice Agent Should Never Handle Alone', 'ai-voice-handoff-veterinary-clinic', 'Automation that answers a call it should have transferred does more damage than the voicemail it replaced.', 'A veterinary clinic puts an AI voice agent on the main line to stop losing appointment calls during surgery blocks. It works — bookings that used to hit voicemail at 11 a.m. now land on the schedule.

Then a client calls because her fourteen-year-old lab stopped eating three days ago and is not getting up this morning. The agent, doing exactly what it was told, offers her the next available wellness slot on Thursday.

That is not an automation failure. That is a configuration failure, and it is the one worth planning for before you turn anything on.

## The handoff rule comes first

Every conversation about AI on the phone starts in the wrong place. The question is not what the agent can handle. It is what it must never handle alone — and in a clinic that list is short, obvious, and non-negotiable:

- Anything the caller describes as an emergency, in any words
- Bloat, seizures, hit by car, labored breathing, ingested toxin, uncontrolled bleeding
- Euthanasia, quality-of-life conversations, and any call about a pet currently hospitalized
- Medication questions, dosages, and reactions
- A caller who is crying, or who repeats themselves, or who is clearly not getting through

Write that list with your DVMs before anyone configures a single prompt. Then set the rule that when any of it comes up, the call rings a human immediately and the agent says so plainly.

## What is left is still most of the volume

Once you carve the hard list out, what remains is the traffic that has been eating your front desk all along: routine appointment booking, vaccine due dates, boarding availability, hours, whether you carry a diet, refill requests routed to the tech queue, and reminders for the twenty percent of clients who never confirm.

That is the majority of the ring volume in a general practice, and none of it needs a licensed person. Handing it off means the two people at the front desk are available for the calls that actually need them.

## Where automation quietly makes things worse

An automated system that cannot recognize distress is not neutral. It converts a client who needed help into a client who feels dismissed by a machine, and they will tell people that story.

The same applies to overreach. A voice agent that guesses at whether a symptom is urgent has taken on triage, which is a clinical judgment. It should not be estimating urgency. It should be routing on keywords and tone, defaulting to a human whenever it is unsure. An agent that transfers too often is a minor inefficiency. One that transfers too rarely is a liability.

## How to check whether yours is set up right

Read the transcripts. Not a sample of them — all of them, weekly, for the first month. You are looking for one thing: a call the agent handled that a person should have taken. Every one you find is a rule you are missing, and the list stabilizes fast.

## The next step

Before configuring anything, sit down with your lead DVM and write the list of calls that always go to a human. If that list does not exist in writing, the technology decision is premature.', 'AI Voice Agents, Veterinary Clinics, Automation Tradeoffs', 'published', 'David Selva', 3, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, tags, status, author, read_time, published_at)
VALUES ('Your Gym Follow-Up Sounds Like a Robot Wrote It. AI Is Not the Reason.', 'ai-follow-up-messaging-gym', 'Nobody joins a gym because of a well-written text. They quit the funnel because nobody sent one at all.', 'A prospect fills out the free-trial form on a Tuesday night. She gets an email that opens with "Thank you for your interest in our facility!" and closes with "We look forward to welcoming you to our community." She does not reply. Nobody follows up. On Saturday she signs up somewhere else.

The problem is not that the message was written by a template. It is that the message was not written for her, and then nothing else happened.

## Two different failures, usually confused

Gym owners tell me their follow-up does not work, and they mean one of two very different things.

The first is a volume problem: leads come in and nothing goes out, because the person who was supposed to text them was on the floor coaching. The second is a quality problem: something goes out, but it reads like a form letter, so it gets ignored.

AI is genuinely useful for the second one. It does nothing at all for the first — that is an automation problem, and no amount of good copy fixes a message that never sends.

## What AI is actually good for here

Used well, an AI writing assistant is a first-draft machine that removes the blank page. You are not asking it to be clever. You are asking it to give you fifteen versions of a day-three check-in text so you can pick the two that sound like you and throw away the rest.

Where it earns its place in a fitness business:

- Rewriting the same trial follow-up in five tones, so you can find the one that fits a 6 a.m. bootcamp crowd versus a personal training clientele
- Turning one testimonial into a week of social captions without rewriting it from scratch every time
- Drafting the re-engagement message for members who have not badged in for three weeks, which is the message nobody ever gets around to writing
- Writing the first pass at a review response, so replies actually happen within a day

None of that is the strategy. It is the typing.

## The part it will not do for you

It does not know your gym. It has never met the woman who comes in at 5:15 every morning, does not know that your Saturday class is the one that sells memberships, and cannot tell you why your twelve-week challenge converts better than your free trial.

So every draft needs a pass from someone who does. Cut the exclamation points, put in the specific detail — the class name, the coach''s name, the time slot she said she wanted — and send it. The specific detail is the entire difference between a message that gets a reply and one that gets ignored.

And send from a real number that someone actually monitors. A perfectly written text that arrives from an address nobody reads is worse than no text at all, because now she has replied and been ignored twice.

## Sequence beats wording

If you only fix one thing, fix the timing, not the copy. A plain, slightly awkward text that arrives four minutes after the form submission beats a beautifully written email that arrives on Thursday. Then run a real sequence — day one, day three, day seven, day fourteen — instead of one message and silence.

Once that is running, use AI to make each of those four messages sound less like a template. In that order. Reversing it is why most gyms have great copy and an empty pipeline.

## The next step

Pull your last twenty trial signups and check two numbers: how many got a first response within five minutes, and how many got a fourth touch at all. Those two numbers will tell you whether you have a writing problem or a system problem.', 'AI Content Tools, Gyms & Fitness, Lead Follow-Up', 'published', 'David Selva', 3, now())
ON CONFLICT (slug) DO NOTHING;
