<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-xl font-black text-slate-800 uppercase tracking-widest">Senarai Staf</h2>
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Urus akses, pendaftaran dan profil staf</p>
      </div>
      <button @click="bukaModalTambah" class="bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-md transition-all hover:bg-slate-900">
        + Daftar Staf Baharu
      </button>
    </div>

    <div class="bg-white border-2 border-slate-800 rounded-sm overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b-2 border-slate-800">
            <tr>
              <th class="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Nama Staf</th>
              <th class="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">E-mel</th>
              <th class="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Peranan</th>
              <th class="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in senaraiPengguna" :key="user.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-bold text-slate-900">{{ user.name }}</td>
              <td class="px-6 py-4 font-medium text-slate-500">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="bg-slate-100 px-3 py-1.5 rounded-sm text-[9px] font-black uppercase border border-slate-200">{{ user.role }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <button @click="bukaModalEdit(user)" class="px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                    Edit
                  </button>
                  <button @click="toggleAkses(user)" :class="['px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95', user.is_active ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100']">
                    {{ user.is_active ? 'Sekat' : 'Aktifkan' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white border-2 border-slate-800 p-8 w-full max-w-md shadow-2xl animate-slide-up">
        <h2 class="text-lg font-black uppercase tracking-widest mb-6">{{ isEdit ? 'Kemaskini Profil Staf' : 'Pendaftaran Staf Manual' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Penuh</label>
            <input v-model="form.name" type="text" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none" placeholder="Seperti Kad Pengenalan" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">E-mel Rasmi</label>
            <input v-model="form.email" type="email" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none" placeholder="staf@domain.gov.my" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              {{ isEdit ? 'Kata Laluan Baru (Kosongkan jika tidak tukar)' : 'Kata Laluan Awal' }}
            </label>
            <input v-model="form.password" type="password" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none" placeholder="Cth: Staf123#" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Peranan (Role)</label>
            <select v-model="form.role" class="w-full border-2 border-slate-200 focus:border-slate-800 p-3 font-bold text-sm outline-none">
              <option value="Anggota">Anggota Lapangan</option>
              <option value="Penyelia">Penyelia Operasi</option>
              <option value="Admin">Pentadbir (Admin)</option>
            </select>
          </div>
          <button @click="simpanStaf" class="w-full bg-slate-800 text-white font-black py-4 uppercase tracking-widest rounded-sm mt-4 hover:bg-slate-900">
            {{ isEdit ? 'Simpan Perubahan' : 'Daftar Staf' }}
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

const senaraiPengguna = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentUserId = ref(null)

const form = ref({ name: '', email: '', password: '', role: 'Anggota' })

const fetchUsers = async () => {
  const res = await api.get('/admin/pengguna')
  senaraiPengguna.value = res.data.data
}

// Buka modal untuk Tambah (Add)
const bukaModalTambah = () => {
  isEdit.value = false;
  currentUserId.value = null;
  form.value = { name: '', email: '', password: '', role: 'Anggota' };
  showModal.value = true;
}

// Buka modal untuk Edit
const bukaModalEdit = (user) => {
  isEdit.value = true;
  currentUserId.value = user.id;
  form.value = { 
    name: user.name, 
    email: user.email, 
    password: '', // Kosongkan password semasa edit
    role: user.role 
  };
  showModal.value = true;
}

const simpanStaf = async () => {
  if (!form.value.name || !form.value.email) return alert("Sila lengkapkan Nama dan E-mel!")
  if (!isEdit.value && !form.value.password) return alert("Kata laluan wajib diisi untuk staf baharu!")
  
  try {
    if (isEdit.value) {
      // Hantar request PUT untuk Update
      await api.put(`/admin/pengguna/${currentUserId.value}`, form.value)
      alert("Maklumat staf berjaya dikemaskini.")
    } else {
      // Hantar request POST untuk Add
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

