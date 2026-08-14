<template>
  <div class="dash-screen min-h-screen font-sans pb-[88px]">

    <!-- MD3 Top App Bar -->
    <header class="top-bar">
      <div class="max-w-md mx-auto flex justify-between items-center px-4 h-full">
        <div>
          <h1 class="top-bar-title">Pengurusan Kenderaan</h1>
        </div>
        <button @click="activeTab = 'profil'" class="avatar-btn">
          {{ currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-md mx-auto px-4 pt-5">

      <!-- HOME TAB -->
      <div v-if="activeTab === 'home'" class="tab-content">
        <div class="mb-5">
          <h2 class="greeting">Selamat datang, <span class="capitalize">{{ currentUser?.name?.split(' ')[0] }}</span>!</h2>
          <p class="greeting-sub">
            {{ userSedangMemandu ? 'Kemas kini pergerakan harian atau tamatkan tugas.' : 'Pilih kenderaan yang tersedia.' }}
          </p>
        </div>

        <div class="flex justify-between items-center mb-3">
          <p class="section-label">Status Aset</p>
          <button @click="fetchKenderaan" class="refresh-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Muat semula
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="k in filteredList" :key="k.id"
            :class="['vehicle-card', bolehAmbil(k) ? 'vehicle-card--available' : 'vehicle-card--busy']"
            @click="bolehAmbil(k) ? bukaBorangAmbil(k) : null"
          >
            <!-- Card Top Row -->
            <div class="flex items-center gap-4">
              <div :class="['vehicle-icon', bolehAmbil(k) ? 'vehicle-icon--available' : 'vehicle-icon--busy']">
                {{ k.kategori === 'Bot' ? '🚤' : (k.kategori === 'Motorsikal' ? '🏍️' : '🚗') }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="vehicle-plate">{{ k.no_plat }}</h3>
                  <span :class="['status-chip', statusChipClass(k.status)]">{{ k.status }}</span>
                </div>
                <p class="vehicle-model">{{ k.model }} · {{ k.kategori }}</p>
              </div>
              <div v-if="bolehAmbil(k)" class="chevron-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>

            <!-- Driver Info (when in use) -->
            <div v-if="k.status !== 'Tersedia' && k.status !== 'Dalam Servis'" class="mt-4 pt-4 border-t border-black/5">
              <div class="driver-info-box">
                <div class="flex-1 min-w-0">
                  <p class="driver-info-label">
                    {{ k.status === 'Sedang Digunakan' ? 'Pemandu Semasa' : 'Ditempah Oleh' }}
                  </p>
                  <p class="driver-info-name capitalize">{{ k.status === 'Sedang Digunakan' ? k.pemandu : k.pembuat_tempahan }}</p>
                  <p class="driver-info-dest">→ {{ k.status === 'Sedang Digunakan' ? k.destinasi : k.destinasi_booking }}</p>
                </div>
              </div>

              <div v-if="k.status === 'Sedang Digunakan' && k.pemandu_id === currentUser?.id" class="flex flex-col gap-2 mt-3">
                <button @click.stop="bukaModalLogHarian(k)" class="md3-btn-outlined w-full">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Rekod Pergerakan Harian
                </button>
                <button @click.stop="bukaBorangPulang(k)" class="md3-btn-filled w-full">
                  Pulangkan Kunci
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEJARAH TAB -->
      <div v-if="activeTab === 'sejarah'" class="tab-content">
        <p class="section-label mb-4">Log Perjalanan Lampau</p>

        <div v-if="sejarahList.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-title">Tiada Rekod</p>
          <p class="empty-sub">Anda belum mempunyai sejarah penggunaan.</p>
        </div>

        <div v-for="rekod in sejarahList" :key="rekod.id" class="history-card">
          <div class="flex items-center gap-3 mb-3">
            <div class="history-icon">
              {{ rekod.kategori === 'Bot' ? '🚤' : '🚗' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="vehicle-plate">{{ rekod.no_plat }}</h3>
              <p class="text-xs" style="color:#71796E">{{ formatTarikh(rekod.masa_keluar) }}</p>
            </div>
            <span :class="['status-chip', rekod.status_trip === 'Selesai' ? 'status-chip--selesai' : 'status-chip--aktif']">
              {{ rekod.status_trip }}
            </span>
          </div>
          <div class="history-dest-box">
            <p class="font-semibold text-sm" style="color:#191C18">{{ rekod.destinasi }}</p>
            <p class="text-xs mt-0.5" style="color:#5A6758">{{ rekod.tujuan }}</p>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div v-if="rekod.status_trip === 'Selesai' && rekod.odo_tamat" class="text-xs font-semibold" style="color:#2E7D4F">
              Jarak ditempuh: {{ rekod.odo_tamat - rekod.odo_mula }} km
            </div>
            <div v-else></div>
            <button @click="bukaModalEditSejarah(rekod)" class="edit-btn">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828z"/></svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- PROFIL TAB -->
      <div v-if="activeTab === 'profil'" class="tab-content">
        <p class="section-label mb-4">Profil Pengguna</p>
        <div class="profile-card">
          <div class="profile-avatar">
            {{ currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U' }}
          </div>
          <h2 class="profile-name capitalize">{{ currentUser?.name }}</h2>
          <p class="profile-email">{{ currentUser?.email }}</p>
          <div class="profile-info-row">
            <span class="profile-info-label">Stesen</span>
            <span class="profile-info-value">{{ currentUser?.negeri || 'TNPP' }}</span>
          </div>
          <div class="profile-info-row">
            <span class="profile-info-label">Peranan</span>
            <span class="profile-info-value">{{ currentUser?.role }}</span>
          </div>
        </div>

        <button v-if="currentUser?.role === 'Admin'" @click="$router.push('/admin')" class="md3-btn-tonal w-full mb-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Panel Pentadbir
        </button>
        <button @click="handleLogout" class="md3-btn-danger w-full">Log Keluar</button>
      </div>

    </main>

    <!-- Modern Floating Navigation Bar -->
    <nav class="nav-bar">
      <div class="nav-bar-inner">

        <button @click="tukarTab('home')" :class="['nav-item', activeTab === 'home' ? 'nav-item--active' : '']">
          <span class="nav-icon">
            <svg v-if="activeTab === 'home'" class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.689z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
          </span>
          <span class="nav-label">Utama</span>
        </button>

        <button @click="tukarTab('sejarah')" :class="['nav-item', activeTab === 'sejarah' ? 'nav-item--active' : '']">
          <span class="nav-icon">
            <svg v-if="activeTab === 'sejarah'" class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span class="nav-label">Sejarah</span>
        </button>

        <button @click="tukarTab('profil')" :class="['nav-item', activeTab === 'profil' ? 'nav-item--active' : '']">
          <span class="nav-icon">
            <svg v-if="activeTab === 'profil'" class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          <span class="nav-label">Profil</span>
        </button>

      </div>
    </nav>

    <!-- Modals -->
    <ModalAmbilKunci v-if="showModalAmbil" :kenderaan="pilihanKenderaan" @close="showModalAmbil = false" @success="handleSuccess" />
    <ModalPulangkanKunci v-if="showModalPulang" :kenderaan="pilihanKenderaan" @close="showModalPulang = false" @success="handleSuccess" />
    <ModalLogHarian v-if="showModalLogHarian" :kenderaan="pilihanKenderaan" @close="showModalLogHarian = false" @success="handleSuccess" />
    <ModalEditSejarah v-if="rekodDipilihEdit" :rekod="rekodDipilihEdit" @close="rekodDipilihEdit = null" @success="onEditSejarahSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

import ModalAmbilKunci from '../components/dashboard/ModalAmbilKunci.vue'
import ModalPulangkanKunci from '../components/dashboard/ModalPulangkanKunci.vue'
import ModalLogHarian from '../components/dashboard/ModalLogHarian.vue'
import ModalEditSejarah from '../components/dashboard/ModalEditSejarah.vue'

const router = useRouter()
const activeTab = ref('home')
const kenderaanList = ref([])
const sejarahList = ref([])
const currentUser = ref(null)
const pilihanKenderaan = ref(null)

const showModalAmbil = ref(false)
const showModalPulang = ref(false)
const showModalLogHarian = ref(false)
const rekodDipilihEdit = ref(null)

const tukarTab = (tab) => {
  activeTab.value = tab
  if (tab === 'home') fetchKenderaan()
  if (tab === 'sejarah') fetchSejarah()
}

const fetchKenderaan = async () => {
  try {
    const res = await api.get('/kenderaan/senarai')
    kenderaanList.value = res.data.data
  } catch (e) {
    if (e.response?.status === 401) handleLogout()
  }
}

const fetchSejarah = async () => {
  try {
    const res = await api.get('/pergerakan/sejarah')
    sejarahList.value = res.data.data
  } catch (e) { console.error(e) }
}

const userSedangMemandu = computed(() => kenderaanList.value.find(k => k.status === 'Sedang Digunakan' && k.pemandu_id === currentUser.value?.id))
const filteredList = computed(() => userSedangMemandu.value ? [userSedangMemandu.value] : kenderaanList.value)

const bolehAmbil = (k) => {
  if (k.status === 'Tersedia') return true
  if (k.status === 'Ditempah' && k.booking_staff_id === currentUser.value?.id) return true
  return false
}

const statusChipClass = (status) => {
  if (status === 'Tersedia') return 'status-chip--tersedia'
  if (status === 'Sedang Digunakan') return 'status-chip--guna'
  if (status === 'Dalam Servis') return 'status-chip--servis'
  return 'status-chip--tempah'
}

const bukaBorangAmbil = (k) => { pilihanKenderaan.value = k; showModalAmbil.value = true }
const bukaBorangPulang = (k) => { pilihanKenderaan.value = k; showModalPulang.value = true }
const bukaModalLogHarian = (k) => { pilihanKenderaan.value = k; showModalLogHarian.value = true }
const bukaModalEditSejarah = (rekod) => { rekodDipilihEdit.value = rekod }
const onEditSejarahSuccess = () => { rekodDipilihEdit.value = null; fetchSejarah() }

const handleSuccess = () => {
  showModalAmbil.value = false
  showModalPulang.value = false
  showModalLogHarian.value = false
  fetchKenderaan()
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const formatTarikh = (str) => str ? new Date(str).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) currentUser.value = JSON.parse(userData)
  fetchKenderaan()
})
</script>

<style scoped>
.dash-screen { background: #F0F5EF; }

/* Top App Bar */
.top-bar {
  height: 64px; background: #2E7D4F;
  position: sticky; top: 0; z-index: 40;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.top-bar-title { font-size: 20px; font-weight: 700; color: white; letter-spacing: -0.3px; line-height: 1.2; }

.avatar-btn {
  width: 40px; height: 40px; border-radius: 100px;
  background: rgba(255,255,255,0.2); color: white;
  font-size: 16px; font-weight: 700;
  border: 2px solid rgba(255,255,255,0.4);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.avatar-btn:hover { background: rgba(255,255,255,0.3); }

/* Section labels */
.tab-content { animation: fadeUp 0.2s ease-out; }
.section-label { font-size: 11px; font-weight: 700; color: #71796E; text-transform: uppercase; letter-spacing: 0.12em; }
.greeting { font-size: 22px; font-weight: 600; color: #191C18; }
.greeting-sub { font-size: 14px; color: #71796E; margin-top: 2px; }

.refresh-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: #2E7D4F;
  background: none; border: none; cursor: pointer; padding: 4px 8px;
  border-radius: 100px;
  transition: background 0.2s;
}
.refresh-btn:hover { background: rgba(46,125,79,0.08); }

/* Vehicle Cards */
.vehicle-card {
  border-radius: 16px; padding: 16px;
  transition: box-shadow 0.2s, transform 0.1s;
}
.vehicle-card--available {
  background: white; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.vehicle-card--available:hover  { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.vehicle-card--available:active { transform: scale(0.99); }
.vehicle-card--busy {
  background: #E8EDE6;
  box-shadow: none;
}

.vehicle-icon {
  width: 56px; height: 56px; border-radius: 100px;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; flex-shrink: 0;
}
.vehicle-icon--available { background: #DCE5DA; }
.vehicle-icon--busy      { background: #D4D9D2; }

.vehicle-plate { font-size: 18px; font-weight: 700; color: #191C18; letter-spacing: -0.3px; }
.vehicle-model { font-size: 12px; color: #71796E; margin-top: 2px; }

.chevron-icon { color: #BFC9BD; }

/* Status chips */
.status-chip {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  padding: 3px 8px; border-radius: 100px;
}
.status-chip--tersedia { background: #B0EACC; color: #00391D; }
.status-chip--guna     { background: #FDDCB5; color: #6B3400; }
.status-chip--servis   { background: #E8E8E8; color: #444; }
.status-chip--tempah   { background: #D3E3FC; color: #0D2D6B; }
.status-chip--selesai  { background: #E8E8E8; color: #5A5A5A; }
.status-chip--aktif    { background: #B0EACC; color: #00391D; }

/* Driver info */
.driver-info-box {
  background: rgba(0,0,0,0.03); border-radius: 10px; padding: 10px 12px;
  display: flex; align-items: flex-start; gap: 10px;
}
.driver-info-label { font-size: 10px; font-weight: 700; color: #71796E; text-transform: uppercase; letter-spacing: 0.1em; }
.driver-info-name  { font-size: 14px; font-weight: 600; color: #191C18; margin-top: 1px; }
.driver-info-dest  { font-size: 12px; color: #71796E; margin-top: 1px; }

/* History cards */
.history-card {
  background: white; border-radius: 16px; padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07); margin-bottom: 12px;
}
.history-icon {
  width: 48px; height: 48px; background: #DCE5DA; border-radius: 100px;
  display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
}
.history-dest-box {
  background: #F0F5EF; border-radius: 10px; padding: 10px 12px; margin-top: 4px;
}
.edit-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700; color: #2E7D4F;
  background: #DCE5DA; border: none; padding: 6px 12px;
  border-radius: 100px; cursor: pointer; margin-left: auto;
}

/* Profile */
.profile-card {
  background: white; border-radius: 20px; padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08); margin-bottom: 16px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.profile-avatar {
  width: 72px; height: 72px; background: #DCE5DA; color: #2E7D4F;
  border-radius: 100px; display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 700; margin-bottom: 12px;
}
.profile-name  { font-size: 20px; font-weight: 700; color: #191C18; }
.profile-email { font-size: 13px; color: #71796E; margin-top: 2px; margin-bottom: 16px; }
.profile-info-row {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-top: 1px solid #F0F5EF;
}
.profile-info-label { font-size: 11px; font-weight: 700; color: #71796E; text-transform: uppercase; letter-spacing: 0.1em; }
.profile-info-value { font-size: 13px; font-weight: 600; color: #191C18; }

/* Buttons */
.md3-btn-filled {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: #2E7D4F; color: white;
  padding: 12px 20px; border-radius: 100px;
  font-size: 14px; font-weight: 600;
  border: none; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.md3-btn-filled:hover  { background: #245F3E; }
.md3-btn-filled:active { transform: scale(0.98); }

.md3-btn-outlined {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: transparent; color: #2E7D4F;
  padding: 12px 20px; border-radius: 100px;
  font-size: 14px; font-weight: 600;
  border: 1.5px solid #2E7D4F; cursor: pointer;
  transition: background 0.2s;
}
.md3-btn-outlined:hover { background: rgba(46,125,79,0.08); }

.md3-btn-tonal {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: #B0EACC; color: #00391D;
  padding: 13px 20px; border-radius: 100px;
  font-size: 14px; font-weight: 600;
  border: none; cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 12px;
}
.md3-btn-tonal:hover { background: #9FE0BE; }

.md3-btn-danger {
  display: flex; align-items: center; justify-content: center;
  background: #F9DEDC; color: #B3261E;
  padding: 13px 20px; border-radius: 100px;
  font-size: 14px; font-weight: 600;
  border: none; cursor: pointer;
  transition: background 0.2s;
}
.md3-btn-danger:hover { background: #F4C7C3; }

/* Modern Floating Navigation Bar */
.nav-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  z-index: 40; padding: 0 16px 16px;
  display: flex; justify-content: center;
  pointer-events: none;
}

.nav-bar-inner {
  width: 100%; max-width: 416px; pointer-events: auto;
  background: rgba(250,255,248,0.9);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(220,229,218,0.85);
  border-radius: 26px;
  box-shadow: 0 10px 28px rgba(0,57,29,0.16), 0 2px 6px rgba(0,0,0,0.05);
  display: flex; justify-content: space-around; align-items: center;
  padding: 8px;
}

.nav-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  background: none; border: none; cursor: pointer;
  padding: 9px 0; border-radius: 18px; flex: 1;
  color: #8A948A;
  transition: background 0.25s ease, color 0.25s ease, transform 0.15s ease;
}
.nav-item:active { transform: scale(0.94); }
.nav-item--active {
  background: #2E7D4F; color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(46,125,79,0.35);
}

.nav-icon { display: flex; }
.nav-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.02em; }

/* Empty state */
.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon  { font-size: 48px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 600; color: #191C18; }
.empty-sub   { font-size: 13px; color: #71796E; margin-top: 4px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
