<template>
  <div class="">
    <!-- <h3 class="text-lg font-semibold text-gray-900 mb-4">Historial de Apoyos</h3> -->
    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-[2rem]">
        <!-- <div class="flex items-center gap-3"> -->
          <h6 class="ms-4 font-medium text-sm">Apoyos otorgados: <span v-if="!loading" class="font-bold text-xl text-red-800">{{ contributions.length }}</span> </h6>
          <button @click.prevent="showModal = true"
            class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">+</button>
        <!-- </div> -->
      </div>

        <div class="w-full">

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="loading loading-spinner loading-lg"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="contributions.length === 0" class="bg-white rounded-md shadow p-4 text-center">
            <p class="text-sm text-gray-500">No apoyos otorgados <span class="text-red-800 font-bold text-xs underline cursor-pointer hover:text-red-500" @click="showModal = true">Otorgar Apoyo</span></p>
          </div>

          <!-- Contributions List -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="(contribution, index) in contributions"
              :key="`contribution-card-${contribution._id}`"
              class="bg-white border border-solid border-gray-100 rounded-lg p-4 flex flex-col"
            >

            <p class="text-xs text-gray-500">Folio: <span class="font-bold text-red-800">{{ contribution.folio }}</span></p>

              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">
                {{ formatDate(contribution.contributionDate) }}
                </span>
                <h5 :disable="contribution.loadingPrint" class="text-xs underline font-medium text-red-800 cursor-pointer" @click="generateTicketPDF(index)">Imprimir recibo <span class="loading loading-spinner loading-xs" v-if="contribution.loadingPrint"></span> </h5>
              </div>

              <div class="space-y-1">
                <div v-for="(item, index) in contribution.productOrServices" :key="index"
                  class="flex items-center justify-between text-sm">
                  <div class="flex-1 min-w-0">
                    <span class="font-medium text-gray-900">{{ item.productOrService.category.name }}</span>
                    <span class="text-gray-500 mx-1 font-black">·</span>
                    <span class="text-gray-500">{{ item.description }}</span>
                  </div>
                  <div class="text-red-900 font-medium ml-2">
                    {{ item.quantity }}
                  </div>
                </div>
              </div>

              <div class="mt-1">
                <p class="text-gray-500 text-sm">
                  <span class="font-medium text-gray-900">Recibió: </span>
                  {{ contribution.receiver }}
                </p>
              </div>

              <div v-if="contribution.comments" class="mt-1">
                <p class="text-xs text-gray-500 italic">
                  {{ contribution.comments }}
                </p>
              </div>
              <ContributionTicketPDF ref="contributionTicketRef" :beneficiary="props.beneficiary" :contribution="contribution" />
            </div>
          </div>
      </div>
    </div>

    <NewContributionModal :showModal="showModal" @close:modal="showModal = false" @update:list="emits('update:list')" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import formatDate from '@/utilities/formatDate';
import contributionServices from '@/services/contributionServices';
import NewContributionModal from './NewContributionModal.vue';
import ContributionTicketPDF from './ContributionTicketPDF.vue';

// composables
const { authHeader } = useAuth();

//props
const props = defineProps({
  beneficiary: Object
});

const emits = defineEmits(['update:list']);

//data
const showModal = ref(false);
const loading = ref(false);
const contributions = ref([]);

//computed
const totalAmount = computed(() => {
  return props.contributions.reduce((sum, contribution) => sum + (contribution.approxPrice * contribution.quantity), 0);
});

//methods
const getContributions = async () => {
  loading.value = true
  try {
    const response = await contributionServices.getContributionsByBeneficiary(props.beneficiary._id, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contributions.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loading.value = false
  }
}

// Eventos de PDF
const contributionTicketRef = ref()
const generateTicketPDF = async (index) => {
  const contribution = contributions.value[index]
  contribution.loadingPrint = true
  await contributionTicketRef.value[index].generateTicketPDF()
  contribution.loadingPrint = false
}

onMounted(() => {
  getContributions()
})

</script>