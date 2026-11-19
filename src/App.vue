<template>
  <SplashScreen v-if="showSplash" @ready="showSplash = false" />
  <main v-else class="h-dvh w-full overflow-hidden">
    <router-view />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import SplashScreen from './components/SplashScreen.vue';

const showSplash = ref(true);

</script>

<style>
/* Estilos globales si son necesarios */
</style>
