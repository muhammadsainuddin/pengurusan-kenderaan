<template>
  <div class="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-slate-300">
    
    <header class="bg-white border-b-4 border-slate-800 sticky top-0 z-50 shadow-sm">
      
      <div class="flex justify-between items-center px-4 lg:px-8 py-3 border-b border-slate-200">
        
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-slate-800 text-white flex items-center justify-center font-black rounded-sm tracking-tighter text-sm shadow-inner">
            AG
          </div>
          <div>
            <h1 class="text-sm md:text-base font-black uppercase tracking-widest text-slate-900 leading-none">Aigeo Command</h1>
            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">System Administrator</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:block text-right border-r border-slate-300 pr-4">
            <p class="text-xs font-black text-slate-900 uppercase tracking-wider">{{ currentUser?.name || 'ADMIN' }}</p>
            <p class="text-[9px] text-teal-700 font-bold uppercase tracking-widest mt-0.5">{{ currentUser?.negeri || 'AKSES PENUH' }}</p>
          </div>
          
          <div class="flex gap-2">
            <button @click="$router.push('/dashboard')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              <span class="hidden sm:inline">Mod Staf</span>
            </button>
            <button @click="handleLogout" class="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors">
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div class="px-4 lg:px-8 bg-slate-50 overflow-x-auto custom-scrollbar">
        <div class="flex gap-2 py-2.5 min-w-max">
          
          <button @click="activeTab = 'dashboard'" :class="tabClass('dashboard')">
            <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Ringkasan
          </button>
          
          <button @click="activeTab = 'pergerakan'" :class="tabClass('pergerakan')">
            <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Log Pergerakan
          </button>
          
          <div class="w-px bg-slate-300 mx-1 h-6 self-center hidden md:block"></div>
          
          <button @click="activeTab = 'kenderaan'" :class="tabClass('kenderaan')">
            <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            Urus Aset
          </button>

          <button @click="activeTab = 'pengguna'" :class="tabClass('pengguna')">
            <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Urus Staf
          </button>
          
          <div class="w-px bg-slate-300 mx-1 h-6 self-center hidden md:block"></div>

          <button @click="activeTab = 'laporan'" :class="tabClass('laporan')">
            <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Laporan
          </button>

        </div>
      </div>
    </header>

    <main class="w-full p-4 md:p-6 lg:p-8 transition-all duration-300">
      
      <DashboardAdmin v-if="activeTab === 'dashboard'" />
      <PergerakanAdmin v-if="activeTab === 'pergerakan'" />
      <LaporanAdmin v-if="activeTab === 'laporan'" />
      
      <div v-if="['kenderaan', 'pengguna'].includes(activeTab)" class="text-center py-32 bg-white border border-slate-300 shadow-sm w-full rounded-sm">
        <p class="text-4xl mb-4 opacity-80">⚙️</p>
        <h3 class="text-xl font-black text-slate-800 uppercase tracking-widest">Modul {{ activeTab }}</h3>
        <p class="text-xs text-slate-500 mt-2 font-bold uppercase tracking-wider">Status: Modul belum dicipta</p>
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 1. IMPORT HANYA KOMPONEN YANG SUDAH WUJUD
import DashboardAdmin from '../components/admin/DashboardAdmin.vue'
import PergerakanAdmin from '../components/admin/PergerakanAdmin.vue'
import LaporanAdmin from '../components/admin/LaporanAdmin.vue'

// 2. KEKALKAN KOMEN PADA KOMPONEN YANG BELUM WUJUD UNTUK ELAK 'FILE NOT EXIST'
// import KenderaanAdmin from '../components/admin/KenderaanAdmin.vue'
// import UsersAdmin from '../components/admin/UsersAdmin.vue'

const router = useRouter()
const activeTab = ref('dashboard')
const currentUser = ref(null)

onMounted(() => {
  const userData = localStorage.getItem('user');
  if(userData) currentUser.value = JSON.parse(userData);
})

// Fungsi Styling Tactical untuk Butang Tab
const tabClass = (tabName) => {
  const baseClass = "flex items-center gap-2 px-5 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border-2 transition-all rounded-sm"
  if (activeTab.value === tabName) {
    return `${baseClass} bg-slate-800 text-white border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]`
  } else {
    return `${baseClass} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-100`
  }
}

const handleLogout = () => {
  if(window.confirm("PENGESAHAN: Log keluar dari konsol pentadbir?")) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 0px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
</style>