<template>
  <div class="fixed inset-0 z-50 flex items-end bg-black/50 transition-opacity backdrop-blur-[2px]">
    <div class="bg-[#F4F5F4] w-full max-w-md mx-auto rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl relative max-h-[95vh] overflow-y-auto animate-slide-up">
      <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
      <h2 class="text-[24px] font-bold text-gray-900 mb-6 flex justify-between items-center tracking-tight">
        Pulang Kunci
        <button @click="$emit('close')" class="text-teal-600 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm">Batal</button>
      </h2>
      <div class="space-y-4">
        <input v-if="kenderaan?.kategori !== 'Bot'" v-model="form.odo_tamat" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Odometer Akhir (km)" />
        
        <div v-if="kenderaan?.kategori !== 'Bot' && kenderaan?.ambil_kad_tng" class="bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
          <p class="text-[10px] text-purple-600 font-bold uppercase tracking-widest mb-1">Baki Kad TnG Terkini</p>
          <input v-model="form.baki_tng" type="number" step="0.01" class="w-full bg-transparent text-xl font-bold text-gray-900 outline-none" placeholder="RM 0.00" />
        </div>

        <div v-if="kenderaan?.ambil_kad_minyak || kenderaan?.kategori === 'Bot'" class="space-y-4">
          <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
            <span class="text-sm font-bold text-gray-700">Ada rekod isi minyak?</span>
            <div @click="form.isi_minyak = !form.isi_minyak" :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', form.isi_minyak ? 'bg-teal-600' : 'bg-gray-200']"><div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', form.isi_minyak ? 'translate-x-[20px]' : 'translate-x-0']"></div></div>
          </div>
          
          <div v-if="form.isi_minyak" class="space-y-4 bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
            <div class="flex justify-between items-center mb-1">
              <p class="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Resit Minyak</p>
              <button @click="tambahResit" class="bg-teal-100 text-teal-800 text-[10px] font-bold px-3 py-1.5 rounded-full">+ Tambah</button>
            </div>
            <div v-for="(resit, index) in form.senarai_resit" :key="index" class="relative bg-gray-50 p-4 rounded-xl border border-gray-200">
              <button v-if="form.senarai_resit.length > 1" @click="buangResit(index)" class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">X</button>
              <input v-model="resit.no_resit" type="text" class="w-full bg-white border border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-gray-900 font-bold outline-none text-sm mb-3" placeholder="No Resit" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="resit.rm" type="number" step="0.01" class="w-full bg-white border border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-gray-900 font-bold outline-none text-sm" placeholder="RM" />
                <input v-model="resit.liter" type="number" step="0.01" class="w-full bg-white border border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-gray-900 font-bold outline-none text-sm" placeholder="Liter" />
              </div>
            </div>
          </div>
        </div>
        <button @click="submit" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg mt-6 active:scale-95 transition-all">Sahkan Pemulangan</button>
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
  odo_tamat: '', 
  baki_tng: '', 
  isi_minyak: false, 
  senarai_resit: [{ no_resit: '', rm: '', liter: '' }] 
})

watch(() => props.kenderaan, (newVal) => {
  if (newVal) form.pergerakan_id = newVal.pergerakan_id
}, { immediate: true })

const tambahResit = () => form.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResit = (index) => form.senarai_resit.splice(index, 1)

const submit = async () => {
  if (props.kenderaan?.kategori !== 'Bot' && !form.odo_tamat) return alert("Sila isi Odometer Akhir")
  try {
    await api.post('/pergerakan/checkin', form)
    emit('success')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat Check-In')
  }
}
</script>