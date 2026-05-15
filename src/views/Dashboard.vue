<template>
  <div class="min-h-screen bg-[#F4F5F4] font-sans text-gray-900 pb-24">
    
    <header class="pt-12 pb-4 px-6 bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 rounded-b-[24px]">
      <div class="max-w-md mx-auto flex justify-between items-center">
        <div>
          <p class="text-xs font-bold text-teal-600 uppercase tracking-widest">AIGEO SYSTEM</p>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Pengurusan Kenderaan</h1>
        </div>
        <div @click="activeTab = 'profil'" class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm cursor-pointer hover:bg-teal-200 transition-colors">
          {{ currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U' }}
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 pt-6">
      
      <div v-if="activeTab === 'home'" class="space-y-4 animate-fade-in">
        <div class="mb-6 px-2">
          <h2 class="text-xl font-medium text-gray-800 leading-tight">Hi, {{ currentUser?.name?.split(' ')[0] }}! 👋</h2>
          <p class="text-sm text-gray-500 font-medium">
            {{ userSedangMemandu ? 'Sila kemaskini pergerakan harian atau tamatkan tugas.' : 'Sila pilih kenderaan tersedia.' }}
          </p>
        </div>

        <div class="flex justify-between items-center px-1 mb-2">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Status Aset Semasa</h3>
          <button @click="fetchKenderaan" class="text-teal-600 p-2 hover:bg-teal-50 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <div v-for="k in filteredList" :key="k.id" 
          :class="['p-5 rounded-[28px] transition-all relative overflow-hidden', bolehAmbil(k) ? 'bg-white cursor-pointer hover:shadow-md shadow-sm active:scale-[0.98]' : 'bg-[#EBECE8] opacity-90']"
          @click="bolehAmbil(k) ? bukaBorangAmbil(k) : null"
        >
          <div class="flex items-center gap-5">
            <div :class="['w-16 h-16 rounded-full flex shrink-0 items-center justify-center text-3xl shadow-inner', bolehAmbil(k) ? 'bg-teal-50 text-teal-600' : 'bg-gray-300 text-gray-500']">
              {{ k.kategori === 'Bot' ? '🚤' : (k.kategori === 'Motorsikal' ? '🏍️' : '🚗') }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[20px] font-bold text-gray-900 truncate tracking-tight">{{ k.no_plat }}</h3>
              <p class="text-sm text-gray-500 font-medium">{{ k.model }}</p>
              
              <div class="mt-3 flex gap-2">
                <span v-if="k.status === 'Tersedia'" class="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Tersedia</span>
                <span v-else-if="k.status === 'Dalam Servis'" class="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Di Bengkel</span>
                <span v-else-if="k.status === 'Ditempah'" class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Ditempah</span>
                <span v-else class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Sedang Digunakan</span>
              </div>
            </div>
          </div>

          <div v-if="k.status !== 'Tersedia' && k.status !== 'Dalam Servis'" class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-3 mb-4 bg-gray-50/50 p-3 rounded-2xl">
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-500">
                  {{ k.status === 'Sedang Digunakan' ? 'Pemandu Semasa' : 'Tempahan Oleh' }}
                </p>
                <p class="text-sm font-bold text-gray-900 leading-tight truncate">
                  {{ k.status === 'Sedang Digunakan' ? k.pemandu : k.pembuat_tempahan }}
                </p>
                <p class="text-xs text-gray-500 truncate mt-0.5">
                  {{ k.status === 'Sedang Digunakan' ? k.destinasi : k.destinasi_booking }}
                </p>
              </div>
            </div>
            
            <div v-if="k.status === 'Sedang Digunakan' && k.pemandu_id === currentUser?.id" class="flex flex-col gap-2">
              <button @click.stop="bukaModalLogHarian(k)" 
                      class="w-full bg-white border-2 border-teal-600 text-teal-700 font-bold text-sm py-4 rounded-full shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Rekod Pergerakan Harian
              </button>
              <button @click.stop="bukaBorangPulang(k)" class="w-full bg-teal-700 text-white font-bold text-sm py-4 rounded-full shadow-lg active:scale-95 transition-all">
                Pulangkan Kunci (Tamat Operasi)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'sejarah'" class="space-y-4 animate-fade-in">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-4">Log Perjalanan Lampau</h2>
        <div v-for="rekod in sejarahList" :key="rekod.id" class="bg-white p-5 rounded-[28px] shadow-sm border border-transparent hover:border-teal-100 transition-all">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex shrink-0 items-center justify-center text-2xl">
              {{ rekod.kategori === 'Bot' ? '🚤' : '🚗' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-bold text-gray-900 leading-tight tracking-tight">{{ rekod.no_plat }}</h3>
              <p class="text-xs text-gray-500">{{ formatTarikh(rekod.masa_keluar) }}</p>
            </div>
          </div>
          <div class="bg-[#F4F5F4] p-4 rounded-2xl">
            <p class="text-sm font-bold text-gray-900 tracking-tight">{{ rekod.destinasi }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ rekod.tujuan }}</p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'profil'" class="space-y-6 animate-fade-in">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Maklumat Peribadi</h2>
        <div class="bg-white rounded-[28px] p-8 shadow-sm text-center">
          <div class="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white shadow-md">👤</div>
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ currentUser?.name }}</h2>
          <p class="text-sm text-gray-500 font-medium mb-6">{{ currentUser?.email }}</p>
          <div class="bg-[#F4F5F4] rounded-3xl p-5 text-left space-y-4">
            <div class="flex justify-between items-center">
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Stesen</p>
              <p class="text-sm font-bold text-gray-800">{{ currentUser?.negeri || 'TNPP' }}</p>
            </div>
          </div>
        </div>
        <button v-if="currentUser?.role === 'Admin'" @click="$router.push('/admin')" class="w-full bg-teal-700 text-white font-bold text-sm py-4 rounded-full active:scale-95 transition-all shadow-md mb-3">Buka Panel Pentadbir</button>
        <button @click="handleLogout" class="w-full bg-red-50 text-red-600 font-bold text-sm py-4 rounded-full active:bg-red-100 transition-colors">Log Keluar Akaun</button>
      </div>

    </main>

    <button v-if="activeTab === 'home'" @click="$router.push('/booking')" class="fixed bottom-24 right-6 w-14 h-14 bg-teal-200 text-teal-900 rounded-[20px] shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30 border-2 border-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
    </button>

    <nav class="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white border-t border-gray-100 flex justify-around items-center h-20 z-40 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <div @click="tukarTab('home')" class="flex flex-col items-center gap-1 cursor-pointer w-20 group">
        <div :class="['w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300', activeTab === 'home' ? 'bg-teal-100 text-teal-900 scale-110' : 'text-gray-400 group-hover:bg-gray-50']"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z"/></svg></div>
        <span :class="['text-[11px] font-bold tracking-tight', activeTab === 'home' ? 'text-teal-900' : 'text-gray-400']">Utama</span>
      </div>
      <div @click="tukarTab('sejarah')" class="flex flex-col items-center gap-1 cursor-pointer w-20 group">
        <div :class="['w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300', activeTab === 'sejarah' ? 'bg-teal-100 text-teal-900 scale-110' : 'text-gray-400 group-hover:bg-gray-50']"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
        <span :class="['text-[11px] font-bold tracking-tight', activeTab === 'sejarah' ? 'text-teal-900' : 'text-gray-400']">Sejarah</span>
      </div>
      <div @click="tukarTab('profil')" class="flex flex-col items-center gap-1 cursor-pointer w-20 group">
        <div :class="['w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300', activeTab === 'profil' ? 'bg-teal-100 text-teal-900 scale-110' : 'text-gray-400 group-hover:bg-gray-50']"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
        <span :class="['text-[11px] font-bold tracking-tight', activeTab === 'profil' ? 'text-teal-900' : 'text-gray-400']">Profil</span>
      </div>
    </nav>

    <ModalAmbilKunci 
      v-if="showModalAmbil" 
      :kenderaan="pilihanKenderaan" 
      @close="showModalAmbil = false" 
      @success="handleSuccess" 
    />

    <ModalPulangkanKunci 
      v-if="showModalPulang" 
      :kenderaan="pilihanKenderaan" 
      @close="showModalPulang = false" 
      @success="handleSuccess" 
    />

    <ModalLogHarian 
      v-if="showModalLogHarian" 
      :kenderaan="pilihanKenderaan" 
      @close="showModalLogHarian = false" 
      @success="handleSuccess" 
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

// IMPORT KOMPONEN MODULAR
import ModalAmbilKunci from '../components/dashboard/ModalAmbilKunci.vue'
import ModalPulangkanKunci from '../components/dashboard/ModalPulangkanKunci.vue'
import ModalLogHarian from '../components/dashboard/ModalLogHarian.vue'

const router = useRouter()
const activeTab = ref('home')
const kenderaanList = ref([])
const sejarahList = ref([])
const currentUser = ref(null)
const pilihanKenderaan = ref(null)

// State Modals
const showModalAmbil = ref(false)
const showModalPulang = ref(false)
const showModalLogHarian = ref(false)

// Pengurusan Tab
const tukarTab = (tab) => { 
  activeTab.value = tab; 
  if (tab === 'home') fetchKenderaan(); 
  if (tab === 'sejarah') fetchSejarah(); 
}

// Data Fetching
const fetchKenderaan = async () => { 
  try { 
    const res = await api.get('/kenderaan/senarai'); 
    kenderaanList.value = res.data.data 
  } catch (e) { 
    if(e.response?.status === 401) handleLogout() 
  } 
}

const fetchSejarah = async () => { 
  try { 
    const res = await api.get('/pergerakan/sejarah'); 
    sejarahList.value = res.data.data 
  } catch (e) { console.error(e) } 
}

// Logik Tapisan Aset
const userSedangMemandu = computed(() => kenderaanList.value.find(k => k.status === 'Sedang Digunakan' && k.pemandu_id === currentUser.value?.id))
const filteredList = computed(() => userSedangMemandu.value ? [userSedangMemandu.value] : kenderaanList.value)

const bolehAmbil = (k) => { 
  if (k.status === 'Tersedia') return true; 
  if (k.status === 'Ditempah' && k.booking_staff_id === currentUser.value?.id) return true; 
  return false 
}

// Handlers Modal
const bukaBorangAmbil = (k) => { pilihanKenderaan.value = k; showModalAmbil.value = true }
const bukaBorangPulang = (k) => { pilihanKenderaan.value = k; showModalPulang.value = true }
const bukaModalLogHarian = (k) => { pilihanKenderaan.value = k; showModalLogHarian.value = true }

const handleSuccess = () => {
  showModalAmbil.value = false
  showModalPulang.value = false
  showModalLogHarian.value = false
  fetchKenderaan()
}

// Utils
const handleLogout = () => { 
  localStorage.removeItem('token'); 
  localStorage.removeItem('user'); 
  router.push('/login') 
}

const formatTarikh = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const formatTarikhPendek = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' }) : ''

onMounted(() => { 
  const userData = localStorage.getItem('user'); 
  if(userData) currentUser.value = JSON.parse(userData); 
  fetchKenderaan() 
})
</script>

<style scoped>
@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
.animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-fade-in { animation: fadeIn 0.2s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>