<template>
  <dialog class="modal" ref="detailsModalRef" @close="handleDialogClose">
    <div class="modal-box w-full max-w-[70vw] max-h-[90vh] overflow-y-auto">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>

      <h3 class="text-lg font-bold mb-2">Detalles del Apoyo</h3>
      <p class="text-xs text-gray-500 mb-4">
        Folio: <span class="font-bold text-red-800">{{ contribution.folio || 'N/A' }}</span>
      </p>

      <div class="divider"></div>

      <!-- General Information -->
      <div class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Información General</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Fecha de entrega</label>
            <p class="text-sm">{{ formatDate(contribution.contributionDate) }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Recibió</label>
            <p class="text-sm">{{ contribution.receiver || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Registrado por</label>
            <p class="text-sm">{{ contribution.createdBy?.name }} {{ contribution.createdBy?.lastname }}</p>
          </div>
        </div>
      </div>

      <!-- Products and Services -->
      <div class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Apoyos Otorgados</h4>
        <div class="overflow-x-auto">
          <table class="table table-sm w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="text-xs">Categoría</th>
                <th class="text-xs">Descripción</th>
                <th class="text-xs text-center">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in contribution.productOrServices" :key="index" class="hover:bg-gray-50">
                <td class="text-sm">
                  <span class="badge badge-sm bg-red-100 text-red-800 border-red-200">
                    {{ item.productOrService?.category?.name || 'N/A' }}
                  </span>
                </td>
                <td class="text-sm">{{ item.description }}</td>
                <td class="text-sm text-center font-bold text-red-900">{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Evidence Photo -->
      <div v-if="contribution.evidencePhoto" class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Evidencia Fotográfica</h4>
        <div class="flex justify-center bg-gray-50 p-4 rounded-lg border border-gray-200">
          <img :src="evidencePhotoUrl" alt="Evidencia del apoyo"
            class="max-h-[300px] rounded-lg shadow-sm object-contain border border-gray-300 bg-white"
            @error="$event.target.style.display = 'none'" />
        </div>
      </div>

      <!-- Comments/Notes -->
      <div v-if="contribution.comments" class="mb-6">
        <h4 class="font-bold text-md mb-3 text-red-800">Observaciones</h4>
        <div class="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p class="text-sm italic text-gray-700">{{ contribution.comments }}</p>
        </div>
      </div>

      <!-- Beneficiary Information (if available) -->
      <div v-if="beneficiary" class="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-bold text-md mb-3 text-red-800">Información del Beneficiario</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Nombre completo</label>
            <p class="text-sm">{{ beneficiary.name }} {{ beneficiary.fatherSurname }} {{
              beneficiary.motherSurname }}</p>
          </div>
          <div v-if="beneficiary.curp">
            <label class="text-xs font-medium text-gray-600">CURP</label>
            <p class="text-sm font-mono">{{ beneficiary.curp }}</p>
          </div>
          <div v-if="beneficiary.phone">
            <label class="text-xs font-medium text-gray-600">Teléfono</label>
            <p class="text-sm">{{ beneficiary.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Metadata -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-bold text-md mb-3 text-red-800">Información del Registro</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-medium text-gray-600">Fecha de creación</label>
            <p class="text-sm">{{ formatDate(contribution.createdAt) }}</p>
          </div>
          <div v-if="contribution.updatedAt && contribution.updatedAt !== contribution.createdAt">
            <label class="text-xs font-medium text-gray-600">Última actualización</label>
            <p class="text-sm">{{ formatDate(contribution.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-2">
        <button v-if="contribution.haveMultipleBeneficiaries === false"
          class="btn btn-sm bg-red-800 text-white hover:bg-red-900" @click="handlePrintTicket" :disabled="loadingPrint">
          <span v-if="loadingPrint" class="loading loading-spinner loading-xs"></span>
          <span v-else>Generar recibo</span>
        </button>
        <button class="btn btn-sm btn-ghost" @click="closeModal">
          Cerrar
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { useDate } from '@/utils/dateTool';

const { formatDate } = useDate();

const props = defineProps({
  contribution: {
    type: Object,
    required: true,
    default: () => ({})
  },
  beneficiary: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
});

const baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000';

const evidencePhotoUrl = computed(() => {
  if (!props.contribution.evidencePhoto) return null;
  if (props.contribution.evidencePhoto.startsWith('http') || props.contribution.evidencePhoto.startsWith('data:')) {
    return props.contribution.evidencePhoto;
  }
  return `${baseURL}${props.contribution.evidencePhoto}`;
});

const emit = defineEmits(['close', 'print-ticket']);

const detailsModalRef = ref(null);
const loadingPrint = ref(false);

// Mostrar/ocultar el modal cuando cambia la prop show
watch(() => props.show, (newValue) => {
  if (newValue) {
    nextTick(() => {
      detailsModalRef.value?.showModal();
    });
  } else {
    detailsModalRef.value?.close();
  }
}, { immediate: true });

// Manejar el cierre del diálogo nativo
const handleDialogClose = () => {
  emit('close');
};

const closeModal = () => {
  emit('close');
  detailsModalRef.value?.close();
};

const handlePrintTicket = () => {
  emit('print-ticket', props.contribution);
};

</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
