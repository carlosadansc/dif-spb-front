<template>
  <div class="container mx-auto px-4">

    <div class="flex justify-between items-center mt-[5rem] mb-[2rem]">
      
      <label class="input input-bordered flex items-center gap-2">
        <input v-model="search" @keyup.enter="searchBeneficiaries()" type="text" class="grow" placeholder="Buscar ..." />
        <IconSearch class="h-5 w-5" />
      </label>

      <div class="flex items-center gap-3">
        <button @click.prevent="showModal = true"
          class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">+</button>
      </div>
    </div>

    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="data" :rows-items="rowsItems" :loading="loading"
      rows-per-page-message="Total de registros mostrados"
      alternating
    >
      <template #item-address="{ address }">
        {{ address.street + ' #' + address.extNum + ' , ' + address.city + ' , ' + address.cp }}
      </template>
      <template #item-profile="{ _id: id }">
        <div class="tooltip tooltip-left" data-tip="Ver expediente">
          <button class="btn btn-square btn-sm my-2 mx-auto text-red-800" @click="openBeneficiaryView(id)">
            <IconFileExport class="h-5 w-5" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <NewBeneficiarieModal :showModal="showModal" @refresh:beneficiaries="getBeneficiariesData" @close:modal="showModal = false" />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import router from '../router';
import { toast } from 'vue3-toastify';
import { IconSearch, IconFileExport } from '@tabler/icons-vue';
import beneficiaryServices from '../services/beneficiaryServices'
import NewBeneficiarieModal from '../components/BeneficiariesView/NewBeneficiarieModal.vue'
import { AxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';

// composables
const { authHeader } = useAuth()

//data
const showModal = ref(false)

const serverItemsLength = ref(0)
const rowsItems = [5, 10, 15, 20]
const serverOptions = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: null,
  sortType: null,
})

const headers = [
  { text: 'CURP', value: 'curp' },
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'Apellido paterno', value: 'fatherSurname', sortable: true },
  { text: 'Apellido materno', value: 'motherSurname', sortable: true },
  { text: 'Télefono', value: 'phone' },
  { text: 'Colonia', value: 'address.neighborhood', sortable: true },
  { text: 'Código postal', value: 'address.cp', sortable: true },
  { text: 'Dirección', value: 'address' },
  { text: '', value: 'profile' },
]

const data = ref([])
const loading = ref(false)
const search = ref('')

//watch
watch(serverOptions, (value) => { getBeneficiariesData() }, { deep: true });

//methods
const getBeneficiariesData = async () => {
  loading.value = true
  try {
    const response = await beneficiaryServices.getBeneficiaries({
      page: serverOptions.value.page,
      limit: serverOptions.value.rowsPerPage,
      sort: serverOptions.value.sortBy,
      order: serverOptions.value.sortType,
      search: search.value,
    }, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      data.value = response.data
      serverItemsLength.value = response.totalItems
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

const searchBeneficiaries = async () => {
  serverOptions.value.page = 1
  getBeneficiariesData()
}

onMounted(() => {
  getBeneficiariesData()
})

const openBeneficiaryView = (id) => {
  router.push(`/beneficiaries/${id}`)
}

</script>

<style lang="scss" scoped></style>