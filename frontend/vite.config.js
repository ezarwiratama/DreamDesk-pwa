// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DreamDesk App',
        short_name: 'DreamDesk',
        description: 'Best Desk Setup E-commerce',
        theme_color: '#800000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/vite.svg', // Ganti dengan iconmu nanti ukuran 192x192
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})