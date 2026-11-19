<template>
  <dialog :class="{ 'modal modal-open': isOpen, 'modal': !isOpen }">
    <div class="modal-box">
      <AppModalHeader :title="isEditing ? 'Editar categoría' : 'Nueva categoría'"
        description="Define cómo se agruparán los productos y servicios disponibles." @close="closeModal">
        <template #icon><IconCategory2 class="h-5 w-5" /></template>
      </AppModalHeader>

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
            <input type="color" v-model="formData.color" class="h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-1" aria-label="Color de la categoría" />
          </div>
        </div>

        <div class="modal-action">    
          <button type="button" class="btn btn-ghost" @click="closeModal">
            Cancelar
          </button>
          <button type="submit" class="btn btn-brand min-w-36" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ loading ? 'Guardando...' : 'Guardar categoría' }}
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
import { IconCategory2 } from '@tabler/icons-vue';
import AppModalHeader from '@/components/ui/AppModalHeader.vue';

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
