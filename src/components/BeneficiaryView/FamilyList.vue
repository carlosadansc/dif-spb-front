<template>
  <div>

    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="section-heading"><IconUsersGroup class="section-heading-icon" /> Integración familiar</h2>
        <p class="mt-1 text-sm text-gray-600">Personas que integran el hogar del beneficiario.</p>
      </div>
      <button @click.prevent="showModal = true" 
      class="btn btn-brand min-h-11" aria-label="Agregar integrante familiar"><IconUserPlus class="h-5 w-5" />Agregar integrante</button>
    </div>

    <EasyDataTable v-model:server-options="serverOptions" :server-items-length="serverItemsLength" :headers="headers"
      :items="familyData" :rows-items="rowsItems" :loading="loading" rows-per-page-message="Se muestran" alternating>

      <template #item-name="{ name, lastname }">
          {{ name + ' ' + lastname }}
      </template>

      <template v-if="isAdmin" #item-profile="{ _id: id }">
        <div class="tooltip tooltip-left" data-tip="Eliminar">
          <button class="btn btn-square btn-sm my-2 mx-auto text-red-800" aria-label="Eliminar integrante familiar" @click="deleteFamily(id)">
            <IconTrash class="h-5 w-5" />
          </button>
        </div>
      </template>

      <template #empty-message>
        <div class="py-8 text-center text-sm text-gray-600">No hay familiares registrados.</div>
      </template>
    </EasyDataTable>

    <NewFamilyModal v-model:show-modal="showModal" :beneficiaryId="props.beneficiaryId" @close:modal="showModal = false" @update:list="getFamilyData" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import { IconTrash, IconUserPlus, IconUsersGroup } from '@tabler/icons-vue';
import { getTranslatedError } from '@/utils/errorManager';
import beneficiaryServices from './../../services/beneficiaryServices';
import NewFamilyModal from './NewFamilyModal.vue';

// composables
const { authHeader, user, isAdmin } = useAuth()

//props
const props = defineProps({
  beneficiaryId: String,
})

//data
const showModal = ref(false)
const familyData = ref([])

const serverItemsLength = ref(0)
const rowsItems = [5, 10, 15, 20]
const serverOptions = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: null,
  sortType: null,
})

const headers = [
  // { text: 'CURP', value: 'curp' },
  { text: 'Nombre', value: 'name', sortable: true },
  // { text: 'Apellido', value: 'lastname', sortable: true },
  { text: 'Edad', value: 'age', sortable: true },
  { text: 'Sexo', value: 'sex', sortable: true },
  { text: 'Escolaridad', value: 'scholarship', sortable: true },
  { text: 'Teléfono', value: 'phone' },
  { text: 'Parentesco', value: 'relationship', sortable: true },
  { text: 'Ocupación', value: 'occupation' },
  { text: 'Ingresos / mes', value: 'income' },
  { text: '', value: 'profile' },
]

const loading = ref(false)
const search = ref('')

//watch
watch(serverOptions, (value) => { getFamilyData() }, { deep: true });


//methods
const getFamilyData = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.getBeneficiaryFamily(props.beneficiaryId, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      familyData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.info('No hay familiares registrados')
      // toast.info(getTranslatedError(err))
    } else {
      toast.error(getTranslatedError(err))
    }
  } finally {
    loading.value = false
  }
}

const deleteFamily = async (familyId) => {
  loading.value = true
  try {
    const response = await beneficiaryServices.deleteFamily(props.beneficiaryId, familyId, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      toast.success('Familiar eliminado correctamente')
      getFamilyData()
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(getTranslatedError(err))
    } else {
      toast.error(getTranslatedError(err))
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getFamilyData()
})

</script>

<style lang="scss" scoped></style>
