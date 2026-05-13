<template>
  <div class="space-y-6 animate-fade-in no-print">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <h2 class="text-xl font-black text-slate-800 tracking-tight">Status Aset Real-Time</h2>
      
      <div class="flex bg-slate-200/50 p-1 rounded-xl w-fit">
        <button @click="kategoriAktif = 'Semua'" :class="['px-4 py-2 text-xs font-bold rounded-lg transition-all', kategoriAktif === 'Semua' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']">Semua</button>
        <button @click="kategoriAktif = 'Darat'" :class="['px-4 py-2 text-xs font-bold rounded-lg transition-all', kategoriAktif === 'Darat' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']">Kenderaan Darat</button>
        <button @click="kategoriAktif = 'Bot'" :class="['px-4 py-2 text-xs font-bold rounded-lg transition-all', kategoriAktif === 'Bot' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']">Bot / Marin</button>
      </div>
    </div>

    <div v-if="filteredAset.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="aset in filteredAset" :key="aset.id" 
        :class="['bg-white rounded-[24px] p-6 shadow-sm border-2 transition-all hover:shadow-md flex flex-col h-full relative overflow-hidden', 
          aset.status === 'Sedang Digunakan' ? 'border-red-100' : 
          aset.status === 'Tersedia' ? 'border-green-100' : 'border-slate-100']"
      >
        
        <div v-if="aset.kategori !== 'Bot' && aset.servis_berikutnya_km > 0 && (aset.servis_berikutnya_km - aset.odo_terkini) <= 1000" class="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black px-4 py-1 rounded-bl-xl shadow-sm animate-pulse tracking-wider z-10">
          PERLU SERVIS
        </div>

        <div class="flex justify-between items-start mb-5 mt-2">
          <div class="flex items-center gap-3">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border', 
              aset.status === 'Sedang Digunakan' ? 'bg-red-50 border-red-100 text-red-600' : 
              aset.status === 'Tersedia' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-500']">
              {{ aset.kategori === 'Bot' ? '🚤' : (aset.kategori === 'Motorsikal' ? '🏍️' : '🚗') }}
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-800 tracking-tight leading-none">{{ aset.no_plat }}</h3>
              <p class="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{{ aset.model }}</p>
            </div>
          </div>
          
          <span :class="['text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm', 
            aset.status === 'Tersedia' ? 'bg-green-600 text-white' : 
            aset.status === 'Sedang Digunakan' ? 'bg-red-600 text-white' : 
            aset.status === 'Dalam Servis' ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white']">
            {{ aset.status }}
          </span>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5">
          <template v-if="aset.status === 'Sedang Digunakan'">
            <p class="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Maklumat Pemandu</p>
            <p class="text-sm font-bold text-slate-800">{{ aset.pemandu_semasa }}</p>
            <p class="text-xs text-slate-500 mt-1"><span class="font-bold text-slate-600">Ke:</span> {{ aset.destinasi_semasa }}</p>
          </template>

          <template v-else-if="aset.status === 'Ditempah'">
            <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Tempahan Diterima</p>
            <p class="text-sm font-bold text-slate-800">{{ aset.pembuat_tempahan }}</p>
            <p class="text-xs text-slate-500 mt-1"><span class="font-bold text-slate-600">Destinasi:</span> {{ aset.destinasi_booking }}</p>
          </template>

          <template v-else-if="aset.status === 'Tersedia'">
            <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Lokasi Aset</p>
            <p class="text-sm font-bold text-slate-800">Tersedia di Stesen</p>
            <p class="text-xs text-slate-400 mt-1 italic">Sedia untuk ditugaskan.</p>
          </template>

          <template v-else>
            <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Penyelenggaraan</p>
            <p class="text-sm font-bold text-slate-800">Aset di Bengkel</p>
          </template>
        </div>

        <div v-if="aset.senarai_tempahan && aset.senarai_tempahan.length > 0" class="mb-5 px-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jadual Tempahan</p>
            <div class="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
              <div v-for="b in aset.senarai_tempahan" :key="b.id" class="bg-white border border-slate-100 rounded-xl p-2 flex justify-between items-center shadow-sm">
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-bold text-slate-700 truncate">{{ b.pembuat_tempahan }}</p>
                  <p class="text-[9px] text-slate-400 truncate">{{ b.destinasi }}</p>
                </div>
                <span class="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{{ formatTarikhPendek(b.tarikh_mula) }}</span>
              </div>
            </div>
        </div>

        <div class="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mb-5">
          <div v-if="aset.kategori !== 'Bot'">
            <p class="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Baki TnG</p>
            <p class="text-lg font-black text-purple-900 leading-none">{{ aset.baki_tng_terkini ? `RM ${parseFloat(aset.baki_tng_terkini).toFixed(2)}` : 'RM 0.00' }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Minyak (Total)</p>
            <p class="text-lg font-black text-blue-900 leading-none">RM {{ aset.total_rm_minyak ? parseFloat(aset.total_rm_minyak).toFixed(0) : '0' }}</p>
            <p class="text-[10px] font-bold text-blue-400 mt-1">{{ aset.total_liter_minyak ? parseFloat(aset.total_liter_minyak).toFixed(1) + ' L' : '0 L' }}</p>
          </div>
        </div>

        <div v-if="aset.kategori !== 'Bot'" class="bg-slate-100 p-3.5 rounded-xl border border-slate-200">
          <div class="flex justify-between items-center mb-2">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jarak Servis (KM)</p>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <div :class="['h-2 rounded-full transition-all duration-500', getPeratusanServis(aset.odo_terkini, aset.servis_berikutnya_km) > 90 ? 'bg-red-500' : 'bg-teal-500']" 
                 :style="{ width: getPeratusanServis(aset.odo_terkini, aset.servis_berikutnya_km) + '%' }"></div>
          </div>
          <div class="flex justify-between text-[10px] font-bold text-slate-500">
            <span>Odo: <span class="text-slate-800">{{ aset.odo_terkini || 0 }}</span></span>
            <span>Target: <span class="text-slate-800">{{ aset.servis_berikutnya_km || '-' }}</span></span>
          </div>
        </div>

        <div v-else class="bg-teal-50 p-3.5 rounded-xl border border-teal-100 text-center">
           <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest">Penyelenggaraan Marin</p>
           <p class="text-[11px] text-teal-700 font-bold mt-1">Berdasarkan Jam Enjin (Manual)</p>
        </div>

      </div>
    </div>

    <div v-else class="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
      <p class="text-4xl mb-4">🔍</p>
      <h3 class="text-lg font-bold text-slate-800">Tiada Aset Dijumpai</h3>
      <p class="text-sm text-slate-400 mt-1">Tiada rekod untuk kategori "{{ kategoriAktif }}" di stesen ini.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../api/axios'

const ringkasanList = ref([])
const kategoriAktif = ref('Semua') // Status Tab: Semua, Darat, Bot

const fetchDashboard = async () => {
  try {
    const res = await api.get('/admin/dashboard-summary')
    ringkasanList.value = res.data.data
  } catch (error) { 
    console.error("Gagal menarik data ringkasan dashboard.") 
  }
}

// LOGIK PENAPISAN (FILTER) TAB
const filteredAset = computed(() => {
  if (kategoriAktif.value === 'Semua') return ringkasanList.value
  if (kategoriAktif.value === 'Darat') {
    return ringkasanList.value.filter(a => a.kategori === 'Kereta' || a.kategori === 'Motorsikal')
  }
  if (kategoriAktif.value === 'Bot') {
    return ringkasanList.value.filter(a => a.kategori === 'Bot')
  }
  return ringkasanList.value
})

const formatTarikhPendek = (tarikhStr) => {
  if (!tarikhStr) return '';
  const date = new Date(tarikhStr);
  return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' }); 
};

const getPeratusanServis = (terkini, target) => {
  if (!target || target === 0) return 0
  let peratus = (terkini / target) * 100
  return peratus > 100 ? 100 : peratus
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>