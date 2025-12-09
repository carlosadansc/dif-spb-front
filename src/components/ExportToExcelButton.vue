<template>
    <div class="tooltip tooltip-left" :data-tip="tooltip">
        <button v-if="showButton" :disabled="loading || isExporting" @click="handleClick" :class="buttonClasses">
            <IconFileDownload v-if="!loading && !isExporting" :class="iconClasses" />
            <span v-else class="loading loading-spinner loading-sm"></span>
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IconFileDownload } from '@tabler/icons-vue';
import { useAuth } from '@/composables/useAuth';
import { exportToExcel } from '@/utils/excelExport';

// Props
const props = defineProps({
    tooltip: {
        type: String,
        default: 'Exportar a Excel'
    },
    loading: {
        type: Boolean,
        default: false
    },
    requireAdmin: {
        type: Boolean,
        default: true
    },
    size: {
        type: String,
        default: 'normal', // 'normal' or 'small'
        validator: (value) => ['normal', 'small'].includes(value)
    },
    // Props para exportación directa (modo automático)
    data: {
        type: Array,
        default: null
    },
    columns: {
        type: Object,
        default: null
    },
    fileName: {
        type: String,
        default: 'export'
    },
    sheetName: {
        type: String,
        default: 'Datos'
    },
    exportOptions: {
        type: Object,
        default: () => ({})
    }
});

// Emits
const emit = defineEmits(['click', 'export-complete', 'export-error']);

// Composables
const { isAdmin, isExecutive } = useAuth();

// State
const isExporting = ref(false);

// Computed
const showButton = computed(() => {
    if (!props.requireAdmin) return true;
    return isAdmin.value || isExecutive.value;
});

const buttonClasses = computed(() => {
    const baseClasses = 'btn btn-square bg-green-600 hover:bg-green-700 font-black text-white';
    const sizeClass = props.size === 'small' ? 'btn-sm' : 'text-[1.2rem]';
    return `${baseClasses} ${sizeClass}`;
});

const iconClasses = computed(() => {
    return props.size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
});

// Computed para determinar si debe exportar automáticamente
const shouldAutoExport = computed(() => {
    return props.data && props.columns;
});

// Methods
const handleClick = async () => {
    if (shouldAutoExport.value) {
        // Modo automático: exporta directamente usando la utilidad
        await performExport();
    } else {
        // Modo manual: emite evento para que el padre maneje la exportación
        emit('click');
    }
};

const performExport = async () => {
    isExporting.value = true;

    try {
        exportToExcel(
            props.data,
            props.columns,
            props.fileName,
            props.sheetName,
            props.exportOptions
        );
        emit('export-complete');
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        emit('export-error', error);
    } finally {
        isExporting.value = false;
    }
};
</script>
