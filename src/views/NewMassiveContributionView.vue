<template>
    <div class="w-full max-w-5xl mx-auto px-4 py-8">
        <div class="flex items-center gap-4 mb-6">
            <button @click="goBack" class="btn btn-circle btn-ghost">
                <IconArrowLeft class="w-6 h-6" />
            </button>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Jornada - Apoyo Masivo</h1>
                <p class="text-sm text-gray-500">
                    Registre un apoyo para múltiples beneficiarios en una jornada.
                </p>
            </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Fecha de apoyo -->
                <div>
                    <label for="contributionDate" class="block text-sm font-medium text-gray-700 required">
                        Fecha de la jornada
                    </label>
                    <input type="date" id="contributionDate" v-model="contribution.contributionDate"
                        class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div class="divider">Agregar Items</div>

                <!-- Tipo de Apoyo y Productos -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                    <div class="md:col-span-4">
                        <label for="category" class="block text-sm font-medium text-gray-700 required">
                            Tipo de Apoyo
                        </label>
                        <select id="category" v-model="contribution.category" @change="getSelectedCategory"
                            class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required>
                            <option value="" disabled>Seleccione un tipo</option>
                            <option class="capitalize" v-for="category in categories" :key="category._id"
                                :value="category">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <div class="md:col-span-5">
                        <label for="productOrService" class="block text-sm font-medium text-gray-700 required">
                            Descripción del apoyo
                        </label>
                        <select id="productOrService" v-model="newProductOrService"
                            class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required>
                            <option value="" disabled>Seleccione el apoyo otorgado</option>
                            <option v-for="item in selectedCategory.productOrServices" :key="item._id" :value="item">
                                {{ item.name }}
                            </option>
                        </select>
                    </div>

                    <div class="md:col-span-2">
                        <label for="quantity" class="block text-sm font-medium text-gray-700 required">
                            Cantidad
                        </label>
                        <input type="number" id="quantity" v-model="contribution.quantity" min="1"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required />
                    </div>

                    <div class="md:col-span-1 flex justify-end pl-4">
                        <button type="button" @click="addItem" class="btn btn-square bg-red-800 text-white"
                            :disabled="!contribution.category || !newProductOrService._id">
                            <IconPlus class="w-6 h-6" />
                        </button>
                    </div>

                    <!-- Campos condicionales para nombre específico -->
                    <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4"
                        v-if="isMedicineSelected || isOtherSelected">
                        <div v-if="isMedicineSelected">
                            <label for="medicineName" class="block text-sm font-medium text-gray-700 required">
                                Nombre específico del medicamento
                            </label>
                            <input type="text" id="medicineName" v-model="medicineName"
                                class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: Paracetamol 500mg">
                        </div>

                        <div v-if="isOtherSelected">
                            <label for="otherName" class="block text-sm font-medium text-gray-700 required">
                                Nombre específico del apoyo
                            </label>
                            <input type="text" id="otherName" v-model="otherName"
                                class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Especifique el apoyo">
                        </div>
                    </div>
                </div>

                <!-- Lista de apoyos agregados -->
                <div class="bg-gray-100 rounded-md p-5">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-bold">Lista de apoyos agregados</h3>
                        <button v-if="contribution.productOrServices.length > 0" type="button" @click="clearAllItems"
                            class="btn btn-xs btn-error btn-outline gap-1">
                            <IconTrash class="w-3 h-3" />
                            Limpiar lista
                        </button>
                    </div>

                    <ul v-if="contribution.productOrServices.length > 0" class="col-span-5 space-y-2">
                        <li v-for="(item, index) in contribution.productOrServices" :key="index"
                            class="flex items-center justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                            <span class="text-sm text-gray-700 font-medium">{{ item.description }}</span>

                            <div class="flex items-center gap-2">
                                <!-- Cantidad -->
                                <div class="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
                                    <!-- Botón decrementar -->
                                    <button type="button" @click="decrementQuantity(index)"
                                        :disabled="item.quantity <= 1"
                                        class="btn btn-xs btn-circle btn-ghost text-gray-600 hover:text-red-600 disabled:opacity-30">
                                        <IconMinus class="w-3 h-3" />
                                    </button>

                                    <!-- Cantidad actual -->
                                    <span class="text-sm font-bold text-gray-900 min-w-[2rem] text-center">{{
                                        item.quantity }}</span>

                                    <!-- Botón incrementar -->
                                    <button type="button" @click="incrementQuantity(index)"
                                        class="btn btn-xs btn-circle btn-ghost text-gray-600 hover:text-green-600">
                                        <IconPlus class="w-3 h-3" />
                                    </button>
                                </div>

                                <!-- Botón eliminar item -->
                                <button type="button" @click="removeItem(index)"
                                    class="btn btn-xs btn-circle btn-ghost text-red-600 hover:bg-red-50">
                                    <IconX class="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    </ul>

                    <p v-else class="col-span-5 text-sm text-gray-500 text-center mt-7 text-red-600">
                        No se ha agregado ningún tipo de apoyo
                    </p>
                </div>

                <div class="divider">Beneficiarios</div>

                <!-- Agregar beneficiario -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">CURP</label>
                        <input v-model="newBeneficiary.curp" v-maska="'@@@@######@@@@@@**'" type="text"
                            placeholder="CURP" @input="newBeneficiary.curp = newBeneficiary.curp.toUpperCase()"
                            class="input input-sm mt-1 block w-full rounded-md border-gray-300" maxlength="18" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Nombre</label>
                        <input v-model="newBeneficiary.name" type="text" placeholder="Nombre"
                            class="input input-sm mt-1 block w-full rounded-md border-gray-300" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                        <input v-model="newBeneficiary.fatherSurname" type="text" placeholder="Apellido Paterno"
                            class="input input-sm mt-1 block w-full rounded-md border-gray-300" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Apellido Materno</label>
                        <input v-model="newBeneficiary.motherSurname" type="text"
                            placeholder="Apellido Materno (opcional)"
                            class="input input-sm mt-1 block w-full rounded-md border-gray-300" />
                    </div>
                    <div class="md:col-span-4 flex justify-end">
                        <button type="button" @click="addBeneficiary" class="btn btn-sm bg-blue-600 text-white w-full">
                            <IconPlus class="w-4 h-4" />
                            Agregar beneficiario
                        </button>
                    </div>
                </div>



                <!-- Input file oculto -->
                <input ref="fileInputRef" type="file" accept=".xlsx,.xls" @change="handleFileUpload" class="hidden" />

                <!-- Lista de beneficiarios -->
                <div class="bg-gray-100 rounded-md p-5 max-h-[400px] overflow-y-auto">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-bold">Beneficiarios agregados ({{ beneficiaries.length }})</h3>
                        <div class="flex gap-2">
                            <button type="button" @click="triggerFileInput" :disabled="importingExcel"
                                class="btn btn-sm bg-green-600 text-white">
                                <IconFileSpreadsheet class="w-4 h-4" />
                                <span v-if="!importingExcel">Importar Excel</span>
                                <span v-else class="loading loading-spinner loading-sm"></span>
                            </button>
                            <ExportToExcelButton tooltip="Descargar plantilla Excel" @click="downloadTemplate"
                                size="small" :require-admin="false" />
                        </div>
                    </div>
                    <ul v-if="beneficiaries.length > 0">
                        <li v-for="(ben, index) in beneficiaries" :key="index"
                            class="flex items-center justify-between px-4 py-2 hover:bg-gray-50 border-b last:border-0 bg-white first:rounded-t-md last:rounded-b-md">
                            <div class="flex-1">
                                <span class="text-sm font-medium block">{{ ben.name }} {{ ben.fatherSurname }} {{
                                    ben.motherSurname }}</span>
                                <span class="text-xs text-gray-500">{{ ben.curp }}</span>
                            </div>
                            <button type="button" @click="removeBeneficiary(index)"
                                class="text-red-600 hover:text-red-800 btn btn-sm btn-ghost btn-circle">
                                <IconTrash class="w-4 h-4" />
                            </button>
                        </li>
                    </ul>
                    <p v-else class="text-sm text-gray-500 text-center mt-4 text-red-600">
                        No se han agregado beneficiarios
                    </p>
                </div>

                <div class="divider">Detalles finales</div>

                <div class="grid grid-cols-1 gap-6">
                    <!-- Evidencia Fotográfica -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Evidencia fotográfica</label>

                        <!-- Upload Area -->
                        <div v-if="!contribution.evidencePhoto" @click="triggerPhotoInput"
                            class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-800 hover:bg-gray-50 transition-colors group">

                            <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                @change="handlePhotoUpload">

                            <div v-if="isUploadingPhoto" class="flex flex-col items-center">
                                <span class="loading loading-spinner text-red-800 loading-md mb-2"></span>
                                <span class="text-sm text-gray-500">Subiendo imagen...</span>
                            </div>

                            <div v-else class="flex flex-col items-center">
                                <IconCamera class="w-8 h-8 text-gray-400 group-hover:text-red-800 mb-2" />
                                <span class="text-sm text-gray-600 font-medium">Click para subir foto de
                                    evidencia</span>
                                <span class="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                            </div>
                        </div>

                        <!-- Preview Area -->
                        <div v-else
                            class="relative w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                            <img :src="contribution.evidencePhoto" alt="Evidencia"
                                class="w-full h-auto object-cover max-h-[300px]" />

                            <div
                                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" @click="deleteEvidencePhoto"
                                    class="btn btn-error btn-sm text-white gap-2">
                                    <IconTrash class="w-4 h-4" />
                                    Eliminar foto
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Quien recibe -->
                    <div>
                        <label for="receiver" class="block text-sm font-medium text-gray-700 required">
                            Persona que entrega
                        </label>
                        <input v-model="contribution.receiver" id="receiver" type="text"
                            placeholder="Nombre de la persona que entrega los apoyos"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <!-- Comentarios -->
                    <div>
                        <label for="comments" class="block text-sm font-medium text-gray-700">Notas /
                            Comentarios</label>
                        <textarea id="comments" v-model="contribution.comments" rows="3"
                            placeholder="Comentarios adicionales sobre la jornada (opcional)"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex items-center justify-end gap-3 pt-6 border-t mt-6">
                    <button type="button" class="btn btn-ghost" @click="goBack">
                        Cancelar
                    </button>
                    <button :disabled="loading" type="submit"
                        class="btn bg-red-900 hover:bg-red-800 text-white min-w-[200px]">
                        <span v-if="!loading">Registrar Jornada Masiva</span>
                        <span v-else class="loading loading-spinner loading-md"></span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Confirm Clear Modal -->
        <Teleport to="body">
            <ConfirmDeleteModal :show="showClearConfirmModal" title="Confirmar acción"
                message="¿Está seguro de que desea limpiar toda la lista de apoyos?"
                warning-message="Se eliminarán todos los apoyos agregados de la lista." @confirm="executeClearAllItems"
                @close="cancelClearAllItems" />
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { IconPlus, IconTrash, IconFileSpreadsheet, IconMinus, IconX, IconArrowLeft, IconCamera } from '@tabler/icons-vue';
import contributionServices from '@/services/contributionServices';
import beneficiaryServices from '@/services/beneficiaryServices';
import { useAuth } from '@/composables/useAuth';
import { normalizeObjectTextProperties } from '@/utils/normalizeObjectText';
import ExportToExcelButton from '@/components/ExportToExcelButton.vue';
import { exportToExcel as exportExcelUtil } from '@/utils/excelExport';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import * as XLSX from 'xlsx';
import { useRouter } from 'vue-router';
import { vMaska } from "maska/vue"

// Composables
const { authHeader } = useAuth();
const router = useRouter();

// Data
const fileInputRef = ref(null);
const fileInput = ref(null);
const categories = ref([]);
const loading = ref(false);
const importingExcel = ref(false);
const isUploadingPhoto = ref(false);
const isSubmissionSuccessful = ref(false);
const medicineName = ref('');
const otherName = ref('');
const selectedCategory = ref({
    _id: 1,
    name: '',
    description: '',
    productOrServices: []
});

const newProductOrService = ref({});
const newBeneficiary = ref({
    curp: '',
    name: '',
    fatherSurname: '',
    motherSurname: ''
});

const beneficiaries = ref([]);
const showClearConfirmModal = ref(false);

const contribution = ref({
    category: '',
    productOrServices: [],
    quantity: 1,
    comments: '',
    receiver: '',
    contributionDate: new Date().toISOString().split('T')[0], // Default to today
    evidencePhoto: ''
});

// Computed
const isMedicineSelected = computed(() => {
    return newProductOrService.value?.type === 'medicine' ||
        newProductOrService.value?.name?.toLowerCase().includes('medicamento');
});

const isOtherSelected = computed(() => {
    return newProductOrService.value?.type === 'other' ||
        newProductOrService.value?.name?.toLowerCase().includes('otro');
});

// Methods

const goBack = async () => {
    // Solo eliminar si NO se ha guardado exitosamente y hay foto
    if (!isSubmissionSuccessful.value && contribution.value.evidencePhoto) {
        try {
            await beneficiaryServices.deleteImage(contribution.value.evidencePhoto, authHeader.value);
        } catch (error) {
            console.error('Error al eliminar imagen huérfana:', error);
        }
    }
    router.back();
}

const triggerPhotoInput = () => {
    fileInput.value.click();
}

const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo y tamaño
    if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('La imagen no debe superar los 5MB');
        return;
    }

    isUploadingPhoto.value = true;

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await beneficiaryServices.uploadImage(formData, authHeader.value);

        if (response && response.data && response.data.filePath) {
            contribution.value.evidencePhoto = response.data.filePath;
            toast.success('Foto subida correctamente');
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (err) {
        console.error('Error al subir foto:', err);
        toast.error('Error al subir la imagen');
    } finally {
        isUploadingPhoto.value = false;
        // Limpiar input
        event.target.value = '';
    }
}

const deleteEvidencePhoto = async () => {
    if (!contribution.value.evidencePhoto) return;

    try {
        await beneficiaryServices.deleteImage(contribution.value.evidencePhoto, authHeader.value);
        contribution.value.evidencePhoto = '';
        toast.info('Foto eliminada');
    } catch (err) {
        console.error('Error al eliminar foto:', err);
        contribution.value.evidencePhoto = '';
    }
}

const getCategories = async () => {
    loading.value = true;
    try {
        const response = await contributionServices.getCategories(authHeader.value);
        if (response.code === "ERR_NETWORK") {
            toast.error('No se pudo conectar con el servidor');
        } else {
            categories.value = response.data;
        }
    } catch (err) {
        toast.error('Error al cargar categorías');
    } finally {
        loading.value = false;
    }
};

const getSelectedCategory = () => {
    selectedCategory.value = categories.value.find(c => c._id === contribution.value.category._id);
};

const addItem = () => {
    if (!newProductOrService.value._id) {
        toast.warning('Seleccione un apoyo primero');
        return;
    }

    let description = newProductOrService.value.name;

    // If it's a medicine or other type that requires a custom name
    if (isMedicineSelected.value && medicineName.value) {
        description = `${newProductOrService.value.name}: ${medicineName.value}`;
    } else if (isOtherSelected.value && otherName.value) {
        description = `${newProductOrService.value.name}: ${otherName.value}`;
    } else if (newProductOrService.value.requiresCustomName) {
        // For any other product/service that requires a custom name
        const customName = medicineName.value || otherName.value;
        if (customName) {
            description = `${newProductOrService.value.name}: ${customName}`;
        }
    }

    const existingItemIndex = contribution.value.productOrServices.findIndex(
        item => item.description === description && item.productOrService._id === newProductOrService.value._id
    );

    if (existingItemIndex !== -1) {
        contribution.value.productOrServices[existingItemIndex].quantity += contribution.value.quantity;
    } else {
        contribution.value.productOrServices.push({
            productOrService: newProductOrService.value,
            description: description,
            quantity: contribution.value.quantity
        });
    }

    // Reset fields after adding
    medicineName.value = '';
    otherName.value = '';
    contribution.value.quantity = 1;
};

const removeItem = (index) => {
    contribution.value.productOrServices.splice(index, 1);
};

const incrementQuantity = (index) => {
    contribution.value.productOrServices[index].quantity++;
};

const decrementQuantity = (index) => {
    if (contribution.value.productOrServices[index].quantity > 1) {
        contribution.value.productOrServices[index].quantity--;
    }
};

const clearAllItems = () => {
    showClearConfirmModal.value = true;
};

const executeClearAllItems = () => {
    contribution.value.productOrServices = [];
    showClearConfirmModal.value = false;
};

const cancelClearAllItems = () => {
    showClearConfirmModal.value = false;
};

const addBeneficiary = () => {
    if (!newBeneficiary.value.curp || newBeneficiary.value.curp.length !== 18) {
        toast.error('El CURP debe tener 18 caracteres');
        return;
    }

    if (!newBeneficiary.value.name || !newBeneficiary.value.fatherSurname) {
        toast.error('El nombre y apellido paterno son obligatorios');
        return;
    }

    // Verificar si el CURP ya existe en la lista
    const exists = beneficiaries.value.some(b => b.curp === newBeneficiary.value.curp);
    if (exists) {
        toast.warning('Este beneficiario ya está en la lista');
        return;
    }

    beneficiaries.value.push({ ...newBeneficiary.value });

    // Limpiar formulario
    newBeneficiary.value = {
        curp: '',
        name: '',
        fatherSurname: '',
        motherSurname: ''
    };

    toast.success('Beneficiario agregado');
};

const removeBeneficiary = (index) => {
    beneficiaries.value.splice(index, 1);
};

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    importingExcel.value = true;

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            toast.error('El archivo Excel está vacío');
            return;
        }

        // Validar encabezados
        const firstRow = jsonData[0];
        const requiredColumns = ['CURP', 'Nombre', 'Apellido Paterno'];
        const hasRequiredColumns = requiredColumns.every(col => col in firstRow || col.toLowerCase() in firstRow || col.toUpperCase() in firstRow);

        if (!hasRequiredColumns) {
            toast.error('El archivo no tiene las columnas requeridas: CURP, Nombre, Apellido Paterno, Apellido Materno');
            return;
        }

        let imported = 0;
        let errors = 0;
        const errorDetails = [];

        jsonData.forEach((row, index) => {
            try {
                // Normalizar nombres de columnas (case insensitive)
                const curp = (row.CURP || row.curp || '').toString().trim().toUpperCase();
                const name = (row.Nombre || row.nombre || row.name || '').toString().trim();
                const fatherSurname = (row['Apellido Paterno'] || row['apellido paterno'] || row.fatherSurname || '').toString().trim();
                const motherSurname = (row['Apellido Materno'] || row['apellido materno'] || row.motherSurname || '').toString().trim();

                // Validaciones
                if (!curp || curp.length !== 18) {
                    errorDetails.push(`Fila ${index + 2}: CURP inválido (debe tener 18 caracteres)`);
                    errors++;
                    return;
                }

                if (!name) {
                    errorDetails.push(`Fila ${index + 2}: Nombre es obligatorio`);
                    errors++;
                    return;
                }

                if (!fatherSurname) {
                    errorDetails.push(`Fila ${index + 2}: Apellido Paterno es obligatorio`);
                    errors++;
                    return;
                }

                // Verificar duplicados
                const exists = beneficiaries.value.some(b => b.curp === curp);
                if (exists) {
                    errorDetails.push(`Fila ${index + 2}: CURP ${curp} ya existe en la lista`);
                    errors++;
                    return;
                }

                // Agregar beneficiario
                beneficiaries.value.push({
                    curp,
                    name,
                    fatherSurname,
                    motherSurname
                });
                imported++;
            } catch (err) {
                errorDetails.push(`Fila ${index + 2}: Error al procesar`);
                errors++;
            }
        });

        // Mostrar resumen
        if (imported > 0) {
            toast.success(`${imported} beneficiario(s) importado(s) correctamente`);
        }

        if (errors > 0) {
            toast.warning(`${errors} fila(s) con errores`);
            console.warn('Detalles de errores:', errorDetails);
        }

    } catch (err) {
        console.error('Error al importar Excel:', err);
        toast.error('Error al leer el archivo Excel');
    } finally {
        importingExcel.value = false;
        // Limpiar el input para permitir cargar el mismo archivo nuevamente
        event.target.value = '';
    }
};

const downloadTemplate = () => {
    // Datos de ejemplo para la plantilla
    const templateData = [
        {
            'CURP': 'AAAA000000HDFBBB00',
            'Nombre': 'JUAN',
            'Apellido Paterno': 'PÉREZ',
            'Apellido Materno': 'GARCÍA'
        },
        {
            'CURP': 'BBBB111111MDFCCC01',
            'Nombre': 'MARÍA',
            'Apellido Paterno': 'LÓPEZ',
            'Apellido Materno': 'MARTÍNEZ'
        },
        {
            'CURP': 'CCCC222222HDFDDD02',
            'Nombre': 'PEDRO',
            'Apellido Paterno': 'GONZÁLEZ',
            'Apellido Materno': ''
        }
    ];

    // Columnas para la plantilla (identidad: el valor es igual a la key)
    const columns = {
        'CURP': 'CURP',
        'Nombre': 'Nombre',
        'Apellido Paterno': 'Apellido Paterno',
        'Apellido Materno': 'Apellido Materno'
    };

    exportExcelUtil(
        templateData,
        columns,
        'plantilla_beneficiarios',
        'Beneficiarios',
        {
            columnWidths: {
                'CURP': 20,
                'Nombre': 20,
                'Apellido Paterno': 20,
                'Apellido Materno': 20
            }
        }
    );

    toast.success('Plantilla descargada correctamente');
};

const submitForm = async () => {
    loading.value = true;

    try {
        // Validaciones
        if (!contribution.value.productOrServices?.length) {
            toast.error('Debe agregar al menos un producto o servicio');
            return;
        }

        if (!contribution.value.contributionDate) {
            toast.error('La fecha de la jornada es requerida');
            return;
        }

        if (!contribution.value.receiver) {
            toast.error('El nombre de quien entrega es requerido');
            return;
        }

        if (!beneficiaries.value.length) {
            toast.error('Debe agregar al menos un beneficiario');
            return;
        }

        const payload = normalizeObjectTextProperties({
            productOrServices: contribution.value.productOrServices.map(p => ({
                productOrService: p.productOrService._id,
                description: p.description.toUpperCase(),
                quantity: p.quantity
            })),
            beneficiaries: beneficiaries.value,
            comments: contribution.value.comments,
            contributionDate: contribution.value.contributionDate,
            receiver: contribution.value.receiver,
            evidencePhoto: contribution.value.evidencePhoto
        });

        const response = await contributionServices.createMassiveContribution(
            payload,
            authHeader.value
        );

        // Mostrar resumen
        const summary = response.data;
        isSubmissionSuccessful.value = true;
        toast.success(`Jornada registrada: ${summary.processedSuccessfully}/${summary.totalBeneficiaries} beneficiarios procesados`);

        if (summary.failedBeneficiaries > 0) {
            toast.warning(`${summary.failedBeneficiaries} beneficiarios no pudieron procesarse`);
        }

        goBack();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Error al registrar jornada masiva');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    getCategories();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
