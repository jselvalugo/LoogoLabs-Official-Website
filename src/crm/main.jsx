import React from 'react';
import ReactDOM from 'react-dom/client';
import './crm.css';
import App from './App';
import Share, { shareRoute } from './Share';

// Client share links (/portal/<token>, /recap/<token>) skip the CRM sign-in.
const route = shareRoute();
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>{route ? <Share route={route} /> : <App />}</React.StrictMode>);
