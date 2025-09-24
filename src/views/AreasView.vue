<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Áreas</h1>
      <button 
        @click="openCreateModal"
        class="btn bg-red-800 hover:bg-red-900 text-white"
      >
        <IconPlus class="w-4 h-4 mr-2" />
        Nueva Área
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="card bg-base-100 shadow-sm border mb-6">
      <div class="card-body p-4">
        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="form-control w-full max-w-xs">
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Buscar por nombre..."
                class="input input-bordered w-full pr-10"
                @keyup.enter="applyFilters"
              />
              <button class="absolute right-3 top-1/2 transform -translate-y-1/2" @click="applyFilters">
                <i class="fas fa-search text-gray-400"></i>
              </button>
            </div>
          </div>
          
          <!-- Status Filter -->
          <div class="form-control w-full max-w-xs">
            <select v-model="statusFilter" class="select select-bordered w-full" @change="applyFilters">
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          
          <!-- Clear Filters -->
          <button @click="clearFilters" class="btn btn-ghost">
            <i class="fas fa-times mr-2"></i>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Areas Table -->
    <div class="card bg-base-100 shadow-sm border">
      <div class="card-body p-0">
        <EasyDataTable
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :headers="headers"
          :items="areas"
          :loading="loading"
          :search-value="search"
          :rows-per-page="serverOptions.rowsPerPage"
          :rows-items="[10, 20, 50, 100]"
          :rows-per-page-message="'Registros por página:'"
          :table-class-name="'custom-table'"
          buttons-pagination
          hide-rows-per-page
        >
          <!-- Name Column -->
          <template #item-name="{ name }">
            <div class="font-medium text-gray-900">{{ name }}</div>
          </template>
          
          <!-- Parent Area Column -->
          <template #item-parentArea="{ parentArea }">
            <div class="text-gray-600">{{ getParentAreaName(parentArea) || 'Ninguna' }}</div>
          </template>
          
          <!-- Status Column -->
          <template #item-active="{ active }">
            <span 
              :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ active ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
          
          <!-- Actions Column -->
          <template #item-actions="{ _id, active }">
            <div class="flex items-center space-x-2">
              <button 
                @click="openEditModal(findAreaById(_id))" 
                class="btn btn-ghost btn-sm btn-square text-blue-600 hover:bg-blue-50"
                title="Editar"
              >
                <IconPencil class="h-4 w-4" />
              </button>
              <button 
                @click="confirmToggleStatus(findAreaById(_id))" 
                class="btn btn-ghost btn-sm btn-square"
                :class="active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'"
                :title="active ? 'Desactivar' : 'Activar'"
              >
                <IconToggleLeft v-if="!active" class="h-4 w-4" />
                <IconToggleRight v-else class="h-4 w-4" />
              </button>
              <button 
                @click="confirmDelete(_id)" 
                class="btn btn-ghost btn-sm btn-square text-red-600 hover:bg-red-50"
                title="Eliminar"
              >
                <IconTrash class="h-4 w-4" />
              </button>
            </div>
          </template>
          
          <!-- Empty State -->
          <template #empty-message>
            <div class="p-4 text-center text-gray-500">
              No se encontraron áreas que coincidan con la búsqueda
            </div>
          </template>
        </EasyDataTable>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AreaFormModal
      :show="showModal"
      :form-data="formData"
      :errors="errors"
      :loading="loading"
      :editing-area="editingArea"
      :available-parent-areas="availableParentAreas"
      :is-circular-reference="isCircularReference"
      @close="closeModal"
      @save="saveArea"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p class="mb-6">¿Estás seguro de que deseas eliminar esta área? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="deleteArea"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            :disabled="loading"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Eliminando...
            </span>
            <span v-else>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconPlus, IconPencil, IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-vue';
import AreaFormModal from '@/components/AreasView/AreaFormModal.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import areaService from '@/services/areaServices';
import { useAuth } from '../composables/useAuth';
import { normalizeText } from '@/utils/normalizeObjectText';


const { authHeader } = useAuth();

// Table configuration
const headers = [
  { text: 'NOMBRE', value: 'name', sortable: true, width: '30%' },
  { text: 'ÁREA PADRE', value: 'parentArea', sortable: true, width: '30%' },
  { text: 'ESTADO', value: 'active', sortable: true, width: '15%' },
  { text: 'ACCIONES', value: 'actions', sortable: false, width: '25%' }
];

// Server options for pagination and sorting
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  sortType: 'asc'
});

const serverItemsLength = ref(0);
const search = ref('');
const statusFilter = ref('');

// Data
const areas = ref([]);
const allAreas = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingArea = ref(null);
const loading = ref(false);
const areaToDeleteId = ref(null);

const formData = ref({
  name: '',
  parentArea: null,
  active: true
});

const errors = ref({
  name: '',
  parentArea: ''
});

// Computed
const availableParentAreas = computed(() => {
  return allAreas.value.filter(area => 
    !editingArea.value || 
    (area._id !== editingArea.value._id && !isChildArea(editingArea.value._id, area._id))
  );
});

// Find area by ID
const findAreaById = (id) => {
  return allAreas.value.find(area => area._id === id);
};

// Methods
const fetchAreas = async () => {
  try {
    loading.value = true;
    const response = await areaService.getAreas(authHeader.value);
    allAreas.value = response;
    applyFilters();
  } catch (error) {
    console.error('Error fetching areas:', error.response?.data?.errors || ['Error al cargar las áreas']);
    toast.error(error.response?.data?.errors || ['Error al cargar las áreas']);
  } finally {
    loading.value = false;
  }
};

// Apply filters and pagination
const applyFilters = () => {
  let filtered = [...allAreas.value];
  
  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(area => 
      area.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply status filter
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(area => area.active);
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(area => !area.active);
  }
  
  // Update server items length for pagination
  serverItemsLength.value = filtered.length;
  
  // Apply pagination
  const start = (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage;
  const end = start + serverOptions.value.rowsPerPage;
  areas.value = filtered.slice(start, end);
};

// Clear all filters
const clearFilters = () => {
  search.value = '';
  statusFilter.value = '';
  serverOptions.value.page = 1;
  applyFilters();
};

// Watch for server options changes
watch(serverOptions, (newVal) => {
  applyFilters();
}, { deep: true });

const openCreateModal = () => {
  editingArea.value = null;
  formData.value = { name: '', parentArea: null, active: true };
  showModal.value = true;
};

const openEditModal = (area) => {
  console.log('Editando área:', area); // Para depuración
  
  editingArea.value = { ...area };
  
  // Extraer el ID del área padre, manejando tanto objetos como IDs directos
  const parentAreaId = area.parentArea 
    ? (area.parentArea._id || area.parentArea)
    : null;
    
  console.log('ID de área padre extraído:', parentAreaId); // Para depuración
    
  formData.value = {
    name: area.name,
    parentArea: parentAreaId,
    active: area.active
  };
  
  console.log('Datos del formulario:', formData.value); // Para depuración
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  errors.value = { name: '', parentArea: '' };
};

const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', parentArea: '' };

  // Name validation
  if (!formData.value.name.trim()) {
    errors.value.name = 'El nombre es obligatorio';
    isValid = false;
  } else if (formData.value.name.trim().length < 4) {
    errors.value.name = 'El nombre debe tener al menos 4 caracteres';
    isValid = false;
  } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.value.name)) {
    errors.value.name = 'Solo se permiten caracteres alfanuméricos y espacios';
    isValid = false;
  }

  // Check for duplicate names (case insensitive)
  const nameExists = areas.value.some(area => {
    const sameName = area.name.toLowerCase() === formData.value.name.toLowerCase();
    if (editingArea.value) {
      return sameName && area._id !== editingArea.value._id;
    }
    return sameName;
  });

  if (nameExists) {
    errors.value.name = 'Ya existe un área con este nombre';
    isValid = false;
  }

  return isValid;
};

const saveArea = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    const areaData = { 
      ...formData.value, // Replace with actual user ID from auth
    };

    if (editingArea.value) {
      // Update existing area
      const updateData = {
        name: normalizeText(areaData.name),
        parentArea: areaData.parentArea,
        active: areaData.active
      }
      await areaService.updateArea(editingArea.value._id, {update : updateData}, authHeader.value);
      toast.success('Área actualizada correctamente');
    } else {
      // Create new area
      const createData = {
        name: normalizeText(areaData.name),
        parentArea: areaData.parentArea,
        active: areaData.active
      }
      await areaService.createArea(createData, authHeader.value);
      toast.success('Área creada correctamente');
    }

    await fetchAreas();
    closeModal();
  } catch (error) {
    console.error('Error saving area:', error);
    toast.error(error.response?.data?.message || 'Error al guardar el área');
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (areaId) => {
  areaToDeleteId.value = areaId;
  showDeleteModal.value = true;
};

const deleteArea = async () => {
  if (!areaToDeleteId.value) return;

  try {
    loading.value = true;
    // Call delete API (you'll need to implement this in your service)
    await areaService.deleteArea(areaToDeleteId.value, authHeader.value);
    
    // For now, we'll just log and show a success message
    console.log('Deleting area:', areaToDeleteId.value);
    toast.success('Área eliminada correctamente');
    
    await fetchAreas();
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Error deleting area:', error);
    toast.error('Error al eliminar el área');
  } finally {
    loading.value = false;
    areaToDeleteId.value = null;
  }
};

const confirmToggleStatus = async (area) => {
  try {
    loading.value = true;
    
    // Toggle active status
    await areaService.updateArea(
      area._id, 
      { update: { active: !area.active } }, 
      authHeader.value
    );
    
    toast.success(`Área ${!area.active ? 'activada' : 'desactivada'} correctamente`);
    await fetchAreas();
  } catch (error) {
    console.error('Error toggling area status:', error);
    toast.error(`Error al ${area.active ? 'desactivar' : 'activar'} el área`);
  } finally {
    loading.value = false;
  }
};

const getParentAreaName = (parentArea) => {
  if (!parentArea) return '';
  const parent = areas.value.find(a => a._id === (typeof parentArea === 'string' ? parentArea : parentArea._id));
  return parent ? parent.name : '';
};

const isChildArea = (parentId, areaId) => {
  if (!parentId || !areaId) return false;
  
  const findChild = (currentId, targetId) => {
    const children = areas.value.filter(a => a.parentArea === currentId);
    for (const child of children) {
      if (child._id === targetId || findChild(child._id, targetId)) {
        return true;
      }
    }
    return false;
  };
  
  return findChild(areaId, parentId);
};

const isCircularReference = (parentId) => {
  if (!editingArea.value || !parentId) return false;
  return isChildArea(editingArea.value._id, parentId);
};

// Lifecycle hooks
onMounted(() => {
  fetchAreas();
});

// Watch for search term changes
watch(search, () => {
  serverOptions.value.page = 1;
  applyFilters();
});

// Watch for status filter changes
watch(statusFilter, () => {
  serverOptions.value.page = 1;
  applyFilters();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>