<template>
  <div class="space-y-6 animate-fade-in">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 no-print">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-widest uppercase">Pusat Analitik Laporan</h2>
        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Sistem Penjanaan Dokumen & Audit Pergerakan</p>
      </div>
      <button @click="cetakLaporan" class="bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-md active:scale-95 transition-all flex items-center gap-2 border-2 border-slate-800">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Jana Dokumen (PDF)
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 no-print">
      <button @click="jenisLaporan = 'buku_log'" :class="btnTabClass(jenisLaporan === 'buku_log')">
        <span class="text-lg">📖</span>
        <div class="text-left">
          <h3 class="text-[11px] font-black uppercase tracking-widest">Buku Log</h3>
          <p class="text-[9px] font-bold opacity-60">Log Odometer</p>
        </div>
      </button>
      
      <button @click="jenisLaporan = 'kad_inden'" :class="btnTabClass(jenisLaporan === 'kad_inden')">
        <span class="text-lg">💳</span>
        <div class="text-left">
          <h3 class="text-[11px] font-black uppercase tracking-widest">Kad Inden</h3>
          <p class="text-[9px] font-bold opacity-60">Bahan Api</p>
        </div>
      </button>

      <button @click="jenisLaporan = 'kunci'" :class="btnTabClass(jenisLaporan === 'kunci')">
        <span class="text-lg">🔑</span>
        <div class="text-left">
          <h3 class="text-[11px] font-black uppercase tracking-widest">Akses Kunci</h3>
          <p class="text-[9px] font-bold opacity-60">Masa Operasi</p>
        </div>
      </button>

      <button @click="jenisLaporan = 'tng'" :class="btnTabClass(jenisLaporan === 'tng')">
        <span class="text-lg">🛣️</span>
        <div class="text-left">
          <h3 class="text-[11px] font-black uppercase tracking-widest">Kad TnG</h3>
          <p class="text-[9px] font-bold opacity-60">Transaksi Tol</p>
        </div>
      </button>
    </div>

    <div class="bg-white border-2 border-slate-800 p-5 shadow-sm no-print rounded-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tempoh Mula</label>
          <input v-model="filter.tarikhMula" type="date" class="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-800 rounded-sm px-4 py-3 text-slate-800 font-bold outline-none text-xs transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tempoh Tamat</label>
          <input v-model="filter.tarikhAkhir" type="date" class="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-800 rounded-sm px-4 py-3 text-slate-800 font-bold outline-none text-xs transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Identiti Aset</label>
          <div class="relative">
            <select v-model="filter.kenderaan_id" class="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-800 rounded-sm px-4 py-3 text-slate-800 font-bold outline-none text-xs appearance-none cursor-pointer transition-colors">
              <option value="Semua">-- SEMUA UNIT --</option>
              <option v-for="k in senaraiKenderaan" :key="k.id" :value="k.id">{{ k.no_plat }} [{{ k.model.toUpperCase() }}]</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-if="jenisLaporan === 'kad_inden'" class="bg-white border-2 border-slate-800 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jumlah Kos (RM)</p>
        <p class="text-2xl font-black text-slate-900 tracking-tighter">RM {{ totalKosMinyak.toFixed(2) }}</p>
      </div>
      <div v-if="jenisLaporan === 'kad_inden'" class="bg-white border-2 border-slate-800 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kuantiti (Liter)</p>
        <p class="text-2xl font-black text-slate-900 tracking-tighter">{{ totalLiterMinyak.toFixed(1) }} L</p>
      </div>
      <div v-if="jenisLaporan === 'buku_log'" class="bg-white border-2 border-slate-800 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jarak Kumulatif</p>
        <p class="text-2xl font-black text-slate-900 tracking-tighter">{{ totalJarak.toFixed(0) }} KM</p>
      </div>
      <div class="bg-white border-2 border-slate-800 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bilangan Rekod</p>
        <p class="text-2xl font-black text-slate-900 tracking-tighter">{{ rekodDitapis.length }} UNIT</p>
      </div>
    </div>

    <div class="bg-white border-2 border-slate-800 overflow-hidden shadow-sm rounded-sm">
      <div class="overflow-x-auto custom-scrollbar">
        
        <ReportBukuLog 
          v-if="jenisLaporan === 'buku_log'" 
          :laporanList="rekodDitapis" 
          :filter="filter" 
          :senaraiKenderaan="senaraiKenderaan" 
          pegawaiKenderaan="PENTADBIR SISTEM" 
        />
        
        <ReportMinyak 
          v-else-if="jenisLaporan === 'kad_inden'" 
          :laporanList="rekodDitapis" 
          :filter="filter" 
          :senaraiKenderaan="senaraiKenderaan" 
          pegawaiKenderaan="PENTADBIR SISTEM" 
        />
        
        <ReportKunci 
          v-else-if="jenisLaporan === 'kunci'" 
          :laporanList="rekodDitapis" 
          pegawaiKenderaan="PENTADBIR SISTEM" 
        />
        
        <ReportTnG 
          v-else-if="jenisLaporan === 'tng'" 
          :laporanList="rekodDitapis" 
          :filter="filter" 
          :senaraiKenderaan="senaraiKenderaan" 
          pegawaiKenderaan="PENTADBIR SISTEM" 
        />

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

// Import Sub-Komponen
import ReportBukuLog from './ReportBukuLog.vue'
import ReportMinyak from './ReportMinyak.vue'
import ReportKunci from './ReportKunci.vue'
import ReportTnG from './ReportTnG.vue'

const jenisLaporan = ref('buku_log') 
const rekodList = ref([])
const senaraiKenderaan = ref([])

const filter = ref({
  tarikhMula: '',
  tarikhAkhir: '',
  kenderaan_id: 'Semua'
})

// Fungsi Styling Tactical untuk Butang Tab
const btnTabClass = (isActive) => {
  const base = "flex items-center gap-3 p-4 border-2 transition-all rounded-sm"
  return isActive 
    ? `${base} bg-slate-800 text-white border-slate-800 shadow-md`
    : `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400`
}

const fetchSemuaData = async () => {
  try {
    // Penambahbaikan: Tarik data dengan sokongan fallback jika struktur berbeza
    const resReq = await api.get('/pergerakan/semua-rekod')
    rekodList.value = resReq.data.data || resReq.data || []
    
    const resKen = await api.get('/kenderaan/senarai')
    senaraiKenderaan.value = resKen.data.data || resKen.data || []
  } catch (error) {
    console.error("RALAT: Gagal memuatkan pangkalan data laporan.")
  }
}

// LOGIK PENAPISAN (Telah dibaiki perbandingan ID longgar ==)
const rekodDitapis = computed(() => {
  return rekodList.value.filter(rekod => {
    let lulusTarikh = true;
    let lulusKenderaan = true;

    if (filter.value.kenderaan_id !== 'Semua') {
      lulusKenderaan = rekod.kenderaan_id == filter.value.kenderaan_id;
    }

    if (filter.value.tarikhMula || filter.value.tarikhAkhir) {
      const tarikhRekod = new Date(rekod.masa_keluar).setHours(0,0,0,0);
      const mula = filter.value.tarikhMula ? new Date(filter.value.tarikhMula).setHours(0,0,0,0) : null;
      const akhir = filter.value.tarikhAkhir ? new Date(filter.value.tarikhAkhir).setHours(23,59,59,999) : null;

      if (mula && akhir) lulusTarikh = tarikhRekod >= mula && tarikhRekod <= akhir;
      else if (mula) lulusTarikh = tarikhRekod >= mula;
      else if (akhir) lulusTarikh = tarikhRekod <= akhir;
    }

    return lulusTarikh && lulusKenderaan;
  })
})

const totalKosMinyak = computed(() => rekodDitapis.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_rm_minyak) || 0), 0))
const totalLiterMinyak = computed(() => rekodDitapis.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_liter_minyak) || 0), 0))

const totalJarak = computed(() => {
  return rekodDitapis.value.reduce((sum, r) => {
    const mula = parseFloat(r.odo_mula) || 0
    const tamat = parseFloat(r.odo_tamat) || 0
    return sum + (tamat >= mula ? (tamat - mula) : 0)
  }, 0)
})

const cetakLaporan = () => {
  window.print()
}

onMounted(() => {
  fetchSemuaData()
})
</script>

<style scoped>
/* Tactical Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 0px; }

@media print {
  .no-print { display: none !important; }
  /* Pastikan kandungan cetakan memenuhi kertas */
  .space-y-6 { margin: 0 !important; }
}
</style>