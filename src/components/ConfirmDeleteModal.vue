<template>
    <div class="modal" :class="{ 'modal-open': show }" role="dialog" aria-modal="true" @click.self="handleCancel">
        <div class="modal-box max-w-md">
            <AppModalHeader :title="title" @close="handleCancel">
                <template #icon><IconAlertTriangle class="h-5 w-5" /></template>
            </AppModalHeader>
            <p class="text-sm leading-6 text-gray-700">{{ message }}</p>
            <div v-if="warningMessage" class="mt-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <IconAlertCircle class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{{ warningMessage }}</span>
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="handleCancel" :disabled="loading">
                    {{ cancelText }}
                </button>
                <button class="btn border-red-800 bg-red-800 text-white hover:border-red-900 hover:bg-red-900" @click="handleConfirm" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    <IconTrash v-else class="h-4 w-4" aria-hidden="true" />
                    <span>{{ loading ? 'Eliminando...' : confirmText }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { IconAlertCircle, IconAlertTriangle, IconTrash } from '@tabler/icons-vue';
import AppModalHeader from '@/components/ui/AppModalHeader.vue';

// Props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Confirmar eliminación'
    },
    message: {
        type: String,
        default: '¿Estás seguro de que deseas eliminar este elemento?'
    },
    warningMessage: {
        type: String,
        default: '¡Esta acción no se puede deshacer!'
    },
    confirmText: {
        type: String,
        default: 'Eliminar'
    },
    cancelText: {
        type: String,
        default: 'Cancelar'
    },
    loading: {
        type: Boolean,
        default: false
    }
});

// Emits
const emit = defineEmits(['confirm', 'cancel', 'close']);

// Methods
const handleConfirm = () => {
    emit('confirm');
};

const handleCancel = () => {
    emit('cancel');
    emit('close');
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
