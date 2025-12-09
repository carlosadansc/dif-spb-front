<template>
  <div class="photo-picker-wrapper">
    <div
      class="photo-picker border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-800 hover:bg-gray-50 transition-colors group relative"
      :class="{ 'border-red-800 bg-gray-50': isUploading, 'has-image': previewUrl && !isDefaultPhoto }"
      @click="openFileSelector">
      <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/gif,image/webp"
        @change="handleFileChange" />

      <!-- Loading State -->
      <div v-if="isUploading" class="flex flex-col items-center z-10">
        <span class="loading loading-spinner text-red-800 loading-md mb-2"></span>
        <span class="text-sm text-gray-500">Subiendo imagen...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="!previewUrl || isDefaultPhoto" class="flex flex-col items-center z-10">
        <IconCamera class="w-8 h-8 text-gray-400 group-hover:text-red-800 mb-2 transition-colors" />
        <span class="text-sm text-gray-600 font-medium text-center">Click para subir foto de perfil</span>
        <span class="text-xs text-gray-400 mt-1">JPG, PNG (Max {{ maxFileSizeMB }}MB)</span>
      </div>

      <!-- Preview State -->
      <div v-else
        class="w-full h-full absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <img :src="previewUrl" alt="Foto de perfil" class="w-full h-full object-cover" @error="onImageError" />

        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <span class="text-white text-sm font-medium">Cambiar foto</span>
          <button v-if="showDeleteButton" class="btn btn-error btn-xs text-white gap-1" @click.stop="confirmDelete"
            title="Eliminar foto">
            <IconTrash size="14" /> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal :show="showDeleteModal" title="Confirmar eliminación"
      message="¿Estás seguro de que deseas eliminar esta foto?"
      warning-message="¡La foto será eliminada permanentemente!" @confirm="deletePhoto"
      @close="showDeleteModal = false" />
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { IconTrash, IconCamera } from '@tabler/icons-vue';
import { useAuth } from '@/composables/useAuth';
import beneficiaryServices from '@/services/beneficiaryServices';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';

// Composables
const { authHeader } = useAuth();

// Define los eventos que este componente puede emitir
const emit = defineEmits(['photo-selected', 'photo-error']);

// Props para recibir una imagen por defecto si ya existe y el CURP del beneficiario
const props = defineProps({
  defaultPhoto: {
    type: String,
    default: 'https://via.placeholder.com/150/cccccc/000000?text=Perfil'
  },
  beneficiaryId: {
    type: String,
    required: true
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB por defecto
  }
});

const fileInput = ref(null);
const currentObjectUrl = ref(null);
const isUploading = ref(false);
const defaultPhoto = ref(props.defaultPhoto);
const previewUrl = ref(defaultPhoto.value);
const showDeleteButton = ref(false);
const showDeleteModal = ref(false);

const maxFileSizeMB = computed(() => (props.maxFileSize / (1024 * 1024)).toFixed(0));

const defaultPhotoPattern = /placeholder\.com|default\.png|^data:image/;
const isDefaultPhoto = computed(() => {
  return !previewUrl.value || defaultPhotoPattern.test(previewUrl.value);
});


// Mostrar/ocultar botón de eliminar según si hay una foto que no sea la predeterminada
watch(() => previewUrl.value, (newUrl) => {
  showDeleteButton.value = !defaultPhotoPattern.test(newUrl);
}, { immediate: true });

const onImageError = (event) => {
  // If error, show default placeholder or broken state
  // event.target.src = 'https://via.placeholder.com/150/cccccc/000000?text=Error';
  // Let logic handle it, maybe revert to generic
};

// Actualizar la referencia local cuando cambie la prop
watch(() => props.defaultPhoto, (newPhoto) => {
  if (newPhoto && newPhoto !== defaultPhoto.value) {
    cleanupObjectUrl();
    defaultPhoto.value = newPhoto;
    previewUrl.value = newPhoto;
  }
});

// Limpiar URL de objeto al desmontar el componente
onUnmounted(() => {
  cleanupObjectUrl();
});

// Función para confirmar eliminación
const confirmDelete = () => {
  if (isUploading.value) return;
  showDeleteModal.value = true;
};

// Función para eliminar la foto
const deletePhoto = async () => {
  if (isUploading.value) return;

  isUploading.value = true;

  try {
    // Eliminar la imagen del servidor si no es la predeterminada
    if (defaultPhoto.value && !defaultPhotoPattern.test(defaultPhoto.value)) {
      try {
        await beneficiaryServices.deleteImage(defaultPhoto.value, authHeader.value);
      } catch (deleteError) {
        console.warn('No se pudo eliminar la imagen del servidor:', deleteError);
      }
    }

    // Restablecer a la imagen predeterminada
    cleanupObjectUrl();
    previewUrl.value = 'https://via.placeholder.com/150/cccccc/000000?text=Perfil';

    // Actualizar el perfil con la foto vacía
    const updateResponse = await beneficiaryServices.updateBeneficiary(
      {
        filter: props.beneficiaryId,
        update: { photo: '' },
      },
      authHeader.value
    );

    if (updateResponse?.errors?.length > 0) {
      throw new Error(updateResponse.errors[0] || 'Error al actualizar el perfil');
    }

    // Actualizar referencias locales
    defaultPhoto.value = previewUrl.value;

    // Cerrar modal y notificar éxito
    showDeleteModal.value = false;
    toast.success('Foto eliminada correctamente');
    emit('photo-selected', ''); // Emit empty string on delete

  } catch (error) {
    console.error('Error al eliminar la foto:', error);
    toast.error(error.message || 'Error al eliminar la foto');
  } finally {
    isUploading.value = false;
  }
};

// Función para limpiar la URL del objeto
const cleanupObjectUrl = () => {
  if (currentObjectUrl.value) {
    URL.revokeObjectURL(currentObjectUrl.value);
    currentObjectUrl.value = null;
  }
};

// Abre el selector de archivos al hacer clic en el div
const openFileSelector = () => {
  if (isUploading.value) return;
  fileInput.value?.click();
};

// Validar archivo
const validateFile = (file) => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    throw new Error('Por favor, selecciona un archivo de imagen válido.');
  }

  // Validar tamaño del archivo
  if (file.size > props.maxFileSize) {
    const maxSizeMB = (props.maxFileSize / (1024 * 1024)).toFixed(1);
    throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
  }

  // Validar extensión
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !allowedExtensions.includes(fileExt)) {
    throw new Error('Formato de archivo no válido. Use JPG, PNG, GIF o WebP.');
  }

  return true;
};

// Se ejecuta cuando el usuario selecciona un archivo
const handleFileChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Prevenir múltiples uploads simultáneos
  if (isUploading.value) {
    toast.warning('Ya hay una imagen siendo procesada. Espera un momento.');
    return;
  }

  isUploading.value = true;
  let errorMessage = 'Error al procesar la imagen';

  try {
    // 1. Validar archivo
    validateFile(file);

    // 2. Mostrar vista previa
    cleanupObjectUrl();
    currentObjectUrl.value = URL.createObjectURL(file);
    previewUrl.value = currentObjectUrl.value;

    // 3. Subir la nueva imagen primero
    const formData = new FormData();
    formData.append('image', file);

    const uploadResponse = await beneficiaryServices.uploadImage(formData, authHeader.value);
    const { filePath } = uploadResponse.data;

    // 4. Si la subida fue exitosa, eliminar la imagen anterior si existe y no es la predeterminada
    if (defaultPhoto.value && !defaultPhotoPattern.test(defaultPhoto.value) && defaultPhoto.value !== filePath) {
      try {
        await beneficiaryServices.deleteImage(defaultPhoto.value, authHeader.value);
      } catch (deleteError) {
        console.warn('No se pudo eliminar la imagen anterior:', deleteError);
        // No hacemos throw aquí para no interrumpir el flujo
      }
    }

    // Actualizar la referencia local con la nueva ruta
    defaultPhoto.value = filePath;

    // 5. Actualizar la ruta de la foto en el beneficiario
    const updateResponse = await beneficiaryServices.updateBeneficiary(
      {
        filter: props.beneficiaryId,
        update: { photo: filePath },
      },
      authHeader.value
    );

    if (updateResponse?.errors?.length > 0) {
      throw new Error(updateResponse.errors[0] || 'Error al actualizar la foto del beneficiario');
    }

    // Emitir el evento con la nueva ruta de la foto
    // El componente padre debe actualizar la propiedad defaultPhoto
    emit('photo-selected', filePath);

    // 5. Notificar éxito
    toast.success('Imagen actualizada correctamente');

  } catch (error) {
    console.error('Error en handleFileChange:', error);

    // Determinar mensaje de error apropiado
    if (error.name === 'ValidationError') {
      errorMessage = error.message;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Tiempo de espera agotado. La imagen puede ser demasiado grande.';
    } else if (error.code === 401) {
      errorMessage = 'No tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente.';
    } else if (error.code === 413) {
      errorMessage = 'El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.';
    } else if (error.response?.data?.errors) {
      errorMessage = error.response.data.errors.join('\n');
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Mostrar notificación de error
    toast.error(errorMessage);

    // Restaurar imagen anterior
    cleanupObjectUrl();
    previewUrl.value = props.defaultPhoto;

    // Emitir evento de error
    emit('photo-error', {
      error: errorMessage,
      file,
      code: error.code,
      details: error.response?.data,
    });

  } finally {
    isUploading.value = false;
    // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

</script>

<style scoped>
.photo-picker {
  width: 160px;
  min-height: 160px;
  /* Adjust height slightly */
}

/* Ensure the image covers the container nicely */
.photo-picker img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>