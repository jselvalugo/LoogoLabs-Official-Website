// The CRM data model, shared by the app (src/crm), the data API
// (netlify/functions/crm-data.js) and the MCP server (crm-mcp.js). Field keys
// are database columns; the server only ever reads and writes the columns
// listed here, so this file is also the allow-list for every write.
//
// Field types: text, email, phone, url, textarea, number, money, percent,
// date, select (options), ref (to: another entity), user (a CRM user).

const opts = (...ids) => ids.map((id) => ({ id, label: id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) }));

export const SOURCES = opts('website', 'referral', 'cold_outreach', 'event', 'social', 'advertising', 'partner', 'other');

export const OPPORTUNITY_STAGES = [
  { id: 'prospecting', label: 'Prospecting', probability: 10 },
  { id: 'qualification', label: 'Qualification', probability: 25 },
  { id: 'proposal', label: 'Proposal', probability: 50 },
  { id: 'negotiation', label: 'Negotiation', probability: 75 },
  { id: 'won', label: 'Closed won', probability: 100 },
  { id: 'lost', label: 'Closed lost', probability: 0 },
];
export const LEAD_STATUSES = opts('new', 'contacted', 'qualified', 'unqualified', 'converted');
export const ACTIVITY_TYPES = opts('note', 'call', 'email', 'meeting', 'task');

export const ENTITIES = {
  companies: {
    table: 'crm_companies',
    label: 'Company', plural: 'Companies',
    title: (r) => r.name,
    search: ['name', 'domain', 'industry', 'city'],
    columns: ['name', 'industry', 'city', 'phone', 'owner_id'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'domain', label: 'Domain', type: 'text' },
      { key: 'website', label: 'Website', type: 'url' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: opts('prospect', 'customer', 'partner', 'vendor', 'other') },
      { key: 'employees', label: 'Employees', type: 'number' },
      { key: 'annual_revenue', label: 'Annual revenue', type: 'money' },
      { key: 'phone', label: 'Phone', type: 'phone' },
      { key: 'address', label: 'Street address', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'state', label: 'State / region', type: 'text' },
      { key: 'postal_code', label: 'Postal code', type: 'text' },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'owner_id', label: 'Owner', type: 'user' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  contacts: {
    table: 'crm_contacts',
    label: 'Contact', plural: 'Contacts',
    title: (r) => r.name,
    search: ['name', 'email', 'phone', 'title'],
    columns: ['name', 'company_id', 'title', 'email', 'phone'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'title', label: 'Job title', type: 'text' },
      { key: 'company_id', label: 'Company', type: 'ref', to: 'companies' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'phone' },
      { key: 'mobile', label: 'Mobile', type: 'phone' },
      { key: 'lifecycle', label: 'Lifecycle stage', type: 'select', options: opts('subscriber', 'lead', 'prospect', 'customer', 'former_customer', 'other') },
      { key: 'source', label: 'Source', type: 'select', options: SOURCES },
      { key: 'linkedin', label: 'LinkedIn', type: 'url' },
      { key: 'address', label: 'Street address', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'state', label: 'State / region', type: 'text' },
      { key: 'postal_code', label: 'Postal code', type: 'text' },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'owner_id', label: 'Owner', type: 'user' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  leads: {
    table: 'crm_leads',
    label: 'Lead', plural: 'Leads',
    title: (r) => r.name,
    search: ['name', 'company_name', 'email', 'phone'],
    columns: ['name', 'company_name', 'status', 'source', 'estimated_value'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'company_name', label: 'Company', type: 'text' },
      { key: 'title', label: 'Job title', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'phone' },
      { key: 'website', label: 'Website', type: 'url' },
      { key: 'status', label: 'Status', type: 'select', options: LEAD_STATUSES, default: 'new' },
      { key: 'rating', label: 'Rating', type: 'select', options: opts('hot', 'warm', 'cold') },
      { key: 'source', label: 'Source', type: 'select', options: SOURCES },
      { key: 'estimated_value', label: 'Estimated value', type: 'money' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'owner_id', label: 'Owner', type: 'user' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    // Set by convert_lead only, never by a plain update.
    readonly: ['converted_at', 'converted_company_id', 'converted_contact_id', 'converted_opportunity_id'],
  },
  opportunities: {
    table: 'crm_opportunities',
    label: 'Opportunity', plural: 'Opportunities',
    title: (r) => r.name,
    search: ['name'],
    columns: ['name', 'company_id', 'stage', 'amount', 'close_date'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'company_id', label: 'Company', type: 'ref', to: 'companies' },
      { key: 'contact_id', label: 'Primary contact', type: 'ref', to: 'contacts' },
      { key: 'stage', label: 'Stage', type: 'select', options: OPPORTUNITY_STAGES, default: 'prospecting' },
      { key: 'amount', label: 'Amount', type: 'money' },
      { key: 'probability', label: 'Probability', type: 'percent' },
      { key: 'close_date', label: 'Expected close date', type: 'date' },
      { key: 'type', label: 'Type', type: 'select', options: opts('new_business', 'existing_business', 'renewal', 'upsell') },
      { key: 'source', label: 'Source', type: 'select', options: SOURCES },
      { key: 'next_step', label: 'Next step', type: 'text' },
      { key: 'lost_reason', label: 'Lost reason', type: 'text' },
      { key: 'owner_id', label: 'Owner', type: 'user' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES);

// Activities hang off any one record above: a note, call, email, meeting or task.
export const ACTIVITY_FIELDS = [
  { key: 'type', label: 'Type', type: 'select', options: ACTIVITY_TYPES, default: 'note' },
  { key: 'subject', label: 'Subject', type: 'text' },
  { key: 'body', label: 'Details', type: 'textarea' },
  { key: 'due_date', label: 'Due / scheduled', type: 'date' },
  { key: 'owner_id', label: 'Assigned to', type: 'user' },
];

export const optionLabel = (field, value) => field.options?.find((o) => o.id === value)?.label ?? value;
