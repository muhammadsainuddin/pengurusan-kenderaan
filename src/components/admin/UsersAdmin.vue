<template>
  <div class="space-y-5">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Pengurusan Staf</h2>
        <p class="text-xs text-[#5A6672] mt-0.5">Urus akaun, peranan dan akses sistem staf</p>
      </div>
      <button @click="bukaModalTambah" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        Daftar Staf Baharu
      </button>
    </div>

    <!-- Staff Table -->
    <div class="bg-white border border-[#DFE3E8] rounded shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#003479]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Nama Staf</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">E-mel</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Peranan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">Status</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wide">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F2F5]">
            <tr v-if="senaraiPengguna.length === 0">
              <td colspan="5" class="px-4 py-12 text-center text-[#5A6672] text-xs">Tiada rekod staf dijumpai.</td>
            </tr>
            <tr v-for="user in senaraiPengguna" :key="user.id" class="hover:bg-[#F8FAFC] transition-colors">
              <td class="px-4 py-3">
                <p class="font-semibold text-[#1A2332]">{{ user.name }}</p>
              </td>
              <td class="px-4 py-3 text-[#5A6672] text-sm">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', user.role === 'Admin' ? 'bg-[#EDE9FE] text-[#5B21B6]' : user.role === 'Penyelia' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#374151]']">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', user.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]']">
                  {{ user.is_active ? 'Aktif' : 'Disekat' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-2">
                  <button @click="bukaModalEdit(user)" class="px-3 py-1.5 rounded text-xs font-semibold border transition-colors bg-white border-[#003479] text-[#003479] hover:bg-[#EEF3FB]">
                    Edit
                  </button>
                  <button @click="toggleAkses(user)" :class="['px-3 py-1.5 rounded text-xs font-semibold border transition-colors', user.is_active ? 'bg-white border-[#C0392B] text-[#C0392B] hover:bg-red-50' : 'bg-white border-[#10B981] text-[#065F46] hover:bg-green-50']">
                    {{ user.is_active ? 'Sekat' : 'Aktifkan' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Tambah / Edit Staf -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-md rounded shadow-xl">

        <div class="px-5 py-4 bg-[#003479] rounded-t">
          <h3 class="text-sm font-bold text-white">{{ isEdit ? 'Kemaskini Profil Staf' : 'Pendaftaran Staf Baharu' }}</h3>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Nama Penuh</label>
            <input v-model="form.name" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Seperti Kad Pengenalan" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">E-mel Rasmi</label>
            <input v-model="form.email" type="email" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="staf@domain.gov.my" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">
              {{ isEdit ? 'Kata Laluan Baru (kosong = tidak ubah)' : 'Kata Laluan Awal' }}
            </label>
            <input v-model="form.password" type="password" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Min. 8 aksara" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Peranan (Role)</label>
            <select v-model="form.role" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors bg-white">
              <option value="Anggota">Anggota Lapangan</option>
              <option value="Penyelia">Penyelia Operasi</option>
              <option value="Admin">Pentadbir (Admin)</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2 border-t border-[#DFE3E8]">
            <button @click="simpanStaf" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">
              {{ isEdit ? 'Simpan Perubahan' : 'Daftar Staf' }}
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

const senaraiPengguna = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentUserId = ref(null)

const form = ref({ name: '', email: '', password: '', role: 'Anggota' })

const fetchUsers = async () => {
  const res = await api.get('/admin/pengguna')
  senaraiPengguna.value = res.data.data
}

const bukaModalTambah = () => {
  isEdit.value = false;
  currentUserId.value = null;
  form.value = { name: '', email: '', password: '', role: 'Anggota' };
  showModal.value = true;
}

const bukaModalEdit = (user) => {
  isEdit.value = true;
  currentUserId.value = user.id;
  form.value = { name: user.name, email: user.email, password: '', role: user.role };
  showModal.value = true;
}

const simpanStaf = async () => {
  if (!form.value.name || !form.value.email) return alert("Sila lengkapkan Nama dan E-mel!")
  if (!isEdit.value && !form.value.password) return alert("Kata laluan wajib diisi untuk staf baharu!")

  try {
    if (isEdit.value) {
      await api.put(`/admin/pengguna/${currentUserId.value}`, form.value)
      alert("Maklumat staf berjaya dikemaskini.")
    } else {
      await api.post('/admin/pengguna', form.value)
      alert("Staf berjaya didaftarkan secara manual.")
    }
    showModal.value = false
    fetchUsers()
  } catch (error) {
    alert(error.response?.data?.message || "Ralat memproses staf.")
  }
}

const toggleAkses = async (user) => {
  const statusBaru = user.is_active ? 0 : 1
  if (confirm(`Tukar status akses untuk ${user.name}?`)) {
    await api.put(`/admin/pengguna/${user.id}/toggle`, { is_active: statusBaru })
    fetchUsers()
  }
}

onMounted(() => fetchUsers())
</script>
