<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex justify-between items-center px-1">
      <h2 class="text-xl font-black text-slate-800 uppercase tracking-widest">Pengurusan Aset</h2>
      <button @click="bukaModalTambah" class="bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-md transition-all">
        + Daftar Aset Baharu
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="k in senaraiKenderaan" :key="k.id" class="bg-white border-2 border-slate-200 p-5 rounded-sm shadow-sm relative flex flex-col">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-black text-slate-900 leading-none">{{ k.no_plat }}</h3>
            <p class="text-[10px] font-bold text-slate-500 uppercase mt-1">{{ k.model }} ({{ k.kategori }})</p>
          </div>
          <span :class="['text-[9px] font-black px-2 py-1 rounded-sm uppercase border', k.status === 'Tersedia' ? 'border-green-600 text-green-700 bg-green-50' : 'border-red-600 text-red-700 bg-red-50']">
            {{ k.status }}
          </span>
        </div>

        <div class="bg-slate-50 p-3 mb-5 border border-slate-200 rounded-sm">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Odometer Terkini</p>
          <p class="text-lg font-black text-slate-800">{{ k.odo_terkini || 0 }} KM</p>
        </div>

        <div class="mt-auto flex gap-2">
          <button @click="bukaModalEdit(k)" class="flex-1 bg-slate-800 text-white text-[10px] font-black py-2 uppercase rounded-sm hover:bg-slate-900 transition-colors">Edit Aset</button>
          <button @click="tukarStatusServis(k)" class="flex-1 bg-amber-50 text-amber-700 text-[10px] font-black py-2 uppercase border border-amber-200 rounded-sm">
            {{ k.status === 'Dalam Servis' ? 'Selesai Servis' : 'Hantar Bengkel' }}
          </button>
          <button @click="padamAset(k.id)" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 border border-red-200 rounded-sm">🗑️</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white border-2 border-slate-800 p-8 w-full max-w-md shadow-2xl animate-slide-up">
        <h2 class="text-lg font-black uppercase tracking-widest mb-6">{{ isEdit ? 'Kemaskini Aset' : 'Daftar Aset Baharu' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">No. Pendaftaran</label>
            <input v-model="form.no_plat" type="text" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Model / Jenis</label>
            <input v-model="form.model" type="text" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Kategori Aset</label>
            <select v-model="form.kategori" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none">
              <option value="Kereta">Kereta</option>
              <option value="Motorsikal">Motorsikal</option>
              <option value="Bot">Bot / Marin</option>
            </select>
          </div>
          <button @click="simpanAset" class="w-full bg-slate-800 text-white font-black py-4 uppercase tracking-widest rounded-sm mt-4 hover:bg-slate-900">
            {{ isEdit ? 'Simpan Perubahan' : 'Daftar Sekarang' }}
          </button>
          <button @click="showModal = false" class="w-full bg-slate-100 text-slate-600 font-black py-3 uppercase tracking-widest rounded-sm">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

const senaraiKenderaan = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const form = ref({ no_plat: '', model: '', kategori: 'Kereta' })

const fetchAset = async () => {
  const res = await api.get('/admin/dashboard-summary')
  senaraiKenderaan.value = res.data.data
}

const bukaModalTambah = () => {
  isEdit.value = false;
  form.value = { no_plat: '', model: '', kategori: 'Kereta' };
  showModal.value = true;
}

const bukaModalEdit = (k) => {
  isEdit.value = true;
  currentId.value = k.id;
  form.value = { no_plat: k.no_plat, model: k.model, kategori: k.kategori };
  showModal.value = true;
}

const simpanAset = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/admin/kenderaan/${currentId.value}`, form.value)
    } else {
      await api.post('/admin/kenderaan', form.value)
    }
    showModal.value = false
    fetchAset()
    alert("Data aset berjaya disimpan.")
  } catch (error) {
    alert(error.response?.data?.message || "Ralat menyimpan data.")
  }
}

const tukarStatusServis = async (k) => {
  const statusBaru = k.status === 'Dalam Servis' ? 'Tersedia' : 'Dalam Servis'
  await api.put(`/admin/kenderaan/${k.id}/toggle-servis`, { status: statusBaru })
  fetchAset()
}

const padamAset = async (id) => {
  if (confirm("PENGESAHAN: Padam aset ini secara kekal?")) {
    await api.delete(`/admin/kenderaan/${id}`)
    fetchAset()
  }
}

onMounted(() => fetchAset())
</script>