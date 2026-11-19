<template>
    <main class="flex min-h-[100dvh] items-center justify-center bg-gray-100 p-4">
        <AppEmptyState title="Página no encontrada" description="La dirección no existe o ya no está disponible." class="w-full max-w-lg border-solid shadow-sm">
            <template #icon><IconMapQuestion class="h-7 w-7" /></template>
            <router-link to="/" class="btn btn-brand min-h-11">
                <IconArrowLeft class="h-5 w-5" /> Volver al inicio
            </router-link>
        </AppEmptyState>
    </main>
</template>

<script setup>
import { IconArrowLeft, IconMapQuestion } from "@tabler/icons-vue";
import AppEmptyState from '@/components/ui/AppEmptyState.vue';
</script>

<style lang="scss" scoped>

</style>
