<template>
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 print:static print:bg-white print:p-0">
    <div class="bg-white w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded shadow-xl print:max-h-none print:shadow-none print:max-w-full">

      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#003479] px-5 py-4 flex items-center justify-between no-print">
        <div>
          <h3 class="text-sm font-bold text-white">Butiran Perbelanjaan Kad</h3>
          <p class="text-xs text-blue-100 mt-0.5">
            {{ kad.jenis === 'TnG' ? 'Kad TnG' : 'Kad Minyak' }} — {{ kad.no_siri }}
            <span v-if="kad.no_plat"> · Diperuntukkan kepada {{ kad.no_plat }}</span>
          </p>
        </div>
        <button @click="$emit('close')" class="text-blue-100 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Filter Bulan -->
      <div class="p-5 pb-0 no-print">
        <div class="bg-[#F8FAFC] border border-[#DFE3E8] rounded p-4 max-w-xs">
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Bulan & Tahun</label>
          <input v-model="bulanTahun" type="month" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm text-[#1A2332] outline-none transition-colors bg-white" />
        </div>
      </div>

      <!-- Laporan -->
      <div class="p-5">
        <div v-if="loading" class="text-center py-16 text-sm text-[#5A6672]">Memuatkan data...</div>
        <div class="bg-white border border-[#DFE3E8] rounded shadow-sm overflow-hidden" v-else>
          <ReportMinyak
            v-if="kad.jenis === 'Minyak'"
            :laporanList="laporanList"
            :filter="filterUntukLaporan"
            :senaraiKenderaan="[]"
            :pegawaiKenderaan="pegawai"
          />
          <ReportTnG
            v-else
            :laporanList="laporanList"
            :filter="filterUntukLaporan"
            :senaraiKenderaan="[]"
            :pegawaiKenderaan="pegawai"
            :bakiPembukaBulan="bakiPembukaBulan"
            @refresh-data="fetchLaporanKad"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../../api/axios'
import ReportMinyak from './ReportMinyak.vue'
import ReportTnG from './ReportTnG.vue'

const props = defineProps({
  kad: { type: Object, required: true }
})
defineEmits(['close'])

const currentMonth = new Date().toISOString().slice(0, 7)
const bulanTahun = ref(currentMonth)

const loading = ref(false)
const laporanList = ref([])
const pegawai = ref('PENTADBIR SISTEM')
const bakiPembukaBulan = ref({})

// ReportMinyak/ReportTnG hanya perlukan bulanTahun utk label cetakan — kenderaan_id
// dikekalkan 'Semua' sebab laporan ni ditapis ikut kad, bukan kenderaan.
const filterUntukLaporan = computed(() => ({ bulanTahun: bulanTahun.value, kenderaan_id: 'Semua' }))

const fetchLaporanKad = async () => {
  loading.value = true
  try {
    const [year, month] = bulanTahun.value.split('-')
    const tarikh_mula = `${year}-${month}-01`
    const tarikh_tamat = new Date(year, month, 0).toISOString().split('T')[0]

    const res = await api.get('/admin/laporan', {
      params: { no_siri_kad: props.kad.no_siri, tarikh_mula, tarikh_tamat }
    })
    laporanList.value = res.data.data || []
    pegawai.value = res.data.pegawai_kenderaan || 'PENTADBIR SISTEM'
    bakiPembukaBulan.value = res.data.bakiPembukaBulan || {}
  } catch (error) {
    console.error('Gagal menarik laporan kad', error)
  } finally {
    loading.value = false
  }
}

watch(bulanTahun, () => fetchLaporanKad())
onMounted(() => fetchLaporanKad())
</script>
