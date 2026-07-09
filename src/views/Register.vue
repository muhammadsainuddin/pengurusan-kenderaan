<template>
  <div class="register-screen min-h-screen flex flex-col font-sans pb-10">

    <header class="px-4 pt-12 pb-4 flex items-center">
      <button @click="$router.push('/login')" class="md3-icon-btn">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
    </header>

    <div class="flex-1 px-6">
      <div class="max-w-sm mx-auto">
        <div class="mb-8">
          <p class="brand-org mb-1">AIGEO System</p>
          <h1 class="page-heading">Daftar Akaun</h1>
          <p class="page-sub mt-1">Sila lengkapkan profil rasmi anda.</p>
        </div>

        <div class="space-y-5">
          <div class="md3-field">
            <label class="md3-field-label">Nama Penuh</label>
            <input v-model="form.name" type="text" class="md3-input" placeholder="Muhammad bin Ahmad" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">E-mel Rasmi</label>
            <input v-model="form.email" type="email" class="md3-input" placeholder="nama@wildlife.gov.my" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Stesen / Jabatan</label>
            <input v-model="form.negeri" type="text" readonly class="md3-input md3-input--readonly" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Kata Laluan</label>
            <input v-model="form.password" type="password" class="md3-input" placeholder="Minimum 8 aksara" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Sahkan Kata Laluan</label>
            <input v-model="form.confirmPassword" type="password" class="md3-input" placeholder="Taip semula kata laluan" />
          </div>

          <button @click="handleRegister" class="md3-btn-filled w-full mt-4">
            Daftar Sekarang
          </button>
        </div>

        <p class="mt-6 text-sm text-center" style="color:#71796E">
          Sudah ada akaun?
          <router-link to="/login" class="md3-text-link font-semibold ml-1">Log masuk</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  negeri: 'Taman Negara Pulau Pinang',
  password: '',
  confirmPassword: '',
  role: 'Anggota'
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) return alert("Kata laluan tidak sepadan!")
  if (!form.name || !form.email || !form.password) return alert("Sila lengkapkan semua ruangan wajib.")

  try {
    const { confirmPassword, ...payload } = form
    const response = await api.post('/auth/register', payload)
    alert(response.data.message)
    router.push('/login')
  } catch (error) {
    alert(error.response?.data?.message || 'Ralat pendaftaran')
  }
}
</script>

<style scoped>
.register-screen { background: #F0F5EF; }

.md3-icon-btn {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 100px; background: transparent; border: none;
  color: #191C18; cursor: pointer;
  transition: background 0.2s;
}
.md3-icon-btn:hover { background: rgba(46,125,79,0.08); }

.brand-org  { font-size: 11px; font-weight: 600; color: #2E7D4F; letter-spacing: 0.18em; text-transform: uppercase; }
.page-heading{ font-size: 30px; font-weight: 400; color: #191C18; letter-spacing: -0.3px; }
.page-sub   { font-size: 14px; color: #71796E; }

.md3-field { display: flex; flex-direction: column; gap: 5px; }
.md3-field-label { font-size: 11px; font-weight: 600; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; padding-left: 2px; }

.md3-input {
  background: #DCE5DA;
  border: none; border-bottom: 1.5px solid #71796E;
  border-radius: 4px 4px 0 0;
  padding: 14px 16px;
  font-size: 16px; font-weight: 500; color: #191C18;
  outline: none; transition: border-color 0.2s; width: 100%;
}
.md3-input:focus { border-bottom: 2.5px solid #2E7D4F; }
.md3-input::placeholder { color: #A0ABA0; font-weight: 400; font-size: 14px; }
.md3-input--readonly { background: #E8EDE6; color: #71796E; cursor: not-allowed; }

.md3-text-link { color: #2E7D4F; }
.md3-text-link:hover { text-decoration: underline; }

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
</style>
