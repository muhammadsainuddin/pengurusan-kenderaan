<template>
  <div class="fixed inset-0 z-50 flex items-end bg-black/50 transition-opacity backdrop-blur-[2px]">
    <div class="bg-[#F4F5F4] w-full max-w-md mx-auto rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl relative max-h-[95vh] overflow-y-auto animate-slide-up">
      <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
      <h2 class="text-[24px] font-bold text-gray-900 mb-6 flex justify-between items-center tracking-tight">
        Log Harian Operasi
        <button @click="$emit('close')" class="text-teal-600 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm">Batal</button>
      </h2>

      <div class="space-y-4">
        <div class="bg-teal-50 p-4 rounded-2xl border border-teal-100 mb-2">
          <p class="text-[10px] text-teal-600 font-black uppercase tracking-widest">Aset: {{ kenderaan?.no_plat }}</p>
          <p class="text-xs text-gray-500 font-medium">Rekodkan pergerakan harian di luar stesen.</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Tarikh Pergerakan</label>
            <input v-model="form.tarikh" type="date" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" />
          </div>
          
          <input v-model="form.dari_lokasi" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Bermula Dari (Lokasi)" />
          <input v-model="form.ke_lokasi" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Destinasi (Lokasi)" />
          <input v-model="form.tujuan" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Tujuan / Tugasan" />
          
          <div class="grid grid-cols-2 gap-4">
            <input v-model="form.odo_mula" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Odo Mula" />
            <input v-model="form.odo_tamat" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Odo Akhir" />
          </div>

          <div class="pt-4 border-t border-dashed border-gray-300 space-y-3">
            <div class="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <label class="block text-[9px] font-bold text-purple-600 uppercase mb-1">Baki Kad TnG (RM)</label>
              <input v-model="form.baki_tng" type="number" step="0.01" class="w-full bg-transparent text-lg font-black text-purple-900 outline-none" placeholder="0.00" />
            </div>

            <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3">
              <label class="block text-[9px] font-bold text-blue-600 uppercase">Rekod Isi Minyak</label>
              <input v-model="form.no_resit_minyak" type="text" class="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm font-bold" placeholder="No. Resit" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="form.jumlah_rm_minyak" type="number" step="0.01" class="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm font-bold" placeholder="RM" />
                <input v-model="form.jumlah_liter_minyak" type="number" step="0.01" class="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Liter" />
              </div>
            </div>
          </div>
        </div>

        <button @click="submit" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg mt-4 active:scale-95 transition-all">Simpan Log Hari Ini</button>
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
  pergerakan_id: null, 
  tarikh: new Date().toISOString().slice(0, 10), 
  dari_lokasi: '', ke_lokasi: '', 
  odo_mula: '', odo_tamat: '', 
  tujuan: '', baki_tng: '', 
  jumlah_rm_minyak: '', jumlah_liter_minyak: '', no_resit_minyak: '' 
})

watch(() => props.kenderaan, (newVal) => {
  if (newVal) {
    form.pergerakan_id = newVal.pergerakan_id
    form.odo_mula = newVal.odo_terkini || ''
  }
}, { immediate: true })

const submit = async () => {
  if (!form.dari_lokasi || !form.ke_lokasi || !form.odo_tamat) return alert("Sila isi maklumat wajib.")
  try {
    const res = await api.post('/pergerakan/log-harian', form)
    alert(res.data.message)
    emit('success')
  } catch (error) {
    alert(error.response?.data?.message || "Gagal menyimpan log harian.")
  }
}
</script>