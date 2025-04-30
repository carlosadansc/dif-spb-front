<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-semibold text-gray-900  mb-8">Usuarios</h1>

    <div class="flex justify-between items-center mb-[2rem]">
      
      <label class="input input-bordered w-[40%] flex items-center gap-2">
        <input v-model="search" @keyup.enter="searchBeneficiaries()" type="text" class="grow" placeholder="Buscar ..." />
        <IconSearch class="h-5 w-5" />
      </label>

      <div class="flex items-center gap-3">
        <div class="tooltip tooltip-left" data-tip="Crear nuevo beneficiario">
          <button @click.prevent="showModal = true" class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">+</button>
        </div>
      </div>
    </div>

    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="data" :rows-items="rowsItems" :loading="loading"
      rows-per-page-message="Se muestran"
      alternating
    >

      <template #item-profile="{ _id: id }">
        <div class="tooltip tooltip-left" data-tip="Eliminar usuario">
          <button class="my-2 mx-auto text-red-800 hover:text-red-200" @click="openBeneficiaryView(id)">
            <IconX class="h-4 w-4" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <!-- <NewBeneficiarieModal :showModal="showModal" @refresh:beneficiaries="getUsersData" @close:modal="showModal = false" /> -->

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import router from '../router';
import { toast } from 'vue3-toastify';
import { IconSearch, IconX } from '@tabler/icons-vue';
import userServices from '../services/userServices'
import NewBeneficiarieModal from '../components/BeneficiariesView/NewBeneficiaryModal.vue'
import { AxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';
import * as XLSX from 'xlsx';

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
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'Apellido', value: 'lastname', sortable: true },
  // { text: 'Fecha de nacimiento', value: 'birthdate' },
  {text: 'Cargo', value: 'position', sortable: true},
  {text: 'Area', value: 'area', sortable: true},
  { text: 'Tipo de usuario', value: 'userType', sortable: true },
  { text: 'Activo', value: 'active', sortable: true },
  { text: '', value: 'profile' },
]

const data = ref([])
const loading = ref(false)
const search = ref('')

//watch
watch(serverOptions, (value) => { getUsersData() }, { deep: true });

//methods
const getUsersData = async () => {
  loading.value = true
  try {
    const response = await userServices.getUsers(authHeader.value)
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


onMounted(() => {
  getUsersData()
})

</script>

<style lang="scss" scoped>

</style>