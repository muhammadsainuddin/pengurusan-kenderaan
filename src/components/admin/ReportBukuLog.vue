<template>
  <div class="w-full">
    <div class="no-print">
      <table class="w-full text-left border-collapse min-w-[1000px]">
        <thead class="bg-slate-50 border-b-2 border-slate-200">
          <tr class="text-[10px] font-black text-slate-500 uppercase">
            <th class="p-4 w-16">Tarikh</th>
            <th class="p-4">Pemandu</th>
            <th class="p-4">Perjalanan Lengkap (Operasi Luar)</th>
            <th class="p-4 w-32">Odometer</th>
            <th class="p-4 text-center">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="row in laporanList" :key="row.id" class="hover:bg-slate-50">
            <td class="p-4 align-top font-bold text-xs">{{ formatTarikh(row.masa_keluar) }}</td>
            <td class="p-4 align-top font-black text-xs uppercase">{{ row.nama_staf }}</td>
            <td class="p-4">
              <div class="font-bold text-xs">MULA: {{ row.destinasi }}</div>
              <div v-for="h in row.senarai_harian" :key="h.id" class="ml-4 mt-1 pl-2 border-l-2 border-teal-200 text-[10px] text-slate-500">
                • {{ formatTarikh(h.tarikh) }}: {{ h.dari_lokasi }} → {{ h.ke_lokasi }} (Odo: {{ h.odo_mula }}-{{ h.odo_tamat }})
              </div>
              <div v-if="row.masa_masuk" class="text-red-700 font-bold text-[10px] mt-1 italic">TAMAT: Kembali ke Stesen</div>
            </td>
            <td class="p-4 align-top text-xs font-bold">{{ row.odo_mula }} → {{ row.odo_tamat || '...' }}</td>
            <td class="p-4 text-center align-top">
              <button @click="$emit('edit-rekod', row)" class="bg-white border-2 border-slate-300 px-3 py-1 text-[10px] font-black uppercase">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="hidden print:block text-black w-full">
      <div v-for="(pageChunk, pIdx) in paginatedEntries" :key="pIdx" class="print-page w-full pb-8">
        <div class="text-center font-bold text-lg mb-6 uppercase">BUTIR-BUTIR PENGGUNAAN KENDERAAN</div>
        <table class="w-full border-collapse border-2 border-black text-[9px] print-table">
          <thead>
            <tr>
              <th rowspan="2" class="border border-black p-1">Tarikh</th>
              <th colspan="2" class="border border-black p-1">Masa</th>
              <th rowspan="2" class="border border-black p-1">Pemandu</th>
              <th rowspan="2" class="border border-black p-1 text-left px-2">Tujuan & Destinasi</th>
              <th rowspan="2" class="border border-black p-1">Bacaan Odometer</th>
              <th rowspan="2" class="border border-black p-1">Km</th>
              <th colspan="2" class="border border-black p-1">Bahan Api</th>
            </tr>
            <tr>
              <th class="border border-black p-1">Mula</th>
              <th class="border border-black p-1">Tamat</th>
              <th class="border border-black p-1">RM</th>
              <th class="border border-black p-1">Liter</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, eIdx) in pageChunk" :key="eIdx" class="h-14">
              <td class="border border-black p-1 font-bold text-center">{{ e ? formatTarikh(e.tarikh) : '' }}</td>
              <td class="border border-black p-1 text-center">{{ e ? formatMasa(e.masa_mula) : '' }}</td>
              <td class="border border-black p-1 text-center">{{ e ? formatMasa(e.masa_tamat) : '' }}</td>
              <td class="border border-black p-1 font-bold uppercase">{{ e?.nama_staf || '' }}</td>
              <td class="border border-black p-1 text-left leading-tight">
                <div v-if="e"><span class="font-bold">{{ e.destinasi }}</span><br>{{ e.tujuan }}</div>
              </td>
              <td class="border border-black p-1 font-bold text-center">
                <div v-if="e">{{ e.odo_mula }}<br>↓<br>{{ e.odo_tamat }}</div>
              </td>
              <td class="border border-black p-1 font-bold text-center">{{ e ? (e.odo_tamat - e.odo_mula) : '' }}</td>
              <td class="border border-black p-1 text-center">{{ e?.rm ? `RM${e.rm}` : '-' }}</td>
              <td class="border border-black p-1 text-center">{{ e?.liter ? `${e.liter}L` : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['laporanList', 'filter', 'senaraiKenderaan', 'pegawaiKenderaan'])

const processedEntries = computed(() => {
  let list = [];
  props.laporanList.forEach(trip => {
    // Baris 1: Checkout dari TNPP
    list.push({
      tarikh: trip.masa_keluar, masa_mula: trip.masa_keluar, 
      masa_tamat: trip.senarai_harian.length > 0 ? null : trip.masa_masuk,
      nama_staf: trip.nama_staf, destinasi: `TNPP ➔ ${trip.destinasi}`,
      tujuan: trip.tujuan, odo_mula: trip.odo_mula,
      odo_tamat: trip.senarai_harian.length > 0 ? trip.senarai_harian[0].odo_mula : trip.odo_tamat,
      rm: trip.jumlah_rm_minyak, liter: trip.jumlah_liter_minyak
    });
    // Baris 2..N: Log Harian
    trip.senarai_harian.forEach(h => {
      list.push({
        tarikh: h.tarikh, masa_mula: null, masa_tamat: null,
        nama_staf: trip.nama_staf, destinasi: `${h.dari_lokasi} ➔ ${h.ke_lokasi}`,
        tujuan: h.tujuan || trip.tujuan, odo_mula: h.odo_mula, odo_tamat: h.odo_tamat,
        rm: h.jumlah_rm_minyak, liter: h.jumlah_liter_minyak
      });
    });
    // Baris Akhir: Kembali ke TNPP
    if (trip.status_trip === 'Selesai' && trip.senarai_harian.length > 0) {
      list.push({
        tarikh: trip.masa_masuk, masa_mula: null, masa_tamat: trip.masa_masuk,
        nama_staf: trip.nama_staf, destinasi: `KEMBALI KE TNPP`,
        tujuan: 'Tamat Operasi Luar', 
        odo_mula: trip.senarai_harian[trip.senarai_harian.length-1].odo_tamat,
        odo_tamat: trip.odo_tamat, rm: '', liter: ''
      });
    }
  });
  return list;
});

const paginatedEntries = computed(() => {
  const size = 10; const chunks = [];
  for (let i = 0; i < processedEntries.value.length; i += size) {
    const chunk = processedEntries.value.slice(i, i + size);
    while (chunk.length < size) chunk.push(null);
    chunks.push(chunk);
  }
  return chunks.length > 0 ? chunks : [Array(size).fill(null)];
});

const formatTarikh = (s) => s ? new Date(s).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
const formatMasa = (s) => s ? new Date(s).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':','')+'h' : '';
</script>