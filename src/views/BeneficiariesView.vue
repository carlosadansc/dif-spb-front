<template>
  <div class="container mx-auto px-4">

    <div class="flex justify-between items-center mt-[5rem] mb-[2rem]">

      <input v-model="search" @keyup.enter="searchBeneficiaries()" type="text" placeholder="Buscar..."
        class="input input-bordered w-full max-w-xs" />

      <div class="flex items-center gap-3">
        <button @click.prevent="showModal = true" class="btn btn-square bg-blue-500 font-black text-white text-[1.2rem]">+</button>
      </div>
    </div>

    <EasyDataTable v-model:server-options="serverOptions" :server-items-length="serverItemsLength"
      :headers="headers" :items="data" :rows-items="rowsItems" :loading="loading">
      <template #item-address="{ address }">
        {{ address.street + ' #' + address.extNum + ' , ' + address.city + ' , ' + address.cp }}
      </template>
    </EasyDataTable>

    <NewBeneficiarieModal :showModal="showModal" @close:modal="showModal = false" />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import beneficiaryServices from '../services/beneficiaryServices'
import NewBeneficiarieModal from '../components/BeneficiariesView/NewBeneficiarieModal.vue'

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
    })
    data.value = response.data
    serverItemsLength.value = response.totalItems
  } catch (err) {
    console.log(err.response.errors)
  }
  loading.value = false
}

const searchBeneficiaries = async () => {
  serverOptions.value.page = 1
  getBeneficiariesData()
}

onMounted(() => {
  getBeneficiariesData()
})

</script>

<style lang="scss" scoped></style>