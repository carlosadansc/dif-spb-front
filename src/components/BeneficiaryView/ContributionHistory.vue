<template>
  <div class="">
    <!-- <h3 class="text-lg font-semibold text-gray-900 mb-4">Historial de Apoyos</h3> -->
    <div class="overflow-x-auto">
      <!-- Barra de filtros -->
      <div class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Filtro por folio -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Buscar por folio</label>
            <input v-model="filters.folio" type="text" placeholder="Ej: 12345"
              class="input input-sm input-bordered w-full" />
          </div>

          <!-- Filtro por fecha desde -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Desde</label>
            <input v-model="filters.dateFrom" type="date" class="input input-sm input-bordered w-full" />
          </div>

          <!-- Filtro por fecha hasta -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
            <input v-model="filters.dateTo" type="date" class="input input-sm input-bordered w-full" />
          </div>
        </div>

        <!-- Botón limpiar filtros -->
        <div class="flex justify-end mt-3">
          <button v-if="hasActiveFilters" @click="clearFilters" class="btn btn-xs btn-ghost text-gray-600">
            <IconFilterX class="w-4 h-4 mr-1" />
            Limpiar filtros
          </button>
        </div>
      </div>

      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="section-heading"><IconHeartHandshake class="section-heading-icon" /> Historial de apoyos</h2>
          <p v-if="!loading" class="mt-1 text-sm text-gray-600">{{ filteredContributions.length }} entrega(s) registrada(s).</p>
        </div>

        <div>
          <div class="tooltip tooltip-left" data-tip="Otorgar apoyo">
            <router-link :to="{ name: 'NewContribution', params: { id: props.beneficiary._id } }"
              class="btn btn-brand min-h-11 ms-2" aria-label="Otorgar nuevo apoyo">
              <IconPlus class="w-5 h-5" />
              <span>Otorgar apoyo</span>
            </router-link>
          </div>
        </div>

      </div>

      <div class="w-full">

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <IconLoader class="w-12 h-12 animate-spin" />
        </div>

        <!-- Empty State -->
        <AppEmptyState v-else-if="filteredContributions.length === 0"
          :title="hasActiveFilters ? 'No hay coincidencias' : 'No hay apoyos registrados'"
          :description="hasActiveFilters ? 'Ajusta los filtros para ampliar la búsqueda.' : 'Registra la primera entrega de apoyo para este beneficiario.'">
          <template #icon><IconHeartHandshake class="h-7 w-7" /></template>
          <router-link v-if="!hasActiveFilters" :to="{ name: 'NewContribution', params: { id: props.beneficiary._id } }" class="btn btn-brand">
            <IconPlus class="h-4 w-4" /> Otorgar apoyo
          </router-link>
        </AppEmptyState>

        <!-- Contributions List -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(contribution, index) in filteredContributions" :key="`contribution-card-${contribution._id}`"
            class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">

            <p class="text-xs text-gray-500 font-medium">Folio: <span class="font-bold text-red-800">{{
              contribution.folio }}</span>
            </p>

            <div class="flex items-center gap-1 justify-between">
              <div class="flex items-center gap-1">
                <span class="font-medium text-xs text-gray-900">Fecha de entrega: </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(contribution.contributionDate) }}
                </span>
              </div>
              <div class="flex gap-1">
                <div class="tooltip" data-tip="Ver detalles">
                  <button class="btn btn-sm btn-square btn-ghost text-blue-600" aria-label="Ver detalles del apoyo" @click="openDetailsModal(contribution)">
                    <IconFileInfo class="w-4 h-4" />
                  </button>
                </div>
                <div class="tooltip" data-tip="Generar Ticket PDF">
                  <button class="btn btn-sm btn-square btn-ghost text-red-800" @click="generateTicketPDF(index)"
                    aria-label="Generar comprobante PDF" :disabled="contribution.loadingPrint">
                    <IconPdf v-if="!contribution.loadingPrint" class="w-4 h-4" />
                    <IconLoader v-if="contribution.loadingPrint" class="w-4 h-4 animate-spin" />
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <h5 class="text-[0.8rem] font-medium text-gray-900 mt-2">Lista de apoyos otorgados</h5>
              <div v-for="(item, index) in contribution.productOrServices" :key="index"
                class="flex items-center justify-between text-xs">
                <div class="flex-1 min-w-0">
                  <span class="font-medium text-gray-900">{{ item.productOrService.category.name }}</span>
                  <span class="text-gray-500 mx-1 font-black">·</span>
                  <span class="text-gray-500">{{ item.description }}</span>
                  <hr>
                </div>
                <div class="text-red-900 font-medium ml-2">
                  cant. {{ item.quantity }}
                  <hr>
                </div>
              </div>
            </div>

            <div class="mt-1">
              <p class="text-gray-500 text-xs">
                <span class="font-medium text-gray-900">Recibió: </span>
                {{ contribution.receiver }}
              </p>
            </div>

            <div v-if="contribution.comments" class="mt-1">
              <span class="font-medium text-xs text-gray-900">Observaciones: </span>
              <p class="text-xs text-gray-500 italic">
                {{ contribution.comments }}
              </p>
            </div>
            <ContributionTicketPDF ref="contributionTicketRef" :beneficiary="props.beneficiary"
              :contribution="contribution" />
          </div>
        </div>
      </div>
    </div>


    <ContributionDetailsModal :show="showDetailsModal" :contribution="selectedContribution"
      :beneficiary="props.beneficiary" @close="closeDetailsModal" @print-ticket="handlePrintFromModal" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import { IconPlus, IconPdf, IconFileInfo, IconLoader, IconFilterX, IconHeartHandshake } from '@tabler/icons-vue';
import AppEmptyState from '@/components/ui/AppEmptyState.vue';
import { useAuth } from '@/composables/useAuth';
import { useDate } from '@/utils/dateTool';
import contributionServices from '@/services/contributionServices';
import ContributionTicketPDF from './ContributionTicketPDF.vue';
import ContributionDetailsModal from './ContributionDetailsModal.vue';

// composables
const { authHeader } = useAuth();
const { formatDate } = useDate();

//props
const props = defineProps({
  beneficiary: Object
});

const emits = defineEmits(['update:list']);

//data
const showDetailsModal = ref(false);
const selectedContribution = ref({});
const loading = ref(false);
const contributions = ref([]);

// Filtros
const filters = ref({
  folio: '',
  dateFrom: '',
  dateTo: ''
});

//computed
const filteredContributions = computed(() => {
  let result = contributions.value;

  // Filtro por folio
  if (filters.value.folio) {
    const folioSearch = filters.value.folio.trim().toLowerCase();
    result = result.filter(c => c.folio.toString().toLowerCase().includes(folioSearch));
  }

  // Filtro por fecha desde
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    result = result.filter(c => {
      const contributionDate = new Date(c.contributionDate);
      contributionDate.setHours(0, 0, 0, 0);
      return contributionDate >= fromDate;
    });
  }

  // Filtro por fecha hasta
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo);
    toDate.setHours(23, 59, 59, 999);
    result = result.filter(c => {
      const contributionDate = new Date(c.contributionDate);
      return contributionDate <= toDate;
    });
  }

  return result;
});

const hasActiveFilters = computed(() => {
  return filters.value.folio || filters.value.dateFrom || filters.value.dateTo;
});


//methods
const clearFilters = () => {
  filters.value.folio = '';
  filters.value.dateFrom = '';
  filters.value.dateTo = '';
};

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

// Modal de detalles
const openDetailsModal = (contribution) => {
  selectedContribution.value = contribution
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedContribution.value = {}
}

const handlePrintFromModal = async (contribution) => {
  const index = contributions.value.findIndex(c => c._id === contribution._id)
  if (index !== -1) {
    await generateTicketPDF(index)
  }
}

onMounted(() => {
  getContributions()
})

</script>
