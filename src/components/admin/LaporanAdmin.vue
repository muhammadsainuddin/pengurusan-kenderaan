<template>
  <div class="space-y-5">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
      <div>
        <h2 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Laporan & Analitik</h2>
        <p class="text-xs text-[#5A6672] mt-0.5">Penjanaan dokumen dan audit rekod pergerakan</p>
      </div>
      <button @click="cetakLaporan" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Jana Dokumen (PDF)
      </button>
    </div>

    <!-- Jenis Laporan Tabs -->
    <div class="flex flex-wrap gap-2 no-print">
      <button @click="jenisLaporan = 'buku_log'" :class="['flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold transition-colors border', jenisLaporan === 'buku_log' ? 'bg-[#003479] text-white border-[#003479]' : 'bg-white text-[#5A6672] border-[#DFE3E8] hover:border-[#003479] hover:text-[#003479]']">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Buku Log
      </button>
      <button @click="jenisLaporan = 'kad_inden'" :class="['flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold transition-colors border', jenisLaporan === 'kad_inden' ? 'bg-[#003479] text-white border-[#003479]' : 'bg-white text-[#5A6672] border-[#DFE3E8] hover:border-[#003479] hover:text-[#003479]']">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        Kad Inden
      </button>
      <button @click="jenisLaporan = 'kunci'" :class="['flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold transition-colors border', jenisLaporan === 'kunci' ? 'bg-[#003479] text-white border-[#003479]' : 'bg-white text-[#5A6672] border-[#DFE3E8] hover:border-[#003479] hover:text-[#003479]']">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
        Pergerakan Kunci
      </button>
      <button @click="jenisLaporan = 'tng'" :class="['flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold transition-colors border', jenisLaporan === 'tng' ? 'bg-[#003479] text-white border-[#003479]' : 'bg-white text-[#5A6672] border-[#DFE3E8] hover:border-[#003479] hover:text-[#003479]']">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Kad TnG
      </button>
    </div>

    <!-- Filter -->
    <div class="bg-white border border-[#DFE3E8] rounded shadow-sm p-4 no-print">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Bulan & Tahun</label>
          <input v-model="filter.bulanTahun" type="month" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm text-[#1A2332] outline-none transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Unit Kenderaan</label>
          <select v-model="filter.kenderaan_id" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm text-[#1A2332] outline-none transition-colors bg-white">
            <option value="Semua">-- Semua Unit --</option>
            <option v-for="k in senaraiKenderaan" :key="k.id" :value="k.id">{{ k.no_plat }} — {{ k.model }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Statistik Ringkas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 no-print">
      <div class="bg-white border border-[#DFE3E8] rounded shadow-sm p-4">
        <p class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1">Jarak Bulanan</p>
        <p class="text-2xl font-bold text-[#1A2332]">{{ totalJarak.toFixed(1) }} <span class="text-sm font-medium text-[#5A6672]">km</span></p>
      </div>
      <div class="bg-white border border-[#DFE3E8] rounded shadow-sm p-4">
        <p class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1">Minyak Digunakan</p>
        <p class="text-2xl font-bold text-[#1A2332]">{{ totalLiter.toFixed(2) }} <span class="text-sm font-medium text-[#5A6672]">L</span></p>
      </div>
      <div class="bg-white border border-[#DFE3E8] rounded shadow-sm p-4">
        <p class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1">Kos Bahan Api</p>
        <p class="text-2xl font-bold text-[#1A2332]"><span class="text-sm font-medium text-[#5A6672]">RM</span> {{ totalRM.toFixed(2) }}</p>
      </div>
      <div class="bg-white border border-l-4 border-[#DFE3E8] border-l-[#003479] rounded shadow-sm p-4">
        <p class="text-xs font-semibold text-[#003479] uppercase tracking-wide mb-1">Kadar Penggunaan</p>
        <p class="text-2xl font-bold text-[#003479]">{{ kadarKmPerLiter }} <span class="text-sm font-medium text-[#5A6672]">km/L</span></p>
      </div>
    </div>

    <!-- Report Content -->
    <div class="bg-white border border-[#DFE3E8] rounded shadow-sm overflow-hidden print:border-none print:shadow-none print:bg-transparent">
      <div class="overflow-x-auto custom-scrollbar">
        <ReportBukuLog v-if="jenisLaporan === 'buku_log'" @edit-rekod="bukaModalEdit" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
        <ReportMinyak v-else-if="jenisLaporan === 'kad_inden'" @edit-rekod="bukaModalEdit" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
        <ReportKunci v-else-if="jenisLaporan === 'kunci'" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
        <ReportTnG v-else-if="jenisLaporan === 'tng'" @edit-rekod="bukaModalEdit" :laporanList="rekodList" :filter="filter" :senaraiKenderaan="senaraiKenderaan" :pegawaiKenderaan="pegawai" />
      </div>
    </div>

    <!-- Modal: Kemaskini Rekod -->
    <div v-if="showModalEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 no-print">
      <div class="bg-white rounded shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">

        <div class="px-5 py-4 bg-[#003479] rounded-t">
          <h3 class="text-sm font-bold text-white">Kemaskini Data Rekod</h3>
        </div>

        <div class="p-5 space-y-4">

          <!-- Maklumat Perjalanan -->
          <div class="space-y-3">
            <p class="text-xs font-bold text-[#003479] uppercase tracking-wide">Maklumat Perjalanan</p>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Dari (Lokasi Mula)</label>
              <input v-model="editForm.dari_lokasi" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: Stesen, Kampung, Koordinat GPS..." />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Ke (Destinasi)</label>
              <input v-model="editForm.destinasi" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: Pejabat, Kawasan Operasi..." />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Tujuan</label>
              <input v-model="editForm.tujuan" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: Rondaan, Operasi Tangkap, Mesyuarat..." />
            </div>
          </div>

          <div class="border-t border-[#DFE3E8] pt-4">
            <p class="text-xs font-bold text-[#003479] uppercase tracking-wide mb-3">Kad Rasmi Digunakan</p>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Siri Kad TnG</label>
                <input v-model="editForm.no_siri_kad_tng" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Kosong jika tiada" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Siri Kad Inden</label>
                <input v-model="editForm.no_siri_kad_minyak" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Kosong jika tiada" />
              </div>
            </div>
            <p class="text-[11px] text-[#5A6672] mt-1.5">Edit jika kad yang digunakan berbeza dari kad kenderaan asal (kes swap).</p>
          </div>

          <div class="border-t border-[#DFE3E8] pt-4">
            <p class="text-xs font-bold text-[#003479] uppercase tracking-wide mb-3">Odometer & Bahan Api</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Odo Mula</label>
              <input v-model="editForm.odo_mula" type="number" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Odo Akhir</label>
              <input v-model="editForm.odo_tamat" type="number" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Baki TnG (RM)</label>
            <input v-model="editForm.baki_tng" type="number" step="0.01" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="0.00" />
          </div>

          <div class="border-t border-[#DFE3E8] pt-4">
            <div class="flex justify-between items-center mb-3">
              <label class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Resit Minyak</label>
              <button @click="tambahResitEdit" class="text-xs font-semibold text-[#003479] border border-[#003479] hover:bg-[#EEF3FB] px-3 py-1.5 rounded transition-colors">+ Tambah Resit</button>
            </div>
            <div v-for="(resit, idx) in editForm.senarai_resit" :key="idx" class="relative bg-[#F8FAFC] border border-[#DFE3E8] rounded p-3 mb-3">
              <button v-if="editForm.senarai_resit.length > 1" @click="buangResitEdit(idx)" class="absolute -top-2 -right-2 bg-[#C0392B] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">×</button>
              <input v-model="resit.no_resit" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none mb-2" placeholder="No. Resit" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="resit.liter" type="number" step="0.01" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none" placeholder="Liter" />
                <input v-model="resit.rm" type="number" step="0.01" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none" placeholder="RM" />
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2 border-t border-[#DFE3E8]">
            <button @click="simpanEdit" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">Simpan Perubahan</button>
            <button @click="showModalEdit = false" class="flex-1 bg-[#F4F6FA] hover:bg-[#DFE3E8] text-[#5A6672] font-semibold text-sm py-2.5 rounded transition-colors">Batal</button>
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

const currentMonth = new Date().toISOString().slice(0, 7)

const jenisLaporan = ref('buku_log')
const rekodList = ref([])
const senaraiKenderaan = ref([])
const pegawai = ref('PENTADBIR SISTEM')

const filter = ref({
  bulanTahun: currentMonth,
  kenderaan_id: 'Semua'
})

const totalJarak = computed(() => rekodList.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_jarak) || 0), 0))
const totalLiter = computed(() => rekodList.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_liter_minyak) || 0), 0))
const totalRM = computed(() => rekodList.value.reduce((sum, r) => sum + (parseFloat(r.jumlah_rm_minyak) || 0), 0))
const kadarKmPerLiter = computed(() => totalLiter.value > 0 ? (totalJarak.value / totalLiter.value).toFixed(2) : '0.00')

const showModalEdit = ref(false)
const editForm = ref({ id: null, dari_lokasi: '', destinasi: '', tujuan: '', odo_mula: '', odo_tamat: '', baki_tng: '', no_siri_kad_tng: '', no_siri_kad_minyak: '', senarai_resit: [] })

const fetchSemuaData = async () => {
  try {
    let tarikh_mula = '';
    let tarikh_tamat = '';

    if (filter.value.bulanTahun) {
      const [year, month] = filter.value.bulanTahun.split('-');
      tarikh_mula = `${year}-${month}-01`;
      tarikh_tamat = new Date(year, month, 0).toISOString().split('T')[0];
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
  editForm.value.dari_lokasi = rekod.dari_lokasi || ''
  editForm.value.destinasi = rekod.destinasi || ''
  editForm.value.tujuan = rekod.tujuan || ''
  editForm.value.no_siri_kad_tng = rekod.no_siri_kad_tng || ''
  editForm.value.no_siri_kad_minyak = rekod.no_siri_kad_minyak || ''
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
  .space-y-5 { margin: 0 !important; }
  @page { size: A4 landscape; margin: 0mm; }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #DFE3E8; border-radius: 4px; }
</style>
