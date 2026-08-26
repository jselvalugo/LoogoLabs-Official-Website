import React from 'react';
import { apiFetch } from '../../lib/identity';

const POST_STATUSES = ['draft', 'published', 'archived'];
const FILTERS = ['all', ...POST_STATUSES];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BlogAdmin() {
  const [tab, setTab] = React.useState('posts');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ padding: '20px 32px 0', borderBottom: '1px solid var(--border-hair)', flexShrink: 0, background: 'var(--paper-100)' }}>
        <h1 style={{ margin: '0 0 16px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Signal Blog</h1>
        <div style={{ display: 'flex', gap: 0 }}>
          {[['posts', 'Posts'], ['analytics', 'Analytics']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14,
                fontWeight: tab === id ? 600 : 400, color: tab === id ? 'var(--ink-900)' : 'var(--ink-400)',
                borderBottom: tab === id ? '2px solid var(--ink-900)' : '2px solid transparent', marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {tab === 'posts' ? <PostsTab /> : <AnalyticsTab />}
      </div>
    </div>
  );
}

// ─── Posts Tab ─────────────────────────────────────────────────────────────────

function PostsTab() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(null);
  const [creating, setCreating] = React.useState(false);

  async function fetchPosts() {
    const res = await apiFetch('/.netlify/functions/get-posts');
    const data = await res?.json();
    if (Array.isArray(data)) setPosts(data);
    setLoading(false);
  }

  React.useEffect(() => { fetchPosts(); }, []);

  const visible = filter === 'all' ? posts : posts.filter(p => p.status === filter);
  const selected = posts.find(p => p.id === selectedId) || null;
  const countFor = f => f === 'all' ? posts.length : posts.filter(p => p.status === f).length;
  const showPanel = selected || creating;

  async function savePost(data) {
    if (creating) {
      const res = await apiFetch('/.netlify/functions/create-post', { method: 'POST', body: JSON.stringify(data) });
      const post = await res?.json();
      if (post?.id) { setPosts(prev => [post, ...prev]); setCreating(false); setSelectedId(post.id); }
    } else {
      const res = await apiFetch('/.netlify/functions/update-post', { method: 'PATCH', body: JSON.stringify({ id: selectedId, ...data }) });
      const updated = await res?.json();
      if (updated?.id) setPosts(prev => prev.map(p => p.id === selectedId ? updated : p));
    }
  }

  async function deletePost(id) {
    await apiFetch('/.netlify/functions/delete-post', { method: 'DELETE', body: JSON.stringify({ id }) });
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedId(null);
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* List panel */}
      <div style={{ flex: showPanel ? '0 0 52%' : '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: showPanel ? '1px solid var(--border-hair)' : 'none' }}>
        <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-hair)', flex: 1 }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
                    fontWeight: filter === f ? 600 : 400, color: filter === f ? 'var(--ink-900)' : 'var(--ink-400)',
                    borderBottom: filter === f ? '2px solid var(--ink-900)' : '2px solid transparent', marginBottom: -1 }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span style={{ marginLeft: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-300)' }}>{countFor(f)}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { setCreating(true); setSelectedId(null); }}
              style={{ marginLeft: 16, padding: '8px 16px', background: 'var(--ink-900)', color: 'var(--paper-100)', border: 'none', borderRadius: 'var(--radius-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
              + New post
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: '32px 28px', color: 'var(--ink-400)', fontSize: 13 }}>No posts with this status.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--paper-100)', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  {['Title', 'Status', 'Views', 'Date'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(post => (
                  <PostRow key={post.id} post={post}
                    selected={post.id === selectedId && !creating}
                    onClick={() => { setSelectedId(post.id); setCreating(false); }} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Editor panel */}
      {showPanel && (
        <div style={{ flex: '0 0 48%', overflowY: 'auto', background: 'var(--paper-000)', borderLeft: '1px solid var(--border-hair)' }}>
          <PostEditor
            key={creating ? 'new' : selectedId}
            post={creating ? null : selected}
            onSave={savePost}
            onDelete={creating ? null : deletePost}
            onClose={() => { setCreating(false); setSelectedId(null); }}
          />
        </div>
      )}
    </div>
  );
}

function PostRow({ post, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <tr onClick={onClick} style={{ borderBottom: '1px solid var(--border-hair)', cursor: 'pointer', background: selected || hover ? 'var(--paper-200)' : 'transparent' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <td style={tdStyle}>
        <div style={{ fontWeight: 500 }}>{post.title}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{post.slug}</div>
      </td>
      <td style={tdStyle}><StatusPill status={post.status} /></td>
      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>{post.views}</td>
      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>{formatDate(post.published_at || post.created_at)}</td>
    </tr>
  );
}

function PostEditor({ post, onSave, onDelete, onClose }) {
  const [title, setTitle] = React.useState(post?.title || '');
  const [slug, setSlug] = React.useState(post?.slug || '');
  const [excerpt, setExcerpt] = React.useState(post?.excerpt || '');
  const [content, setContent] = React.useState(post?.content || '');
  const [tags, setTags] = React.useState(post?.tags || '');
  const [status, setStatus] = React.useState(post?.status || 'draft');
  const [readTime, setReadTime] = React.useState(post?.read_time || 5);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [slugManual, setSlugManual] = React.useState(!!post);

  function handleTitleChange(val) {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ title, slug, excerpt, content, tags, status, read_time: Number(readTime) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: '24px 28px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          {post ? 'Edit Post' : 'New Post'}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-400)', lineHeight: 1, padding: 4 }}>×</button>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        <EditorField label="Title">
          <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" style={inputStyle} />
        </EditorField>

        <EditorField label="Slug">
          <input value={slug} onChange={e => { setSlug(e.target.value); setSlugManual(true); }} placeholder="url-slug" style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 13 }} />
        </EditorField>

        <EditorField label="Excerpt (one sentence)">
          <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="The sharpest sentence from the first paragraph." style={inputStyle} />
        </EditorField>

        <EditorField label="Content (Markdown)">
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={18} placeholder="Write in Markdown. ## Heading, **bold**, *italic*, `code`, > blockquote" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontFamily: 'var(--font-mono)', fontSize: 13 }} />
        </EditorField>

        <EditorField label="Tags (comma-separated)">
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="AI Operations, Reporting, Data Quality" style={inputStyle} />
        </EditorField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <EditorField label="Status">
            <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
              {POST_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </EditorField>
          <EditorField label="Read Time (min)">
            <input type="number" value={readTime} onChange={e => setReadTime(e.target.value)} min={1} style={inputStyle} />
          </EditorField>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
          <button onClick={handleSave} disabled={saving || !title || !slug}
            style={{ padding: '10px 20px', background: saving || !title || !slug ? 'var(--ink-400)' : 'var(--ink-900)', color: 'var(--paper-100)', border: 'none', borderRadius: 'var(--radius-2)', fontSize: 14, fontWeight: 600, cursor: saving || !title || !slug ? 'default' : 'pointer', fontFamily: 'var(--font-body)' }}>
            {saving ? 'Saving…' : post ? 'Save changes' : 'Publish post'}
          </button>
          {saved && <span style={{ fontSize: 13, color: '#065F46', fontFamily: 'var(--font-mono)' }}>✓ Saved</span>}
        </div>

        {onDelete && (
          <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 20, marginTop: 8 }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                style={{ padding: '8px 16px', background: 'none', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#DC2626' }}>
                Delete post
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-600)' }}>Are you sure?</span>
                <button onClick={() => onDelete(post.id)}
                  style={{ padding: '8px 14px', background: '#DC2626', border: 'none', borderRadius: 'var(--radius-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#fff' }}>
                  Yes, delete
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  style={{ padding: '8px 14px', background: 'none', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--ink-600)' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Analytics Tab ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const [posts, setPosts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/get-posts')
      .then(r => r?.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px 32px', color: 'var(--ink-400)', fontSize: 13 }}>Loading…</div>;

  const published = (posts || []).filter(p => p.status === 'published');
  const drafts = (posts || []).filter(p => p.status === 'draft');
  const totalViews = (posts || []).reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const topPosts = [...(posts || [])].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)).slice(0, 10);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Total posts', value: (posts || []).length },
          { label: 'Published', value: published.length, accent: true },
          { label: 'Drafts', value: drafts.length },
          { label: 'Total views', value: totalViews },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 8, color: accent ? 'var(--cyan-700)' : 'var(--ink-900)' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-hair)' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Top posts by views</span>
        </div>
        {topPosts.length === 0 ? (
          <div style={{ padding: '32px 22px', color: 'var(--ink-400)', fontSize: 13, textAlign: 'center' }}>No posts yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--paper-200)' }}>
                {['Title', 'Status', 'Views', 'Published'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPosts.map(post => (
                <tr key={post.id} style={{ borderTop: '1px solid var(--border-hair)' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{post.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{post.slug}</div>
                  </td>
                  <td style={tdStyle}><StatusPill status={post.status} /></td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: Number(post.views) > 0 ? 'var(--cyan-700)' : 'var(--ink-400)' }}>
                    {post.views || 0}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)' }}>{formatDate(post.published_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Shared ────────────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const colors = { published: { bg: 'rgba(47,208,126,0.12)', color: '#065F46', border: 'rgba(47,208,126,0.3)' }, draft: { bg: 'rgba(90,100,120,0.1)', color: 'var(--ink-500)', border: 'var(--border-hair)' }, archived: { bg: 'rgba(255,74,61,0.08)', color: '#991B1B', border: 'rgba(255,74,61,0.2)' } };
  const c = colors[status] || colors.draft;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--radius-1)', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {status}
    </span>
  );
}

function EditorField({ label, children }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { padding: '9px 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', fontSize: 14, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-900)', width: '100%', boxSizing: 'border-box' };
const thStyle = { padding: '10px 22px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', fontWeight: 500 };
const tdStyle = { padding: '13px 22px', fontSize: 13, color: 'var(--ink-900)', verticalAlign: 'middle' };
