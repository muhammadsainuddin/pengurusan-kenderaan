<template>
  <div class="w-full">
    
    <div v-show="!showModalCetak" class="space-y-6 p-1 animate-fade-in">
      <div class="flex justify-between items-end border-b-2 border-slate-100 pb-4">
        <div>
          <h3 class="text-[11px] font-black uppercase tracking-widest text-slate-500">Semakan Pergerakan Kad Inden</h3>
          <p class="text-2xl font-bold text-slate-800 tracking-tight">Lampiran A2: Rekod Kad Inden</p>
        </div>
        
        <button @click="showModalCetak = true" class="bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-sm shadow-lg transition-all flex items-center gap-3 border-2 border-slate-800 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          Pratonton Lampiran A2
        </button>
      </div>

      <div class="bg-white border-2 border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead class="bg-slate-50 border-b-2 border-slate-800">
            <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <th class="p-4 w-12 text-center">Bil</th>
              <th class="p-4">Tarikh (Keluar - Masuk)</th>
              <th class="p-4">Aset</th>
              <th class="p-4">Pemandu</th>
              <th class="p-4">No. Resit</th>
              <th class="p-4 text-center">Kuantiti (L)</th>
              <th class="p-4 text-center">Jumlah (RM)</th>
              <th class="p-4 text-center">Jenis Log</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="combinedFuelEntries.length === 0">
              <td colspan="8" class="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tiada rekod pergerakan kad inden dijumpai.</td>
            </tr>
            <tr v-for="(e, idx) in combinedFuelEntries" :key="idx" class="hover:bg-slate-50 transition-colors">
              <td class="p-4 text-center text-xs font-bold text-slate-400">{{ idx + 1 }}</td>
              <td class="p-4 text-xs font-bold text-slate-900">
                {{ formatTarikh(e.tarikh_mula) }} <span class="text-slate-400 font-normal">➔</span> {{ e.tarikh_tamat ? formatTarikh(e.tarikh_tamat) : 'Belum Pulang' }}
              </td>
              <td class="p-4 text-xs font-bold uppercase text-slate-500">{{ e.no_plat }}</td>
              <td class="p-4 text-xs font-black uppercase text-slate-800">{{ e.nama_staf }}</td>
              <td class="p-4 text-xs font-bold text-slate-600">{{ e.no_resit || '-' }}</td>
              <td class="p-4 text-xs font-black text-center">{{ e.liter ? `${e.liter} L` : '-' }}</td>
              <td class="p-4 text-xs font-black text-blue-700 text-center">{{ e.rm ? `RM ${parseFloat(e.rm).toFixed(2)}` : '-' }}</td>
              <td class="p-4 text-center">
                <span :class="['text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter border', e.is_harian ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-100 text-slate-600 border-slate-200']">
                  {{ e.is_harian ? 'Log Harian' : 'Utama' }}
                </span>
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
            <h2 class="text-white font-bold tracking-widest uppercase text-sm">Pratonton Lampiran A2</h2>
            <p class="text-[10px] text-slate-400 font-medium tracking-wide">Rekod Pergerakan Kad Inden (A4 Landscape)</p>
          </div>
        </div>
        
        <button @click="cetakBorang" class="bg-teal-600 text-white px-8 py-3 rounded-sm text-[11px] font-black hover:bg-teal-500 flex gap-2 items-center uppercase tracking-widest shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all active:scale-95">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Dokumen
        </button>
      </div>

      <div class="p-8 print:p-0 flex flex-col items-center gap-8 print:block bg-slate-900 print:bg-white">
        <div v-for="(pageChunk, pageIndex) in paginatedFuelList" :key="'minyakpage'+pageIndex" class="print-page bg-white w-[297mm] min-h-[210mm] p-10 shadow-2xl relative text-black print:w-full print:min-h-0 print:p-0 print:shadow-none print:m-0 flex flex-col justify-between">
          
          <div>
            <table class="w-full text-center border-collapse border border-black text-[10px] font-medium text-black print-table table-fixed bg-white">
              <thead>
                <tr class="no-border-row bg-white">
                  <th colspan="12" class="p-0 pb-6 text-left font-normal border-none bg-white">
                    <div class="flex justify-between items-start text-[10px] font-bold text-black">
                      <div>Pekeliling Perbendaharaan Malaysia</div>
                      <div class="text-right">
                        <p>WP 4.1 Lampiran A</p>
                        <p class="mt-2 text-[13px] uppercase">LAMPIRAN A2</p>
                      </div>
                    </div>

                    <div class="text-center mt-6 text-black">
                      <p class="text-[14px] font-bold uppercase">FORMAT REKOD PERGERAKAN KAD INDEN</p>
                      
                      <div class="flex justify-between items-end mt-8 font-bold text-xs uppercase">
                        <div class="flex items-end gap-2">
                          <p>NO. SIRI KAD:</p>
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
                  <th rowspan="2" class="border border-black p-1 w-8">Bil.</th>
                  <th rowspan="2" class="border border-black p-1 w-20">Tarikh Kad<br>Diambil</th>
                  <th colspan="2" class="border border-black p-1">Pegawai Yang<br>Menyerahkan Kad</th>
                  <th colspan="2" class="border border-black p-1">Pemandu</th>
                  <th rowspan="2" class="border border-black p-1 w-20">Tarikh<br>Dikembali<br>kan</th>
                  <th colspan="2" class="border border-black p-1">Penerima Kad Yang<br>Dikembalikan</th>
                  <th colspan="2" class="border border-black p-1">Jumlah Diisi</th>
                  <th rowspan="2" class="border border-black p-1 w-20">No. Resit</th>
                </tr>
                <tr class="bg-white uppercase font-bold text-[8px]">
                  <th class="border border-black p-1 w-24">Nama</th>
                  <th class="border border-black p-1 w-14">T/tangan</th>
                  <th class="border border-black p-1 w-24">Nama</th>
                  <th class="border border-black p-1 w-14">T/tangan</th>
                  <th class="border border-black p-1 w-24">Nama</th>
                  <th class="border border-black p-1 w-14">T/tangan</th>
                  <th class="border border-black p-1 w-16">Liter</th>
                  <th class="border border-black p-1 w-16">RM</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(row, rIndex) in pageChunk" :key="'inden-row'+rIndex" class="h-12 bg-white">
                  <td class="border border-black p-1 text-[9px]">{{ row ? (pageIndex * 10) + rIndex + 1 : '' }}</td>
                  <td class="border border-black p-1 font-bold">{{ row ? formatTarikhPendek(row.tarikh_mula) : '' }}</td>
                  <td class="border border-black p-1 text-left px-1 leading-tight text-[8px] font-bold uppercase break-words">{{ row ? pegawaiKenderaan : '' }}</td>
                  <td class="border border-black p-1"></td>
                  <td class="border border-black p-1 text-left px-1 leading-tight text-[8px] font-bold uppercase break-words">{{ row ? row.nama_staf : '' }}</td>
                  <td class="border border-black p-1"></td>
                  <td class="border border-black p-1 font-bold">{{ row && row.tarikh_tamat ? formatTarikhPendek(row.tarikh_tamat) : '' }}</td>
                  <td class="border border-black p-1 text-left px-1 leading-tight text-[8px] font-bold uppercase break-words">{{ row && row.tarikh_tamat ? pegawaiKenderaan : '' }}</td>
                  <td class="border border-black p-1"></td>
                  <td class="border border-black p-1 font-black text-[10px]">{{ row && row.liter ? row.liter : '-' }}</td>
                  <td class="border border-black p-1 font-black text-[10px]">{{ row && row.rm ? parseFloat(row.rm).toFixed(2) : '-' }}</td>
                  <td class="border border-black p-1 font-bold text-[9px] uppercase">{{ row && row.no_resit ? row.no_resit : '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 text-[10px] font-bold text-left bg-white pb-2">
            (Muka Surat {{ pageIndex + 1 }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps(['laporanList', 'filter', 'senaraiKenderaan', 'pegawaiKenderaan'])
const showModalCetak = ref(false)
const kenderaanDipilih = computed(() => props.senaraiKenderaan.find(k => k.id === props.filter.kenderaan_id))

/**
 * LOGIK REKOD PERGERAKAN:
 * Memaparkan setiap kali kad keluar, sama ada isi minyak atau tidak.
 */
const combinedFuelEntries = computed(() => {
  let entries = [];
  
  props.laporanList.filter(trip => trip.ambil_kad_minyak).forEach(trip => {
    let fuelFilled = false;
    
    // 1. Minyak Trip Utama
    if (trip.jumlah_rm_minyak > 0) {
      fuelFilled = true;
      entries.push({
        tarikh_mula: trip.masa_keluar,
        tarikh_tamat: trip.masa_masuk,
        no_plat: trip.no_plat,
        nama_staf: trip.nama_staf,
        no_resit: trip.no_resit_minyak,
        rm: trip.jumlah_rm_minyak,
        liter: trip.jumlah_liter_minyak,
        is_harian: false,
        tarikh_sort: trip.masa_keluar
      });
    }

    // 2. Minyak Log Harian
    if (trip.senarai_harian && trip.senarai_harian.length > 0) {
      trip.senarai_harian.forEach(h => {
        if (h.jumlah_rm_minyak > 0) {
          fuelFilled = true;
          entries.push({
            tarikh_mula: h.tarikh,
            tarikh_tamat: h.tarikh, 
            no_plat: trip.no_plat,
            nama_staf: trip.nama_staf,
            no_resit: h.no_resit_minyak,
            rm: h.jumlah_rm_minyak,
            liter: h.jumlah_liter_minyak,
            is_harian: true,
            tarikh_sort: h.tarikh
          });
        }
      });
    }

    // 3. Jika bawa kad tapi tidak isi minyak (Rekod Pergerakan Sahaja)
    if (!fuelFilled) {
      entries.push({
        tarikh_mula: trip.masa_keluar,
        tarikh_tamat: trip.masa_masuk,
        no_plat: trip.no_plat,
        nama_staf: trip.nama_staf,
        no_resit: null,
        rm: null,
        liter: null,
        is_harian: false,
        tarikh_sort: trip.masa_keluar
      });
    }
  });
  
  return entries.sort((a, b) => new Date(a.tarikh_sort) - new Date(b.tarikh_sort));
});

// Chunking 10 Rekod semuka surat (Dikekalkan untuk A4 yang lapang)
const chunkAndPad = (list, size) => {
  const chunks = [];
  for (let i = 0; i < list.length; i += size) {
    const chunk = list.slice(i, i + size);
    while (chunk.length < size) chunk.push(null);
    chunks.push(chunk);
  }
  return chunks.length > 0 ? chunks : [Array(size).fill(null)];
}

const paginatedFuelList = computed(() => chunkAndPad(combinedFuelEntries.value, 10))

// Formatters
const formatTarikh = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const formatTarikhPendek = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: 'numeric', month: 'numeric', year: '2-digit' }) : '';
const formatBulanTahun = (s) => {
  if (!s) return '';
  const [y, m] = s.split('-');
  return new Date(y, m - 1).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }).toUpperCase();
}

const cetakBorang = () => window.print()
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

@media print {
  @page { size: A4 landscape; margin: 10mm; }
  body { background: white !important; -webkit-print-color-adjust: exact; }
  
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
  
  .print-page:last-child { page-break-after: auto; break-after: auto; }
  
  .print-table { border: 1px solid black !important; border-collapse: collapse !important; background: white !important; }
  .print-table th, .print-table td { border: 1px solid black !important; color: black !important; background: white !important; }
  .print-table tr.no-border-row, .print-table tr.no-border-row th, .print-table tr.no-border-row td { border: none !important; background: white !important; }
  
  .no-print { display: none !important; }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
</style>