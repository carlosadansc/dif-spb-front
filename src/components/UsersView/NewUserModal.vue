<template>
  <div v-if="showModal" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ userToEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h3>
      
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Nombre(s)</span></label>
            <input v-model="form.name" type="text" placeholder="Nombre(s)" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Apellido(s)</span></label>
            <input v-model="form.lastname" type="text" placeholder="Apellido(s)" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Nombre de usuario</span></label>
            <input v-model="form.username" type="text" placeholder="ej. carlos.perez" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Cargo</span></label>
            <input v-model="form.position" type="text" placeholder="Ej. Coordinador" class="input input-bordered" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Contraseña</span></label>
            <input v-model="form.password" type="password" :placeholder="userToEdit ? 'Dejar en blanco para no cambiar' : ''" class="input input-bordered" :required="!userToEdit" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Tipo de usuario</span></label>
            <select v-model="form.userType" class="select select-bordered" required>
              <option disabled value="">Selecciona un tipo</option>
              <option value="admin">Administrador</option>
              <option value="manager">Gerente</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Área</span></label>
            <select v-model="form.area" class="select select-bordered" required>
              <option disabled value="">Selecciona un área</option>
              <option v-for="area in areas" :key="area._id" :value="area._id">{{ area.name }}</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer"><span class="label-text">Usuario Activo</span></label>
            <input v-model="form.active" type="checkbox" class="toggle toggle-success" />
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn" @click="closeModal">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading loading-spinner"></span>
            {{ userToEdit ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import userServices from '../../services/userServices';
import { useAuth } from '../../composables/useAuth';

const props = defineProps({
  showModal: Boolean,
  userToEdit: Object,
  areas: Array,
});

const emit = defineEmits(['close:modal', 'refresh:users']);

const { authHeader } = useAuth();
const form = ref({});
const isSubmitting = ref(false);

const getInitialForm = () => ({
  name: '',
  lastname: '',
  username: '',
  position: '',
  password: '',
  userType: '',
  area: '',
  active: true,
});

watch(() => props.showModal, (newVal) => {
  if (newVal) {
    if (props.userToEdit) {
      form.value = { ...props.userToEdit };
    } else {
      form.value = getInitialForm();
    }
  } else {
    form.value = getInitialForm();
  }
}, { immediate: true });

const closeModal = () => {
  emit('close:modal');
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    if (props.userToEdit) {
      // Lógica de actualización
      await userServices.updateUser(form.value._id, form.value, authHeader.value);
      toast.success('Usuario actualizado correctamente');
    } else {
      // Lógica de creación
      await userServices.createUser(form.value, authHeader.value);
      toast.success('Usuario creado correctamente');
    }
    emit('refresh:users');
    closeModal();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error al procesar la solicitud');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
