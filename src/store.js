// Fail: src/store.js
import { reactive } from 'vue'

export const globalState = reactive({
  isLoading: false,
  requestCount: 0 // Menjejak berapa banyak API sedang berjalan serentak
})