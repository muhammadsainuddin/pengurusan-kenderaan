<template>
  <div class="space-y-6 animate-fade-in no-print">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
      <div>
        <h2 class="text-xl font-black text-slate-800 tracking-tight">Log & Rekod Pergerakan</h2>
        <p class="text-xs text-slate-500 font-medium mt-1">Senarai penuh sejarah penggunaan aset.</p>
      </div>
      <button @click="bukaModalManual" class="bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Tambah Rekod Manual
      </button>
    </div>

    <div class="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-500">
            <tr>
              <th class="px-6 py-4">Tarikh & Masa</th>
              <th class="px-6 py-4">Kenderaan</th>
              <th class="px-6 py-4">Pemandu</th>
              <th class="px-6 py-4">Destinasi</th>
              <th class="px-6 py-4">Odometer</th>
              <th class="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="rekodList.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-400 font-medium">Tiada rekod dijumpai.</td>
            </tr>
            <tr v-for="rekod in rekodList" :key="rekod.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-bold text-slate-800">{{ formatTarikhPendek(rekod.masa_keluar) }}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">{{ formatJam(rekod.masa_keluar) }} - {{ rekod.masa_masuk ? formatJam(rekod.masa_masuk) : 'Sekarang' }}</p>
              </td>
              <td class="px-6 py-4 font-bold text-slate-800">{{ rekod.no_plat }}</td>
              <td class="px-6 py-4">{{ rekod.pemandu }}</td>
              <td class="px-6 py-4 text-xs">{{ rekod.destinasi }}</td>
              <td class="px-6 py-4">
                <span v-if="rekod.odo_mula">{{ rekod.odo_mula }} - {{ rekod.odo_tamat || '?' }}</span>
                <span v-else class="text-slate-300">-</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="['text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider', rekod.status_trip === 'Selesai' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700']">
                  {{ rekod.status_trip }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModalManual" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] transition-opacity">
      <div class="bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up border border-slate-100">
        
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">Kemasukan Buku Log Manual</h2>
            <p class="text-xs text-slate-500 font-medium mt-1">Masukkan rekod yang tidak diisi oleh staf di dalam sistem.</p>
          </div>
          <button @click="showModalManual = false" class="text-slate-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 font-bold transition-colors">X</button>
        </div>

        <div class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Pemandu</label>
              <select v-model="form.staff_id" class="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-800 font-bold outline-none text-sm appearance-none">
                <option value="" disabled>-- Pilih Staf --</option>
                <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Aset (Kenderaan/Bot)</label>
              <select v-model="form.kenderaan_id" class="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-800 font-bold outline-none text-sm appearance-none">
                <option value="" disabled>-- Pilih Aset --</option>
                <option v-for="k in kenderaanList" :key="k.id" :value="k.id">{{ k.no_plat }} ({{ k.model }})</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="form.tujuan" type="text" class="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-800 font-medium outline-none text-sm" placeholder="Tujuan Rasmi" />
            <input v-model="form.destinasi" type="text" class="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-800 font-medium outline-none text-sm" placeholder="Destinasi" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tarikh & Masa Keluar</label>
              <input v-model="form.masa_keluar" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none text-sm" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tarikh & Masa Masuk</label>
              <input v-model="form.masa_masuk" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Odo Mula</label>
              <input v-model="form.odo_mula" type="number" class="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none text-sm" placeholder="Km" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Odo Akhir</label>
              <input v-model="form.odo_tamat" type="number" class="w-full bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none text-sm" placeholder="Km" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
            <div>
              <label class="block text-[9px] font-bold text-purple-500 uppercase tracking-widest mb-1.5">Baki TnG</label>
              <input v-model="form.baki_tng" type="number" step="0.01" class="w-full bg-purple-50 border border-purple-100 focus:border-purple-500 rounded-xl px-3 py-3 text-purple-900 font-bold outline-none text-sm" placeholder="RM" />
            </div>
            <div>
              <label class="block text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Minyak (RM)</label>
              <input v-model="form.jumlah_rm_minyak" type="number" step="0.01" class="w-full bg-blue-50 border border-blue-100 focus:border-blue-500 rounded-xl px-3 py-3 text-blue-900 font-bold outline-none text-sm" placeholder="RM" />
            </div>
            <div>
              <label class="block text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Minyak (Liter)</label>
              <input v-model="form.jumlah_liter_minyak" type="number" step="0.01" class="w-full bg-blue-50 border border-blue-100 focus:border-blue-500 rounded-xl px-3 py-3 text-blue-900 font-bold outline-none text-sm" placeholder="L" />
            </div>
          </div>

          <button @click="hantarRekodManual" class="w-full bg-teal-700 text-white font-black text-sm py-4 rounded-2xl shadow-md mt-6 active:scale-95 transition-all">
            Simpan Ke Dalam Sistem
          </button>
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
  jumlah_rm_minyak: '',
  jumlah_liter_minyak: ''
})

const formatTarikhPendek = (tarikh) => {
  if (!tarikh) return '';
  return new Date(tarikh).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}
const formatJam = (tarikh) => {
  if (!tarikh) return '';
  return new Date(tarikh).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Menarik data daripada Backend
const fetchSemuaData = async () => {
  try {
    // 1. Dapatkan Log Pergerakan (API ini biasanya ada di /admin/pergerakan atau anda boleh guna data sedia ada)
    const resPergerakan = await api.get('/pergerakan/semua-rekod') // Sesuaikan dengan endpoint sedia ada anda
    rekodList.value = resPergerakan.data.data || []
  } catch (error) {
    console.log("Ralat tarik rekod. Sila pastikan endpoint /pergerakan/semua-rekod wujud.")
  }

  try {
    const resUsers = await api.get('/admin/users')
    usersList.value = resUsers.data.data || []
    
    const resKenderaan = await api.get('/kenderaan/senarai')
    kenderaanList.value = resKenderaan.data.data || []
  } catch (error) {
    console.error("Gagal menarik senarai pengguna / kenderaan", error)
  }
}

const bukaModalManual = () => {
  // Kosongkan form setiap kali buka
  Object.keys(form).forEach(key => form[key] = '');
  showModalManual.value = true
}

const hantarRekodManual = async () => {
  if (!form.staff_id || !form.kenderaan_id || !form.masa_keluar || !form.masa_masuk) {
    return alert("Sila isikan Nama, Kenderaan, serta Masa Keluar & Masuk.");
  }

  try {
    await api.post('/pergerakan/manual', form);
    alert("Rekod fizikal berjaya dimasukkan ke sistem!");
    showModalManual.value = false;
    fetchSemuaData(); // Refresh jadual
  } catch (error) {
    alert(error.response?.data?.message || "Ralat ketika menyimpan.");
  }
}

onMounted(() => {
  fetchSemuaData()
})
</script>

<style scoped>
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>