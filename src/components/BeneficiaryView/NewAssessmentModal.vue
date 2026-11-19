<template>
  <dialog ref="newAssessmentModalRef" class="modal">
    <div class="modal-box flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden p-0">
      <div class="px-5 pt-5 sm:px-7 sm:pt-6">
        <AppModalHeader title="Actualizar estudio socioeconómico"
          description="Confirma la información actual para crear un nuevo estudio." @close="closeModal">
          <template #icon><IconClipboardPlus class="h-5 w-5" /></template>
        </AppModalHeader>

        <div class="mt-5 flex items-center gap-3" aria-label="Progreso del estudio">
          <progress class="progress progress-error h-2 flex-1" :value="currentStep" :max="steps.length"></progress>
          <span class="shrink-0 text-sm font-bold text-gray-700">{{ currentStep }} de {{ steps.length }}</span>
        </div>
        <p class="mt-2 text-sm text-gray-600">{{ activeStep.description }}</p>
      </div>

      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="submitForm">
        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <section v-if="currentStep === 1" class="mx-auto max-w-2xl space-y-5" aria-labelledby="economic-step-title">
            <div>
              <h3 id="economic-step-title" class="text-lg font-bold text-gray-950">Situación laboral e ingresos</h3>
              <p class="mt-1 text-sm text-gray-600">Actualiza los datos personales que influyen en la evaluación.</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="form-control sm:col-span-2">
                <span class="mb-2 text-sm font-semibold text-gray-800">¿Cuál es su ocupación actual?</span>
                <input v-model.trim="formData.occupation" class="input input-bordered w-full" type="text"
                  placeholder="Ej. comerciante, estudiante, hogar" />
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Ingreso mensual</span>
                <div class="input input-bordered flex items-center gap-2">
                  <span class="font-semibold text-gray-500">$</span>
                  <input v-model.number="formData.income" class="grow" type="number" min="0" step="0.01" />
                </div>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Escolaridad</span>
                <select v-model="formData.scholarship" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option v-for="item in scholarships" :key="item.value" :value="item.value">{{ item.text }}</option>
                </select>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Estado civil</span>
                <select v-model="formData.civilStatus" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option v-for="item in civilStatus" :key="item.value" :value="item.value">{{ item.text }}</option>
                </select>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Servicio médico</span>
                <select v-model="formData.medicalService" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option v-for="item in medicalServices" :key="item.value" :value="item.value">{{ item.text }}</option>
                </select>
              </label>
              <label class="form-control sm:col-span-2">
                <span class="mb-2 text-sm font-semibold text-gray-800">Descripción laboral <span class="font-normal text-gray-500">(opcional)</span></span>
                <textarea v-model.trim="formData.occupationDescription" class="textarea textarea-bordered min-h-24 w-full"
                  placeholder="Actividad, lugar de trabajo o situación actual"></textarea>
              </label>
            </div>
          </section>

          <section v-else-if="currentStep === 2" class="mx-auto max-w-2xl space-y-5" aria-labelledby="home-step-title">
            <div>
              <h3 id="home-step-title" class="text-lg font-bold text-gray-950">Condiciones de vivienda</h3>
              <p class="mt-1 text-sm text-gray-600">Registra cómo es la vivienda y los servicios disponibles.</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Tipo de vivienda</span>
                <select v-model="formData.home.type" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="CASA">Casa</option>
                  <option value="DEPARTAMENTO">Departamento</option>
                  <option value="CUARTO">Cuarto</option>
                  <option value="OTRO">Otro</option>
                </select>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Tenencia</span>
                <select v-model="formData.home.belonging" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="PROPIA">Propia</option>
                  <option value="RENTA">Rentada</option>
                  <option value="HIPOTECADA">Hipotecada</option>
                  <option value="PRESTADA">Prestada</option>
                </select>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Número de habitaciones</span>
                <input v-model.number="formData.home.roomNumber" class="input input-bordered w-full" type="number" min="0" />
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Tipo de piso</span>
                <select v-model="formData.home.floorType" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option v-for="item in floorTypes" :key="item.value" :value="item.value">{{ item.text }}</option>
                </select>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Material de paredes</span>
                <select v-model="formData.home.wallType" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option v-for="item in wallTypes" :key="item.value" :value="item.value">{{ item.text }}</option>
                </select>
              </label>
              <label class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">Material del techo</span>
                <select v-model="formData.home.ceilingType" class="select select-bordered w-full">
                  <option value="" disabled>Selecciona una opción</option>
                  <option v-for="item in ceilingTypes" :key="item.value" :value="item.value">{{ item.text }}</option>
                </select>
              </label>
            </div>

            <fieldset>
              <legend class="mb-3 text-sm font-bold text-gray-900">Servicios disponibles</legend>
              <div class="grid gap-2 sm:grid-cols-2">
                <label v-for="service in homeServices" :key="service.key"
                  class="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50">
                  <input v-model="formData.home[service.key]" type="checkbox" class="checkbox checkbox-sm checkbox-error" />
                  <span class="text-sm font-medium text-gray-800">{{ service.label }}</span>
                </label>
              </div>
            </fieldset>
          </section>

          <section v-else-if="currentStep === 3" class="mx-auto max-w-2xl space-y-5" aria-labelledby="expenses-step-title">
            <div>
              <h3 id="expenses-step-title" class="text-lg font-bold text-gray-950">Gastos mensuales</h3>
              <p class="mt-1 text-sm text-gray-600">Captura el gasto aproximado del hogar en cada concepto.</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label v-for="expense in expenseFields" :key="expense.key" class="form-control">
                <span class="mb-2 text-sm font-semibold text-gray-800">{{ expense.label }}</span>
                <div class="input input-bordered flex items-center gap-2">
                  <span class="font-semibold text-gray-500">$</span>
                  <input v-model.number="formData.expenses[expense.key]" class="grow" type="number" min="0" step="0.01" />
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
              <span class="text-sm font-semibold text-gray-700">Gasto mensual estimado</span>
              <span class="text-lg font-bold text-gray-950">{{ formatCurrency(totalExpenses) }}</span>
            </div>
          </section>

          <section v-else class="mx-auto max-w-2xl space-y-5" aria-labelledby="review-step-title">
            <div>
              <h3 id="review-step-title" class="text-lg font-bold text-gray-950">Revisar y generar estudio</h3>
              <p class="mt-1 text-sm text-gray-600">Confirma el resumen antes de guardar la actualización.</p>
            </div>

            <dl class="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              <div class="flex items-center justify-between gap-4 px-4 py-3">
                <dt class="text-sm text-gray-600">Ocupación</dt>
                <dd class="text-right text-sm font-bold text-gray-900">{{ formData.occupation }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 px-4 py-3">
                <dt class="text-sm text-gray-600">Ingreso mensual personal</dt>
                <dd class="text-right text-sm font-bold text-green-800">{{ formatCurrency(formData.income) }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 px-4 py-3">
                <dt class="text-sm text-gray-600">Integrantes del hogar</dt>
                <dd class="text-right text-sm font-bold text-gray-900">{{ householdSize }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 px-4 py-3">
                <dt class="text-sm text-gray-600">Ingreso total del hogar</dt>
                <dd class="text-right text-sm font-bold text-green-800">{{ formatCurrency(totalHouseholdIncome) }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 px-4 py-3">
                <dt class="text-sm text-gray-600">Gastos mensuales</dt>
                <dd class="text-right text-sm font-bold text-red-800">{{ formatCurrency(totalExpenses) }}</dd>
              </div>
            </dl>

            <label class="form-control">
              <span class="mb-2 text-sm font-semibold text-gray-800">Observaciones <span class="font-normal text-gray-500">(opcional)</span></span>
              <textarea v-model.trim="formData.notes" class="textarea textarea-bordered min-h-28 w-full"
                placeholder="Anota cambios relevantes o consideraciones de la evaluación"></textarea>
            </label>

            <div class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
              <IconInfoCircle class="mt-0.5 h-5 w-5 shrink-0" />
              Se actualizará el perfil del beneficiario y se conservará este estudio como una nueva fotografía socioeconómica.
            </div>
          </section>
        </div>

        <footer class="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-7">
          <button type="button" class="btn btn-ghost min-h-11" :disabled="loading" @click="currentStep === 1 ? closeModal() : previousStep()">
            <IconArrowLeft class="h-5 w-5" /> {{ currentStep === 1 ? 'Cancelar' : 'Anterior' }}
          </button>
          <button v-if="currentStep < steps.length" type="button" class="btn btn-brand min-h-11 px-6" @click="nextStep">
            Continuar <IconArrowRight class="h-5 w-5" />
          </button>
          <button v-else type="submit" class="btn btn-brand min-h-11 px-6" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <IconCircleCheck v-else class="h-5 w-5" />
            {{ loading ? 'Guardando…' : 'Guardar estudio' }}
          </button>
        </footer>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop"><button :disabled="loading" @click="closeModal">Cerrar</button></form>
  </dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { IconArrowLeft, IconArrowRight, IconCircleCheck, IconClipboardPlus, IconInfoCircle } from '@tabler/icons-vue'
import AppModalHeader from '@/components/ui/AppModalHeader.vue'
import beneficiaryServices from '@/services/beneficiaryServices'
import socioeconomicServices from '@/services/socioeconomicServices'
import { useAuth } from '@/composables/useAuth'
import { normalizeObjectTextProperties } from '@/utils/normalizeObjectText'
import formatCurrency from '@/utils/formatCurrency'
import civilStatus from '@/constants/civilStatus'
import scholarships from '@/constants/scholarships'
import medicalServices from '@/constants/medicalServices'
import floorTypes from '@/constants/floorTypes'
import wallTypes from '@/constants/wallTypes'
import ceilingTypes from '@/constants/ceilingTypes'

const props = defineProps({
  show: { type: Boolean, default: false },
  beneficiary: { type: Object, required: true }
})

const emit = defineEmits(['close', 'created'])
const { authHeader } = useAuth()
const newAssessmentModalRef = ref(null)
const currentStep = ref(1)
const loading = ref(false)

const steps = [
  { title: 'Economía', description: 'Primero revisa la situación laboral y los ingresos.' },
  { title: 'Vivienda', description: 'Continúa con las condiciones actuales de vivienda.' },
  { title: 'Gastos', description: 'Registra los gastos mensuales aproximados.' },
  { title: 'Confirmación', description: 'Finalmente revisa el resumen y genera el estudio.' }
]

const homeServices = [
  { key: 'haveBathroom', label: 'Baño' },
  { key: 'haveToilet', label: 'Sanitario' },
  { key: 'haveDrainage', label: 'Drenaje' },
  { key: 'haveWaterService', label: 'Agua potable' },
  { key: 'haveElectricService', label: 'Electricidad' },
  { key: 'haveTvService', label: 'Televisión o internet' }
]

const expenseFields = [
  { key: 'transport', label: 'Transporte' },
  { key: 'meal', label: 'Alimentación' },
  { key: 'tvService', label: 'Televisión o internet' },
  { key: 'waterService', label: 'Agua' },
  { key: 'electricService', label: 'Electricidad' },
  { key: 'otherExpenses', label: 'Otros gastos' }
]

const emptyForm = () => ({
  assessmentDate: new Date().toISOString().split('T')[0],
  notes: '',
  income: 0,
  occupation: '',
  occupationDescription: '',
  scholarship: '',
  civilStatus: '',
  medicalService: '',
  home: {
    type: '', roomNumber: 0, belonging: '', floorType: '', wallType: '', ceilingType: '',
    haveBathroom: false, haveToilet: false, haveDrainage: false, haveSepticTank: false,
    haveWaterService: false, haveElectricService: false, haveAirConditioning: false, haveTvService: false
  },
  expenses: { transport: 0, meal: 0, tvService: 0, waterService: 0, electricService: 0, otherExpenses: 0 }
})

const formData = ref(emptyForm())
const activeStep = computed(() => steps[currentStep.value - 1])
const familyMembers = computed(() => props.beneficiary.families || props.beneficiary.family || [])
const householdSize = computed(() => 1 + (props.beneficiary.spouseOrTutor?.fullname ? 1 : 0) + familyMembers.value.length)
const totalExpenses = computed(() => Object.values(formData.value.expenses).reduce((sum, value) => sum + (Number(value) || 0), 0))
const totalHouseholdIncome = computed(() => {
  const familyIncome = familyMembers.value.reduce((sum, member) => sum + (Number(member.income) || 0), 0)
  return (Number(formData.value.income) || 0) + (Number(props.beneficiary.spouseOrTutor?.income) || 0) + familyIncome
})

const loadBeneficiaryData = () => {
  const beneficiary = props.beneficiary
  formData.value = {
    ...emptyForm(),
    income: beneficiary.income || 0,
    occupation: beneficiary.occupation || '',
    occupationDescription: beneficiary.occupationDescription || '',
    scholarship: beneficiary.scholarship || '',
    civilStatus: beneficiary.civilStatus || '',
    medicalService: beneficiary.medicalService || '',
    home: { ...emptyForm().home, ...(beneficiary.home || {}) },
    expenses: { ...emptyForm().expenses, ...(beneficiary.expenses || {}) }
  }
  currentStep.value = 1
}

watch(() => props.show, (show) => {
  if (show) {
    loadBeneficiaryData()
    newAssessmentModalRef.value?.showModal()
  } else {
    newAssessmentModalRef.value?.close()
  }
}, { immediate: true })

const validateCurrentStep = () => {
  if (currentStep.value === 1 && (!formData.value.occupation || !formData.value.scholarship || !formData.value.civilStatus || !formData.value.medicalService)) {
    toast.warning('Completa ocupación, escolaridad, estado civil y servicio médico')
    return false
  }
  if (currentStep.value === 2 && (!formData.value.home.type || !formData.value.home.belonging || !formData.value.home.floorType || !formData.value.home.wallType || !formData.value.home.ceilingType)) {
    toast.warning('Completa los datos principales de la vivienda')
    return false
  }
  return true
}

const nextStep = () => {
  if (validateCurrentStep()) currentStep.value += 1
}

const previousStep = () => { currentStep.value = Math.max(1, currentStep.value - 1) }

const closeModal = () => {
  if (!loading.value) emit('close')
}

const submitForm = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await beneficiaryServices.updateBeneficiary({
      filter: props.beneficiary._id,
      update: normalizeObjectTextProperties({
        income: Number(formData.value.income) || 0,
        occupation: formData.value.occupation,
        occupationDescription: formData.value.occupationDescription,
        scholarship: formData.value.scholarship,
        civilStatus: formData.value.civilStatus,
        medicalService: formData.value.medicalService,
        home: formData.value.home,
        expenses: Object.fromEntries(Object.entries(formData.value.expenses).map(([key, value]) => [key, Number(value) || 0]))
      })
    }, authHeader.value)

    const response = await socioeconomicServices.createAssessment(props.beneficiary._id, {
      assessmentDate: formData.value.assessmentDate,
      notes: formData.value.notes
    }, authHeader.value)

    toast.success('Estudio socioeconómico actualizado')
    emit('created', response.data)
    emit('close')
  } catch (error) {
    toast.error(error.response?.data?.message || 'No se pudo guardar el estudio socioeconómico')
  } finally {
    loading.value = false
  }
}
</script>
