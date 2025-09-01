import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Configure axios base URL from Vite env
// In dev, set VITE_API_URL to your backend (e.g., http://localhost:5000)
// In production (Vercel), set VITE_API_URL in the project Environment Variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/'
// If your backend uses cookies/sessions, enable credentials
axios.defaults.withCredentials = true

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
)
