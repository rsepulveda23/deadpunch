
/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the React application.
 * It renders the root App component into the DOM.
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a React root and render the App component
createRoot(document.getElementById("root")!).render(<App />);

// Apply theme class based on time
const updateThemeClass = () => {
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;
  document.documentElement.classList.remove('theme-day', 'theme-night');
  document.documentElement.classList.add(isDaytime ? 'theme-day' : 'theme-night');
};

// Set theme class immediately and update every minute
updateThemeClass();
setInterval(updateThemeClass, 60000);
