export const STATUSES = ['new', 'reviewed', 'contacted', 'converted', 'dismissed'];

const STATUS_STYLE = {
  new:       { background: '#ECFEFF', color: '#0E7490' },
  reviewed:  { background: '#FEF3C7', color: '#92400E' },
  contacted: { background: '#DBEAFE', color: '#1E40AF' },
  converted: { background: '#D1FAE5', color: '#065F46' },
  dismissed: { background: '#F3F4F6', color: '#6B7280' },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.new;
  return (
    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, fontSize: 11,
      fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase',
      background: s.background, color: s.color }}>
      {status}
    </span>
  );
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
