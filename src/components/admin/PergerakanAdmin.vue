<template>
  <div class="space-y-5 no-print">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Log & Rekod Pergerakan</h2>
        <p class="text-xs text-[#5A6672] mt-0.5">Sejarah penggunaan aset kenderaan stesen</p>
      </div>
      <button @click="bukaModalManual" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Tambah Rekod Manual
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#DFE3E8] rounded shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#003479]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Tarikh & Pemandu</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Aset</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Destinasi</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Odometer</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Jarak</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F2F5]">
            <tr v-if="rekodList.length === 0">
              <td colspan="6" class="px-4 py-12 text-center text-[#5A6672] text-xs">Tiada rekod dijumpai.</td>
            </tr>
            <tr v-for="rekod in rekodList" :key="rekod.id" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="px-4 py-3">
                <p class="font-semibold text-[#1A2332] text-sm">{{ rekod.nama_staf }}</p>
                <p class="text-xs text-[#5A6672] mt-0.5">{{ formatTarikhPendek(rekod.masa_keluar) }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="font-bold text-[#003479] text-sm">{{ rekod.no_plat }}</span>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-[#1A2332] truncate max-w-[160px]">{{ rekod.destinasi }}</p>
                <p class="text-xs text-[#5A6672] mt-0.5">{{ rekod.tujuan }}</p>
              </td>
              <td class="px-4 py-3 text-xs text-[#5A6672] font-medium whitespace-nowrap">
                {{ rekod.odo_mula }} → {{ rekod.odo_tamat || '...' }}
              </td>
              <td class="px-4 py-3 font-semibold text-[#1A2332] whitespace-nowrap">
                <span v-if="rekod.odo_tamat">{{ (rekod.odo_tamat - rekod.odo_mula).toFixed(1) }} km</span>
                <span v-else class="text-[#DFE3E8]">—</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', rekod.status_trip === 'Selesai' ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#FEF3C7] text-[#92400E]']">
                  {{ rekod.status_trip }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Tambah Rekod Manual -->
    <div v-if="showModalManual" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">

        <!-- Modal Header -->
        <div class="px-6 py-4 bg-[#003479] rounded-t">
          <h3 class="text-sm font-bold text-white">Tambah Rekod Manual</h3>
          <p class="text-xs text-white/70 mt-0.5">Masukkan rekod dari buku log fizikal kenderaan</p>
        </div>

        <div class="p-6 space-y-4">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Nama Pemandu</label>
              <select v-model="form.staff_id" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm text-[#1A2332] outline-none transition-colors bg-white">
                <option value="" disabled>-- Pilih Staf --</option>
                <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Aset Kenderaan</label>
              <select v-model="form.kenderaan_id" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm text-[#1A2332] outline-none transition-colors bg-white">
                <option value="" disabled>-- Pilih Aset --</option>
                <option v-for="k in kenderaanList" :key="k.id" :value="k.id">{{ k.no_plat }} ({{ k.model }})</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Tujuan</label>
              <input v-model="form.tujuan" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Tujuan perjalanan" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Destinasi</label>
              <input v-model="form.destinasi" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Destinasi" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-3 border-t border-[#F0F2F5]">
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Masa Keluar</label>
              <input v-model="form.masa_keluar" type="datetime-local" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Masa Masuk</label>
              <input v-model="form.masa_masuk" type="datetime-local" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-3 border-t border-[#F0F2F5]">
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Odometer Mula (km)</label>
              <input v-model="form.odo_mula" type="number" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Odometer Akhir (km)</label>
              <input v-model="form.odo_tamat" type="number" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="0" />
            </div>
          </div>

          <!-- Pecahan Resit Minyak -->
          <div class="pt-4 border-t border-[#DFE3E8]">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-semibold text-[#003479] uppercase tracking-wide">Pecahan Resit Minyak</p>
              <button @click="tambahResit" class="text-xs font-semibold text-[#003479] border border-[#003479] hover:bg-[#EEF3FB] px-3 py-1.5 rounded transition-colors">+ Tambah Resit</button>
            </div>
            <div class="space-y-2">
              <div v-for="(resit, index) in form.senarai_resit" :key="index" class="relative bg-[#F8FAFC] border border-[#DFE3E8] rounded p-3">
                <button v-if="form.senarai_resit.length > 1" @click="buangResit(index)" class="absolute -top-2 -right-2 bg-[#C0392B] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold leading-none">×</button>
                <div class="grid grid-cols-3 gap-3">
                  <input v-model="resit.no_resit" type="text" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none transition-colors" placeholder="No. Resit" />
                  <input v-model="resit.rm" type="number" step="0.01" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none transition-colors" placeholder="RM" />
                  <input v-model="resit.liter" type="number" step="0.01" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none transition-colors" placeholder="Liter" />
                </div>
              </div>
            </div>
          </div>

          <!-- Butang Tindakan -->
          <div class="flex gap-3 pt-4 border-t border-[#DFE3E8]">
            <button @click="hantarRekodManual" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">Simpan Rekod</button>
            <button @click="showModalManual = false" class="flex-1 bg-[#F4F6FA] hover:bg-[#DFE3E8] text-[#5A6672] font-semibold text-sm py-2.5 rounded transition-colors">Batal</button>
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

const fetchSemuaData = async () => {
  try {
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #DFE3E8; border-radius: 4px; }
</style>
