<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-semibold text-gray-900 mb-8">Beneficiarios</h1>

    <!-- Filtros expandidos -->
    <div class="card bg-base-100 shadow-sm border mb-6">
      <div class="card-body p-4">
        <div class="flex items-start gap-4">
          <!-- Búsqueda -->
          <label class="input input-bordered flex items-center gap-2 grow">
            <input v-model="search" @keyup.enter="applyFilters()" type="text" class="grow" placeholder="Buscar por CURP, nombre, apellidos..." />
            <IconSearch class="h-5 w-5" />
          </label>

          <!-- Dropdown para filtros avanzados -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost">
              <IconFilter class="h-5 w-5 mr-2" />
              Filtros
            </label>
            <div tabindex="0" class="dropdown-content z-[9999] card card-compact w-[40rem] p-4 shadow bg-base-100 border">
              <div class="card-body">
                <h3 class="card-title">Filtros avanzados</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <!-- Filtro por estado civil -->
                  <select v-model="filters.civilStatus" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Estado Civil</option>
                    <option v-for="status in civilStatus" :key="status.value" :value="status.value">{{ status.text }}</option>
                  </select>

                  <!-- Filtro por sexo -->
                  <select v-model="filters.sex" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Sexo</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                  </select>

                  <!-- Filtro por discapacidad -->
                  <select v-model="filters.hasDisability" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Discapacidad</option>
                    <option value="true">Con discapacidad</option>
                    <option value="false">Sin discapacidad</option>
                  </select>

                  <!-- Filtro por servicio médico -->
                  <select v-model="filters.medicalService" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Servicio Médico</option>
                    <option v-for="service in medicalServices" :key="service.value" :value="service.value">{{ service.text }}</option>
                  </select>

                  <!-- Filtro por comunidad indígena -->
                  <select v-model="filters.isIndigenousCommunity" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Comunidad Indígena</option>
                    <option value="true">Sí pertenece</option>
                    <option value="false">No pertenece</option>
                  </select>

                  <!-- Filtro por comunidad LGBTQ+ -->
                  <select v-model="filters.isLgbtq" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Comunidad LGBTQ+</option>
                    <option value="true">Sí pertenece</option>
                    <option value="false">No pertenece</option>
                  </select>

                  <!-- Filtro por escolaridad -->
                  <select v-model="filters.scholarship" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Escolaridad</option>
                    <option v-for="scholarship in scholarships" :key="scholarship.value" :value="scholarship.value">{{ scholarship.text }}</option>
                  </select>

                  <!-- Filtro por tipo de comunidad -->
                  <select v-model="filters.communityType" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Tipo de Comunidad</option>
                    <option value="RURAL">Rural</option>
                    <option value="URBANA">Urbana</option>
                  </select>

                  <!-- Filtros de ubicación -->
                  <select v-model="filters.delegation" @change="onDelegationChange" class="select select-xs select-bordered">
                    <option value="">Delegación</option>
                    <option v-for="delegation in delegations" :key="delegation.id" :value="delegation.value">
                      {{ delegation.text }}
                    </option>
                  </select>
                  
                  <select v-model="filters.subdelegation" @change="applyFilters()" :disabled="!filters.delegation" class="select select-xs select-bordered">
                    <option value="">Subdelegación</option>
                    <option v-for="subdelegation in filteredSubdelegations" :key="subdelegation.value" :value="subdelegation.value">
                      {{ subdelegation.text }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="flex justify-between items-center mt-4">
          <button @click="clearFilters()" class="btn btn-ghost btn-sm">
            <IconFilterX class="h-4 w-4 mr-2" />
            Limpiar filtros
          </button>
          
          <div class="flex items-center gap-3">
            <div class="tooltip tooltip-left" data-tip="Exportar padrón a excel">
              <button :disabled="loadindExport" @click.prevent="exportToExcel" class="btn btn-square bg-gray-800 font-black text-white text-[1.2rem]"><IconFileSpreadsheet v-if="!loadindExport"/><span v-if="loadindExport" class="loading loading-spinner loading-sm"></span></button>
            </div>
            <div class="tooltip tooltip-left" data-tip="Crear nuevo beneficiario">
              <button @click.prevent="showModal = true" class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]"><IconUserPlus /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="data"
      :rows-items="rowsItems"
      :loading="loading"
      rows-per-page-message="Se muestran"
      alternating
    >

      <template #item-name="{ name, fatherSurname, motherSurname }">
        {{ name }} {{ fatherSurname }} {{ motherSurname }}
      </template>

      <template #item-civilStatus="{ civilStatus }">
        <span class="badge badge-ghost">{{ formatCivilStatus(civilStatus) }}</span>
      </template>

      <template #item-hasDisability="{ hasDisability }">
        <div class="badge" :class="hasDisability ? 'badge-warning' : 'badge-ghost'">
          {{ hasDisability ? 'Sí' : 'No' }}
        </div>
      </template>

      <template #item-actions="{ _id, active }">
        <div class="flex gap-1">
          <button @click="openBeneficiaryView(_id)" class="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50" title="Ver expediente">
            <IconEye class="h-4 w-4" />
          </button>
          <button 
            @click="toggleBeneficiaryStatus(_id, active)" 
            class="btn btn-ghost btn-xs"
            :class="active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-yellow-50'"
            :title="active ? 'Desactivar' : 'Activar'"
          >
            <IconToggleLeft v-if="!active" class="h-4 w-4" />
            <IconToggleRight v-else class="h-4 w-4" />
          </button>
          <button 
            @click="confirmDelete(_id)" 
            class="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
            title="Eliminar"
          >
            <IconTrash class="h-4 w-4" />
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
import { IconSearch, IconEye, IconFileSpreadsheet, IconUserPlus, IconFilterX, IconTrash, IconFilter, IconPencil, IconToggleLeft, IconToggleRight } from '@tabler/icons-vue';
import beneficiaryServices from '../services/beneficiaryServices'
import NewBeneficiarieModal from '../components/BeneficiariesView/NewBeneficiaryModal.vue'
import civilStatus from '../constants/civilStatus'
import medicalServices from '../constants/medicalServices'
import scholarships from '../constants/scholarships'
import delegations from '../constants/delegations'

import { AxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';
import * as XLSX from 'xlsx';

// composables
const { authHeader } = useAuth()

//data
const showModal = ref(false)
const filteredSubdelegations = ref([])

const serverItemsLength = ref(0)
const rowsItems = [5, 10, 15, 20]
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: null,
  sortType: null,
})

const headers = [
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'CURP', value: 'curp' },
  { text: 'Sexo', value: 'sex' },
  { text: 'Edad', value: 'age' },
  { text: 'Estado Civil', value: 'civilStatus' },
  { text: 'Discapacidad', value: 'hasDisability' },
  { text: 'Teléfono', value: 'phone' },
  { text: 'Acciones', value: 'actions' },
];

const data = ref([])
const loading = ref(false)
const loadindExport = ref(false)
const search = ref('');
const filters = ref({
  civilStatus: '',
  hasDisability: '',
  isIndigenousCommunity: '',
  isLgbtq: '',
  sex: '',
  medicalService: '',
  scholarship: '',
  communityType: '',
  delegation: '',
  subdelegation: '',
  neighborhood: '',
});
const apiUrl = import.meta.env.VITE_API_URL;

//watch
watch(serverOptions, (value) => { getBeneficiariesData() }, { deep: true });

//methods
const getBeneficiariesData = async () => {
  loading.value = true;
  try {
    // Ensure pagination parameters are numbers
    const page = parseInt(serverOptions.value.page, 10) || 1;
    const limit = parseInt(serverOptions.value.rowsPerPage, 10) || 10;
    
    const params = {
      page,
      limit,
      sort: serverOptions.value.sortBy,
      order: serverOptions.value.sortType,
      search: search.value,
      ...filters.value
    };
    
    // Remove any empty string filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });

    const response = await beneficiaryServices.getBeneficiaries(params, authHeader.value);
    if (response.data.beneficiaries) {
      data.value = response.data.beneficiaries;
      serverItemsLength.value = response.data.totalItems;
    } else {
      data.value = [];
      serverItemsLength.value = 0;
    }

  } catch (err) {
    data.value = [];
    serverItemsLength.value = 0;
    if (err instanceof AxiosError) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        toast.error('No se pudo conectar con el servidor');
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    } else {
      toast.error(String(err));
    }
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  serverOptions.value.page = 1;
  getBeneficiariesData();
};

const clearFilters = () => {
  filters.value = {
    civilStatus: '',
    hasDisability: '',
    isIndigenousCommunity: '',
    isLgbtq: '',
    sex: '',
    medicalService: '',
    scholarship: '',
    communityType: '',
    delegation: '',
    subdelegation: ''
  }
  search.value = ''
  getBeneficiariesData()
};

onMounted(async() => {
  await getBeneficiariesData()
})

const openBeneficiaryView = (id) => {
  router.push(`/beneficiaries/${id}`)
}

const deleteBeneficiary = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este beneficiario?')) {
    try {
      const response = await beneficiaryServices.deleteBeneficiary(id, authHeader.value);
      toast.success(response.message || 'Beneficiario eliminado con éxito');
      await getBeneficiariesData();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Error al eliminar');
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    }
  }
};

const formatCivilStatus = (status) => {
  const statusMap = {
    'SOLTERO': 'Soltero(a)',
    'CASADO': 'Casado(a)',
    'DIVORCIADO': 'Divorciado(a)',
    'VIUDO': 'Viudo(a)',
    'UNION_LIBRE': 'Unión Libre',
    'SEPARADO': 'Separado(a)'
  };
  return statusMap[status] || status;
}

const onDelegationChange = () => {
  // Reset subdelegation when delegation changes
  filters.value.subdelegation = '';
  
  // Filter subdelegations based on selected delegation
  const selectedDelegation = delegations.find(d => d.value === filters.value.delegation);
  filteredSubdelegations.value = selectedDelegation ? selectedDelegation.subdelegations : [];
  
  // Apply filters
  applyFilters();
};

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