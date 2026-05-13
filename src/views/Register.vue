<template>
  <div class="min-h-screen bg-[#F4F5F4] flex flex-col px-6 pt-12 font-sans text-gray-900 pb-10">
    
    <header class="flex items-center mb-8">
      <button @click="$router.push('/login')" class="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-900 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
    </header>

    <div class="mb-10 max-w-sm mx-auto w-full">
      <p class="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">AIGEO SYSTEM</p>
      <h1 class="text-[32px] font-bold tracking-tight text-gray-900 leading-tight">Daftar Akaun</h1>
      <p class="text-sm text-gray-600 mt-2 font-medium">Sila lengkapkan profil rasmi anda.</p>
    </div>

    <div class="space-y-4 max-w-sm mx-auto w-full">
      <input v-model="form.name" type="text" class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" placeholder="Nama Penuh" />
      <input v-model="form.email" type="email" class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" placeholder="E-mel Rasmi" />
      
      <div class="relative">
        <span class="absolute -top-2 left-3 bg-[#F4F5F4] px-1 text-[10px] font-bold text-teal-700 uppercase tracking-wider">Stesen / Jabatan</span>
        <input v-model="form.negeri" type="text" readonly class="w-full bg-gray-200/50 border border-gray-300 rounded-[4px] px-4 py-4 text-gray-600 outline-none font-bold cursor-not-allowed" />
      </div>
      
      <input v-model="form.password" type="password" class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" placeholder="Kata Laluan" />
      <input v-model="form.confirmPassword" type="password" class="w-full bg-transparent border border-gray-400 focus:border-teal-700 focus:border-2 rounded-[4px] px-4 py-4 text-gray-900 outline-none transition-all font-medium" placeholder="Sahkan Kata Laluan" />
      
      <button @click="handleRegister" class="w-full bg-teal-700 text-white font-bold text-lg py-4 rounded-full mt-6 active:scale-95 transition-all shadow-md tracking-tight">
        Daftar Sekarang
      </button>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  negeri: 'Taman Negara Pulau Pinang', // PRESET DEFAULT
  password: '',
  confirmPassword: '',
  role: 'Anggota'
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) return alert("Kata laluan tidak sepadan!")
  if (!form.name || !form.email || !form.password) return alert("Sila lengkapkan semua ruangan wajib.")

  try {
    const { confirmPassword, ...payload } = form 
    const response = await api.post('/auth/register', payload)
    alert(response.data.message)
    router.push('/login')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat pendaftaran')
  }
}
</script>