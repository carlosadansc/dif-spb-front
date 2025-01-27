<template>
  <span v-if="loading" class="loading loading-spinner loading-lg"></span>
  <div v-else class="px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">

      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 mt-5"><span class="bg-white py-2 px-4 rounded-[10px] border border-gray-400">{{beneficiary.name + ' ' + beneficiary.fatherSurname + ' ' + beneficiary.motherSurname}}</span></h1>
        
        <div>
          <button @click="toggleEditMode" id="edit-save" class="btn btn-square bg-red-800 font-black text-white mx-1"><IconEdit v-if="!isEditing" class="h-5 w-5" /> <IconDeviceFloppy v-else class="h-5 w-5" /></button>
          <button class="btn btn-square bg-gray-500 font-black text-white mx-1"><IconPrinter class="h-5 w-5" /></button>
        </div>
      </div>
     
     
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
            :class="[activeSection === section.id ? 'after:w-11/12 after:h-1 after:absolute after:-bottom-1 after:bg-red-800 after:rounded-full' : '']">
            <button 
              class="btn btn-ghost border-b-transparent text-gray-500 hover:bg-transparent hover:scale-105 hover:text-gray-700 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              @click="activeSection = section.id">
              {{ section.title }}
            </button>
          </div>
        </nav>
      </div>

      <!-- Content Sections -->
      <div class="mt-6 bg-white border border-gray-400 rounded-lg p-6">
        <!-- General Information -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">CURP</label>
              <input :disabled="!isEditing" v-maska="'@@@@######@@@@@@**'" type="text" v-model="beneficiary.curp"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.name"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Paterno</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.fatherSurname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido Materno</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.motherSurname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad</label>
              <input :disabled="!isEditing" v-maska="'###'" type="number" v-model="beneficiary.age"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input :disabled="!isEditing" type="text" v-model="formattedBirthdate" @blur="updateBirthdate"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lugar de Nacimiento</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.birthplace"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Sexo</label>
              <select :disabled="!isEditing" v-model="beneficiary.sex"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input :disabled="!isEditing" v-maska="'(###) ### ####'" type="tel" v-model="beneficiary.phone"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado Civil</label>
              <select :disabled="!isEditing" v-model="beneficiary.civilStatus"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CASADO">Casado</option>
                <option value="SOLTERO">Soltero</option>
                <option value="VIUDO">Viudo</option>
                <option value="UNION_LIBRE">Unión Libre</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Escolaridad</label>
              <select :disabled="!isEditing" v-model="beneficiary.scholarship"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="scholarship in scholarships" :key="scholarship.id" :value="scholarship.value">
                  {{ scholarship.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.hasDisability"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">¿Tiene alguna discapacidad?</label>
            </div>
            <div v-if="beneficiary.hasDisability">
              <label class="block text-sm font-medium text-gray-700">Tipo de Discapacidad</label>
              <select :disabled="!isEditing" v-model="beneficiary.disabilityType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
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
              <select :disabled="!isEditing" v-model="beneficiary.address.communityType"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="RURAL">Rural</option>
                <option value="URBANA">Urbana</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Delegación</label>
              <select :disabled="!isEditing" name="delegation" v-model="beneficiary.address.delegation"
              @change="getSubdelegations()"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="delegation in delegations" :key="delegation.id" :value="delegation.value">
                  {{ delegation.text }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Subdelegación</label>
              <select :disabled="!isEditing" name="subdelegation" v-model="beneficiary.address.subdelegation"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="subdelegation in subdelegations" :key="subdelegation.text" :value="subdelegation.value">
                  {{ subdelegation.text }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Calle</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.street"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Calles Laterales</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.sideStreets"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Exterior</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.extNum"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número Interior</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.intNum"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Colonia</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.neighborhood"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Código Postal</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.address.cp"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ciudad</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.address.city"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Spouse/Tutor -->
        <div v-if="activeSection === 'spouse'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.spouseOrTutor.fullname"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.spouseOrTutor.age"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input :disabled="!isEditing" v-maska="'(###) ### ####'" type="tel" v-model="beneficiary.spouseOrTutor.phone"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Trabajo</label>
              <input :disabled="!isEditing" type="text" v-model="beneficiary.spouseOrTutor.work"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingresos</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.spouseOrTutor.income"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Relación</label>
              <select :disabled="!isEditing" v-model="beneficiary.spouseOrTutor.relationship"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="SPOUSE">Cónyuge</option>
                <option value="TUTOR">Tutor</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Comentarios</label>
              <textarea :disabled="!isEditing" v-model="beneficiary.spouseOrTutor.comments" rows="3"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>
        </div>

        <!-- Home -->
        <div v-if="activeSection === 'home'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Vivienda</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.type"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="CASA">Casa</option>
                <option value="DEPARTAMENTO">Departamento</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número de Habitaciones</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.home.roomNumber"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Pertenencia</label>
              <select :disabled="!isEditing" v-model="beneficiary.home.belonging"
                class="select select-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="PROPIA">Propia</option>
                <option value="RENTA">Renta</option>
                <option value="HIPOTECADA">Hipotecada</option>
                <option value="PRESTADA">Prestada</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveBathroom"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Baño</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveToilet"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Sanitario</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveDrainage"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Drenaje</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveSepticTank"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Fosa Séptica</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveWaterService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio de Agua</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveElectricService"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Servicio Eléctrico</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveAirConditioning"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Aire Acondicionado</label>
            </div>
            <div class="flex items-center">
              <input :disabled="!isEditing" type="checkbox" v-model="beneficiary.home.haveTvService"
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
              <input :disabled="!isEditing" type="number" v-model="beneficiary.income"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Transporte / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.transport"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Alimentación / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.meal"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio de TV / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.tvService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio de Agua / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.waterService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gastos de Servicio Eléctrico / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.electricService"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Otros Gastos / mes</label>
              <input :disabled="!isEditing" type="number" v-model="beneficiary.expenses.otherExpenses"
                class="input input-sm mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Contributions -->
        <div v-if="activeSection === 'contributions'" class="space-y-6">
          <ContributionHistory :contributions="beneficiary.contributions" @update:list="getBeneficiary" />
        </div>
      </div>

      <ProfilePDF />
    </div>
  </div>
</template>

<script setup>
import router from '../router';
import { ref, onMounted, watch } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import { IconArrowNarrowLeft, IconEdit, IconPrinter, IconDeviceFloppy } from '@tabler/icons-vue';
import beneficiaryServices from '../services/beneficiaryServices';
import ContributionHistory from '@/components/BeneficiaryView/ContributionHistory.vue';
import ProfilePDF from '../components/BeneficiaryView/ProfilePDF.vue';
import { useAuth } from '../composables/useAuth';
// import { useRouter } from 'vue-router';
import scholarships from '../constants/scholarships';
import disabilityTypes from '../constants/disabilityTypes';
import delegations from '../constants/delegations';
import formatDate from '../utilities/formatDate';
import normalizeObjectText from '../utilities/normalizeObjectText';

//data
const beneficiaryId = router.currentRoute.value.params.id;
const beneficiary = ref({
  name: '',
  fatherSurname: '',
  motherSurname: '',
  age: 0,
  birthdate: new Date(),
  birthplace: '',
  sex: 'HOMBRE',
  curp: '',
  phone: '',
  hasDisability: false,
  address: {
    communityType: 'RURAL',
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
const isEditing = ref(false)
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
// const composableRouter = useRouter()


//methods

const getBeneficiary = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.getBeneficiary(beneficiaryId, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiary.value = {
        ...beneficiary.value,
        ...response.data,
        spouseOrTutor: {
          ...beneficiary.value.spouseOrTutor,
          ...response.data.spouseOrTutor
        }
      }
      getSubdelegations()
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
  subdelegations.value = delegations.find(delegation => delegation.value === beneficiary.value.address.delegation).subdelegations
}

const toggleEditMode = () => {
  if (isEditing.value) {
    updateBeneficiary()
  } else {
    isEditing.value = !isEditing.value;
  }
}

const updateBeneficiary = async () => {
  loading.value = true
  try {
    const payload =  {
      filter: beneficiaryId,
      update: normalizeObjectText(beneficiary.value)
    }
    const response = await beneficiaryServices.updateBeneficiary(payload, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      toast.success('Beneficiario actualizado correctamente')
      getBeneficiary()
      isEditing.value = !isEditing.value;
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

//Formatted birthdate
const formattedBirthdate = ref(formatDate(beneficiary.value.birthdate));

watch(() => beneficiary.value.birthdate, (newDate) => {
  formattedBirthdate.value = formatDate(newDate);
});

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  if (!day || !month || !year) {
    throw new Error('Invalid date format');
  }
  return new Date(year, month - 1, day);
}

const updateBirthdate = () => {
  beneficiary.value.birthdate = parseDate(formattedBirthdate.value);
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