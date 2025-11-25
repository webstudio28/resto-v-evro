import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'resto26',
        short_name: 'resto26',
        description: 'Offline-first euro transition calculator for Bulgarian retailers with dual currency input and change breakdown.',
        start_url: '/',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen'],
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#002855',
        lang: 'bg',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          {
            name: 'New calculation',
            short_name: 'New calc',
            description: 'Reset inputs for a new transaction',
            url: '/?reset=true',
            icons: [
              { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            ],
          },
        ],
      },
    }),
  ],
})
