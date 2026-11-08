import React from 'react';
import { data } from './api';
import { useCrm } from './ctx';
import { ACTIVITY_TYPES, ENTITIES, PROJECT_LIFECYCLES, optionLabel, stageInfo, stagesFor } from './entities';
import { day, when } from './report';

// Form inputs and the activity timeline, shared by the record drawer (App.jsx)
// and full record pages (Projects.jsx).

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const refCache = {};
export function useOptions(entityKey) {
  const { version } = useCrm();
  const [opts, setOpts] = React.useState(refCache[entityKey] || []);
  React.useEffect(() => {
    data('list', { entity: entityKey, limit: 500, sort: 'name:asc' })
      .then((r) => { refCache[entityKey] = r.records.map((x) => ({ id: x.id, name: x.name })); setOpts(refCache[entityKey]); })
      .catch(() => {});
  }, [entityKey, version]);
  return opts;
}

export function RefSelect({ field, value, onChange, id }) {
  const options = useOptions(field.to);
  return (
    <select id={id} className="field" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">—</option>
      {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  );
}

export function FieldInput({ field, value, onChange, id }) {
  const { team } = useCrm();
  const set = (e) => onChange(e.target.value);
  const v = value ?? '';
  switch (field.type) {
    case 'textarea': return <textarea id={id} className="field" rows={3} value={v} onChange={set} />;
    case 'select':
      return (
        <select id={id} className="field" value={v} onChange={set}>
          {!field.default && <option value="">—</option>}
          {field.options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      );
    case 'ref': return <RefSelect id={id} field={field} value={v} onChange={onChange} />;
    case 'user':
      return (
        <select id={id} className="field" value={v} onChange={set}>
          <option value="">—</option>
          {team.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
        </select>
      );
    case 'number': case 'money': case 'percent': return <input id={id} className="field" inputMode="decimal" value={v} onChange={set} />;
    case 'date': return <input id={id} className="field" type="date" value={v ? String(v).slice(0, 10) : ''} onChange={set} />;
    case 'email': return <input id={id} className="field" type="email" value={v} onChange={set} />;
    case 'url': return <input id={id} className="field" type="url" placeholder="https://" value={v} onChange={set} />;
    default: return <input id={id} className="field" value={v} onChange={set} required={field.required} />;
  }
}

export const HALF = new Set(['text', 'email', 'phone', 'url', 'number', 'money', 'percent', 'date', 'select', 'ref', 'user']);

// Projects: the Stage options follow the Lifecycle, and evergreen work has no
// target end date.
export function fieldsFor(entityKey, form) {
  const e = ENTITIES[entityKey];
  if (entityKey !== 'projects') return e.fields;
  const life = PROJECT_LIFECYCLES.find((l) => l.id === form.lifecycle) || PROJECT_LIFECYCLES[0];
  return e.fields
    .filter((f) => !(f.key === 'target_end_date' && form.lifecycle === 'evergreen'))
    .map((f) => (f.key === 'stage' ? { ...f, options: stagesFor(form.lifecycle) }
      : f.key === 'lifecycle' ? { ...f, hint: life.hint } : f));
}

// When the lifecycle changes, keep the stage if it still fits, else start at the
// new lifecycle's first stage, and switch the report cadence to its default.
export function withLifecycle(form, lifecycle, previous) {
  const next = { ...form };
  if (!stageInfo(lifecycle, next.stage)) next.stage = stagesFor(lifecycle)[0].id;
  const was = PROJECT_LIFECYCLES.find((l) => l.id === previous);
  const now = PROJECT_LIFECYCLES.find((l) => l.id === lifecycle);
  if (now && (!next.report_cadence || (was && next.report_cadence === was.cadence))) next.report_cadence = now.cadence;
  if (lifecycle === 'evergreen') next.target_end_date = '';
  return next;
}

// ── Activities ──────────────────────────────────────────────────────────────

export function Activities({ entityKey, id, initial }) {
  const { changed } = useCrm();
  const [items, setItems] = React.useState(initial || []);
  const [type, setType] = React.useState('note');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [due, setDue] = React.useState('');
  const [error, setError] = React.useState('');

  async function add(e) {
    e.preventDefault();
    setError('');
    try {
      const row = await data('add_activity', { values: { entity_type: entityKey, entity_id: id, type, subject, body, due_date: due } });
      setItems((p) => [row, ...p]);
      setSubject(''); setBody(''); setDue('');
      changed();
    } catch (err) { setError(err.message); }
  }

  async function toggle(a) {
    const row = await data('update_activity', { id: a.id, values: { completed: !a.completed_at } });
    setItems((p) => p.map((x) => (x.id === a.id ? row : x)));
    changed();
  }

  async function remove(a) {
    if (!window.confirm('Delete this activity?')) return;
    await data('delete_activity', { id: a.id });
    setItems((p) => p.filter((x) => x.id !== a.id));
    changed();
  }

  const scheduled = type === 'task' || type === 'meeting';
  return (
    <>
      <div className="section">Activity</div>
      <form onSubmit={add} className="composer">
        <div className="tabs">
          {ACTIVITY_TYPES.map((t) => <button type="button" key={t.id} className={type === t.id ? 'on' : ''} onClick={() => setType(t.id)}>{t.label}</button>)}
        </div>
        {type !== 'note' && <input className="field" placeholder={type === 'task' ? 'What needs doing?' : 'Subject'} aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />}
        <textarea className="field" rows={3} placeholder={type === 'note' ? 'Add a note…' : 'Details'} aria-label="Details" value={body} onChange={(e) => setBody(e.target.value)} />
        {scheduled && <input className="field" type="date" aria-label="Due date" value={due} onChange={(e) => setDue(e.target.value)} />}
        {error && <div className="error">{error}</div>}
        <div className="actions" style={{ marginTop: 8 }}><button className="btn">{type === 'task' ? 'Add task' : `Log ${type}`}</button></div>
      </form>
      {items.map((a) => (
        <div key={a.id} className="note">
          <div className="note-head">
            {a.type === 'task' && <input type="checkbox" checked={!!a.completed_at} onChange={() => toggle(a)} aria-label="Done" />}
            <span className="pill">{optionLabel({ options: ACTIVITY_TYPES }, a.type)}</span>
            <strong className={a.type === 'task' && a.completed_at ? 'done' : ''}>{a.subject}</strong>
            <button className="link danger" onClick={() => remove(a)} aria-label="Delete activity">Delete</button>
          </div>
          {a.body && <div className="pre">{a.body}</div>}
          <small>
            {a.author || 'Removed user'} · {when(a.created_at)}
            {a.due_date && <> · <span className={!a.completed_at && a.due_date < today() ? 'overdue' : ''}>due {day(a.due_date)}</span></>}
            {a.owner_id_name && a.type === 'task' && <> · assigned to {a.owner_id_name}</>}
          </small>
        </div>
      ))}
    </>
  );
}

