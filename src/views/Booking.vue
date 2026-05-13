<template>
  <div class="min-h-screen bg-[#F4F5F4] font-sans text-gray-900 pb-24">
    
    <header class="pt-12 pb-4 px-6 bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 rounded-b-[24px]">
      <div class="max-w-md mx-auto flex items-center gap-4">
        <button @click="$router.push('/dashboard')" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-700 active:scale-95">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <p class="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Borang Rasmi</p>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Tempah Aset</h1>
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 pt-8">
      
      <div class="bg-white p-6 md:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6 animate-fade-in">
        
        <div class="mb-2">
          <h2 class="text-lg font-bold text-gray-900 tracking-tight">Maklumat Tempahan</h2>
          <p class="text-xs text-gray-500 font-medium mt-1">Sila isi butiran permohonan penggunaan kenderaan/bot rasmi.</p>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1.5 ml-1">Pilih Aset / Kenderaan</label>
          <div class="relative">
            <select v-model="form.kenderaan_id" class="w-full bg-gray-50 border border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm transition-all appearance-none cursor-pointer">
              <option value="" disabled>-- Sila Pilih --</option>
              <option v-for="k in kenderaanList" :key="k.id" :value="k.id">
                {{ k.no_plat }} - {{ k.model }} ({{ k.kategori }})
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1.5 ml-1">Masa Mula</label>
            <input v-model="form.tarikh_mula" type="datetime-local" class="w-full bg-gray-50 border border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-4 py-4 text-gray-900 font-bold outline-none shadow-sm transition-all text-xs" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1.5 ml-1">Masa Tamat</label>
            <input v-model="form.tarikh_tamat" type="datetime-local" class="w-full bg-gray-50 border border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-4 py-4 text-gray-900 font-bold outline-none shadow-sm transition-all text-xs" />
          </div>
        </div>

        <div class="space-y-4 pt-2">
          <div>
            <label class="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1.5 ml-1">Lokasi Destinasi</label>
            <input v-model="form.destinasi" type="text" class="w-full bg-gray-50 border border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm transition-all placeholder-gray-400" placeholder="Cth: Pejabat SUK Putrajaya" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1.5 ml-1">Tujuan Rasmi</label>
            <input v-model="form.tujuan" type="text" class="w-full bg-gray-50 border border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm transition-all placeholder-gray-400" placeholder="Cth: Menghadiri Mesyuarat" />
          </div>
        </div>

        <div class="pt-4">
          <button @click="hantarTempahan" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg hover:bg-teal-800 hover:shadow-xl active:scale-95 transition-all tracking-tight">
            Sahkan Tempahan
          </button>
        </div>

      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const kenderaanList = ref([])

const form = reactive({
  kenderaan_id: '',
  tarikh_mula: '',
  tarikh_tamat: '',
  destinasi: '',
  tujuan: ''
})

const fetchKenderaan = async () => {
  try {
    const response = await api.get('/kenderaan/senarai')
    kenderaanList.value = response.data.data
  } catch (error) {
    if(error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}

const hantarTempahan = async () => {
  if(!form.kenderaan_id || !form.tarikh_mula || !form.tarikh_tamat || !form.destinasi || !form.tujuan) {
    return alert("Sila lengkapkan semua maklumat tempahan.")
  }

  if(new Date(form.tarikh_tamat) <= new Date(form.tarikh_mula)) {
    return alert("Tarikh dan Masa Tamat mestilah selepas Tarikh Mula.")
  }

  try {
    const response = await api.post('/booking/create', form)
    alert(response.data.message)
    router.push('/dashboard')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat semasa memproses tempahan.')
  }
}

onMounted(() => {
  fetchKenderaan()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>