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

        <div class="max-w-2xl mx-auto">

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="contributions.length === 0" class="bg-white rounded-md shadow p-4 text-center">
            <p class="text-sm text-gray-500">No contributions found</p>
          </div>

          <!-- Contributions List -->
          <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li v-for="contribution in contributions" :key="contribution._id">
                <div class="px-4 py-3">
                  <!-- Date Header -->
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs text-gray-500">
                      {{ formatDate(contribution.contributionDate) }}
                    </span>
                  </div>

                  <!-- Contribution Items -->
                  <div class="space-y-1">
                    <div v-for="(item, index) in contribution.contributionItems" :key="index"
                      class="flex items-center justify-between text-sm">
                      <div class="flex-1 min-w-0">
                        <span class="font-medium text-gray-900">{{ item.contributionItem.category }}</span>
                        <span class="text-gray-500 mx-1">·</span>
                        <span class="text-gray-500">{{ item.contributionItem.description }}</span>
                      </div>
                      <div class="text-red-900 font-medium ml-2">
                        {{ item.quantity }}
                      </div>
                    </div>
                  </div>

                  <!-- Comments -->
                  <div v-if="contribution.comments" class="mt-1">
                    <p class="text-xs text-gray-500 italic">
                      {{ contribution.comments }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

      </div>
    </div>

    <NewContributionModal :showModal="showModal" @close:modal="showModal = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import formatCurrency from '../../utilities/formatCurrency';
import formatDate from '../../utilities/formatDate';
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

console.log(props.contributions)
</script>