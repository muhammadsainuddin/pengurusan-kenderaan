<template>
  <div class="booking-screen min-h-screen font-sans pb-12">

    <!-- Top App Bar -->
    <header class="top-bar">
      <div class="max-w-md mx-auto flex items-center gap-3 px-3 h-full">
        <button @click="$router.push('/dashboard')" class="md3-icon-btn-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <p class="top-bar-org">Borang Rasmi</p>
          <h1 class="top-bar-title">Tempah Aset</h1>
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 pt-6">
      <div class="form-card">

        <div class="mb-6">
          <h2 class="form-section-title">Maklumat Tempahan</h2>
          <p class="form-section-sub">Sila isi butiran permohonan penggunaan kenderaan atau bot rasmi.</p>
        </div>

        <!-- Pilih Kenderaan -->
        <div class="md3-field mb-5">
          <label class="md3-field-label">Pilih Aset / Kenderaan</label>
          <div class="md3-select-wrap">
            <select v-model="form.kenderaan_id" class="md3-select">
              <option value="" disabled>-- Sila Pilih --</option>
              <option v-for="k in kenderaanList" :key="k.id" :value="k.id">
                {{ k.no_plat }} — {{ k.model }} ({{ k.kategori }})
              </option>
            </select>
            <svg class="md3-select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <!-- Tarikh -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="md3-field">
            <label class="md3-field-label">Tarikh Mula</label>
            <input v-model="form.tarikh_mula" type="datetime-local" class="md3-input md3-input--datetime" />
          </div>
          <div class="md3-field">
            <label class="md3-field-label">Tarikh Tamat</label>
            <input v-model="form.tarikh_tamat" type="datetime-local" class="md3-input md3-input--datetime" />
          </div>
        </div>

        <!-- Destinasi & Tujuan -->
        <div class="md3-field mb-4">
          <label class="md3-field-label">Lokasi Destinasi</label>
          <input v-model="form.destinasi" type="text" class="md3-input" placeholder="Cth: Pejabat SUK Putrajaya" />
        </div>

        <div class="md3-field mb-8">
          <label class="md3-field-label">Tujuan Rasmi</label>
          <input v-model="form.tujuan" type="text" class="md3-input" placeholder="Cth: Menghadiri Mesyuarat" />
        </div>

        <button @click="hantarTempahan" class="md3-btn-filled w-full">
          Sahkan Tempahan
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const kenderaanList = ref([])

const form = reactive({
  kenderaan_id: '',
  tarikh_mula: '',
  tarikh_tamat: '',
  destinasi: '',
  tujuan: ''
})

const fetchKenderaan = async () => {
  try {
    const response = await api.get('/kenderaan/senarai')
    kenderaanList.value = response.data.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}

const hantarTempahan = async () => {
  if (!form.kenderaan_id || !form.tarikh_mula || !form.tarikh_tamat || !form.destinasi || !form.tujuan) {
    return alert("Sila lengkapkan semua maklumat tempahan.")
  }

  if (new Date(form.tarikh_tamat) <= new Date(form.tarikh_mula)) {
    return alert("Tarikh dan Masa Tamat mestilah selepas Tarikh Mula.")
  }

  try {
    const response = await api.post('/booking/create', form)
    alert(response.data.message)
    router.push('/dashboard')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat semasa memproses tempahan.')
  }
}

onMounted(() => {
  fetchKenderaan()
})
</script>

<style scoped>
.booking-screen { background: #F0F5EF; }

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
  color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; flex-shrink: 0;
}
.md3-icon-btn-white:hover { background: rgba(255,255,255,0.25); }

.form-card {
  background: white; border-radius: 20px; padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  animation: fadeUp 0.25s ease-out;
}
.form-section-title { font-size: 18px; font-weight: 700; color: #191C18; }
.form-section-sub   { font-size: 13px; color: #71796E; margin-top: 3px; }

.md3-field { display: flex; flex-direction: column; gap: 5px; }
.md3-field-label { font-size: 11px; font-weight: 600; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; padding-left: 2px; }

.md3-input {
  background: #DCE5DA;
  border: none; border-bottom: 1.5px solid #71796E;
  border-radius: 4px 4px 0 0;
  padding: 14px 16px;
  font-size: 15px; font-weight: 500; color: #191C18;
  outline: none; transition: border-color 0.2s; width: 100%;
}
.md3-input:focus { border-bottom: 2.5px solid #2E7D4F; }
.md3-input::placeholder { color: #A0ABA0; font-weight: 400; font-size: 13px; }
.md3-input--datetime { font-size: 13px; padding: 12px 10px; }

.md3-select-wrap { position: relative; }
.md3-select {
  background: #DCE5DA;
  border: none; border-bottom: 1.5px solid #71796E;
  border-radius: 4px 4px 0 0;
  padding: 14px 40px 14px 16px;
  font-size: 15px; font-weight: 500; color: #191C18;
  outline: none; transition: border-color 0.2s;
  width: 100%; appearance: none; cursor: pointer;
}
.md3-select:focus { border-bottom: 2.5px solid #2E7D4F; }
.md3-select-icon {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; color: #71796E; pointer-events: none;
}

.md3-btn-filled {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: #2E7D4F; color: white;
  padding: 14px 24px; border-radius: 100px;
  font-size: 15px; font-weight: 600;
  border: none; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
.md3-btn-filled:hover  { background: #245F3E; }
.md3-btn-filled:active { transform: scale(0.98); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
