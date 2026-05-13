<template>
  <div class="print-area w-full">
    <div class="no-print">
      <div class="flex justify-end mb-6">
        <button @click="cetakBorang" class="bg-gray-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-black transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Lampiran A2 (A4)
        </button>
      </div>

      <table class="w-full text-left border-collapse min-w-[1000px]">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Pemandu</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tarikh Keluar</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Destinasi</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Liter Minyak</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Harga (RM)</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">No. Resit</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="row in laporanList.filter(r => r.ambil_kad_minyak)" :key="'web-minyak'+row.id" class="hover:bg-teal-50/30 transition-colors">
            <td class="p-4 font-bold text-gray-900 text-sm">{{ row.nama_staf }}</td>
            <td class="p-4 text-sm text-gray-700 font-medium">{{ formatTarikhPanjang(row.masa_keluar) }}</td>
            <td class="p-4 text-sm text-gray-700">{{ row.destinasi }}</td>
            <td class="p-4 text-sm font-bold text-gray-900">
              <template v-if="row.senarai_resit && row.senarai_resit.length > 0">
                <div v-for="(resit, idx) in row.senarai_resit" :key="idx" class="mb-1">{{ resit.liter }} L</div>
              </template>
              <template v-else>{{ row.jumlah_liter_minyak ? `${row.jumlah_liter_minyak} L` : '-' }}</template>
            </td>
            <td class="p-4 text-sm font-bold text-gray-900 bg-gray-50">
              <template v-if="row.senarai_resit && row.senarai_resit.length > 0">
                <div v-for="(resit, idx) in row.senarai_resit" :key="idx" class="mb-1">RM {{ parseFloat(resit.rm).toFixed(2) }}</div>
              </template>
              <template v-else>{{ row.jumlah_rm_minyak ? `RM ${parseFloat(row.jumlah_rm_minyak).toFixed(2)}` : '-' }}</template>
            </td>
            <td class="p-4 text-sm font-bold text-gray-500 uppercase">
              <template v-if="row.senarai_resit && row.senarai_resit.length > 0">
                <div v-for="(resit, idx) in row.senarai_resit" :key="idx" class="mb-1">{{ resit.no_resit || '-' }}</div>
              </template>
              <template v-else>{{ row.no_resit_minyak || '-' }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="hidden print:block text-black w-full">
      <div v-for="(pageChunk, pageIndex) in paginatedMinyakList" :key="'minyakpage'+pageIndex" class="print-page w-full pb-8">
        <div class="flex justify-between items-start mb-6 text-sm font-medium text-black print:text-black">
          <div>Pekeliling Perbendaharaan Malaysia</div>
          <div class="text-right"><p>WP 4.1 Lampiran A</p><p class="font-bold mt-4">LAMPIRAN A2</p></div>
        </div>

        <div class="text-center mb-6 text-black print:text-black">
          <p class="text-[15px] font-bold">FORMAT REKOD PERGERAKAN KAD INDEN</p>
          <div class="flex justify-start items-end gap-2 mt-6 font-bold text-sm">
            <p>NO. SIRI KAD:</p>
            <div class="border-b border-black w-48 h-5 flex items-end pb-0.5">
              <span v-if="filter.kenderaan_id">{{ kenderaanDipilih?.no_plat }}</span>
            </div>
          </div>
        </div>

        <table class="w-full text-center border-collapse border-2 border-black text-[11px] font-medium text-black print:text-[10px] print:text-black print-table table-fixed">
          <thead>
            <tr>
              <th rowspan="2" class="border border-black p-1.5 font-bold w-6">Bil.</th>
              <th rowspan="2" class="border border-black p-1.5 font-bold w-16">Tarikh Kad<br>Diambil</th>
              <th colspan="2" class="border border-black p-1.5 font-bold">Pegawai Yang<br>Menyerahkan Kad</th>
              <th colspan="2" class="border border-black p-1.5 font-bold">Pemandu</th>
              <th rowspan="2" class="border border-black p-1.5 font-bold w-16">Tarikh<br>Dikembali<br>kan</th>
              <th colspan="2" class="border border-black p-1.5 font-bold">Penerima Kad Yang<br>Dikembalikan</th>
              <th colspan="2" class="border border-black p-1.5 font-bold">Jumlah Diisi</th>
              <th rowspan="2" class="border border-black p-1.5 font-bold w-20">No. Resit</th>
            </tr>
            <tr>
              <th class="border border-black p-1.5 font-bold w-24">Nama</th>
              <th class="border border-black p-1.5 font-bold w-12">T/tangan</th>
              <th class="border border-black p-1.5 font-bold w-24">Nama</th>
              <th class="border border-black p-1.5 font-bold w-12">T/tangan</th>
              <th class="border border-black p-1.5 font-bold w-24">Nama</th>
              <th class="border border-black p-1.5 font-bold w-12">T/tangan</th>
              <th class="border border-black p-1.5 font-bold w-10">Liter</th>
              <th class="border border-black p-1.5 font-bold w-12">RM</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, rIndex) in pageChunk" :key="'minyak-row'+rIndex">
              <tr class="h-10 hover:bg-gray-50 print:hover:bg-transparent">
                <td class="border border-black p-1">{{ row ? (pageIndex * 12) + rIndex + 1 : '' }}</td>
                <td class="border border-black p-1">{{ row ? formatTarikhPendek(row.masa_keluar) : '' }}</td>
                <td class="border border-black p-1 text-left px-1 break-words whitespace-normal leading-tight text-[9px] font-bold">{{ row ? pegawaiKenderaan : '' }}</td>
                <td class="border border-black p-1"></td>
                <td class="border border-black p-1 text-left px-1 break-words whitespace-normal leading-tight text-[9px]">{{ row ? row.nama_staf : '' }}</td>
                <td class="border border-black p-1"></td>
                <td class="border border-black p-1">{{ row && row.masa_masuk ? formatTarikhPendek(row.masa_masuk) : '' }}</td>
                <td class="border border-black p-1 text-left px-1 break-words whitespace-normal leading-tight text-[9px] font-bold">{{ row && row.masa_masuk ? pegawaiKenderaan : '' }}</td>
                <td class="border border-black p-1"></td>
                
                <td class="border border-black p-1 font-bold text-[9px]">
                  <template v-if="row && row.senarai_resit && row.senarai_resit.length > 0">
                    <div v-for="(resit, idx) in row.senarai_resit" :key="idx" :class="{'border-b border-black border-dashed pb-1 mb-1': idx !== row.senarai_resit.length - 1}">{{ resit.liter }}</div>
                  </template>
                  <template v-else-if="row">{{ row.jumlah_liter_minyak || '-' }}</template>
                </td>
                
                <td class="border border-black p-1 font-bold text-[9px]">
                  <template v-if="row && row.senarai_resit && row.senarai_resit.length > 0">
                    <div v-for="(resit, idx) in row.senarai_resit" :key="idx" :class="{'border-b border-black border-dashed pb-1 mb-1': idx !== row.senarai_resit.length - 1}">{{ resit.rm }}</div>
                  </template>
                  <template v-else-if="row">{{ row.jumlah_rm_minyak || '-' }}</template>
                </td>
                
                <td class="border border-black p-1 break-words whitespace-normal leading-tight text-[9px]">
                  <template v-if="row && row.senarai_resit && row.senarai_resit.length > 0">
                    <div v-for="(resit, idx) in row.senarai_resit" :key="idx" :class="{'border-b border-black border-dashed pb-1 mb-1': idx !== row.senarai_resit.length - 1}">{{ resit.no_resit || '-' }}</div>
                  </template>
                  <template v-else-if="row">{{ row.no_resit_minyak || '-' }}</template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <p class="text-[10px] text-black mt-2 font-medium text-left">(Muka Surat {{ pageIndex + 1 }})</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ laporanList: Array, filter: Object, senaraiKenderaan: Array, pegawaiKenderaan: String })
const kenderaanDipilih = computed(() => props.senaraiKenderaan.find(k => k.id === props.filter.kenderaan_id))

const formatTarikhPanjang = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false }) : '-'
const formatTarikhPendek = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: 'numeric', month: 'numeric', year: '2-digit' }) : ''
const chunkAndPad = (list, size) => {
  if (!list || list.length === 0) return [Array.from({ length: size }, () => null)]
  const chunks = []; for (let i = 0; i < list.length; i += size) { const chunk = list.slice(i, i + size); while (chunk.length < size) chunk.push(null); chunks.push(chunk) }
  return chunks
}
const paginatedMinyakList = computed(() => chunkAndPad(props.laporanList.filter(r => r.ambil_kad_minyak), 12))
const cetakBorang = () => window.print()
</script>