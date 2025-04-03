
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
