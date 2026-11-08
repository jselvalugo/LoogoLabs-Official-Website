import React from 'react';
import { useCrm } from './ctx';
import { monthLabel, monthOf, prevMonth } from './metrics';
import { downloadReport, reportFileName, reportInputs } from './pdfReport';
import { Drawer, day } from './report';

// "Download PDF report": pick the month, see what the report will contain,
// and what's missing. The download needs at least one uploaded report with
// key numbers for that month; a status report and last month's data are
// optional extras (summary and month-over-month change).

const thisMonth = () => new Date().toISOString().slice(0, 7);

export function ReportPdfDialog({ project, onClose, onGo }) {
  const { me } = useCrm();
  const months = React.useMemo(() => {
    const set = new Set((project.sources || []).map(monthOf).filter(Boolean));
    set.add(thisMonth());
    set.add(prevMonth(thisMonth()));
    return [...set].sort().reverse();
  }, [project.sources]);
  const latestWithData = months.find((m) => (project.sources || []).some((s) => monthOf(s) === m && (s.metrics || []).length));
  const [month, setMonth] = React.useState(latestWithData || prevMonth(thisMonth()));
  const [blockers, setBlockers] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const { sources, prev, report } = reportInputs(project, month);
  const withNumbers = sources.filter((s) => (s.metrics || []).length);
  const has = (kind) => sources.some((s) => s.kind === kind && (s.metrics || []).length);
  const ready = withNumbers.length > 0;
  const needsNumbers = sources.filter((s) => !(s.metrics || []).length);

  const checks = [
    { ok: has('google_analytics'), label: 'Google Analytics report', hint: 'Website traffic, engagement and key events', go: 'sources' },
    { ok: has('meta'), label: 'Meta report', hint: 'Facebook and Instagram reach, results and clicks', go: 'sources' },
    { ok: !!report, optional: true, label: 'Status report for the month', hint: report ? `Uses your ${day(report.report_date)} report for the summary and work done` : 'Adds the summary, what we did and what comes next', go: 'reports' },
    { ok: prev.some((s) => (s.metrics || []).length), optional: true, label: `${monthLabel(prevMonth(month))} data`, hint: 'Shows month-over-month change on each number', go: 'sources' },
  ];

  async function download() {
    setBusy(true); setError('');
    try { await downloadReport(project, month, { includeBlockers: blockers, preparedBy: me?.name || '' }); onClose(); } catch (err) { setError(err.message || 'Could not build the PDF.'); }
    setBusy(false);
  }

  return (
    <Drawer title="Download PDF report" kicker={project.name} onClose={onClose}>
      <label className="label" htmlFor="rp-month">Report month</label>
      <select id="rp-month" className="field" value={month} onChange={(e) => setMonth(e.target.value)}>
        {months.map((m) => {
          const n = (project.sources || []).filter((s) => monthOf(s) === m && (s.metrics || []).length).length;
          return <option key={m} value={m}>{monthLabel(m)}{n ? ` · ${n} report${n === 1 ? '' : 's'} uploaded` : ' · no data yet'}</option>;
        })}
      </select>

      <div className="section" style={{ marginTop: 24 }}>What goes in the report</div>
      <ul className="checklist">
        {checks.map((c) => (
          <li key={c.label} className={c.ok ? 'ok' : c.optional ? 'opt' : 'miss'}>
            <span className="tick" aria-hidden="true">{c.ok ? '✓' : c.optional ? '○' : '!'}</span>
            <div style={{ flex: 1 }}>
              <strong>{c.label}</strong>{c.optional && !c.ok ? <span className="muted"> · optional</span> : null}
              <div className="muted">{c.hint}</div>
            </div>
            {!c.ok && <button className="btn btn-small" onClick={() => onGo(c.go)}>{c.go === 'reports' ? 'Write it' : 'Upload'}</button>}
          </li>
        ))}
      </ul>
      {needsNumbers.length > 0 && (
        <div className="notice warn-notice">
          {needsNumbers.length} upload{needsNumbers.length === 1 ? ' has' : 's have'} no key numbers confirmed yet ({needsNumbers.map((s) => s.title).join(', ')}).
          Open Data sources and use &ldquo;Edit numbers&rdquo; so they show in the PDF.
        </div>
      )}

      {report?.blockers && (
        <label className="check" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={blockers} onChange={(e) => setBlockers(e.target.checked)} /> Include &ldquo;What we need from you&rdquo; (blockers)
        </label>
      )}

      {!ready && (
        <div className="notice warn-notice">
          Upload at least one analytics report for {monthLabel(month)} first: add the Google Analytics or Meta export under Data sources,
          and confirm its key numbers. Then come back here to download.
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button className="btn btn-primary" disabled={!ready || busy} onClick={download}>{busy ? 'Building PDF…' : 'Download PDF'}</button>
        {!ready && <button className="btn" onClick={() => onGo('sources')}>Go to Data sources</button>}
      </div>
      {ready && <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>Saves as &ldquo;{reportFileName(project, month)}&rdquo;</p>}
    </Drawer>
  );
}
