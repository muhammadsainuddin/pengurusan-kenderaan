<template>
  <div class="sheet-backdrop" @click.self="$emit('close')">
    <div class="bottom-sheet">
      <div class="drag-handle"></div>

      <div class="sheet-header">
        <h2 class="sheet-title">Daftar Keluar</h2>
        <button @click="$emit('close')" class="sheet-close-btn">Batal</button>
      </div>

      <!-- Vehicle Summary Card -->
      <div class="vehicle-summary">
        <div class="vehicle-summary-icon">
          {{ kenderaan?.kategori === 'Bot' ? '🚤' : '🚗' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="vehicle-summary-label">Aset Terpilih</p>
          <p class="vehicle-summary-plate">{{ kenderaan?.no_plat }}</p>
          <p class="vehicle-summary-model">{{ kenderaan?.model }} · {{ kenderaan?.kategori }}</p>
        </div>
        <div v-if="kenderaan?.kategori !== 'Bot'" class="text-right">
          <p class="vehicle-summary-label">Baki TnG</p>
          <p class="vehicle-summary-tng">RM {{ kenderaan?.baki_tng_terakhir ? parseFloat(kenderaan.baki_tng_terakhir).toFixed(2) : '0.00' }}</p>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="space-y-4">
        <div class="md3-field">
          <label class="md3-field-label">Tujuan Rasmi</label>
          <input v-model="form.tujuan" type="text" class="md3-input" placeholder="Cth: Rondaan kawasan hutan" />
        </div>

        <div class="md3-field">
          <label class="md3-field-label">Lokasi Destinasi</label>
          <input v-model="form.destinasi" type="text" class="md3-input" placeholder="Cth: Hutan Simpan Belum" />
        </div>

        <div class="md3-field">
          <label class="md3-field-label">Nama Pengguna (Pilihan)</label>
          <input v-model="form.nama_pengguna" type="text" class="md3-input md3-input--tonal" placeholder="Nama jika berbeza dari akaun" />
        </div>

        <div v-if="kenderaan?.kategori !== 'Bot'" class="md3-field">
          <label class="md3-field-label">Odometer Mula (km)</label>
          <input v-model="form.odo_mula" type="number" class="md3-input" :placeholder="kenderaan?.odo_terkini ? kenderaan.odo_terkini + ' km (terkini)' : '0'" />
        </div>

        <!-- Toggles -->
        <div class="toggles-section">
          <div class="toggle-row toggle-row--highlight">
            <div>
              <p class="toggle-label">Operasi Luar / Tugasan Khas</p>
              <p class="toggle-sub">Aktifkan untuk log pergerakan harian</p>
            </div>
            <div @click="form.is_operasi = !form.is_operasi" :class="['md3-switch', form.is_operasi ? 'md3-switch--on' : '']">
              <div :class="['md3-switch-thumb', form.is_operasi ? 'md3-switch-thumb--on' : '']"></div>
            </div>
          </div>

          <template v-if="kenderaan?.kategori !== 'Bot'">
            <div class="toggle-row">
              <p class="toggle-label">Ambil Kad Minyak</p>
              <div @click="form.ambil_kad_minyak = !form.ambil_kad_minyak" :class="['md3-switch', form.ambil_kad_minyak ? 'md3-switch--on' : '']">
                <div :class="['md3-switch-thumb', form.ambil_kad_minyak ? 'md3-switch-thumb--on' : '']"></div>
              </div>
            </div>

            <div class="toggle-row">
              <p class="toggle-label">Ambil Kad TnG</p>
              <div @click="form.ambil_kad_tng = !form.ambil_kad_tng" :class="['md3-switch', form.ambil_kad_tng ? 'md3-switch--on' : '']">
                <div :class="['md3-switch-thumb', form.ambil_kad_tng ? 'md3-switch-thumb--on' : '']"></div>
              </div>
            </div>
          </template>
        </div>

        <button @click="submit" class="md3-btn-filled w-full mt-2">
          Ambil Kunci & Keluar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import api from '../../api/axios'

const props = defineProps(['kenderaan'])
const emit = defineEmits(['close', 'success'])

const form = reactive({
  kenderaan_id: null,
  tujuan: '',
  destinasi: '',
  nama_pengguna: '',
  odo_mula: '',
  ambil_kad_minyak: false,
  ambil_kad_tng: false,
  is_operasi: false
})

watch(() => props.kenderaan, (newVal) => {
  if (newVal) {
    form.kenderaan_id = newVal.id
    form.tujuan = newVal.status === 'Ditempah' ? newVal.tujuan_booking : ''
    form.destinasi = newVal.status === 'Ditempah' ? newVal.destinasi_booking : ''
    form.odo_mula = newVal.odo_terkini || ''
  }
}, { immediate: true })

const submit = async () => {
  if (!form.tujuan || !form.destinasi) return alert("Sila lengkapkan maklumat")
  try {
    await api.post('/pergerakan/checkout', form)
    emit('success')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat Check-Out')
  }
}
</script>

<style scoped>
.sheet-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(2px);
  display: flex; align-items: flex-end;
}

.bottom-sheet {
  background: #F0F5EF;
  width: 100%; max-width: 448px; margin: 0 auto;
  border-radius: 28px 28px 0 0;
  padding: 12px 20px 32px;
  max-height: 92vh; overflow-y: auto;
  animation: slideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.drag-handle {
  width: 32px; height: 4px; background: #BFC9BD;
  border-radius: 100px; margin: 0 auto 20px;
}

.sheet-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
}
.sheet-title { font-size: 22px; font-weight: 600; color: #191C18; }
.sheet-close-btn {
  font-size: 13px; font-weight: 600; color: #2E7D4F;
  background: white; border: none; padding: 6px 14px;
  border-radius: 100px; cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Vehicle Summary */
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
.vehicle-summary-tng   { font-size: 15px; font-weight: 700; color: #5B21B6; margin-top: 1px; }

/* Fields */
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
.md3-input--tonal { background: #E4EDE4; }

/* Toggles */
.toggles-section { background: white; border-radius: 16px; overflow: hidden; }
.toggle-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #F0F5EF;
}
.toggle-row:last-child { border-bottom: none; }
.toggle-row--highlight { background: #F0FFF5; }
.toggle-label { font-size: 14px; font-weight: 600; color: #191C18; }
.toggle-sub   { font-size: 11px; color: #71796E; margin-top: 1px; }

/* MD3 Switch */
.md3-switch {
  width: 52px; height: 32px; border-radius: 100px;
  background: #BFC9BD; padding: 4px;
  display: flex; align-items: center;
  cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.md3-switch--on { background: #2E7D4F; }
.md3-switch-thumb {
  width: 24px; height: 24px; background: white; border-radius: 100px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.md3-switch-thumb--on { transform: translateX(20px); }

/* Button */
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

@keyframes slideUp {
  from { transform: translateY(60px); opacity: 0.5; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>
