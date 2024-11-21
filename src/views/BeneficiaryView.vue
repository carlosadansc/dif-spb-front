<template>
  <span v-if="loading" class="loading loading-spinner loading-lg"></span>
  <div v-else class="px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mt-5"><span class="bg-white py-2 px-4 rounded-[10px] shadow-sm">{{beneficiary.name + ' ' + beneficiary.fatherSurname + ' ' + beneficiary.motherSurname}}</span></h1>
      <!-- Navigation Tabs -->
      <div class="mt-4">
        <nav class="-mb-px flex space-x-4" aria-label="Tabs">
          <button class="btn btn-square btn-ghost" @click="goBack">
            <IconArrowNarrowLeft class="w-6 h-6" />
          </button>
          <div
            v-for="section in sections"
            :key="section.id"
            class="flex flex-col justify-center items-center relative"
            :class="[
              activeSection === section.id ? 'after:w-11/12 after:h-1 after:absolute after:-bottom-1 after:bg-red-800 after:rounded-full' : ''
            ]"
          >
            <button 
              class="btn btn-ghost border-b-transparent text-gray-500 hover:bg-transparent hover:scale-105 hover:text-gray-700 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              @click="activeSection = section.id"
            >
              {{ section.title }}
            </button>
          </div>
        </nav>
      </div>

      <!-- Content Sections -->
      <div class="mt-6 bg-white shadow rounded-lg p-6">
        <!-- General Information -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" v-model="beneficiary.name"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Paterno</label>
              <input type="text" v-model="beneficiary.fatherSurname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Materno</label>
              <input type="text" v-model="beneficiary.motherSurname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad</label>
              <input type="number" v-model="beneficiary.age"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input type="date" v-model="beneficiary.birthdate"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lugar de Nacimiento</label>
              <input type="text" v-model="beneficiary.birthplace"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CURP</label>
              <input type="text" v-model="beneficiary.curp"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Sexo</label>
              <select v-model="beneficiary.sex"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option :value="beneficiary.sex">{{beneficiary.sex}}</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="tel" v-model="beneficiary.phone"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado Civil</label>
              <select v-model="beneficiary.civilStatus"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CASADO">Casado</option>
                <option value="SOLTERO">Soltero</option>
                <option value="VIUDO">Viudo</option>
                <option value="UNION_LIBRE">Unión Libre</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Escolaridad</label>
              <select v-model="beneficiary.scholarship"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="scholarship in scholarships" :key="scholarship.id" :value="scholarship.value">
                  {{ scholarship.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.hasDisability"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">¿Tiene alguna discapacidad?</label>
            </div>
            <div v-if="beneficiary.hasDisability">
              <label class="block text-sm font-medium text-gray-700">Tipo de Discapacidad</label>
              <select v-model="beneficiary.disabilityType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="disabilityType in disabilityTypes" :key="disabilityType.id" :value="disabilityType.value">
                  {{ disabilityType.text }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div v-if="activeSection === 'address'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Comunidad</label>
              <select v-model="beneficiary.address.communityType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="RURAL">Rural</option>
                <option value="URBANA">Urbana</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Delegación</label>
              <select name="delegation" v-model="beneficiary.address.delegation"
              @change="getSubdelegations()"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="delegation in delegations" :key="delegation.id" :value="delegation">
                  {{ delegation.text }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Subdelegación</label>
              <select name="subdelegation" v-model="beneficiary.address.subdelegation"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="subdelegation in subdelegations" :key="subdelegation.id" :value="subdelegation.value">
                  {{ subdelegation.text }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Calle</label>
              <input type="text" v-model="beneficiary.address.street"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Calles Laterales</label>
              <input type="text" v-model="beneficiary.address.sideStreets"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Exterior</label>
              <input type="text" v-model="beneficiary.address.extNum"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Interior</label>
              <input type="text" v-model="beneficiary.address.intNum"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Colonia</label>
              <input type="text" v-model="beneficiary.address.neighborhood"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Código Postal</label>
              <input type="number" v-model="beneficiary.address.cp"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ciudad</label>
              <input type="text" v-model="beneficiary.address.city"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Spouse/Tutor -->
        <div v-if="activeSection === 'spouse'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input type="text" v-model="beneficiary.spouseOrTutor.fullname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad</label>
              <input type="number" v-model="beneficiary.spouseOrTutor.age"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="tel" v-model="beneficiary.spouseOrTutor.phone"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Trabajo</label>
              <input type="text" v-model="beneficiary.spouseOrTutor.work"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingresos</label>
              <input type="number" v-model="beneficiary.spouseOrTutor.income"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Relación</label>
              <select v-model="beneficiary.spouseOrTutor.relationship"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="SPOUSE">Cónyuge</option>
                <option value="TUTOR">Tutor</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Comentarios</label>
              <textarea v-model="beneficiary.spouseOrTutor.comments" rows="3"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>
        </div>

        <!-- Home -->
        <div v-if="activeSection === 'home'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Vivienda</label>
              <select v-model="beneficiary.home.type"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CASA">Casa</option>
                <option value="DEPARTAMENTO">Departamento</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número de Habitaciones</label>
              <input type="number" v-model="beneficiary.home.roomNumber"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Pertenencia</label>
              <select v-model="beneficiary.home.belonging"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="PROPIA">Propia</option>
                <option value="RENTA">Renta</option>
                <option value="HIPOTECADA">Hipotecada</option>
                <option value="PRESTADA">Prestada</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveBathroom"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Baño</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveToilet"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Sanitario</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveDrainage"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Drenaje</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveSepticTank"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Fosa Séptica</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveWaterService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio de Agua</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveElectricService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio Eléctrico</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveAirConditioning"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Aire Acondicionado</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="beneficiary.home.haveTvService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio de TV</label>
            </div>
          </div>
        </div>

        <!-- Expenses -->
        <div v-if="activeSection === 'expenses'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingresos / mes</label>
              <input type="number" v-model="beneficiary.income"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Transporte / mes</label>
              <input type="number" v-model="beneficiary.expenses.transport"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Alimentación / mes</label>
              <input type="number" v-model="beneficiary.expenses.meal"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio de TV / mes</label>
              <input type="number" v-model="beneficiary.expenses.tvService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio de Agua / mes</label>
              <input type="number" v-model="beneficiary.expenses.waterService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio Eléctrico / mes</label>
              <input type="number" v-model="beneficiary.expenses.electricService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Otros Gastos / mes</label>
              <input type="number" v-model="beneficiary.expenses.otherExpenses"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Contributions -->
        <div v-if="activeSection === 'contributions'" class="space-y-6">
          <ContributionHistory :contributions="beneficiary.contributions" @update:list="getBeneficiary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '../router';
import { ref, onMounted } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import { IconArrowNarrowLeft } from '@tabler/icons-vue';
import beneficiaryServices from '../services/beneficiaryServices';
import ContributionHistory from '@/components/BeneficiaryView/ContributionHistory.vue';
import { useAuth } from '../composables/useAuth';
import scholarships from '../constants/scholarships';
import disabilityTypes from '../constants/disabilityTypes';
import delegations from '../constants/delegations';

//data
const beneficiaryId = router.currentRoute.value.params.id;
const beneficiary = ref({
  name: '',
  fatherSurname: '',
  motherSurname: '',
  age: 0,
  birthdate: '',
  birthplace: '',
  sex: 'HOMBRE',
  curp: '',
  phone: '',
  hasDisability: false,
  address: {
    communityType: '',
    delegation: '',
    subdelegation: '',
    street: '',
    sideStreets: '',
    extNum: '',
    intNum: '',
    neighborhood: '',
    cp: 0,
    city: ''
  },
  spouseOrTutor: {
    fullname: '',
    age: 0,
    phone: '',
    work: '',
    income: 0,
    comments: '',
    relationship: ''
  },
  home: {
    type: 'CASA',
    roomNumber: 0,
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
  }
})
const subdelegations = ref([])
const loading = ref(false)
const activeSection = ref('general')
const sections = [
  { title: 'Información General', id: 'general' },
  { title: 'Dirección', id: 'address' },
  { title: 'Datos del Cónyuge/Tutor', id: 'spouse' },
  { title: 'Vivienda', id: 'home' },
  { title: 'Situación económica', id: 'expenses' },
  { title: 'Historial de apoyos', id: 'contributions' }
]

// composables
const { authHeader } = useAuth()

//methods
const getBeneficiary = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.getBeneficiary(beneficiaryId, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiary.value = response.data
      console.log(beneficiary.value)
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

const getSubdelegations = async () => {
  subdelegations.value = beneficiary.value.address.delegation.subdelegations
}

onMounted(() => {
  getBeneficiary()
})

const goBack = () => {
  router.go(-1)
}

</script>

<style scoped>

</style>