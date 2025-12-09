<template>
  <div class="">
    <!-- <h3 class="text-lg font-semibold text-gray-900 mb-4">Historial de Apoyos</h3> -->
    <div class="overflow-x-auto">
      <!-- Barra de filtros -->
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
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

      <div class="flex justify-between items-center mb-[2rem]">
        <!-- <div class="flex items-center gap-3"> -->
        <h6 class="ms-4 font-medium text-sm">Entregas realizadas: <span v-if="!loading"
            class="font-bold text-xl text-red-800">{{ filteredContributions.length }}</span> </h6>

        <div>
          <ExportToExcelButton tooltip="Exportar historial a Excel" :loading="loadingExport" @click="exportToExcel" />
          <div class="tooltip tooltip-left" data-tip="Otorgar apoyo">
            <router-link :to="{ name: 'NewContribution', params: { id: props.beneficiary._id } }"
              class="btn btn-square bg-red-800 font-black text-white text-[1.2rem] ms-2">
              <IconPlus class="w-5 h-5" />
            </router-link>
          </div>
        </div>

        <!-- </div> -->
      </div>

      <div class="w-full">

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <IconLoader class="w-12 h-12 animate-spin" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredContributions.length === 0" class="bg-white rounded-md shadow p-4 text-center">
          <p v-if="hasActiveFilters" class="text-sm text-gray-500">
            No se encontraron apoyos con los filtros aplicados
          </p>
          <p v-else class="text-sm text-gray-500">No apoyos otorgados <router-link
              :to="{ name: 'NewContribution', params: { id: props.beneficiary._id } }"
              class="text-red-800 font-bold text-xs underline cursor-pointer hover:text-red-500">Otorgar
              Apoyo</router-link></p>
        </div>

        <!-- Contributions List -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(contribution, index) in filteredContributions" :key="`contribution-card-${contribution._id}`"
            class="bg-white border border-solid border-gray-100 rounded-lg p-4 flex flex-col">

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
                  <button class="btn btn-sm btn-square btn-ghost text-blue-600" @click="openDetailsModal(contribution)">
                    <IconFileInfo class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="!contribution.haveMultipleBeneficiaries" class="tooltip" data-tip="Generar Ticket PDF">
                  <button class="btn btn-sm btn-square btn-ghost text-red-800" @click="generateTicketPDF(index)"
                    :disabled="contribution.loadingPrint">
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
import { exportToExcel as exportExcelUtil, formatDateForExcel, formatNumberForExcel } from '@/utils/excelExport';
import { IconPlus, IconPdf, IconFileInfo, IconLoader, IconFilterX } from '@tabler/icons-vue';
import { useAuth } from '@/composables/useAuth';
import { useDate } from '@/utils/dateTool';
import contributionServices from '@/services/contributionServices';
import ContributionTicketPDF from './ContributionTicketPDF.vue';
import ExportToExcelButton from '@/components/ExportToExcelButton.vue';
import ContributionDetailsModal from './ContributionDetailsModal.vue';

// composables
const { authHeader, isAdmin, isStandardUser, isExecutive } = useAuth();
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
const loadingExport = ref(false);
const contributions = ref([]);
const contributionsForExport = ref([]);

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

// const getContributionsToExport = async () => {
//   loadingExport.value = true;
//   try {
//     const response = await contributionServices.getContributionsByBeneficiaryForExport(props.beneficiary._id, authHeader.value)
//     if (response.code === "ERR_NETWORK") {
//       toast.error('No se pudo conectar con el servidor')
//     } else {
//       contributionsForExport.value = response.data
//       console.log(contributionsForExport.value)
//     }
//   } catch (err) {
//     if (err instanceof AxiosError) {
//       toast.error(err.response?.data?.message)
//     } else {
//       toast.error(err)
//     }
//   } finally {
//     loadingExport.value = false
//   }
// }

const contributionColumns = {
  "Folio": "folio",
  "Fecha de apoyo": "contributionDate",
  "Nombre": "beneficiaryName",
  "Otorgado por": "createdBy",
  "Tipo de apoyo": "categoryName",
  "Apoyo otorgado": "description",
  "Cantidad": "quantity",
};

const exportToExcel = async () => {
  loadingExport.value = true;

  try {
    // Verificar que hay datos para exportar
    if (filteredContributions.value.length === 0) {
      toast.warning('No hay datos para exportar');
      loadingExport.value = false;
      return;
    }


    // Preparar los datos filtrados para exportación (excluyendo apoyos masivos)
    const dataToExport = filteredContributions.value
      .filter(contribution => !contribution.haveMultipleBeneficiaries) // Solo apoyos NO masivos
      .map(contribution => ({
        folio: contribution.folio,
        contributionDate: contribution.contributionDate,
        beneficiaryName: `${props.beneficiary.name} ${props.beneficiary.fatherSurname} ${props.beneficiary.motherSurname || ''}`.trim(),
        createdBy: contribution.createdBy?.name || contribution.createdBy || '',
        categoryName: contribution.productOrServices?.[0]?.productOrService?.category?.name || '',
        description: contribution.productOrServices?.map(p => p.description).join(', ') || '',
        quantity: contribution.productOrServices?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0
      }));


    // Generar nombre de archivo limpio
    let fileName = 'historial-apoyos-smdif-la-paz';

    if (props.beneficiary) {
      const beneficiaryName = (props.beneficiary.name ? props.beneficiary.name.toLowerCase() : '').split(' ').join('-');
      const fatherSurname = (props.beneficiary.fatherSurname ? props.beneficiary.fatherSurname.toLowerCase() : '').split(' ').join('-');

      if (beneficiaryName && fatherSurname) {
        fileName = `historial-apoyos-${beneficiaryName}-${fatherSurname}-smdif-la-paz`;
      } else {
        fileName = 'historial-apoyos-beneficiario-smdif-la-paz';
      }
    }

    exportExcelUtil(
      dataToExport,
      contributionColumns,
      fileName,
      'Apoyos',
      {
        columnWidths: {
          "Folio": 10,
          "Fecha de apoyo": 12,
          "Nombre": 25,
          "Otorgado por": 20,
          "Tipo de apoyo": 15,
          "Apoyo otorgado": 30,
          "Cantidad": 10,
        },
        formatters: {
          'Fecha de apoyo': formatDateForExcel,
          'Cantidad': formatNumberForExcel
        }
      }
    );

    toast.success(`${dataToExport.length} registro(s) exportado(s)`);
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    toast.error('Error al exportar a Excel');
  } finally {
    loadingExport.value = false;
  }
};

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
