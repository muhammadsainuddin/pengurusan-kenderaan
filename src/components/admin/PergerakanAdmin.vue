<template>
  <div class="space-y-6 animate-fade-in no-print">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <div>
        <h2 class="text-xl font-black text-slate-800 uppercase tracking-widest">Log & Rekod Pergerakan</h2>
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Sejarah penggunaan aset secara menyeluruh</p>
      </div>
      <button @click="bukaModalManual" class="bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-md transition-all">
        + Tambah Rekod Manual
      </button>
    </div>

    <div class="bg-white border-2 border-slate-800 rounded-sm shadow-sm overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 border-b-2 border-slate-800 text-[10px] uppercase font-black tracking-widest text-slate-500">
            <tr>
              <th class="px-6 py-4">Tarikh & Pemandu</th>
              <th class="px-6 py-4">Aset</th>
              <th class="px-6 py-4">Destinasi</th>
              <th class="px-6 py-4">Odometer</th>
              <th class="px-6 py-4">Jarak</th>
              <th class="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="rekodList.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tiada rekod dijumpai.</td>
            </tr>
            <tr v-for="rekod in rekodList" :key="rekod.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-black text-slate-900 uppercase text-[12px]">{{ rekod.nama_staf }}</p>
                <p class="text-[10px] text-slate-500 mt-0.5 font-bold">{{ formatTarikhPendek(rekod.masa_keluar) }}</p>
              </td>
              <td class="px-6 py-4 font-black text-slate-800 uppercase">{{ rekod.no_plat }}</td>
              <td class="px-6 py-4">
                <p class="text-xs font-bold text-slate-700 truncate w-32">{{ rekod.destinasi }}</p>
                <p class="text-[9px] text-slate-400 uppercase font-black">{{ rekod.tujuan }}</p>
              </td>
              <td class="px-6 py-4 text-[11px] font-bold">
                {{ rekod.odo_mula }} → {{ rekod.odo_tamat || '...' }}
              </td>
              <td class="px-6 py-4 font-black text-teal-700">
                <span v-if="rekod.odo_tamat">{{ (rekod.odo_tamat - rekod.odo_mula).toFixed(1) }} KM</span>
                <span v-else class="text-slate-300">-</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="['text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest border', rekod.status_trip === 'Selesai' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200']">
                  {{ rekod.status_trip }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModalManual" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl border-2 border-slate-800 rounded-sm p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up custom-scrollbar">
        
        <div class="mb-6">
          <h2 class="text-xl font-black text-slate-900 uppercase tracking-widest">Buku Log Manual (Fizikal)</h2>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Masukkan rekod dari buku log fizikal kenderaan</p>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Pemandu</label>
              <select v-model="form.staff_id" class="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold text-sm outline-none">
                <option value="" disabled>-- Pilih Staf --</option>
                <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Aset</label>
              <select v-model="form.kenderaan_id" class="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold text-sm outline-none">
                <option value="" disabled>-- Pilih Aset --</option>
                <option v-for="k in kenderaanList" :key="k.id" :value="k.id">{{ k.no_plat }} ({{ k.model }})</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="form.tujuan" type="text" class="w-full border-2 border-slate-200 p-3 font-bold text-sm" placeholder="Tujuan" />
            <input v-model="form.destinasi" type="text" class="w-full border-2 border-slate-200 p-3 font-bold text-sm" placeholder="Destinasi" />
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Masa Keluar</label>
              <input v-model="form.masa_keluar" type="datetime-local" class="w-full border-2 border-slate-200 p-3 font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Masa Masuk</label>
              <input v-model="form.masa_masuk" type="datetime-local" class="w-full border-2 border-slate-200 p-3 font-bold text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <input v-model="form.odo_mula" type="number" class="w-full border-2 border-slate-200 p-3 font-bold text-sm" placeholder="Odo Mula (Km)" />
            <input v-model="form.odo_tamat" type="number" class="w-full border-2 border-slate-200 p-3 font-bold text-sm" placeholder="Odo Akhir (Km)" />
          </div>

          <div class="pt-4 border-t-2 border-slate-800">
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <span class="text-sm">⛽</span>
                <h3 class="text-[10px] font-black uppercase tracking-widest text-blue-700">Pecahan Resit Minyak</h3>
              </div>
              <button @click="tambahResit" class="bg-blue-100 text-blue-800 text-[10px] font-black px-4 py-1.5 rounded-full">+ Tambah Resit</button>
            </div>
            
            <div class="space-y-3">
              <div v-for="(resit, index) in form.senarai_resit" :key="index" class="relative bg-blue-50/50 p-4 border border-blue-100 rounded-sm">
                <button v-if="form.senarai_resit.length > 1" @click="buangResit(index)" class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">X</button>
                <div class="grid grid-cols-3 gap-3">
                  <input v-model="resit.no_resit" type="text" class="w-full border-2 border-slate-200 p-2 text-xs font-bold" placeholder="No Resit" />
                  <input v-model="resit.rm" type="number" step="0.01" class="w-full border-2 border-slate-200 p-2 text-xs font-bold" placeholder="RM" />
                  <input v-model="resit.liter" type="number" step="0.01" class="w-full border-2 border-slate-200 p-2 text-xs font-bold" placeholder="Liter" />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6 flex flex-col gap-2">
            <button @click="hantarRekodManual" class="w-full bg-slate-800 text-white font-black py-4 uppercase tracking-widest rounded-sm hover:bg-slate-900 transition-all">Simpan Rekod Ke Sistem</button>
            <button @click="showModalManual = false" class="w-full text-slate-500 font-bold py-2 uppercase text-[11px] tracking-widest">Batal</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../api/axios'

const rekodList = ref([])
const usersList = ref([])
const kenderaanList = ref([])
const showModalManual = ref(false)

const form = reactive({
  staff_id: '',
  kenderaan_id: '',
  tujuan: '',
  destinasi: '',
  nama_pengguna: '',
  masa_keluar: '',
  masa_masuk: '',
  odo_mula: '',
  odo_tamat: '',
  baki_tng: '',
  isi_minyak: true,
  senarai_resit: [{ no_resit: '', rm: '', liter: '' }]
})

const formatTarikhPendek = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const formatJam = (str) => str ? new Date(str).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false }) : '-'

const fetchSemuaData = async () => {
  try {
    // Gunakan endpoint admin/laporan untuk data yang lebih lengkap
    const resPergerakan = await api.get('/admin/laporan')
    rekodList.value = resPergerakan.data.data || []
    
    const resUsers = await api.get('/admin/pengguna')
    usersList.value = resUsers.data.data || []
    
    const resKenderaan = await api.get('/kenderaan/senarai')
    kenderaanList.value = resKenderaan.data.data || []
  } catch (error) {
    console.error("Gagal menarik data", error)
  }
}

const tambahResit = () => form.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResit = (index) => { if (form.senarai_resit.length > 1) form.senarai_resit.splice(index, 1) }

const bukaModalManual = () => {
  Object.keys(form).forEach(key => {
    if (key === 'senarai_resit') form[key] = [{ no_resit: '', rm: '', liter: '' }];
    else if (key === 'isi_minyak') form[key] = true;
    else form[key] = '';
  });
  showModalManual.value = true
}

const hantarRekodManual = async () => {
  if (!form.staff_id || !form.kenderaan_id || !form.masa_keluar || !form.masa_masuk) {
    return alert("Sila lengkapkan maklumat wajib.");
  }
  try {
    await api.post('/pergerakan/manual', form);
    alert("Rekod berjaya disimpan.");
    showModalManual.value = false;
    fetchSemuaData();
  } catch (error) {
    alert(error.response?.data?.message || "Ralat menyimpan.");
  }
}

onMounted(() => fetchSemuaData())
</script>