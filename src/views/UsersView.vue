<template>
  <div class="app-page">
    <AppPageHeader title="Usuarios" description="Administra accesos, roles y estado de las cuentas del sistema.">
      <template #icon><IconUserCog class="h-6 w-6" /></template>
      <button @click="openUserForm()" class="btn btn-brand min-h-11">
        <IconPlus class="w-4 h-4 mr-2" />
        Nuevo usuario
      </button>
    </AppPageHeader>

    <div class="toolbar-panel">
      <div class="card-body p-0">
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <!-- Búsqueda -->
          <label class="input input-bordered flex items-center gap-2 grow">
            <input v-model="search" type="text" class="grow" placeholder="Buscar por nombre, usuario o cargo..." />
            <IconSearch class="h-5 w-5" />
          </label>

          <!-- Filtro de estado -->
          <select v-model="statusFilter" class="select select-bordered w-full md:w-48">
            <option value="all">Todos los estados</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>

          <!-- Filtro de tipo de usuario -->
          <select v-model="userTypeFilter" class="select select-bordered w-full md:w-52">
            <option value="">Todos los tipos</option>
            <option value="admin">Administradores</option>
            <option value="executive">Ejecutivos</option>
            <option value="user">Usuarios</option>
          </select>
        </div>
      </div>
    </div>

    <div class="surface-panel overflow-hidden">
      <EasyDataTable
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        rows-per-page-message="Usuarios por página:"
        alternating
      >
        <template #item-userType="{ userType }">
          <span class="badge" :class="{
            'badge-primary': userType === 'admin',
            'badge-accent': userType === 'user',
            'badge-warning': userType === 'executive'
          }">
            {{ userTypeLabels[userType] || userType }}
          </span>
        </template>

        <template #item-active="{ active }">
          <span class="badge" :class="active ? 'badge-success' : 'badge-error'">
            {{ active ? 'Activo' : 'Inactivo' }}
          </span>
        </template>

        <template #item-actions="item">
          <div class="flex space-x-1">
            <button @click="editUser(item)" class="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50" title="Editar" aria-label="Editar usuario">
              <IconPencil class="h-4 w-4" />
            </button>
            <button 
              @click.prevent="toggleUserStatus(item)" 
              class="btn btn-ghost btn-xs"
              :class="item.active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-yellow-50'"
              :title="item.active ? 'Desactivar usuario' : 'Activar usuario'"
              :aria-label="item.active ? 'Desactivar usuario' : 'Activar usuario'"
            >
              <IconToggleLeft v-if="!item.active" class="h-4 w-4" />
              <IconToggleRight v-else class="h-4 w-4" />
            </button>
            <button 
              v-if="item.userType !== 'admin'"
              @click="confirmDelete(item)" 
              class="btn btn-ghost btn-xs text-red-600 hover:bg-red-50"
              :disabled="item.deleted"
              title="Eliminar usuario"
              aria-label="Eliminar usuario"
            >
              <IconTrash class="h-4 w-4" />
            </button>
          </div>
        </template>
      </EasyDataTable>
    </div>

    <!-- User Form Modal -->
    <UserFormModal 
      v-if="showUserForm"
      :user="editingUser"
      @close="closeUserForm"
      @saved="handleUserSaved"
    />

    <ConfirmDeleteModal :show="showDeleteModal" title="Eliminar usuario"
      :message="`¿Deseas eliminar al usuario ${userToDelete?.name || ''}?`"
      warning-message="Esta acción no se puede deshacer." @confirm="deleteUser" @close="showDeleteModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import userServices from '@/services/userServices';
import { useAuth } from '@/composables/useAuth';
import UserFormModal from '@/components/UsersView/UserFormModal.vue';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';
import { IconPlus, IconPencil, IconToggleLeft, IconToggleRight, IconTrash, IconSearch, IconUserCog } from '@tabler/icons-vue';
import 'vue3-easy-data-table/dist/style.css';

const { authHeader } = useAuth();

// Data
const loading = ref(false);
const search = ref('');
const statusFilter = ref('all');
const userTypeFilter = ref('');
const users = ref([]);
const editingUser = ref(null);
const showUserForm = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Table configuration
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'name',
  sortType: 'asc',
});

const serverItemsLength = ref(0);

const headers = [
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'Apellido', value: 'lastname', sortable: true },
  { text: 'Usuario', value: 'username', sortable: true },
  { text: 'Cargo', value: 'position', sortable: true },
  { text: 'Tipo', value: 'userType', sortable: true },
  { text: 'Estado', value: 'active', sortable: true },
  { text: 'Acciones', value: 'actions', sortable: false, width: '120px' }
];

const userTypeLabels = {
  admin: 'Administrador',
  executive: 'Ejecutivo',
  user: 'Usuario común'
};

// Computed
const filteredUsers = computed(() => {
  let result = [...users.value];
  
  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(user => 
      (user.name?.toLowerCase().includes(searchTerm) ||
      user.lastname?.toLowerCase().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchTerm) ||
      user.position?.toLowerCase().includes(searchTerm))
    );
  }

  // Apply status filter
  if (statusFilter.value === 'active') {
    result = result.filter(user => user.active);
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(user => !user.active);
  }

  // Apply user type filter
  if (userTypeFilter.value) {
    result = result.filter(user => user.userType === userTypeFilter.value);
  }

  // Update server items length for pagination
  serverItemsLength.value = result.length;
  
  // Apply sorting
  if (serverOptions.value.sortBy) {
    result.sort((a, b) => {
      let aValue = a[serverOptions.value.sortBy];
      let bValue = b[serverOptions.value.sortBy];
      
      // Handle nested properties if needed
      if (serverOptions.value.sortBy.includes('.')) {
        const props = serverOptions.value.sortBy.split('.');
        aValue = props.reduce((obj, prop) => obj?.[prop], a);
        bValue = props.reduce((obj, prop) => obj?.[prop], b);
      }
      
      if (aValue < bValue) return serverOptions.value.sortType === 'asc' ? -1 : 1;
      if (aValue > bValue) return serverOptions.value.sortType === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const start = (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage;
  const end = start + serverOptions.value.rowsPerPage;
  return result?.slice(start, end);
});

// Methods
const getUsersData = async () => {
  loading.value = true;
  try {
    const response = await userServices.getUsers(authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor');
    } else {
      users.value = response.data || [];
    }
  } catch (err) {
    handleError(err);
  } finally {
    loading.value = false;
  }
};

const openUserForm = (user = null) => {
  editingUser.value = user ? { ...user } : null;
  showUserForm.value = true;
};

const closeUserForm = () => {
  showUserForm.value = false;
  editingUser.value = null;
};

const handleUserSaved = () => {
  getUsersData();
  closeUserForm();
};

const editUser = (user) => {
  openUserForm(user);
};

const toggleUserStatus = async (user) => {
  try {
    const response = await userServices.updateUser(
      user._id, 
      { update: { active: !user.active } }, 
      authHeader.value
    );

    if (response.data) {
      user.active = !user.active;
      toast.success(`Usuario ${user.active ? 'activado' : 'desactivado'} correctamente`);
      getUsersData(); // Refresh the list
    } else {
      toast.error('Error al actualizar el estado del usuario');
    }
  } catch (err) {
    handleError(err);
  }
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  try {
    const response = await userServices.deleteUser(
      userToDelete.value._id, 
      authHeader.value
    );
    
    if (response.success) {
      toast.success('Usuario eliminado correctamente');
      getUsersData();
    }
  } catch (err) {
    handleError(err);
  } finally {
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};

const handleError = (err) => {
  console.error('Error:', err);
  const errorMessage = err.response?.data?.message || 'Ocurrió un error inesperado';
  toast.error(errorMessage);};

// Lifecycle hooks
onMounted(() => {
  getUsersData();
});

// Watch for filter changes
watch([search, statusFilter, userTypeFilter], () => {
  serverOptions.value.page = 1; // Reset to first page when filters change
});

// Watch for server options changes
watch(serverOptions, () => {
  // This will trigger a re-render of the table with new sorting/pagination
}, { deep: true });
</script>

<style scoped>
/* Custom styles */
.table th {
  background-color: var(--fallback-b2, var(--b2));
}

.table tr:hover {
  background-color: var(--fallback-b1, var(--b1));
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table {
    display: block;
    overflow-x: auto;
  }
  
  .table thead {
    display: none;
  }
  
  .table tr {
    display: block;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--fallback-b2, var(--b2));
    padding-bottom: 1rem;
  }
  
  .table td {
    display: block;
    text-align: right;
  }
  
  .table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    margin-right: 0.5rem;
  }
  
  .table td:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}
</style>
