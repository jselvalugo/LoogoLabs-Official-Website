import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `vite preview` answers /mission and any unknown URL with dist/index.html — the
// pre-rendered Home page — so the client hydrated Home's markup as another page
// and threw hydration errors. Serve files the way Netlify does instead: a route's
// own .html file, the app shell for /news/* (see netlify.toml), else 404.html.
function netlifyLikePreview() {
  return {
    name: 'netlify-like-preview',
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const [pathname, query = ''] = req.url.split('?');
        const path = decodeURIComponent(pathname);
        if (path === '/' || /\.[a-z0-9]+$/i.test(path)) return next();
        const page = join(dist, `${path.replace(/\/$/, '')}.html`);
        if (page.startsWith(dist) && existsSync(page)) {
          req.url = `${path.replace(/\/$/, '')}.html${query ? `?${query}` : ''}`;
          return next();
        }
        if (path.startsWith('/news/')) { req.url = '/index.html'; return next(); }
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(join(dist, '404.html')));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyLikePreview()],
});
