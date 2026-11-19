<template>
  <div v-if="show" class="modal modal-open" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="modal-box w-full max-w-md">
        <AppModalHeader :title="editingArea ? 'Editar área' : 'Nueva área'"
          description="Define el nombre y, si aplica, el área de la que depende." @close="$emit('close')">
          <template #icon><IconSitemap class="h-5 w-5" /></template>
        </AppModalHeader>
        
        <form @submit.prevent="$emit('save')">
          <div class="form-control">
            <label class="mb-1 block text-sm font-semibold text-gray-700" for="name">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              id="name"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.name }"
              maxlength="100"
            />
            <p v-if="errors.name" class="mt-1 text-xs font-medium text-red-700" role="alert">{{ errors.name }}</p>
          </div>

          <div class="form-control mt-4">
            <label class="mb-1 block text-sm font-semibold text-gray-700" for="parentArea">
              Área superior
            </label>
            <select
              v-model="formData.parentArea"
              id="parentArea"
              class="select select-bordered w-full"
            >
              <option :value="null">Ninguna</option>
              <option 
                v-for="area in availableParentAreas" 
                :key="area._id" 
                :value="area._id"
                :disabled="isCircularReference(area._id)"
              >
                {{ area.name }}
              </option>
            </select>
            <p v-if="errors.parentArea" class="mt-1 text-xs font-medium text-red-700" role="alert">{{ errors.parentArea }}</p>
          </div>

          <div class="modal-action">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-brand min-w-28"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Guardando...' : 'Guardar área' }}
            </button>
          </div>
        </form>
    </div>
  </div>
</template>

<script setup>
import { IconSitemap } from '@tabler/icons-vue';
import AppModalHeader from '@/components/ui/AppModalHeader.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  editingArea: {
    type: Object,
    default: null
  },
  availableParentAreas: {
    type: Array,
    default: () => []
  },
  isCircularReference: {
    type: Function,
    required: true
  }
});

defineEmits(['close', 'save']);
</script>
