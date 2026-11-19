<template>
  <div class="app-page">
    <AppPageHeader title="Beneficiarios" description="Consulta expedientes, aplica filtros y registra nuevas personas beneficiarias.">
      <template #icon><IconUsers class="h-6 w-6" /></template>
    </AppPageHeader>

    <!-- Filtros expandidos -->
    <div class="toolbar-panel">
      <div class="card-body p-0">
        <div class="flex flex-col items-stretch gap-3 md:flex-row md:items-start md:gap-4">
          <!-- Búsqueda -->
          <label class="input input-bordered flex items-center gap-2 grow">
            <input v-model="search" @keyup.enter="applyFilters()" type="text" class="grow"
              placeholder="Buscar por CURP, nombre, apellidos..." />
            <IconSearch class="h-5 w-5" />
          </label>

          <label class="form-control w-full md:w-48">
            <span class="sr-only">Estado del expediente</span>
            <select v-model="filters.registrationStatus" @change="applyFilters()" class="select select-bordered w-full">
              <option value="">Todos los expedientes</option>
              <option value="PENDING_COMPLETION">Pendientes</option>
              <option value="COMPLETE">Completos</option>
            </select>
          </label>

          <!-- Dropdown para filtros avanzados -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn min-h-11 btn-ghost" aria-label="Abrir filtros avanzados">
              <IconFilter class="h-5 w-5 mr-2" />
              Filtros
            </label>
            <div tabindex="0"
              class="dropdown-content fixed inset-x-4 top-24 z-30 max-h-[70dvh] overflow-y-auto rounded-xl border bg-base-100 p-4 shadow-xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:w-[40rem]">
              <div class="card-body">
                <h3 class="card-title">Filtros avanzados</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <!-- Filtro por estado civil -->
                  <select v-model="filters.civilStatus" @change="applyFilters()"
                    class="select select-xs select-bordered">
                    <option value="">Estado Civil</option>
                    <option v-for="status in civilStatus" :key="status.value" :value="status.value">{{ status.text }}
                    </option>
                  </select>

                  <!-- Filtro por sexo -->
                  <select v-model="filters.sex" @change="applyFilters()" class="select select-xs select-bordered">
                    <option value="">Sexo</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                  </select>

                  <!-- Filtro por discapacidad -->
                  <select v-model="filters.hasDisability" @change="applyFilters()"
                    class="select select-xs select-bordered">
                    <option value="">Discapacidad</option>
                    <option value="true">Con discapacidad</option>
                    <option value="false">Sin discapacidad</option>
                  </select>

                  <!-- Filtro por servicio médico -->
                  <select v-model="filters.medicalService" @change="applyFilters()"
                    class="select select-xs select-bordered">
                    <option value="">Servicio Médico</option>
                    <option v-for="service in medicalServices" :key="service.value" :value="service.value">{{
                      service.text }}</option>
                  </select>

                  <!-- Filtro por comunidad indígena -->
                  <select v-model="filters.isIndigenousCommunity" @change="applyFilters()"
                    class="select select-xs select-bordered">
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
                  <select v-model="filters.scholarship" @change="applyFilters()"
                    class="select select-xs select-bordered">
                    <option value="">Escolaridad</option>
                    <option v-for="scholarship in scholarships" :key="scholarship.value" :value="scholarship.value">{{
                      scholarship.text }}</option>
                  </select>

                  <!-- Filtro por tipo de comunidad -->
                  <select v-model="filters.communityType" @change="applyFilters()"
                    class="select select-xs select-bordered">
                    <option value="">Tipo de Comunidad</option>
                    <option value="RURAL">Rural</option>
                    <option value="URBANA">Urbana</option>
                  </select>

                  <!-- Filtros de ubicación -->
                  <select v-model="filters.delegation" @change="onDelegationChange"
                    class="select select-xs select-bordered">
                    <option value="">Delegación</option>
                    <option v-for="delegation in delegations" :key="delegation.id" :value="delegation.value">
                      {{ delegation.text }}
                    </option>
                  </select>

                  <select v-model="filters.subdelegation" @change="applyFilters()" :disabled="!filters.delegation"
                    class="select select-xs select-bordered">
                    <option value="">Subdelegación</option>
                    <option v-for="subdelegation in filteredSubdelegations" :key="subdelegation.value"
                      :value="subdelegation.value">
                      {{ subdelegation.text }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div v-if="hasActiveFilters" class="flex min-w-0 flex-1 flex-wrap items-center gap-2" aria-live="polite">
            <span class="text-xs font-semibold text-gray-600">Filtros activos:</span>
            <button v-for="filter in activeFilters" :key="filter.key" type="button"
              class="badge badge-outline h-auto min-h-7 gap-1.5 py-1 pl-2.5 pr-1.5 text-gray-700 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-1"
              :aria-label="`Quitar filtro ${filter.label}: ${filter.value}`" @click="removeActiveFilter(filter.key)">
              <span>{{ filter.label }}: <strong>{{ filter.value }}</strong></span>
              <IconX class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>
            <button type="button" @click="clearFilters()" class="btn btn-ghost btn-sm text-gray-700">
              <IconFilterX class="h-4 w-4 mr-1" />
              Limpiar filtros
            </button>
          </div>

          <div class="ml-auto flex flex-wrap items-center justify-end gap-2">
            <div class="dropdown dropdown-end">
              <button tabindex="0" type="button"
                class="btn min-h-11 bg-red-800 font-bold text-white hover:bg-red-900"
                aria-label="Mostrar opciones para crear beneficiario">
                <IconUserPlus class="h-5 w-5" />
                <span>Crear beneficiario</span>
                <IconChevronDown class="h-4 w-4" />
              </button>
              <ul tabindex="0"
                class="menu dropdown-content z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                <li>
                  <router-link to="/beneficiaries/quick-register" class="min-h-14 gap-3 py-3">
                    <IconId class="h-5 w-5 shrink-0 text-red-800" />
                    <span>
                      <span class="block font-semibold text-gray-900">Escanear INE</span>
                      <span class="block text-xs font-normal text-gray-600">Crear un perfil mínimo con la cámara</span>
                    </span>
                  </router-link>
                </li>
                <li>
                  <button type="button" class="min-h-14 gap-3 py-3" @click="openManualRegistration">
                    <IconUserPlus class="h-5 w-5 shrink-0 text-red-800" />
                    <span class="text-left">
                      <span class="block font-semibold text-gray-900">Captura manual</span>
                      <span class="block text-xs font-normal text-gray-600">Registrar el expediente completo</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EasyDataTable v-model:server-options="serverOptions" :server-items-length="serverItemsLength" :headers="headers"
      :items="data" :rows-items="rowsItems" :loading="loading" rows-per-page-message="Se muestran" alternating>

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

      <template #item-contributions="{ contributions }">
        <span class="badge badge-ghost">{{ contributions.length }}</span>
      </template>

      <template #item-registrationStatus="{ registrationStatus }">
        <span class="badge" :class="registrationStatus === 'PENDING_COMPLETION' ? 'badge-warning' : 'badge-ghost'">
          {{ registrationStatus === 'PENDING_COMPLETION' ? 'Pendiente' : 'Completo' }}
        </span>
      </template>

      <template #item-actions="{ _id, active }">
        <div class="flex gap-1">
          <button @click="openBeneficiaryView(_id)" class="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
            title="Abrir expediente" aria-label="Abrir expediente del beneficiario">
            <IconFileInfo class="h-4 w-4" />
          </button>
          <button v-if="isAdmin" @click="toggleBeneficiaryStatus(_id, active)" class="btn btn-ghost btn-xs"
            :class="active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-yellow-50'"
            :title="active ? 'Desactivar' : 'Activar'" :aria-label="active ? 'Desactivar beneficiario' : 'Activar beneficiario'">
            <IconToggleLeft v-if="!active" class="h-4 w-4" />
            <IconToggleRight v-else class="h-4 w-4" />
          </button>
          <button v-if="isAdmin" @click="confirmDelete(_id)" class="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
            title="Eliminar beneficiario" aria-label="Eliminar beneficiario">
            <IconTrash class="h-4 w-4" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <NewBeneficiarieModal :showModal="showModal" @refresh:beneficiaries="getBeneficiariesData"
      @close:modal="showModal = false" />

  </div>

  <!-- Delete Confirmation Modal -->
  <ConfirmDeleteModal :show="showDeleteModal" title="Confirmar eliminación"
    message="¿Estás seguro de que deseas eliminar este beneficiario?"
    warning-message="¡Todos los datos asociados serán eliminados permanentemente!" @confirm="deleteBeneficiary"
    @close="showDeleteModal = false" />
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import router from '../router';
import { toast } from 'vue3-toastify';
import { IconSearch, IconFileInfo, IconUserPlus, IconFilterX, IconTrash, IconFilter, IconId, IconToggleLeft, IconToggleRight, IconChevronDown, IconX, IconUsers } from '@tabler/icons-vue';
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import beneficiaryServices from '../services/beneficiaryServices'
import NewBeneficiarieModal from '../components/BeneficiariesView/NewBeneficiaryModal.vue'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue'
import civilStatus from '../constants/civilStatus'
import medicalServices from '../constants/medicalServices'
import scholarships from '../constants/scholarships'
import delegations from '../constants/delegations'

import { AxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';

// composables
const { authHeader, isAdmin } = useAuth()

//data
const showModal = ref(false)
const filteredSubdelegations = ref([])

const serverItemsLength = ref(0)
const rowsItems = [5, 10, 15, 20]
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'createdAt',
  sortType: 'desc',
})

const headers = [
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'CURP', value: 'curp' },
  { text: 'Sexo', value: 'sex' },
  { text: 'Edad', value: 'age' },
  { text: 'Estado Civil', value: 'civilStatus' },
  { text: 'Discapacidad', value: 'hasDisability' },
  { text: 'Teléfono', value: 'phone' },
  { text: '#Entregas de apoyo', value: 'contributions' },
  { text: 'Expediente', value: 'registrationStatus' },
  { text: 'Acciones', value: 'actions' },
];

const data = ref([])
const loading = ref(false)
const search = ref('');
const filters = ref({
  registrationStatus: '',
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

const getOptionText = (options, value) => options.find(option => option.value === value)?.text || value;

const activeFilters = computed(() => {
  const active = [];
  const addFilter = (key, label, value) => {
    if (value !== '') active.push({ key, label, value });
  };

  addFilter('search', 'Búsqueda', search.value.trim());
  addFilter('registrationStatus', 'Expediente', {
    PENDING_COMPLETION: 'Pendiente',
    COMPLETE: 'Completo'
  }[filters.value.registrationStatus] || filters.value.registrationStatus);
  addFilter('civilStatus', 'Estado civil', getOptionText(civilStatus, filters.value.civilStatus));
  addFilter('sex', 'Sexo', { HOMBRE: 'Hombre', MUJER: 'Mujer' }[filters.value.sex] || filters.value.sex);
  addFilter('hasDisability', 'Discapacidad', {
    true: 'Con discapacidad',
    false: 'Sin discapacidad'
  }[filters.value.hasDisability] || filters.value.hasDisability);
  addFilter('medicalService', 'Servicio médico', getOptionText(medicalServices, filters.value.medicalService));
  addFilter('isIndigenousCommunity', 'Comunidad indígena', {
    true: 'Sí pertenece',
    false: 'No pertenece'
  }[filters.value.isIndigenousCommunity] || filters.value.isIndigenousCommunity);
  addFilter('isLgbtq', 'Comunidad LGBTQ+', {
    true: 'Sí pertenece',
    false: 'No pertenece'
  }[filters.value.isLgbtq] || filters.value.isLgbtq);
  addFilter('scholarship', 'Escolaridad', getOptionText(scholarships, filters.value.scholarship));
  addFilter('communityType', 'Tipo de comunidad', {
    RURAL: 'Rural',
    URBANA: 'Urbana'
  }[filters.value.communityType] || filters.value.communityType);
  addFilter('delegation', 'Delegación', getOptionText(delegations, filters.value.delegation));
  addFilter('subdelegation', 'Subdelegación', getOptionText(filteredSubdelegations.value, filters.value.subdelegation));

  return active;
});

const hasActiveFilters = computed(() => activeFilters.value.length > 0);

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
    registrationStatus: '',
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
    neighborhood: ''
  }
  search.value = ''
  filteredSubdelegations.value = []
  getBeneficiariesData()
};

const removeActiveFilter = (key) => {
  if (key === 'search') {
    search.value = '';
  } else {
    filters.value[key] = '';
  }

  if (key === 'delegation') {
    filters.value.subdelegation = '';
    filteredSubdelegations.value = [];
  }

  applyFilters();
};

onMounted(async () => {
  await getBeneficiariesData()
})

const openBeneficiaryView = (id) => {
  router.push(`/beneficiaries/${id}`)
}

const openManualRegistration = () => {
  document.activeElement?.blur()
  showModal.value = true
}

const beneficiaryToDeleteId = ref(null)
const showDeleteModal = ref(false)
const confirmDelete = (id) => {
  beneficiaryToDeleteId.value = id;
  showDeleteModal.value = true;
};

const deleteBeneficiary = async () => {
  if (!beneficiaryToDeleteId.value) return;

  try {
    const response = await beneficiaryServices.deleteBeneficiaryWhitAllData(beneficiaryToDeleteId.value, authHeader.value);
    toast.success(response.message || 'Beneficiario eliminado con éxito');
    showDeleteModal.value = false;
    await getBeneficiariesData();
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    } else {
      toast.error('Ocurrió un error inesperado');
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

</script>

<style lang="scss" scoped></style>
