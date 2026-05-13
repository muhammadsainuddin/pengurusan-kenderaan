<template>
  <div class="min-h-screen bg-[#F4F5F4] font-sans text-gray-900 pb-24">
    
    <header class="pt-12 pb-4 px-6 bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 rounded-b-[24px]">
      <div class="max-w-md mx-auto flex justify-between items-center">
        <div>
          <p class="text-xs font-bold text-teal-600 uppercase tracking-widest">AIGEO SYSTEM</p>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Pengurusan Kenderaan</h1>
        </div>
        <div @click="activeTab = 'profil'" class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm cursor-pointer hover:bg-teal-200 transition-colors">
          {{ currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U' }}
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto px-4 pt-6">

      <div v-if="activeTab === 'home'" class="space-y-4 animate-fade-in">
        <div class="mb-6 px-2">
          <h2 class="text-xl font-medium text-gray-800 leading-tight">Hi, {{ currentUser?.name?.split(' ')[0] }}! 👋</h2>
          <p class="text-sm text-gray-500 font-medium">{{ userSedangMemandu ? 'Anda mempunyai tugasan aktif sekarang.' : 'Sila pilih kenderaan tersedia.' }}</p>
        </div>

        <div class="flex justify-between items-center px-1 mb-2">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Status Aset Semasa</h3>
          <button @click="fetchKenderaan" class="text-teal-600 p-2 hover:bg-teal-50 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <div v-for="k in filteredList" :key="k.id" 
          :class="['p-5 rounded-[28px] transition-all relative overflow-hidden', bolehAmbil(k) ? 'bg-white cursor-pointer hover:shadow-md shadow-sm active:scale-[0.98]' : 'bg-[#EBECE8] opacity-90']"
          @click="bolehAmbil(k) ? bukaBorangAmbil(k) : null"
        >
          <div class="flex items-center gap-5">
            <div :class="['w-16 h-16 rounded-full flex shrink-0 items-center justify-center text-3xl shadow-inner', bolehAmbil(k) ? 'bg-teal-50 text-teal-600' : 'bg-gray-300 text-gray-500']">
              {{ k.kategori === 'Bot' ? '🚤' : (k.kategori === 'Motorsikal' ? '🏍️' : '🚗') }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[20px] font-bold text-gray-900 truncate tracking-tight">{{ k.no_plat }}</h3>
              <p class="text-sm text-gray-500 font-medium">{{ k.model }}</p>
              
              <div class="mt-3 flex gap-2">
                <span v-if="k.status === 'Tersedia'" class="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Tersedia</span>
                <span v-else-if="k.status === 'Dalam Servis'" class="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Di Bengkel</span>
                <span v-else-if="k.status === 'Ditempah'" class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {{ k.booking_staff_id === currentUser?.id ? 'Tempahan Anda' : 'Ditempah' }}
                </span>
                <span v-else class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Digunakan</span>
              </div>
            </div>
          </div>

          <div v-if="k.senarai_tempahan && k.senarai_tempahan.length > 0" class="mt-4 pt-4 border-t border-gray-100 border-dashed">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Jadual Tempahan
            </p>
            <div class="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
              <div v-for="b in k.senarai_tempahan" :key="b.id" class="bg-gray-50/50 rounded-lg p-2.5 flex justify-between items-center">
                <div class="flex-1 min-w-0 pr-2">
                  <p class="text-[11px] font-bold text-gray-800 truncate">{{ b.pembuat_tempahan }}</p>
                  <p class="text-[9px] text-gray-500 truncate">{{ b.destinasi }}</p>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">{{ formatTarikhPendek(b.tarikh_mula) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="k.status !== 'Tersedia' && k.status !== 'Dalam Servis'" class="mt-4 pt-4 border-t border-gray-100">
            
            <div class="flex items-center gap-3 mb-4 bg-gray-50/50 p-3 rounded-2xl">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0', k.status === 'Sedang Digunakan' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700']">
                {{ (k.status === 'Sedang Digunakan' ? k.pemandu : k.pembuat_tempahan)?.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold uppercase tracking-wider mb-0.5" :class="k.status === 'Sedang Digunakan' ? 'text-amber-600' : 'text-indigo-600'">
                  {{ k.status === 'Sedang Digunakan' ? 'Pemandu Semasa' : 'Tempahan Oleh' }}
                </p>
                <p class="text-sm font-bold text-gray-900 leading-tight truncate">
                  {{ k.status === 'Sedang Digunakan' ? k.pemandu : k.pembuat_tempahan }}
                </p>
                <p class="text-xs text-gray-500 truncate mt-0.5">
                  {{ k.status === 'Sedang Digunakan' ? k.destinasi : k.destinasi_booking }}
                </p>
              </div>
            </div>
            
            <button v-if="k.status === 'Sedang Digunakan' && k.pemandu_id === currentUser?.id" @click.stop="bukaBorangPulang(k)" class="w-full bg-teal-700 text-white font-bold text-sm py-4 rounded-full shadow-lg active:scale-95 transition-all">
              Pulangkan Kunci
            </button>
            
            <div v-if="k.status === 'Ditempah' && k.booking_staff_id === currentUser?.id" class="flex flex-col gap-2">
              <button @click.stop="bukaBorangAmbil(k)" class="w-full bg-teal-700 text-white font-bold text-sm py-4 rounded-full shadow-lg">Mula Perjalanan</button>
              <button @click.stop="batalTempahan(k)" class="w-full bg-red-50 text-red-700 font-bold text-sm py-3 rounded-full">Batal Tempahan</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'sejarah'" class="space-y-4 animate-fade-in">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-4">Log Perjalanan Lampau</h2>
        
        <div v-if="sejarahList.length === 0" class="text-center py-20 bg-white rounded-[28px] shadow-sm">
          <div class="text-5xl mb-4 opacity-50">📭</div>
          <h3 class="text-lg font-bold text-gray-900 tracking-tight">Tiada Rekod</h3>
          <p class="text-sm text-gray-500 mt-1">Anda belum merekodkan sebarang perjalanan.</p>
        </div>

        <div v-for="rekod in sejarahList" :key="rekod.id" class="bg-white p-5 rounded-[28px] shadow-sm border border-transparent hover:border-teal-100 transition-all">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex shrink-0 items-center justify-center text-2xl">
              {{ rekod.kategori === 'Bot' ? '🚤' : (rekod.kategori === 'Motorsikal' ? '🏍️' : '🚗') }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-900 leading-tight tracking-tight">{{ rekod.no_plat }}</h3>
                <span :class="['text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider', rekod.status_trip === 'Selesai' ? 'bg-gray-100 text-gray-500' : 'bg-teal-100 text-teal-700']">{{ rekod.status_trip }}</span>
              </div>
            </div>
          </div>

          <div class="bg-[#F4F5F4] p-4 rounded-2xl mb-4 relative">
            <button @click="bukaEditSejarah(rekod)" class="absolute top-4 right-4 text-[10px] font-bold bg-white text-teal-600 px-3 py-1.5 rounded-lg shadow-sm border border-teal-100 flex items-center gap-1 active:scale-95 transition-transform">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Edit
            </button>
            <p class="text-sm font-bold text-gray-900 tracking-tight pr-14">{{ rekod.destinasi }}</p>
            <p class="text-xs text-gray-500 mt-0.5 font-medium">{{ rekod.tujuan }}</p>
            <p v-if="rekod.nama_pengguna" class="text-[10px] text-teal-700 font-bold uppercase mt-2">Pegawai dibawa: {{ rekod.nama_pengguna }}</p>
          </div>

          <div class="grid grid-cols-2 gap-y-4 gap-x-3 border-t border-gray-50 pt-4">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Tarikh Mula</p>
              <p class="text-[13px] font-bold text-gray-900 mt-0.5">{{ formatTarikh(rekod.masa_keluar) }}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Tarikh Pulang</p>
              <p class="text-[13px] font-bold text-gray-900 mt-0.5">{{ rekod.masa_masuk ? formatTarikh(rekod.masa_masuk) : 'Masih Aktif' }}</p>
            </div>
            <div v-if="rekod.kategori !== 'Bot'">
              <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Odo Mula</p>
              <p class="text-sm font-bold text-gray-900 mt-0.5">{{ rekod.odo_mula }} km</p>
            </div>
            <div v-if="rekod.kategori !== 'Bot'">
              <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Odo Akhir</p>
              <p class="text-sm font-bold text-gray-900 mt-0.5">{{ rekod.odo_tamat ? rekod.odo_tamat + ' km' : '-' }}</p>
            </div>
          </div>

          <div v-if="rekod.status_trip === 'Selesai' && rekod.odo_tamat && rekod.kategori !== 'Bot'" class="mt-4 flex justify-between items-center bg-gray-100 px-4 py-3 rounded-2xl">
            <span class="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Jarak Perjalanan</span>
            <span class="text-sm font-black text-gray-900">{{ (rekod.odo_tamat - rekod.odo_mula).toFixed(1) }} km</span>
          </div>

          <div v-if="rekod.status_trip === 'Selesai' && (rekod.baki_tng !== null || rekod.jumlah_rm_minyak > 0)" class="mt-4 pt-4 border-t border-dashed border-gray-200 flex flex-col gap-2">
            <div v-if="rekod.baki_tng !== null && rekod.kategori !== 'Bot'" class="flex justify-between items-center bg-purple-50 px-4 py-3 rounded-2xl">
              <span class="text-[11px] font-bold text-purple-700 uppercase">Baki TnG</span>
              <span class="text-sm font-black text-purple-900">RM {{ parseFloat(rekod.baki_tng).toFixed(2) }}</span>
            </div>
            <div v-if="rekod.jumlah_rm_minyak > 0" class="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-2xl">
              <span class="text-[11px] font-bold text-blue-700 uppercase tracking-tight">Minyak ({{ rekod.jumlah_liter_minyak || 0 }}L)</span>
              <span class="text-sm font-black text-blue-900">RM {{ parseFloat(rekod.jumlah_rm_minyak).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'profil'" class="space-y-6 animate-fade-in">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Maklumat Peribadi</h2>
        <div class="bg-white rounded-[28px] p-8 shadow-sm text-center">
          <div class="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white shadow-md">👤</div>
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ currentUser?.name }}</h2>
          <p class="text-sm text-gray-500 font-medium mb-6">{{ currentUser?.email }}</p>
          <div class="bg-[#F4F5F4] rounded-3xl p-5 text-left space-y-4">
            <div class="flex justify-between items-center">
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Peranan</p>
              <p class="text-sm font-bold text-gray-800">{{ currentUser?.role }}</p>
            </div>
            <div class="h-[1px] w-full bg-gray-200/50"></div>
            <div class="flex justify-between items-center">
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Stesen</p>
              <p class="text-sm font-bold text-gray-800">{{ currentUser?.negeri || 'Cawangan Utara' }}</p>
            </div>
          </div>
        </div>
        <button v-if="currentUser?.role === 'Admin'" @click="$router.push('/admin')" class="w-full bg-teal-700 text-white font-bold text-sm py-4 rounded-full active:scale-95 transition-all shadow-md mb-3 flex items-center justify-center gap-2">
          Buka Panel Pentadbir
        </button>
        <button @click="handleLogout" class="w-full bg-red-50 text-red-600 font-bold text-sm py-4 rounded-full active:bg-red-100 transition-colors">Log Keluar Akaun</button>
      </div>
    </main>

    <button v-if="activeTab === 'home'" @click="$router.push('/booking')" class="fixed bottom-24 right-6 w-14 h-14 bg-teal-200 text-teal-900 rounded-[20px] shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30 border-2 border-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
    </button>

    <nav class="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white border-t border-gray-100 flex justify-around items-center h-20 z-40 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <div @click="tukarTab('home')" class="flex flex-col items-center gap-1 cursor-pointer w-20 group">
        <div :class="['w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300', activeTab === 'home' ? 'bg-teal-100 text-teal-900 scale-110' : 'text-gray-400 group-hover:bg-gray-50']"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z"/></svg></div>
        <span :class="['text-[11px] font-bold tracking-tight', activeTab === 'home' ? 'text-teal-900' : 'text-gray-400']">Utama</span>
      </div>
      <div @click="tukarTab('sejarah')" class="flex flex-col items-center gap-1 cursor-pointer w-20 group">
        <div :class="['w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300', activeTab === 'sejarah' ? 'bg-teal-100 text-teal-900 scale-110' : 'text-gray-400 group-hover:bg-gray-50']"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
        <span :class="['text-[11px] font-bold tracking-tight', activeTab === 'sejarah' ? 'text-teal-900' : 'text-gray-400']">Sejarah</span>
      </div>
      <div @click="tukarTab('profil')" class="flex flex-col items-center gap-1 cursor-pointer w-20 group">
        <div :class="['w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300', activeTab === 'profil' ? 'bg-teal-100 text-teal-900 scale-110' : 'text-gray-400 group-hover:bg-gray-50']"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
        <span :class="['text-[11px] font-bold tracking-tight', activeTab === 'profil' ? 'text-teal-900' : 'text-gray-400']">Profil</span>
      </div>
    </nav>

    <div v-if="showModalAmbil" class="fixed inset-0 z-50 flex items-end bg-black/50 transition-opacity backdrop-blur-[2px]">
      <div class="bg-[#F4F5F4] w-full max-w-md mx-auto rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl relative max-h-[95vh] overflow-y-auto animate-slide-up">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
        <h2 class="text-[24px] font-bold text-gray-900 mb-6 flex justify-between items-center tracking-tight">Daftar Keluar<button @click="showModalAmbil = false" class="text-teal-600 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm">Batal</button></h2>
        <div class="space-y-4">
          
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-teal-100">
            <p class="text-[10px] text-teal-600 font-black uppercase tracking-widest mb-1">Aset Terpilih</p>
            <p class="text-xl text-gray-900 font-bold">{{ pilihanKenderaan?.no_plat }} <span class="text-sm font-medium text-gray-500">({{ pilihanKenderaan?.model }})</span></p>
            
            <div v-if="pilihanKenderaan?.kategori !== 'Bot'" class="mt-3 pt-3 border-t border-gray-50 grid grid-cols-2 gap-2">
              <div>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pemandu Terakhir</p>
                <p class="text-[11px] font-bold text-gray-700 truncate">{{ pilihanKenderaan?.pemandu_terakhir || 'Tiada Rekod' }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-purple-500 uppercase tracking-widest">Baki TnG (Kini)</p>
                <p class="text-[11px] font-bold text-purple-700">RM {{ pilihanKenderaan?.baki_tng_terakhir ? parseFloat(pilihanKenderaan.baki_tng_terakhir).toFixed(2) : '0.00' }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <input v-model="formAmbil.tujuan" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Tujuan Rasmi" />
            <input v-model="formAmbil.destinasi" type="text" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Lokasi Destinasi" />
            <input v-model="formAmbil.nama_pengguna" type="text" class="w-full bg-teal-50 border border-teal-100 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-teal-900 font-bold outline-none shadow-sm" placeholder="Nama Pengguna (Pilihan)" />
            <input v-if="pilihanKenderaan?.kategori !== 'Bot'" v-model="formAmbil.odo_mula" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Odometer Mula (km)" />
          </div>

          <div v-if="pilihanKenderaan?.kategori !== 'Bot'" class="py-4 space-y-4">
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
              <span class="text-sm font-bold text-gray-700">Ambil Kad Minyak?</span>
              <div @click="formAmbil.ambil_kad_minyak = !formAmbil.ambil_kad_minyak" :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', formAmbil.ambil_kad_minyak ? 'bg-teal-600' : 'bg-gray-200']"><div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', formAmbil.ambil_kad_minyak ? 'translate-x-[20px]' : 'translate-x-0']"></div></div>
            </div>
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
              <span class="text-sm font-bold text-gray-700">Ambil Kad TnG?</span>
              <div @click="formAmbil.ambil_kad_tng = !formAmbil.ambil_kad_tng" :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', formAmbil.ambil_kad_tng ? 'bg-teal-600' : 'bg-gray-200']"><div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', formAmbil.ambil_kad_tng ? 'translate-x-[20px]' : 'translate-x-0']"></div></div>
            </div>
          </div>
          <button @click="hantarAmbil" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg mt-4">Ambil Kunci</button>
        </div>
      </div>
    </div>

    <div v-if="showModalPulang" class="fixed inset-0 z-50 flex items-end bg-black/50 transition-opacity backdrop-blur-[2px]">
      <div class="bg-[#F4F5F4] w-full max-w-md mx-auto rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl relative max-h-[95vh] overflow-y-auto animate-slide-up">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
        <h2 class="text-[24px] font-bold text-gray-900 mb-6 flex justify-between items-center tracking-tight">Pulang Kunci<button @click="showModalPulang = false" class="text-teal-600 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm">Batal</button></h2>
        <div class="space-y-4">
          <input v-if="pilihanKenderaan?.kategori !== 'Bot'" v-model="formPulang.odo_tamat" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-50 rounded-2xl px-5 py-4 text-gray-900 font-bold outline-none shadow-sm" placeholder="Odometer Akhir (km)" />
          
          <div v-if="pilihanKenderaan?.kategori !== 'Bot' && pilihanKenderaan?.ambil_kad_tng" class="bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <p class="text-[10px] text-purple-600 font-bold uppercase tracking-widest mb-1">Baki Kad TnG Terkini</p>
            <input v-model="formPulang.baki_tng" type="number" step="0.01" class="w-full bg-transparent text-xl font-bold text-gray-900 outline-none" placeholder="RM 0.00" />
          </div>

          <div v-if="pilihanKenderaan?.ambil_kad_minyak || pilihanKenderaan?.kategori === 'Bot'" class="space-y-4">
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
              <span class="text-sm font-bold text-gray-700">Ada rekod isi minyak?</span>
              <div @click="formPulang.isi_minyak = !formPulang.isi_minyak" :class="['w-[52px] h-[32px] rounded-full p-1 flex items-center transition-all cursor-pointer shadow-inner', formPulang.isi_minyak ? 'bg-teal-600' : 'bg-gray-200']"><div :class="['w-6 h-6 rounded-full transition-transform bg-white shadow-md', formPulang.isi_minyak ? 'translate-x-[20px]' : 'translate-x-0']"></div></div>
            </div>
            
            <div v-if="formPulang.isi_minyak" class="space-y-4 bg-white p-5 rounded-2xl border border-teal-100 shadow-sm animate-fade-in">
              <div class="flex justify-between items-center mb-1">
                <p class="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Resit Minyak</p>
                <button @click="tambahResit" class="bg-teal-100 text-teal-800 text-[10px] font-bold px-3 py-1.5 rounded-full">+ Tambah Resit</button>
              </div>
              <div v-for="(resit, index) in formPulang.senarai_resit" :key="index" class="relative bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
                <button v-if="formPulang.senarai_resit.length > 1" @click="buangResit(index)" class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">X</button>
                <input v-model="resit.no_resit" type="text" class="w-full bg-white border border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-gray-900 font-bold outline-none text-sm mb-3" placeholder="No Resit" />
                <div class="grid grid-cols-2 gap-3">
                  <input v-model="resit.rm" type="number" step="0.01" class="w-full bg-white border border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-gray-900 font-bold outline-none text-sm" placeholder="RM" />
                  <input v-model="resit.liter" type="number" step="0.01" class="w-full bg-white border border-gray-200 focus:border-teal-600 rounded-xl px-4 py-3 text-gray-900 font-bold outline-none text-sm" placeholder="Liter" />
                </div>
              </div>
            </div>
          </div>
          <button @click="hantarPulang" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg mt-6">Sahkan Pemulangan</button>
        </div>
      </div>
    </div>

    <div v-if="showModalEditSejarah" class="fixed inset-0 z-50 flex items-end bg-black/50 transition-opacity backdrop-blur-[2px]">
      <div class="bg-[#F4F5F4] w-full max-w-md mx-auto rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex justify-between items-center tracking-tight">
          Kemaskini Kesilapan Data
          <button @click="showModalEditSejarah = false" class="text-teal-600 text-xs font-bold bg-white px-4 py-2 rounded-full shadow-sm">Batal</button>
        </h2>
        <div class="space-y-4">
          <div v-if="editSejarahForm.kategori !== 'Bot'" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Odo Mula</label>
              <input v-model="editSejarahForm.odo_mula" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-4 py-3 text-gray-900 font-bold outline-none shadow-sm text-sm" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Odo Akhir</label>
              <input v-model="editSejarahForm.odo_tamat" type="number" class="w-full bg-white border border-gray-300 focus:border-teal-600 rounded-2xl px-4 py-3 text-gray-900 font-bold outline-none shadow-sm text-sm" />
            </div>
          </div>
          <div v-if="editSejarahForm.kategori !== 'Bot'" class="border-t border-gray-200 pt-4">
            <label class="block text-[10px] font-bold text-purple-600 uppercase mb-1.5">Baki Kad TnG</label>
            <input v-model="editSejarahForm.baki_tng" type="number" step="0.01" class="w-full bg-purple-50 border border-purple-200 focus:border-purple-500 rounded-2xl px-4 py-3 text-purple-900 font-bold outline-none shadow-sm text-sm" />
          </div>
          <div class="border-t border-gray-200 pt-4 space-y-3">
            <div class="flex justify-between items-center mb-1">
              <label class="block text-[10px] font-bold text-blue-600 uppercase">Pecahan Resit Minyak</label>
              <button @click="tambahResitEdit" class="bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1.5 rounded-full">+ Tambah</button>
            </div>
            <div v-for="(resit, index) in editSejarahForm.senarai_resit" :key="index" class="relative bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-inner">
              <button v-if="editSejarahForm.senarai_resit.length > 1" @click="buangResitEdit(index)" class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">X</button>
              <input v-model="resit.no_resit" type="text" class="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3 text-blue-900 font-bold outline-none text-sm mb-3" placeholder="Nombor Resit" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="resit.liter" type="number" step="0.01" class="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3 text-blue-900 font-bold outline-none text-sm" placeholder="Liter" />
                <input v-model="resit.rm" type="number" step="0.01" class="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3 text-blue-900 font-bold outline-none text-sm" placeholder="RM" />
              </div>
            </div>
          </div>
          <button @click="simpanEditSejarah" class="w-full bg-teal-700 text-white font-black text-lg py-4 rounded-full shadow-lg mt-6">Simpan Perubahan</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('home')
const kenderaanList = ref([])
const sejarahList = ref([])
const currentUser = ref(null)
const pilihanKenderaan = ref(null)

const showModalAmbil = ref(false)
const showModalPulang = ref(false)
const showModalEditSejarah = ref(false)

const formAmbil = reactive({ kenderaan_id: null, tujuan: '', destinasi: '', nama_pengguna: '', odo_mula: '', ambil_kad_minyak: false, ambil_kad_tng: false })
const formPulang = reactive({ pergerakan_id: null, odo_tamat: '', baki_tng: '', isi_minyak: false, senarai_resit: [ { no_resit: '', rm: '', liter: '' } ] })
const editSejarahForm = reactive({ id: null, kategori: '', odo_mula: '', odo_tamat: '', baki_tng: '', senarai_resit: [] })

const tukarTab = (tab) => { 
  activeTab.value = tab; 
  if (tab === 'home') fetchKenderaan(); 
  if (tab === 'sejarah') fetchSejarah(); 
}

// Helper Format Tarikh (Panjang & Pendek)
const formatTarikh = (tarikhStr) => { 
  if (!tarikhStr) return '-'; 
  return new Date(tarikhStr).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false }) 
}
const formatTarikhPendek = (tarikhStr) => {
  if (!tarikhStr) return '';
  const date = new Date(tarikhStr);
  return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' }); 
}

const fetchKenderaan = async () => { 
  try { 
    const res = await api.get('/kenderaan/senarai'); 
    kenderaanList.value = res.data.data 
  } catch (e) { 
    if(e.response?.status === 401) handleLogout() 
  } 
}

const fetchSejarah = async () => { 
  try { 
    const res = await api.get('/pergerakan/sejarah'); 
    sejarahList.value = res.data.data 
  } catch (e) { console.error(e) } 
}


const userSedangMemandu = computed(() => kenderaanList.value.find(k => k.status === 'Sedang Digunakan' && k.pemandu_id === currentUser.value?.id))
const filteredList = computed(() => userSedangMemandu.value ? [userSedangMemandu.value] : kenderaanList.value)
const bolehAmbil = (k) => { 
  if (k.status === 'Tersedia') return true; 
  if (k.status === 'Ditempah' && k.booking_staff_id === currentUser.value?.id) return true; 
  return false 
}

const bukaBorangAmbil = (kenderaan) => {
  pilihanKenderaan.value = kenderaan; 
  formAmbil.kenderaan_id = kenderaan.id; 
  formAmbil.tujuan = kenderaan.status === 'Ditempah' ? kenderaan.tujuan_booking : '';
  formAmbil.destinasi = kenderaan.status === 'Ditempah' ? kenderaan.destinasi_booking : ''; 
  formAmbil.nama_pengguna = ''; 
  
  // Auto-isi Odometer dari database
  formAmbil.odo_mula = kenderaan.odo_terkini && kenderaan.odo_terkini > 0 ? kenderaan.odo_terkini : ''; 
  
  formAmbil.ambil_kad_minyak = false; 
  formAmbil.ambil_kad_tng = false; 
  showModalAmbil.value = true
}

const hantarAmbil = async () => {
  if (!formAmbil.tujuan || !formAmbil.destinasi) return alert("Sila lengkapkan maklumat perjalanan")
  if (pilihanKenderaan.value?.kategori !== 'Bot' && !formAmbil.odo_mula) return alert("Sila masukkan Odometer Mula")
  try { 
    await api.post('/pergerakan/checkout', formAmbil); 
    showModalAmbil.value = false; 
    fetchKenderaan() 
  } catch (error) { alert(error.response?.data?.message || 'Ralat Check-Out') }
}

const batalTempahan = async (kenderaan) => {
  if (!window.confirm(`Pasti mahu batalkan tempahan untuk ${kenderaan.no_plat}?`)) return
  try { 
    await api.post('/booking/cancel', { booking_id: kenderaan.booking_id }); 
    alert("Tempahan dibatalkan"); 
    fetchKenderaan() 
  } catch (error) { alert(error.response?.data?.message || 'Gagal batalkan.') }
}

const bukaBorangPulang = (kenderaan) => {
  pilihanKenderaan.value = kenderaan; 
  formPulang.pergerakan_id = kenderaan.pergerakan_id; 
  formPulang.odo_tamat = ''; 
  formPulang.baki_tng = '';
  formPulang.isi_minyak = false; 
  formPulang.senarai_resit = [ { no_resit: '', rm: '', liter: '' } ]; 
  showModalPulang.value = true
}

const tambahResit = () => formPulang.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResit = (index) => { if (formPulang.senarai_resit.length > 1) formPulang.senarai_resit.splice(index, 1) }

const hantarPulang = async () => {
  if (pilihanKenderaan.value?.kategori !== 'Bot' && !formPulang.odo_tamat) return alert("Sila masukkan Odometer Akhir")
  if (formPulang.isi_minyak) { for (let r of formPulang.senarai_resit) { if (!r.rm || !r.liter) return alert("Sila lengkapkan maklumat RM dan Liter minyak."); } }
  try { 
    await api.post('/pergerakan/checkin', formPulang); 
    showModalPulang.value = false; 
    fetchKenderaan() 
  } catch (error) { alert(error.response?.data?.message || 'Ralat Check-In') }
}

const bukaEditSejarah = (rekod) => {
  editSejarahForm.id = rekod.id; 
  editSejarahForm.kategori = rekod.kategori; 
  editSejarahForm.odo_mula = rekod.odo_mula; 
  editSejarahForm.odo_tamat = rekod.odo_tamat; 
  editSejarahForm.baki_tng = rekod.baki_tng;
  
  if (rekod.senarai_resit && rekod.senarai_resit.length > 0) {
    editSejarahForm.senarai_resit = JSON.parse(JSON.stringify(rekod.senarai_resit));
  } else {
    editSejarahForm.senarai_resit = [{ no_resit: rekod.no_resit_minyak||'', rm: rekod.jumlah_rm_minyak||'', liter: rekod.jumlah_liter_minyak||'' }];
  }
  showModalEditSejarah.value = true
}

const tambahResitEdit = () => editSejarahForm.senarai_resit.push({ no_resit: '', rm: '', liter: '' })
const buangResitEdit = (idx) => { if (editSejarahForm.senarai_resit.length > 1) editSejarahForm.senarai_resit.splice(idx, 1) }

const simpanEditSejarah = async () => {
  try { 
    await api.put(`/pergerakan/${editSejarahForm.id}`, editSejarahForm); 
    alert("Rekod berjaya dikemaskini."); 
    showModalEditSejarah.value = false; 
    fetchSejarah() 
  } catch (error) { alert(error.response?.data?.message || 'Gagal menyimpan perubahan rekod.') }
}

const handleLogout = () => { 
  localStorage.removeItem('token'); 
  localStorage.removeItem('user'); 
  router.push('/login') 
}

onMounted(() => { 
  const userData = localStorage.getItem('user'); 
  if(userData) currentUser.value = JSON.parse(userData); 
  fetchKenderaan() 
})
</script>

<style scoped>
@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
.animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-fade-in { animation: fadeIn 0.2s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
</style>