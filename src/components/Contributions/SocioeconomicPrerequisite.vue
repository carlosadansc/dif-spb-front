<template>
  <section class="surface-panel overflow-hidden" aria-labelledby="assessment-check-title">
    <div class="border-b border-gray-200 px-5 py-5 sm:px-7">
      <div class="flex items-start gap-3">
        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
          <IconClipboardCheck class="h-6 w-6" />
        </div>
        <div>
          <p class="text-sm font-bold text-red-900">Paso 1 de 2</p>
          <h2 id="assessment-check-title" class="mt-0.5 text-xl font-bold text-gray-950">Verificar estudio socioeconómico</h2>
          <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-600">Antes de entregar el apoyo, confirma que la información del estudio más reciente sigue siendo correcta.</p>
        </div>
      </div>
    </div>

    <div class="px-5 py-6 sm:px-7">
      <div v-if="loading" class="space-y-3" aria-label="Consultando estudio socioeconómico">
        <div class="skeleton h-5 w-48"></div>
        <div class="skeleton h-24 w-full"></div>
        <div class="skeleton h-12 w-72 max-w-full"></div>
      </div>

      <div v-else-if="loadError" class="mx-auto max-w-xl py-4 text-center">
        <IconAlertCircle class="mx-auto h-10 w-10 text-red-800" />
        <h3 class="mt-3 text-lg font-bold text-gray-950">No se pudo consultar el estudio</h3>
        <p class="mt-1 text-sm text-gray-600">Revisa la conexión e inténtalo nuevamente.</p>
        <button type="button" class="btn btn-outline mt-4 min-h-11" @click="loadLatestAssessment">
          <IconRefresh class="h-5 w-5" /> Reintentar
        </button>
      </div>

      <div v-else-if="!latestAssessment" class="mx-auto max-w-xl py-4 text-center">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-900">
          <IconClipboardOff class="h-7 w-7" />
        </div>
        <h3 class="mt-4 text-lg font-bold text-gray-950">Aún no existe un estudio socioeconómico</h3>
        <p class="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">Es indispensable registrar uno antes de otorgar el primer apoyo.</p>
        <button type="button" class="btn btn-brand mt-5 min-h-12" @click="showAssessmentWizard = true">
          <IconClipboardPlus class="h-5 w-5" /> Realizar estudio
        </button>
      </div>

      <div v-else class="mx-auto max-w-2xl space-y-5">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="text-xs font-semibold text-gray-500">Último estudio</p>
              <p class="mt-0.5 text-sm font-bold text-gray-950">{{ latestAssessment.folio || 'Sin folio' }}</p>
            </div>
            <span class="badge badge-outline border-gray-300 bg-white text-gray-700">{{ formatDate(latestAssessment.assessmentDate) }}</span>
          </div>
          <dl class="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt class="text-xs text-gray-500">Integrantes</dt>
              <dd class="mt-1 text-sm font-bold text-gray-900">{{ latestAssessment.snapshot?.householdSize || 1 }}</dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500">Ingreso del hogar</dt>
              <dd class="mt-1 text-sm font-bold text-green-800">{{ formatCurrency(latestAssessment.snapshot?.totalHouseholdIncome || 0) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500">Gastos del hogar</dt>
              <dd class="mt-1 text-sm font-bold text-red-800">{{ formatCurrency(latestAssessment.snapshot?.totalHouseholdExpenses || 0) }}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="text-base font-bold text-gray-950">¿La información socioeconómica sigue siendo correcta?</h3>
          <p class="mt-1 text-sm text-gray-600">Selecciona una opción para continuar.</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <button type="button"
            class="flex min-h-24 items-start gap-3 rounded-xl border border-green-300 bg-green-50 p-4 text-left transition-colors hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
            @click="confirmAssessment">
            <IconCircleCheck class="mt-0.5 h-6 w-6 shrink-0 text-green-800" />
            <span>
              <span class="block text-sm font-bold text-green-950">Sí, sigue vigente</span>
              <span class="mt-1 block text-xs leading-5 text-green-900">Usar este estudio para registrar el apoyo.</span>
            </span>
          </button>
          <button type="button"
            class="flex min-h-24 items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
            @click="showAssessmentWizard = true">
            <IconRefresh class="mt-0.5 h-6 w-6 shrink-0 text-amber-800" />
            <span>
              <span class="block text-sm font-bold text-amber-950">No, hay cambios</span>
              <span class="mt-1 block text-xs leading-5 text-amber-900">Actualizar los datos y generar un nuevo estudio.</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <NewAssessmentModal :show="showAssessmentWizard" :beneficiary="beneficiary"
      @close="showAssessmentWizard = false" @created="handleAssessmentCreated" />
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  IconAlertCircle,
  IconCircleCheck,
  IconClipboardCheck,
  IconClipboardOff,
  IconClipboardPlus,
  IconRefresh
} from '@tabler/icons-vue'
import { useAuth } from '@/composables/useAuth'
import { useDate } from '@/utils/dateTool'
import formatCurrency from '@/utils/formatCurrency'
import socioeconomicServices from '@/services/socioeconomicServices'
import NewAssessmentModal from '@/components/BeneficiaryView/NewAssessmentModal.vue'

const props = defineProps({ beneficiary: { type: Object, required: true } })
const emit = defineEmits(['verified', 'beneficiary-updated'])
const { authHeader } = useAuth()
const { formatDate } = useDate()
const loading = ref(false)
const latestAssessment = ref(null)
const showAssessmentWizard = ref(false)
const loadError = ref(false)

const loadLatestAssessment = async () => {
  if (!props.beneficiary?._id) return
  loading.value = true
  loadError.value = false
  try {
    const response = await socioeconomicServices.getLatestAssessment(props.beneficiary._id, authHeader.value)
    latestAssessment.value = response.data || null
  } catch (error) {
    if (error.response?.status === 404) latestAssessment.value = null
    else loadError.value = true
  } finally {
    loading.value = false
  }
}

const confirmAssessment = () => emit('verified', latestAssessment.value)

const handleAssessmentCreated = async (assessment) => {
  showAssessmentWizard.value = false
  latestAssessment.value = assessment
  emit('beneficiary-updated')
  emit('verified', assessment)
}

watch(() => props.beneficiary?._id, loadLatestAssessment)
onMounted(loadLatestAssessment)
</script>
