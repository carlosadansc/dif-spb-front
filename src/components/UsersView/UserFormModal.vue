<template>
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-3xl">
      <button class="btn btn-sm btn-circle absolute right-2 top-2" @click="closeModal">✕</button>
      <h3 class="text-lg font-bold mb-4">{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombre -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="Nombre" 
              class="input input-bordered w-full" 
              required
            />
          </div>

          <!-- Apellido -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Apellido</span>
            </label>
            <input 
              v-model="formData.lastname" 
              type="text" 
              placeholder="Apellido" 
              class="input input-bordered w-full" 
              required
            />
          </div>

          <!-- Usuario -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Usuario</span>
            </label>
            <input 
              v-model="formData.username" 
              type="text" 
              placeholder="Nombre de usuario" 
              class="input input-bordered w-full" 
              :disabled="isEditing"
              required
              pattern="[a-zA-Z0-9_]+"
              title="Solo se permiten letras, números y guiones bajos"
            />
          </div>

          <!-- Área -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Área</span>
            </label>
            <select 
              v-model="formData.area" 
              class="select select-bordered w-full"
              required
            >
              <option value="">Ninguna</option>
              <option 
                v-for="area in areas" 
                :key="area._id" 
                :value="area._id"
              >
                {{ area.name }}
              </option>
            </select>
          </div>

          <!-- Cargo -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Cargo</span>
            </label>
            <input 
              v-model="formData.position" 
              type="text" 
              placeholder="Cargo" 
              class="input input-bordered w-full"
            />
          </div>

          <!-- Tipo de Usuario -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Tipo de Usuario</span>
            </label>
            <select 
              v-model="formData.userType" 
              class="select select-bordered w-full"
              required
            >
              <option value="user">Usuario común</option>
              <option value="executive">Ejecutivo</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <!-- Contraseña (solo para nuevo usuario o al cambiar contraseña) -->
          <div class="form-control" v-if="!isEditing || showPasswordFields">
            <label class="label">
              <span class="label-text">{{ isEditing ? 'Nueva Contraseña' : 'Contraseña' }}</span>
            </label>
            <div class="relative">
              <input 
                v-model="formData.password" 
                :type="showPassword ? 'text' : 'password'" 
                :placeholder="isEditing ? 'Dejar en blanco para no cambiar' : 'Contraseña'" 
                class="input input-bordered w-full pr-10"
                :required="!isEditing"
                minlength="8"
                pattern="^(?=.*[A-Za-z])(?=.*\d).{8,}$"
                title="La contraseña debe tener al menos 8 caracteres con letras y números"
              />
              <button 
                type="button" 
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <IconEye v-if="!showPassword" class="h-5 w-5" />
                <IconEyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-control" v-if="!isEditing || showPasswordFields">
            <label class="label">
              <span class="label-text">{{ isEditing ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña' }}</span>
            </label>
            <input 
              v-model="confirmPassword" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Confirmar contraseña" 
              class="input input-bordered w-full"
              :required="!isEditing"
            />
            <span v-if="passwordMismatch" class="text-error text-sm">Las contraseñas no coinciden</span>
          </div>
        </div>

        <!-- Estado (solo para edición) -->
        <div class="form-control" v-if="isEditing">
          <label class="label cursor-pointer justify-start gap-2">
            <input 
              type="checkbox" 
              v-model="formData.active" 
              class="toggle toggle-primary" 
            />
            <span class="label-text">Usuario activo</span>
          </label>
        </div>

        <div class="modal-action">
          <button 
            type="button" 
            class="btn btn-ghost" 
            @click="closeModal"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || passwordMismatch"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { IconEye, IconEyeOff } from '@tabler/icons-vue';
import userServices from '@/services/userServices';
import { useAuth } from '@/composables/useAuth';
import areaServices from '@/services/areaServices';
import { normalizeObjectTextProperties, normalizeText } from '@/utils/normalizeObjectText';

const { authHeader } = useAuth();

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const loading = ref(false);
const showPassword = ref(false);
const showPasswordFields = ref(false);
const confirmPassword = ref('');
const areas = ref([]);

const fetchAreas = async () => {
  try {
    loading.value = true;
    const response = await areaServices.getAreas(authHeader.value);
    areas.value = response;
  } catch (error) {
    console.error('Error fetching areas:', error.response?.data?.errors || ['Error al cargar las áreas']);
    toast.error(error.response?.data?.errors || ['Error al cargar las áreas']);
  } finally {
    loading.value = false;
  }
};

const formData = ref({
  name: '',
  lastname: '',
  username: '',
  area: '',
  position: '',
  userType: 'user',
  password: '',
  active: true
});

const isEditing = computed(() => !!props.user);

const passwordMismatch = computed(() => {
  if ((!isEditing.value || showPasswordFields.value) && formData.value.password) {
    return formData.value.password !== confirmPassword.value;
  }
  return false;
});

// Initialize form with user data if editing
onMounted(() => {
  if (props.user) {
    const { _id, __v, createdAt, updatedAt, ...userData } = props.user;
    formData.value = { ...formData.value, ...userData };
  }

  fetchAreas();
});

const resetForm = () => {
  formData.value = {
    name: '',
    lastname: '',
    username: '',
    area: '',
    position: '',
    userType: 'user',
    password: '',
    active: true
  };
  confirmPassword.value = '';
  showPasswordFields.value = false;
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  if (passwordMismatch.value) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  loading.value = true;
  try {
    let response;
    
    if (isEditing.value) {
      // Remove password if not changing it
      const update = { ...formData.value };
      if (!showPasswordFields.value) {
        delete update.password;
      } else if (!update.password) {
        // If password fields are shown but empty, don't send password
        delete update.password;
      }
      
      const updateData = {
        name: normalizeText(update.name),
        lastname: normalizeText(update.lastname),
        username: update.username,
        area: update.area,
        position: normalizeText(update.position),
        userType: update.userType,
        password: update.password,
        active: update.active
      };

      response = await userServices.updateUser(
        props.user._id, 
        { update : updateData },
        authHeader.value
      );
      toast.success('Usuario actualizado correctamente');
    } else {
      const create = {
        name: normalizeText(formData.value.name),
        lastname: normalizeText(formData.value.lastname),
        username: formData.value.username,
        area: formData.value.area,
        position: normalizeText(formData.value.position),
        userType: formData.value.userType,
        password: formData.value.password,
        active: formData.value.active
      };
      response = await userServices.createUser(
        create,
        authHeader.value
      );
      toast.success('Usuario creado correctamente');
    }
    
    emit('saved');
    closeModal();
  } catch (error) {
    console.error('Error saving user:', error);
    const errorMessage = error.response?.data?.message || 'Error al guardar el usuario';
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      const { _id, __v, createdAt, updatedAt, ...userData } = newUser;
      formData.value = { ...formData.value, ...userData };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Add any custom styles here */
</style>
