<template>
  <div class="min-h-screen bg-[#F4F5F4] pb-12 font-sans text-gray-900">
    
    <header class="pt-12 pb-4 px-4 bg-[#F4F5F4] sticky top-0 z-10 flex items-center border-b border-gray-200">
      <button @click="$router.push('/dashboard')" class="p-2 mr-2 rounded-full hover:bg-gray-200 transition-colors text-gray-900">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <h1 class="text-[22px] font-normal text-gray-900">Sejarah Penggunaan</h1>
    </header>

    <main class="px-4 mt-6 max-w-md mx-auto space-y-4">
      
      <div v-if="sejarahList.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
        <h3 class="text-lg font-medium text-gray-900">Tiada Rekod</h3>
        <p class="text-sm text-gray-600 mt-1">Anda belum mempunyai sejarah penggunaan.</p>
      </div>

      <div v-for="rekod in sejarahList" :key="rekod.id" class="bg-white p-5 rounded-[28px] shadow-sm">
        
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center text-xl">
              {{ rekod.no_plat.toLowerCase().includes('bot') ? '🚤' : '🚗' }}
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 leading-tight">{{ rekod.no_plat }}</h3>
              <p class="text-xs text-gray-500">{{ formatTarikh(rekod.masa_keluar) }}</p>
            </div>
          </div>
          
          <span :class="['text-[10px] font-medium px-2.5 py-1 rounded-lg uppercase tracking-wide', rekod.status_trip === 'Selesai' ? 'bg-gray-100 text-gray-600' : 'bg-teal-100 text-teal-800']">
            {{ rekod.status_trip }}
          </span>
        </div>

        <div class="bg-[#F4F5F4] p-4 rounded-2xl mb-4">
          <p class="text-sm font-medium text-gray-900">{{ rekod.destinasi }}</p>
          <p class="text-xs text-gray-600 mt-0.5">{{ rekod.tujuan }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
          <div>
            <p class="text-[11px] text-gray-500 uppercase tracking-widest font-medium">Odo Mula</p>
            <p class="text-sm font-medium text-gray-900">{{ rekod.odo_mula }} km</p>
          </div>
          <div>
            <p class="text-[11px] text-gray-500 uppercase tracking-widest font-medium">Odo Akhir</p>
            <p class="text-sm font-medium text-gray-900">{{ rekod.odo_tamat ? rekod.odo_tamat + ' km' : '-' }}</p>
          </div>
        </div>

        <div v-if="rekod.status_trip === 'Selesai' && rekod.odo_tamat" class="mt-3 bg-teal-50 text-teal-900 text-xs font-medium py-2 px-3 rounded-xl inline-block">
          Jarak: {{ rekod.odo_tamat - rekod.odo_mula }} km
        </div>

      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const sejarahList = ref([])

const fetchSejarah = async () => {
  try {
    const res = await api.get('/pergerakan/sejarah')
    sejarahList.value = res.data.data
  } catch (error) {
    console.error("Gagal ambil sejarah")
  }
}

// Fungsi format tarikh (Contoh: 12 Mei 2026, 14:30)
const formatTarikh = (tarikhStr) => {
  if (!tarikhStr) return '-'
  const date = new Date(tarikhStr)
  return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })
}

onMounted(() => {
  fetchSejarah()
})
</script>