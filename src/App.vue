<template>
  <div>
    <div 
      v-if="globalState.isLoading" 
      class="fixed top-0 left-0 w-full h-1.5 z-[100] bg-teal-100/80 overflow-hidden"
    >
      <div class="h-full bg-teal-600 animate-loading-bar rounded-full"></div>
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { globalState } from './store'
</script>

<style>
/* Animasi Loading Bar (Bergerak dari kiri ke kanan berterusan) */
@keyframes loading-bar {
  0% { transform: translateX(-100%); width: 30%; }
  50% { width: 50%; }
  100% { transform: translateX(350%); width: 30%; }
}
.animate-loading-bar {
  animation: loading-bar 1.2s infinite cubic-bezier(0.65, 0.05, 0.36, 1);
}

/* Memastikan aplikasi nampak lancar */
html, body {
  -webkit-tap-highlight-color: transparent;
  scroll-behavior: smooth;
}
</style>