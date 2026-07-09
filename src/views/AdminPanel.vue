<template>
  <div class="admin-screen font-sans min-h-screen">

    <!-- Government Header -->
    <header class="gov-header print:hidden">
      <div class="gov-header-inner">

        <!-- Brand Block -->
        <div class="flex items-center gap-4">
          <div class="gov-logo">
            <svg class="w-7 h-7" fill="white" viewBox="0 0 24 24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
          </div>
          <div>
            <p class="gov-org">Jabatan Perhilitan Malaysia</p>
            <h1 class="gov-system-name">Sistem Pengurusan Kenderaan</h1>
          </div>
        </div>

        <!-- User Block -->
        <div class="flex items-center gap-3">
          <div class="hidden md:block text-right">
            <p class="gov-user-name">{{ currentUser?.name || 'Pentadbir' }}</p>
            <p class="gov-user-role">{{ currentUser?.negeri || 'Stesen' }}</p>
          </div>
          <div class="gov-user-badge">
            {{ currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A' }}
          </div>
          <div class="flex gap-2 ml-2">
            <button @click="$router.push('/dashboard')" class="gov-btn-secondary">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              <span class="hidden sm:inline">Mod Staf</span>
            </button>
            <button @click="handleLogout" class="gov-btn-logout">Keluar</button>
          </div>
        </div>

      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="gov-nav print:hidden">
      <div class="gov-nav-inner">
        <button @click="activeTab = 'dashboard'" :class="['gov-tab', activeTab === 'dashboard' ? 'gov-tab--active' : '']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          Ringkasan
        </button>

        <button @click="activeTab = 'pergerakan'" :class="['gov-tab', activeTab === 'pergerakan' ? 'gov-tab--active' : '']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Log Pergerakan
        </button>

        <div class="gov-nav-divider"></div>

        <button @click="activeTab = 'kenderaan'" :class="['gov-tab', activeTab === 'kenderaan' ? 'gov-tab--active' : '']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
          Urus Aset
        </button>

        <button @click="activeTab = 'pengguna'" :class="['gov-tab', activeTab === 'pengguna' ? 'gov-tab--active' : '']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          Urus Staf
        </button>

        <div class="gov-nav-divider"></div>

        <button @click="activeTab = 'laporan'" :class="['gov-tab', activeTab === 'laporan' ? 'gov-tab--active' : '']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Laporan
        </button>
      </div>
    </nav>

    <!-- Content -->
    <main class="gov-content">
      <DashboardAdmin v-if="activeTab === 'dashboard'" />
      <PergerakanAdmin v-if="activeTab === 'pergerakan'" />
      <LaporanAdmin v-if="activeTab === 'laporan'" />
      <KenderaanAdmin v-if="activeTab === 'kenderaan'" />
      <UsersAdmin v-if="activeTab === 'pengguna'" />
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DashboardAdmin from '../components/admin/DashboardAdmin.vue'
import PergerakanAdmin from '../components/admin/PergerakanAdmin.vue'
import LaporanAdmin from '../components/admin/LaporanAdmin.vue'
import KenderaanAdmin from '../components/admin/KenderaanAdmin.vue'
import UsersAdmin from '../components/admin/UsersAdmin.vue'

const router = useRouter()
const activeTab = ref('dashboard')
const currentUser = ref(null)

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) currentUser.value = JSON.parse(userData)
})

const handleLogout = () => {
  if (window.confirm("Log keluar dari panel pentadbir?")) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}
</script>

<style scoped>
.admin-screen { background: #F4F6FA; }

/* ── Government Header ── */
.gov-header {
  background: #003479;
  border-bottom: 4px solid #C0392B;
  position: sticky; top: 0; z-index: 50;
}
.gov-header-inner {
  max-width: 1400px; margin: 0 auto;
  padding: 12px 24px;
  display: flex; justify-content: space-between; align-items: center;
}

.gov-logo {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.gov-org         { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.15em; }
.gov-system-name { font-size: 17px; font-weight: 700; color: white; letter-spacing: -0.2px; margin-top: 1px; }

.gov-user-name { font-size: 13px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; }
.gov-user-role { font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 1px; }
.gov-user-badge {
  width: 38px; height: 38px; border-radius: 8px;
  background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.35);
  color: white; font-size: 15px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.gov-btn-secondary {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9);
  padding: 6px 12px; border-radius: 4px;
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  cursor: pointer; transition: background 0.2s;
}
.gov-btn-secondary:hover { background: rgba(255,255,255,0.2); }

.gov-btn-logout {
  background: rgba(192,57,43,0.3); border: 1px solid rgba(192,57,43,0.5);
  color: #FFBDBA;
  padding: 6px 12px; border-radius: 4px;
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  cursor: pointer; transition: background 0.2s;
}
.gov-btn-logout:hover { background: rgba(192,57,43,0.55); color: white; }

/* ── Navigation Bar ── */
.gov-nav {
  background: white;
  border-bottom: 1px solid #DFE3E8;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  position: sticky; top: 68px; z-index: 40;
  overflow-x: auto;
}
.gov-nav-inner {
  max-width: 1400px; margin: 0 auto;
  padding: 0 24px;
  display: flex; align-items: stretch; gap: 0;
  min-width: max-content;
}

.gov-tab {
  display: flex; align-items: center; gap: 7px;
  padding: 12px 18px;
  font-size: 13px; font-weight: 600; color: #5A6672;
  background: none; border: none; border-bottom: 3px solid transparent;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
  white-space: nowrap; letter-spacing: 0.01em;
}
.gov-tab:hover { color: #003479; background: #F4F6FA; }
.gov-tab--active {
  color: #003479;
  border-bottom-color: #003479;
  background: #EEF3FB;
}

.gov-nav-divider {
  width: 1px; background: #DFE3E8;
  margin: 8px 4px;
}

/* ── Content Area ── */
.gov-content {
  max-width: 1400px; margin: 0 auto;
  padding: 24px;
}

/* Scrollbar for nav */
.gov-nav::-webkit-scrollbar { height: 3px; }
.gov-nav::-webkit-scrollbar-track { background: transparent; }
.gov-nav::-webkit-scrollbar-thumb { background: #DFE3E8; border-radius: 0; }
</style>
