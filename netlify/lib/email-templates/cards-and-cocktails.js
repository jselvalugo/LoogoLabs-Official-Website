// Cards & Cocktails — Pokémon trading card event at Lugo's Craft Distillery,
// Saturday, November 14, 2026. Sent to people who already registered: a
// "you're on the list, see you Saturday" reminder, not an invitation. Branded to match cards-and-cocktails.netlify.app:
// ink #0F0D0A / #1C1A16 / #2A2720, gold #C9952A / #E3B554 / #F5E6C8,
// cream #F0EBE0, muted #8A8070 / #B5A99A, mint CTA gradient #6EE7B7 → #34D399,
// Playfair Display headings and Inter body (Georgia / Helvetica fallbacks).

const SITE = 'https://cards-and-cocktails.netlify.app';
// Copy of the event site's logo, hosted on loogolabs.com so the email never
// depends on the event site staying up (public/email/, 280px for retina).
const LOGO = 'https://www.loogolabs.com/email/cards-and-cocktails-logo.png';
// Loogo Labs (AI, Marketing & Automation) in white for the dark header, 2x.
const LOOGO_LOGO = 'https://www.loogolabs.com/email/loogo-labs-logo-white.png';
const REGISTER = `${SITE}/#register`;
// 2:00–10:00 PM Eastern (EST, UTC−5) on Nov 14, 2026.
const CALENDAR = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=' + encodeURIComponent('Cards & Cocktails · Pokémon Trading Card Event')
  + '&dates=20261114T190000Z/20261115T030000Z'
  + '&details=' + encodeURIComponent(`Buy, sell and trade Pokémon cards at Lugo's Craft Distillery. Free to attend; 21+ for bar service. ${SITE}`)
  + '&location=' + encodeURIComponent("Lugo's Craft Distillery, 2500 Drane Field Rd, Lakeland, FL 33811");
const VENDORS = `${SITE}/#vendors`;
const VIP = 'https://www.eventbrite.com/e/cards-and-cocktails-tcg-event-at-lugos-craft-distillery-tickets-1998693881202';
const MAP = 'https://maps.google.com/?q=Lugo%27s+Craft+Distillery+2500+Drane+Field+Rd+Lakeland+FL+33811';

const INK = '#0F0D0A';
const INK_LIGHT = '#1C1A16';
const INK_MID = '#2A2720';
const GOLD = '#C9952A';
const GOLD_LIGHT = '#E3B554';
const GOLD_PALE = '#F5E6C8';
const CREAM = '#F0EBE0';
const MUTED = '#8A8070';
const MUTED_LIGHT = '#B5A99A';
const MINT = '#34D399';
const BORDER = '#3A3122'; // gold at ~22% on ink, solid so Outlook draws it

const SERIF = "'Playfair Display',Georgia,'Times New Roman',serif";
const SANS = "Inter,'Helvetica Neue',Helvetica,Arial,sans-serif";

const GAMES = ['Pokémon TCG', 'Disney Lorcana', 'Topps Chrome', 'One Piece Card Game'];
const DETAILS = [
  ['Date', 'Saturday, November 14, 2026'],
  ['Hours', '2:00 – 10:00 PM · doors open at 2 PM'],
  ['Where', `Lugo's Craft Distillery<br><a href="${MAP}" style="color:${GOLD_LIGHT};text-decoration:none;">2500 Drane Field Rd, Lakeland, FL 33811 ↗</a>`],
  ['Admission', 'Free to attend · 21+ for bar service'],
];
const SCHEDULE = [
  ['1:00 PM', 'VIP early access begins'],
  ['2:00 PM', 'Doors open to the public'],
  ['~6:00 PM', 'Peak hour: raffle, giveaways and specials'],
  ['10:00 PM', 'Last call and close'],
];

// Bulletproof button: solid colour for Outlook, gradient where it is supported.
const button = (href, label, { primary = true } = {}) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr><td align="center" bgcolor="${primary ? MINT : INK}" style="border-radius:999px;${primary ? `background:${MINT};background-image:linear-gradient(135deg,#6EE7B7 0%,${MINT} 100%);` : `border:1px solid ${GOLD};`}">
      <a href="${href}" style="display:inline-block;padding:16px 34px;font:800 14px/1 ${SANS};letter-spacing:.08em;text-transform:uppercase;color:${primary ? INK : GOLD_LIGHT};text-decoration:none;border-radius:999px;">${label}</a>
    </td></tr>
  </table>`;

const kicker = (s) => `<div style="font:700 11px/1.4 ${SANS};letter-spacing:.24em;text-transform:uppercase;color:${GOLD};">${s}</div>`;
const anchor = `<div style="font:20px/1 ${SERIF};color:${GOLD};padding:14px 0;">⚓</div>`;

export default {
  id: 'cards-and-cocktails-2026',
  name: 'Cards & Cocktails · Nov 14, 2026 · registered guests',
  description: "For people who already registered: you're on the list, event details, add to calendar, directions, VIP upgrade and bring-a-friend.",
  // Loogo Labs' own instance has this template because it already sent it
  // (see index.js). Add slugs here to give it to other instances.
  instances: [],
  from_name: 'Cards & Cocktails',
  // The sender's physical address for the CAN-SPAM footer (else EMAIL_POSTAL_ADDRESS).
  postal_address: "Lugo's Craft Distillery, 2500 Drane Field Rd, Lakeland, FL 33811",
  subject: "{{first_name|Trainer}}, you're on the list: see you Saturday at Cards & Cocktails",
  preheader: "Saturday, Nov 14 · doors at 2 PM · Lugo's Craft Distillery, Lakeland. Here's everything you need for the day.",

  render({ firstName, preheader, unsubscribeUrl, postalAddress, esc }) {
    const hi = esc(firstName || 'Trainer');
    const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light">
<title>Cards &amp; Cocktails · November 14, 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&amp;family=Inter:wght@400;600;800&amp;display=swap" rel="stylesheet">
<style>
  @media (max-width:620px){ .px{padding-left:22px!important;padding-right:22px!important} .h1{font-size:40px!important} .col{display:block!important;width:100%!important} }
</style>
</head>
<body style="margin:0;padding:0;background:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK}" style="background:${INK};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

        <!-- Hero -->
        <tr><td align="left" bgcolor="${INK_LIGHT}" style="background:${INK_LIGHT};border:1px solid ${BORDER};border-bottom:0;border-radius:18px 18px 0 0;padding:20px 24px 0;">
          <a href="https://www.loogolabs.com" style="text-decoration:none;"><img src="${LOOGO_LOGO}" width="170" height="37" alt="Loogo Labs · AI, Marketing &amp; Automation" style="display:block;width:170px;height:auto;border:0;"></a>
        </td></tr>
        <tr><td align="center" bgcolor="${INK_LIGHT}" class="px" style="background:${INK_LIGHT};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:14px 40px 30px;">
          <img src="${LOGO}" width="140" height="137" alt="Lugo's Craft Distillery" style="display:block;margin:0 auto 20px;width:140px;height:auto;border:0;">
          ${kicker("Lugo's Craft Distillery presents")}
          <h1 class="h1" style="margin:14px 0 0;font:700 50px/1.05 ${SERIF};color:${GOLD_LIGHT};">Cards &amp; Cocktails</h1>
          <div style="margin:12px 0 0;font:600 12px/1.4 ${SANS};letter-spacing:.3em;text-transform:uppercase;color:${CREAM};">Pokémon Trading Card Event</div>
          ${anchor}
          <div style="font:600 17px/1.5 ${SERIF};color:${CREAM};">Saturday, November 14, 2026</div>
          <div style="margin:4px 0 0;font:600 12px/1.6 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${MUTED_LIGHT};">2:00 – 10:00 PM &nbsp;·&nbsp; Lakeland, FL</div>
        </td></tr>

        <!-- Hook + main CTA -->
        <tr><td bgcolor="${INK}" class="px" style="background:${INK};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:34px 40px 8px;">
          <div style="display:inline-block;padding:7px 14px;border:1px solid ${MINT};border-radius:999px;font:800 11px/1 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${MINT};">✓ You're registered</div>
          <p style="margin:16px 0 0;font:600 22px/1.35 ${SERIF};color:${CREAM};">Hey ${hi}, you're on the list. Saturday, the binders come out.</p>
          <p style="margin:14px 0 0;font:16px/1.65 ${SANS};color:${MUTED_LIGHT};">Thanks for registering for Cards &amp; Cocktails. This Saturday, <span style="color:${CREAM};">Lugo's Craft Distillery</span> turns into a trading card market: vendor tables, a room full of collectors, and craft cocktails at the bar.</p>
          <p style="margin:14px 0 0;font:16px/1.65 ${SANS};color:${MUTED_LIGHT};">Doors open at <strong style="color:${CREAM};">2:00 PM</strong>. Admission is free and there's nothing to print. Just show up with your cards. Planning to order at the bar? Bring a valid ID, since bar service is 21+.</p>
        </td></tr>
        <tr><td bgcolor="${INK}" align="center" style="background:${INK};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:26px 24px 34px;">
          ${button(CALENDAR, 'Add to my calendar')}
          <div style="margin-top:12px;">${button(MAP, 'Get directions', { primary: false })}</div>
        </td></tr>

        <!-- Details -->
        <tr><td bgcolor="${INK_LIGHT}" class="px" style="background:${INK_LIGHT};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:30px 40px;">
          ${kicker('Event details')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
            ${DETAILS.map(([k, v]) => `<tr>
              <td style="padding:12px 0;border-top:1px solid ${BORDER};width:110px;vertical-align:top;font:700 11px/1.6 ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${MUTED};">${k}</td>
              <td style="padding:12px 0;border-top:1px solid ${BORDER};font:15px/1.55 ${SANS};color:${CREAM};">${v}</td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- Games -->
        <tr><td bgcolor="${INK}" align="center" class="px" style="background:${INK};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:30px 40px 26px;">
          ${kicker("What's at the tables")}
          <div style="margin-top:14px;">
            ${GAMES.map((g) => `<span style="display:inline-block;margin:4px 3px;padding:8px 14px;border:1px solid ${BORDER};border-radius:999px;font:600 13px/1 ${SANS};color:${GOLD_PALE};">${g}</span>`).join('')}
          </div>
        </td></tr>

        <!-- VIP + Vendor -->
        <tr><td bgcolor="${INK}" class="px" style="background:${INK};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:4px 28px 30px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td class="col" width="50%" valign="top" style="padding:6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK_MID}" style="background:${INK_MID};border:1px solid ${GOLD};border-radius:14px;">
                <tr><td style="padding:22px 20px;">
                  ${kicker('Upgrade to VIP · $25')}
                  <div style="margin:8px 0 0;font:700 20px/1.25 ${SERIF};color:${CREAM};">Get in an hour early</div>
                  <p style="margin:10px 0 16px;font:14px/1.6 ${SANS};color:${MUTED_LIGHT};">One full hour of early entry from 1 PM, a cocktail from the PokeMenu, and first pick of every vendor table. Limited spots.</p>
                  <a href="${VIP}" style="font:800 12px/1 ${SANS};letter-spacing:.1em;text-transform:uppercase;color:${MINT};text-decoration:none;">Reserve my VIP spot →</a>
                </td></tr>
              </table>
            </td>
            <td class="col" width="50%" valign="top" style="padding:6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK_MID}" style="background:${INK_MID};border:1px solid ${BORDER};border-radius:14px;">
                <tr><td style="padding:22px 20px;">
                  ${kicker('Want to sell? · $80')}
                  <div style="margin:8px 0 0;font:700 20px/1.25 ${SERIF};color:${CREAM};">Grab a vendor table</div>
                  <p style="margin:10px 0 16px;font:14px/1.6 ${SANS};color:${MUTED_LIGHT};">All in: your table and two cocktail tickets. Arrive 12–1 PM; load-in closes at 1:00 PM sharp.</p>
                  <a href="${VENDORS}" style="font:800 12px/1 ${SANS};letter-spacing:.1em;text-transform:uppercase;color:${GOLD_LIGHT};text-decoration:none;">Reserve a table →</a>
                </td></tr>
              </table>
            </td>
          </tr></table>
        </td></tr>

        <!-- Schedule -->
        <tr><td bgcolor="${INK_LIGHT}" class="px" style="background:${INK_LIGHT};border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};padding:30px 40px;">
          ${kicker('Day-of schedule')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
            ${SCHEDULE.map(([t, what]) => `<tr>
              <td style="padding:10px 0;border-top:1px solid ${BORDER};width:110px;font:700 18px/1.3 ${SERIF};color:${GOLD_LIGHT};">${t}</td>
              <td style="padding:10px 0;border-top:1px solid ${BORDER};font:15px/1.5 ${SANS};color:${CREAM};">${what}</td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- Closing CTA -->
        <tr><td bgcolor="${INK}" align="center" class="px" style="background:${INK};border:1px solid ${BORDER};border-top:0;border-radius:0 0 18px 18px;padding:34px 40px 36px;">
          <div style="font:italic 600 24px/1.3 ${SERIF};color:${CREAM};">See you at the tables, ${hi}.</div>
          <p style="margin:10px 0 24px;font:15px/1.6 ${SANS};color:${MUTED_LIGHT};">Know a collector who'd love this? Admission is free. Send them the link so they can register too.</p>
          ${button(REGISTER, 'Share the event', { primary: false })}
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:26px 20px 8px;">
          <p style="margin:0;font:600 11px/1.6 ${SANS};letter-spacing:.2em;text-transform:uppercase;color:${MUTED};">An event organized by Lugo's Craft Distillery</p>
          <p style="margin:10px 0 0;font:12px/1.6 ${SANS};color:${MUTED};">You're receiving this because you registered for Cards &amp; Cocktails at Lugo's Craft Distillery.${postalAddress ? `<br>${esc(postalAddress)}` : ''}</p>
          <p style="margin:12px 0 0;font:12px/1.6 ${SANS};"><a href="${esc(unsubscribeUrl)}" style="color:${MUTED_LIGHT};text-decoration:underline;">Unsubscribe</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;

    const text = [
      "LUGO'S CRAFT DISTILLERY PRESENTS",
      'CARDS & COCKTAILS: Pokémon Trading Card Event',
      'Saturday, November 14, 2026 · 2:00–10:00 PM · Lakeland, FL',
      '',
      "✓ YOU'RE REGISTERED",
      '',
      `Hey ${firstName || 'Trainer'}, you're on the list. Saturday, the binders come out.`,
      '',
      "Thanks for registering for Cards & Cocktails. This Saturday, Lugo's Craft Distillery turns into a trading card market: vendor tables, a room full of collectors, and craft cocktails at the bar.",
      '',
      "Doors open at 2:00 PM. Admission is free and there's nothing to print. Just show up with your cards. Planning to order at the bar? Bring a valid ID, since bar service is 21+.",
      '',
      `Add to your calendar: ${CALENDAR}`,
      `Get directions: ${MAP}`,
      '',
      'EVENT DETAILS',
      'Date: Saturday, November 14, 2026',
      'Hours: 2:00–10:00 PM (doors open at 2 PM)',
      `Where: Lugo's Craft Distillery, 2500 Drane Field Rd, Lakeland, FL 33811 (${MAP})`,
      'Admission: Free to attend · 21+ for bar service',
      '',
      `AT THE TABLES: ${GAMES.join(' · ')}`,
      '',
      `UPGRADE TO VIP ($25): one hour early entry from 1 PM, a PokeMenu cocktail, first pick of vendor tables. ${VIP}`,
      `WANT TO SELL? VENDOR TABLE ($80 all in): your table and two cocktail tickets. Arrive 12–1 PM; load-in closes at 1:00 PM. ${VENDORS}`,
      '',
      'SCHEDULE',
      ...SCHEDULE.map(([t, what]) => `${t}  ${what}`),
      '',
      'See you at the tables.',
      '',
      `Know a collector who'd love this? Admission is free. Send them the link so they can register: ${REGISTER}`,
      '',
      '—',
      "An event organized by Lugo's Craft Distillery.",
      "You're receiving this because you registered for Cards & Cocktails at Lugo's Craft Distillery.",
      postalAddress,
      `Unsubscribe: ${unsubscribeUrl}`,
    ].filter((l) => l !== undefined && l !== null).join('\n');

    return { html, text };
  },
};
