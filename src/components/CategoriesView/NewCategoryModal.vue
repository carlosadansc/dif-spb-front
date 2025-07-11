<template>
  <dialog :class="{ 'modal modal-open': isOpen, 'modal': !isOpen }">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Nueva Categoría</h3>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input type="text" v-model="formData.name" class="input input-bordered w-full" required />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Descripción</span>
            </label>
            <textarea v-model="formData.description" class="textarea textarea-bordered h-24"></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Color</span>
            </label>
            <input type="color" v-model="formData.color" class="h-10 w-full rounded-lg" />
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="closeModal">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import { createLabel } from '@/utils/createLabel';
import categoriesServices from '@/services/categoriesServices';

const { authHeader } = useAuth();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'refresh']);

const loading = ref(false);
const formData = ref({
  name: '',
  label: '',
  description: '',
  color: '#FF0000'
});

const closeModal = () => {
  emit('close');
  resetForm();
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    formData.value.label = createLabel(formData.value.name);
    const response = await categoriesServices.createCategory(formData.value, authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      toast.success('Categoría creada exitosamente');
      emit('refresh');
      closeModal();
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
};

const resetForm = () => {
  formData.value = {
    name: '',
    label: '',
    description: '',
    color: '#FF0000'
  };
};
</script>