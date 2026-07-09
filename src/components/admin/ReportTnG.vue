<template>
  <div class="w-full">
    
    <div v-show="!showModalCetak" class="no-print">

      <!-- Sub-header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#DFE3E8]">
        <div>
          <h3 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Rekod Kad Touch 'n Go (Lampiran B1)</h3>
          <p class="text-xs text-[#5A6672] mt-0.5">Penggunaan dan baki kad sistem bayaran tol tanpa resit</p>
        </div>
        <button @click="showModalCetak = true" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          Pratonton Lampiran B1
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#F8FAFC] border-b border-[#DFE3E8]">
            <tr>
              <th class="px-4 py-3 text-center text-xs font-semibold text-[#5A6672] uppercase tracking-wide w-10">Bil</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Tarikh Log</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">No. Siri Kad</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Pemandu / Aset</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Perjalanan (Dari ➔ Ke)</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Jenis Rekod</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-[#5A6672] uppercase tracking-wide">Baki Kad (RM)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F2F5]">
            <tr v-if="combinedTngEntries.length === 0">
              <td colspan="7" class="px-4 py-12 text-center text-[#5A6672] text-xs">Tiada rekod penggunaan kad TnG dijumpai.</td>
            </tr>
            <tr v-for="(e, idx) in combinedTngEntries" :key="idx" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="px-4 py-3 text-center text-xs text-[#5A6672] font-medium">{{ idx + 1 }}</td>
              <td class="px-4 py-3 text-sm font-medium text-[#1A2332]">{{ formatTarikh(e.tarikh) }}</td>
              <td class="px-4 py-3 text-sm text-[#1A2332] font-medium">{{ e.no_siri_kad || '—' }}</td>
              <td class="px-4 py-3">
                <p class="font-semibold text-[#1A2332] text-sm">{{ e.nama_staf }}</p>
                <p class="text-xs text-[#003479] font-bold mt-0.5">{{ e.no_plat }}</p>
              </td>
              <td class="px-4 py-3 text-sm text-[#1A2332]">
                <span class="font-semibold">{{ e.dari }}</span> <span class="text-[#5A6672]">➔</span> {{ e.ke }}
              </td>
              <td class="px-4 py-3">
                <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', e.is_harian ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#EDE9FE] text-[#5B21B6]']">
                  {{ e.is_harian ? 'Log Harian' : 'Akhir' }}
                </span>
                <span v-if="e.auto_topup" class="ml-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">
                  ⚡ Auto Topup
                </span>
              </td>
              <td class="px-4 py-3 text-right font-bold text-sm text-[#003479]">
                RM {{ parseFloat(e.baki || 0).toFixed(2) }}
                <span v-if="e.baki_sebelum != null" class="block text-[10px] font-normal text-[#5A6672]">drpd RM {{ parseFloat(e.baki_sebelum).toFixed(2) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModalCetak" class="fixed inset-0 z-50 bg-slate-900 overflow-y-auto print:static print:bg-white print:overflow-visible transition-opacity">
      
      <div class="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 p-4 shadow-xl flex justify-between items-center no-print">
        <div class="flex items-center gap-4">
          <button @click="showModalCetak = false" class="text-slate-300 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 class="text-white font-bold tracking-widest uppercase text-sm">Pratonton Lampiran B1</h2>
            <p class="text-[10px] text-slate-400 font-medium tracking-wide">Sila semak dokumen sebelum menjana PDF.</p>
          </div>
        </div>
        
        <button @click="cetakBorang" class="bg-teal-600 text-white px-8 py-3 rounded-sm text-[11px] font-black hover:bg-teal-500 flex gap-2 items-center uppercase tracking-widest shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all active:scale-95">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Dokumen
        </button>
      </div>

      <div class="p-8 print:p-0 flex flex-col items-center gap-8 print:block">
        <div v-for="(pageChunk, pageIndex) in paginatedTngList" :key="'tngpage'+pageIndex" class="print-page bg-white w-[297mm] min-h-[210mm] p-10 shadow-2xl relative text-black print:w-full print:min-h-0 print:p-0 print:shadow-none print:m-0">
          
          <table class="w-full text-center border-collapse text-[10px] font-medium text-black print-table table-fixed">
            <thead>
              <tr class="no-border-row bg-white">
                <th colspan="15" class="p-0 pb-6 text-left font-normal border-none">
                  <div class="flex justify-between items-start text-[10px] font-bold text-black">
                    <div>Pekeliling Perbendaharaan Malaysia</div>
                    <div class="text-right">
                      <p>WP 4.1 Lampiran B</p>
                      <p class="mt-2 text-[13px] uppercase">LAMPIRAN B1</p>
                    </div>
                  </div>

                  <div class="text-center mt-6 text-black">
                    <p class="text-[14px] font-bold uppercase">FORMAT BUKU REKOD PERGERAKAN DAN PENGGUNAAN KAD SISTEM BAYARAN TOL TANPA RESIT</p>

                    <div class="flex justify-between items-end mt-8 font-bold text-xs uppercase">
                      <div class="flex items-end gap-2">
                        <p>NO. SIRI KAD (NOMBOR KENDERAAN):</p>
                        <div class="border-b-2 border-black w-48 text-left pb-0.5 px-2">
                          <span>{{ filter.kenderaan_id === 'Semua' ? 'SEMUA UNIT' : (kenderaanDipilih?.no_plat || 'SEMUA UNIT') }}</span>
                        </div>
                      </div>
                      <div class="flex items-end gap-2">
                        <p>BULAN / TAHUN:</p>
                        <div class="border-b-2 border-black w-48 text-center pb-0.5 px-2">
                          <span>{{ filter.bulanTahun ? formatBulanTahun(filter.bulanTahun) : '................' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>

              <tr class="bg-white uppercase font-bold text-[8px]">
                <th rowspan="2" class="border border-black p-1.5 w-8">Bil.</th>
                <th rowspan="2" class="border border-black p-1.5 w-20">Tarikh Kad<br>Diambil</th>
                <th rowspan="2" class="border border-black p-1.5 w-20">No. Siri<br>Kad</th>
                <th rowspan="2" class="border border-black p-1.5 w-20">No. Daftar<br>Kenderaan</th>
                <th colspan="2" class="border border-black p-1.5">Pemandu</th>
                <th colspan="2" class="border border-black p-1.5">Pegawai Yang<br>Menyerahkan Kad</th>
                <th colspan="2" class="border border-black p-1.5">Perjalanan</th>
                <th rowspan="2" class="border border-black p-1.5 w-14">Bayaran<br>Tol (RM)</th>
                <th rowspan="2" class="border border-black p-1.5 w-16">Baki* (RM)</th>
                <th rowspan="2" class="border border-black p-1.5 w-20">Tarikh<br>Dikembali<br>kan</th>
                <th colspan="2" class="border border-black p-1.5">Penerima Kad</th>
              </tr>
              <tr class="bg-white uppercase font-bold text-[8px]">
                <th class="border border-black p-1.5 w-24">Nama</th>
                <th class="border border-black p-1.5 w-14">T/tangan</th>
                <th class="border border-black p-1.5 w-24">Nama</th>
                <th class="border border-black p-1.5 w-14">T/tangan</th>
                <th class="border border-black p-1.5 w-20">Dari</th>
                <th class="border border-black p-1.5 w-24">Ke</th>
                <th class="border border-black p-1.5 w-24">Nama</th>
                <th class="border border-black p-1.5 w-14">T/tangan</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(row, rIndex) in pageChunk" :key="'tng-row'+rIndex" class="h-12 bg-white">
                <td class="border border-black p-1 text-[9px]">{{ row ? (pageIndex * 10) + rIndex + 1 : '' }}</td>
                <td class="border border-black p-1 font-bold">{{ row ? formatTarikhPendek(row.tarikh) : '' }}</td>
                <td class="border border-black p-1 font-bold text-[9px] uppercase">{{ row && row.no_siri_kad ? row.no_siri_kad : '-' }}</td>
                <td class="border border-black p-1 font-bold uppercase">{{ row ? row.no_plat : '' }}</td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[8px] font-bold uppercase break-words">{{ row ? row.nama_staf : '' }}</td>
                <td class="border border-black p-1"></td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[8px] font-bold uppercase break-words">{{ row ? pegawaiKenderaan : '' }}</td>
                <td class="border border-black p-1"></td>
                <td class="border border-black p-1 font-bold text-[9px] uppercase leading-tight">{{ row ? row.dari : '' }}</td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[9px] font-medium break-words uppercase">{{ row ? row.ke : '' }}</td>
                <td class="border border-black p-1"></td>
                <td class="border border-black p-1 font-black text-[11px]">{{ row && row.baki ? parseFloat(row.baki).toFixed(2) + (row.auto_topup ? '*' : '') : '' }}</td>
                <td class="border border-black p-1 font-bold">{{ row && !row.is_harian ? formatTarikhPendek(row.tarikh) : '' }}</td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[8px] font-bold uppercase break-words">{{ row && !row.is_harian ? pegawaiKenderaan : '' }}</td>
                <td class="border border-black p-1"></td>
              </tr>
            </tbody>
          </table>
          
          <div class="mt-4 flex justify-between items-center text-[10px] font-bold italic bg-white pb-4">
            <p>Nota : Sila tandakan (*) apabila ditambah nilai secara automatik.</p>
            <p>Muka Surat {{ pageIndex + 1 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps(['laporanList', 'filter', 'senaraiKenderaan', 'pegawaiKenderaan'])

// State untuk mengawal Popup Modal
const showModalCetak = ref(false)

const kenderaanDipilih = computed(() => props.senaraiKenderaan.find(k => k.id === props.filter.kenderaan_id))

const combinedTngEntries = computed(() => {
  let entries = [];

  // Papar trip jika kad TnG ditandakan diambil, ATAU jika ada rekod baki
  // sebenar (staf mungkin catat baki TnG tanpa menandakan togol kad semasa daftar keluar).
  const adaRekodTng = (trip) =>
    trip.ambil_kad_tng ||
    trip.baki_tng !== null ||
    (trip.senarai_harian && trip.senarai_harian.some(h => h.baki_tng !== null));

  props.laporanList.filter(adaRekodTng).forEach(trip => {
    // Baki rujukan berjalan — mula dari baki_tng_mula (baki akhir trip sebelum ini),
    // dikemaskini selepas setiap bacaan supaya auto topup (baki naik drpd rujukan)
    // dapat dikesan secara automatik sepanjang trip, termasuk log harian berturutan.
    let bakiRujukan = trip.baki_tng_mula;

    // 1. Rekod Log Harian
    if (trip.senarai_harian && trip.senarai_harian.length > 0) {
      trip.senarai_harian.forEach((h, index) => {
        if (h.baki_tng !== null) {
          const autoTopup = bakiRujukan !== null && parseFloat(h.baki_tng) > parseFloat(bakiRujukan);
          entries.push({
            tarikh: h.tarikh,
            no_plat: trip.no_plat,
            no_siri_kad: trip.no_siri_kad_tng,
            nama_staf: trip.nama_staf,
            dari: index === 0 ? 'TNPP' : (h.dari_lokasi || 'OPERASI'),
            ke: h.ke_lokasi,
            baki: h.baki_tng,
            baki_sebelum: bakiRujukan,
            auto_topup: autoTopup,
            is_harian: true
          });
          bakiRujukan = h.baki_tng;
        }
      });
    }

    // 2. Rekod Tamat Perjalanan
    if (trip.status_trip === 'Selesai' && trip.baki_tng !== null) {
      let titikMula = trip.destinasi;
      if (trip.senarai_harian && trip.senarai_harian.length > 0) {
        titikMula = trip.senarai_harian[trip.senarai_harian.length - 1].ke_lokasi;
      }
      const autoTopup = bakiRujukan !== null && parseFloat(trip.baki_tng) > parseFloat(bakiRujukan);
      entries.push({
        tarikh: trip.masa_masuk,
        no_plat: trip.no_plat,
        no_siri_kad: trip.no_siri_kad_tng,
        nama_staf: trip.nama_staf,
        dari: trip.senarai_harian.length === 0 ? `TNPP ➔ ${trip.destinasi}` : titikMula,
        ke: 'TNPP',
        baki: trip.baki_tng,
        baki_sebelum: bakiRujukan,
        auto_topup: autoTopup,
        is_harian: false
      });
    }
  });
  
  return entries.sort((a, b) => new Date(a.tarikh) - new Date(b.tarikh));
});

// Chunking - 10 baris
const chunkAndPad = (list, size) => {
  const chunks = [];
  for (let i = 0; i < list.length; i += size) {
    const chunk = list.slice(i, i + size);
    while (chunk.length < size) chunk.push(null); 
    chunks.push(chunk);
  }
  return chunks.length > 0 ? chunks : [Array(size).fill(null)];
}

const paginatedTngList = computed(() => chunkAndPad(combinedTngEntries.value, 10))

// Formatters
const formatTarikh = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const formatTarikhPendek = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
const formatBulanTahun = (s) => {
  if (!s) return '';
  const [y, m] = s.split('-');
  return new Date(y, m - 1).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }).toUpperCase();
}

const cetakBorang = () => window.print()
</script>

<style scoped>
/* Transisi Kemunculan */
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

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
    box-shadow: none !important;
  }

  .print-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  
  .print-table {
    border: 1px solid black !important;
    border-collapse: collapse !important;
    background: white !important;
  }
  
  .print-table th, .print-table td {
    border: 1px solid black !important;
    color: black !important;
    background: white !important;
  }
  
  .print-table tr.no-border-row, 
  .print-table tr.no-border-row th, 
  .print-table tr.no-border-row td {
    border: none !important;
    background: white !important;
  }
  
  .no-print { display: none !important; }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
</style>