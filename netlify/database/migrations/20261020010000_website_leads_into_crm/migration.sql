-- Website form leads (the `leads` table, filled by create-lead and
-- create-proposal) now also land in one CRM instance's crm_leads. The instance
-- is chosen in /admin → CRM Instances; at most one receives them.
ALTER TABLE "crm_instances" ADD COLUMN IF NOT EXISTS "receives_website_leads" boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS "crm_instances_one_website_leads" ON "crm_instances" ("receives_website_leads") WHERE "receives_website_leads";

-- Links a CRM lead to the website lead it was copied from, so a lead is never copied twice.
ALTER TABLE "crm_leads" ADD COLUMN IF NOT EXISTS "website_lead_id" uuid UNIQUE REFERENCES "leads" ("id") ON DELETE SET NULL;

-- Default receiver: the oldest instance named "Loogo Labs…", unless one is already chosen.
UPDATE crm_instances SET receives_website_leads = true
WHERE id = (SELECT id FROM crm_instances WHERE name ILIKE 'loogo labs%' AND status = 'active' ORDER BY created_at LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM crm_instances WHERE receives_website_leads);

-- Copy every existing website lead into that instance, with its admin notes,
-- since the old Leads CRM tab is gone. Old stages map onto lead statuses; the
-- original stage is kept in the description.
INSERT INTO crm_leads (instance_id, website_lead_id, name, company_name, email, phone, status, source,
  estimated_value, industry, city, country, description, created_at, updated_at)
SELECT i.id, l.id, l.full_name, l.company, l.email, l.phone,
  CASE l.status WHEN 'contacted' THEN 'contacted' WHEN 'lost' THEN 'unqualified'
    WHEN 'qualified' THEN 'qualified' WHEN 'proposal' THEN 'qualified' WHEN 'won' THEN 'qualified' ELSE 'new' END,
  'website', l.deal_value, l.business_type, l.city, l.country,
  concat_ws(E'\n',
    'Website form: ' || initcap(replace(coalesce(l.source, 'website'), '_', ' ')),
    CASE WHEN l.status NOT IN ('new', 'contacted', 'qualified') THEN 'Stage in the old Leads CRM: ' || l.status END,
    'Missed calls / volume: ' || coalesce(l.missed_calls, l.job_volume),
    'Pain point: ' || coalesce(l.pain_point, l.review_pain_point),
    'Decision maker: ' || l.decision_maker,
    'Region: ' || l.region,
    'Follow-up was due: ' || to_char(l.follow_up_at, 'YYYY-MM-DD'),
    nullif(E'\n' || nullif(l.notes, ''), E'\n')),
  l.created_at, coalesce(l.updated_at, l.created_at)
FROM leads l CROSS JOIN crm_instances i
WHERE i.receives_website_leads
  AND NOT EXISTS (SELECT 1 FROM crm_leads c WHERE c.website_lead_id = l.id);

INSERT INTO crm_activities (instance_id, entity_type, entity_id, type, body, author_label, created_at, updated_at, completed_at)
SELECT c.instance_id, 'leads', c.id, CASE a.kind WHEN 'call' THEN 'call' WHEN 'email' THEN 'email' WHEN 'meeting' THEN 'meeting' ELSE 'note' END,
  CASE WHEN a.kind = 'status' THEN 'Stage change: ' || a.body ELSE a.body END,
  'Old Leads CRM', a.created_at, a.created_at, a.created_at
FROM lead_activity a JOIN crm_leads c ON c.website_lead_id = a.lead_id
WHERE NOT EXISTS (SELECT 1 FROM crm_activities x WHERE x.entity_id = c.id AND x.created_at = a.created_at AND x.author_label = 'Old Leads CRM');
