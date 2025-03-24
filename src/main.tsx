
// Import title manager first to ensure it runs early
import './utils/titleManager';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Force title immediately 
document.title = "DEADPUNCH";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Force title again after render
document.title = "DEADPUNCH";
