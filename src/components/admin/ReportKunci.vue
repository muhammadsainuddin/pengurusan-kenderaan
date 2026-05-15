<template>
  <table class="w-full text-left border-collapse min-w-[800px] no-print-if-not-active">
    <thead class="bg-gray-50 border-b border-gray-200">
      <tr>
        <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Penyimpan Kunci</th>
        <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Waktu Ambil Kunci</th>
        <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Waktu Pulang Kunci</th>
        <th class="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status Serahan</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <tr v-for="row in laporanList" :key="'kunci'+row.id" class="hover:bg-teal-50/30 transition-colors">
        <td class="p-4">
          <p class="font-bold text-gray-900 text-sm">{{ row.nama_staf }}</p>
          <p class="text-xs text-gray-500">{{ row.jabatan }}</p>
        </td>
        <td class="p-4 text-sm text-gray-700 font-medium">{{ formatTarikhPanjang(row.masa_keluar) }}</td>
        <td class="p-4 text-sm text-gray-700 font-medium">{{ row.masa_masuk ? formatTarikhPanjang(row.masa_masuk) : 'Belum Dipulangkan' }}</td>
        <td class="p-4">
          <span :class="['text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider', row.status_trip === 'Selesai' ? 'bg-gray-100 text-gray-700' : 'bg-teal-100 text-teal-800']">
            {{ row.status_trip === 'Selesai' ? 'Diserahkan' : 'Pada Staf' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({ laporanList: Array, pegawaiKenderaan: String })
const formatTarikhPanjang = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false }) : '-'
</script>

<style scoped>
@media print {
  /* Hilangkan margin default browser */
  @page {
    size: A4 landscape; /* Buku log biasanya memanjang */
    margin: 10mm;
  }

  body {
    background: white !important;
  }

  /* Elakkan kandungan terpotong di tengah jalan */
  .print-page {
    page-break-after: always;
    page-break-inside: avoid;
    width: 277mm; /* Lebar tepat A4 landscape - margin */
    margin: 0 auto;
    color: black !important;
  }

  /* Pastikan border table jelas bila print */
  .print-table, .print-table th, .print-table td {
    border: 1px solid black !important;
    color: black !important;
  }

  .no-print {
    display: none !important;
  }
}

/* UI di skrin monitor */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
</style>