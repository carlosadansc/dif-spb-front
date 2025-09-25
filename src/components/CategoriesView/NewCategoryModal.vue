<template>
  <dialog :class="{ 'modal modal-open': isOpen, 'modal': !isOpen }">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Editar' : 'Nueva' }} Categoría</h3>

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
            <input type="color" v-model="formData.color" class="w-10 h-10 border-none cursor-pointer" />
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
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import { normalizeText } from '@/utils/normalizeObjectText';
import { createLabel } from '@/utils/createLabel';
import categoriesServices from '@/services/categoriesServices';

const { authHeader } = useAuth();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  category: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'refresh']);

const loading = ref(false);
const isEditing = ref(false);
const formData = ref({
  name: '',
  label: '',
  description: '',
  color: '#FF0000',
  productOrServices: []
});

const resetForm = () => {
  formData.value = {
    name: '',
    label: '',
    description: '',
    color: '#FF0000'
  };
};

watch(() => props.category, (newCategory) => {
  if (newCategory) {
    isEditing.value = true;
    formData.value = {
      name: newCategory.name,
      label: newCategory.label,
      description: newCategory.description || '',
      color: newCategory.color || '#FF0000',
      productOrServices: newCategory.productOrServices || []
    };
  } else {
    isEditing.value = false;
    resetForm();
  }
}, { immediate: true });

const closeModal = () => {
  emit('close');
  resetForm();
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    
    let response;
    if (isEditing.value && props.category?._id) {
      // Update existing category
      const update = {
        name: normalizeText(formData.value.name),
        label: createLabel(formData.value.name),
        description: normalizeText(formData.value.description),
        color: formData.value.color,
        productOrServices: formData.value.productOrServices
      }
      response = await categoriesServices.updateCategory(
        props.category._id, 
        { update: update }, 
        authHeader.value
      );
      toast.success('Categoría actualizada exitosamente');
    } else {
      // Create new category
      const createData = {
        name: normalizeText(formData.value.name),
        label: createLabel(formData.value.name),
        description: normalizeText(formData.value.description),
        color: formData.value.color,
        productOrServices: formData.value.productOrServices
      }
      response = await categoriesServices.createCategory(createData, authHeader.value);
      toast.success('Categoría creada exitosamente');
    }
    
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor');
    } else {
      emit('refresh');
      closeModal();
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || 'Error al guardar la categoría');
    } else {
      toast.error(err.message || 'Error al guardar la categoría');
    }
  } finally {
    loading.value = false;
  }
};


</script>