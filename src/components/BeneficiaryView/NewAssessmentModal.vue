<template>
  <dialog class="modal" ref="newAssessmentModalRef">
    <div class="modal-box w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>

      <h3 class="text-lg font-bold">Nuevo Estudio Socioeconómico</h3>
      <p class="text-sm text-gray-500 mt-2 required">
        <span class="font-bold">¡Importante!</span> Verifique que los datos del beneficiario evaluado sean correctos antes de generar un nuevo estudio socioeconómico, de no ser así, por favor corrija los datos en las secciones de datos del beneficiario y datos económicos.
      </p>

      <div class="divider"></div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- General Info -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-sm mb-3 text-red-800">Información General</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-600">Fecha de evaluación</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatDate(formData.assessmentDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Beneficiary data will be loaded automatically -->

        <!-- Economic Data -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-sm mb-3 text-red-800">Datos Económicos</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-600">Ingreso mensual</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.income) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Ocupación</p>
              <p class="text-sm font-semibold text-gray-900">{{ formData.snapshot.occupation || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Escolaridad</p>
              <p class="text-sm font-semibold text-gray-900">{{ getScholarshipText(formData.snapshot.scholarship) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Estado civil</p>
              <p class="text-sm font-semibold text-gray-900">{{ getCivilStatusText(formData.snapshot.civilStatus) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Servicio médico</p>
              <p class="text-sm font-semibold text-gray-900">{{ formData.snapshot.medicalService || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Household Summary -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-sm mb-3 text-red-800">Resumen del Hogar</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-600">Integrantes del hogar</p>
              <p class="text-sm font-semibold text-gray-900">{{ formData.snapshot.householdSize }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Ingreso total del hogar</p>
              <p class="text-sm font-semibold text-green-600">{{ formatCurrency(formData.snapshot.totalHouseholdIncome) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Gastos totales del hogar</p>
              <p class="text-sm font-semibold text-red-600">{{ formatCurrency(formData.snapshot.totalHouseholdExpenses) }}</p>
            </div>
          </div>
        </div>

        <!-- Expenses -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-sm mb-3 text-red-800">Gastos Mensuales</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-600">Transporte</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.expenses.transport) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Alimentación</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.expenses.meal) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">TV/Internet</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.expenses.tvService) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Agua</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.expenses.waterService) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Electricidad</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.expenses.electricService) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-600">Otros gastos</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(formData.snapshot.expenses.otherExpenses) }}</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-medium text-gray-700">Observaciones</label>
          <textarea v-model="formData.notes" rows="4" class="input mt-1 block w-full bg-white border border-gray-300"
            placeholder="Notas adicionales sobre el estudio..."></textarea>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button :disabled="loading" type="submit" class="btn bg-red-900 text-white w-full">
            <span v-if="!loading">Generar Estudio</span>
            <span v-else class="loading loading-spinner loading-lg"></span>
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth'
import socioeconomicServices from '@/services/socioeconomicServices';
import civilStatus from '@/constants/civilStatus';
import scholarships from '@/constants/scholarships';
import formatCurrency from '../../utils/formatCurrency';
import { useDate } from '@/utils/dateTool';

const { formatDate } = useDate();

const { authHeader } = useAuth()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  beneficiary: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'created']);

const newAssessmentModalRef = ref(null);
const loading = ref(false);

const formData = ref({
  assessmentDate: new Date().toISOString().split('T')[0],
  notes: '',
  snapshot: {
    income: 0,
    occupation: '',
    occupationDescription: '',
    scholarship: '',
    civilStatus: '',
    medicalService: '',
    address: {
      communityType: '',
      delegation: '',
      subdelegation: '',
      street: '',
      sideStreets: '',
      extNum: '',
      intNum: '',
      neighborhood: '',
      cp: null,
      city: ''
    },
    spouseOrTutor: {
      curp: '',
      fullname: '',
      age: null,
      phone: '',
      work: '',
      income: 0,
      relationship: ''
    },
    home: {
      type: '',
      roomNumber: null,
      belonging: '',
      floorType: '',
      wallType: '',
      ceilingType: '',
      haveBathroom: false,
      haveToilet: false,
      haveDrainage: false,
      haveSepticTank: false,
      haveWaterService: false,
      haveElectricService: false,
      haveAirConditioning: false,
      haveTvService: false
    },
    expenses: {
      transport: 0,
      meal: 0,
      tvService: 0,
      waterService: 0,
      electricService: 0,
      otherExpenses: 0
    },
    familyMembers: [],
    totalHouseholdIncome: 0,
    totalHouseholdExpenses: 0,
    householdSize: 1
  }
});

watch(
  () => props.show,
  async (value) => {
    if (value) {
      newAssessmentModalRef.value?.showModal();
      // Load beneficiary data automatically when modal opens
      await loadFromBeneficiary();
    } else {
      newAssessmentModalRef.value?.close();
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('close');
};

const calculateTotals = () => {
  // Calculate total household income
  let totalIncome = parseFloat(formData.value.snapshot.income) || 0;

  if (formData.value.snapshot.spouseOrTutor?.income) {
    totalIncome += parseFloat(formData.value.snapshot.spouseOrTutor.income);
  }

  if (formData.value.snapshot.familyMembers?.length) {
    formData.value.snapshot.familyMembers.forEach(member => {
      if (member.income) {
        totalIncome += parseFloat(member.income);
      }
    });
  }

  formData.value.snapshot.totalHouseholdIncome = totalIncome;

  // Calculate total expenses
  const expenses = formData.value.snapshot.expenses;
  const totalExpenses =
    (parseFloat(expenses.transport) || 0) +
    (parseFloat(expenses.meal) || 0) +
    (parseFloat(expenses.tvService) || 0) +
    (parseFloat(expenses.waterService) || 0) +
    (parseFloat(expenses.electricService) || 0) +
    (parseFloat(expenses.otherExpenses) || 0);

  formData.value.snapshot.totalHouseholdExpenses = totalExpenses;

  // Calculate household size
  let householdSize = 1; // Beneficiary
  if (formData.value.snapshot.spouseOrTutor?.fullname) householdSize++;
  if (formData.value.snapshot.familyMembers?.length) {
    householdSize += formData.value.snapshot.familyMembers.length;
  }

  formData.value.snapshot.householdSize = householdSize;
};

const loadFromBeneficiary = async () => {
  if (!props.beneficiary) return;

  loading.value = true;
  try {
    const ben = props.beneficiary;

    // Load economic data
    if (ben.income) formData.value.snapshot.income = ben.income;
    if (ben.occupation) formData.value.snapshot.occupation = ben.occupation;
    if (ben.scholarship) formData.value.snapshot.scholarship = ben.scholarship;
    if (ben.civilStatus) formData.value.snapshot.civilStatus = ben.civilStatus;
    if (ben.medicalService) formData.value.snapshot.medicalService = ben.medicalService;

    // Load address
    if (ben.address) {
      formData.value.snapshot.address = { ...ben.address };
    }

    // Load spouse/tutor
    if (ben.spouseOrTutor) {
      formData.value.snapshot.spouseOrTutor = { ...ben.spouseOrTutor };
    }

    // Load home
    if (ben.home) {
      formData.value.snapshot.home = { ...ben.home };
    }

    // Load expenses
    if (ben.expenses) {
      formData.value.snapshot.expenses = { ...ben.expenses };
    }

    // Load family members
    if (ben.family && ben.family.length > 0) {
      formData.value.snapshot.familyMembers = ben.family.map(member => ({
        name: member.name || '',
        lastname: member.lastname || '',
        age: member.age || null,
        sex: member.sex || '',
        scholarship: member.scholarship || '',
        phone: member.phone || '',
        relationship: member.relationship || '',
        occupation: member.occupation || '',
        income: member.income || 0
      }));
    }

    // Calculate totals
    calculateTotals();

    // toast.success('Datos cargados desde el beneficiario');
  } catch (error) {
    console.error('Error loading beneficiary data:', error);
    // toast.error('Error al cargar los datos del beneficiario');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  loading.value = true;

  try {
    // Calculate totals before submitting
    calculateTotals();

    const payload = {
      ...formData.value
    };

    const response = await socioeconomicServices.createAssessment(props.beneficiary._id, payload, authHeader.value);

    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor');
    } else {
      toast.success('Estudio socioeconómico creado exitosamente');
      emit('created');
      resetForm();
      closeModal();
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || 'Error al crear el estudio');
    } else {
      console.error('Error:', err);
      toast.error('Error inesperado al crear el estudio');
    }
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    assessmentDate: new Date().toISOString().split('T')[0],
    notes: '',
    snapshot: {
      income: 0,
      occupation: '',
      occupationDescription: '',
      scholarship: '',
      civilStatus: '',
      medicalService: '',
      address: {},
      spouseOrTutor: {},
      home: {},
      expenses: {
        transport: 0,
        meal: 0,
        tvService: 0,
        waterService: 0,
        electricService: 0,
        otherExpenses: 0
      },
      familyMembers: [],
      totalHouseholdIncome: 0,
      totalHouseholdExpenses: 0,
      householdSize: 1
    }
  };
};

const getCivilStatusText = (statusValue) => {
  if (!statusValue) return 'N/A';
  const status = civilStatus.find(s => s.value === statusValue);
  return status ? status.text : statusValue;
};

const getScholarshipText = (scholarshipValue) => {
  if (!scholarshipValue) return 'N/A';
  const scholarship = scholarships.find(s => s.value === scholarshipValue);
  return scholarship ? scholarship.text : scholarshipValue;
};
</script>
