<template>
  <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div v-if="loadingContributions" class="skeleton h-[117px]"></div>
    <div v-else class="surface-panel flex items-center justify-between p-5">
      <div>
        <h3 class="text-sm font-medium text-gray-600">Apoyos otorgados</h3>
        <p class="mt-1 text-3xl font-bold tracking-tight text-gray-950">{{ contributionsCount }}</p>
      </div>
      <div class="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-900"><IconHeartHandshake class="h-6 w-6" /></div>
    </div>
    <div v-if="loadingContributions" class="skeleton h-[117px]"></div>
    <div v-else class="surface-panel flex items-center justify-between p-5">
      <div>
        <h3 class="text-sm font-medium text-gray-600">Beneficiarios</h3>
        <p class="mt-1 text-3xl font-bold tracking-tight text-gray-950">{{ beneficiariesCount }}</p>
      </div>
      <div class="grid h-11 w-11 place-items-center rounded-xl bg-gray-100 text-gray-700"><IconUsers class="h-6 w-6" /></div>
    </div>
  </div>
</template>

<script setup>
import { IconHeartHandshake, IconUsers } from '@tabler/icons-vue';

const props = defineProps({
  contributionsCount: Number,
  beneficiariesCount: Number,
  loadingContributions: Boolean
})

</script>
