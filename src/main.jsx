import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SafetyProvider } from './context/SafetyContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SafetyProvider>
      <App />
    </SafetyProvider>
  </React.StrictMode>,
);
