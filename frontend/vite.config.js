import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
        name: 'DreamDesk',
        short_name: 'DreamDesk',
        theme_color: '#800000',
        icons: [
            {
                src: 'pwa-192x192.png', // Pastikan kamu punya icon di folder public
                sizes: '192x192',
                type: 'image/png'
            }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})