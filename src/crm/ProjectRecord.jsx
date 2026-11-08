import React from 'react';
import { data } from './api';
import { useCrm } from './ctx';
import { ENTITIES, PROJECT_LIFECYCLES, SOCIAL_FIELDS, optionLabel, stageInfo, stagesFor } from './entities';
import { Activities, FieldInput, fieldsFor, today, withLifecycle } from './records';
import { day, money, when } from './report';
import { HealthPill, LifecyclePill, StatusReports, reportDue } from './Projects';
import { BillingTab, SourcesTab } from './ProjectTabs';
import { ReportPdfDialog } from './ReportPdf';

// Full-page project record, laid out like an enterprise CRM record page:
// header with highlights, a stage path with guidance, tabs, and a sidebar of
// related records, open tasks and key dates. /projects/<id>; /projects/new.

const E = ENTITIES.projects;
const F = Object.fromEntries(E.fields.map((f) => [f.key, f]));
const longDate = (ts) => (ts ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');

const SECTIONS = [
  { title: 'Project information', keys: ['name', 'company_id', 'contact_id', 'opportunity_id', 'owner_id', 'lifecycle', 'stage', 'health'] },
  { title: 'Schedule & reporting', keys: ['start_date', 'target_end_date', 'report_cadence', 'next_report_date'] },
  { title: 'Billing', keys: ['billing', 'setup_fee', 'monthly_fee', 'billing_day', 'budget'] },
  { title: 'Scope & goals', keys: ['description'] },
];

// What "done" looks like at each stage: shown under the path.
const GUIDANCE = {
  intake: ['Confirm goals, budget and deadline in writing', 'Name the client approver', 'Log the brief as a note'],
  discovery: ['Kickoff call held', 'Access to ad accounts, analytics, brand assets', 'Audience and competitor notes captured'],
  strategy: ['Strategy and channel plan approved', 'KPIs and reporting cadence agreed', 'Timeline shared with the client'],
  production: ['Creative and copy drafted', 'Internal review done before the client sees it', 'Assets sent through Approvals'],
  client_review: ['Client feedback collected in one place', 'Revisions within the agreed rounds', 'Final sign-off recorded'],
  launch: ['Tracking and conversions verified', 'Campaigns and posts live', 'Launch confirmation sent to the client'],
  optimize: ['Weekly performance check', 'Tests running and logged', 'Status report sent on cadence'],
  wrap_up: ['Final results report and recap shared', 'Assets and logins handed over', 'Ask for a review or referral'],
  completed: ['Project closed. Consider a follow-up opportunity.'],
  onboarding: ['Access and brand assets collected', 'Ongoing scope and channels confirmed', 'Reporting cadence agreed'],
  active: ['Content and campaigns shipping on schedule', 'Client feedback handled within a day', 'Monthly status report sent'],
  optimizing: ['Review what is and is not working', 'Run and log at least one test', 'Shift effort toward the best channel'],
  periodic_review: ['Review results with the client', 'Agree priorities for the next cycle', 'Confirm the engagement continues'],
  on_hold: ['Note why it is on hold and what restarts it'],
  paused: ['Note why it is paused and when to check back'],
};

function valueOf(record, key, open) {
  const f = F[key];
  const v = record[key];
  if (v === null || v === undefined || v === '') return <span className="muted">—</span>;
  switch (f.type) {
    case 'ref': return <button className="link" onClick={() => open(f.to, v)}>{record[`${key}_name`] || 'Open'}</button>;
    case 'user': return record[`${key}_name`];
    case 'select':
      if (key === 'stage') return stageInfo(record.lifecycle, v)?.label || v;
      if (key === 'health') return <HealthPill health={v} />;
      if (key === 'lifecycle') return <LifecyclePill lifecycle={v} />;
      return optionLabel(f, v);
    case 'money': return money(v);
    case 'date': return day(v);
    default: return <span className="pre">{String(v)}</span>;
  }
}

export function ProjectRecord({ id, preset }) {
  return id ? <ProjectPage id={id} /> : <NewProject preset={preset} />;
}

// ── Existing project ────────────────────────────────────────────────────────

function ProjectPage({ id }) {
  const { open, go, changed } = useCrm();
  const [record, setRecord] = React.useState(null);
  const [error, setError] = React.useState('');
  const [tab, setTab] = React.useState('overview');
  const [compose, setCompose] = React.useState(0);
  const [pdf, setPdf] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => data('get', { entity: 'projects', id }).then(setRecord).catch((err) => setError(err.message)), [id]);
  React.useEffect(() => { load(); }, [load]);
  React.useEffect(() => { if (record) document.title = `${record.name} | Project | Loogo CRM`; return () => { document.title = 'Loogo CRM'; }; }, [record?.name]);

  async function moveStage(stage) {
    setBusy(true); setError('');
    try { await data('update', { entity: 'projects', id, values: { stage } }); await load(); changed(); } catch (err) { setError(err.message); }
    setBusy(false);
  }

  async function remove() {
    if (!window.confirm(`Delete ${record.name}? Its status reports and activities are deleted too. This cannot be undone.`)) return;
    try { await data('delete', { entity: 'projects', id }); changed(); go('projects'); } catch (err) { setError(err.message); }
  }

  if (!record) {
    return (
      <div className="rec">
        <Crumbs go={go} name={error ? 'Not found' : 'Loading…'} />
        {error ? <div className="card pad"><div className="error" style={{ marginTop: 0 }}>{error}</div></div> : <p className="muted">Loading…</p>}
      </div>
    );
  }

  const openTasks = (record.activities || []).filter((a) => a.type === 'task' && !a.completed_at);
  const reports = record.reports || [];
  const refresh = () => { load(); changed(); };

  return (
    <div className="rec">
      <Crumbs go={go} name={record.name} />

      <section className="card rec-head">
        <div className="rec-title">
          <ClientLogo client={record.client} lifecycle={record.lifecycle} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="kicker">Project · <LifecyclePill lifecycle={record.lifecycle} /></div>
            <h1>{record.name}</h1>
          </div>
          <div className="rec-actions">
            <button className="btn btn-primary" onClick={() => setPdf(true)}>Download PDF report</button>
            <button className="btn" onClick={() => { setTab('reports'); setCompose((n) => n + 1); }}>New status report</button>
            <button className="btn btn-danger" onClick={remove}>Delete</button>
          </div>
        </div>
        <dl className="highlights">
          <div><dt>Client</dt><dd>{valueOf(record, 'company_id', open)}</dd></div>
          <div><dt>Stage</dt><dd>{valueOf(record, 'stage', open)}</dd></div>
          <div><dt>Health</dt><dd>{valueOf(record, 'health', open)}</dd></div>
          <div><dt>Monthly fee</dt><dd>{valueOf(record, 'monthly_fee', open)}</dd></div>
          <div><dt>Project lead</dt><dd>{valueOf(record, 'owner_id', open)}</dd></div>
          <div><dt>Next report</dt><dd className={reportDue(record) ? 'overdue' : ''}>{record.next_report_date ? day(record.next_report_date) : <span className="muted">—</span>}</dd></div>
        </dl>
      </section>

      {pdf && <ReportPdfDialog project={record} onClose={() => setPdf(false)}
        onGo={(t) => { setPdf(false); setTab(t); if (t === 'reports') setCompose((n) => n + 1); }} />}
      <StagePath project={record} busy={busy} onMove={moveStage} />
      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="rec-grid">
        <div className="rec-main">
          <div className="card">
            <div className="rec-tabs" role="tablist">
              {[['overview', 'Overview'], ['reports', `Status reports (${reports.length})`], ['sources', `Data sources (${(record.sources || []).length})`],
                ['billing', 'Billing'], ['details', 'Details'], ['activity', `Activity (${(record.activities || []).length})`]].map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>
            <div className="rec-body">
              {tab === 'overview' && <OverviewTab record={record} reports={reports} onReview={() => setTab('reports')} onReport={() => { setTab('reports'); setCompose((n) => n + 1); }} onAll={() => setTab('reports')} />}
              {tab === 'reports' && <StatusReports key={record.id} project={record} initial={reports} onChanged={refresh} composeSignal={compose} />}
              {tab === 'sources' && <SourcesTab project={record} onChanged={refresh} />}
              {tab === 'billing' && <BillingTab project={record} onChanged={refresh} />}
              {tab === 'details' && <DetailsView record={record} onSaved={refresh} />}
              {tab === 'activity' && <Activities key={record.updated_at} entityKey="projects" id={record.id} initial={record.activities} />}
            </div>
          </div>
        </div>

        <aside className="rec-side">
          <div className="card side-card">
            <div className="side-head">Related</div>
            <RelatedRow label="Client" value={record.company_id_name} onClick={() => open('companies', record.company_id)} empty="No client linked" />
            <RelatedRow label="Client contact" value={record.contact_id_name} onClick={() => open('contacts', record.contact_id)} empty="No contact linked" />
            <RelatedRow label="Won deal" value={record.opportunity_id_name} onClick={() => open('opportunities', record.opportunity_id)} empty="No deal linked" />
          </div>

          <Socials client={record.client} onEdit={() => open('companies', record.company_id)} />

          <OpenTasks project={record} tasks={openTasks} onChanged={refresh} />

          <div className="card side-card">
            <div className="side-head">Key dates</div>
            <dl className="kv">
              <dt>Start</dt><dd>{day(record.start_date) || '—'}</dd>
              <dt>Target end</dt><dd>{record.lifecycle === 'evergreen' ? <span className="muted">No set end</span> : day(record.target_end_date) || '—'}</dd>
              <dt>In stage since</dt><dd>{longDate(record.stage_changed_at) || '—'}</dd>
              <dt>Last report</dt><dd>{day(record.last_report_at) || '—'}</dd>
              <dt>Next report</dt><dd className={reportDue(record) ? 'overdue' : ''}>{day(record.next_report_date) || '—'}</dd>
              <dt>Cadence</dt><dd>{record.report_cadence ? optionLabel(F.report_cadence, record.report_cadence) : '—'}</dd>
            </dl>
          </div>

          <p className="muted meta" style={{ marginTop: 4 }}>Created {when(record.created_at)} · Updated {when(record.updated_at)}</p>
        </aside>
      </div>
    </div>
  );
}

function Crumbs({ go, name }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <button className="link" onClick={() => go('projects')}>Projects</button>
      <span aria-hidden="true">/</span>
      <span>{name}</span>
    </nav>
  );
}

function RelatedRow({ label, value, onClick, empty }) {
  return (
    <div className="rel-row">
      <div className="kicker">{label}</div>
      {value ? <button className="link" onClick={onClick}>{value}</button> : <span className="muted">{empty}</span>}
    </div>
  );
}

// Salesforce-style path: chevrons for the forward stages, a selected stage you
// can make current, "Mark stage complete" to advance, and park/close actions.
function StagePath({ project, busy, onMove }) {
  const stages = stagesFor(project.lifecycle);
  const main = stages.filter((s) => !s.side);
  const sides = stages.filter((s) => s.side);
  const current = stageInfo(project.lifecycle, project.stage);
  const idx = main.findIndex((s) => s.id === project.stage);
  const evergreen = project.lifecycle === 'evergreen';
  const [selected, setSelected] = React.useState(project.stage);
  React.useEffect(() => setSelected(project.stage), [project.stage]);

  const next = current?.side ? null
    : idx >= 0 && idx < main.length - 1 ? main[idx + 1]
      : evergreen && project.stage === 'periodic_review' ? main.find((s) => s.id === 'active') : null;
  const resume = current?.side && !current.closed ? main.find((s) => s.id === (evergreen ? 'active' : 'production')) || main[0] : null;
  const sel = stageInfo(project.lifecycle, selected);
  const tips = GUIDANCE[selected] || [];

  let primary = null;
  if (selected !== project.stage) primary = <button className="btn btn-primary" disabled={busy} onClick={() => onMove(selected)}>Mark as current stage</button>;
  else if (resume) primary = <button className="btn btn-primary" disabled={busy} onClick={() => onMove(resume.id)}>Resume ({resume.label})</button>;
  else if (next) {
    const label = evergreen && project.stage === 'periodic_review' ? 'Start next cycle' : 'Mark stage complete';
    primary = <button className="btn btn-primary" disabled={busy} onClick={() => onMove(next.id)}>✓ {label}</button>;
  }

  return (
    <section className="card path-card">
      <div className="path-row">
        <ol className={`path ${current?.side ? 'parked' : ''}`}>
          {main.map((s, i) => {
            const state = idx < 0 ? 'todo' : i < idx ? 'past' : i === idx ? 'now' : 'todo';
            return (
              <li key={s.id} className={`${state} ${selected === s.id ? 'sel' : ''}`}>
                <button type="button" onClick={() => setSelected(s.id)} aria-current={state === 'now' ? 'step' : undefined} title={s.label}>
                  {state === 'past' ? `✓ ${s.label}` : s.label}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="path-actions">{primary}</div>
      </div>

      <div className="path-foot">
        <div className="guidance">
          <div className="kicker">{sel?.label || selected}{selected === project.stage ? ' · current stage' : ''}</div>
          {tips.length > 0 && <ul>{tips.map((t) => <li key={t}>{t}</li>)}</ul>}
          {current?.side && (
            <div className="parked-note">{current.closed ? `This project is ${current.label.toLowerCase()}.` : `Parked: ${current.label}. Resume when it restarts.`}</div>
          )}
          {evergreen && !current?.side && <div className="muted hint">Evergreen: no end date. It cycles Active → Optimizing → Periodic review → Active until it ends.</div>}
        </div>
        <div className="side-states">
          {sides.filter((s) => s.id !== project.stage).map((s) => (
            <button key={s.id} type="button" className={`btn btn-small ${s.closed ? 'btn-danger' : ''}`} disabled={busy}
              onClick={() => { if (!s.closed || window.confirm(`Mark ${project.name} as ${s.label.toLowerCase()}?`)) onMove(s.id); }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewTab({ record, reports, onReport, onAll, onReview }) {
  const drafts = reports.filter((r) => r.status === 'draft');
  const finals = reports.filter((r) => r.status !== 'draft');
  const latest = finals[0];
  return (
    <>
      {drafts.length > 0 && (
        <div className="notice row-notice" style={{ margin: '0 0 18px' }}>
          <span style={{ flex: 1 }}>{drafts.length === 1 ? 'A draft status report is' : `${drafts.length} draft status reports are`} waiting for your review.</span>
          <button className="btn btn-small" onClick={onReview}>Review</button>
        </div>
      )}
      <div className="ov-head">
        <h3>Latest status report</h3>
        {finals.length > 1 && <button className="link" onClick={onAll}>View all {reports.length}</button>}
      </div>
      {!latest ? (
        <div className="empty-inline">
          <span className="muted">No status reports yet.{record.next_report_date ? ` First one due ${day(record.next_report_date)}.` : ''}</span>
          <button className="btn btn-small" onClick={onReport}>Write the first report</button>
        </div>
      ) : (
        <div className={`report-card big ${latest.health}`}>
          <div className="note-head">
            <strong>{day(latest.report_date)}</strong>
            <HealthPill health={latest.health} />
            {latest.stage && <span className="pill">{stageInfo(record.lifecycle, latest.stage)?.label || latest.stage}</span>}
            <span className="muted" style={{ marginLeft: 'auto', fontSize: 13 }}>{latest.author}</span>
          </div>
          <p className="lead-text">{latest.summary}</p>
          <div className="ov-cols">
            {latest.accomplishments && <div><div className="rlabel">Done</div><div className="pre">{latest.accomplishments}</div></div>}
            {latest.next_steps && <div><div className="rlabel">Next up</div><div className="pre">{latest.next_steps}</div></div>}
          </div>
          {latest.blockers && <><div className="rlabel blockers">Blockers</div><div className="pre">{latest.blockers}</div></>}
        </div>
      )}

      {finals.length > 1 && (
        <>
          <h3 className="ov-h">Health history</h3>
          <div className="trend">
            {finals.slice(0, 12).reverse().map((r) => (
              <div key={r.id} className={`trend-dot ${r.health}`} title={`${day(r.report_date)}: ${r.summary}`}>
                <i /><span>{new Date(`${r.report_date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="ov-h">Scope & goals</h3>
      {record.description ? <div className="pre">{record.description}</div> : <span className="muted">No scope written yet. Add it under Details.</span>}
    </>
  );
}

// Details: every field is edited on its own. Click the pencil (or double-click
// the value), change it, then Enter or ✓ saves; Esc or ✕ cancels.
function DetailsView({ record, onSaved }) {
  const { open } = useCrm();
  const [editing, setEditing] = React.useState(null);
  const visible = Object.fromEntries(fieldsFor('projects', record).map((f) => [f.key, f]));
  return (
    <>
      {SECTIONS.map((sec) => {
        const keys = sec.keys.filter((k) => visible[k]);
        return (
          <div key={sec.title} className="det-sec">
            <div className="det-title">{sec.title}</div>
            <dl className={`det-grid ${keys.length === 1 ? 'one' : ''}`}>
              {keys.map((k) => (editing === k
                ? <InlineEdit key={k} record={record} field={visible[k]} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); onSaved(); }} />
                : (
                  <div key={k} className="det-item" onDoubleClick={() => setEditing(k)} title="Double-click to edit">
                    <dt>{visible[k].label}</dt>
                    <dd><span className="dv">{valueOf(record, k, open)}</span><button className="pencil" onClick={() => setEditing(k)} aria-label={`Edit ${visible[k].label}`}>✎</button></dd>
                  </div>
                )))}
            </dl>
          </div>
        );
      })}
    </>
  );
}

function InlineEdit({ record, field, onCancel, onSaved }) {
  const [value, setValue] = React.useState(record[field.key] ?? '');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { ref.current?.querySelector('input, select, textarea')?.focus(); }, []);
  // Stage options follow the lifecycle being shown.
  const f = field.key === 'stage' ? { ...field, options: stagesFor(record.lifecycle) } : field;

  async function save(e) {
    e?.preventDefault();
    setBusy(true); setError('');
    try { await data('update', { entity: 'projects', id: record.id, values: { [field.key]: value } }); onSaved(); } catch (err) { setError(err.message); setBusy(false); }
  }
  function keys(e) {
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    if (e.key === 'Enter' && field.type !== 'textarea') { e.preventDefault(); save(); }
    if (e.key === 'Enter' && field.type === 'textarea' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
  }
  return (
    <form className={`det-item editing ${field.type === 'textarea' ? 'wide' : ''}`} onSubmit={save} onKeyDown={keys} ref={ref}>
      <dt><label htmlFor={`ie-${field.key}`}>{field.label}</label></dt>
      <dd className="ie">
        <div style={{ flex: 1, minWidth: 0 }}><FieldInput id={`ie-${field.key}`} field={f} value={value} onChange={setValue} /></div>
        <button className="ie-btn ok" disabled={busy} aria-label="Save">✓</button>
        <button type="button" className="ie-btn" onClick={onCancel} aria-label="Cancel">✕</button>
      </dd>
      {field.key === 'lifecycle' && <div className="hint">Switching lifecycle moves the project to the new lifecycle&rsquo;s first stage if its current stage doesn&rsquo;t exist there.</div>}
      {error && <div className="error" style={{ marginTop: 6 }}>{error}</div>}
    </form>
  );
}

function ClientLogo({ client, lifecycle }) {
  if (client?.logo_url) return <div className="rec-icon logo"><img src={client.logo_url} alt={`${client.name} logo`} /></div>;
  return <div className="rec-icon" aria-hidden="true">{lifecycle === 'evergreen' ? '∞' : 'P'}</div>;
}

const SOCIAL_LABELS = { instagram_url: 'Instagram', facebook_url: 'Facebook', tiktok_url: 'TikTok', linkedin_url: 'LinkedIn', youtube_url: 'YouTube', x_url: 'X' };
function Socials({ client, onEdit }) {
  if (!client) return null;
  const links = [['website', 'Website'], ...SOCIAL_FIELDS.map((k) => [k, SOCIAL_LABELS[k]])]
    .filter(([k]) => client[k]).map(([k, l]) => ({ l, href: /^https?:/.test(client[k]) ? client[k] : `https://${client[k]}` }));
  return (
    <div className="card side-card">
      <div className="side-head row">Website & socials <button className="link" onClick={onEdit}>Edit</button></div>
      {links.length === 0
        ? <div className="muted" style={{ fontSize: 14 }}>No profiles yet. Add them on the client record so Claude can review them for status reports.</div>
        : <div className="social-links">{links.map((x) => <a key={x.l} href={x.href} target="_blank" rel="noopener noreferrer">{x.l} ↗</a>)}</div>}
    </div>
  );
}

function SectionedFields({ form, setForm, hide = [] }) {
  const visible = Object.fromEntries(fieldsFor('projects', form).map((f) => [f.key, f]));
  return SECTIONS.map((sec) => {
    const fields = sec.keys.filter((k) => !hide.includes(k)).map((k) => visible[k]).filter(Boolean);
    return (
      <div key={sec.title} className="det-sec">
        <div className="det-title">{sec.title}</div>
        <div className="grid2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === 'textarea' ? 'span2' : ''}>
              <label className="label" htmlFor={`p-${f.key}`}>{f.label}{f.required ? ' *' : ''}</label>
              <FieldInput id={`p-${f.key}`} field={f} value={form[f.key]}
                onChange={(v) => setForm((p) => (f.key === 'lifecycle' ? withLifecycle({ ...p, lifecycle: v }, v, p.lifecycle) : { ...p, [f.key]: v }))} />
              {f.hint && <div className="hint">{f.hint}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  });
}

function OpenTasks({ project, tasks, onChanged }) {
  const [subject, setSubject] = React.useState('');
  const [due, setDue] = React.useState('');
  async function add(e) {
    e.preventDefault();
    if (!subject.trim()) return;
    await data('add_activity', { values: { entity_type: 'projects', entity_id: project.id, type: 'task', subject, due_date: due } });
    setSubject(''); setDue('');
    onChanged();
  }
  async function done(t) {
    await data('update_activity', { id: t.id, values: { completed: true } });
    onChanged();
  }
  return (
    <div className="card side-card">
      <div className="side-head">Open tasks ({tasks.length})</div>
      {tasks.length === 0 && <div className="muted" style={{ fontSize: 14 }}>Nothing open.</div>}
      {tasks.map((t) => (
        <label key={t.id} className="task-row">
          <input type="checkbox" onChange={() => done(t)} aria-label="Mark done" />
          <span>
            {t.subject || t.body}
            {t.due_date && <small className={t.due_date < today() ? 'overdue' : 'muted'}> · {day(t.due_date)}</small>}
          </span>
        </label>
      ))}
      <form onSubmit={add} className="task-add">
        <input className="field" placeholder="Add a task…" aria-label="New task" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="field" type="date" aria-label="Due date" value={due} onChange={(e) => setDue(e.target.value)} />
        <button className="btn btn-small" disabled={!subject.trim()}>Add</button>
      </form>
    </div>
  );
}

// ── New project ─────────────────────────────────────────────────────────────

function NewProject({ preset }) {
  const { me, open, go, changed } = useCrm();
  const [form, setForm] = React.useState(() => {
    const base = Object.fromEntries(E.fields.map((f) => [f.key, f.default ?? '']));
    const merged = { ...base, start_date: today(), report_cadence: 'weekly', owner_id: me.id, ...(preset || {}) };
    return withLifecycle(merged, merged.lifecycle);
  });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { document.title = 'New project | Loogo CRM'; return () => { document.title = 'Loogo CRM'; }; }, []);

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const row = await data('create', { entity: 'projects', values: form });
      changed();
      open('projects', row.id);
    } catch (err) { setError(err.message); setBusy(false); }
  }

  const life = PROJECT_LIFECYCLES.find((l) => l.id === form.lifecycle) || PROJECT_LIFECYCLES[0];
  return (
    <div className="rec">
      <Crumbs go={go} name="New project" />
      <form onSubmit={save}>
        <section className="card rec-head">
          <div className="rec-title">
            <div className="rec-icon" aria-hidden="true">+</div>
            <div style={{ flex: 1 }}>
              <div className="kicker">Project</div>
              <h1>New project</h1>
            </div>
          </div>
          <div className="life-pick" role="radiogroup" aria-label="Lifecycle">
            {PROJECT_LIFECYCLES.map((l) => (
              <button type="button" key={l.id} role="radio" aria-checked={form.lifecycle === l.id} className={`life-opt ${form.lifecycle === l.id ? 'on' : ''}`}
                onClick={() => setForm((p) => withLifecycle({ ...p, lifecycle: l.id }, l.id, p.lifecycle))}>
                <strong>{l.id === 'evergreen' ? '∞ ' : ''}{l.label}</strong>
                <span>{l.hint}</span>
                <small>{stagesFor(l.id).filter((s) => !s.side).map((s) => s.label).join(' → ')}</small>
              </button>
            ))}
          </div>
        </section>
        <section className="card rec-body" style={{ marginTop: 16 }}>
          <SectionedFields form={form} setForm={setForm} hide={['lifecycle']} />
          {error && <div className="error">{error}</div>}
          <div className="savebar">
            <button type="button" className="btn" onClick={() => go('projects')}>Cancel</button>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : `Create ${life.label.toLowerCase()} project`}</button>
          </div>
        </section>
      </form>
    </div>
  );
}
