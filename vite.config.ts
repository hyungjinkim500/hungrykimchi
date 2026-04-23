import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      devOptions: {
        enabled: true
      },
      filename: 'sw.js',
      includeAssets: ['kimchi_level5_nb.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '헝그리김치',
        short_name: '헝그리김치',
        description: '해외 거주 한인을 위한 한인업체 지도맵 & 전화번호부',
        theme_color: '#FFFFFF',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'ko',
        id: 'com.hungrykimchi.app',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/altdvxekugatmewftlus\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          },
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-maps-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }
        ]
      }
    })
  ]
})
