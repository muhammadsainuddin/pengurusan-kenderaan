import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      
      // TAMBAHAN BAHARU: Memaksa pembersihan cache lama
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },

      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Aigeo Kenderaan',
        short_name: 'Aigeo',
        description: 'Sistem Pengurusan Kenderaan dan Bot',
        theme_color: '#0f766e',
        background_color: '#F4F5F4',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/launchericon-48x48.png', sizes: '48x48', type: 'image/png' },
          { src: '/launchericon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/launchericon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/launchericon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/launchericon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/launchericon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
})