<template>
  <div class="login-screen min-h-screen flex flex-col font-sans">

    <div class="flex flex-col items-center px-6 pt-14 pb-6">
      <div class="md3-logo mb-5">
        <svg class="w-9 h-9" fill="white" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
      <p class="brand-org">Jabatan Perhilitan Malaysia</p>
      <h1 class="brand-title">Pengurusan Kenderaan</h1>
      <p class="brand-sub">Taman Negara Pulau Pinang</p>
    </div>

    <div class="flex-1 px-6 pb-8">
      <div class="max-w-sm mx-auto">
        <h2 class="page-heading mb-6">Log Masuk</h2>

        <div v-if="errorMsg" class="error-banner mb-5">
          <svg class="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          <span>{{ errorMsg }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="md3-field">
            <label class="md3-field-label">E-mel Rasmi</label>
            <input v-model="form.email" type="email" required class="md3-input" placeholder="nama@wildlife.gov.my" />
          </div>

          <div class="md3-field">
            <label class="md3-field-label">Kata Laluan</label>
            <input v-model="form.password" type="password" required class="md3-input" placeholder="••••••••" />
          </div>



          <button type="submit" :disabled="isLoading" class="md3-btn-filled w-full mt-2">
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoading ? 'Memproses...' : 'Log Masuk' }}
          </button>
        </form>

        <p class="mt-8 text-sm text-center" style="color:#71796E">
          Tiada akaun?
          <router-link to="/register" class="md3-text-link font-semibold ml-1">Daftar sekarang</router-link>
        </p>
      </div>
    </div>

    <div class="pb-8 text-center">
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#BFC9BD">© Jabatan Perhilitan Malaysia</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ email: '', password: '' })
const errorMsg = ref('')
const isLoading = ref(false)

onMounted(() => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      if (user.role === 'Admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

const handleLogin = async () => {
  if (!form.email || !form.password) {
    errorMsg.value = "Sila isi e-mel dan kata laluan"
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const response = await api.post('/auth/login', form)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    if (response.data.user.role === 'Admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Gagal log masuk. Sila semak semula e-mel atau kata laluan anda.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-screen { background: #F0F5EF; }

.md3-logo {
  width: 72px; height: 72px;
  background: #2E7D4F;
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(46,125,79,0.40);
}

.brand-org  { font-size: 11px; font-weight: 600; color: #2E7D4F; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 4px; }
.brand-title{ font-size: 22px; font-weight: 700; color: #191C18; }
.brand-sub  { font-size: 13px; color: #71796E; margin-top: 2px; }

.page-heading { font-size: 28px; font-weight: 400; color: #191C18; letter-spacing: -0.3px; }

.error-banner {
  display: flex; align-items: flex-start; gap: 8px;
  background: #F9DEDC; color: #B3261E;
  padding: 12px 14px; border-radius: 12px;
  font-size: 13px; font-weight: 500;
}

.md3-field { display: flex; flex-direction: column; gap: 5px; }
.md3-field-label { font-size: 11px; font-weight: 600; color: #2E7D4F; text-transform: uppercase; letter-spacing: 0.1em; padding-left: 2px; }

.md3-input {
  background: #DCE5DA;
  border: none;
  border-bottom: 1.5px solid #71796E;
  border-radius: 4px 4px 0 0;
  padding: 14px 16px;
  font-size: 16px; font-weight: 500; color: #191C18;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.md3-input:focus { border-bottom: 2.5px solid #2E7D4F; }
.md3-input::placeholder { color: #A0ABA0; font-weight: 400; font-size: 14px; }

.md3-text-link { color: #2E7D4F; font-weight: 600; }
.md3-text-link:hover { text-decoration: underline; }

.md3-btn-filled {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: #2E7D4F; color: white;
  padding: 14px 24px; border-radius: 100px;
  font-size: 15px; font-weight: 600; letter-spacing: 0.02em;
  border: none; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
.md3-btn-filled:hover  { background: #245F3E; }
.md3-btn-filled:active { transform: scale(0.98); }
.md3-btn-filled:disabled { background: #BFC9BD; color: #71796E; cursor: not-allowed; transform: none; box-shadow: none; }
</style>
