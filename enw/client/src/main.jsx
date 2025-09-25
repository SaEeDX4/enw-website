import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import {
  measureWebVitals,
  observePerformance,
} from './utils/performance/metrics.js';

// Import global styles
import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';

// Initialize performance monitoring
if (import.meta.env.PROD) {
  observePerformance();

  measureWebVitals((metric) => {
    // Log to console in development, send to analytics in production
    console.log(metric);

    // In production, you would send to your analytics service:
    // analytics.track('Web Vital', metric);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
