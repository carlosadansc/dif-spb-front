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
          <label for="curp" class="font-semibold">CURP</label>
          <input v-model="beneficiary.curp" id="name" type="text" class="mt-1 p-2 input input-bordered" />
        </div>

        <div class="grid grid-cols-2 gap-5 mb-5">

          <div class="flex flex-col col-span-1">
            <label for="name" class="font-semibold mb-1">Nombre/s</label>
            <input v-model="beneficiary.name" id="name" type="text" class="mt-1 p-2 input input-bordered" />

            <label for="fatherSurname" class="font-semibold mb-1 mt-5">Apellido paterno</label>
            <input v-model="beneficiary.fatherSurname" id="fatherSurname" type="text"
              class="mt-1 p-2 input input-bordered" />

            <label for="motherSurname" class="font-semibold mb-1 mt-5">Apellido materno</label>
            <input v-model="beneficiary.motherSurname" id="motherSurname" type="text"
              class="mt-1 p-2 input input-bordered" />
          </div>

          <div class="flex flex-col col-span-1">
            <label for="birthdate" class="font-semibold mb-1">Fecha de nacimiento</label>
            <input v-model="beneficiary.birthdate" id="birthdate" type="date" class="mt-1 p-2 input input-bordered" />

            <label for="age" class="font-semibold mb-1 mt-5">Edad</label>
            <input v-model="beneficiary.age" id="age" type="number" class="mt-1 p-2 input input-bordered" />

            <label for="birthplace" class="font-semibold mb-1 mt-5">Lugar de nacimiento</label>
            <input v-model="beneficiary.birthplace" id="birthplace" type="text" class="mt-1 p-2 input input-bordered" />
          </div>

        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label for="sex" class="font-semibold">Sexo</label>
            <div class="flex items-center gap-10 mt-2">
              <div class="flex items-center">
                <input type="radio" id="male" value="MALE" v-model="beneficiary.sex" checked class="radio mt-1 p-2" />
                <label for="male" class="ml-2">Hombre</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="female" value="FEMALE" v-model="beneficiary.sex" class="radio mt-1 p-2" />
                <label for="female" class="ml-2">Mujer</label>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <label for="phone" class="font-semibold">Teléfono</label>
            <input type="text" id="phone" name="phone" v-model="beneficiary.phone" class="input input-bordered mt-2" />
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-3 mt-10">
              <label for="hasDisability" class="font-semibold">Tiene alguna discapacidad</label>
              <input type="checkbox" id="hasDisability" name="hasDisability" v-model="beneficiary.hasDisability"
                class="toggle" />
            </div>
          </div>

          <div class="flex flex-col">
            <label for="disabilityType" class="font-semibold">Tipo de discapacidad</label>
            <select v-model="beneficiary.disabilityType" id="disabilityType" name="disabilityType"
              class="select select-bordered mt-2">
              <option v-for="type in disabilityTypes" :key="type.value" :value="type.value">{{ type.text }}</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label for="medicalService" class="font-semibold">Servicio médico</label>
            <select v-model="beneficiary.medicalService" id="medicalService" name="medicalService"
              class="select select-bordered mt-2">
              <option v-for="service in medicalServices" :key="service.value" :value="service.value">{{ service.text }}
              </option>
            </select>
          </div>

          <div class="flex flex-col">
            <label for="civilStatus" class="font-semibold">Estado civil</label>
            <select v-model="beneficiary.civilStatus" id="civilStatus" name="civilStatus"
              class="select select-bordered mt-2">
              <option v-for="status in civilStatus" :key="status.value" :value="status.value">{{ status.text }}</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label for="scholarship" class="font-semibold">Escolaridad</label>
            <select v-model="beneficiary.scholarship" id="scholarship" name="scholarship"
              class="select select-bordered mt-2">
              <option v-for="scholarship in scholarships" :key="scholarship.value" :value="scholarship.value">{{
                scholarship.text }}</option>
            </select>
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
                <input type="radio" id="urbano" value="URBANO" v-model="beneficiary.address.communityType"
                  class="radio mt-1 p-2" />
                <label for="urbano" class="ml-2">Urbano</label>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="delegation" class="font-semibold">Delegación</label>
            <select v-model="beneficiary.address.delegation" id="delegation" name="delegation"
              class="select select-bordered mt-2" @change="getSubDelegations()">
              <option v-for="delegation in delegations" :key="delegation.value" :value="delegation">{{ delegation.text
                }}</option>
            </select>
          </div>
          <div class="flex flex-col">
            <label for="subdelegation" class="font-semibold">Subdelegación</label>
            <select v-model="beneficiary.address.subdelegation" id="subdelegation" name="subdelegation"
              class="select select-bordered mt-2">
              <option v-for="subdelegation in subdelegations" :key="subdelegation.value" :value="subdelegation.value">{{
                subdelegation.text }}</option>
            </select>
          </div>
          <div class="flex flex-col">
            <label for="street" class="font-semibold">Calle</label>
            <input v-model="beneficiary.address.street" id="street" type="text" class="mt-1 p-2 input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="sideStreets" class="font-semibold">Entre calles</label>
            <input v-model="beneficiary.address.sideStreets" id="sideStreets" type="text"
              class="mt-1 p-2 input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="extNumb" class="font-semibold">Número exterior</label>
            <input v-model="beneficiary.address.extNumb" id="extNumb" type="text"
              class="mt-1 p-2 input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="intNumb" class="font-semibold">Número interior</label>
            <input v-model="beneficiary.address.intNumb" id="intNumb" type="text"
              class="mt-1 p-2 input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="neighborhood" class="font-semibold">Colonia</label>
            <input v-model="beneficiary.address.neighborhood" id="neighborhood" type="text"
              class="mt-1 p-2 input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="cp" class="font-semibold">Código postal</label>
            <input v-model="beneficiary.address.cp" id="cp" type="number" class="mt-1 p-2 input input-bordered" />
          </div>
          <div class="flex flex-col">
            <label for="city" class="font-semibold">Ciudad</label>
            <input v-model="beneficiary.address.city" id="city" type="text" class="mt-1 p-2 input input-bordered" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 items-center mt-10">
          <div class="flex flex-col">
            <button class="btn" @click.prevent="closeModal">Cancelar</button>
          </div>
          <div class="flex flex-col">
            <button class="btn bg-red-800 text-white" @click.prevent="submitForm">{{ !loading ? 'Guardar' : 'Guardando' }} <span
                v-if="loading" class="loading loadign-spinner" /></button>
          </div>
        </div>

      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify';
import beneficiaryServices from '../../services/beneficiaryServices'
import normalizeObjectText from '../../utilities/normalizeObjectText'
import disabilityTypes from '../../constants/disabilityTypes'
import medicalServices from '../../constants/medicalServices'
import civilStatus from '../../constants/civilStatus'
import scholarships from '../../constants/scholarships'
import delegations from '../../constants/delegations'
import { useAuth } from '../../composables/useAuth';
//props
const props = defineProps({
  showModal: Boolean,
})

//emits
const emits = defineEmits(['close:modal'])

//data
const newBeneficiaryModalRef = ref()
const subdelegations = ref([])
const loading = ref(false)
const beneficiary = ref({
  name: '',
  fatherSurname: '',
  motherSurname: '',
  age: null,
  birthdate: '',
  birthplace: '',
  sex: '',
  curp: '',
  phone: '',
  hasDisability: false,
  disabilityType: '',
  medicalService: '',
  civilStatus: '',
  scholarship: '',
  address: {
    communityType: '',
    delegation: '',
    subdelegation: '',
    street: '',
    sideStreets: '',
    extNumb: '',
    intNumb: '',
    neighborhood: '',
    cp: '',
    city: ''
  }
})


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

// composables
const { authHeader } = useAuth()

//methods
const getSubDelegations = () => {
  subdelegations.value = beneficiary.value.address.delegation.subdelegations
}

const closeModal = () => {
  emits('close:modal')
}

const submitForm = async () => {
  loading.value = true
  try {
    const delegation = beneficiary.value.address.delegation.value
    beneficiary.value.address.delegation = delegation
    const response = await beneficiaryServices.createBeneficiary(normalizeObjectText(beneficiary.value), authHeader.value)
    if (response.status === 200) {
      toast.success('Registro creado exitosamente')
      closeModal()
    } else {
      toast.error(response.response.data.errors[0].title)
    }
  } catch (err) {
    toast.error(err)
  }
  loading.value = false
}
</script>

<style lang="scss" scoped></style>
