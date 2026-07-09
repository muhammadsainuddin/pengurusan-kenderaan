<template>
  <div class="sheet-backdrop" @click.self="$emit('close')">
    <div class="bottom-sheet">
      <div class="drag-handle"></div>

      <div class="sheet-header">
        <h2 class="sheet-title">Kemaskini Rekod</h2>
        <button @click="$emit('close')" class="sheet-close-btn">Batal</button>
      </div>

      <div class="space-y-4">

        <!-- Tarikh & Masa -->
        <div class="md3-field">
          <label class="md3-field-label">Tarikh & Masa Keluar</label>
          <input v-model="form.masa_keluar" type="datetime-local" class="md3-input" />
        </div>

        <div v-if="rekod?.status_trip === 'Selesai'" class="md3-field">
          <label class="md3-field-label">Tarikh & Masa Masuk</label>
          <input v-model="form.masa_masuk" type="datetime-local" class="md3-input" />
        </div>

        <!-- TnG Balance -->
        <div class="tng-card">
          <div class="flex items-center gap-2 mb-2">
            <div class="tng-icon">🛣️</div>
            <p class="tng-label">Baki Akhir Kad TnG</p>
          </div>
          <div class="md3-field">
            <input v-model="form.baki_tng" type="number" step="0.01" class="md3-input" placeholder="RM 0.00" />
          </div>
          <p v-if="rekod?.baki_tng_mula != null" class="tng-baki-sebelum">
            Baki sebelum: RM {{ parseFloat(rekod.baki_tng_mula).toFixed(2) }}
          </p>
          <div v-if="autoTopupDikesan" class="tng-topup-alert">
            ⚡ Auto Topup Dikesan — baki naik drpd RM {{ parseFloat(rekod.baki_tng_mula).toFixed(2) }} ke RM {{ parseFloat(form.baki_tng).toFixed(2) }}
          </div>
        </div>

        <!-- Fuel Receipts -->
        <div class="receipt-section">
          <div class="flex justify-between items-center mb-3">
            <p class="receipt-section-label">Senarai Resit Minyak</p>
            <button @click="tambahResit" class="add-receipt-btn">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              Tambah
            </button>
          </div>

          <div v-for="(resit, index) in form.senarai_resit" :key="index" class="receipt-card">
            <div class="flex justify-between items-center mb-3">
              <p class="receipt-number">Resit #{{ index + 1 }}</p>
              <button v-if="form.senarai_resit.length > 1" @click="buangResit(index)" class="remove-btn">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
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

        <button @click="submit" class="md3-btn-filled w-full mt-2">
          Simpan Perubahan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import api from '../../api/axios'

const props = defineProps(['rekod'])
const emit = defineEmits(['close', 'success'])

const form = reactive({
  odo_mula: '',
  odo_tamat: '',
  masa_keluar: '',
  masa_masuk: '',
  baki_tng: '',
  senarai_resit: [{ no_resit: '', rm: '', liter: '' }]
})

const toDatetimeLocal = (value) => {
  if (!value) return ''
  const d = new Date(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

watch(() => props.rekod, (rekod) => {
  if (!rekod) return
  form.odo_mula = rekod.odo_mula
  form.odo_tamat = rekod.odo_tamat
  form.masa_keluar = toDatetimeLocal(rekod.masa_keluar)
  form.masa_masuk = toDatetimeLocal(rekod.masa_masuk)
  form.baki_tng = rekod.baki_tng

  if (rekod.senarai_resit && rekod.senarai_resit.length > 0) {
    form.senarai_resit = JSON.parse(JSON.stringify(rekod.senarai_resit))
  } else {
    form.senarai_resit = [{ no_resit: rekod.no_resit_minyak || '', rm: rekod.jumlah_rm_minyak || '', liter: rekod.jumlah_liter_minyak || '' }]
  }
}, { immediate: true })

const tambahResit = () => form.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResit = (index) => { if (form.senarai_resit.length > 1) form.senarai_resit.splice(index, 1) }

// Kad TnG auto topup bila baki < RM50 — dikesan bila baki akhir lebih tinggi
// dari baki permulaan trip ini (baki tak boleh naik sendiri tanpa topup).
const autoTopupDikesan = computed(() => {
  if (props.rekod?.baki_tng_mula == null || form.baki_tng === '' || form.baki_tng === null) return false
  return parseFloat(form.baki_tng) > parseFloat(props.rekod.baki_tng_mula)
})

const submit = async () => {
  try {
    await api.put(`/pergerakan/${props.rekod.id}`, {
      odo_mula: form.odo_mula,
      odo_tamat: form.odo_tamat,
      masa_keluar: form.masa_keluar ? form.masa_keluar.replace('T', ' ') + ':00' : null,
      masa_masuk: form.masa_masuk ? form.masa_masuk.replace('T', ' ') + ':00' : null,
      baki_tng: form.baki_tng,
      senarai_resit: form.senarai_resit
    })
    emit('success')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat mengemaskini rekod')
  }
}
</script>

<style scoped>
.sheet-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.45); backdrop-filter: blur(2px);
  display: flex; align-items: flex-end;
}
.bottom-sheet {
  background: #F0F5EF; width: 100%; max-width: 448px; margin: 0 auto;
  border-radius: 28px 28px 0 0; padding: 12px 20px 32px;
  max-height: 92vh; overflow-y: auto;
  animation: slideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.drag-handle {
  width: 32px; height: 4px; background: #BFC9BD;
  border-radius: 100px; margin: 0 auto 20px;
}
.sheet-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.sheet-title { font-size: 22px; font-weight: 600; color: #191C18; }
.sheet-close-btn {
  font-size: 13px; font-weight: 600; color: #2E7D4F;
  background: white; border: none; padding: 6px 14px;
  border-radius: 100px; cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

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

.tng-card {
  background: #EDE9F5; border-radius: 16px; padding: 14px 16px;
}
.tng-icon  { font-size: 20px; }
.tng-label { font-size: 12px; font-weight: 700; color: #5B21B6; text-transform: uppercase; letter-spacing: 0.1em; }
.tng-baki-sebelum { font-size: 11px; color: #5B21B6; opacity: 0.7; margin-top: 6px; padding-left: 2px; }
.tng-topup-alert {
  margin-top: 10px; background: #FEF3C7; color: #92400E;
  font-size: 12px; font-weight: 700; padding: 10px 12px;
  border-radius: 10px; border: 1px solid #FDE68A;
}

.receipt-section {
  background: white; border-radius: 16px; padding: 16px;
}
.receipt-section-label { font-size: 12px; font-weight: 700; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; }
.add-receipt-btn {
  display: flex; align-items: center; gap: 4px;
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

@keyframes slideUp {
  from { transform: translateY(60px); opacity: 0.5; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>
