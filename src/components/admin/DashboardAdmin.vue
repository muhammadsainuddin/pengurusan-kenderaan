<template>
  <div class="space-y-6 no-print">

    <!-- Page Title + Filters -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Status Aset Semasa</h2>
        <p class="page-sub">Paparan masa nyata semua kenderaan dan bot di stesen</p>
      </div>

      <div class="filter-tabs">
        <button @click="kategoriAktif = 'Semua'" :class="['filter-btn', kategoriAktif === 'Semua' ? 'filter-btn--active' : '']">Semua</button>
        <button @click="kategoriAktif = 'Darat'" :class="['filter-btn', kategoriAktif === 'Darat' ? 'filter-btn--active' : '']">Darat</button>
        <button @click="kategoriAktif = 'Bot'" :class="['filter-btn', kategoriAktif === 'Bot' ? 'filter-btn--active' : '']">Bot / Marin</button>
      </div>
    </div>

    <!-- Summary Chips -->
    <div class="summary-row">
      <div class="summary-chip summary-chip--tersedia">
        <span class="summary-chip-dot"></span>
        {{ ringkasanList.filter(a => a.status === 'Tersedia').length }} Tersedia
      </div>
      <div class="summary-chip summary-chip--guna">
        <span class="summary-chip-dot"></span>
        {{ ringkasanList.filter(a => a.status === 'Sedang Digunakan').length }} Sedang Digunakan
      </div>
      <div class="summary-chip summary-chip--servis">
        <span class="summary-chip-dot"></span>
        {{ ringkasanList.filter(a => a.status === 'Dalam Servis').length }} Di Bengkel
      </div>
    </div>

    <!-- Asset Cards Grid -->
    <div v-if="filteredAset.length > 0" class="assets-grid">
      <div v-for="aset in filteredAset" :key="aset.id" class="asset-card">

        <!-- Service Alert Badge -->
        <div v-if="aset.kategori !== 'Bot' && aset.servis_berikutnya_km > 0 && (aset.servis_berikutnya_km - aset.odo_terkini) <= 1000"
             class="service-alert-badge">
          ⚠ Perlu Servis
        </div>

        <!-- Card Header -->
        <div class="asset-card-header">
          <div class="flex items-center gap-3">
            <div :class="['asset-icon', assetIconClass(aset.status)]">
              {{ aset.kategori === 'Bot' ? '🚤' : (aset.kategori === 'Motorsikal' ? '🏍️' : '🚗') }}
            </div>
            <div>
              <h3 class="asset-plate">{{ aset.no_plat }}</h3>
              <p class="asset-model">{{ aset.model }}</p>
            </div>
          </div>
          <span :class="['status-badge', statusBadgeClass(aset.status)]">{{ aset.status }}</span>
        </div>

        <!-- Divider -->
        <div class="asset-divider"></div>

        <!-- Status Info Block -->
        <div :class="['status-info-block', statusInfoClass(aset.status)]">
          <template v-if="aset.status === 'Sedang Digunakan'">
            <p class="status-info-label status-info-label--guna">Pemandu Semasa</p>
            <p class="status-info-name">{{ aset.pemandu_semasa || '—' }}</p>
            <p class="status-info-dest">→ {{ aset.destinasi_semasa || '—' }}</p>
            <button @click="bukaModalPemulangan(aset)" class="rekod-pemulangan-btn">
              Sudah Dipulangkan? Rekod Sekarang
            </button>
          </template>
          <template v-else-if="aset.status === 'Ditempah'">
            <p class="status-info-label status-info-label--tempah">Tempahan Aktif</p>
            <p class="status-info-name">{{ aset.pembuat_tempahan || '—' }}</p>
            <p class="status-info-dest">→ {{ aset.destinasi_booking || '—' }}</p>
          </template>
          <template v-else-if="aset.status === 'Tersedia'">
            <p class="status-info-label status-info-label--tersedia">Status</p>
            <p class="status-info-name">Tersedia di Stesen</p>
            <p class="status-info-dest">Sedia untuk ditugaskan</p>
          </template>
          <template v-else>
            <p class="status-info-label">Status</p>
            <p class="status-info-name">Di Bengkel</p>
            <p class="status-info-dest">Dalam proses penyelenggaraan</p>
          </template>
        </div>

        <!-- Upcoming Bookings -->
        <div v-if="aset.senarai_tempahan && aset.senarai_tempahan.length > 0" class="bookings-section">
          <p class="bookings-label">Jadual Tempahan</p>
          <div class="space-y-1 max-h-20 overflow-y-auto">
            <div v-for="b in aset.senarai_tempahan" :key="b.id" class="booking-item">
              <div class="flex-1 min-w-0">
                <p class="booking-name">{{ b.pembuat_tempahan }}</p>
                <p class="booking-dest">{{ b.destinasi }}</p>
              </div>
              <span class="booking-date">{{ formatTarikhPendek(b.tarikh_mula) }}</span>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div v-if="aset.kategori !== 'Bot'" class="stat-item">
            <p class="stat-label stat-label--tng">Baki TnG</p>
            <p class="stat-value">{{ aset.baki_tng_terkini ? 'RM ' + parseFloat(aset.baki_tng_terkini).toFixed(2) : 'RM 0.00' }}</p>
          </div>
          <div class="stat-item">
            <p class="stat-label stat-label--fuel">Minyak (Bulan)</p>
            <p class="stat-value">RM {{ aset.total_rm_minyak ? parseFloat(aset.total_rm_minyak).toFixed(0) : '0' }}</p>
            <p class="stat-sub">{{ aset.total_liter_minyak ? parseFloat(aset.total_liter_minyak).toFixed(1) + ' L' : '0 L' }}</p>
          </div>
        </div>

        <!-- Service Progress (Land vehicles only) -->
        <div v-if="aset.kategori !== 'Bot'" class="service-section">
          <div class="flex justify-between items-center mb-1.5">
            <p class="service-label">Jarak Servis (km)</p>
            <p class="service-values">{{ aset.odo_terkini || 0 }} / {{ aset.servis_berikutnya_km || '—' }}</p>
          </div>
          <div class="service-bar-track">
            <div class="service-bar-fill"
              :class="getPeratusanServis(aset.odo_terkini, aset.servis_berikutnya_km) > 90 ? 'service-bar-fill--critical' : ''"
              :style="{ width: getPeratusanServis(aset.odo_terkini, aset.servis_berikutnya_km) + '%' }">
            </div>
          </div>
        </div>

        <div v-else class="marine-note">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Penyelenggaraan marin berdasarkan jam enjin (manual)
        </div>

      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3 class="empty-title">Tiada Aset Dijumpai</h3>
      <p class="empty-sub">Tiada rekod untuk kategori "{{ kategoriAktif }}".</p>
    </div>

    <ModalRekodPemulangan v-if="asetDipilihPemulangan" :aset="asetDipilihPemulangan" @close="asetDipilihPemulangan = null" @success="onPemulanganSuccess" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../api/axios'
import ModalRekodPemulangan from './ModalRekodPemulangan.vue'

const ringkasanList = ref([])
const kategoriAktif = ref('Semua')
const asetDipilihPemulangan = ref(null)

const bukaModalPemulangan = (aset) => { asetDipilihPemulangan.value = aset }
const onPemulanganSuccess = () => {
  asetDipilihPemulangan.value = null
  fetchDashboard()
}

const fetchDashboard = async () => {
  try {
    const res = await api.get('/admin/dashboard-summary')
    ringkasanList.value = res.data.data
  } catch (error) {
    console.error("Gagal menarik data ringkasan dashboard.")
  }
}

const filteredAset = computed(() => {
  if (kategoriAktif.value === 'Semua') return ringkasanList.value
  if (kategoriAktif.value === 'Darat') return ringkasanList.value.filter(a => a.kategori === 'Kereta' || a.kategori === 'Motorsikal')
  if (kategoriAktif.value === 'Bot') return ringkasanList.value.filter(a => a.kategori === 'Bot')
  return ringkasanList.value
})

const formatTarikhPendek = (tarikhStr) => {
  if (!tarikhStr) return ''
  return new Date(tarikhStr).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })
}

const getPeratusanServis = (terkini, target) => {
  if (!target || target === 0) return 0
  let peratus = (terkini / target) * 100
  return peratus > 100 ? 100 : peratus
}

const assetIconClass = (status) => {
  if (status === 'Sedang Digunakan') return 'asset-icon--guna'
  if (status === 'Tersedia') return 'asset-icon--tersedia'
  return 'asset-icon--other'
}

const statusBadgeClass = (status) => {
  if (status === 'Tersedia') return 'status-badge--tersedia'
  if (status === 'Sedang Digunakan') return 'status-badge--guna'
  if (status === 'Dalam Servis') return 'status-badge--servis'
  return 'status-badge--tempah'
}

const statusInfoClass = (status) => {
  if (status === 'Sedang Digunakan') return 'status-info-block--guna'
  if (status === 'Tersedia') return 'status-info-block--tersedia'
  if (status === 'Ditempah') return 'status-info-block--tempah'
  return ''
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
/* ── Page Header ── */
.page-header {
  display: flex; flex-wrap: wrap; gap: 16px;
  justify-content: space-between; align-items: flex-start;
}
.page-title { font-size: 20px; font-weight: 700; color: #1A2332; }
.page-sub   { font-size: 13px; color: #5A6672; margin-top: 2px; }

.filter-tabs {
  display: flex; background: #EEF3FB; border-radius: 8px; padding: 3px; gap: 2px;
}
.filter-btn {
  padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #5A6672;
  background: none; border: none; cursor: pointer; transition: all 0.15s;
}
.filter-btn--active { background: white; color: #003479; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

/* ── Summary Chips ── */
.summary-row { display: flex; gap: 8px; flex-wrap: wrap; }
.summary-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 100px;
  font-size: 12px; font-weight: 600;
}
.summary-chip-dot { width: 8px; height: 8px; border-radius: 100px; background: currentColor; }
.summary-chip--tersedia { background: #D1FAE5; color: #065F46; }
.summary-chip--guna     { background: #FEF3C7; color: #92400E; }
.summary-chip--servis   { background: #F3F4F6; color: #374151; }

/* ── Asset Grid ── */
.assets-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.asset-card {
  background: white; border-radius: 12px; padding: 20px;
  border: 1px solid #DFE3E8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 14px;
  transition: box-shadow 0.2s;
}
.asset-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

/* Service badge */
.service-alert-badge {
  position: absolute; top: 0; right: 0;
  background: #C0392B; color: white;
  font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
  padding: 4px 12px; border-radius: 0 12px 0 10px;
}

/* Card Header */
.asset-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.asset-icon {
  width: 44px; height: 44px; border-radius: 8px;
  font-size: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.asset-icon--tersedia { background: #D1FAE5; }
.asset-icon--guna     { background: #FEF3C7; }
.asset-icon--other    { background: #F3F4F6; }

.asset-plate { font-size: 18px; font-weight: 800; color: #1A2332; letter-spacing: -0.3px; }
.asset-model { font-size: 11px; color: #5A6672; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

/* Status Badge */
.status-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 6px;
}
.status-badge--tersedia { background: #D1FAE5; color: #065F46; }
.status-badge--guna     { background: #FEF3C7; color: #92400E; }
.status-badge--servis   { background: #E5E7EB; color: #374151; }
.status-badge--tempah   { background: #DBEAFE; color: #1E40AF; }

.asset-divider { height: 1px; background: #F3F4F6; }

/* Status Info */
.status-info-block {
  background: #F8FAFC; border-radius: 8px; padding: 12px 14px;
  border-left: 3px solid #DFE3E8;
}
.status-info-block--tersedia { border-left-color: #10B981; background: #F0FDF4; }
.status-info-block--guna     { border-left-color: #F59E0B; background: #FFFBEB; }
.status-info-block--tempah   { border-left-color: #3B82F6; background: #EFF6FF; }

.status-info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; color: #5A6672; }
.status-info-label--tersedia { color: #065F46; }
.status-info-label--guna     { color: #92400E; }
.status-info-label--tempah   { color: #1E40AF; }
.status-info-name { font-size: 14px; font-weight: 700; color: #1A2332; }
.status-info-dest { font-size: 12px; color: #5A6672; margin-top: 2px; }

.rekod-pemulangan-btn {
  margin-top: 10px; width: 100%;
  background: white; border: 1px solid #F59E0B; color: #92400E;
  font-size: 11px; font-weight: 700; padding: 7px 10px; border-radius: 6px;
  cursor: pointer; transition: background 0.15s;
}
.rekod-pemulangan-btn:hover { background: #FFFBEB; }

/* Bookings */
.bookings-section { }
.bookings-label { font-size: 10px; font-weight: 700; color: #5A6672; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
.booking-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 6px 10px; background: #F8FAFC; border-radius: 6px;
  border: 1px solid #F0F2F5; margin-bottom: 4px;
}
.booking-name { font-size: 12px; font-weight: 600; color: #1A2332; }
.booking-dest { font-size: 10px; color: #5A6672; }
.booking-date { font-size: 10px; font-weight: 700; color: #3B82F6; background: #DBEAFE; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }

/* Stats */
.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 4px; border-top: 1px solid #F3F4F6; }
.stat-item { }
.stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
.stat-label--tng  { color: #7C3AED; }
.stat-label--fuel { color: #2563EB; }
.stat-value { font-size: 16px; font-weight: 800; color: #1A2332; }
.stat-sub   { font-size: 11px; color: #5A6672; margin-top: 1px; }

/* Service progress */
.service-section { background: #F8FAFC; border-radius: 8px; padding: 10px 12px; }
.service-label  { font-size: 10px; font-weight: 700; color: #5A6672; text-transform: uppercase; letter-spacing: 0.08em; }
.service-values { font-size: 11px; font-weight: 600; color: #5A6672; }
.service-bar-track {
  width: 100%; height: 6px; background: #E5E7EB; border-radius: 100px; overflow: hidden;
}
.service-bar-fill {
  height: 100%; background: #003479; border-radius: 100px;
  transition: width 0.5s ease;
}
.service-bar-fill--critical { background: #C0392B; }

/* Marine note */
.marine-note {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: #5A6672; font-weight: 500;
  background: #EFF6FF; border-radius: 8px; padding: 8px 12px;
}

/* Empty state */
.empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; border: 1px solid #DFE3E8; }
.empty-icon  { font-size: 40px; margin-bottom: 10px; }
.empty-title { font-size: 16px; font-weight: 700; color: #1A2332; }
.empty-sub   { font-size: 13px; color: #5A6672; margin-top: 4px; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
