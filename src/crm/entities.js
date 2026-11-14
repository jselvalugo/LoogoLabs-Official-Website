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

// ── Projects ────────────────────────────────────────────────────────────────
// Every project follows one of two lifecycles, picked in its Lifecycle field.
// "agency" is the default: a campaign or build with a start and a finish.
// "evergreen" is ongoing work with no set end (it can still end one day).
// main: the forward path shown as steps. side: a parking state off the path.
// closed: the project is finished (stamps closed_at).
export const PROJECT_LIFECYCLES = [
  { id: 'agency', label: 'Agency lifecycle', hint: 'Has a start and a finish: brief, build, launch, report, close.', cadence: 'weekly' },
  { id: 'evergreen', label: 'Evergreen', hint: 'Ongoing work with no set end date. It may end, but nobody knows when.', cadence: 'monthly' },
];
export const PROJECT_STAGES = {
  agency: [
    { id: 'intake', label: 'Intake & brief' },
    { id: 'discovery', label: 'Discovery & onboarding' },
    { id: 'strategy', label: 'Strategy & planning' },
    { id: 'production', label: 'Creative production' },
    { id: 'client_review', label: 'Client review' },
    { id: 'launch', label: 'Launch' },
    { id: 'optimize', label: 'Optimize & report' },
    { id: 'wrap_up', label: 'Wrap-up & handoff' },
    { id: 'completed', label: 'Completed', closed: true },
    { id: 'on_hold', label: 'On hold', side: true },
    { id: 'cancelled', label: 'Cancelled', side: true, closed: true },
  ],
  evergreen: [
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'active', label: 'Active' },
    { id: 'optimizing', label: 'Optimizing' },
    { id: 'periodic_review', label: 'Periodic review' },
    { id: 'paused', label: 'Paused', side: true },
    { id: 'ended', label: 'Ended', side: true, closed: true },
  ],
};
export const stagesFor = (lifecycle) => PROJECT_STAGES[lifecycle] || PROJECT_STAGES.agency;
export const stageInfo = (lifecycle, stage) => stagesFor(lifecycle).find((s) => s.id === stage);
export const ALL_PROJECT_STAGES = [...PROJECT_STAGES.agency, ...PROJECT_STAGES.evergreen];
export const PROJECT_HEALTH = [
  { id: 'on_track', label: 'On track' },
  { id: 'at_risk', label: 'At risk' },
  { id: 'off_track', label: 'Off track' },
];
export const REPORT_CADENCES = [
  { id: 'weekly', label: 'Weekly', days: 7 },
  { id: 'biweekly', label: 'Every 2 weeks', days: 14 },
  { id: 'monthly', label: 'Monthly', days: 30 },
  { id: 'quarterly', label: 'Quarterly', days: 91 },
  { id: 'none', label: 'No set schedule', days: null },
];
// A status report on a project: the health call plus what happened and what's next.
export const SOCIAL_FIELDS = ['instagram_url', 'facebook_url', 'tiktok_url', 'linkedin_url', 'youtube_url', 'x_url'];
export const CHARGE_KINDS = [
  { id: 'setup', label: 'Initiation / setup' },
  { id: 'monthly', label: 'Monthly fee' },
  { id: 'one_time', label: 'One-time' },
  { id: 'credit', label: 'Credit' },
];
export const CHARGE_STATUSES = [
  { id: 'due', label: 'Due' },
  { id: 'paid', label: 'Paid' },
  { id: 'void', label: 'Void' },
];
export const CHARGE_FIELDS = [
  { key: 'kind', label: 'Type', type: 'select', options: CHARGE_KINDS, default: 'monthly' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'amount', label: 'Amount', type: 'money', required: true },
  { key: 'due_date', label: 'Due date', type: 'date' },
  { key: 'period_start', label: 'Period (month starting)', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: CHARGE_STATUSES, default: 'due' },
  { key: 'paid_at', label: 'Paid on', type: 'date' },
  { key: 'method', label: 'Paid by', type: 'text' },
];
export const SOURCE_KINDS = [
  { id: 'google_analytics', label: 'Google Analytics' },
  { id: 'meta', label: 'Meta (Facebook / Instagram)' },
  { id: 'social', label: 'Other social platform' },
  { id: 'search_console', label: 'Search Console / SEO' },
  { id: 'ads', label: 'Google Ads' },
  { id: 'other', label: 'Other' },
];
export const SOURCE_FIELDS = [
  { key: 'kind', label: 'Source', type: 'select', options: SOURCE_KINDS, default: 'other' },
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'filename', label: 'File name', type: 'text' },
  { key: 'period_start', label: 'Period from', type: 'date' },
  { key: 'period_end', label: 'Period to', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];
// Invoices: a status, bill-to details and line items (INVOICE_ITEM_FIELDS).
// "Overdue" is not stored; the app shows it when a sent invoice is past due.
export const INVOICE_STATUSES = [
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'paid', label: 'Paid' },
  { id: 'void', label: 'Void' },
];
export const INVOICE_ITEM_FIELDS = [
  { key: 'description', label: 'Item', type: 'text', required: true },
  { key: 'details', label: 'Details (one per line)', type: 'textarea' },
  { key: 'quantity', label: 'Qty', type: 'number', default: 1 },
  { key: 'unit_price', label: 'Unit price', type: 'money', default: 0 },
  { key: 'unit_label', label: 'Unit (e.g. hr)', type: 'text' },
  { key: 'note', label: 'Price note (e.g. Complimentary)', type: 'text' },
  { key: 'position', label: 'Order', type: 'number' },
];
export const REPORT_STATUSES = [{ id: 'draft', label: 'Draft' }, { id: 'final', label: 'Final' }];
export const REPORT_FIELDS = [
  { key: 'report_date', label: 'Report date', type: 'date', required: true },
  { key: 'health', label: 'Health', type: 'select', options: PROJECT_HEALTH, default: 'on_track' },
  { key: 'summary', label: 'Summary', type: 'textarea', required: true },
  { key: 'accomplishments', label: 'Done since last report', type: 'textarea' },
  { key: 'next_steps', label: 'Next up', type: 'textarea' },
  { key: 'blockers', label: 'Blockers / needs from client', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: REPORT_STATUSES, default: 'final' },
];

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
      { key: 'logo_url', label: 'Logo', type: 'image' },
      { key: 'instagram_url', label: 'Instagram', type: 'url' },
      { key: 'facebook_url', label: 'Facebook', type: 'url' },
      { key: 'tiktok_url', label: 'TikTok', type: 'url' },
      { key: 'linkedin_url', label: 'LinkedIn page', type: 'url' },
      { key: 'youtube_url', label: 'YouTube', type: 'url' },
      { key: 'x_url', label: 'X (Twitter)', type: 'url' },
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
  projects: {
    table: 'crm_projects',
    label: 'Project', plural: 'Projects',
    title: (r) => r.name,
    search: ['name', 'description'],
    columns: ['name', 'company_id', 'lifecycle', 'stage', 'health', 'next_report_date'],
    fields: [
      { key: 'name', label: 'Project name', type: 'text', required: true },
      { key: 'company_id', label: 'Client', type: 'ref', to: 'companies' },
      { key: 'lifecycle', label: 'Lifecycle', type: 'select', options: PROJECT_LIFECYCLES, default: 'agency' },
      // Options depend on the lifecycle; the server checks the pair (crm-records.js).
      { key: 'stage', label: 'Stage', type: 'select', options: ALL_PROJECT_STAGES, default: 'intake' },
      { key: 'health', label: 'Health', type: 'select', options: PROJECT_HEALTH, default: 'on_track' },
      { key: 'contact_id', label: 'Client contact', type: 'ref', to: 'contacts' },
      { key: 'opportunity_id', label: 'Won deal', type: 'ref', to: 'opportunities' },
      { key: 'start_date', label: 'Start date', type: 'date' },
      { key: 'target_end_date', label: 'Target end date', type: 'date' },
      { key: 'report_cadence', label: 'Status report cadence', type: 'select', options: REPORT_CADENCES },
      { key: 'next_report_date', label: 'Next status report due', type: 'date' },
      { key: 'billing', label: 'Billing', type: 'select', options: opts('fixed_fee', 'monthly_retainer', 'hourly', 'other') },
      { key: 'setup_fee', label: 'Initiation / setup fee', type: 'money' },
      { key: 'monthly_fee', label: 'Monthly fee', type: 'money' },
      { key: 'billing_day', label: 'Billing day of month', type: 'number' },
      { key: 'budget', label: 'Total budget', type: 'money' },
      { key: 'owner_id', label: 'Project lead', type: 'user' },
      { key: 'description', label: 'Scope & goals', type: 'textarea' },
    ],
    readonly: ['stage_changed_at', 'closed_at', 'last_report_at'],
  },
  invoices: {
    table: 'crm_invoices',
    label: 'Invoice', plural: 'Invoices',
    title: (r) => r.name,
    search: ['name', 'bill_to_name', 'bill_to_company', 'bill_to_email'],
    columns: ['name', 'bill_to_name', 'issue_date', 'due_date', 'status'],
    fields: [
      // Left blank, the server numbers it INV-<year>-<nnn>.
      { key: 'name', label: 'Invoice number', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: INVOICE_STATUSES, default: 'draft' },
      { key: 'template', label: 'Invoice template', type: 'text' },
      { key: 'company_id', label: 'Company', type: 'ref', to: 'companies' },
      { key: 'contact_id', label: 'Contact', type: 'ref', to: 'contacts' },
      { key: 'project_id', label: 'Project', type: 'ref', to: 'projects' },
      // Filled from the contact / company when left blank on create.
      { key: 'bill_to_name', label: 'Bill to', type: 'text' },
      { key: 'bill_to_title', label: 'Bill-to title', type: 'text' },
      { key: 'bill_to_company', label: 'Bill-to business', type: 'text' },
      { key: 'bill_to_email', label: 'Bill-to email', type: 'email' },
      { key: 'bill_to_phone', label: 'Bill-to phone', type: 'phone' },
      { key: 'bill_to_address', label: 'Bill-to address', type: 'textarea' },
      { key: 'issue_date', label: 'Issue date', type: 'date' },
      { key: 'due_date', label: 'Due date', type: 'date' },
      { key: 'tax_rate', label: 'Tax rate', type: 'percent' },
      { key: 'discount', label: 'Discount', type: 'money' },
      { key: 'payment_link', label: 'Payment link', type: 'url' },
      { key: 'notes', label: 'Notes to the client', type: 'textarea' },
      { key: 'terms', label: 'Terms & scope', type: 'textarea' },
      { key: 'paid_at', label: 'Paid on', type: 'date' },
      { key: 'payment_method', label: 'Paid by', type: 'text' },
      { key: 'owner_id', label: 'Owner', type: 'user' },
    ],
    readonly: ['sent_at', 'sent_to'],
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
