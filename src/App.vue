<template>
  <SplashScreen v-if="showSplash" />
  <main v-else class="h-dvh w-full overflow-hidden">
    <router-view />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SplashScreen from './components/SplashScreen.vue';

const showSplash = ref(true);

// Ocultar el splash screen después de un tiempo máximo por si hay algún error
document.addEventListener('DOMContentLoaded', () => {
  const maxWaitTime = 10000; // 10 segundos
  setTimeout(() => {
    showSplash.value = false;
  }, maxWaitTime);
});
</script>

<style>
/* Estilos globales si son necesarios */
</style>
