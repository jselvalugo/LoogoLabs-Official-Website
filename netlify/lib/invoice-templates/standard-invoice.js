import { renderInvoice } from './layout.js';
import { pdfFileName, renderInvoicePdf } from './pdf.js';

// The default invoice every CRM workspace can use until Loogo Labs builds it a
// branded one. It takes the workspace's name and the sender's email at send
// time, so it works for any instance with no setup.

const COLORS = { ink: '#1F2A2E', cream: '#F4F4F2', amber: '#6B6F76', muted: '#5F6368', line: '#D9DADC', sage: '#E8EAEC' };

const brand = (workspace) => ({
  logo: null,
  colors: COLORS,
  business: { name: workspace.name || 'Invoice', address: [], contact: workspace.contact || '', email: workspace.email || '', phone: '', website: '' },
});

export default {
  id: 'standard-invoice',
  name: 'Standard',
  description: 'Clean, neutral quote or invoice that uses your workspace name. Ask Loogo Labs for a branded version.',
  instances: '*',
  render: (invoice, { forPrint, attached, workspace = {} } = {}) => renderInvoice(brand(workspace), invoice, { forPrint, attached }),
  pdf: (invoice, { workspace = {} } = {}) => renderInvoicePdf(brand(workspace), invoice),
  pdfName: (invoice, { workspace = {} } = {}) => pdfFileName(brand(workspace), invoice),
};
