import { renderInvoice } from './layout.js';

// The default invoice every CRM workspace can use until Loogo Labs builds it a
// branded one. It takes the workspace's name and the sender's email at send
// time, so it works for any instance with no setup.

const COLORS = { ink: '#1F2A2E', cream: '#F4F4F2', amber: '#6B6F76', muted: '#5F6368', line: '#D9DADC', sage: '#E8EAEC' };

export default {
  id: 'standard-invoice',
  name: 'Standard invoice',
  description: 'Clean, neutral invoice that uses your workspace name. Ask Loogo Labs for a branded version.',
  instances: '*',
  render: (invoice, { forPrint, workspace = {} } = {}) => renderInvoice({
    logo: null,
    colors: COLORS,
    business: {
      name: workspace.name || 'Invoice',
      address: [],
      contact: workspace.contact || '',
      email: workspace.email || '',
      phone: '',
      website: '',
    },
  }, invoice, { forPrint }),
};
