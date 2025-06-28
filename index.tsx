import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure process.env exists, especially in browser environments without a build step
if (typeof process === 'undefined') {
  // @ts-ignore
  window.process = { env: {} };
} else if (typeof process.env === 'undefined') {
  // @ts-ignore
  process.env = {};
}

// Initialize process.env.API_KEY if not already set by the environment
// THIS IS A SIMPLIFIED APPROACH. 
// IN A REAL APP, API KEYS SHOULD NOT BE HARDCODED.
if (!process.env.API_KEY) {
  // console.warn("API_KEY is not set. Using a placeholder. Please set your API_KEY in your environment or a .env file.");
  process.env.API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with a valid key or ensure it's set in the environment
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);