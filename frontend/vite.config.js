import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // Aset tambahan
      manifest: {
        name: 'DreamDesk',
        short_name: 'DreamDesk',
        description: 'E-commerce desk setup impian Anda',
        theme_color: '#800000',
        background_color: '#f8f9fa',
        display: 'standalone',
        icons: [
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
      },
      // --- KONFIGURASI SERVICE WORKER (WORKBOX) ---
      workbox: {
        // 1. Precache file statis (CSS, JS, HTML, Gambar lokal)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        
        // 2. Runtime Caching (Untuk API dan Gambar Eksternal)
        runtimeCaching: [
          {
            // Cache untuk request ke API Backend (/api/products, dll)
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst', // Coba ambil data terbaru, jika offline pakai cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 5 // Cache bertahan 5 hari
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache untuk Gambar Eksternal (Unsplash, dll)
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst', // Utamakan cache agar hemat kuota & cepat
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache gambar 30 hari
              }
            }
          },
          {
            // Cache untuk Font (Google Fonts, dll)
            urlPattern: ({ url }) => url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 tahun
              }
            }
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