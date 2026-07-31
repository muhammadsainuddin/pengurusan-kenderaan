<template>
  <div class="space-y-5">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Pengurusan Kad TnG &amp; Kad Minyak</h2>
        <p class="text-xs text-[#5A6672] mt-0.5">Kad hanya boleh diperuntukkan kepada kenderaan berkategori Kereta</p>
      </div>
      <button @click="bukaModalTambah" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Daftar Kad Baharu
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-[#DFE3E8] rounded shadow-sm p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="lg:col-span-2">
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Cari</label>
          <input v-model="search" type="text" placeholder="No. siri, no. plat..." class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2 text-sm outline-none transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Jenis</label>
          <select v-model="filterJenis" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2 text-sm outline-none transition-colors bg-white">
            <option value="Semua">Semua</option>
            <option value="TnG">Kad TnG</option>
            <option value="Minyak">Kad Minyak</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Status</label>
          <select v-model="filterStatus" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2 text-sm outline-none transition-colors bg-white">
            <option value="Semua">Semua</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
            <option value="Hilang">Hilang</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-3" v-if="search || filterJenis !== 'Semua' || filterStatus !== 'Semua'">
        <button @click="resetFilters" class="text-xs font-semibold text-[#003479] hover:underline">Kosongkan Penapis</button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#DFE3E8] rounded shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#003479]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Jenis</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">No. Siri Kad</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Kereta Diperuntukkan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Catatan</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wide">Status</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wide">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F2F5]">
            <tr v-if="paginatedList.length === 0">
              <td colspan="6" class="px-4 py-12 text-center text-[#5A6672] text-xs">Tiada kad dijumpai.</td>
            </tr>
            <tr v-for="kad in paginatedList" :key="kad.id" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="px-4 py-3">
                <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', kad.jenis === 'TnG' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#FEF3C7] text-[#92400E]']">
                  Kad {{ kad.jenis === 'TnG' ? 'TnG' : 'Minyak' }}
                </span>
              </td>
              <td class="px-4 py-3 font-semibold text-[#1A2332] text-sm whitespace-nowrap">{{ kad.no_siri }}</td>
              <td class="px-4 py-3">
                <span v-if="kad.kenderaan_id" class="font-bold text-[#003479] text-sm">{{ kad.no_plat }}</span>
                <span v-else class="text-xs text-[#8A94A6] italic">Belum diperuntukkan</span>
              </td>
              <td class="px-4 py-3 text-xs text-[#5A6672]">{{ kad.catatan || '—' }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', kad.status === 'Aktif' ? 'bg-[#D1FAE5] text-[#065F46]' : kad.status === 'Hilang' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#F3F4F6] text-[#374151]']">
                  {{ kad.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-2">
                  <button @click="bukaModalEdit(kad)" class="text-xs font-semibold text-[#003479] border border-[#003479] hover:bg-[#EEF3FB] px-3 py-1.5 rounded transition-colors">Edit</button>
                  <button @click="padamKad(kad.id)" class="bg-white border border-[#DFE3E8] hover:border-[#C0392B] hover:bg-red-50 text-[#C0392B] px-2.5 py-1.5 rounded transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-[#F0F2F5]">
        <div class="flex items-center gap-2 text-xs text-[#5A6672]">
          <span>Papar</span>
          <select v-model.number="perPage" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-1 text-xs outline-none bg-white">
            <option :value="10">10</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="200">200</option>
          </select>
          <span>daripada {{ filteredList.length }} kad</span>
        </div>

        <div class="flex items-center gap-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1" class="pg-btn">«</button>
          <button @click="currentPage--" :disabled="currentPage === 1" class="pg-btn">‹</button>
          <span class="text-xs text-[#5A6672] px-2 whitespace-nowrap">Muka {{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="pg-btn">›</button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="pg-btn">»</button>
        </div>
      </div>
    </div>

    <!-- Modal: Tambah / Edit Kad -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-md rounded shadow-xl">

        <div class="px-5 py-4 bg-[#003479] rounded-t">
          <h3 class="text-sm font-bold text-white">{{ isEdit ? 'Kemaskini Kad' : 'Daftar Kad Baharu' }}</h3>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Jenis Kad</label>
            <select v-model="form.jenis" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors bg-white">
              <option value="TnG">Kad TnG</option>
              <option value="Minyak">Kad Minyak</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Siri Kad</label>
            <input v-model="form.no_siri" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: 1626060751" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Peruntukkan Kepada Kereta</label>
            <select v-model="form.kenderaan_id" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors bg-white">
              <option :value="null">-- Tiada (belum diperuntukkan) --</option>
              <option v-for="k in senaraiKereta" :key="k.id" :value="k.id">{{ k.no_plat }} ({{ k.model }})</option>
            </select>
            <p class="text-[11px] text-[#5A6672] mt-1.5">Hanya kenderaan berkategori Kereta dipaparkan. Kad sedia ada jenis sama pada kereta ini akan dilepaskan secara automatik.</p>
          </div>

          <div v-if="isEdit">
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Status</label>
            <select v-model="form.status" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors bg-white">
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
              <option value="Hilang">Hilang</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Catatan</label>
            <input v-model="form.catatan" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Pilihan" />
          </div>

          <div class="flex gap-3 pt-2 border-t border-[#DFE3E8]">
            <button @click="simpanKad" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">
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
import { ref, computed, watch, onMounted } from 'vue'
import api from '../../api/axios'

const senaraiKad = ref([])
const senaraiKereta = ref([])

const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const form = ref({ jenis: 'TnG', no_siri: '', kenderaan_id: null, status: 'Aktif', catatan: '' })

const search = ref('')
const filterJenis = ref('Semua')
const filterStatus = ref('Semua')
const perPage = ref(10)
const currentPage = ref(1)

const filteredList = computed(() => {
  const q = search.value.trim().toLowerCase()
  return senaraiKad.value.filter(k => {
    const matchSearch = !q || (k.no_siri || '').toLowerCase().includes(q) || (k.no_plat || '').toLowerCase().includes(q)
    const matchJenis = filterJenis.value === 'Semua' || k.jenis === filterJenis.value
    const matchStatus = filterStatus.value === 'Semua' || k.status === filterStatus.value
    return matchSearch && matchJenis && matchStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / perPage.value)))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredList.value.slice(start, start + perPage.value)
})

const resetFilters = () => {
  search.value = ''
  filterJenis.value = 'Semua'
  filterStatus.value = 'Semua'
}

watch([search, filterJenis, filterStatus, perPage], () => { currentPage.value = 1 })
watch(totalPages, (val) => { if (currentPage.value > val) currentPage.value = val })

const fetchKad = async () => {
  try {
    const res = await api.get('/admin/kad')
    senaraiKad.value = res.data.data || []
  } catch (error) {
    console.error("Gagal menarik senarai kad", error)
  }
}

const fetchKereta = async () => {
  try {
    const res = await api.get('/kenderaan/senarai')
    senaraiKereta.value = (res.data.data || []).filter(k => k.kategori === 'Kereta')
  } catch (error) {
    console.error("Gagal menarik senarai kereta", error)
  }
}

const bukaModalTambah = () => {
  isEdit.value = false
  form.value = { jenis: 'TnG', no_siri: '', kenderaan_id: null, status: 'Aktif', catatan: '' }
  showModal.value = true
}

const bukaModalEdit = (kad) => {
  isEdit.value = true
  currentId.value = kad.id
  form.value = {
    jenis: kad.jenis,
    no_siri: kad.no_siri,
    kenderaan_id: kad.kenderaan_id || null,
    status: kad.status,
    catatan: kad.catatan || ''
  }
  showModal.value = true
}

const simpanKad = async () => {
  if (!form.value.no_siri) return alert("Sila masukkan no. siri kad.")
  try {
    if (isEdit.value) {
      await api.put(`/admin/kad/${currentId.value}`, form.value)
    } else {
      await api.post('/admin/kad', form.value)
    }
    showModal.value = false
    fetchKad()
  } catch (error) {
    alert(error.response?.data?.message || "Ralat menyimpan kad.")
  }
}

const padamKad = async (id) => {
  if (confirm("PENGESAHAN: Padam kad ini secara kekal?")) {
    try {
      await api.delete(`/admin/kad/${id}`)
      fetchKad()
    } catch (error) {
      alert(error.response?.data?.message || "Ralat memadam kad.")
    }
  }
}

onMounted(() => {
  fetchKad()
  fetchKereta()
})
</script>

<style scoped>
.pg-btn {
  min-width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #DFE3E8; border-radius: 4px;
  font-size: 13px; font-weight: 600; color: #5A6672;
  background: white; cursor: pointer; transition: background 0.15s, color 0.15s;
}
.pg-btn:hover:not(:disabled) { background: #F4F6FA; color: #003479; border-color: #003479; }
.pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
