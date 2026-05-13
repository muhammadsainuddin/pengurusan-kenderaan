
import axios from 'axios'
import { globalState } from '../store' // Import state yang kita baru buat

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Pastikan baseURL anda betul
  //baseURL: 'https://kenderaan.msdev.com.my/api',
})

// ==========================================
// 1. REQUEST INTERCEPTOR (Semasa Mula Panggil API)
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Tambah kiraan dan hidupkan loading
    globalState.requestCount++
    globalState.isLoading = true

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    globalState.requestCount--
    if (globalState.requestCount <= 0) {
      globalState.requestCount = 0
      globalState.isLoading = false
    }
    return Promise.reject(error)
  }
)

// ==========================================
// 2. RESPONSE INTERCEPTOR (Apabila Selesai / Gagal)
// ==========================================
api.interceptors.response.use(
  (response) => {
    // Kurangkan kiraan dan matikan loading jika semua selesai
    globalState.requestCount--
    if (globalState.requestCount <= 0) {
      globalState.requestCount = 0
      globalState.isLoading = false
    }
    return response
  },
  (error) => {
    // Tetap matikan loading walaupun API ralat
    globalState.requestCount--
    if (globalState.requestCount <= 0) {
      globalState.requestCount = 0
      globalState.isLoading = false
    }

    // Auto-Logout jika Token Expired (401)
    if (error.response && error.response.status === 401) {
      console.warn("Sesi log masuk telah tamat. Log keluar secara automatik.")
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api