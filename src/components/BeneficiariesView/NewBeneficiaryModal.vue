<template>
  <dialog class="modal" ref="newBeneficiaryModalRef">
    <div class="modal-box  w-full max-w-[50vw]">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>
      <h3 class="text-lg font-bold">Nuevo beneficiario</h3>
      <p class="text-sm text-gray-l1-color mt-2">
        Por favor, rellene los campos con los datos del beneficiario que desea registrar. Recuerde que los datos
        obligatorios se encuentran marcados con un asterisco (*).
      </p>

      <div class="divider"></div>

      <form @submit.prevent="submitForm">

        <div class="flex flex-col mb-5">
          <label for="curp" class="font-semibold required">CURP</label>
          <div :class="{ error: v$.curp.$errors.length }">
            <input @blur="checkBeneficiaryExists()" @input="beneficiary.curp = beneficiary.curp.toUpperCase()"
              v-maska="'@@@@######@@@@@@**'" v-model="beneficiary.curp" id="name" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
            <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.curp.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
            <span class="font-bold text-xs text-red-800" v-if="beneficiaryExists">Este beneficiario ya existe <a
                @click="goTo(beneficiaryFinded._id)" class="underline">Ver perfil</a></span>
            <button class="btn-text text-[0.7rem] text-blue-800 underline font-bold" @click.prevent="generateCurp">Generar CURP (provisional)</button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5 mb-5">
          <div class="flex flex-col col-span-1">
            <label for="name" class="font-semibold mb-1 required">Nombre/s</label>
            <div :class="{ error: v$.name.$errors.length }">
              <input v-model="beneficiary.name" id="name" type="text" class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.name.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>


            <label for="fatherSurname" class="font-semibold mb-1 mt-5 required">Apellido paterno</label>
            <div :class="{ error: v$.fatherSurname.$errors.length }">
              <input v-model="beneficiary.fatherSurname" id="fatherSurname" type="text"
                class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.fatherSurname.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>

            <label for="motherSurname" class="font-semibold mb-1 mt-5">Apellido materno</label>
            <input v-model="beneficiary.motherSurname" id="motherSurname" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
          </div>

          <div class="flex flex-col col-span-1">
            <label for="birthdate" class="font-semibold mb-1 required">Fecha de nacimiento</label>
            <div :class="{ error: v$.birthdate.$errors.length }">
              <input v-model="beneficiary.birthdate" id="birthdate" type="date"
                class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.birthdate.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>

            <label for="age" class="font-semibold mb-1 mt-5">Edad</label>
            <input v-maska="'###'" v-model="beneficiary.age" id="age" type="number"
              class="mt-1 p-2 input input-bordered w-full" />

            <label for="birthplace" class="font-semibold mb-1 mt-5">Lugar de nacimiento</label>
            <input v-model="beneficiary.birthplace" id="birthplace" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
          </div>

        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label for="sex" class="font-semibold">Sexo</label>
            <div class="flex items-center gap-10 mt-2">
              <div class="flex items-center">
                <input type="radio" id="male" value="HOMBRE" v-model="beneficiary.sex" checked class="radio mt-1 p-2" />
                <label for="male" class="ml-2">Hombre</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="female" value="MUJER" v-model="beneficiary.sex" class="radio mt-1 p-2" />
                <label for="female" class="ml-2">Mujer</label>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="phone" class="font-semibold required">Teléfono</label>
            <div :class="{ error: v$.phone.$errors.length }">
              <input v-maska="'(###) ### ####'" type="text" id="phone" name="phone" v-model="beneficiary.phone"
                class="input input-bordered mt-2 w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.phone.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="occupation" class="font-semibold required">Ocupación</label>
            <div :class="{ error: v$.occupation.$errors.length }">
              <input v-model="beneficiary.occupation" id="occupation" type="text"
                class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.occupation.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="occupationDescription" class="font-semibold">Descripcón laboral</label>
            <input v-model="beneficiary.occupationDescription" id="occupationDescription" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-3 mt-10">
              <label for="hasDisability" class="font-semibold">¿Tiene alguna discapacidad?</label>
              <input type="checkbox" id="hasDisability" name="hasDisability" v-model="beneficiary.hasDisability"
                class="toggle" />
            </div>
          </div>

          <div class="flex flex-col">
            <label v-if="beneficiary.hasDisability" for="disabilityType" class="font-semibold">Tipo de
              discapacidad</label>
            <select v-if="beneficiary.hasDisability" v-model="beneficiary.disabilityType" id="disabilityType"
              name="disabilityType" class="select select-bordered mt-2 w-full">
              <option v-for="type in disabilityTypes" :key="type.value" :value="type.value">{{ type.text }}</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label for="medicalService" class="font-semibold required">Servicio médico</label>
            <div :class="{ error: v$.medicalService.$errors.length }">
              <select v-model="beneficiary.medicalService" id="medicalService" name="medicalService"
                class="select select-bordered mt-2 w-full">
                <option v-for="service in medicalServices" :key="service.value" :value="service.value">
                  {{ service.text }}
                </option>
              </select>
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.medicalService.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>

          </div>

          <div class="flex flex-col">
            <label for="civilStatus" class="font-semibold required">Estado civil</label>
            <div :class="{ error: v$.civilStatus.$errors.length }">
              <select v-model="beneficiary.civilStatus" id="civilStatus" name="civilStatus"
                class="select select-bordered mt-2 w-full">
                <option v-for="status in civilStatus" :key="status.value" :value="status.value">{{ status.text }}
                </option>
              </select>
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.civilStatus.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="scholarship" class="font-semibold required">Escolaridad</label>
            <div :class="{ error: v$.scholarship.$errors.length }">
              <select v-model="beneficiary.scholarship" id="scholarship" name="scholarship"
                class="select select-bordered mt-2 w-full">
                <option v-for="scholarship in scholarships" :key="scholarship.value" :value="scholarship.value">{{
                  scholarship.text }}</option>
              </select>
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.scholarship.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider divider-start my-10 text-xl font-bold">Datos de Domicilio</div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col col-span-2">
            <label for="communityType" class="font-semibold">Tipo de comunidad</label>
            <div class="flex items-center gap-10 mt-2">
              <div class="flex items-center">
                <input type="radio" id="rural" value="RURAL" v-model="beneficiary.address.communityType" checked
                  class="radio mt-1 p-2" />
                <label for="rural" class="ml-2">Rural</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="urbano" value="URBANA" v-model="beneficiary.address.communityType"
                  class="radio mt-1 p-2" />
                <label for="urbano" class="ml-2">Urbana</label>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="delegation" class="font-semibold required">Delegación</label>
            <div :class="{ error: v$.address.delegation.$errors.length }">
              <select v-model="beneficiary.address.delegation" id="delegation" name="delegation"
                class="select select-bordered mt-2 w-full" @change="getSubDelegations()">
                <option v-for="delegation in delegations" :key="delegation.value" :value="delegation">{{ delegation.text
                  }}</option>
              </select>
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.address.delegation.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="subdelegation" class="font-semibold required">Subdelegación</label>
            <div :class="{ error: v$.address.subdelegation.$errors.length }">
              <select v-model="beneficiary.address.subdelegation" id="subdelegation" name="subdelegation"
                class="select select-bordered mt-2 w-full">
                <option v-for="subdelegation in subdelegations" :key="subdelegation.value" :value="subdelegation.value">
                  {{
        subdelegation.text }}</option>
              </select>
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.address.subdelegation.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>


          <div class="flex flex-col">
            <label for="street" class="font-semibold required">Calle</label>
            <div :class="{ error: v$.address.street.$errors.length }">
              <input v-model="beneficiary.address.street" id="street" type="text"
                class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.address.street.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="sideStreets" class="font-semibold">Entre calles</label>
            <input v-model="beneficiary.address.sideStreets" id="sideStreets" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
          </div>

          <div class="flex flex-col">
            <label for="extNum" class="font-semibold required">Número exterior</label>
            <div :class="{ error: v$.address.extNum.$errors.length }">
              <input v-model="beneficiary.address.extNum" id="extNum" type="text"
                class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.address.extNum.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="intNum" class="font-semibold">Número interior</label>
            <input v-model="beneficiary.address.intNum" id="intNum" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
          </div>

          <div class="flex flex-col">
            <label for="cp" class="font-semibold required">Código postal</label>
            <div :class="{ error: v$.address.cp.$errors.length }">
              <input v-maska="'#####'" v-model="beneficiary.address.cp" id="cp" type="text"
                class="mt-1 p-2 input input-bordered w-full" />
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.address.cp.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="neighborhood" class="font-semibold required">Colonia</label>
            <div :class="{ error: v$.address.neighborhood.$errors.length }">
              <input v-model="beneficiary.address.neighborhood" list="neighborhoods" name="neighborhood"
                id="neighborhood" class="mt-1 p-2 input input-bordered w-full">
              <datalist id="neighborhoods">
                <option v-for="neighborhood in foundNeighborhoods" :key="neighborhood.nombre"
                  :value="neighborhood.nombre" />
              </datalist>
              <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.address.neighborhood.$errors"
                :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="city" class="font-semibold">Ciudad</label>
            <input v-model="beneficiary.address.city" id="city" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 items-center mt-10">
          <div class="flex flex-col">
            <button class="btn" @click.prevent="closeModal">Cancelar</button>
          </div>
          <div class="flex flex-col">
            <button class="btn bg-red-800 text-white" @click.prevent="submitForm">{{ !loading ? 'Guardar' : 'Guardando'
              }} <span v-if="loading" class="loading loadign-spinner" /></button>
          </div>
        </div>

      </form>
    </div>
  </dialog>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { toast } from 'vue3-toastify';
import beneficiaryServices from '../../services/beneficiaryServices'
import normalizeObjectText from '../../utilities/normalizeObjectText'
import disabilityTypes from '../../constants/disabilityTypes'
import medicalServices from '../../constants/medicalServices'
import civilStatus from '../../constants/civilStatus'
import scholarships from '../../constants/scholarships'
import delegations from '../../constants/delegations'
import neighborhoods from '../../constants/neighborhoods'
import calculateAge from '../../utilities/calcBirthdate'
import { useAuth } from '../../composables/useAuth';
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import router from '../../router'
import { AxiosError } from 'axios'

//props
const props = defineProps({
  showModal: Boolean,
})

//emits
const emits = defineEmits(['close:modal', 'refresh:beneficiaries'])

//data
const newBeneficiaryModalRef = ref()
const subdelegations = ref([])
const loading = ref(false)
const beneficiaryExists = ref(false)
const beneficiary = reactive({
  name: '',
  fatherSurname: '',
  motherSurname: '',
  age: null,
  birthdate: '',
  birthplace: '',
  sex: 'HOMBRE',
  curp: '',
  phone: '',
  hasDisability: false,
  disabilityType: '',
  medicalService: '',
  civilStatus: '',
  scholarship: '',
  occupation: '',
  occupationDescription: '',
  address: {
    communityType: 'RURAL',
    delegation: '',
    subdelegation: '',
    street: '',
    sideStreets: '',
    extNum: '',
    intNum: '',
    neighborhood: '',
    cp: '',
    city: 'La Paz'
  }
})
const beneficiaryFinded = ref({});

//watches
watch(
  () => props.showModal,
  (value) => {
    if (value) {
      newBeneficiaryModalRef.value.showModal()
    } else {
      newBeneficiaryModalRef.value.close()
    }
  }
)

watch(() => beneficiary.birthdate, (value) => {
  beneficiary.age = calculateAge(value)
})

//computed
const foundNeighborhoods = computed(() => {
  return neighborhoods.filter(neighborhood => neighborhood.cp.toString().toLowerCase() === beneficiary.address.cp.toString().toLowerCase())
})

// composables
const { authHeader } = useAuth()

//methods

const checkBeneficiaryExists = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.checkBeneficiaryExistsByCurp(beneficiary.curp, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      if (response.data) {
        beneficiaryFinded.value = response.data
        beneficiaryExists.value = true
      } else {
        beneficiaryExists.value = false
      }
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
    beneficiaryExists.value = false
  } finally {
    loading.value = false
  }
}

const generateCurp = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.generateProvisionalCurp(authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiary.curp = response.data
      console.log(response.data)
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

const getSubDelegations = () => {
  subdelegations.value = beneficiary.address.delegation.subdelegations
}

const closeModal = () => {
  emits('refresh:beneficiaries')
  emits('close:modal')
}

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate()
  console.log(v$.value.$errors)
  if (!isFormCorrect) {
    toast.error('Revise que todos los campos sean correctos')
    return
  }

  loading.value = true
  try {
    const delegation = beneficiary.address.delegation.value
    beneficiary.address.delegation = delegation
    const newBeneficiary = normalizeObjectText(beneficiary)
    await beneficiaryServices.createBeneficiary(newBeneficiary, authHeader.value)
    toast.success('Registro creado exitosamente')
    closeModal()

  } catch (err) {
    console.log(err)
    if (err instanceof AxiosError) {
      err.response?.data?.errors.forEach(error => {
        if(error.code === 'ERR0007')
      {
        toast.error('El CURP ya se encuentra registrado')
      }
      else
      {
        toast.error(error.description)
      }
      })
    } else {
      toast.error(err)
    }
  } finally {
    loading.value = false
  }
}

const curpFormat = helpers.regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/)

const goTo = (beneficiaryId) => {
  router.push(`/beneficiaries/${beneficiaryId}`)
}

const rules = {
  name: { required: helpers.withMessage('Campo requerido', required) },
  fatherSurname: { required: helpers.withMessage('Campo requerido', required) },
  birthdate: { required: helpers.withMessage('Campo requerido', required) },
  curp: { format: helpers.withMessage('El formato del CURP no válido', curpFormat), required: helpers.withMessage('Campo requerido', required) },
  phone: { required: helpers.withMessage('Campo requerido', required) },
  medicalService: { required: helpers.withMessage('Campo requerido', required) },
  civilStatus: { required: helpers.withMessage('Campo requerido', required) },
  scholarship: { required: helpers.withMessage('Campo requerido', required) },
  occupation: { required: helpers.withMessage('Campo requerido', required) },
  address: {
    delegation: { required: helpers.withMessage('Campo requerido', required) },
    subdelegation: { required: helpers.withMessage('Campo requerido', required) },
    street: { required: helpers.withMessage('Campo requerido', required) },
    extNum: { required: helpers.withMessage('Campo requerido', required) },
    neighborhood: { required: helpers.withMessage('Campo requerido', required) },
    cp: { required: helpers.withMessage('Campo requerido', required) },
  }
}


const v$ = useVuelidate(rules, beneficiary)

</script>

<style lang="scss" scoped></style>
