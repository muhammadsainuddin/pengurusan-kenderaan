<template>
  <div class="quick-screen min-h-screen font-sans pb-12">

    <header class="top-bar">
      <div class="max-w-md mx-auto flex items-center gap-3 px-4 h-full">
        <div class="qr-icon">📷</div>
        <div>
          <p class="top-bar-org">Akses Pantas QR</p>
          <h1 class="top-bar-title">Ambil / Pulang Kunci</h1>
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 pt-5">

      <div v-if="loading" class="state-box">Memuatkan maklumat kenderaan...</div>

      <div v-else-if="ralat" class="state-box state-box--error">
        <p class="text-2xl mb-2">⚠️</p>
        {{ ralat }}
      </div>

      <template v-else-if="kenderaan">
        <!-- Vehicle Summary -->
        <div class="vehicle-summary">
          <div class="vehicle-summary-icon">{{ kenderaan.kategori === 'Bot' ? '🚤' : '🚗' }}</div>
          <div class="flex-1 min-w-0">
            <p class="vehicle-summary-label">Kenderaan Dikesan</p>
            <p class="vehicle-summary-plate">{{ kenderaan.no_plat }}</p>
            <p class="vehicle-summary-model">{{ kenderaan.model }} · {{ kenderaan.kategori }}</p>
          </div>
          <span :class="['status-chip', statusChipClass]">{{ kenderaan.status }}</span>
        </div>

        <!-- DALAM SERVIS -->
        <div v-if="kenderaan.status === 'Dalam Servis'" class="state-box state-box--warning">
          Kenderaan ini sedang dalam servis dan tidak boleh digunakan buat masa ini.
        </div>

        <!-- BORANG AMBIL KUNCI -->
        <div v-else-if="kenderaan.status === 'Tersedia'" class="space-y-4">
          <div class="md3-field">
            <label class="md3-field-label">Nama Staf</label>
            <select v-model="formKeluar.staff_id" class="md3-input" style="width:100%">
              <option value="" disabled>-- Pilih nama anda --</option>
              <option v-for="s in senaraiStaff" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Tujuan Rasmi</label>
            <input v-model="formKeluar.tujuan" type="text" class="md3-input" placeholder="Cth: Rondaan kawasan hutan" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Lokasi Destinasi</label>
            <input v-model="formKeluar.destinasi" type="text" class="md3-input" placeholder="Cth: Hutan Simpan Belum" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Nama Pengguna (Pilihan)</label>
            <input v-model="formKeluar.nama_pengguna" type="text" class="md3-input" placeholder="Nama jika berbeza dari staf di atas" />
          </div>

          <div v-if="kenderaan.kategori !== 'Bot'" class="md3-field">
            <label class="md3-field-label">Odometer Mula (km)</label>
            <input v-model="formKeluar.odo_mula" type="number" class="md3-input" :placeholder="kenderaan.odo_terkini ? kenderaan.odo_terkini + ' km (terkini)' : '0'" />
          </div>

          <div v-if="kenderaan.kategori !== 'Bot'" class="toggles-section">
            <div class="toggle-row">
              <p class="toggle-label">Ambil Kad Minyak</p>
              <div @click="formKeluar.ambil_kad_minyak = !formKeluar.ambil_kad_minyak" :class="['md3-switch', formKeluar.ambil_kad_minyak ? 'md3-switch--on' : '']">
                <div :class="['md3-switch-thumb', formKeluar.ambil_kad_minyak ? 'md3-switch-thumb--on' : '']"></div>
              </div>
            </div>
            <div class="toggle-row">
              <p class="toggle-label">Ambil Kad TnG</p>
              <div @click="formKeluar.ambil_kad_tng = !formKeluar.ambil_kad_tng" :class="['md3-switch', formKeluar.ambil_kad_tng ? 'md3-switch--on' : '']">
                <div :class="['md3-switch-thumb', formKeluar.ambil_kad_tng ? 'md3-switch-thumb--on' : '']"></div>
              </div>
            </div>
          </div>

          <button @click="hantarCheckout" class="md3-btn-filled w-full">Ambil Kunci & Keluar</button>
        </div>

        <!-- BORANG PULANG KUNCI -->
        <div v-else-if="kenderaan.status === 'Sedang Digunakan'" class="space-y-4">
          <div class="driver-info-box">
            <p class="driver-info-label">Sedang Digunakan Oleh</p>
            <p class="driver-info-name">{{ kenderaan.pemandu_semasa || '—' }}</p>
            <p class="driver-info-dest">→ {{ kenderaan.destinasi_semasa || '—' }}</p>
          </div>

          <div v-if="kenderaan.kategori !== 'Bot'" class="md3-field">
            <label class="md3-field-label">Odometer Akhir (km)</label>
            <input v-model="formMasuk.odo_tamat" type="number" class="md3-input" placeholder="Bacaan odometer semasa pulang" />
          </div>

          <div v-if="kenderaan.kategori !== 'Bot'" class="tng-card">
            <div class="flex items-center gap-2 mb-2">
              <div class="tng-icon">🛣️</div>
              <p class="tng-label">Baki Akhir Kad TnG (jika ada)</p>
            </div>
            <div class="md3-field">
              <input v-model="formMasuk.baki_tng" type="number" step="0.01" class="md3-input" placeholder="RM 0.00" />
            </div>
            <p v-if="kenderaan.baki_tng_terakhir != null" class="tng-baki-sebelum">
              Baki sebelum: RM {{ parseFloat(kenderaan.baki_tng_terakhir).toFixed(2) }}
            </p>
            <div v-if="autoTopupDikesan" class="tng-topup-alert">
              ⚡ Auto Topup Dikesan — baki naik drpd RM {{ parseFloat(kenderaan.baki_tng_terakhir).toFixed(2) }} ke RM {{ parseFloat(formMasuk.baki_tng).toFixed(2) }}
            </div>
          </div>

          <div class="toggle-card">
            <div>
              <p class="toggle-label">Ada rekod isi minyak?</p>
              <p class="toggle-sub">Tambah resit jika ada pengisian bahan api</p>
            </div>
            <div @click="formMasuk.isi_minyak = !formMasuk.isi_minyak" :class="['md3-switch', formMasuk.isi_minyak ? 'md3-switch--on' : '']">
              <div :class="['md3-switch-thumb', formMasuk.isi_minyak ? 'md3-switch-thumb--on' : '']"></div>
            </div>
          </div>

          <div v-if="formMasuk.isi_minyak" class="receipt-section">
            <div class="flex justify-between items-center mb-3">
              <p class="receipt-section-label">Senarai Resit Minyak</p>
              <button @click="tambahResit" class="add-receipt-btn">+ Tambah</button>
            </div>
            <div v-for="(resit, index) in formMasuk.senarai_resit" :key="index" class="receipt-card">
              <div class="flex justify-between items-center mb-3">
                <p class="receipt-number">Resit #{{ index + 1 }}</p>
                <button v-if="formMasuk.senarai_resit.length > 1" @click="buangResit(index)" class="remove-btn">✕</button>
              </div>
              <div class="md3-field mb-3">
                <label class="md3-field-label">No. Resit</label>
                <input v-model="resit.no_resit" type="text" class="md3-input" placeholder="A123456" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="md3-field">
                  <label class="md3-field-label">Jumlah (RM)</label>
                  <input v-model="resit.rm" type="number" step="0.01" class="md3-input" placeholder="0.00" />
                </div>
                <div class="md3-field">
                  <label class="md3-field-label">Liter</label>
                  <input v-model="resit.liter" type="number" step="0.01" class="md3-input" placeholder="0.0" />
                </div>
              </div>
            </div>
          </div>

          <button @click="hantarCheckin" class="md3-btn-filled w-full">Sahkan Pemulangan</button>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const token = route.params.token

const loading = ref(true)
const ralat = ref('')
const kenderaan = ref(null)
const senaraiStaff = ref([])

const formKeluar = reactive({
  staff_id: '', tujuan: '', destinasi: '', nama_pengguna: '',
  odo_mula: '', ambil_kad_minyak: false, ambil_kad_tng: false, is_operasi: false
})

const formMasuk = reactive({
  odo_tamat: '', baki_tng: '', isi_minyak: false,
  senarai_resit: [{ no_resit: '', rm: '', liter: '' }]
})

const statusChipClass = computed(() => {
  if (!kenderaan.value) return ''
  if (kenderaan.value.status === 'Tersedia') return 'status-chip--tersedia'
  if (kenderaan.value.status === 'Sedang Digunakan') return 'status-chip--guna'
  return 'status-chip--servis'
})

const autoTopupDikesan = computed(() => {
  if (!kenderaan.value || kenderaan.value.baki_tng_terakhir == null || formMasuk.baki_tng === '') return false
  return parseFloat(formMasuk.baki_tng) > parseFloat(kenderaan.value.baki_tng_terakhir)
})

const tambahResit = () => formMasuk.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResit = (index) => { if (formMasuk.senarai_resit.length > 1) formMasuk.senarai_resit.splice(index, 1) }

const muatkanKenderaan = async () => {
  loading.value = true
  ralat.value = ''
  try {
    const res = await api.get(`/quick/${token}`)
    kenderaan.value = res.data.data
    senaraiStaff.value = res.data.senaraiStaff
    formKeluar.odo_mula = kenderaan.value.odo_terkini || ''
  } catch (error) {
    ralat.value = error.response?.data?.message || 'Kod QR tidak sah atau ralat pelayan.'
  } finally {
    loading.value = false
  }
}

const hantarCheckout = async () => {
  if (!formKeluar.staff_id) return alert('Sila pilih nama anda.')
  if (!formKeluar.tujuan || !formKeluar.destinasi) return alert('Sila lengkapkan maklumat.')
  try {
    await api.post('/quick/checkout', { token, ...formKeluar })
    alert('Berjaya! Kunci telah didaftarkan keluar.')
    muatkanKenderaan()
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat Check-Out')
  }
}

const hantarCheckin = async () => {
  if (kenderaan.value.kategori !== 'Bot' && !formMasuk.odo_tamat) return alert('Sila isi Odometer Akhir')
  try {
    await api.post('/quick/checkin', { token, ...formMasuk })
    alert('Berjaya! Kenderaan telah dipulangkan.')
    muatkanKenderaan()
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat Check-In')
  }
}

onMounted(() => muatkanKenderaan())
</script>

<style scoped>
.quick-screen { background: #F0F5EF; }

.top-bar {
  height: 64px; background: #2E7D4F;
  position: sticky; top: 0; z-index: 40;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.qr-icon { font-size: 22px; }
.top-bar-org   { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.12em; }
.top-bar-title { font-size: 18px; font-weight: 700; color: white; letter-spacing: -0.3px; }

.state-box {
  background: white; border-radius: 16px; padding: 40px 20px;
  text-align: center; color: #5A6758; font-size: 14px; font-weight: 500;
}
.state-box--error   { background: #FDECEA; color: #8B1E14; }
.state-box--warning { background: #FEF3C7; color: #92400E; }

.vehicle-summary {
  background: white; border-radius: 16px; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
}
.vehicle-summary-icon {
  font-size: 28px; width: 52px; height: 52px;
  background: #DCE5DA; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.vehicle-summary-label { font-size: 10px; font-weight: 700; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; }
.vehicle-summary-plate { font-size: 18px; font-weight: 700; color: #191C18; margin-top: 1px; }
.vehicle-summary-model { font-size: 12px; color: #71796E; }

.status-chip { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 100px; flex-shrink: 0; }
.status-chip--tersedia { background: #B0EACC; color: #00391D; }
.status-chip--guna     { background: #FDDCB5; color: #6B3400; }
.status-chip--servis   { background: #E8E8E8; color: #444; }

.md3-field { display: flex; flex-direction: column; gap: 5px; }
.md3-field-label { font-size: 11px; font-weight: 600; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; padding-left: 2px; }
.md3-input {
  background: #DCE5DA; border: none; border-bottom: 1.5px solid #71796E;
  border-radius: 4px 4px 0 0; padding: 13px 14px;
  font-size: 15px; font-weight: 500; color: #191C18;
  outline: none; transition: border-color 0.2s; width: 100%;
}
.md3-input:focus { border-bottom: 2.5px solid #2E7D4F; }
.md3-input::placeholder { color: #A0ABA0; font-weight: 400; font-size: 13px; }

.toggles-section { background: white; border-radius: 16px; overflow: hidden; }
.toggle-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; border-bottom: 1px solid #F0F5EF;
}
.toggle-row:last-child { border-bottom: none; }
.toggle-card {
  background: white; border-radius: 16px; padding: 14px 16px;
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
}
.toggle-label { font-size: 14px; font-weight: 600; color: #191C18; }
.toggle-sub   { font-size: 11px; color: #71796E; margin-top: 1px; }

.md3-switch {
  width: 52px; height: 32px; border-radius: 100px;
  background: #BFC9BD; padding: 4px;
  display: flex; align-items: center;
  cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.md3-switch--on { background: #2E7D4F; }
.md3-switch-thumb {
  width: 24px; height: 24px; background: white; border-radius: 100px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.2s;
}
.md3-switch-thumb--on { transform: translateX(20px); }

.driver-info-box {
  background: white; border-radius: 16px; padding: 14px 16px;
}
.driver-info-label { font-size: 10px; font-weight: 700; color: #71796E; text-transform: uppercase; letter-spacing: 0.1em; }
.driver-info-name  { font-size: 15px; font-weight: 700; color: #191C18; margin-top: 2px; }
.driver-info-dest  { font-size: 12px; color: #71796E; margin-top: 1px; }

.tng-card { background: #EDE9F5; border-radius: 16px; padding: 14px 16px; }
.tng-icon  { font-size: 20px; }
.tng-label { font-size: 12px; font-weight: 700; color: #5B21B6; text-transform: uppercase; letter-spacing: 0.1em; }
.tng-baki-sebelum { font-size: 11px; color: #5B21B6; opacity: 0.7; margin-top: 6px; padding-left: 2px; }
.tng-topup-alert {
  margin-top: 10px; background: #FEF3C7; color: #92400E;
  font-size: 12px; font-weight: 700; padding: 10px 12px;
  border-radius: 10px; border: 1px solid #FDE68A;
}

.receipt-section { background: white; border-radius: 16px; padding: 16px; }
.receipt-section-label { font-size: 12px; font-weight: 700; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; }
.add-receipt-btn {
  font-size: 12px; font-weight: 700; color: #2E7D4F;
  background: #DCE5DA; border: none; padding: 6px 12px;
  border-radius: 100px; cursor: pointer;
}
.receipt-card {
  background: #F8FAF7; border-radius: 12px; padding: 14px;
  margin-top: 10px; border: 1px solid #E4EDE4;
}
.receipt-number { font-size: 12px; font-weight: 700; color: #71796E; }
.remove-btn {
  width: 28px; height: 28px; background: #F9DEDC; color: #B3261E;
  border-radius: 100px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

.md3-btn-filled {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: #2E7D4F; color: white;
  padding: 14px 24px; border-radius: 100px;
  font-size: 15px; font-weight: 600;
  border: none; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.md3-btn-filled:hover  { background: #245F3E; }
.md3-btn-filled:active { transform: scale(0.98); }
</style>
