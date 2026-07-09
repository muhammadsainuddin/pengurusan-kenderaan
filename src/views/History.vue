<template>
  <div class="history-screen min-h-screen font-sans pb-12">

    <header class="top-bar">
      <div class="max-w-md mx-auto flex items-center gap-3 px-3 h-full">
        <button @click="$router.push('/dashboard')" class="md3-icon-btn-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <p class="top-bar-org">Rekod Peribadi</p>
          <h1 class="top-bar-title">Sejarah Penggunaan</h1>
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 pt-5">

      <div v-if="sejarahList.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-title">Tiada Rekod</p>
        <p class="empty-sub">Anda belum mempunyai sejarah penggunaan kenderaan.</p>
      </div>

      <div v-for="rekod in sejarahList" :key="rekod.id" class="history-card">
        <!-- Header Row -->
        <div class="flex items-center gap-3 mb-3">
          <div class="history-icon">
            {{ rekod.no_plat?.toLowerCase().includes('bot') ? '🚤' : '🚗' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold" style="color:#191C18">{{ rekod.no_plat }}</h3>
              <span :class="['status-chip', rekod.status_trip === 'Selesai' ? 'status-chip--selesai' : 'status-chip--aktif']">
                {{ rekod.status_trip }}
              </span>
            </div>
            <p class="text-xs mt-0.5" style="color:#71796E">{{ formatTarikh(rekod.masa_keluar) }}</p>
          </div>
        </div>

        <!-- Trip Info -->
        <div class="dest-box">
          <p class="text-sm font-semibold" style="color:#191C18">{{ rekod.destinasi }}</p>
          <p class="text-xs mt-1" style="color:#5A6758">{{ rekod.tujuan }}</p>
        </div>

        <!-- Odometer Stats -->
        <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t" style="border-color:#F0F5EF">
          <div>
            <p class="stat-label">Odo Mula</p>
            <p class="stat-value">{{ rekod.odo_mula ? rekod.odo_mula + ' km' : '—' }}</p>
          </div>
          <div>
            <p class="stat-label">Odo Akhir</p>
            <p class="stat-value">{{ rekod.odo_tamat ? rekod.odo_tamat + ' km' : '—' }}</p>
          </div>
        </div>

        <!-- Distance Badge + Edit -->
        <div class="flex items-center justify-between mt-3">
          <div v-if="rekod.status_trip === 'Selesai' && rekod.odo_tamat" class="distance-badge">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            Jarak: {{ rekod.odo_tamat - rekod.odo_mula }} km
          </div>
          <div v-else></div>
          <button @click="bukaModalEdit(rekod)" class="edit-btn">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828z"/></svg>
            Edit
          </button>
        </div>
      </div>

    </main>

    <ModalEditSejarah v-if="rekodDipilih" :rekod="rekodDipilih" @close="rekodDipilih = null" @success="onEditSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import ModalEditSejarah from '../components/dashboard/ModalEditSejarah.vue'

const sejarahList = ref([])
const rekodDipilih = ref(null)

const bukaModalEdit = (rekod) => { rekodDipilih.value = rekod }
const onEditSuccess = () => {
  rekodDipilih.value = null
  fetchSejarah()
}

const fetchSejarah = async () => {
  try {
    const res = await api.get('/pergerakan/sejarah')
    sejarahList.value = res.data.data
  } catch (error) {
    console.error("Gagal ambil sejarah")
  }
}

const formatTarikh = (tarikhStr) => {
  if (!tarikhStr) return '-'
  const date = new Date(tarikhStr)
  return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchSejarah()
})
</script>

<style scoped>
.history-screen { background: #F0F5EF; }

.top-bar {
  height: 64px; background: #2E7D4F;
  position: sticky; top: 0; z-index: 40;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.top-bar-org   { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.12em; }
.top-bar-title { font-size: 20px; font-weight: 700; color: white; letter-spacing: -0.3px; }

.md3-icon-btn-white {
  width: 40px; height: 40px; border-radius: 100px;
  background: rgba(255,255,255,0.15); border: none;
  color: white; cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.md3-icon-btn-white:hover { background: rgba(255,255,255,0.25); }

.history-card {
  background: white; border-radius: 16px; padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07); margin-bottom: 12px;
  animation: fadeUp 0.2s ease-out;
}
.history-icon {
  width: 48px; height: 48px; background: #DCE5DA; border-radius: 100px;
  display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
}
.dest-box {
  background: #F0F5EF; border-radius: 10px; padding: 10px 12px;
}

.stat-label { font-size: 10px; font-weight: 700; color: #71796E; text-transform: uppercase; letter-spacing: 0.1em; }
.stat-value { font-size: 14px; font-weight: 600; color: #191C18; margin-top: 2px; }

.distance-badge {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 10px;
  background: #B0EACC; color: #00391D;
  font-size: 12px; font-weight: 600;
  padding: 4px 10px; border-radius: 100px;
}

.edit-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700; color: #2E7D4F;
  background: #DCE5DA; border: none; padding: 6px 12px;
  border-radius: 100px; cursor: pointer; margin-left: auto;
}

.status-chip { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 100px; }
.status-chip--selesai { background: #E8E8E8; color: #5A5A5A; }
.status-chip--aktif   { background: #B0EACC; color: #00391D; }

.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon  { font-size: 48px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 600; color: #191C18; }
.empty-sub   { font-size: 13px; color: #71796E; margin-top: 4px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
