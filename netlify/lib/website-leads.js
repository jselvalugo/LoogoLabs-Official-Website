import { db } from './crm.js';

// Copies a website form lead (a row just written to `leads`) into the CRM
// instance chosen to receive website leads, if there is one. Called by the
// public create-lead and create-proposal functions; it must never fail them,
// so errors are logged and swallowed.
export async function copyWebsiteLead(lead) {
  try {
    const { sql } = db();
    const [inst] = await sql`SELECT id FROM crm_instances WHERE receives_website_leads AND status = 'active'`;
    if (!inst) return;
    const label = (lead.source || 'website').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const description = [
      `Website form: ${label}`,
      (lead.missed_calls || lead.job_volume) && `Missed calls / volume: ${lead.missed_calls || lead.job_volume}`,
      (lead.pain_point || lead.review_pain_point) && `Pain point: ${lead.pain_point || lead.review_pain_point}`,
      lead.decision_maker && `Decision maker: ${lead.decision_maker}`,
      lead.region && `Region: ${lead.region}`,
      lead.notes && `\n${lead.notes}`,
    ].filter(Boolean).join('\n');
    await sql`
      INSERT INTO crm_leads (instance_id, website_lead_id, name, company_name, email, phone, status, source,
        estimated_value, industry, city, country, description)
      VALUES (${inst.id}, ${lead.id}, ${lead.full_name}, ${lead.company || null}, ${lead.email}, ${lead.phone || null}, 'new', 'website',
        ${lead.deal_value ?? null}, ${lead.business_type || null}, ${lead.city || null}, ${lead.country || null}, ${description})
      ON CONFLICT (website_lead_id) DO NOTHING`;
  } catch (err) {
    console.error('Could not copy website lead into the CRM', err);
  }
}
