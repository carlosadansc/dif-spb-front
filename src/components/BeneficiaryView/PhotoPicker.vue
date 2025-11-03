<template>
  <div class="photo-picker" :class="{ uploading: isUploading }">
    <div class="photo-container" @click="openFileSelector">
      <img :src="previewUrl" alt="Foto de perfil" class="profile-image" @error="onImageError" />
      <div class="overlay">
        <span class="overlay-text">
          {{ isUploading ? 'Subiendo' : 'Cambiar foto' }}
        </span>
      </div>
    </div>
    <input ref="fileInput" type="file" @change="handleFileChange" accept="image/jpeg,image/png,image/gif,image/webp"
      style="display: none" />

    <button v-if="showDeleteButton" class="z-9999 absolute bottom-0 right-0 p-2 rounded-full shadow-lg bg-white" @click.stop="deletePhoto" title="Eliminar foto">
      <IconTrash size="15" color="red" />
    </button>
 
 </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import { IconTrash } from '@tabler/icons-vue';
import { useAuth } from '@/composables/useAuth';
import beneficiaryServices from '@/services/beneficiaryServices';

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

// Mostrar/ocultar botón de eliminar según si hay una foto que no sea la predeterminada
watch(() => previewUrl.value, (newUrl) => {
  const defaultPhotoPattern = /placeholder\.com|default\.png|^data:image/;
  showDeleteButton.value = !defaultPhotoPattern.test(newUrl);
}, { immediate: true });

const onImageError = (event) => {
  event.target.classList.add('is-broken');
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

// Función para eliminar la foto
const deletePhoto = async () => {
  if (isUploading.value) return;

  const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta foto?');
  if (!confirmed) return;

  isUploading.value = true;

  try {
    // Eliminar la imagen del servidor si no es la predeterminada
    const defaultPhotoPattern = /placeholder\.com|default\.png|^data:image/;
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

    // Notificar éxito
    toast.success('Foto eliminada correctamente');

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
    const defaultPhotoPattern = /placeholder\.com|default\.png|^data:image/;
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

    // 6. Emitir evento de éxito
    emit('photo-selected', filePath);

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
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: visible;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  background-color: #f8fafc;
}

.photo-picker:hover {
  border-color: #007bff;
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.2);
}

.photo-picker.uploading {
  cursor: not-allowed;
  opacity: 0.8;
  border-color: #28a745;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  text-align: center;
  line-height: 150px;
  font-size: 14px;
  color: #6c757d;
  border-radius: 50%;
}

.profile-image.is-broken {
  position: relative;
  color: transparent;
  /* Oculta el texto alt original */
}

.profile-image.is-broken::after {
  content: attr(alt);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6c757d;
  /* Color del texto de reemplazo */
  text-align: center;
  width: 100%;
}

.photo-picker:hover .profile-image {
  transform: scale(1.05);
  filter: brightness(0.8);
}

.photo-picker.uploading .profile-image {
  filter: brightness(0.6);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.photo-picker:hover .overlay,
.photo-picker.uploading .overlay {
  opacity: 1;
}

.photo-picker.uploading .overlay {
  background-color: rgba(40, 167, 69, 0.8);
}

.overlay-text {
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  padding: 0 10px;
}

.photo-picker.uploading .overlay-text::after {
  content: '...';
  animation: dots 1.5s infinite;
}

@keyframes dots {

  0%,
  20% {
    content: '...';
  }

  40% {
    content: '..';
  }

  60% {
    content: '.';
  }

  80%,
  100% {
    content: '';
  }
}

/* Responsividad */
@media (max-width: 768px) {
  .photo-picker {
    width: 120px;
    height: 120px;
  }

  .overlay-text {
    font-size: 12px;
  }
}
</style>