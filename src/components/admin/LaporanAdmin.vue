<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 no-print">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-widest uppercase">Pusat Analitik Laporan</h2>
        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Sistem Penjanaan Dokumen & Audit Pergerakan</p>
      </div>
      <button @click="cetakLaporan" class="bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-md transition-all border-2 border-slate-800 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Jana Dokumen (PDF)
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 no-print">
      <button @click="jenisLaporan = 'buku_log'" :class="btnTabClass(jenisLaporan === 'buku_log')">
        <span class="text-lg">📄</span>
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
          <p class="text-[9px] font-bold opacity-60">Tol & Baki</p>
        </div>
      </button>
    </div>

    <div class="bg-white border-2 border-slate-800 p-5 shadow-sm no-print rounded-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bulan & Tahun Laporan</label>
          <input v-model="filter.bulanTahun" type="month" class="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-800 rounded-sm px-4 py-3 text-slate-800 font-bold outline-none text-xs transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Identiti Aset</label>
          <select v-model="filter.kenderaan_id" class="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-800 rounded-sm px-4 py-3 text-slate-800 font-bold outline-none text-xs cursor-pointer transition-colors">
            <option value="Semua">-- SEMUA UNIT KENDERAAN --</option>
            <option v-for="k in senaraiKenderaan" :key="k.id" :value="k.id">{{ k.no_plat }} [{{ k.model.toUpperCase() }}]</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
      <div class="bg-white border-2 border-slate-200 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jarak Bulanan</p>
        <p class="text-3xl font-black text-slate-900 tracking-tighter">{{ totalJarak.toFixed(1) }} <span class="text-sm text-slate-500">KM</span></p>
      </div>
      <div class="bg-white border-2 border-slate-200 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Minyak Digunakan</p>
        <p class="text-3xl font-black text-slate-900 tracking-tighter">{{ totalLiter.toFixed(2) }} <span class="text-sm text-slate-500">L</span></p>
      </div>
      <div class="bg-white border-2 border-slate-200 p-5 shadow-sm rounded-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kos Bahan Api</p>
        <p class="text-3xl font-black text-slate-900 tracking-tighter"><span class="text-sm text-slate-500">RM</span> {{ totalRM.toFixed(2) }}</p>
      </div>
      <div class="bg-teal-50 border-2 border-teal-600 p-5 shadow-sm rounded-sm relative overflow-hidden">
        <div class="absolute -right-2 top-1/2 -translate-y-1/2 opacity-10 text-6xl">⛽</div>
        <p class="text-[9px] font-black text-teal-700 uppercase tracking-widest mb-1 relative z-10">Kadar Penggunaan</p>
        <p class="text-3xl font-black text-teal-900 tracking-tighter relative z-10">{{ kadarKmPerLiter }} <span class="text-sm text-teal-700">KM/L</span></p>
      </div>
    </div>

    <div class="bg-white border-2 border-slate-800 overflow-hidden shadow-sm rounded-sm print:border-none print:shadow-none print:bg-transparent">
      <div class="overflow-x-auto custom-scrollbar">
        <ReportBukuLog v-if="jenisLaporan === 'buku_log'" @edit-rekod="bukaModalEdit" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
        <ReportMinyak v-else-if="jenisLaporan === 'kad_inden'" @edit-rekod="bukaModalEdit" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
        <ReportKunci v-else-if="jenisLaporan === 'kunci'" :laporanList="rekodList" :pegawaiKenderaan="pegawai" />
        <ReportTnG v-else-if="jenisLaporan === 'tng'" @edit-rekod="bukaModalEdit" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
      </div>
    </div>

    <div v-if="showModalEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print">
      <div class="bg-white border-2 border-slate-800 p-8 w-full max-w-lg shadow-2xl animate-slide-up rounded-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 class="text-lg font-black uppercase tracking-widest mb-6 text-slate-900">Kemaskini Data Laporan</h2>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Odo Mula</label>
              <input v-model="editForm.odo_mula" type="number" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none rounded-sm transition-colors" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Odo Akhir</label>
              <input v-model="editForm.odo_tamat" type="number" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none rounded-sm transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Baki TnG (RM)</label>
            <input v-model="editForm.baki_tng" type="number" step="0.01" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none rounded-sm transition-colors" placeholder="0.00" />
          </div>

          <div class="border-t-2 border-slate-100 pt-5 mt-2">
            <div class="flex justify-between items-center mb-3">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resit Minyak</label>
              <button @click="tambahResitEdit" class="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-black px-3 py-1.5 rounded-sm uppercase tracking-wider hover:bg-blue-100 transition-colors">+ Tambah Resit</button>
            </div>
            <div v-for="(resit, idx) in editForm.senarai_resit" :key="idx" class="relative bg-slate-50 p-4 border border-slate-200 rounded-sm mb-3">
              <button v-if="editForm.senarai_resit.length > 1" @click="buangResitEdit(idx)" class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black border border-red-200 hover:bg-red-200 transition-colors">X</button>
              <input v-model="resit.no_resit" type="text" class="w-full border-2 border-slate-200 p-2 text-xs font-bold mb-2 rounded-sm outline-none focus:border-slate-400" placeholder="No Resit" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="resit.liter" type="number" step="0.01" class="w-full border-2 border-slate-200 p-2 text-xs font-bold rounded-sm outline-none focus:border-slate-400" placeholder="Liter" />
                <input v-model="resit.rm" type="number" step="0.01" class="w-full border-2 border-slate-200 p-2 text-xs font-bold rounded-sm outline-none focus:border-slate-400" placeholder="RM" />
              </div>
            </div>
          </div>

          <div class="pt-4 flex flex-col gap-2 border-t-2 border-slate-100">
            <button @click="simpanEdit" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 uppercase tracking-widest rounded-sm transition-colors shadow-md">
              Simpan Perubahan
            </button>
            <button @click="showModalEdit = false" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3 uppercase tracking-widest rounded-sm transition-colors">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import api from '../../api/axios'
import ReportBukuLog from './ReportBukuLog.vue'
import ReportMinyak from './ReportMinyak.vue'
import ReportKunci from './ReportKunci.vue'
import ReportTnG from './ReportTnG.vue'

// Tetapkan Default Bulan Semasa (Format: YYYY-MM)
const currentMonth = new Date().toISOString().slice(0, 7)

const jenisLaporan = ref('buku_log')
const rekodList = ref([])
const senaraiKenderaan = ref([])
const pegawai = ref('PENTADBIR SISTEM')

const filter = ref({ 
  bulanTahun: currentMonth, 
  kenderaan_id: 'Semua' 
})

// Pengiraan Statistik di Frontend (Atas Jadual)
const totalJarak = computed(() => rekodList.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_jarak) || 0), 0))
const totalLiter = computed(() => rekodList.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_liter_minyak) || 0), 0))
const totalRM = computed(() => rekodList.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_rm_minyak) || 0), 0))
const kadarKmPerLiter = computed(() => totalLiter.value > 0 ? (totalJarak.value / totalLiter.value).toFixed(2) : '0.00')

// State Modal Edit
const showModalEdit = ref(false)
const editForm = ref({
  id: null, odo_mula: '', odo_tamat: '', baki_tng: '', senarai_resit: []
})

const btnTabClass = (isActive) => {
  const base = "flex items-center gap-3 p-4 border-2 transition-all rounded-sm"
  return isActive 
    ? `${base} bg-slate-800 text-white border-slate-800 shadow-md`
    : `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400`
}

const fetchSemuaData = async () => {
  try {
    let tarikh_mula = '';
    let tarikh_tamat = '';
    
    // Tukar input "YYYY-MM" kepada tarikh penuh untuk Backend
    if (filter.value.bulanTahun) {
      const [year, month] = filter.value.bulanTahun.split('-');
      tarikh_mula = `${year}-${month}-01`;
      tarikh_tamat = new Date(year, month, 0).toISOString().split('T')[0]; // Hari terakhir bulan
    }

    const resReq = await api.get('/admin/laporan', {
      params: {
        kenderaan_id: filter.value.kenderaan_id === 'Semua' ? null : filter.value.kenderaan_id,
        tarikh_mula: tarikh_mula,
        tarikh_tamat: tarikh_tamat
      }
    })
    rekodList.value = resReq.data.data || []
    pegawai.value = resReq.data.pegawai_kenderaan || 'PENTADBIR SISTEM'
    
    const resKen = await api.get('/kenderaan/senarai')
    senaraiKenderaan.value = resKen.data.data || []
  } catch (error) {
    console.error("Gagal menarik data laporan", error)
  }
}

watch(filter, () => fetchSemuaData(), { deep: true })
watch(jenisLaporan, () => fetchSemuaData())

const cetakLaporan = () => window.print()

const bukaModalEdit = (rekod) => {
  editForm.value.id = rekod.id
  editForm.value.odo_mula = rekod.odo_mula
  editForm.value.odo_tamat = rekod.odo_tamat
  editForm.value.baki_tng = rekod.baki_tng

  if (rekod.senarai_resit && rekod.senarai_resit.length > 0) {
    editForm.value.senarai_resit = JSON.parse(JSON.stringify(rekod.senarai_resit))
  } else {
    editForm.value.senarai_resit = [{ no_resit: rekod.no_resit_minyak || '', rm: rekod.jumlah_rm_minyak || '', liter: rekod.jumlah_liter_minyak || '' }]
  }
  showModalEdit.value = true
}

const tambahResitEdit = () => editForm.value.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResitEdit = (idx) => { if (editForm.value.senarai_resit.length > 1) editForm.value.senarai_resit.splice(idx, 1) }

const simpanEdit = async () => {
  try {
    await api.put(`/admin/pergerakan/${editForm.value.id}`, editForm.value)
    showModalEdit.value = false
    fetchSemuaData()
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan kemaskini rekod.')
  }
}

onMounted(() => fetchSemuaData())
</script>

<style scoped>
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@media print {
  .no-print { display: none !important; }
  .space-y-6 { margin: 0 !important; }
  @page { size: A4 landscape; margin: 0mm; }
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
</style>