<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">{{ editingArea ? 'Editar Área' : 'Nueva Área' }}</h2>
        
        <form @submit.prevent="$emit('save')">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              id="name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :class="{ 'border-red-500': errors.name }"
              maxlength="100"
            />
            <p v-if="errors.name" class="text-red-500 text-xs italic">{{ errors.name }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="parentArea">
              Área Padre
            </label>
            <select
              v-model="formData.parentArea"
              id="parentArea"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <p v-if="errors.parentArea" class="text-red-500 text-xs italic">{{ errors.parentArea }}</p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              :disabled="loading"
            >
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin"></i> Guardando...
              </span>
              <span v-else>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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
