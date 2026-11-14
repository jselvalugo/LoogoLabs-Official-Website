import { renderInvoice } from './layout.js';

// Loogo Labs LLC's own invoice, in the cream document standard used by the
// quotes and the Google Ads Proposal Template: forest ink on cream, amber
// labels, Marcellus headings, Work Sans body, the real logo (never typed).

const BRAND = {
  logo: 'https://www.loogolabs.com/invoice-logo.png',
  logoAlt: 'Loogo Labs · AI, Marketing & Automation',
  tagline: 'AI, Marketing & Automation',
  colors: {
    ink: '#1B2A12', cream: '#F4F0E9', amber: '#8A6A3F', muted: '#5C564C', line: '#C9D0BD', sage: '#E4E9DA',
  },
  business: {
    name: 'Loogo Labs LLC',
    address: ['2875 S Orange Ave', 'STE 500 #6412', 'Orlando, FL 32806-5471'],
    contact: 'David',
    email: 'david@loogolabs.com',
    phone: '(407) 748-9150',
    website: 'https://www.loogolabs.com',
  },
};

export default {
  id: 'loogo-labs-invoice',
  name: 'Loogo Labs LLC invoice',
  description: 'Cream-branded Loogo Labs LLC invoice with line items, totals and an optional Pay button.',
  // The Loogo Labs workspace. Its slug is shown in the CRM under Settings.
  instances: ['loogo-labs-instance', 'loogo-labs', 'loogolabs'],
  reply_to: 'david@loogolabs.com',
  render: (invoice, opts) => renderInvoice(BRAND, invoice, opts),
};
