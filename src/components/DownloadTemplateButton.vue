<template>
    <div class="tooltip tooltip-left" :data-tip="tooltip">
        <button
            :disabled="isExporting"
            @click="handleDownload"
            :class="buttonClasses"
        >
            <IconFileDownload v-if="!isExporting" :class="iconClasses" />
            <span v-else class="loading loading-spinner loading-sm"></span>
        </button>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import * as XLSX from 'xlsx';
import { IconFileDownload } from '@tabler/icons-vue';

// Props
const props = defineProps({
    tooltip: {
        type: String,
        default: 'Descargar plantilla'
    },
    size: {
        type: String,
        default: 'normal',
        validator: (value) => ['normal', 'small'].includes(value)
    },
    fileName: {
        type: String,
        default: 'plantilla_beneficiarios'
    },
    sheetName: {
        type: String,
        default: 'Beneficiarios'
    }
});

// State
const isExporting = ref(false);

// Computed
const buttonClasses = computed(() => {
    const baseClasses = 'btn btn-square bg-blue-600 hover:bg-blue-700 font-black text-white';
    const sizeClass = props.size === 'small' ? 'btn-sm' : 'text-[1.2rem]';
    return `${baseClasses} ${sizeClass}`;
});

const iconClasses = computed(() => {
    return props.size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
});

// Methods
const handleDownload = () => {
    isExporting.value = true;

    try {
        // Definir las columnas de la plantilla
        const columns = {
            'curp': 'curp',
            'nombre': 'nombre',
            'apellido paterno': 'apellido_paterno',
            'apellido materno': 'apellido_materno'
        };

        // Crear datos de ejemplo (plantilla vacía con una fila de ejemplo)
        const templateData = [
            {
                curp: 'EJEMPLO123456HDFXYZ01',
                nombre: 'Juan',
                apellido_paterno: 'Pérez',
                apellido_materno: 'García'
            }
        ];

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(templateData);

        // Configurar anchos de columna
        worksheet['!cols'] = [
            { wch: 20 }, // curp
            { wch: 25 }, // nombre
            { wch: 25 }, // apellido paterno
            { wch: 25 }  // apellido materno
        ];

        // Crear libro de trabajo y agregar la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, props.sheetName);

        // Descargar archivo
        XLSX.writeFile(workbook, `${props.fileName}.xlsx`);
    } catch (error) {
        console.error('Error al descargar plantilla:', error);
    } finally {
        isExporting.value = false;
    }
};
</script>
