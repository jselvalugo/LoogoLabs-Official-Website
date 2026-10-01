// Build-time renderer: scripts/generate-seo-assets.mjs calls render(path) for
// each marketing route and writes the result into that route's HTML file, so
// the page's full copy is in the markup before any JavaScript runs.
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import App from './App';

export function render(path) {
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, cb) { html += chunk; cb(); },
      final(cb) { resolve(html); cb(); },
    });
    // onAllReady waits for the React.lazy pages, which renderToString would
    // leave as their empty Suspense fallback.
    const stream = renderToPipeableStream(
      <React.StrictMode><App initialPath={path} /></React.StrictMode>,
      { onAllReady() { stream.pipe(sink); }, onShellError: reject, onError: reject },
    );
  });
}
