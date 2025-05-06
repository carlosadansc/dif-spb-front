<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-semibold text-gray-900  mb-8">Beneficiarios</h1>

    <div class="flex justify-between items-center mb-[2rem]">
      
      <label class="input input-bordered w-[40%] flex items-center gap-2">
        <input v-model="search" @keyup.enter="searchBeneficiaries()" type="text" class="grow" placeholder="Buscar ..." />
        <IconSearch class="h-5 w-5" />
      </label>

      <div class="flex items-center gap-3">
        <div class="tooltip tooltip-left" data-tip="Exportar padrón a excel">
          <button :disabled="loadindExport" @click.prevent="exportToExcel" class="btn btn-square bg-gray-800 font-black text-white text-[1.2rem]"><IconFileSpreadsheet v-if="!loadindExport"/><span v-if="loadindExport" class="loading loading-spinner loading-sm"></span></button>
        </div>
        <div class="tooltip tooltip-left" data-tip="Crear nuevo beneficiario">
          <button @click.prevent="showModal = true" class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]"><IconUserPlus /></button>
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
import { IconSearch, IconFileExport, IconFileSpreadsheet, IconUserPlus } from '@tabler/icons-vue';
import beneficiaryServices from '../services/beneficiaryServices'
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
const   serverOptions = ref({
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
  // { text: 'Fecha de nacimiento', value: 'birthdate' },
  {text: 'Edad', value: 'age', sortable: true},
  {text: 'Estado civil', value: 'civilStatus', sortable: true},
  { text: 'Télefono', value: 'phone' },
  { text: 'Colonia', value: 'address.neighborhood', sortable: true },
  { text: 'Código postal', value: 'address.cp', sortable: true },
  // { text: 'Dirección completa', value: 'address' },
  { text: '', value: 'profile' },
]

const data = ref([])
const loading = ref(false)
const loadindExport = ref(false)
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
  await getBeneficiariesData()
}

onMounted(async() => {
  await getBeneficiariesData()
})

const openBeneficiaryView = (id) => {
  router.push(`/beneficiaries/${id}`)
}


// Export to Excel
const json_fields = {
  "CURP": "curp",
  "Nombre": "name",
  "Apellido paterno": "fatherSurname",
  "Apellido materno": "motherSurname",
  "Fecha de nacimiento": "birthdate",
  "Teléfono": "phone",
  "Colonia": "address.neighborhood",
  "Código postal": "address.cp",
  "Dirección": "address.street",
  "Número exterior": "address.extNum",
  "Número interior": "address.intNum",
  "Ciudad": "address.city",
  "Tipo de comunidad": "address.communityType",
  "Lugar de nacimiento": "birthplace",
  "Estado civil": "civilStatus",
  "Sexo": "sex",
  "Servicio medico": "medicalService",
  "Tiene alguna discapacidad": "hasDisability",
  "Tipo de discapacidad": "disabilityType",
  "Grado de estudios": "scholarship",
  "Ingresos mensuales": "income",
};

const exportToExcel = async () => {
  loadindExport.value = true;
  serverOptions.value.page = null;
  serverOptions.value.rowsPerPage = null;
  
  await getBeneficiariesData();
  
  const dataExcel = data.value.map(beneficiary => {
    const row = {};
    for (const [key, value] of Object.entries(json_fields)) {
      try {
        // Obtener el valor de la propiedad anidada
        const cellValue = value.split('.').reduce((o, i) => o?.[i], beneficiary);
        
        // Formatear solo si es el campo de fecha de nacimiento
        if (key === 'Fecha de nacimiento' && cellValue) {
          const parsedDate = new Date(cellValue);
          if (!isNaN(parsedDate)) {
            // Formatear como DD/MM/YYYY
            row[key] = parsedDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
          } else {
            row[key] = cellValue;
          }
        } else {
          row[key] = cellValue ?? '';
        }
      } catch (error) {
        console.warn(`Error procesando campo ${key}:`, error);
        row[key] = '';
      }
    }
    return row;
  });

  // Crear hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(dataExcel);
  
  // Opcional: Asegurar que la columna de fecha tenga ancho adecuado
  worksheet['!cols'] = worksheet['!cols'] || [];
  const fechaIndex = Object.keys(json_fields).indexOf('Fecha de nacimiento');
  if (fechaIndex !== -1) {
    worksheet['!cols'][fechaIndex] = { wch: 15 }; // Ancho de columna
  }
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiarios');
  XLSX.writeFile(workbook, 'padron-beneficiarios-smdif-la-paz.xlsx');
  loadindExport.value = false;
};
</script>

<style lang="scss" scoped></style>