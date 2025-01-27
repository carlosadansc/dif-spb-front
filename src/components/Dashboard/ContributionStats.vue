<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-sm font-medium text-gray-500">Total Value</h3>
      <p class="text-2xl font-semibold text-gray-900 mt-2">{{ formatCurrency(totalValue) }}</p>
    </div> -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-sm font-medium text-gray-500">Total de apoyos otorgados</h3>
      <p class="text-2xl font-semibold text-gray-900 mt-2">{{ totalItems }}</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-sm font-medium text-gray-500">Total de Beneficiarios</h3>
      <p class="text-2xl font-semibold text-gray-900 mt-2">{{ 10000 }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import formatCurrency from '../../utilities/formatCurrency'

const props = defineProps({
  contributions: {
    type: Array,
    required: true
  }
});


const totalItems = computed(() =>{
  return props.contributions.reduce((acc, item) => acc + item.totalQuantity, 0)
});

</script>