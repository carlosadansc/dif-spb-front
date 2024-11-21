<template>
   <NavBarComponent />
   <div class="w-full h-custom overflow-y-auto bg-gray-100 py-4 pb-12">
     <router-view />
   </div>
</template>

<script setup>
import NavBarComponent from '../components/NavBarComponent.vue'
</script>

<style lang="css" scoped>
.h-custom {
  height: calc(100dvh - 64px);
}
</style>