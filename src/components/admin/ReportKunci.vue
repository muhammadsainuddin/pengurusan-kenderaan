<template>
  <div class="w-full">

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- PAPARAN SKRIN (Screen View)                        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="no-print">

      <!-- Sub-header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#DFE3E8]">
        <div>
          <h3 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Daftar Pergerakan Kunci</h3>
          <p class="text-xs text-[#5A6672] mt-0.5">Rekod ambil dan pulang kunci kenderaan rasmi</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#5A6672]">{{ laporanList.length }} rekod</span>
          <div class="w-px h-4 bg-[#DFE3E8]"></div>
          <div class="flex gap-1.5">
            <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
              {{ laporanList.filter(r => r.status_trip === 'Selesai').length }} Dipulang
            </span>
            <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block"></span>
              {{ laporanList.filter(r => r.status_trip !== 'Selesai').length }} Belum Pulang
            </span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#F8FAFC] border-b border-[#DFE3E8]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide w-8">Bil.</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Pemegang Kunci</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Kenderaan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Tujuan / Destinasi</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Masa Ambil</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Masa Pulang</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Tempoh</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F2F5]">
            <tr v-if="laporanList.length === 0">
              <td colspan="8" class="px-4 py-12 text-center text-[#5A6672] text-xs">Tiada rekod pergerakan kunci dijumpai.</td>
            </tr>
            <tr v-for="(row, idx) in laporanList" :key="'kunci'+row.id" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="px-4 py-3 text-xs text-[#5A6672] font-medium">{{ idx + 1 }}</td>
              <td class="px-4 py-3">
                <p class="font-semibold text-[#1A2332] text-sm">{{ row.nama_staf }}</p>
                <p class="text-xs text-[#5A6672] mt-0.5">{{ row.jabatan }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="font-bold text-[#003479] text-sm">{{ row.no_plat }}</span>
                <p class="text-xs text-[#5A6672] mt-0.5">{{ row.model }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-[#1A2332] max-w-[180px] truncate">{{ row.destinasi }}</p>
                <p class="text-xs text-[#5A6672] mt-0.5">{{ row.tujuan }}</p>
              </td>
              <td class="px-4 py-3 text-sm text-[#1A2332] font-medium whitespace-nowrap">{{ formatTarikhPanjang(row.masa_keluar) }}</td>
              <td class="px-4 py-3 text-sm font-medium whitespace-nowrap" :class="row.masa_masuk ? 'text-[#1A2332]' : 'text-[#F59E0B]'">
                {{ row.masa_masuk ? formatTarikhPanjang(row.masa_masuk) : 'Belum dipulangkan' }}
              </td>
              <td class="px-4 py-3 text-xs text-[#5A6672] font-medium whitespace-nowrap">
                {{ row.masa_masuk ? hitungTempoh(row.masa_keluar, row.masa_masuk) : '—' }}
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', row.status_trip === 'Selesai' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]']">
                  {{ row.status_trip === 'Selesai' ? 'Dipulangkan' : 'Pada Staf' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- FORMAT CETAKAN KERAJAAN                            -->
    <!-- DAFTAR PERGERAKAN KUNCI KENDERAAN                  -->
    <!-- Pekeliling Perbendaharaan Malaysia WP 4.1          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="hidden print:block text-black w-full">
      <div v-for="(pageChunk, pIdx) in halamanBerpisah" :key="'kunci-page-'+pIdx" class="print-page w-full">

        <!-- Pengepala Dokumen -->
        <div class="text-center mb-4">
          <p class="text-[9px] font-bold text-right mb-3">Pekeliling Perbendaharaan Malaysia WP 4.1</p>
          <p class="text-[16px] font-bold uppercase tracking-wider">DAFTAR PERGERAKAN KUNCI KENDERAAN</p>
        </div>

        <!-- Maklumat Kenderaan & Bulan -->
        <div class="flex justify-between items-end mb-4 text-[9px] font-bold uppercase">
          <div class="flex items-end gap-2">
            <span>No. Kenderaan:</span>
            <div class="border-b border-black min-w-[140px] text-left px-1 pb-0.5">
              {{ filter?.kenderaan_id === 'Semua' ? 'SEMUA UNIT' : (kenderaanDipilih?.no_plat + ' — ' + kenderaanDipilih?.model || 'SEMUA UNIT') }}
            </div>
          </div>
          <div class="flex items-end gap-2">
            <span>Bulan / Tahun:</span>
            <div class="border-b border-black min-w-[120px] text-center px-1 pb-0.5">
              {{ formatBulanTahun(filter?.bulanTahun) }}
            </div>
          </div>
          <div class="flex items-end gap-2">
            <span>Pegawai Bertanggungjawab:</span>
            <div class="border-b border-black min-w-[140px] text-left px-1 pb-0.5">
              {{ pegawaiKenderaan || '' }}
            </div>
          </div>
        </div>

        <!-- Jadual Rekod -->
        <table class="w-full border-collapse text-[8px] print-table">
          <thead>
            <tr class="font-bold uppercase text-center bg-white">
              <th class="border border-black p-1 w-6">Bil.</th>
              <th class="border border-black p-1 w-16">Tarikh</th>
              <th class="border border-black p-1 w-20">No.<br>Kenderaan</th>
              <th class="border border-black p-1 w-28">Nama Pemandu /<br>Pengguna</th>
              <th class="border border-black p-1 w-24">Jawatan</th>
              <th class="border border-black p-1">Tujuan /<br>Destinasi</th>
              <th class="border border-black p-1 w-20">Masa Ambil<br>Kunci</th>
              <th class="border border-black p-1 w-20">Masa Pulang<br>Kunci</th>
              <th class="border border-black p-1 w-14">Tempoh<br>(Jam)</th>
              <th class="border border-black p-1 w-16">T/tangan<br>Pemegang</th>
              <th class="border border-black p-1 w-16">T/tangan<br>Pegawai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIdx) in pageChunk" :key="'kunci-row-'+rIdx" class="h-10 text-center">
              <td class="border border-black p-1">{{ row ? (pIdx * BARIS_SEHALAMAN) + rIdx + 1 : '' }}</td>
              <td class="border border-black p-1 font-bold">{{ row ? formatTarikhCetak(row.masa_keluar) : '' }}</td>
              <td class="border border-black p-1 font-bold uppercase">{{ row?.no_plat || '' }}</td>
              <td class="border border-black p-1 font-bold uppercase text-left px-1 leading-tight">{{ row?.nama_staf || '' }}</td>
              <td class="border border-black p-1 text-left px-1 leading-tight">{{ row?.jabatan || '' }}</td>
              <td class="border border-black p-1 text-left px-1 leading-tight">
                <span v-if="row" class="font-bold">{{ row.destinasi }}</span>
                <span v-if="row && row.tujuan" class="block text-[7px]">{{ row.tujuan }}</span>
              </td>
              <td class="border border-black p-1 font-bold">{{ row ? formatMasaCetak(row.masa_keluar) : '' }}</td>
              <td class="border border-black p-1 font-bold">{{ row?.masa_masuk ? formatMasaCetak(row.masa_masuk) : '' }}</td>
              <td class="border border-black p-1 font-bold">{{ row?.masa_masuk ? hitungTempoh(row.masa_keluar, row.masa_masuk) : '' }}</td>
              <td class="border border-black p-1"></td>
              <td class="border border-black p-1"></td>
            </tr>
          </tbody>
        </table>

        <!-- Pengesahan -->
        <div v-if="pIdx === halamanBerpisah.length - 1" class="mt-6 flex justify-between text-[9px]">
          <div class="text-center">
            <p class="font-bold uppercase mb-8">Disediakan Oleh</p>
            <div class="border-t border-black w-40 mx-auto pt-1">
              <p class="font-bold uppercase">{{ pegawaiKenderaan || '.................................' }}</p>
              <p>Pegawai Penyimpan Kunci</p>
            </div>
          </div>
          <div class="text-center">
            <p class="font-bold uppercase mb-8">Disahkan Oleh</p>
            <div class="border-t border-black w-40 mx-auto pt-1">
              <p class="font-bold uppercase">Pegawai Bertanggungjawab</p>
              <p>Tarikh: .................................</p>
            </div>
          </div>
        </div>

        <div class="mt-2 text-[8px] text-right">(Muka Surat {{ pIdx + 1 }} daripada {{ halamanBerpisah.length }})</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  laporanList: Array,
  pegawaiKenderaan: String,
  filter: Object,
  senaraiKenderaan: Array
})

const BARIS_SEHALAMAN = 15

const kenderaanDipilih = computed(() => {
  if (!props.senaraiKenderaan || !props.filter) return null
  return props.senaraiKenderaan.find(k => k.id === props.filter.kenderaan_id)
})

const halamanBerpisah = computed(() => {
  const list = props.laporanList || []
  const chunks = []
  for (let i = 0; i < list.length; i += BARIS_SEHALAMAN) {
    const chunk = list.slice(i, i + BARIS_SEHALAMAN)
    while (chunk.length < BARIS_SEHALAMAN) chunk.push(null)
    chunks.push(chunk)
  }
  return chunks.length > 0 ? chunks : [Array(BARIS_SEHALAMAN).fill(null)]
})

const hitungTempoh = (mula, tamat) => {
  if (!mula || !tamat) return '—'
  const diffMs = new Date(tamat) - new Date(mula)
  const jam = Math.floor(diffMs / 3600000)
  const minit = Math.floor((diffMs % 3600000) / 60000)
  if (jam === 0) return `${minit}m`
  return minit > 0 ? `${jam}j ${minit}m` : `${jam}j`
}

const formatTarikhPanjang = (str) => {
  if (!str) return '-'
  return new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

const formatTarikhCetak = (str) => {
  if (!str) return ''
  return new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const formatMasaCetak = (str) => {
  if (!str) return ''
  return new Date(str).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const formatBulanTahun = (s) => {
  if (!s) return '.................................'
  const [y, m] = s.split('-')
  return new Date(y, m - 1).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }).toUpperCase()
}
</script>

<style scoped>
@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  body {
    background: white !important;
    -webkit-print-color-adjust: exact;
  }

  .print-page {
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    width: 277mm;
    margin: 0 auto;
    color: black !important;
    background: white !important;
  }

  .print-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .print-table,
  .print-table th,
  .print-table td {
    border: 1px solid black !important;
    color: black !important;
    background: white !important;
  }

  .no-print {
    display: none !important;
  }
}
</style>
