<template>
    <div class="modal" :class="{ 'modal-open': show }" style="z-index: 9999;">
        <div class="modal-box">
            <h3 class="font-bold text-lg">{{ title }}</h3>
            <p class="py-4">
                {{ message }}
                <br v-if="warningMessage">
                <span v-if="warningMessage" class="text-red-600 font-bold text-[0.7rem]">{{ warningMessage }}</span>
            </p>
            <div class="modal-action">
                <button class="btn" @click="handleCancel" :disabled="isLoading">
                    {{ cancelText }}
                </button>
                <button class="btn btn-error" @click="handleConfirm" :disabled="isLoading">
                    <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                    <span v-else>{{ confirmText }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

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

// Data
const isLoading = ref(false);

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
