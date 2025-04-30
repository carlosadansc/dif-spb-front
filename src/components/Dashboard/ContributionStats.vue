<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-sm font-medium text-gray-500">Total Value</h3>
      <p class="text-2xl font-semibold text-gray-900 mt-2">{{ formatCurrency(totalValue) }}</p>
    </div> -->
    <div class="bg-white p-6 rounded-lg border border-gray-300">
      <p class="text-4xl font-semibold text-gray-900 mt-2">{{ contributionsCount }}</p>
      <h3 class="text-sm font-medium text-gray-500">Apoyos otorgados</h3>
    </div>
    <div class="bg-white p-6 rounded-lg border border-gray-300">
      <p class="text-4xl font-semibold text-gray-900 mt-2">{{ beneficiariesCount }}</p>
      <h3 class="text-sm font-medium text-gray-500">Beneficiarios</h3>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import formatCurrency from '../../utilities/formatCurrency'

const props = defineProps({
  contributionsCount: Number,
  beneficiariesCount: Number
})

</script>