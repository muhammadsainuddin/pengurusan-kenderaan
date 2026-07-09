<template>
  <div class="space-y-5">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Pengurusan Aset</h2>
        <p class="text-xs text-[#5A6672] mt-0.5">Senarai dan pengurusan kenderaan stesen</p>
      </div>
      <button @click="bukaModalTambah" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Daftar Aset Baharu
      </button>
    </div>

    <!-- Asset Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="k in senaraiKenderaan" :key="k.id" class="bg-white border border-[#DFE3E8] rounded shadow-sm flex flex-col overflow-hidden">

        <!-- Card Top Strip (gov blue) -->
        <div class="h-1.5" :class="k.status === 'Tersedia' ? 'bg-[#10B981]' : k.status === 'Dalam Servis' ? 'bg-[#F59E0B]' : 'bg-[#003479]'"></div>

        <div class="p-5 flex flex-col flex-1">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-[#1A2332] leading-none tracking-tight">{{ k.no_plat }}</h3>
              <p class="text-xs text-[#5A6672] font-medium mt-1 uppercase tracking-wide">{{ k.model }} · {{ k.kategori }}</p>
            </div>
            <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', k.status === 'Tersedia' ? 'bg-[#D1FAE5] text-[#065F46]' : k.status === 'Dalam Servis' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#DBEAFE] text-[#1E40AF]']">
              {{ k.status }}
            </span>
          </div>

          <!-- Odometer -->
          <div class="bg-[#F8FAFC] border border-[#DFE3E8] rounded p-3 mb-4">
            <p class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1">Odometer Terkini</p>
            <p class="text-lg font-bold text-[#1A2332]">{{ (k.odo_terkini || 0).toLocaleString() }} <span class="text-sm font-medium text-[#5A6672]">km</span></p>
          </div>

          <!-- Action Buttons -->
          <div class="mt-auto flex gap-2">
            <button @click="bukaModalEdit(k)" class="flex-1 bg-white border border-[#003479] hover:bg-[#EEF3FB] text-[#003479] text-xs font-semibold py-2 rounded transition-colors">
              Edit
            </button>
            <button @click="tukarStatusServis(k)" class="flex-1 text-xs font-semibold py-2 rounded border transition-colors" :class="k.status === 'Dalam Servis' ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46] hover:bg-green-100' : 'bg-[#FEF9C3] border-[#FDE047] text-[#713F12] hover:bg-yellow-100'">
              {{ k.status === 'Dalam Servis' ? 'Selesai Servis' : 'Hantar Bengkel' }}
            </button>
            <button @click="padamAset(k.id)" class="bg-white border border-[#DFE3E8] hover:border-[#C0392B] hover:bg-red-50 text-[#C0392B] px-3 py-2 rounded transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Tambah / Edit Aset -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-md rounded shadow-xl">

        <div class="px-5 py-4 bg-[#003479] rounded-t">
          <h3 class="text-sm font-bold text-white">{{ isEdit ? 'Kemaskini Aset' : 'Daftar Aset Baharu' }}</h3>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Pendaftaran</label>
            <input v-model="form.no_plat" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: WA1234B" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Model / Jenis</label>
            <input v-model="form.model" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: Toyota Hilux" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Kategori Aset</label>
            <select v-model="form.kategori" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors bg-white">
              <option value="Kereta">Kereta</option>
              <option value="Motorsikal">Motorsikal</option>
              <option value="Bot">Bot / Marin</option>
            </select>
          </div>

          <div class="border-t border-[#DFE3E8] pt-4">
            <p class="text-xs font-bold text-[#003479] uppercase tracking-wide mb-3">Kad Rasmi Kenderaan</p>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Siri Kad TnG</label>
                <input v-model="form.no_siri_kad_tng" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: TNG-XXXX-XXXX" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Siri Kad Inden</label>
                <input v-model="form.no_siri_kad_minyak" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: KAD-XXXX-XXXX" />
              </div>
            </div>
            <p class="text-[11px] text-[#5A6672] mt-2">Kosongkan jika kenderaan ini tiada kad rasmi. Nombor ini akan direkod secara automatik setiap kali staf mengambil kad.</p>
          </div>

          <div class="flex gap-3 pt-2 border-t border-[#DFE3E8]">
            <button @click="simpanAset" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">
              {{ isEdit ? 'Simpan Perubahan' : 'Daftar Sekarang' }}
            </button>
            <button @click="showModal = false" class="flex-1 bg-[#F4F6FA] hover:bg-[#DFE3E8] text-[#5A6672] font-semibold text-sm py-2.5 rounded transition-colors">Batal</button>
          </div>
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
const form = ref({ no_plat: '', model: '', kategori: 'Kereta', no_siri_kad_tng: '', no_siri_kad_minyak: '' })

const fetchAset = async () => {
  const res = await api.get('/admin/dashboard-summary')
  senaraiKenderaan.value = res.data.data
}

const bukaModalTambah = () => {
  isEdit.value = false;
  form.value = { no_plat: '', model: '', kategori: 'Kereta', no_siri_kad_tng: '', no_siri_kad_minyak: '' };
  showModal.value = true;
}

const bukaModalEdit = (k) => {
  isEdit.value = true;
  currentId.value = k.id;
  form.value = { no_plat: k.no_plat, model: k.model, kategori: k.kategori, no_siri_kad_tng: k.no_siri_kad_tng || '', no_siri_kad_minyak: k.no_siri_kad_minyak || '' };
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
