// One fetch of the published post list per visit, shared by the blog index,
// category pages and the "Keep reading" block on posts.
let cache = null;
let pending = null;

export const cachedPosts = () => cache;

export function loadPosts() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch('/.netlify/functions/get-posts')
      .then((r) => r.json())
      .then((data) => { cache = Array.isArray(data) ? data : []; return cache; })
      .catch(() => { pending = null; return []; });
  }
  return pending;
}
