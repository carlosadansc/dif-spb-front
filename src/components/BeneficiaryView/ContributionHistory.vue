<template>
  <div class="">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Historial de Apoyos</h3>
    <div class="overflow-x-auto">

      <div class="flex justify-end items-center mb-[2rem]">
        <div class="flex items-center gap-3">
          <button @click.prevent="showModal = true"
            class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">+</button>
        </div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(contribution, index) in contributions" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ contribution.contributionType }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ contribution.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatCurrency(contribution.approxPrice) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ contribution.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              {{ formatCurrency(contribution.approxPrice * contribution.quantity) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              {{ contribution.createdAt }}
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td colspan="5" class="px-6 py-4 text-sm font-medium text-gray-900 text-right">
              Total General:
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              {{ formatCurrency(totalAmount) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <NewContributionModal :showModal="showModal" @close:modal="showModal = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import formatCurrency from '../../utilities/formatCurrency';
import NewContributionModal from './NewContributionModal.vue';

//props
const props = defineProps({
  contributions: Array,
});

//data
const showModal = ref(false);

//computed
const totalAmount = computed(() => {
  return props.contributions.reduce((sum, contribution) => sum + (contribution.approxPrice * contribution.quantity), 0);
});
</script>