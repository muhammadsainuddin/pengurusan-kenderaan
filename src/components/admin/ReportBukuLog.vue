<template>
  <div class="print-area w-full">
    <div class="no-print">
      <div class="flex justify-end mb-6">
        <button @click="cetakBorang" class="bg-gray-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-black transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Buku Log (A4)
        </button>
      </div>
      <table class="w-full text-left border-collapse min-w-[1000px]">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Pemandu / Pengguna</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tarikh & Masa</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Destinasi</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Odo (Mula/Akhir)</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Resit Bahan Api</th>
            <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="row in laporanList" :key="'log'+row.id" class="hover:bg-teal-50/30 transition-colors">
            <td class="p-4">
              <p class="font-bold text-gray-900 text-sm">{{ row.nama_staf }}</p>
              <p v-if="row.nama_pengguna" class="text-[10px] text-teal-700 font-bold uppercase mt-1">Bawa: {{ row.nama_pengguna }}</p>
            </td>
            <td class="p-4 text-sm text-gray-700 font-medium">
              <div class="text-green-700">{{ formatTarikhPanjang(row.masa_keluar) }}</div>
              <div class="text-red-700 mt-1">{{ row.masa_masuk ? formatTarikhPanjang(row.masa_masuk) : 'Sedang Berjalan' }}</div>
            </td>
            <td class="p-4">
              <p class="font-bold text-gray-900 text-sm">{{ row.destinasi }}</p>
              <p class="text-xs text-gray-500">{{ row.tujuan }}</p>
            </td>
            <td class="p-4 text-sm text-gray-700">
              {{ row.odo_mula }} <br> <span class="font-bold">{{ row.odo_tamat || '-' }}</span> <br>
              <span class="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold">{{ row.jumlah_jarak || '-' }} KM</span>
            </td>
            <td class="p-4 text-sm font-bold text-gray-900 bg-gray-50">
              <template v-if="row.senarai_resit && row.senarai_resit.length > 0">
                <div v-for="resit in row.senarai_resit" :key="resit.id" class="mb-1 border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                  RM{{ parseFloat(resit.rm).toFixed(2) }} ({{ resit.liter }}L)<br>
                  <span class="text-[10px] text-gray-500 font-normal">No: {{ resit.no_resit || '-' }}</span>
                </div>
              </template>
              <template v-else>
                {{ row.jumlah_rm_minyak ? `RM ${parseFloat(row.jumlah_rm_minyak).toFixed(2)}` : '-' }}
              </template>
            </td>
            <td class="p-4 text-center">
              <button @click="$emit('edit-rekod', row)" class="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-blue-100 transition-colors shadow-sm">
                Edit Data
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="hidden print:block text-black w-full">
      <div v-for="(pageChunk, pageIndex) in paginatedLogList" :key="'log-page-'+pageIndex" class="print-page w-full pb-8">
        
        <div class="text-right text-[10px] mb-2 font-bold"><p>ASAL</p><p>No. Siri: .............................</p></div>
        <div class="text-center font-bold text-lg mb-6">BUTIR-BUTIR PENGGUNAAN KENDERAAN</div>
        
        <div class="flex justify-between items-end text-[11px] font-bold mb-3">
          <div>Bulan/Tahun: <span v-if="filter.tarikh_mula">{{ formatBulanTahun(filter.tarikh_mula) }}</span><span v-else>.............................</span></div>
          <div>Muka Surat: {{ pageIndex + 1 }} / {{ paginatedLogList.length }}</div>
        </div>
        
        <div class="flex justify-between text-[11px] font-bold mb-2 uppercase">
          <div>JENIS KENDERAAN: {{ kenderaanDipilih?.model || '........................' }}</div>
          <div>NO. PENDAFTARAN: <span class="border-b border-black pb-0.5">{{ kenderaanDipilih?.no_plat || '........................' }}</span></div>
          <div>BAHAGIAN/UNIT: {{ kenderaanDipilih?.stesen || '........................' }}</div>
        </div>

        <table class="w-full text-center border-collapse border-2 border-black text-[10px] font-medium text-black print-table">
          <thead>
            <tr>
              <th rowspan="2" class="border border-black p-1 w-16">Tarikh</th>
              <th colspan="2" class="border border-black p-1 w-20">Masa</th>
              <th rowspan="2" class="border border-black p-1 w-28">Nama<br>Pemandu</th>
              <th rowspan="2" class="border border-black p-1 w-36 text-left px-2">• Tujuan<br>&bull; Destinasi (dari — ke)</th>
              <th rowspan="2" class="border border-black p-1 w-24 text-left px-2">• Nama<br>&bull; Tandatangan<br>&nbsp;&nbsp;Pelulus</th>
              <th rowspan="2" class="border border-black p-1 w-24 text-left px-2">• Nama<br>&bull; Tandatangan<br>&nbsp;&nbsp;Pengguna</th>
              <th rowspan="2" class="border border-black p-1 w-16">Bacaan<br>Odo<br>(Km)</th>
              <th rowspan="2" class="border border-black p-1 w-16">Jarak<br>Perjalanan<br>(Km)</th>
              <th colspan="2" class="border border-black p-1 w-32">Pembelian Bahan Api<br>*(Petrol/Diesel/Gas)</th>
              <th rowspan="2" class="border border-black p-1 w-24">Arahan Khas<br>Pengguna</th>
            </tr>
            <tr>
              <th class="border border-black p-1">Mulai</th>
              <th class="border border-black p-1">Hingga</th>
              <th class="border border-black p-1">No. Resit &<br>RM</th>
              <th class="border border-black p-1">Liter</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, rIndex) in pageChunk" :key="'print-log-row'+rIndex">
              <tr class="h-10">
                <td class="border border-black p-1">{{ row ? formatTarikhPendek(row.masa_keluar) : '' }}</td>
                <td class="border border-black p-1">{{ row ? formatMasa(row.masa_keluar) : '' }}</td>
                <td class="border border-black p-1">{{ row && row.masa_masuk ? formatMasa(row.masa_masuk) : '' }}</td>
                <td class="border border-black p-1 text-left px-1 leading-tight font-bold break-words whitespace-normal max-w-[80px] text-[9px]">{{ row ? row.nama_staf : '' }}</td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[9px] break-words whitespace-normal">
                  <div v-if="row"><span class="font-bold">{{ row.destinasi }}</span><br><span class="text-[8px]">{{ row.tujuan }}</span></div>
                </td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[9px] break-words whitespace-normal">
                  <div v-if="row">Nama: <span class="font-bold">{{ pegawaiKenderaan }}</span><br><br>T/T: </div>
                </td>
                <td class="border border-black p-1 text-left px-1 leading-tight text-[9px] break-words whitespace-normal">
                  <div v-if="row">Nama: <span class="font-bold">{{ row.nama_pengguna || row.nama_staf }}</span><br><br>T/T: </div>
                </td>
                <td class="border border-black p-1 font-bold">{{ row ? row.odo_mula : '' }}</td>
                <td class="border border-black p-1 font-bold">{{ row && row.jumlah_jarak ? row.jumlah_jarak : '' }}</td>
                
                <td class="border border-black p-1 leading-tight text-[9px] break-all max-w-[90px]">
                  <template v-if="row && row.senarai_resit && row.senarai_resit.length > 0">
                    <div v-for="(resit, idx) in row.senarai_resit" :key="idx" :class="{'border-b border-black border-dashed pb-1 mb-1': idx !== row.senarai_resit.length - 1}">
                      {{ resit.no_resit || '-' }}<br><span class="font-bold">RM{{ parseFloat(resit.rm).toFixed(2) }}</span>
                    </div>
                  </template>
                  <template v-else-if="row && row.jumlah_rm_minyak">
                    {{ row.no_resit_minyak || '-' }}<br><span class="font-bold">RM{{ parseFloat(row.jumlah_rm_minyak).toFixed(2) }}</span>
                  </template>
                </td>
                
                <td class="border border-black p-1 font-bold text-[9px]">
                  <template v-if="row && row.senarai_resit && row.senarai_resit.length > 0">
                    <div v-for="(resit, idx) in row.senarai_resit" :key="idx" :class="{'border-b border-black border-dashed pb-1 mb-1': idx !== row.senarai_resit.length - 1}">
                      <br>{{ resit.liter }} </div>
                  </template>
                  <template v-else-if="row && row.jumlah_liter_minyak">
                    <br>{{ row.jumlah_liter_minyak }}
                  </template>
                </td>
                
                <td class="border border-black p-1"></td>
              </tr>
            </template>
            <tr>
              <td colspan="8" class="border border-black p-1 text-right font-bold pr-2">JUMLAH (KERTAS INI SAHAJA)</td>
              <td class="border border-black p-1 font-bold">{{ kiraJarakChunk(pageChunk) }}</td>
              <td class="border border-black p-1"></td>
              <td class="border border-black p-1"></td>
              <td class="border border-black p-1"></td>
            </tr>
          </tbody>
        </table>

        <div class="mt-4">
          <div class="text-center text-[10px] font-bold border-2 border-black border-b-0 p-1 bg-gray-100 uppercase">
            KADAR PENGGUNAAN BAHAN API BULANAN (KESELURUHAN)
          </div>
          <table class="w-full border-collapse border-2 border-black text-[10px] text-center print-table">
            <thead>
              <tr>
                <th class="border border-black p-1 w-20">Bulan<br><br>(a)</th>
                <th class="border border-black p-1 w-24">Jumlah Jarak<br>Perjalanan (Km)<br>(b)</th>
                <th class="border border-black p-1 w-28">Jumlah Penggunaan<br>Bahan Api (Liter)<br>(c)</th>
                <th class="border border-black p-1 w-28">Jumlah Pembelian<br>Bahan Api (RM)<br>(d)</th>
                <th class="border border-black p-1 w-28">Kadar Penggunaan<br>Bahan Api (Km/Liter)<br>(e)**</th>
                <th class="border border-black p-1 text-left px-2 align-top h-20">
                  Disahkan Oleh<br><br>
                  <div class="flex font-normal mt-1"><span class="w-20">Tandatangan</span>:</div>
                  <div class="flex font-normal mt-1"><span class="w-20">Nama</span>: <span class="font-bold">{{ pegawaiKenderaan }}</span></div>
                  <div class="flex font-normal mt-1"><span class="w-20">Jawatan</span>: Pegawai Kenderaan</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-black p-1 font-bold h-6">{{ filter.tarikh_mula ? formatBulanTahun(filter.tarikh_mula) : '' }}</td>
                <td class="border border-black p-1 font-bold">{{ jumlahTotalJarak }}</td>
                <td class="border border-black p-1 font-bold">{{ jumlahTotalLiter }}</td>
                <td class="border border-black p-1 font-bold">{{ jumlahTotalRM }}</td>
                <td class="border border-black p-1 font-bold">{{ kadarKmPerLiter }}</td>
                <td class="border border-black p-1"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ laporanList: Array, filter: Object, senaraiKenderaan: Array, pegawaiKenderaan: String })
defineEmits(['edit-rekod'])

const kenderaanDipilih = computed(() => props.senaraiKenderaan.find(k => k.id === props.filter.kenderaan_id))

const chunkAndPad = (list, size) => {
  if (!list || list.length === 0) return [Array.from({ length: size }, () => null)]
  const chunks = []; for (let i = 0; i < list.length; i += size) { const chunk = list.slice(i, i + size); while (chunk.length < size) chunk.push(null); chunks.push(chunk) }
  return chunks
}

const paginatedLogList = computed(() => chunkAndPad(props.laporanList, 11))

const jumlahTotalJarak = computed(() => { let t=0; props.laporanList.forEach(r => t += (parseFloat(r.jumlah_jarak)||0)); return t>0?t.toFixed(1):'' })
const jumlahTotalLiter = computed(() => { let t=0; props.laporanList.forEach(r => t += (parseFloat(r.jumlah_liter_minyak)||0)); return t>0?t.toFixed(2):'' })
const jumlahTotalRM = computed(() => { let t=0; props.laporanList.forEach(r => t += (parseFloat(r.jumlah_rm_minyak)||0)); return t>0?t.toFixed(2):'' })
const kadarKmPerLiter = computed(() => { const km = parseFloat(jumlahTotalJarak.value)||0; const ltr = parseFloat(jumlahTotalLiter.value)||0; if (ltr>0) return (km/ltr).toFixed(2); return '' })

const kiraJarakChunk = (c) => { let t=0; c.forEach(r => {if(r) t+=(parseFloat(r.jumlah_jarak)||0)}); return t>0?t.toFixed(1):'' }

const formatTarikhPanjang = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false }) : '-'
const formatTarikhPendek = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: 'numeric', month: 'numeric', year: '2-digit' }) : ''
const formatMasa = (str) => str ? new Date(str).toLocaleTimeString('ms-MY', { hour: '2-digit', minute:'2-digit', hour12: false }) : ''
const formatBulanTahun = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }) : ''

const cetakBorang = () => window.print()
</script>