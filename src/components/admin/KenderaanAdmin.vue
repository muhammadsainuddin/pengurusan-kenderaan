<template>
  <div class="space-y-5">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-[13px] font-bold text-[#003479] uppercase tracking-wide">Pengurusan Aset</h2>
        <p class="text-xs text-[#5A6672] mt-0.5">Senarai dan pengurusan kenderaan stesen</p>
      </div>
      <div class="flex gap-2 self-start sm:self-auto">
        <button @click="bukaModalCetakSemua" class="inline-flex items-center gap-2 bg-white border border-[#003479] hover:bg-[#EEF3FB] text-[#003479] text-xs font-semibold px-4 py-2.5 rounded transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Cetak Semua Kod QR
        </button>
        <button @click="bukaModalTambah" class="inline-flex items-center gap-2 bg-[#003479] hover:bg-[#002560] text-white text-xs font-semibold px-4 py-2.5 rounded transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Daftar Aset Baharu
        </button>
      </div>
    </div>

    <!-- Asset Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="k in senaraiKenderaan" :key="k.id" class="bg-white border border-[#DFE3E8] rounded shadow-sm flex flex-col overflow-hidden">

        <!-- Card Top Strip (gov blue) -->
        <div class="h-1.5" :class="k.status === 'Tersedia' ? 'bg-[#10B981]' : k.status === 'Dalam Servis' ? 'bg-[#F59E0B]' : 'bg-[#003479]'"></div>

        <div class="p-5 flex flex-col flex-1">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-[#1A2332] leading-none tracking-tight">{{ k.no_plat }}</h3>
              <p class="text-xs text-[#5A6672] font-medium mt-1 uppercase tracking-wide">{{ k.model }} · {{ k.kategori }}</p>
            </div>
            <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', k.status === 'Tersedia' ? 'bg-[#D1FAE5] text-[#065F46]' : k.status === 'Dalam Servis' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#DBEAFE] text-[#1E40AF]']">
              {{ k.status }}
            </span>
          </div>

          <!-- Odometer -->
          <div class="bg-[#F8FAFC] border border-[#DFE3E8] rounded p-3 mb-4">
            <p class="text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1">Odometer Terkini</p>
            <p class="text-lg font-bold text-[#1A2332]">{{ (k.odo_terkini || 0).toLocaleString() }} <span class="text-sm font-medium text-[#5A6672]">km</span></p>
          </div>

          <!-- Action Buttons -->
          <div class="mt-auto flex gap-2">
            <button @click="bukaModalEdit(k)" class="flex-1 bg-white border border-[#003479] hover:bg-[#EEF3FB] text-[#003479] text-xs font-semibold py-2 rounded transition-colors">
              Edit
            </button>
            <button @click="tukarStatusServis(k)" class="flex-1 text-xs font-semibold py-2 rounded border transition-colors" :class="k.status === 'Dalam Servis' ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46] hover:bg-green-100' : 'bg-[#FEF9C3] border-[#FDE047] text-[#713F12] hover:bg-yellow-100'">
              {{ k.status === 'Dalam Servis' ? 'Selesai Servis' : 'Hantar Bengkel' }}
            </button>
            <button @click="bukaModalQR(k)" title="Jana Kod QR" class="bg-white border border-[#DFE3E8] hover:border-[#003479] hover:bg-[#EEF3FB] text-[#003479] px-3 py-2 rounded transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h3m0 0h3m-3 0v3m0-3v-3"/></svg>
            </button>
            <button @click="padamAset(k.id)" class="bg-white border border-[#DFE3E8] hover:border-[#C0392B] hover:bg-red-50 text-[#C0392B] px-3 py-2 rounded transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Tambah / Edit Aset -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-md rounded shadow-xl">

        <div class="px-5 py-4 bg-[#003479] rounded-t">
          <h3 class="text-sm font-bold text-white">{{ isEdit ? 'Kemaskini Aset' : 'Daftar Aset Baharu' }}</h3>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">No. Pendaftaran</label>
            <input v-model="form.no_plat" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: WA1234B" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Model / Jenis</label>
            <input v-model="form.model" type="text" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors" placeholder="Cth: Toyota Hilux" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#5A6672] uppercase tracking-wide mb-1.5">Kategori Aset</label>
            <select v-model="form.kategori" class="w-full border border-[#DFE3E8] focus:border-[#003479] rounded px-3 py-2.5 text-sm outline-none transition-colors bg-white">
              <option value="Kereta">Kereta</option>
              <option value="Motorsikal">Motorsikal</option>
              <option value="Bot">Bot / Marin</option>
            </select>
          </div>

          <p class="text-[11px] text-[#5A6672] bg-[#F8FAFC] border border-[#DFE3E8] rounded px-3 py-2">Kad TnG &amp; Kad Minyak kini diuruskan di tab <span class="font-semibold text-[#003479]">Urus Kad</span>.</p>

          <div class="flex gap-3 pt-2 border-t border-[#DFE3E8]">
            <button @click="simpanAset" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">
              {{ isEdit ? 'Simpan Perubahan' : 'Daftar Sekarang' }}
            </button>
            <button @click="showModal = false" class="flex-1 bg-[#F4F6FA] hover:bg-[#DFE3E8] text-[#5A6672] font-semibold text-sm py-2.5 rounded transition-colors">Batal</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Kod QR Akses Pantas (Satu Kenderaan) -->
    <div v-if="showModalQR" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 print:static print:bg-white print:p-0">
      <div class="bg-white w-full max-w-sm rounded shadow-xl print:shadow-none print:max-w-full">
        <div class="px-5 py-4 bg-[#003479] rounded-t no-print">
          <h3 class="text-sm font-bold text-white">Kod QR Akses Pantas</h3>
        </div>

        <div class="qr-print-target p-8 flex justify-center">
          <div class="qr-tag qr-tag--solo">
            <span class="qr-tag-scissor">✂</span>
            <p class="qr-tag-org">Sistem Pengurusan Kenderaan</p>
            <p class="qr-tag-plat">{{ kenderaanQR?.no_plat }}</p>
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="Kod QR" class="qr-tag-img" />
            <p class="qr-tag-model">{{ kenderaanQR?.model }} · {{ kenderaanQR?.kategori }}</p>
            <p class="qr-tag-hint">📱 Imbas · Ambil / Pulang Kunci</p>
          </div>
        </div>

        <div class="flex gap-3 p-5 pt-0 no-print">
          <button @click="cetakQR" class="flex-1 bg-[#003479] hover:bg-[#002560] text-white font-semibold text-sm py-2.5 rounded transition-colors">Cetak</button>
          <button @click="showModalQR = false" class="flex-1 bg-[#F4F6FA] hover:bg-[#DFE3E8] text-[#5A6672] font-semibold text-sm py-2.5 rounded transition-colors">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Modal: Cetak Semua Kod QR (Lembaran A4, 9 setiap muka surat) -->
    <div v-if="showModalCetakSemua" class="fixed inset-0 z-50 bg-slate-900 overflow-y-auto print:static print:bg-white print:overflow-visible">
      <div class="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 p-4 shadow-xl flex justify-between items-center no-print">
        <div class="flex items-center gap-4">
          <button @click="showModalCetakSemua = false" class="text-slate-300 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 class="text-white font-bold tracking-widest uppercase text-sm">Cetak Kod QR Kenderaan</h2>
            <p class="text-[10px] text-slate-400 font-medium tracking-wide">6 kod setiap muka surat A4 — gunting ikut garis putus-putus</p>
          </div>
        </div>
        <button @click="cetakQR" class="bg-teal-600 text-white px-8 py-3 rounded-sm text-[11px] font-black hover:bg-teal-500 flex gap-2 items-center uppercase tracking-widest shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all active:scale-95">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak
        </button>
      </div>

      <div class="qr-print-target p-8 print:p-0 flex flex-col items-center gap-8 print:block bg-slate-900 print:bg-white">
        <div v-for="(pageChunk, pageIndex) in paginatedQR" :key="'qrpage'+pageIndex" class="qr-print-page bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl relative print:w-full print:min-h-0 print:p-0 print:shadow-none">
          <div class="qr-grid">
            <div v-for="(k, idx) in pageChunk" :key="idx" class="qr-tag">
              <template v-if="k">
                <span class="qr-tag-scissor">✂</span>
                <p class="qr-tag-org">Sistem Pengurusan Kenderaan</p>
                <p class="qr-tag-plat">{{ k.no_plat }}</p>
                <img :src="qrMap[k.id]" class="qr-tag-img" />
                <p class="qr-tag-model">{{ k.model }} · {{ k.kategori }}</p>
                <p class="qr-tag-hint">📱 Imbas · Ambil / Pulang Kunci</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import QRCode from 'qrcode'
import api from '../../api/axios'

const senaraiKenderaan = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const form = ref({ no_plat: '', model: '', kategori: 'Kereta' })

const showModalQR = ref(false)
const kenderaanQR = ref(null)
const qrDataUrl = ref('')

const showModalCetakSemua = ref(false)
const qrMap = ref({})

// 6 kod QR setiap muka surat A4 (grid 2x3), dipadding null supaya grid kekal 2x3 di muka surat terakhir
const paginatedQR = computed(() => {
  const chunks = []
  for (let i = 0; i < senaraiKenderaan.value.length; i += 6) {
    const chunk = senaraiKenderaan.value.slice(i, i + 6)
    while (chunk.length < 6) chunk.push(null)
    chunks.push(chunk)
  }
  return chunks.length > 0 ? chunks : [Array(6).fill(null)]
})

const fetchAset = async () => {
  const res = await api.get('/admin/dashboard-summary')
  senaraiKenderaan.value = res.data.data
}

const bukaModalTambah = () => {
  isEdit.value = false;
  form.value = { no_plat: '', model: '', kategori: 'Kereta' };
  showModal.value = true;
}

const bukaModalEdit = (k) => {
  isEdit.value = true;
  currentId.value = k.id;
  form.value = { no_plat: k.no_plat, model: k.model, kategori: k.kategori };
  showModal.value = true;
}

const bukaModalQR = async (k) => {
  kenderaanQR.value = k
  showModalQR.value = true
  const url = `${window.location.origin}/quick/${k.qr_token}`
  qrDataUrl.value = await QRCode.toDataURL(url, { width: 320, margin: 1, color: { dark: '#1A2332', light: '#FFFFFF' } })
}

const bukaModalCetakSemua = async () => {
  showModalCetakSemua.value = true
  for (const k of senaraiKenderaan.value) {
    if (!qrMap.value[k.id]) {
      const url = `${window.location.origin}/quick/${k.qr_token}`
      qrMap.value[k.id] = await QRCode.toDataURL(url, { width: 400, margin: 1, color: { dark: '#1A2332', light: '#FFFFFF' } })
    }
  }
}

const cetakQR = () => window.print()

const simpanAset = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/admin/kenderaan/${currentId.value}`, form.value)
    } else {
      await api.post('/admin/kenderaan', form.value)
    }
    showModal.value = false
    fetchAset()
    alert("Data aset berjaya disimpan.")
  } catch (error) {
    alert(error.response?.data?.message || "Ralat menyimpan data.")
  }
}

const tukarStatusServis = async (k) => {
  const statusBaru = k.status === 'Dalam Servis' ? 'Tersedia' : 'Dalam Servis'
  await api.put(`/admin/kenderaan/${k.id}/toggle-servis`, { status: statusBaru })
  fetchAset()
}

const padamAset = async (id) => {
  if (confirm("PENGESAHAN: Padam aset ini secara kekal?")) {
    await api.delete(`/admin/kenderaan/${id}`)
    fetchAset()
  }
}

onMounted(() => fetchAset())
</script>

<style scoped>
/* Kad kod QR — direka untuk dicetak & digunting */
.qr-tag {
  position: relative;
  border: 1px dashed #B0B8C4;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 6mm; text-align: center; gap: 3mm;
  background: white;
}
.qr-tag--solo {
  border: 1.5px dashed #8A94A6;
  border-radius: 4px;
  padding: 8mm;
  width: 70mm;
}
.qr-tag-scissor {
  position: absolute; top: -3mm; left: -3mm;
  font-size: 11px; color: #9CA3AF; transform: rotate(45deg);
  background: white; line-height: 1; padding: 1px;
}
.qr-tag-org { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #003479; }
.qr-tag-plat { font-size: 22px; font-weight: 800; color: #1A2332; letter-spacing: -0.3px; }
.qr-tag-img { width: 52mm; height: 52mm; }
.qr-tag--solo .qr-tag-img { width: 48mm; height: 48mm; }
.qr-tag-model { font-size: 10.5px; color: #5A6672; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.qr-tag-hint { font-size: 10px; color: #8A94A6; }
.qr-tag--solo .qr-tag-org { font-size: 9px; }
.qr-tag--solo .qr-tag-model,
.qr-tag--solo .qr-tag-hint { font-size: 10px; }

/* Grid 2x3 = 6 kod setiap muka surat A4 */
.qr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%; height: 100%;
}

@media print {
  @page { size: A4 portrait; margin: 10mm; }
  .no-print { display: none !important; }
  body * { visibility: hidden; }
  .qr-print-target, .qr-print-target * { visibility: visible; }
  .qr-print-target { position: fixed; inset: 0; }
  .qr-print-page { page-break-after: always; }
  .qr-print-page:last-child { page-break-after: auto; }
}
</style>
