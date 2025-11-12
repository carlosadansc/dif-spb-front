<template>
  <dialog class="modal" :open="show" ref="detailsModalRef" @close="handleDialogClose">
    <div class="modal-box w-full max-w-[80vw] max-h-[90vh] overflow-y-auto">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>
      
      <h3 class="text-lg font-bold mb-2">Detalles del Estudio Socioeconómico</h3>
      <p class="text-xs text-gray-500 mb-4">
        Folio: <span class="font-bold text-red-800">{{ assessment.folio || 'N/A' }}</span>
      </p>

      <div class="divider"></div>

      <!-- General Information -->
      <div class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Información General</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Fecha de evaluación</label>
            <p class="text-sm">{{ formatDate(assessment.assessmentDate) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Registrado por</label>
            <p class="text-sm">{{ assessment.createdBy?.name }} {{ assessment.createdBy?.lastname }}</p>
          </div>
        </div>
      </div>

      <!-- Economic Data -->
      <div class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Datos Económicos del Beneficiario</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Ingreso</label>
            <p class="text-sm font-bold text-green-600">${{ formatCurrency(assessment.snapshot?.income) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Ocupación</label>
            <p class="text-sm">{{ assessment.snapshot?.occupation || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Escolaridad</label>
            <p class="text-sm">{{ getScholarshipText(assessment.snapshot?.scholarship) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Estado civil</label>
            <p class="text-sm">{{ getCivilStatusText(assessment.snapshot?.civilStatus) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Servicio médico</label>
            <p class="text-sm">{{ assessment.snapshot?.medicalService || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="mb-6" v-if="assessment.snapshot?.address">
        <h4 class="font-bold text-md mb-3 text-red-800">Domicilio</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Calle</label>
            <p class="text-sm">{{ assessment.snapshot.address.street || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Número exterior</label>
            <p class="text-sm">{{ assessment.snapshot.address.extNum || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Colonia</label>
            <p class="text-sm">{{ assessment.snapshot.address.neighborhood || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Delegación</label>
            <p class="text-sm">{{ assessment.snapshot.address.delegation || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Subdelegación</label>
            <p class="text-sm">{{ assessment.snapshot.address.subdelegation || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Código postal</label>
            <p class="text-sm">{{ assessment.snapshot.address.cp || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Spouse/Tutor -->
      <div class="mb-6" v-if="assessment.snapshot?.spouseOrTutor?.fullname">
        <h4 class="font-bold text-md mb-3 text-red-800">Cónyuge / Tutor</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Nombre completo</label>
            <p class="text-sm">{{ assessment.snapshot.spouseOrTutor.fullname }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Edad</label>
            <p class="text-sm">{{ assessment.snapshot.spouseOrTutor.age || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Teléfono</label>
            <p class="text-sm">{{ assessment.snapshot.spouseOrTutor.phone || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Trabajo</label>
            <p class="text-sm">{{ assessment.snapshot.spouseOrTutor.work || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Ingreso</label>
            <p class="text-sm font-bold text-green-600">${{ formatCurrency(assessment.snapshot.spouseOrTutor.income) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Parentesco</label>
            <p class="text-sm">{{ assessment.snapshot.spouseOrTutor.relationship || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Home Conditions -->
      <div class="mb-6" v-if="assessment.snapshot?.home">
        <h4 class="font-bold text-md mb-3 text-red-800">Condiciones de la Vivienda</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Tipo de vivienda</label>
            <p class="text-sm">{{ assessment.snapshot.home.type || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Número de cuartos</label>
            <p class="text-sm">{{ assessment.snapshot.home.roomNumber || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Pertenencia</label>
            <p class="text-sm">{{ assessment.snapshot.home.belonging || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Tipo de piso</label>
            <p class="text-sm">{{ assessment.snapshot.home.floorType || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Tipo de pared</label>
            <p class="text-sm">{{ assessment.snapshot.home.wallType || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Tipo de techo</label>
            <p class="text-sm">{{ assessment.snapshot.home.ceilingType || 'N/A' }}</p>
          </div>
        </div>

        <!-- Services -->
        <div class="mt-4">
          <label class="text-xs font-medium text-gray-600 block mb-2">Servicios disponibles</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveBathroom" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">Baño</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveToilet" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">Sanitario</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveDrainage" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">Drenaje</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveWaterService" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">Agua</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveElectricService" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">Electricidad</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveAirConditioning" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">Aire acondicionado</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="assessment.snapshot.home.haveTvService" disabled class="checkbox checkbox-xs" />
              <span class="text-xs">TV</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Expenses -->
      <div class="mb-6" v-if="assessment.snapshot?.expenses">
        <h4 class="font-bold text-md mb-3 text-red-800">Gastos del Hogar</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Transporte</label>
            <p class="text-sm font-bold text-red-600">${{ formatCurrency(assessment.snapshot.expenses.transport) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Alimentación</label>
            <p class="text-sm font-bold text-red-600">${{ formatCurrency(assessment.snapshot.expenses.meal) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">TV/Internet</label>
            <p class="text-sm font-bold text-red-600">${{ formatCurrency(assessment.snapshot.expenses.tvService) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Agua</label>
            <p class="text-sm font-bold text-red-600">${{ formatCurrency(assessment.snapshot.expenses.waterService) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Electricidad</label>
            <p class="text-sm font-bold text-red-600">${{ formatCurrency(assessment.snapshot.expenses.electricService) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Otros gastos</label>
            <p class="text-sm font-bold text-red-600">${{ formatCurrency(assessment.snapshot.expenses.otherExpenses) }}</p>
          </div>
        </div>
      </div>

      <!-- Family Members -->
      <div class="mb-6" v-if="assessment.snapshot?.familyMembers?.length">
        <h4 class="font-bold text-md mb-3 text-red-800">Integración Familiar</h4>
        <div class="overflow-x-auto">
          <table class="table table-xs">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Parentesco</th>
                <th>Escolaridad</th>
                <th>Ocupación</th>
                <th>Ingreso</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in assessment.snapshot.familyMembers" :key="index">
                <td>{{ member.name }} {{ member.lastname }}</td>
                <td>{{ member.age }}</td>
                <td>{{ member.sex }}</td>
                <td>{{ member.relationship }}</td>
                <td>{{ getScholarshipText(member.scholarship) }}</td>
                <td>{{ member.occupation || 'N/A' }}</td>
                <td class="font-bold text-green-600">${{ formatCurrency(member.income) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary -->
      <div class="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-bold text-md mb-3 text-red-800">Resumen Económico</h4>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Integrantes del hogar</label>
            <p class="text-xl font-bold">{{ assessment.snapshot?.householdSize || 0 }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Ingreso total</label>
            <p class="text-xl font-bold text-green-600">${{ formatCurrency(assessment.snapshot?.totalHouseholdIncome) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Gastos totales</label>
            <p class="text-xl font-bold text-red-600">${{ formatCurrency(assessment.snapshot?.totalHouseholdExpenses) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Balance</label>
            <p 
              class="text-xl font-bold"
              :class="getBalanceClass(assessment.snapshot?.totalHouseholdIncome, assessment.snapshot?.totalHouseholdExpenses)">
              ${{ formatCurrency((assessment.snapshot?.totalHouseholdIncome || 0) - (assessment.snapshot?.totalHouseholdExpenses || 0)) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="assessment.notes" class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Observaciones</h4>
        <div class="bg-yellow-50 p-4 rounded">
          <p class="text-sm">{{ assessment.notes }}</p>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useDate } from '@/utils/dateTool';
import civilStatus from '@/constants/civilStatus';
import scholarships from '@/constants/scholarships';

const { formatDate } = useDate();

const props = defineProps({
  assessment: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const detailsModalRef = ref(null);

// Mostrar/ocultar el modal cuando cambia la prop show
watch(() => props.show, (newValue) => {
  if (newValue) {
    nextTick(() => {
      detailsModalRef.value?.showModal();
    });
  } else {
    detailsModalRef.value?.close();
  }
}, { immediate: true });

// Manejar el cierre del diálogo nativo
const handleDialogClose = () => {
  emit('close');
};

const closeModal = () => {
  emit('close');
  detailsModalRef.value?.close();
};

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
