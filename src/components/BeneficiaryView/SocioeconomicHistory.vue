<template>
  <div class="">
    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-[2rem]">
        <h6 class="ms-4 font-medium text-sm">
          Estudios realizados:
          <span v-if="!loading" class="font-bold text-xl text-red-800">{{ assessments.length }}</span>
        </h6>

        <div>
          <div class="tooltip tooltip-left" data-tip="Nuevo estudio socioeconómico">
            <button class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]"
              @click.prevent="openNewAssessmentModal">
              <IconPlus class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="w-full">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="loading loading-spinner loading-lg"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="assessments.length === 0" class="bg-white rounded-md shadow p-4 text-center">
          <p class="text-sm text-gray-500">
            No hay estudios socioeconómicos registrados
            <span class="text-red-800 font-bold text-xs underline cursor-pointer hover:text-red-500"
              @click="openNewAssessmentModal">
              Crear estudio
            </span>
          </p>
        </div>

        <!-- Assessments List -->
        <div v-else class="grid grid-cols-1 gap-4">
          <div v-for="(assessment, index) in assessments" :key="`assessment-${assessment._id}`"
            class="bg-white border border-solid border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">

            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="text-xs text-gray-500 font-medium">
                  Folio: <span class="font-bold text-red-800">{{ assessment.folio || 'N/A' }}</span>
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="font-medium text-xs text-gray-900">Fecha de evaluación:</span>
                  <span class="text-xs text-gray-500">{{ formatDate(assessment.assessmentDate) }}</span>
                </div>
              </div>

              <div class="flex gap-1">
                <div class="tooltip" data-tip="Ver detalles">
                  <button class="btn btn-sm btn-square btn-ghost text-blue-600"
                    @click="viewAssessmentDetails(assessment)">
                    <IconEye class="w-4 h-4" />
                  </button>
                </div>
                <div class="tooltip" data-tip="Imprimir estudio">
                  <button class="btn btn-sm btn-square btn-ghost text-green-600"
                    @click="printAssessment(index)" :disabled="assessment.isGeneratingPDF">
                    <IconPrinter v-if="!assessment.isGeneratingPDF" class="w-4 h-4" />
                    <IconLoader v-if="assessment.isGeneratingPDF" class="w-4 h-4 animate-spin" />
                  </button>
                </div>
                <div v-if="isAdmin" class="tooltip" data-tip="Eliminar">
                  <button class="btn btn-sm btn-square btn-ghost text-red-600"
                    @click="deleteAssessment(assessment._id)">
                    <IconTrash class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Summary Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <!-- Household Info -->
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-xs text-gray-500 font-medium">Integrantes del hogar</p>
                <p class="text-lg font-bold text-gray-900">{{ assessment.snapshot?.householdSize || 0 }}</p>
              </div>

              <!-- Total Income -->
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-xs text-gray-500 font-medium">Ingreso total</p>
                <p class="text-lg font-bold text-green-600">
                  ${{ formatCurrency(assessment.snapshot?.totalHouseholdIncome || 0) }}
                </p>
              </div>

              <!-- Total Expenses -->
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-xs text-gray-500 font-medium">Gastos totales</p>
                <p class="text-lg font-bold text-red-600">
                  ${{ formatCurrency(assessment.snapshot?.totalHouseholdExpenses || 0) }}
                </p>
              </div>

              <!-- Balance -->
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-xs text-gray-500 font-medium">Balance</p>
                <p class="text-lg font-bold"
                  :class="getBalanceClass(assessment.snapshot?.totalHouseholdIncome, assessment.snapshot?.totalHouseholdExpenses)">
                  ${{ formatCurrency((assessment.snapshot?.totalHouseholdIncome || 0) -
                    (assessment.snapshot?.totalHouseholdExpenses || 0)) }}
                </p>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="assessment.notes" class="mt-4 bg-yellow-50 p-3 rounded">
              <p class="text-xs font-medium text-gray-700 mb-1">Observaciones:</p>
              <p class="text-xs text-gray-600 italic">{{ assessment.notes }}</p>
            </div>

            <!-- Created By -->
            <div class="mt-3 text-xs text-gray-500">
              <span class="font-medium">Registrado por:</span>
              {{ assessment.createdBy?.name }} {{ assessment.createdBy?.lastname }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assessment Details Modal -->
    <AssessmentDetailsModal v-if="showDetailsModal && selectedAssessment" :key="selectedAssessment._id"
      :assessment="selectedAssessment" :show="showDetailsModal" @close="closeDetailsModal" />

    <!-- New Assessment Modal -->
    <NewAssessmentModal :show="showNewModal" :beneficiary="beneficiary" @close="closeNewModal"
      @created="handleAssessmentCreated" />

    <!-- PDF Component - ÚNICO y siempre montado -->
    <SocioeconomicPDF 
      ref="pdfComponent" 
      :beneficiary="beneficiary"
      :assessment="selectedAssessment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import { IconPlus, IconEye, IconTrash, IconPrinter, IconLoader } from '@tabler/icons-vue';
import { useAuth } from '@/composables/useAuth';
import { useDate } from '@/utils/dateTool';
import socioeconomicServices from '@/services/socioeconomicServices';
import AssessmentDetailsModal from './AssessmentDetailsModal.vue';
import NewAssessmentModal from './NewAssessmentModal.vue';
import SocioeconomicPDF from './SocioeconomicPDF.vue';

// Composables
const { authHeader, isAdmin } = useAuth();
const { formatDate } = useDate();

// Props
const props = defineProps({
  beneficiary: {
    type: Object,
    required: true
  }
});

// Data
const loading = ref(false);
const assessments = ref([]);
const selectedAssessment = ref(null);
const showDetailsModal = ref(false);
const showNewModal = ref(false);
const isGeneratingPDF = ref(false);

// Ref único para el componente PDF
const pdfComponent = ref(null);

// Methods
const getAssessments = async () => {
  loading.value = true;
  try {
    const response = await socioeconomicServices.getAssessmentsByBeneficiary(
      props.beneficiary._id,
      authHeader.value
    );

    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor');
    } else {
      assessments.value = response.data || [];
      selectedAssessment.value = assessments.value[0];
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || 'Error al cargar estudios');
    } else {
      toast.error('Error inesperado');
    }
  } finally {
    loading.value = false;
  }
};

const viewAssessmentDetails = (assessment) => {
  if (showDetailsModal.value) {
    showDetailsModal.value = false;
    nextTick(() => {
      selectedAssessment.value = assessment;
      showDetailsModal.value = true;
    });
  } else {
    selectedAssessment.value = assessment;
    showDetailsModal.value = true;
  }
};

const printAssessment = async (index) => {
  selectedAssessment.value = assessments.value[index];
  try {
    selectedAssessment.value.isGeneratingPDF = true;
    await nextTick();

    if (pdfComponent.value) {
      await pdfComponent.value.generateSocioeconomicPDF();
    } else {
      console.error('PDF component not found');
      toast.error('No se pudo encontrar el componente PDF para generar el estudio.');
    }
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    toast.error('Error al generar el PDF del estudio');
  } finally {
    selectedAssessment.value.isGeneratingPDF = false;
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  setTimeout(() => {
    selectedAssessment.value = null;
  }, 300);
};

const openNewAssessmentModal = () => {
  showNewModal.value = true;
};

const closeNewModal = () => {
  showNewModal.value = false;
};

const handleAssessmentCreated = () => {
  getAssessments();
  closeNewModal();
};

const deleteAssessment = async (id) => {
  if (!confirm('¿Está seguro de eliminar este estudio socioeconómico?')) {
    return;
  }

  try {
    const response = await socioeconomicServices.deleteAssessment(id, authHeader.value);

    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor');
    } else {
      toast.success('Estudio eliminado exitosamente');
      getAssessments();
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    } else {
      toast.error('Error inesperado');
    }
  }
};

// Utility functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
};

const getBalanceClass = (income, expenses) => {
  const balance = (income || 0) - (expenses || 0);
  if (balance > 0) return 'text-green-600';
  if (balance < 0) return 'text-red-600';
  return 'text-gray-600';
};

onMounted(() => {
  getAssessments();
});
</script>

<style scoped>
.badge {
  @apply px-2 py-1 text-xs font-medium rounded;
}

.badge-primary {
  @apply bg-blue-100 text-blue-800;
}

.badge-info {
  @apply bg-cyan-100 text-cyan-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-secondary {
  @apply bg-purple-100 text-purple-800;
}

.badge-ghost {
  @apply bg-gray-100 text-gray-800;
}
</style>