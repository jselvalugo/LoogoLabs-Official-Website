// The topic taxonomy behind the LoogoNews hub pages at /loogonews/topic/<slug>.
//
// Post tags are deliberately specific — "Missed Call Text-Back", "Send Timing",
// "Pipeline Hygiene" — which is right for a reader scanning a post and useless as
// site structure: nearly every tag has one post behind it. These topics are the
// curated layer on top. Each one collects a family of tags, carries its own
// written introduction, and is the page that has a chance of ranking for the head
// term an individual post never will.
//
// Rules for editing this file:
//   * `tags` are matched case-insensitively against a post's tags field. A tag
//     may appear in more than one topic; a post shows up under every topic it
//     matches.
//   * Every published post must match at least one topic. `npm run seo:generate`
//     fails the build if one does not, because an unmatched post is an orphan.
//   * `intro` is original writing in the LoogoNews voice (first person, David
//     Selva) — see brand/BLOG-VOICE.md. It is the reason the page is worth
//     indexing rather than a list of links, so a new topic needs real copy, not
//     a sentence stitched out of the tag names.
//   * A topic with fewer than TOPIC_MIN_POSTS posts behind it is rendered
//     noindex, so adding a speculative topic costs nothing but does not create a
//     thin page either.

export const topics = [
  {
    slug: `lead-follow-up`,
    name: `Lead Follow-Up`,
    heading: `Lead follow-up and speed to lead`,
    title: `Lead Follow-Up & Speed to Lead | LoogoNews`,
    description:
      'How local service businesses answer new leads faster: missed-call text-back, after-hours coverage, and follow-up that runs without anyone remembering it.',
    intro: [
      `Almost every lead problem I get called about is a timing problem wearing a costume. The shop is not short on calls or form fills. It is short on answers inside the window where the customer is still deciding, which on a hot Tuesday afternoon is about four minutes wide.`,
      `These posts are the follow-up work I set up first, roughly in the order I set it up: catch the calls nobody answered, get a real reply out in seconds instead of hours, then keep replying for as long as the buying decision actually takes. Pick the one closest to your trade and start there.`,
    ],
    tags: [
      'Lead Follow-Up', 'Speed to Lead', 'Missed Call Text-Back', 'After-Hours Calls',
      'Paid Lead ROI', 'Lead Capture', 'Lead Qualification', 'Lead Assignment',
      'Follow-Up Sequences', 'Long-Cycle Nurture', 'Send Timing', 'Website Conversion',
    ],
  },
  {
    slug: `ai-voice-agents`,
    name: `AI Voice Agents`,
    heading: `AI voice agents on a real phone line`,
    title: `AI Voice Agents for Local Businesses | LoogoNews`,
    description:
      'Where an AI voice agent earns its place on the phone — after-hours intake, booking, qualifying — and the calls it should hand straight to a person.',
    intro: [
      `A voice agent is the automation owners ask me about first and trust the least, usually for good reason: they have all heard a robot mangle a customer call, and they know whose name is on the truck when it happens.`,
      `So the question I care about is narrower than the pitch. Which calls can an agent finish on its own, which ones does it need to hand to a human mid-sentence, and what does it do at eleven at night when the honest alternative is voicemail? These posts work that line out trade by trade, including the one where I argue for handing the call over sooner.`,
    ],
    tags: ['AI Voice Agents', 'Automation Tradeoffs', 'AI Content Tools'],
  },
  {
    slug: `reputation-and-referrals`,
    name: `Reputation & Referrals`,
    heading: `Reviews, reputation and word of mouth`,
    title: `Reviews, Reputation & Referrals | LoogoNews`,
    description:
      'Getting reviews on purpose instead of by luck, answering the bad ones in a way the next reader believes, and building referral partners that send work.',
    intro: [
      `Reputation is the one asset in a service business that compounds and that nobody owns outright. You cannot buy it back once it slips, and the version of it that exists in public is written almost entirely by whoever felt strongly enough to post.`,
      `Two things move it. Asking every satisfied customer at the moment they are most satisfied, without a person having to remember to ask. And answering the review you wish you had never received, in a way that reassures the next reader rather than the one who left it. The referral posts are the same instinct pointed at the businesses next door to yours.`,
    ],
    tags: ['Reputation Management', 'Google Reviews', 'Referral Systems', 'Partnerships'],
  },
  {
    slug: `booking-and-scheduling`,
    name: `Booking & Scheduling`,
    heading: `Booking, scheduling and no-shows`,
    title: `Booking, Scheduling & No-Shows | LoogoNews`,
    description:
      'Taking bookings without a phone call, cutting no-shows with reminders people actually read, and reading the calendar before you add capacity.',
    intro: [
      `Every booking setup is a trade between control and friction. Owners default to control — call us and we will find you a time — then pay for it in the customers who never got around to calling.`,
      `These posts are about the other side of that trade: taking a booking while the shop is slammed or shut, reminding people in a way that measurably empties fewer chairs, and reading what the calendar already knows before hiring for demand nobody has measured yet.`,
    ],
    tags: [
      'Booking & Scheduling', 'Online Booking', 'Booking Automation',
      'No-Show Reduction', 'Booking Analytics', 'Capacity Planning',
    ],
  },
  {
    slug: `email-and-sms`,
    name: `Email & SMS`,
    heading: `Email and SMS that gets read`,
    title: `Email & SMS Marketing That Gets Read | LoogoNews`,
    description:
      'Segmenting the customer list you already own, testing what to say, and sending at an hour that does not cost you the unsubscribe.',
    intro: [
      `The list you already own is the cheapest marketing asset in the business and the one most owners touch twice a year, usually in December, usually with the same message they sent last December.`,
      `None of this is about sending more. It is about sending to the right slice of the list, saying the thing that gets a reply, and picking an hour that does not wake somebody up. Taste is a bad guide here and the tests are simple enough to run yourself, which is most of why they are worth running.`,
    ],
    tags: [
      'Email & SMS Marketing', 'Segmentation', 'Message Testing',
      'Send Timing', 'Social Media', 'Seasonal Marketing',
    ],
  },
  {
    slug: `workflow-automation`,
    name: `Workflow Automation`,
    heading: `Automating the work between the yes and the invoice`,
    title: `Workflow Automation for Service Businesses | LoogoNews`,
    description:
      'The internal work worth automating first — onboarding, field paperwork, invoice chase-ups — and how to get a crew to actually use the system.',
    intro: [
      `The automation that pays for itself is almost never the impressive one. It is the third reminder somebody retypes every Tuesday, or the invoice nobody chased because chasing invoices is not technically anybody's job.`,
      `These posts sit in that layer: the repeated internal steps between a customer saying yes and the money arriving. Building it is rarely the hard part. Getting the people in the truck to work the way the system expects is, which is why adoption gets a post of its own.`,
    ],
    tags: [
      'Workflow Automation', 'Automation', 'Client Onboarding', 'Team Adoption',
      'Field Operations', 'Operations', 'Payments & Invoicing', 'Cash Flow',
    ],
  },
  {
    slug: `crm-and-customer-records`,
    name: `CRM & Customer Records`,
    heading: `One honest record per customer`,
    title: `CRM, Pipelines & Customer Records | LoogoNews`,
    description:
      'Pipeline stages that mean something, one inbox for every message a customer sends, and contact data clean enough to segment.',
    intro: [
      `Ask an owner where a customer's history lives and you get a list: one person's phone, a shared inbox, a notebook in a truck, and a CRM somebody stopped updating in March.`,
      `A record you cannot trust costs you twice — once when the customer repeats their whole story to the third person who calls them, and again when you try to market to a list nobody has cleaned in two years. These posts are about pipelines that reflect real deals, one thread per customer, and the handful of fields that are worth the discipline of filling in.`,
    ],
    tags: [
      'CRM & Pipelines', 'Pipeline Hygiene', 'Unified Inbox', 'Customer Records',
      'Data Quality', 'Custom Fields', 'Lead Assignment',
    ],
  },
  {
    slug: `reporting-and-roi`,
    name: `Reporting & ROI`,
    heading: `Reporting that answers what the marketing bought`,
    title: `Marketing Reporting & ROI | LoogoNews`,
    description:
      'Tracing a job back to the channel that produced it, reading numbers across locations, and reporting on revenue instead of impressions.',
    intro: [
      `Most owners can tell me what they spend on marketing and almost none can tell me what it bought. Not through carelessness — because the report they are handed talks about reach and the bank account talks about jobs, and nobody has ever made those two columns meet.`,
      `The fix is not a better-looking dashboard. It is tracking a lead from the first click through to the invoice so the question stops being arguable, then reading it the same way every month. Running more than one location adds exactly one wrinkle, which gets its own post.`,
    ],
    tags: [
      'Reporting & Dashboards', 'Marketing ROI', 'Sales Reporting',
      'Multi-Location', 'Booking Analytics', 'Paid Lead ROI',
    ],
  },
  {
    slug: `retention-and-repeat-business`,
    name: `Retention & Repeat Business`,
    heading: `Winning the second visit`,
    title: `Customer Retention & Repeat Business | LoogoNews`,
    description:
      'Memberships that do not quietly lapse, re-engagement for customers who drifted, and staying useful to someone after the job is finished.',
    intro: [
      `Winning a customer costs money. Keeping one costs attention, which is the first thing to go in a busy month and the reason churn always arrives as a surprise.`,
      `These posts are about the quiet middle of the relationship: the membership that lapsed because a card expired and nobody noticed, the regular who has not been back since spring, the patient who stops doing the exercises the afternoon they are discharged. All of it is fixable by a system that remembers on your behalf.`,
    ],
    tags: [
      'Customer Retention', 'Retention', 'Membership Management',
      'Patient Retention', 'Courses & Content',
    ],
  },
];
