const TOKEN_KEY = 'll_crm_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

// POST { action, ...data } to a CRM function. Throws with the server's message on failure;
// a 401 clears the stored session so the app falls back to the sign-in screen.
export async function call(fn, action, data = {}) {
  const token = getToken();
  const res = await fetch(`/.netlify/functions/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ action, ...data }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401 && action !== 'login') { setToken(null); window.dispatchEvent(new Event('crm:signed-out')); }
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export const data = (action, payload) => call('crm-data', action, payload);
