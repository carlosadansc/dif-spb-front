<template>
    <dialog :class="{ 'modal modal-open': isOpen, 'modal': !isOpen }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Nuevo Apoyo</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">

            <div class="form-control">
              <label class="label">
                <span class="label-text">Nombre</span>
              </label>
              <input 
                type="text" 
                v-model="formData.name"
                class="input input-bordered w-full" 
                required
              />
            </div>
  
            <div class="form-control">
              <label class="label">
                <span class="label-text">Descripción</span>
              </label>
              <textarea 
                v-model="formData.description"
                class="textarea textarea-bordered h-24"
                required
              ></textarea>
            </div>
          </div>
  
          <div class="modal-action">
            <button 
              type="button" 
              class="btn btn-ghost"
              @click="closeModal"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="loading"
            >
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
  import { useAuth } from '@/composables/useAuth';
  import { toast } from 'vue3-toastify';
  import categoriesServices from '@/services/categoriesServices';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['close', 'refresh']);
  const { authHeader } = useAuth();
  const loading = ref(false);
  
  const formData = ref({
    category: '',
    name: '',
    description: ''
  });
  
  const closeModal = () => {
    emit('close');
    resetForm();
  };
  
  const handleSubmit = async () => {
    try {
      loading.value = true;
      formData.value.category = props.category;
      const response = await categoriesServices.createProductOrService(formData.value, authHeader.value);
      if (response.code === "ERR_NETWORK") {
        toast.error('No se pudo conectar con el servidor');
      } else {
        toast.success('Apoyo creado exitosamente');
        emit('refresh');
        closeModal();
      }
    } catch (error) {
      toast.error('Error al crear el apoyo');
      console.error('Error saving product:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const resetForm = () => {
    formData.value = {
      category: '',
      name: '',
      description: ''
    };
  };
  </script>