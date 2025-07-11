<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-8xl font-bold text-center text-red-800 mb-5">404</h1>
        <p class="text-center text-sm font-medium">La página que buscas no existe</p>
        <router-link to="/" class="btn btn-sm btn-ghost text-red-800 rounded-[.8rem] mt-10 text-[1.2rem]">
            <IconArrowLeft class="mr-1 h-5 w-5" /> Volver al inicio
        </router-link>
    </div>
</template>

<script setup>
import { IconArrowLeft } from "@tabler/icons-vue";
</script>

<style lang="scss" scoped>

</style>