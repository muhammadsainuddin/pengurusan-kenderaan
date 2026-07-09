<template>
  <div class="w-full">

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- PAPARAN SKRIN                                       -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="no-print">

      <!-- Sub-header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#DFE3E8]">
        <div>
          <h3 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Buku Log Kenderaan</h3>
          <p class="text-xs text-[#5A6672] mt-0.5">Butir-butir penggunaan kenderaan rasmi</p>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#F8FAFC] border-b border-[#DFE3E8]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Tarikh</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Pemandu</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Perjalanan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Odometer</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F2F5]">
            <tr v-if="laporanList.length === 0">
              <td colspan="5" class="px-4 py-12 text-center text-[#5A6672] text-xs">Tiada rekod buku log dijumpai.</td>
            </tr>
            <tr v-for="row in laporanList" :key="row.id" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="px-4 py-3 align-top whitespace-nowrap">
                <div class="text-sm font-medium text-[#1A2332]">
                  <span class="text-[10px] text-[#5A6672] font-semibold uppercase tracking-wide">Pergi</span><br>
                  {{ formatTarikh(row.masa_keluar) }}
                </div>
                <div v-if="row.masa_masuk" class="mt-2 text-sm font-medium text-[#003479]">
                  <span class="text-[10px] text-[#5A6672] font-semibold uppercase tracking-wide">Balik</span><br>
                  {{ formatTarikh(row.masa_masuk) }}
                </div>
                <div v-else class="mt-2 text-xs text-[#F59E0B] font-medium">Belum kembali</div>
              </td>
              <td class="px-4 py-3 font-semibold text-[#1A2332] text-sm align-top">{{ row.nama_staf }}</td>
              <td class="px-4 py-3 align-top">
                <div class="text-sm font-semibold text-[#1A2332]">{{ row.dari_lokasi || 'TNPP' }} → {{ row.destinasi }}</div>
                <div v-for="h in row.senarai_harian" :key="h.id" class="ml-3 mt-1 pl-2 border-l-2 border-[#DBEAFE] text-xs text-[#5A6672]">
                  • {{ formatTarikh(h.tarikh) }}: {{ h.dari_lokasi }} → {{ h.ke_lokasi }}
                </div>
                <div v-if="row.masa_masuk" class="text-xs text-[#C0392B] font-medium mt-1">↩ {{ row.destinasi }} → {{ row.dari_lokasi || 'TNPP' }}</div>
              </td>
              <td class="px-4 py-3 align-top text-sm text-[#5A6672] font-medium whitespace-nowrap">{{ row.odo_mula }} → {{ row.odo_tamat || '...' }}</td>
              <td class="px-4 py-3 text-center align-top">
                <button @click="$emit('edit-rekod', row)" class="bg-white border border-[#DFE3E8] hover:border-[#003479] hover:text-[#003479] text-[#5A6672] px-3 py-1.5 text-xs font-semibold rounded transition-colors">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- FORMAT CETAKAN KERAJAAN                            -->
    <!-- BUTIR-BUTIR PENGGUNAAN KENDERAAN                   -->
    <!-- A4 Landscape — jadual berterusan, thead berulang   -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="hidden print:block text-black w-full print-doc">

      <!-- Pengepala Dokumen — sekali di atas sahaja -->
      <div class="mb-2">
        <p class="text-center font-bold text-[13px] uppercase mb-2 tracking-wide">BUTIR-BUTIR PENGGUNAAN KENDERAAN</p>
        <div class="flex justify-between items-center text-[8px] mb-1">
          <span>Bulan/Tahun: <span class="border-b border-black inline-block min-w-[80px] px-1">{{ formatBulanTahun(filter?.bulanTahun) }}</span></span>
        </div>
        <div class="flex gap-4 text-[8px]">
          <span>JENIS KENDERAAN: <span class="border-b border-black inline-block min-w-[80px] px-1">{{ kenderaanDipilih ? kenderaanDipilih.kategori + ' ' + kenderaanDipilih.model : '..............................' }}</span></span>
          <span>NO. PENDAFTARAN: <span class="border-b border-black inline-block min-w-[60px] px-1">{{ kenderaanDipilih ? kenderaanDipilih.no_plat : '...................' }}</span></span>
          <span>BAHAGIAN/UNIT: <span class="border-b border-black inline-block min-w-[80px] px-1">{{ stesenKenderaan || '..............................' }}</span></span>
        </div>
      </div>

      <!-- Jadual Utama — satu jadual berterusan, thead ulang sendiri tiap halaman -->
      <table class="w-full border-collapse text-[7px] print-table">
        <thead class="print-thead">
          <tr class="font-bold text-center uppercase bg-white text-[6.5px]">
            <th rowspan="2" class="border border-black p-0.5" style="width:5%">Tarikh</th>
            <th colspan="2" class="border border-black p-0.5" style="width:9%">Masa</th>
            <th rowspan="2" class="border border-black p-0.5" style="width:12%">Nama<br>Pemandu</th>
            <th rowspan="2" class="border border-black p-0.5 text-left px-1" style="width:17%">• Tujuan<br>• Destinasi (dari — ke)</th>
            <th rowspan="2" class="border border-black p-0.5" style="width:10%">• Nama<br>Tandatangan<br>Pelulus</th>
            <th rowspan="2" class="border border-black p-0.5" style="width:10%">• Nama<br>Tandatangan<br>Pengguna</th>
            <th rowspan="2" class="border border-black p-0.5" style="width:8%">Bacaan<br>Odometer<br>(Km)</th>
            <th rowspan="2" class="border border-black p-0.5" style="width:6%">Jarak<br>Perjalanan/<br>Trip Meter<br>(Km)</th>
            <th colspan="3" class="border border-black p-0.5" style="width:15%">Pembelian Bahan Api<br>*(Petrol/Diesel/Gas)</th>
            <th rowspan="2" class="border border-black p-0.5" style="width:8%">Arahan Khas<br>Pengguna<br>Kenderaan</th>
          </tr>
          <tr class="font-bold text-center uppercase bg-white text-[6.5px]">
            <th class="border border-black p-0.5">Mulai</th>
            <th class="border border-black p-0.5">Hingga</th>
            <th class="border border-black p-0.5">No. Resit</th>
            <th class="border border-black p-0.5">Pembelian<br>& RM</th>
            <th class="border border-black p-0.5">Liter</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, eIdx) in processedEntries" :key="eIdx" class="data-row">
            <td class="border border-black p-0.5 text-center font-bold">{{ formatTarikhCetak(e.tarikh) }}</td>
            <td class="border border-black p-0.5 text-center">{{ formatMasaCetak(e.masa_mula) }}</td>
            <td class="border border-black p-0.5 text-center">{{ formatMasaCetak(e.masa_tamat) }}</td>
            <td class="border border-black p-0.5 font-bold uppercase leading-tight px-0.5">{{ e.nama_staf }}</td>
            <td class="border border-black p-0.5 text-left leading-tight px-1">
              <span class="font-bold">{{ e.destinasi }}</span>
              <span v-if="e.tujuan" class="block text-[6px] mt-0.5">{{ e.tujuan }}</span>
            </td>
            <td class="border border-black p-0.5 text-left px-0.5 leading-tight font-bold uppercase text-[6.5px]">{{ pegawaiKenderaan }}</td>
            <td class="border border-black p-0.5 text-left px-0.5 leading-tight font-bold uppercase text-[6.5px]">{{ e.nama_staf }}</td>
            <td class="border border-black p-0.5 text-center font-bold leading-tight text-[6.5px]">
              <span v-if="e.odo_mula || e.odo_tamat">{{ e.odo_mula }}<br><span class="text-[5px]">↓</span><br>{{ e.odo_tamat }}</span>
            </td>
            <td class="border border-black p-0.5 text-center font-bold">
              {{ e.odo_tamat && e.odo_mula ? (e.odo_tamat - e.odo_mula) : '' }}
            </td>
            <td class="border border-black p-0.5 text-center text-[6.5px]">{{ e.no_resit || '' }}</td>
            <td class="border border-black p-0.5 text-center font-bold">{{ e.rm ? parseFloat(e.rm).toFixed(2) : '' }}</td>
            <td class="border border-black p-0.5 text-center font-bold">{{ e.liter ? parseFloat(e.liter).toFixed(2) : '' }}</td>
            <td class="border border-black p-0.5"></td>
          </tr>

          <!-- Baris JUMLAH -->
          <tr class="font-bold text-[7px]">
            <td colspan="8" class="border border-black p-0.5 text-right pr-2 font-bold">JUMLAH</td>
            <td class="border border-black p-0.5 text-center">{{ jumlahJarakCetak }}</td>
            <td class="border border-black p-0.5"></td>
            <td class="border border-black p-0.5 text-center">{{ jumlahRMCetak }}</td>
            <td class="border border-black p-0.5 text-center">{{ jumlahLiterCetak }}</td>
            <td class="border border-black p-0.5"></td>
          </tr>
        </tbody>
      </table>

      <!-- Bahagian Ringkasan Bulanan -->
      <div class="mt-2 kadar-section">
        <table class="w-full border-collapse text-[7px] print-table">
          <thead>
            <tr>
              <th colspan="6" class="border border-black p-1 text-left text-[8px] font-bold uppercase">KADAR PENGGUNAAN BAHAN API BULANAN</th>
            </tr>
            <tr class="font-bold text-center uppercase text-[6.5px]">
              <th class="border border-black p-0.5" style="width:14%">Bulan<br>(a)</th>
              <th class="border border-black p-0.5" style="width:17%">Jumlah Jarak<br>Perjalanan (Km)<br>(b)</th>
              <th class="border border-black p-0.5" style="width:17%">Jumlah Penggunaan<br>Bahan Api (Liter)<br>(c)</th>
              <th class="border border-black p-0.5" style="width:17%">Jumlah Pembelian<br>Bahan Api (RM)<br>(d)</th>
              <th class="border border-black p-0.5" style="width:17%">Kadar Penggunaan<br>Bahan Api (Km/Liter)<br>(e)**</th>
              <th class="border border-black p-1 text-left" style="width:18%">
                Disahkan Oleh<br>
                <span class="block mt-1">Tandatangan :</span>
                <span class="block mt-3">Nama &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                <span class="block mt-3">Jawatan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center font-bold" style="height: 36px">
              <td class="border border-black p-0.5 align-top pt-1">{{ formatBulanTahun(filter?.bulanTahun) }}</td>
              <td class="border border-black p-0.5 align-top pt-1">{{ jumlahJarakCetak }}</td>
              <td class="border border-black p-0.5 align-top pt-1">{{ jumlahLiterCetak }}</td>
              <td class="border border-black p-0.5 align-top pt-1">{{ jumlahRMCetak }}</td>
              <td class="border border-black p-0.5 align-top pt-1">{{ kadarCetak }}</td>
              <td class="border border-black p-0.5"></td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between mt-1 text-[6.5px]">
          <span>* potong yang tidak berkenaan</span>
          <span>** Formula Pengiraan, (e) = (b) / (c)</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['laporanList', 'filter', 'senaraiKenderaan', 'pegawaiKenderaan'])

const kenderaanDipilih = computed(() => {
  if (!props.senaraiKenderaan || !props.filter) return null
  return props.senaraiKenderaan.find(k => k.id === props.filter?.kenderaan_id)
})

const stesenKenderaan = computed(() => {
  return kenderaanDipilih.value?.stesen || props.laporanList?.[0]?.stesen || ''
})

const processedEntries = computed(() => {
  let list = []
  props.laporanList.forEach(trip => {
    const stesen = trip.dari_lokasi || 'TNPP'

    // ── Baris PERGI ──────────────────────────────────────
    list.push({
      tarikh: trip.masa_keluar,
      masa_mula: trip.masa_keluar,
      masa_tamat: null,
      nama_staf: trip.nama_staf,
      destinasi: `${stesen} ➔ ${trip.destinasi}`,
      tujuan: trip.tujuan,
      odo_mula: trip.odo_mula,
      odo_tamat: null,
      no_resit: null,
      rm: '',
      liter: ''
    })

    // ── Baris HARIAN (Operasi Luar) ───────────────────────
    trip.senarai_harian.forEach(h => {
      list.push({
        tarikh: h.tarikh,
        masa_mula: null,
        masa_tamat: null,
        nama_staf: trip.nama_staf,
        destinasi: `${h.dari_lokasi} ➔ ${h.ke_lokasi}`,
        tujuan: h.tujuan || trip.tujuan,
        odo_mula: h.odo_mula,
        odo_tamat: h.odo_tamat,
        no_resit: h.no_resit_minyak || null,
        rm: h.jumlah_rm_minyak,
        liter: h.jumlah_liter_minyak
      })
    })

    // ── Baris BALIK ──────────────────────────────────────
    if (trip.masa_masuk) {
      const odoMulaBalik = trip.senarai_harian.length > 0
        ? (trip.senarai_harian[trip.senarai_harian.length - 1]?.odo_tamat || null)
        : trip.odo_mula

      list.push({
        tarikh: trip.masa_masuk,
        masa_mula: null,
        masa_tamat: trip.masa_masuk,
        nama_staf: trip.nama_staf,
        destinasi: `${trip.destinasi} ➔ ${stesen}`,
        tujuan: null,
        odo_mula: odoMulaBalik,
        odo_tamat: trip.odo_tamat,
        no_resit: trip.senarai_harian.length === 0 ? (trip.no_resit_minyak || null) : null,
        rm: trip.senarai_harian.length === 0 ? trip.jumlah_rm_minyak : '',
        liter: trip.senarai_harian.length === 0 ? trip.jumlah_liter_minyak : ''
      })
    }
  })
  return list
})

// Jumlah untuk baris JUMLAH dan ringkasan bulanan
const jumlahJarakCetak = computed(() => {
  const total = processedEntries.value
    .filter(e => e && e.odo_mula != null && e.odo_tamat != null)
    .reduce((sum, e) => sum + (parseFloat(e.odo_tamat) - parseFloat(e.odo_mula)), 0)
  return total > 0 ? total.toFixed(0) : ''
})

const jumlahRMCetak = computed(() => {
  const total = processedEntries.value
    .filter(e => e && e.rm)
    .reduce((sum, e) => sum + parseFloat(e.rm || 0), 0)
  return total > 0 ? total.toFixed(2) : ''
})

const jumlahLiterCetak = computed(() => {
  const total = processedEntries.value
    .filter(e => e && e.liter)
    .reduce((sum, e) => sum + parseFloat(e.liter || 0), 0)
  return total > 0 ? total.toFixed(2) : ''
})

const kadarCetak = computed(() => {
  const km = parseFloat(jumlahJarakCetak.value)
  const liter = parseFloat(jumlahLiterCetak.value)
  return km > 0 && liter > 0 ? (km / liter).toFixed(2) : '—'
})

const formatTarikh = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''
const formatTarikhCetak = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''
const formatMasaCetak = (s) => s ? new Date(s).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''

const formatBulanTahun = (s) => {
  if (!s) return '..............................'
  const [y, m] = s.split('-')
  return new Date(y, m - 1).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }).toUpperCase()
}
</script>

<style scoped>
@media print {
  @page {
    size: A4 landscape;
    margin: 15mm 10mm;
  }

  body {
    background: white !important;
    -webkit-print-color-adjust: exact;
  }

  .print-doc {
    width: 100%;
    color: black !important;
    background: white !important;
  }

  .print-thead {
    display: table-header-group;
  }

  .data-row {
    height: 30px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .kadar-section {
    page-break-inside: avoid;
    break-inside: avoid;
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
