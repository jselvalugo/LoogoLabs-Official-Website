import { db } from './crm.js';

// Copies a website form lead (a row just written to `leads`) into the CRM
// instance chosen to receive website leads, if there is one. Called by the
// public create-lead and create-proposal functions; it must never fail them,
// so errors are logged and swallowed.
// Old Leads CRM stages → CRM lead statuses (matches the website_leads_into_crm migration).
const STATUS = { contacted: 'contacted', qualified: 'qualified', proposal: 'qualified', won: 'qualified', lost: 'unqualified' };

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
      lead.status && !['new', 'contacted', 'qualified'].includes(lead.status) && `Stage in the old Leads CRM: ${lead.status}`,
      lead.region && `Region: ${lead.region}`,
      lead.notes && `\n${lead.notes}`,
    ].filter(Boolean).join('\n');
    await sql`
      INSERT INTO crm_leads (instance_id, website_lead_id, name, company_name, email, phone, status, source,
        estimated_value, industry, city, country, description, created_at)
      VALUES (${inst.id}, ${lead.id}, ${lead.full_name}, ${lead.company || null}, ${lead.email}, ${lead.phone || null},
        ${STATUS[lead.status] || 'new'}, 'website',
        ${lead.deal_value ?? null}, ${lead.business_type || null}, ${lead.city || null}, ${lead.country || null}, ${description},
        ${lead.created_at || new Date()})
      ON CONFLICT (website_lead_id) DO NOTHING`;
  } catch (err) {
    console.error('Could not copy website lead into the CRM', err);
  }
}

// Makes `instanceId` the one instance that receives website leads, and brings
// the existing ones with it: website leads already copied into another
// instance move over (with their activities) unless they were converted there,
// and any website lead never copied is copied now. Returns the counts.
export async function receiveWebsiteLeads(instanceId) {
  const { sql } = db();
  await sql`UPDATE crm_instances SET receives_website_leads = false WHERE receives_website_leads AND id <> ${instanceId}`;
  const [inst] = await sql`UPDATE crm_instances SET receives_website_leads = true WHERE id = ${instanceId} RETURNING id`;
  if (!inst) return null;

  // Owners and assignees are users of the old instance, so they are cleared.
  await sql`
    UPDATE crm_activities a SET instance_id = ${instanceId}, owner_id = NULL
    FROM crm_leads c
    WHERE a.entity_type = 'leads' AND a.entity_id = c.id
      AND c.website_lead_id IS NOT NULL AND c.instance_id <> ${instanceId} AND c.status <> 'converted'`;
  const moved = await sql`
    UPDATE crm_leads SET instance_id = ${instanceId}, owner_id = NULL
    WHERE website_lead_id IS NOT NULL AND instance_id <> ${instanceId} AND status <> 'converted'
    RETURNING id`;

  const missing = await sql`SELECT * FROM leads l WHERE NOT EXISTS (SELECT 1 FROM crm_leads c WHERE c.website_lead_id = l.id) ORDER BY created_at`;
  for (const lead of missing) await copyWebsiteLead(lead);
  // Their call logs and notes from the old Leads CRM come along too.
  if (missing.length) {
    await sql`
      INSERT INTO crm_activities (instance_id, entity_type, entity_id, type, body, author_label, created_at, updated_at, completed_at)
      SELECT c.instance_id, 'leads', c.id, CASE WHEN a.kind IN ('call', 'email', 'meeting') THEN a.kind ELSE 'note' END,
        CASE WHEN a.kind = 'status' THEN 'Stage change: ' || a.body ELSE a.body END, 'Old Leads CRM', a.created_at, a.created_at, a.created_at
      FROM lead_activity a JOIN crm_leads c ON c.website_lead_id = a.lead_id
      WHERE c.website_lead_id = ANY(${missing.map((l) => l.id)}::uuid[])
        AND NOT EXISTS (SELECT 1 FROM crm_activities x WHERE x.entity_id = c.id AND x.created_at = a.created_at AND x.author_label = 'Old Leads CRM')`;
  }
  return { moved: moved.length, copied: missing.length };
}
