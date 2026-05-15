<template>
  <div class="fixed inset-0 z-50 flex items-end bg-black/50 transition-opacity backdrop-blur-[2px]">
    <div class="bg-[#F4F5F4] w-full max-w-md mx-auto rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl relative max-h-[95vh] overflow-y-auto animate-slide-up">
      <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
      <h2 class="text-[24px] font-bold text-gray-900 mb-6 flex justify-between items-center tracking-tight">
        Daftar Keluar
        <button @click="$emit('close')" class="text-teal-600 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm">Batal</button>
      </h2>
      
      <div class="space-y-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-teal-100">
          <p class="text-[10px] text-teal-600 font-black uppercase tracking-widest mb-1">Aset Terpilih</p>
          <p class="text-xl text-gray-900 font-bold">{{ kenderaan?.no_plat }} <span class="text-sm font-medium text-gray-500">({{ kenderaan?.model }})</span></p>
          
          <div v-if="kenderaan?.kategori !== 'Bot'" class="mt-3 pt-3 border-t border-gray-50 grid grid-cols-2 gap-2">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pemandu Terakhir</p>
              <p class="text-[11px] font-bold text-gray-700 truncate">{{ kenderaan?.pemandu_terakhir || 'Tiada Rekod' }}</p>
            </div>
            <div>
              <p class="text-[9px] font-bold text-purple-500 uppercase tracking-widest">Baki TnG (Kini)</p>
              <p class="text-[11px] font-bold text-purple-700">RM {{ kenderaan?.baki_tng_terakhir ? parseFloat(kenderaan.baki_tng_terakhir).toFixed(2) : '0.00' }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <input v-model="form.tujuan" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Tujuan Rasmi" />
          <input v-model="form.destinasi" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Lokasi Destinasi" />
          <input v-model="form.nama_pengguna" type="text" class="w-full bg-teal-50 border border-teal-100 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-teal-900 font-bold outline-none shadow-sm" placeholder="Nama Pengguna (Pilihan)" />
          <input v-if="kenderaan?.kategori !== 'Bot'" v-model="form.odo_mula" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Odometer Mula (km)" />
        </div>

        <div class="py-2 space-y-4">
          <div class="flex justify-between items-center bg-teal-50 p-4 rounded-2xl border border-teal-100 shadow-sm">
            <div>
              <span class="text-sm font-bold text-teal-900">Operasi Luar / Tugasan Khas?</span>
              <p class="text-[10px] text-teal-600 font-medium">Aktifkan untuk membolehkan rekod log harian.</p>
            </div>
            <div @click="form.is_operasi = !form.is_operasi" 
                 :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', form.is_operasi ? 'bg-teal-600' : 'bg-gray-200']">
              <div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', form.is_operasi ? 'translate-x-[20px]' : 'translate-x-0']"></div>
            </div>
          </div>

          <div v-if="kenderaan?.kategori !== 'Bot'" class="space-y-4">
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span class="text-sm font-bold text-gray-700">Ambil Kad Minyak?</span>
              <div @click="form.ambil_kad_minyak = !form.ambil_kad_minyak" :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', form.ambil_kad_minyak ? 'bg-teal-600' : 'bg-gray-200']">
                <div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', form.ambil_kad_minyak ? 'translate-x-[20px]' : 'translate-x-0']"></div>
              </div>
            </div>
            
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span class="text-sm font-bold text-gray-700">Ambil Kad TnG?</span>
              <div @click="form.ambil_kad_tng = !form.ambil_kad_tng" :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', form.ambil_kad_tng ? 'bg-teal-600' : 'bg-gray-200']">
                <div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', form.ambil_kad_tng ? 'translate-x-[20px]' : 'translate-x-0']"></div>
              </div>
            </div>
          </div>
        </div>

        <button @click="submit" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg mt-4 active:scale-95 transition-all">Ambil Kunci</button>
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
  is_operasi: false // State baharu untuk menyokong operasi luar
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
    // Hantar data form lengkap termasuk 'is_operasi' ke API backend
    await api.post('/pergerakan/checkout', form)
    emit('success')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat Check-Out')
  }
}
</script>