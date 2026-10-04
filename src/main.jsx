import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/eb-garamond/latin-500.css';
import './styles/globals.css';
import App from './App';
import { startSessionTracking } from './lib/sessionTracker';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Pages the build rendered with React (see src/entry-server.jsx) are hydrated so
// the markup a crawler read is the markup the visitor keeps. Everything else —
// posts and the blog index, whose content comes from the database — ships a
// plain fallback that React replaces.
if (root.hasAttribute('data-ssr')) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);

startSessionTracking();
