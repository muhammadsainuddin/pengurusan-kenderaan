<template>
  <div class="min-h-screen bg-[#F4F5F4] flex flex-col px-6 pt-20 font-sans text-gray-900">
    
    <div class="flex justify-center mb-8">
      <div class="w-24 h-24 bg-teal-100 rounded-[28px] shadow-sm flex items-center justify-center text-5xl">
        🚗
      </div>
    </div>

    <div class="text-center mb-10 max-w-sm mx-auto w-full">
      <p class="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">AIGEO SYSTEM</p>
      <h1 class="text-[32px] font-bold tracking-tight text-gray-900">Log Masuk</h1>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4 max-w-sm mx-auto w-full">
      
      <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-lg text-center animate-fade-in">
        {{ errorMsg }}
      </div>

      <input 
        v-model="form.email" 
        type="email" 
        required
        class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" 
        placeholder="E-mel Rasmi" 
      />
      
      <input 
        v-model="form.password" 
        type="password" 
        required
        class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" 
        placeholder="Kata Laluan" 
      />
      
      <div class="text-right mt-2">
        <router-link to="/lupa-kata-laluan" class="text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors">Lupa kata laluan?</router-link>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading"
        :class="['w-full text-white font-bold text-lg py-4 rounded-full mt-6 shadow-md tracking-tight flex items-center justify-center gap-2 transition-all', isLoading ? 'bg-gray-400 cursor-wait' : 'bg-teal-700 hover:bg-teal-800 active:scale-95']"
      >
        <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ isLoading ? 'Memproses...' : 'Log Masuk' }}
      </button>
    </form>

    <div class="mt-auto pb-12 text-center">
      <p class="text-sm text-gray-600 font-medium">
        Tiada akaun? 
        <router-link to="/register" class="text-teal-700 font-bold hover:underline">Daftar sekarang</router-link>
      </p>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ email: '', password: '' })
const errorMsg = ref('')
const isLoading = ref(false)

// ==========================================
// SEMAK JIKA PENGGUNA SUDAH LOG MASUK
// ==========================================
onMounted(() => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      // Halakan pengguna terus ke dashboard mengikut jenis akses
      if (user.role === 'Admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

// ==========================================
// FUNGSI LOG MASUK
// ==========================================
const handleLogin = async () => {
  if (!form.email || !form.password) {
    errorMsg.value = "Sila isi e-mel dan kata laluan"
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const response = await api.post('/auth/login', form)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    // Semak 'role' untuk halakan ke halaman yang betul
    if (response.data.user.role === 'Admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Gagal log masuk. Sila semak semula e-mel atau kata laluan anda.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>