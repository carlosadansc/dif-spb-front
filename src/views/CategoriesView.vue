<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-1">Categorías</h1>
      <button @click="openCreateModal" class="btn bg-red-800 hover:bg-red-900 text-white" :disabled="loading">
        <IconPlus class="w-4 h-4 mr-2" />
        Nueva Categoría
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="card bg-base-100 shadow-sm border mb-6">
      <div class="card-body p-4">
        <div class="flex items-start gap-4">
          <!-- Search -->
          <label class="input input-bordered flex items-center gap-2 grow">
            <input v-model="searchQuery" type="text" class="grow" placeholder="Buscar categorías..." />
            <IconSearch class="h-5 w-5" />
          </label>

          <!-- Status Filter -->
          <select v-model="statusFilter" class="select select-bordered">
            <option value="all">Todos los estados</option>
            <option value="active">Solo activas</option>
            <option value="inactive">Solo inactivas</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div class="skeleton h-12 w-full"></div>
      <div class="skeleton h-16 w-full"></div>
      <div class="skeleton h-16 w-full"></div>
      <div class="skeleton h-16 w-full"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCategories.length === 0"
      class="text-center py-16 border-2 border-dashed rounded-lg bg-base-100">
      <div class="mx-auto w-20 h-20 text-gray-300 mb-4">
        <IconFolderOff class="w-full h-full" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ searchQuery || statusFilter !== 'all' ? 'No se encontraron resultados' : 'No hay categorías' }}
      </h3>
      <p class="text-sm text-gray-500 max-w-md mx-auto mb-6">
        {{
          searchQuery || statusFilter !== 'all'
            ? "No se encontraron categorías que coincidan con tu búsqueda. Intenta con otros términos o ajusta los filtros."
            : "Aún no has creado ninguna categoría. Las categorías te ayudan a organizar tus productos y servicios."
        }}
      </p>
      <div class="flex justify-center gap-3">
        <button v-if="searchQuery || statusFilter !== 'all'" @click="resetFilters" class="btn btn-ghost">
          Limpiar filtros
        </button>
        <button @click="openCreateModal" class="btn bg-red-800 hover:bg-red-900 text-white">
          <IconPlus class="w-4 h-4 mr-2" />
          {{ searchQuery || statusFilter !== 'all' ? 'Crear nueva categoría' : 'Crear mi primera categoría' }}
        </button>
      </div>
    </div>

    <!-- Categories Table -->
    <div v-else class="bg-white rounded-lg shadow">
      <EasyDataTable 
        :headers="tableHeaders" 
        :items="filteredCategories" 
        :search-value="searchQuery" 
        :sort-by="sortBy"
        :sort-type="sortOrder === 'asc' ? 'asc' : 'desc'" 
        table-class-name="customize-table"
        header-text-direction="start" 
        body-text-direction="start" 
        :rows-per-page="filteredCategories.length" 
        :rows-items="[filteredCategories.length]"
        :rows-per-page-message="'Mostrando todas las categorías'" 
        :loading="loading" 
        show-index 
        alternating
        hide-rows-per-page>
        <!-- Color Column -->
        <template #item-color="item">
          <div class="w-4 h-4 rounded-full border border-gray-200"
            :style="{ backgroundColor: item.color || '#e5e7eb' }"></div>
        </template>

        <!-- Status Column -->
        <template #item-active="{ active }">
          <span :class="{
            'badge badge-sm': true,
            'badge-success': active,
            'badge-warning': !active
          }">
            {{ active ? 'Activa' : 'Inactiva' }}
          </span>
        </template>

        <!-- Products/Services Count -->
        <template #item-productOrServices="{ productOrServices }">
          <div v-if="productOrServices?.length > 0" class="tooltip" :data-tip="getProductsTooltip(productOrServices)">
            <span class="badge badge-ghost badge-sm">
              {{ productOrServices.length }} {{ productOrServices.length === 1 ? 'producto/servicio' :
                'productos/servicios' }}
            </span>
          </div>
          <span v-else class="text-gray-400 text-sm">Sin productos</span>
        </template>

        <!-- Updated At -->
        <template #item-updatedAt="{ updatedAt }">
          <span class="text-sm">{{ formatDate(updatedAt) }}</span>
        </template>

        <!-- Actions Column -->
        <template #item-actions="item">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm btn-square">
              <IconDotsVertical class="h-5 w-5" />
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-10">
              <li>
                <a @click="openEditModal(item)">
                  <IconPencil class="h-4 w-4" />
                  Editar
                </a>
              </li>
              <li>
                <a @click="toggleCategoryStatus(item)">
                  <IconCheck v-if="!item.active" class="h-4 w-4 text-success" />
                  <IconX v-else class="h-4 w-4 text-warning" />
                  {{ item.active ? 'Desactivar' : 'Activar' }}
                </a>
              </li>
              <div class="divider my-1"></div>
              <li>
                <a @click="openProductModal(item)" :class="{ 'text-gray-400': !item.active }" :disabled="!item.active">
                  <IconPackage class="h-4 w-4" />
                  Gestionar Productos/Servicios
                </a>
              </li>
              <div class="divider my-1"></div>
              <li>
                <a @click="confirmDelete(item._id)" class="text-error">
                  <IconTrash class="h-4 w-4" />
                  Eliminar
                </a>
              </li>
            </ul>
          </div>
        </template>
      </EasyDataTable>
    </div>

    <!-- Create/Edit Category Modal -->
    <NewCategoryModal :is-open="isOpen" :category="editingCategory" @refresh="getCategories" @close="closeModal" />

    <!-- Delete Confirmation Modal -->
    <dialog id="deleteModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">¿Eliminar categoría?</h3>
        <p class="py-4">¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.</p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button class="btn">Cancelar</button>
            <button class="btn btn-error" @click="deleteCategory">Eliminar</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Modal para gestionar productos/servicios -->
    <div v-if="showProductModal" class="modal modal-open">
      <div class="modal-box max-w-3xl">
        <h3 class="font-bold text-lg mb-4">
          {{ selectedCategory?.name }} - Gestionar Productos/Servicios
        </h3>
        <div class="space-y-4">
          <!-- Lista de productos/servicios existentes -->
          <div class="space-y-2">
            <h4 class="font-medium">Productos/Servicios:</h4>
            <div v-if="currentProducts.length > 0" class="space-y-2">
              <ul class="space-y-2">
                <li v-for="(product, index) in currentProducts" :key="index" class="flex justify-between items-center p-2 bg-base-200 rounded">
                  <span>{{ product.name || product }}</span>
                  <button @click="removeProductFromCategory(product._id || index)" class="btn btn-ghost btn-xs text-error">
                    <IconTrash class="w-4 h-4" />
                  </button>
                </li>
              </ul>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No hay productos/servicios registrados. Agrega uno nuevo abajo.
            </div>
          </div>
          
          <!-- Formulario para agregar nuevo producto/servicio -->
          <div class="border-t pt-4 mt-4">
            <h4 class="font-medium mb-2">Agregar nuevo producto/servicio:</h4>
            <div class="flex gap-2">
              <input
                v-model="newProduct.name"
                id="newProductName"
                type="text"
                placeholder="Nombre del producto/servicio"
                class="input input-bordered w-full"
                @keyup.enter="addProductToCategory"
                ref="productNameInput"
              />
              <button @click="addProductToCategory" class="btn btn-primary" :disabled="!newProduct.name?.trim()">
                Agregar
              </button>
            </div>
            <div class="mt-2">
              <textarea
                v-model="newProduct.description"
                class="textarea textarea-bordered w-full"
                placeholder="Descripción (opcional)"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="modal-action">
          <button class="btn" @click="closeProductModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useDate } from '@/utils/dateTool';
import categoryServices from '@/services/categoriesServices';
import NewCategoryModal from '@/components/CategoriesView/NewCategoryModal.vue';

// Icons
import { 
  IconPlus, 
  IconSearch, 
  IconFolderOff, 
  IconDotsVertical, 
  IconPencil, 
  IconCheck, 
  IconX, 
  IconPackage, 
  IconTrash 
} from '@tabler/icons-vue';

const { authHeader } = useAuth();
const { formatDate } = useDate();

// State
const categories = ref([]);
const searchQuery = ref('');
const statusFilter = ref('all');
const loading = ref(false);
const isOpen = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);
const sortBy = ref('name');
const sortOrder = ref('asc');

// Product management state
const showProductModal = ref(false);
const selectedCategory = ref(null);
const currentProducts = ref([]);
const newProduct = ref({ name: '', description: '' });

// Move the openProductModal function here
const openProductModal = (category) => {
  if (!category.active) return;
  
  selectedCategory.value = category;
  currentProducts.value = [...(category.productOrServices || [])];
  showProductModal.value = true;
  
  // Si la categoría no tiene productos ni servicios, enfocar automáticamente en el campo de nuevo producto
  if (!category.productOrServices?.length) {
    // Usamos nextTick para asegurarnos de que el modal esté completamente renderizado
    nextTick(() => {
      const productNameInput = document.querySelector('#newProductName');
      if (productNameInput) {
        productNameInput.focus();
      }
    });
  }
};

// Table headers configuration
const tableHeaders = [
  { text: 'Color', value: 'color', sortable: true, width: '80px' },
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'Estado', value: 'active', sortable: true, width: '120px' },
  { text: 'Productos/Servicios', value: 'productOrServices', sortable: true, width: '180px' },
  { text: 'Última actualización', value: 'updatedAt', sortable: true, width: '180px' },
  { text: 'Acciones', value: 'actions', sortable: false, width: '100px' }
];


// Computed
const filteredCategories = computed(() => {
  let result = [...categories.value];

  // Apply status filter
  if (statusFilter.value === 'active') {
    result = result.filter(category => category.active);
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(category => !category.active);
  }

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(category =>
      category.name.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;
    if (a[sortBy.value] > b[sortBy.value]) {
      comparison = 1;
    } else if (a[sortBy.value] < b[sortBy.value]) {
      comparison = -1;
    }
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });

  return result;
});

// Methods

const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
};

// Methods
const getCategories = async () => {
  loading.value = true;
  try {
    const response = await categoryServices.getCategories(authHeader.value);
    if (response.code === "ERR_NETWORK") {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      categories.value = response.data || [];
    }
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    toast.error(err.response?.data?.message || 'Error al cargar las categorías');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingCategory.value = null;
  isOpen.value = true;
};

const openEditModal = (category) => {
  editingCategory.value = { ...category };
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  editingCategory.value = null;
};

const confirmDelete = (categoryId) => {
  categoryToDelete.value = categoryId;
  document.getElementById('deleteModal').showModal();
};

const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  try {
    await categoryServices.deleteCategory(categoryToDelete.value, authHeader.value);
    toast.success('Categoría eliminada correctamente');
    getCategories();
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    toast.error(error.response?.data?.message || 'Error al eliminar la categoría');
  } finally {
    categoryToDelete.value = null;
    document.getElementById('deleteModal').close();
  }
};

const toggleCategoryStatus = async (category) => {
  try {
    const newStatus = !category.active;
    await categoryServices.updateCategory(
      category._id,
      { update: { active: newStatus } },
      authHeader.value
    );

    // Update local state
    const index = categories.value.findIndex(c => c._id === category._id);
    if (index !== -1) {
      categories.value[index].active = newStatus;
    }

    toast.success(`Categoría ${newStatus ? 'activada' : 'desactivada'} correctamente`);
  } catch (error) {
    console.error('Error al cambiar estado de la categoría:', error);
    toast.error(error.response?.data?.message || 'Error al actualizar la categoría');
  }
};

// Generate tooltip text for products/services
const getProductsTooltip = (products) => {
  if (!products?.length) return '';
  return products.map(p => p.name).join('\n');
};

// Métodos para gestión de productos
const closeProductModal = () => {
  showProductModal.value = false;
  selectedCategory.value = null;
  currentProducts.value = [];
  newProduct.value = { name: '', description: '' };
};

const addProductToCategory = async () => {
  if (!newProduct.value.name?.trim()) return;

  try {
    loading.value = true;
    const response = await categoryServices.createProductOrService(
      {
        category: selectedCategory.value._id,
        name: newProduct.value.name.trim(),
        description: newProduct.value.description?.trim() || ''
      },
      authHeader.value
    );

    if (response.data) {
      currentProducts.value.push(response.data);
      newProduct.value = { name: '', description: '' };
      toast.success('Producto/servicio agregado correctamente');
      
      // Actualizar la lista de categorías
      const categoryIndex = categories.value.findIndex(c => c._id === selectedCategory.value._id);
      if (categoryIndex !== -1) {
        if (!categories.value[categoryIndex].productOrServices) {
          categories.value[categoryIndex].productOrServices = [];
        }
        categories.value[categoryIndex].productOrServices.push(response.data);
      }
    }
  } catch (error) {
    console.error('Error al agregar producto/servicio:', error);
    toast.error(error.response?.data?.message || 'Error al agregar el producto/servicio');
  } finally {
    loading.value = false;
  }
};

const removeProductFromCategory = async (productId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto/servicio?')) {
    return;
  }

  try {
    loading.value = true;
    await categoryServices.deleteProductOrService(productId, authHeader.value);
    
    // Actualizar la lista local
    currentProducts.value = currentProducts.value.filter(p => 
      (p._id ? p._id !== productId : p !== productId)
    );
    
    // Actualizar la categoría en la lista
    const categoryIndex = categories.value.findIndex(c => c._id === selectedCategory.value._id);
    if (categoryIndex !== -1 && categories.value[categoryIndex].productOrServices) {
      categories.value[categoryIndex].productOrServices = 
        categories.value[categoryIndex].productOrServices.filter(p => 
          (p._id ? p._id !== productId : p !== productId)
        );
    }
    
    toast.success('Producto/servicio eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar producto/servicio:', error);
    toast.error(error.response?.data?.message || 'Error al eliminar el producto/servicio');
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  getCategories();
});

</script>

<style scoped>
/* Custom styles for EasyDataTable */
:deep(.customize-table) {
  --easy-table-header-font-size: 0.875rem;
  --easy-table-header-font-color: #4b5563;
  --easy-table-header-background-color: #f9fafb;
  --easy-table-header-font-weight: 600;
  --easy-table-header-height: 3rem;

  --easy-table-body-row-height: 3.5rem;
  --easy-table-body-row-font-size: 0.875rem;
  --easy-table-body-row-hover-background-color: #f3f4f6;
  
  --easy-table-border: 1px solid #e5e7eb;
  --easy-table-scrollbar-display: none;
  --easy-table-scrollbar-track-color: transparent;
  --easy-table-scrollbar-thumb-color: transparent;
  --easy-table-scrollbar-thumb-hover-color: transparent;
  
  /* Disable table body scrolling */
  --easy-table-body-scrollbar-width: 0;
  --easy-table-body-scrollbar-height: 0;
  overflow: visible !important;
  
  /* Ensure table takes full width */
  width: 100% !important;
  --easy-table-row-border: 1px solid #e5e7eb;
}

:deep(.easy-table) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.easy-table th) {
  text-transform: none;
  letter-spacing: normal;
}

:deep(.easy-table tr:last-child td) {
  border-bottom: none;
}

:deep(.easy-table-body tbody tr:last-child) {
  border-bottom: none;
}

/* Pagination styles */
:deep(.pagination) {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

:deep(.pagination-buttons) {
  display: flex;
  gap: 0.5rem;
}

:deep(.pagination-button) {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.pagination-button:hover) {
  background-color: #f3f4f6;
}

:deep(.pagination-button.active) {
  background-color: #991b1b;
  color: white;
  border-color: #991b1b;
}

:deep(.pagination-button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Search input */
:deep(.easy-table-search) {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  width: 100%;
  max-width: 24rem;
}

/* Rows per page selector */
:deep(.rows-selector) {
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  appearance: none;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>