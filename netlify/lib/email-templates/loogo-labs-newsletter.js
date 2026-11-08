// The Loogo Labs Letter — Loogo Labs LLC's newsletter. One branded layout;
// each issue is an entry in ISSUES below and shows up in the CRM dropdown as
// its own template. To write a new issue, add an entry at the top of ISSUES
// (keep old ones so sent blasts still render) — content stays in code.
//
// Look follows the November 2026 site system (brand/DESIGN-SYSTEM-2026.md):
// ink #1B2A12 on page #F3F0E7 / card #FBF9F3, secondary #5A6A4E, muted
// #78866B, sunken #E9E5D9, one amber accent #B8691C, Instrument Sans at
// 400/500, sentence-case section names, small radii, hairlines, no gradients.

const SITE = 'https://www.loogolabs.com';
const LOGO = `${SITE}/email-logo.png`; // "Loogo Labs · AI, Marketing & Automation", 1040px wide
const BOOKING = 'https://calendar.app.google/5hRpcMfH2xUPNmvv9';

const INK = '#1B2A12';
const SECONDARY = '#5A6A4E';
const MUTED = '#78866B';
const PAGE = '#F3F0E7';
const CARD = '#FBF9F3';
const SUNKEN = '#E9E5D9';
const AMBER = '#8A6A3F'; // --amber-500 on the site
const LINE = '#DCD8CC'; // hairline, solid so Outlook draws it

const SANS = "'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

// ── Issues (newest first) ───────────────────────────────────────────────────
// Each section: { label, title, body?: [paragraphs], rows?: [[left, right]],
// cta?: { label, href } }. Text is plain; {first} becomes the reader's first
// name. An href may be a function of the reader's token (for landing pages
// that recognise them).
const gamePlanLink = (campaign) => (token) => `${SITE}/game-plan?${new URLSearchParams({
  ...(token ? { s: token } : {}), utm_source: 'loogo_labs_letter', utm_medium: 'email', utm_campaign: campaign,
})}`;

const ISSUES = [
  {
    id: 'loogo-labs-letter-2026-11',
    issue: 'November 2026',
    subject: "{{first_name|Friend}}, your marketing doesn't need more posts. It needs a plan.",
    preheader: 'Your free 90-day marketing game plan, a holiday marketing calendar with one move for each day, and one thing to try this week.',
    intro: {
      hook: "Most small businesses don't have a marketing problem. They have a plan problem.",
      body: [
        'Hey {first}, it’s David from Loogo Labs.',
        'Posting more, boosting more and trying the next tool rarely fixes it. What fixes it is knowing who you’re talking to, what you’re offering them, and the one or two channels worth your time. So this month’s Letter is all plan: a free 90-day game plan, a holiday calendar you can use this month, and one habit to start this week.',
      ],
    },
    feature: {
      label: 'Free this month',
      title: 'Your 90-day Marketing Game Plan',
      body: [
        'We put the framework we use with clients on one page: five questions to answer before you start, three 30-day phases with the exact steps, and the one-hour weekly rhythm that keeps it going. Read it, print it, use it.',
        'Want it built around your business? Tell us about it on the same page and we’ll tailor the plan with you on a free strategy call. We already have your email, so it takes 30 seconds.',
      ],
      cta: { label: 'Open my free game plan', href: gamePlanLink('letter-2026-11') },
    },
    sections: [
      {
        label: 'The plan in 60 seconds',
        title: 'Three phases, thirty days each',
        rows: [
          ['Days 1–30 · Foundation', 'Write your offer in one sentence, fix where people find you, and track where every lead comes from.'],
          ['Days 31–60 · Build', 'Give people something to say yes to, publish every week, and answer every lead the same day.'],
          ['Days 61–90 · Grow', 'Keep what brought paying customers, cut what didn’t, and test a small ad budget on your best message.'],
        ],
        cta: { label: 'See every step', href: gamePlanLink('letter-2026-11') },
      },
      {
        label: 'Your holiday marketing calendar',
        title: 'Five days that matter this season, one move for each',
        rows: [
          ['Thu, Nov 26 · Thanksgiving', 'Send customers a short thank-you with no offer. It earns the open for your next email.'],
          ['Fri, Nov 27 · Black Friday', 'If you run a deal, keep it to one offer, one deadline and one link.'],
          ['Sat, Nov 28 · Small Business Saturday', 'Remind local followers you’re independent and nearby. A photo of your team or space beats a graphic.'],
          ['Mon, Nov 30 · Cyber Monday', 'Last call for online offers. Resend to people who opened but didn’t buy.'],
          ['Tue, Dec 1 · Giving Tuesday', 'Share a cause you genuinely support, or give part of a day’s sales to a local charity.'],
        ],
      },
      {
        label: 'Try this week',
        title: 'One offer, one audience, one channel',
        body: [
          'For the next 30 days, pick the offer that pays your bills, the customer who buys it most, and the one channel where that customer already spends time. Put your effort there and ignore the rest. It feels like doing less. It usually works better than doing everything a little.',
        ],
      },
      {
        label: 'New on loogolabs.com',
        title: 'Teach Claude your business once',
        body: [
          'Brand Brain is our free AI skill. It interviews you about your offer, customer and voice, then saves a brand profile so what Claude writes for you sounds like you. More skills for content calendars, hooks and ad copy are on the way.',
        ],
        cta: { label: 'Get Brand Brain free', href: `${SITE}/marketplace` },
      },
      {
        label: 'Behind the scenes',
        title: 'Loogo Labs is now Loogo Labs LLC',
        body: ['We made it official in October: Loogo Labs is now a Florida LLC, based in Orlando. Same team, same promise, more room to grow with you.'],
      },
    ],
    signoff: 'Talk soon,',
    ps: 'Hit reply and tell me your biggest marketing question. I read every one, and the best ones shape next month’s Letter.',
  },
];

// ── Layout ──────────────────────────────────────────────────────────────────

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;"><tr>
    <td bgcolor="${INK}" style="background:${INK};border-radius:6px;">
      <a href="${href}" style="display:inline-block;padding:14px 26px;font:500 15px/1 ${SANS};color:${CARD};text-decoration:none;border-radius:6px;">${label} &rarr;</a>
    </td></tr></table>`;
}

function render(issue, { firstName, preheader, unsubscribeUrl, postalAddress, subscriberToken, esc }) {
  const href = (h) => esc(typeof h === 'function' ? h(subscriberToken) : h);
  const first = firstName || 'there';
  const fill = (s) => esc(s).replace(/\{first\}/g, esc(first));
  const paras = (list, color = SECONDARY) => list.map((p) => `<p style="margin:12px 0 0;font:400 16px/1.65 ${SANS};color:${color};">${fill(p)}</p>`).join('');
  const label = (s, color = MUTED) => `<div style="font:500 13px/1.4 ${SANS};color:${color};">${esc(s)}</div>`;

  const rows = (list) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0;">
            ${list.map(([k, v]) => `<tr><td style="padding:12px 0;border-top:1px solid ${LINE};">
              <div style="font:500 15px/1.4 ${SANS};color:${INK};">${esc(k)}</div>
              <div style="margin:3px 0 0;font:400 15px/1.55 ${SANS};color:${SECONDARY};">${fill(v)}</div>
            </td></tr>`).join('')}
          </table>`;
  const section = (s) => `
        <tr><td class="px" style="padding:30px 40px 0;">
          <div style="border-top:1px solid ${LINE};padding-top:28px;">
            ${label(s.label)}
            <h2 style="margin:6px 0 0;font:500 22px/1.3 ${SANS};color:${INK};">${esc(s.title)}</h2>
            ${s.body ? paras(s.body) : ''}
            ${s.rows ? rows(s.rows) : ''}
            ${s.cta ? `<p style="margin:14px 0 0;font:500 15px/1.5 ${SANS};"><a href="${href(s.cta.href)}" style="color:${INK};text-decoration:underline;text-underline-offset:3px;">${esc(s.cta.label)} &rarr;</a></p>` : ''}
          </div>
        </td></tr>`;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>The Loogo Labs Letter · ${esc(issue.issue)}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&amp;display=swap" rel="stylesheet">
<style>@media (max-width:620px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:28px!important} }</style>
</head>
<body style="margin:0;padding:0;background:${PAGE};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAGE}" style="background:${PAGE};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="max-width:600px;background:${CARD};border:1px solid ${LINE};border-radius:12px;">

        <!-- Masthead -->
        <tr><td class="px" style="padding:28px 40px 22px;border-bottom:1px solid ${LINE};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="middle"><a href="${SITE}" style="text-decoration:none;"><img src="${LOGO}" width="200" height="51" alt="Loogo Labs · AI, Marketing &amp; Automation" style="display:block;width:200px;height:auto;border:0;"></a></td>
            <td valign="middle" align="right" style="font:400 13px/1.4 ${SANS};color:${MUTED};">The Loogo Labs Letter<br>${esc(issue.issue)}</td>
          </tr></table>
        </td></tr>

        <!-- Hook -->
        <tr><td class="px" style="padding:34px 40px 0;">
          <h1 class="h1" style="margin:0;font:500 32px/1.2 ${SANS};color:${INK};letter-spacing:-0.01em;">${fill(issue.intro.hook)}</h1>
          ${paras(issue.intro.body)}
        </td></tr>

        <!-- Feature -->
        <tr><td class="px" style="padding:28px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SUNKEN}" style="background:${SUNKEN};border-radius:10px;border-left:3px solid ${AMBER};">
            <tr><td style="padding:26px 26px 28px;">
              ${label(issue.feature.label, AMBER)}
              <h2 style="margin:6px 0 0;font:500 24px/1.25 ${SANS};color:${INK};">${esc(issue.feature.title)}</h2>
              ${paras(issue.feature.body, INK)}
              ${button(href(issue.feature.cta.href), esc(issue.feature.cta.label))}
            </td></tr>
          </table>
        </td></tr>

        ${issue.sections.map(section).join('')}

        <!-- Sign-off -->
        <tr><td class="px" style="padding:34px 40px 36px;">
          <div style="border-top:1px solid ${LINE};padding-top:26px;">
            <p style="margin:0;font:400 16px/1.6 ${SANS};color:${SECONDARY};">${esc(issue.signoff)}</p>
            <p style="margin:8px 0 0;font:500 18px/1.3 ${SANS};color:${INK};">David Selva</p>
            <p style="margin:2px 0 0;font:400 14px/1.5 ${SANS};color:${MUTED};">Founder, Loogo Labs LLC</p>
            <p style="margin:12px 0 0;font:400 14px/1.7 ${SANS};">
              <a href="mailto:david@loogolabs.com" style="color:${INK};">david@loogolabs.com</a> &nbsp;·&nbsp;
              <a href="${SITE}" style="color:${INK};">loogolabs.com</a> &nbsp;·&nbsp;
              <a href="${BOOKING}" style="color:${INK};">Book a call</a>
            </p>
            ${issue.ps ? `<p style="margin:20px 0 0;font:400 15px/1.6 ${SANS};color:${SECONDARY};"><span style="color:${INK};font-weight:500;">P.S.</span> ${fill(issue.ps)}</p>` : ''}
          </div>
        </td></tr>
      </table>

      <!-- Footer -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr><td align="center" style="padding:22px 20px 6px;">
          <p style="margin:0;font:400 12px/1.6 ${SANS};color:${MUTED};">
            <a href="https://www.instagram.com/loogolabs.fl" style="color:${MUTED};">Instagram</a> &nbsp;·&nbsp;
            <a href="https://www.facebook.com/loogolabs" style="color:${MUTED};">Facebook</a> &nbsp;·&nbsp;
            <a href="https://www.linkedin.com/company/loogolabs/" style="color:${MUTED};">LinkedIn</a>
          </p>
          <p style="margin:10px 0 0;font:400 12px/1.6 ${SANS};color:${MUTED};">You're receiving this because you signed up for updates from Loogo Labs or worked with us.<br>${esc(postalAddress)}</p>
          <p style="margin:10px 0 0;font:400 12px/1.6 ${SANS};"><a href="${esc(unsubscribeUrl)}" style="color:${SECONDARY};text-decoration:underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const link = (h) => (typeof h === 'function' ? h(subscriberToken) : h);
  const plainSection = (s) => [`${s.label.toUpperCase()}: ${s.title}`,
    ...(s.body || []).map((p) => p.replace(/\{first\}/g, first)),
    ...(s.rows || []).map(([k, v]) => `- ${k}: ${v}`),
    s.cta ? `${s.cta.label}: ${link(s.cta.href)}` : null].filter(Boolean).join('\n\n');
  const text = [
    `THE LOOGO LABS LETTER · ${issue.issue}`,
    issue.intro.hook,
    ...issue.intro.body.map((p) => p.replace(/\{first\}/g, first)),
    plainSection(issue.feature),
    ...issue.sections.map(plainSection),
    `${issue.signoff}\nDavid Selva\nFounder, Loogo Labs LLC\ndavid@loogolabs.com · ${SITE} · Book a call: ${BOOKING}`,
    issue.ps ? `P.S. ${issue.ps}` : null,
    '—',
    "You're receiving this because you signed up for updates from Loogo Labs or worked with us.",
    postalAddress,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].filter(Boolean).join('\n\n');

  return { html, text };
}

export default ISSUES.map((issue) => ({
  id: issue.id,
  name: `The Loogo Labs Letter · ${issue.issue}`,
  description: 'Loogo Labs newsletter: free 90-day Marketing Game Plan (loogolabs.com/game-plan), holiday marketing calendar, a tip to try, Brand Brain and company news.',
  // Shown wherever the Cards & Cocktails template is (Loogo Labs' own workspace).
  instances: [],
  sameWorkspacesAs: ['cards-and-cocktails-2026'],
  from_name: 'David at Loogo Labs',
  reply_to: 'david@loogolabs.com',
  postal_address: 'Loogo Labs LLC, 2875 S Orange Ave STE 500 #6412, Orlando, FL 32806-5471',
  subject: issue.subject,
  preheader: issue.preheader,
  render: (ctx) => render(issue, ctx),
}));
