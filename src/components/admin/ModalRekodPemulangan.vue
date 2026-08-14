<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-white w-full max-w-md rounded shadow-xl max-h-[90vh] overflow-y-auto">

      <div class="px-5 py-4 bg-[#003479] rounded-t">
        <h3 class="text-sm font-bold text-white">Rekod Pemulangan Bagi Pihak Staf</h3>
        <p class="text-[11px] text-blue-100 mt-0.5">Untuk kenderaan yang sudah dipulangkan secara fizikal tapi belum direkod dalam apps</p>
      </div>

      <div class="p-5 space-y-4">
        <div class="bg-[#F8FAFC] border border-[#DFE3E8] rounded p-3">
          <p class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1">Kenderaan / Pemandu</p>
          <p class="text-sm font-bold text-[#1A2332]">{{ aset?.no_plat }} — <span class="capitalize">{{ aset?.pemandu_semasa || '—' }}</span></p>
          <p class="text-xs text-[#5A6672] mt-0.5">→ {{ aset?.destinasi_semasa || '—' }}</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Tarikh & Masa Dipulangkan</label>
          <input v-model="form.masa_masuk" type="datetime-local" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" />
        </div>

        <div v-if="aset?.kategori !== 'Bot'">
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Odometer Akhir (km)</label>
          <input v-model="form.odo_tamat" type="number" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Bacaan odometer semasa pulang" />
        </div>

        <div v-if="aset?.kategori !== 'Bot'">
          <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Baki Akhir Kad TnG (jika ada)</label>
          <input v-model="form.baki_tng" type="number" step="0.01" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="RM 0.00" />
          <p v-if="aset?.baki_tng_mula_semasa != null" class="text-[11px] text-[#5A6672] mt-1">Baki sebelum: RM {{ parseFloat(aset.baki_tng_mula_semasa).toFixed(2) }}</p>
          <div v-if="autoTopupDikesan" class="mt-1.5 bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-3 py-2 rounded">
            ⚡ Auto Topup Dikesan — baki naik drpd RM {{ parseFloat(aset.baki_tng_mula_semasa).toFixed(2) }} ke RM {{ parseFloat(form.baki_tng).toFixed(2) }}
          </div>
        </div>

        <div class="border-t border-[#DFE3E8] pt-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-[#003479] uppercase tracking-wide">Ada Rekod Isi Minyak?</p>
            <button @click="form.isi_minyak = !form.isi_minyak" :class="['w-11 h-6 rounded-full flex items-center px-0.5 transition-colors', form.isi_minyak ? 'bg-[#003479] justify-end' : 'bg-[#DFE3E8] justify-start']">
              <span class="w-5 h-5 bg-white rounded-full shadow"></span>
            </button>
          </div>

          <div v-if="form.isi_minyak" class="space-y-3">
            <div v-for="(resit, idx) in form.senarai_resit" :key="idx" class="relative bg-[#F8FAFC] border border-[#DFE3E8] rounded p-3">
              <button v-if="form.senarai_resit.length > 1" @click="buangResit(idx)" class="absolute -top-2 -right-2 bg-[#C0392B] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">×</button>
              <input v-model="resit.no_resit" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none mb-2" placeholder="No. Resit" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="resit.liter" type="number" step="0.01" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none" placeholder="Liter" />
                <input v-model="resit.rm" type="number" step="0.01" class="border border-[#DFE3E8] focus:border-[#003479] rounded px-2 py-2 text-xs outline-none" placeholder="RM" />
              </div>
            </div>
            <button @click="tambahResit" class="text-xs font-semibold text-[#003479] border border-[#003479] hover:bg-[#EEF3FB] px-3 py-1.5 rounded transition-colors w-full">+ Tambah Resit</button>
          </div>
        </div>

        <div class="flex gap-3 pt-2 border-t border-[#DFE3E8]">
          <button @click="hantar" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">Sahkan Pemulangan</button>
          <button @click="$emit('close')" class="flex-1 bg-[#F4F6FA] hover:bg-[#DFE3E8] text-[#5A6672] font-semibold text-sm py-2.5 rounded transition-colors">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import api from '../../api/axios'

const props = defineProps(['aset'])
const emit = defineEmits(['close', 'success'])

const toDatetimeLocal = (value) => {
  const d = value ? new Date(value) : new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const form = reactive({
  masa_masuk: toDatetimeLocal(),
  odo_tamat: props.aset?.odo_terkini || '',
  baki_tng: '',
  isi_minyak: false,
  senarai_resit: [{ no_resit: '', rm: '', liter: '' }]
})

const autoTopupDikesan = computed(() => {
  if (props.aset?.baki_tng_mula_semasa == null || form.baki_tng === '') return false
  return parseFloat(form.baki_tng) > parseFloat(props.aset.baki_tng_mula_semasa)
})

const tambahResit = () => form.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResit = (idx) => { if (form.senarai_resit.length > 1) form.senarai_resit.splice(idx, 1) }

const hantar = async () => {
  if (props.aset?.kategori !== 'Bot' && !form.odo_tamat) return alert('Sila isi Odometer Akhir')
  try {
    await api.put(`/admin/pergerakan/${props.aset.pergerakan_id}/checkin`, {
      masa_masuk: form.masa_masuk.replace('T', ' ') + ':00',
      odo_tamat: form.odo_tamat,
      baki_tng: form.baki_tng,
      isi_minyak: form.isi_minyak,
      senarai_resit: form.senarai_resit
    })
    emit('success')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat merekod pemulangan.')
  }
}
</script>
