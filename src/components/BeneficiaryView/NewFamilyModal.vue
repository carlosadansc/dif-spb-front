<template>
  <dialog class="modal" ref="newFamilyModalRef">
    <div class="modal-box  w-full max-w-[40vw]">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>
      <h3 class="text-lg font-bold">Nuevo familiar</h3>
      <p class="text-sm text-gray-l1-color mt-2">
        Por favor, rellene los campos con los datos del apoyo que desea registrar. Recuerde que los datos
        obligatorios se encuentran marcados con un asterisco (*).
      </p>

      <div class="divider"></div>
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 required">Nombre</label>
          <input type="text" v-model="family.name" id="name" name="name" required
            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <!-- Apellido -->
        <div>
          <label for="lastname" class="block text-sm font-medium text-gray-700 required">Apellido</label>
          <input type="text" v-model="family.lastname" id="lastname" name="lastname" required
            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <!-- Edad -->
        <div>
          <label for="age" class="block text-sm font-medium text-gray-700 required">Edad</label>
          <input v-maska="'###'" v-model="family.age" id="age" type="number" required
            class="mt-1 p-2 input input-bordered w-full" />
        </div>

        <!-- Sexo -->
        <div class="flex flex-col">
          <label for="sex" class="block text-sm font-medium text-gray-700">Sexo</label>
          <div class="flex items-center gap-10 mt-2">
            <div class="flex items-center">
              <input type="radio" id="male" value="HOMBRE" v-model="family.sex" checked class="radio mt-1 p-2" />
              <label for="male" class="ml-2">Hombre</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="female" value="MUJER" v-model="family.sex" class="radio mt-1 p-2" />
              <label for="female" class="ml-2">Mujer</label>
            </div>
          </div>
        </div>

        <!-- Escolaridad -->
        <div>
          <label for="scholarship" class="block text-sm font-medium text-gray-700 required">Escolaridad</label>
          <div :class="{ error: v$.scholarship.$errors.length }">
            <select v-model="family.scholarship" id="scholarship" name="scholarship"
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

        <!-- Telefono -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 required">Teléfono</label>
          <div :class="{ error: v$.phone.$errors.length }">
            <input v-maska="'(###) ### ####'" type="text" id="phone" name="phone" v-model="family.phone"
              class="input input-bordered mt-2 w-full" />
            <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.phone.$errors"
              :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
        </div>

        <!-- Parentezco -->
        <div>
          <label for="relationship" class="block text-sm font-medium text-gray-700 required">Parentezco</label>
          <div :class="{ error: v$.relationship.$errors.length }">
            <select v-model="family.relationship" id="scholarship" name="relationship"
              class="select select-bordered mt-2 w-full">
              <option v-for="relationship in relationshipBySex" :key="relationship.value" :value="relationship.value">{{
        relationship.text }}</option>
            </select>
            <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.relationship.$errors"
              :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
        </div>

        <!-- Ocupacion -->
        <div>
          <label for="occupation" class="fblock text-sm font-medium text-gray-700 required">Ocupación</label>
          <div :class="{ error: v$.occupation.$errors.length }">
            <input v-model="family.occupation" id="occupation" type="text"
              class="mt-1 p-2 input input-bordered w-full" />
            <div class="font-bold text-xs text-red-500 input-errors" v-for="error of v$.occupation.$errors"
              :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
        </div>


        <!-- Ingreso -->
        <div>
          <label for="income" class="block text-sm font-medium text-gray-700 required">Ingresos</label>
          <input type="text" v-model="family.income" id="income" name="income" required
            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button type="submit" class="btn bg-red-900 text-white w-full">
            Guardar
            <span v-if="loading" class="spinner">Guardando...</span>
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import router from '@/router';
import { toast } from 'vue3-toastify'
import { AxiosError } from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import normalizeObjectText from '@/utils/normalizeObjectText'
import scholarships from '@/constants/scholarships'
import relationships from '@/constants/relationships'
import beneficiaryServices from '@/services/beneficiaryServices'

// composables
const { authHeader } = useAuth()

//props
const props = defineProps({
  showModal: Boolean,
  beneficiaryId: String,
})

//data

const family = ref({
  name: '',
  lastname: '',
  age: '',
  sex: 'HOMBRE',
  scholarship: '',
  phone: '',
  relationship: '',
  occupation: '',
  income: '',
})

const newFamilyModalRef = ref(null)
const loading = ref(false)

//emits
const emits = defineEmits(['close:modal', 'update:list'])

//watches
watch(
  () => props.showModal,
  (value) => {
    if (value) {
      newFamilyModalRef.value.showModal()
    } else {
      newFamilyModalRef.value.close()
    }
  }
)

//computed
const relationshipBySex = computed(() => relationships.filter((r) => r.sex === family.value.sex))

//methods
const closeModal = () => {
  emits('close:modal')
}

const updateList = () => {
  emits('update:list')
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
    const newFamily = normalizeObjectText(family.value)
    const response = await beneficiaryServices.createFamily(props.beneficiaryId, newFamily, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      console.log(response)
      toast.success('Registro creado exitosamente')
      updateList()
      closeModal()
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

//validations
const rules = {
  name: { required: helpers.withMessage('Campo requerido', required) },
  lastname: { required: helpers.withMessage('Campo requerido', required) },
  phone: { required: helpers.withMessage('Campo requerido', required) },
  scholarship: { required: helpers.withMessage('Campo requerido', required) },
  relationship: { required: helpers.withMessage('Campo requerido', required) },
  occupation: { required: helpers.withMessage('Campo requerido', required) },
}

const v$ = useVuelidate(rules, family)
</script>

<style lang="scss" scoped></style>