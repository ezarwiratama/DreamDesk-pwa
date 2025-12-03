import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css'
// Import registerSW dari virtual module vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'

// Setup auto-refresh ketika ada update service worker baru
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Konten baru tersedia. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App siap bekerja offline! 🚀');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)