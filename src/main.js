import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // Atau fail tailwind CSS anda

// TAMBAHAN BAHARU: Import fungsi pendaftaran PWA
import { registerSW } from 'virtual:pwa-register'

// Arahkan sistem supaya Auto-Reload apabila ada kemaskini
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("Versi baharu PWA dikesan. Sedang memuat semula...");
    window.location.reload(true); // Memaksa browser muat semula aplikasi
  },
  onOfflineReady() {
    console.log("Sistem sedia digunakan secara offline.");
  },
})

const app = createApp(App)
app.use(router)
app.mount('#app')