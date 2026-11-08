import React from 'react';
import { data } from './api';
import { useCrm } from './ctx';
import { PROJECT_HEALTH, PROJECT_LIFECYCLES, stageInfo, stagesFor } from './entities';
import { day, when } from './report';

// Projects: delivery work after a deal is won. Each project runs on one of two
// lifecycles (agency: start to finish; evergreen: ongoing, no set end), keeps a
// health call, and gets dated status reports.

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const lifecycleLabel = (id) => PROJECT_LIFECYCLES.find((l) => l.id === id)?.label || id;
const healthLabel = (id) => PROJECT_HEALTH.find((h) => h.id === id)?.label || id;
const stageLabel = (p) => stageInfo(p.lifecycle, p.stage)?.label || p.stage;
export const reportDue = (p) => !stageInfo(p.lifecycle, p.stage)?.side && !p.closed_at && p.next_report_date && p.next_report_date <= today();

export function HealthPill({ health }) {
  return <span className={`pill health ${health}`}><i aria-hidden="true" />{healthLabel(health)}</span>;
}

export function LifecyclePill({ lifecycle }) {
  return <span className={`pill life ${lifecycle}`}>{lifecycle === 'evergreen' ? '∞ ' : ''}{lifecycleLabel(lifecycle)}</span>;
}

// ── List page ───────────────────────────────────────────────────────────────

export function ProjectsPage() {
  const { open, version, changed } = useCrm();
  const [rows, setRows] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [lifecycle, setLifecycle] = React.useState('');
  const [health, setHealth] = React.useState('');
  const [showClosed, setShowClosed] = React.useState(false);
  const [view, setView] = React.useState(() => { try { return localStorage.getItem('crm:projects-view') || 'board'; } catch { return 'board'; } });
  const [error, setError] = React.useState('');

  React.useEffect(() => { try { localStorage.setItem('crm:projects-view', view); } catch { /* private mode */ } }, [view]);
  React.useEffect(() => {
    const filters = {};
    if (lifecycle) filters.lifecycle = lifecycle;
    if (health) filters.health = health;
    const t = setTimeout(() => {
      data('list', { entity: 'projects', query, filters, limit: 500, sort: 'updated_at:desc' })
        .then((r) => setRows(r.records)).catch(() => setRows([]));
    }, query ? 250 : 0);
    return () => clearTimeout(t);
  }, [query, lifecycle, health, version]);

  async function move(project, stage) {
    if (project.stage === stage) return;
    setError('');
    setRows((p) => p.map((r) => (r.id === project.id ? { ...r, stage } : r)));
    try { await data('update', { entity: 'projects', id: project.id, values: { stage } }); changed(); } catch (err) { setError(err.message); changed(); }
  }

  const visible = (rows || []).filter((r) => showClosed || !r.closed_at);
  const hiddenClosed = (rows || []).length - visible.length;
  const lifecycles = lifecycle ? [lifecycle] : PROJECT_LIFECYCLES.map((l) => l.id);
  const due = visible.filter(reportDue).length;
  const risky = visible.filter((r) => r.health !== 'on_track').length;

  return (
    <>
      <div className="head">
        <h1>Projects</h1>
        <input className="field" style={{ width: 240, maxWidth: '100%' }} placeholder="Search projects" aria-label="Search projects"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn" onClick={() => setView((v) => (v === 'board' ? 'table' : 'board'))}>{view === 'board' ? 'Table view' : 'Board view'}</button>
        <button className="btn btn-primary" onClick={() => open('projects')}>New project</button>
      </div>

      <div className="toolbar">
        <div className="seg" role="group" aria-label="Lifecycle">
          <button className={lifecycle === '' ? 'on' : ''} onClick={() => setLifecycle('')}>All lifecycles</button>
          {PROJECT_LIFECYCLES.map((l) => <button key={l.id} className={lifecycle === l.id ? 'on' : ''} onClick={() => setLifecycle(l.id)}>{l.label}</button>)}
        </div>
        <div className="seg" role="group" aria-label="Health">
          <button className={health === '' ? 'on' : ''} onClick={() => setHealth('')}>Any health</button>
          {PROJECT_HEALTH.map((h) => <button key={h.id} className={health === h.id ? 'on' : ''} onClick={() => setHealth(h.id)}>{h.label}</button>)}
        </div>
        <label className="check"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Show finished</label>
      </div>

      {rows && (
        <p className="muted count">
          {visible.length} project{visible.length === 1 ? '' : 's'}
          {risky > 0 && <> · <span className="overdue">{risky} need attention</span></>}
          {due > 0 && <> · <span className="overdue">{due} status report{due === 1 ? '' : 's'} due</span></>}
          {!showClosed && hiddenClosed > 0 && <> · {hiddenClosed} finished hidden</>}
        </p>
      )}
      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      {!rows ? <p className="muted">Loading…</p>
        : rows.length === 0 && !query && !lifecycle && !health ? <EmptyProjects onNew={() => open('projects')} />
          : view === 'board' ? lifecycles.map((l) => (
            <ProjectBoard key={l} lifecycle={l} rows={visible.filter((r) => r.lifecycle === l)} showClosed={showClosed} onMove={move} titled={lifecycles.length > 1} />
          )) : <ProjectTable rows={visible} />}
    </>
  );
}

function EmptyProjects({ onNew }) {
  return (
    <div className="card pad empty">
      <strong>No projects yet</strong>
      <p className="muted">
        A project tracks the work after a deal is won. Pick <strong>Agency lifecycle</strong> for work with a start and a finish
        (a launch, a campaign, a build), or <strong>Evergreen</strong> for ongoing work with no set end, like a monthly retainer.
      </p>
      <button className="btn btn-primary" onClick={onNew}>Create the first project</button>
    </div>
  );
}

function ProjectBoard({ lifecycle, rows, showClosed, onMove, titled }) {
  const { open } = useCrm();
  const [over, setOver] = React.useState(null);
  const stages = stagesFor(lifecycle).filter((s) => showClosed || !s.closed);
  const life = PROJECT_LIFECYCLES.find((l) => l.id === lifecycle);
  return (
    <div className="pboard-wrap">
      {titled && (
        <div className="section row">
          <span style={{ flex: 1 }}>{life.label} <span className="hint">· {life.hint}</span></span>
        </div>
      )}
      <div className="pboard">
        {stages.map((s) => {
          const items = rows.filter((r) => r.stage === s.id);
          return (
            <div key={s.id} className={`lane ${s.side ? 'side' : ''} ${over === s.id ? 'over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOver(s.id); }}
              onDragLeave={() => setOver((o) => (o === s.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault(); setOver(null);
                const id = e.dataTransfer.getData('text/project');
                const p = rows.find((r) => r.id === id);
                if (p) onMove(p, s.id);
              }}>
              <div className="lane-head">{s.label} <span className="muted">{items.length}</span></div>
              {items.map((r) => (
                <button key={r.id} className="card deal pcard" draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/project', r.id)} onClick={() => open('projects', r.id)}>
                  <span className={`hbar ${r.health}`} aria-hidden="true" />
                  <strong>{r.name}</strong>
                  {r.company_id_name && <span className="muted">{r.company_id_name}</span>}
                  <span className="pmeta">
                    {r.health !== 'on_track' && <HealthPill health={r.health} />}
                    {reportDue(r) && <span className="pill due">Report due</span>}
                    {lifecycle === 'agency' && r.target_end_date && <span className="muted">Due {day(r.target_end_date)}</span>}
                    {r.owner_id_name && <span className="muted">{r.owner_id_name}</span>}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </div>
      <p className="muted hint" style={{ marginTop: 4 }}>Drag a card to another column to move its stage.</p>
    </div>
  );
}

function ProjectTable({ rows }) {
  const { open } = useCrm();
  if (!rows.length) return <div className="card"><p className="muted" style={{ padding: 16 }}>No projects match.</p></div>;
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Project</th><th>Client</th><th className="hide-sm">Lifecycle</th><th>Stage</th><th>Health</th><th className="hide-sm">Next report</th><th className="hide-sm">Lead</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => open('projects', r.id)}>
              <td><strong>{r.name}</strong></td>
              <td>{r.company_id_name}</td>
              <td className="hide-sm"><LifecyclePill lifecycle={r.lifecycle} /></td>
              <td>{stageLabel(r)}</td>
              <td><HealthPill health={r.health} /></td>
              <td className={`hide-sm ${reportDue(r) ? 'overdue' : ''}`}>{day(r.next_report_date)}</td>
              <td className="hide-sm">{r.owner_id_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Inside the project drawer ───────────────────────────────────────────────

// The lifecycle as steps: done, current, upcoming; plus one-click moves.
export function LifecycleTrack({ project, onMove, busy }) {
  const stages = stagesFor(project.lifecycle);
  const main = stages.filter((s) => !s.side);
  const sides = stages.filter((s) => s.side);
  const current = stageInfo(project.lifecycle, project.stage);
  const idx = main.findIndex((s) => s.id === project.stage);
  const evergreen = project.lifecycle === 'evergreen';
  // Evergreen work cycles: after Periodic review it goes back to Active.
  const next = current?.side ? null
    : idx >= 0 && idx < main.length - 1 ? main[idx + 1]
      : evergreen && project.stage === 'periodic_review' ? main.find((s) => s.id === 'active') : null;
  const prev = !current?.side && idx > 0 ? main[idx - 1] : null;
  const resume = current?.side && !current.closed ? main.find((s) => s.id === (evergreen ? 'active' : 'production')) || main[0] : null;

  return (
    <div className="lifecycle card">
      <div className="lifecycle-top">
        <LifecyclePill lifecycle={project.lifecycle} />
        <HealthPill health={project.health} />
        <span className="muted" style={{ fontSize: 13 }}>
          In <strong>{current?.label || project.stage}</strong>{project.stage_changed_at ? ` since ${new Date(project.stage_changed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
        </span>
      </div>
      <ol className={`steps ${current?.side ? 'parked' : ''}`}>
        {main.map((s, i) => {
          const state = idx < 0 ? '' : i < idx ? 'past' : i === idx ? 'now' : '';
          return (
            <li key={s.id} className={state}>
              <button type="button" disabled={busy || s.id === project.stage} onClick={() => onMove(s.id)} title={`Move to ${s.label}`}>
                <span className="dot" aria-hidden="true">{state === 'past' ? '✓' : ''}</span>
                <span className="lbl">{s.label}</span>
              </button>
            </li>
          );
        })}
        {evergreen && <li className="loop" aria-hidden="true">↻</li>}
      </ol>
      {current?.side && <div className="parked-note">{current.closed ? `This project is ${current.label.toLowerCase()}.` : `Parked: ${current.label}.`}</div>}
      <div className="actions" style={{ marginTop: 12 }}>
        {next && <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onMove(next.id)}>Move to {next.label} →</button>}
        {resume && <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onMove(resume.id)}>Resume ({resume.label})</button>}
        {prev && <button type="button" className="btn" disabled={busy} onClick={() => onMove(prev.id)}>← Back to {prev.label}</button>}
        {sides.filter((s) => s.id !== project.stage).map((s) => (
          <button key={s.id} type="button" className={`btn ${s.closed ? 'btn-danger' : ''}`} disabled={busy}
            onClick={() => { if (!s.closed || window.confirm(`Mark ${project.name} as ${s.label.toLowerCase()}?`)) onMove(s.id); }}>
            {s.label}
          </button>
        ))}
      </div>
      {evergreen && <p className="muted hint">Evergreen: no end date. It cycles Active → Optimizing → Periodic review → Active until it ends.</p>}
    </div>
  );
}

const blankReport = () => ({ report_date: today(), health: 'on_track', summary: '', accomplishments: '', next_steps: '', blockers: '' });

export function StatusReports({ project, initial, onChanged, composeSignal = 0 }) {
  const [items, setItems] = React.useState(initial || []);
  const [form, setForm] = React.useState(blankReport);
  const [composing, setComposing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const last = items[0];
  const due = reportDue(project);

  function start() {
    // Carry last report's "next up" into "done since last report" as a starting point.
    setForm({ ...blankReport(), health: project.health || 'on_track', accomplishments: last?.next_steps || '' });
    setComposing(true);
  }

  React.useEffect(() => { if (composeSignal) start(); }, [composeSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const row = await data('add_report', { values: { ...form, project_id: project.id } });
      setItems((p) => [row, ...p].sort((a, b) => (a.report_date < b.report_date ? 1 : -1)));
      setComposing(false);
      onChanged();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  async function remove(r) {
    if (!window.confirm(`Delete the ${day(r.report_date)} status report?`)) return;
    await data('delete_report', { id: r.id });
    setItems((p) => p.filter((x) => x.id !== r.id));
    onChanged();
  }

  return (
    <>
      <div className="section row">
        <span style={{ flex: 1 }}>Status reports ({items.length})</span>
        {!composing && <button className="btn btn-small" onClick={start}>New status report</button>}
      </div>
      {!composing && (
        <p className={`muted ${due ? 'overdue' : ''}`} style={{ fontSize: 13, marginTop: -4 }}>
          {project.next_report_date ? `${due ? 'Overdue: next report was due' : 'Next report due'} ${day(project.next_report_date)}` : 'No report schedule set.'}
          {last ? ` · Last report ${day(last.report_date)}` : ''}
        </p>
      )}
      {composing && (
        <form className="card report-form" onSubmit={submit}>
          <div className="grid2">
            <div>
              <label className="label" htmlFor="r-date">Report date</label>
              <input id="r-date" className="field" type="date" value={form.report_date} onChange={set('report_date')} required />
            </div>
            <div>
              <span className="label">Health</span>
              <div className="seg health-seg" role="group" aria-label="Health">
                {PROJECT_HEALTH.map((h) => (
                  <button type="button" key={h.id} className={`${form.health === h.id ? 'on' : ''} ${h.id}`} onClick={() => setForm((p) => ({ ...p, health: h.id }))}>{h.label}</button>
                ))}
              </div>
            </div>
          </div>
          <label className="label" htmlFor="r-sum">Summary *</label>
          <textarea id="r-sum" className="field" rows={2} placeholder="Where things stand in a sentence or two" value={form.summary} onChange={set('summary')} required />
          <label className="label" htmlFor="r-done">Done since last report</label>
          <textarea id="r-done" className="field" rows={3} value={form.accomplishments} onChange={set('accomplishments')} />
          <label className="label" htmlFor="r-next">Next up</label>
          <textarea id="r-next" className="field" rows={3} value={form.next_steps} onChange={set('next_steps')} />
          <label className="label" htmlFor="r-block">Blockers / needs from client</label>
          <textarea id="r-block" className="field" rows={2} value={form.blockers} onChange={set('blockers')} />
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save status report'}</button>
            <button type="button" className="btn" onClick={() => setComposing(false)}>Cancel</button>
            <button type="button" className="btn" onClick={() => copyReport(project, form)}>Copy as text</button>
          </div>
        </form>
      )}
      {items.length === 0 && !composing && <div className="muted">No status reports yet. Each one records the health call and moves the next due date.</div>}
      {items.map((r) => <ReportCard key={r.id} project={project} report={r} onDelete={() => remove(r)} />)}
    </>
  );
}

function reportText(project, r) {
  const lines = [`${project.name} — status report, ${day(r.report_date)}`, `Health: ${healthLabel(r.health)}${r.stage ? ` · Stage: ${stageInfo(project.lifecycle, r.stage)?.label || r.stage}` : ''}`, '', r.summary];
  if (r.accomplishments) lines.push('', 'Done since last report:', r.accomplishments);
  if (r.next_steps) lines.push('', 'Next up:', r.next_steps);
  if (r.blockers) lines.push('', 'Blockers / needs from you:', r.blockers);
  return lines.join('\n');
}
function copyReport(project, r) {
  navigator.clipboard?.writeText(reportText(project, r)).catch(() => {});
}

function ReportCard({ project, report: r, onDelete }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className={`report-card ${r.health}`}>
      <div className="note-head">
        <strong>{day(r.report_date)}</strong>
        <HealthPill health={r.health} />
        {r.stage && <span className="pill">{stageInfo(project.lifecycle, r.stage)?.label || r.stage}</span>}
        <button className="link" style={{ marginLeft: 'auto', fontSize: 13 }}
          onClick={() => { copyReport(project, r); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? 'Copied' : 'Copy'}</button>
        <button className="link danger" style={{ marginLeft: 8 }} onClick={onDelete}>Delete</button>
      </div>
      <div className="pre" style={{ marginTop: 6 }}>{r.summary}</div>
      {r.accomplishments && <><div className="rlabel">Done</div><div className="pre">{r.accomplishments}</div></>}
      {r.next_steps && <><div className="rlabel">Next up</div><div className="pre">{r.next_steps}</div></>}
      {r.blockers && <><div className="rlabel blockers">Blockers</div><div className="pre">{r.blockers}</div></>}
      <small className="muted">{r.author || 'Removed user'} · {when(r.created_at)}</small>
    </div>
  );
}

// ── Overview block ──────────────────────────────────────────────────────────

export function ProjectsOverview({ summary }) {
  const { open } = useCrm();
  if (!summary) return null;
  const attention = [...summary.reports_due.map((p) => ({ ...p, why: 'report' })),
    ...summary.at_risk.filter((p) => !summary.reports_due.some((d) => d.id === p.id)).map((p) => ({ ...p, why: 'health' }))];
  return (
    <>
      <div className="section">Projects</div>
      <div className="stats stats-4">
        <div className="card stat"><div className="k">Agency projects</div><div className="n">{summary.agency_active}</div><div className="v">in progress</div></div>
        <div className="card stat"><div className="k">Evergreen</div><div className="n">{summary.evergreen_active}</div><div className="v">running</div></div>
        <div className="card stat"><div className="k">Need attention</div><div className="n">{summary.at_risk.length}</div><div className="v">at risk or off track</div></div>
        <div className="card stat"><div className="k">Reports due</div><div className="n">{summary.reports_due.length}</div><div className="v">{summary.parked} parked</div></div>
      </div>
      {attention.length > 0 && (
        <div className="feed" style={{ marginTop: 8 }}>
          {attention.slice(0, 8).map((p) => (
            <div key={`${p.id}-${p.why}`}>
              <button className="link" onClick={() => open('projects', p.id)}><strong>{p.name}</strong></button>
              <span className="muted">{p.company_id_name ? ` · ${p.company_id_name}` : ''} · {stageLabel(p)}</span>{' '}
              {p.why === 'report' ? <span className="pill due">Report due {day(p.next_report_date)}</span> : <HealthPill health={p.health} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

