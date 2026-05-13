<template>
  <div class="min-h-screen bg-[#F4F5F4] flex flex-col px-6 pt-12 font-sans text-gray-900">
    
    <header class="flex items-center mb-8">
      <button @click="$router.push('/login')" class="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-900 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
    </header>

    <div class="mb-10 max-w-sm mx-auto w-full text-center">
      <div class="w-20 h-20 bg-teal-100 rounded-[24px] flex items-center justify-center text-4xl mx-auto mb-6">🔑</div>
      <h1 class="text-[32px] font-bold tracking-tight text-gray-900 leading-tight">Reset Akses</h1>
      <p class="text-sm text-gray-600 mt-3 font-medium px-2">
        Masukkan e-mel anda dan kami akan menghantar pautan untuk menetapkan semula kata laluan.
      </p>
    </div>

    <div class="max-w-sm mx-auto w-full space-y-6">
      <input v-model="email" type="email" class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" placeholder="E-mel Rasmi" />
      
      <button @click="handleReset" class="w-full bg-teal-700 text-white font-bold text-lg py-4 rounded-full active:scale-95 transition-all shadow-md tracking-tight">
        Hantar Pautan
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/axios'

const email = ref('')

const handleReset = async () => {
  if (!email.value) return alert("Sila masukkan e-mel anda.")
  try {
    const response = await api.post('/auth/forgot-password', { email: email.value })
    alert(response.data.message)
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghantar e-mel reset.')
  }
}
</script>