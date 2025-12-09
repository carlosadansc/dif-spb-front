<template>
    <div class="w-full max-w-5xl mx-auto px-4 py-8">
        <div class="flex items-center gap-4 mb-6">
            <button @click="goBack" class="btn btn-circle btn-ghost">
                <IconArrowLeft class="w-6 h-6" />
            </button>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Nuevo apoyo</h1>
                <p class="text-sm text-gray-500">
                    Registre los datos del apoyo que desea otorgar al beneficiario.
                </p>
            </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <form @submit.prevent="submitForm" class="space-y-6">
                <div v-if="beneficiaryDetails" class="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
                    <p class="text-sm text-blue-800">
                        Otorgando apoyo a: <span class="font-bold">{{ beneficiaryDetails.name }} {{
                            beneficiaryDetails.fatherSurname
                        }} {{ beneficiaryDetails.motherSurname }}</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-6">
                    <!-- Fecha de apoyo -->
                    <div>
                        <label for="contributionDate" class="block text-sm font-medium text-gray-700 required">
                            Fecha de apoyo
                        </label>
                        <input type="date" id="contributionDate" v-model="contribution.contributionDate"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>

                <div class="divider">Agregar Items</div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                    <!-- Tipo de Apoyo -->
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

                    <!-- Descripción -->
                    <div class="md:col-span-5">
                        <label for="productOrService" class="block text-sm font-medium text-gray-700 required">
                            Descripción
                        </label>
                        <select id="productOrService" v-model="newProductOrService"
                            class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            :disabled="!contribution.category" required>
                            <option value="" disabled>Seleccione el apoyo otorgado</option>
                            <option v-for="item in selectedCategory.productOrServices" :key="item._id" :value="item">
                                {{ item.name }}
                            </option>
                        </select>

                    </div>

                    <!-- Cantidad -->
                    <div class="md:col-span-2">
                        <label for="quantity" class="block text-sm font-medium text-gray-700 required">
                            Cantidad
                        </label>
                        <input type="number" id="quantity" v-model="contribution.quantity" min="1"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required />
                    </div>

                    <!-- Botón Agregar -->
                    <div class="md:col-span-1 flex justify-end">
                        <div class="tooltip" data-tip="Agregar a la lista">
                            <button type="button" @click="addItem"
                                class="btn btn-square bg-red-800 hover:bg-red-900 text-white">
                                <IconPlus class="w-6 h-6" />
                            </button>
                        </div>
                    </div>


                    <!-- Campos Condicionales (Fila nueva) -->
                    <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4"
                        v-if="isMedicineSelected || isOtherSelected">
                        <!-- Campo para nombre de medicamento -->
                        <div v-if="isMedicineSelected">
                            <label for="medicineName" class="block text-sm font-medium text-gray-700 required">
                                Nombre específico
                            </label>
                            <input type="text" id="medicineName" v-model="medicineName"
                                class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: Paracetamol 500mg">
                        </div>

                        <div v-if="isOtherSelected">
                            <label for="otherName" class="block text-sm font-medium text-gray-700 required">
                                Especifique
                            </label>
                            <input type="text" id="otherName" v-model="otherName"
                                class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Especifique el apoyo">
                        </div>
                    </div>
                </div>


                <!-- Items List -->
                <div class="bg-white border rounded-md overflow-hidden">
                    <div class="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
                        <h3 class="font-bold text-gray-700">Lista de apoyos ({{ contribution.productOrServices.length
                        }})</h3>
                        <button v-if="contribution.productOrServices.length > 0" type="button" @click="clearAllItems"
                            class="btn btn-xs btn-error btn-outline gap-1">
                            <IconTrash class="w-3 h-3" />
                            Limpiar lista
                        </button>
                    </div>

                    <div v-if="contribution.productOrServices.length > 0" class="divide-y">
                        <div v-for="(item, index) in contribution.productOrServices" :key="index"
                            class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                            <div class="flex-1">
                                <span class="text-sm font-medium text-gray-900">{{ item.description }}</span>
                                <p class="text-xs text-gray-500" v-if="item.productOrService?.category?.name">
                                    {{ item.productOrService.category.name }}
                                </p>
                            </div>

                            <div class="flex items-center gap-4">
                                <!-- Cantidad Control -->
                                <div class="flex items-center border rounded-md bg-white">
                                    <button type="button" @click="decrementQuantity(index)"
                                        :disabled="item.quantity <= 1"
                                        class="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors">
                                        <IconMinus class="w-4 h-4" />
                                    </button>
                                    <span class="px-3 py-1 text-sm font-bold min-w-[2.5rem] text-center">{{
                                        item.quantity }}</span>
                                    <button type="button" @click="incrementQuantity(index)"
                                        class="p-1 hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors">
                                        <IconPlus class="w-4 h-4" />
                                    </button>
                                </div>

                                <!-- Eliminar -->
                                <button type="button" @click="removeItem(index)"
                                    class="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-red-600 hover:bg-red-50">
                                    <IconX class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="p-8 text-center bg-gray-50">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            <IconShoppingCart class="w-6 h-6 text-gray-400" />
                        </div>
                        <p class="text-sm text-gray-500">
                            No se han agregado apoyos a la lista.
                        </p>
                    </div>
                </div>

                <div class="divider">Detalles finales</div>

                <div class="grid grid-cols-1 gap-6">
                    <!-- Evidencia Fotográfica -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Evidencia fotográfica</label>

                        <!-- Upload Area -->
                        <div v-if="!contribution.evidencePhoto" @click="triggerFileInput"
                            class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-800 hover:bg-gray-50 transition-colors group">

                            <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                @change="handleFileUpload">

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
                        <label for="receiver" class="block text-sm font-medium text-gray-700 required">Recibe</label>
                        <input v-model="contribution.receiver" id="receiver" list="families"
                            placeholder="Nombre de la persona que recibe el apoyo"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <datalist id="families">
                            <option v-for="(item, index) in families" :key="index" :value="item.name">
                                {{ item.name }}
                            </option>
                        </datalist>
                    </div>

                    <!-- Comentarios -->
                    <div>
                        <label for="comments" class="block text-sm font-medium text-gray-700">Notas /
                            Comentarios</label>
                        <textarea id="comments" v-model="contribution.comments" rows="3"
                            placeholder="Notas o comentarios adicionales sobre el apoyo (opcional)"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-end gap-3 pt-6 border-t mt-6">
                    <button type="button" class="btn btn-ghost" @click="goBack">
                        Cancelar
                    </button>
                    <button :disabled="loading" type="submit"
                        class="btn bg-red-900 hover:bg-red-800 text-white min-w-[150px]">
                        <span v-if="!loading">Otorgar apoyo</span>
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
import { IconPlus, IconTrash, IconMinus, IconX, IconArrowLeft, IconShoppingCart, IconCamera } from '@tabler/icons-vue';
import contributionServices from '@/services/contributionServices';
import { useAuth } from '@/composables/useAuth';
import { useRouter, useRoute } from 'vue-router'; // useRoute added
import { normalizeObjectTextProperties, normalizeText } from '@/utils/normalizeObjectText'
import beneficiaryServices from '@/services/beneficiaryServices'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import { AxiosError } from 'axios';

// composables
const { authHeader } = useAuth()
const router = useRouter()
const route = useRoute() // Access route parameters

// data
const beneficiaryId = route.params.id; // Get ID from route
const beneficiaryDetails = ref(null); // Validated beneficiary data

const medicineName = ref('');
const otherName = ref('');
const categories = ref([])
const loading = ref(false)
const families = ref([])
const selectedCategory = ref({
    _id: 1,
    name: '',
    description: '',
    productOrServices: []
})

const newProductOrService = ref({})
const showClearConfirmModal = ref(false);

const contribution = ref({
    category: '',
    productOrServices: [],
    quantity: 1,
    comments: '',
    receiver: '',
    contributionDate: new Date().toISOString().split('T')[0], // Default to today
    evidencePhoto: ''
})

const fileInput = ref(null)
const isUploadingPhoto = ref(false)

// computed
const isMedicineSelected = computed(() => {
    return newProductOrService.value?.type === 'medicine' ||
        newProductOrService.value?.name?.toLowerCase().includes('medicamento');
});

const isOtherSelected = computed(() => {
    return newProductOrService.value?.type === 'other' ||
        newProductOrService.value?.name?.toLowerCase().includes('otro');
});

// methods
const triggerFileInput = () => {
    fileInput.value.click();
}

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
        toast.error('Por favor seleccione un archivo de imagen válido');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('La imagen no debe superar los 5MB');
        return;
    }

    isUploadingPhoto.value = true;
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await beneficiaryServices.uploadImage(formData, authHeader.value);

        if (response && response.data && response.data.filePath) {
            contribution.value.evidencePhoto = response.data.filePath;
            toast.success('Evidencia cargada correctamente');
        } else {
            throw new Error('Respuesta inválida del servidor');
        }
    } catch (error) {
        console.error(error);
        toast.error('Error al subir la evidencia');
    } finally {
        isUploadingPhoto.value = false;
        if (event.target) event.target.value = ''; // Reset input
    }
}

const deleteEvidencePhoto = async () => {
    if (!contribution.value.evidencePhoto) return;

    // Optional: Delete from server if needed, or just clear reference
    // Usually good practice to delete orphan files, but for now just clearing ref is safer for user UX if they regret
    // Checking PhotoPicker logic: it deletes. Let's try to delete.
    try {
        await beneficiaryServices.deleteImage(contribution.value.evidencePhoto, authHeader.value);
        contribution.value.evidencePhoto = '';
        toast.success('Evidencia eliminada');
    } catch (error) {
        console.error('Error deleting photo', error);
        // Even if server delete fails, clear local ref
        contribution.value.evidencePhoto = '';
    }
}

const isSubmissionSuccessful = ref(false);

// methods
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

const getCategories = async () => {
    loading.value = true
    try {
        const response = await contributionServices.getCategories(authHeader.value)
        if (response && response.data) {
            categories.value = response.data
        }
    } catch (err) {
        console.error(err);
        toast.error('Error al cargar categorías');
    } finally {
        loading.value = false
    }
}

const getBeneficiaryDetails = async () => {
    try {
        const response = await beneficiaryServices.getBeneficiary(beneficiaryId, authHeader.value)
        if (response && response.data) {
            beneficiaryDetails.value = response.data;
            // Pre-fill receiver only if not manually edited yet (?) - keeping simple for now
        }
    } catch (err) {
        console.error(err);
        toast.error('Error al cargar información del beneficiario');
    }
}

const getFamilyNames = async () => {
    try {
        const response = await beneficiaryServices.getBeneficiaryFamilyNames(beneficiaryId, authHeader.value)
        if (response && response.data) {
            families.value = response.data
        }
    } catch (err) {
        console.error(err);
    }
}

const submitForm = async () => {
    loading.value = true;

    try {
        // Validación
        if (!validateForm()) {
            return;
        }

        const payload = preparePayload();
        const response = await contributionServices.createContribution(
            payload,
            authHeader.value
        );

        handleSuccessResponse(response);
    } catch (err) {
        handleSubmissionError(err);
    } finally {
        loading.value = false;
    }
};

// ... Same validation logic as Modal ...
const validateForm = () => {
    if (!contribution.value.productOrServices?.length) {
        toast.error('Debe agregar al menos un producto o servicio');
        return false;
    }
    if (!contribution.value.contributionDate) {
        toast.error('La fecha del apoyo es requerida');
        return false;
    }
    if (!contribution.value.receiver) {
        toast.error('El nombre de quien recibe el apoyo es requerido');
        return false;
    }
    return true;
};

const preparePayload = () => {
    return {
        productOrServices: contribution.value.productOrServices.map(p => ({
            productOrService: p.productOrService._id,
            description: normalizeText(p.description),
            quantity: p.quantity
        })),
        beneficiary: beneficiaryId,
        comments: normalizeText(contribution.value.comments),
        contributionDate: contribution.value.contributionDate,
        receiver: normalizeText(contribution.value.receiver),
        evidencePhoto: contribution.value.evidencePhoto
    };
};

const handleSuccessResponse = (response) => {
    isSubmissionSuccessful.value = true; // Marcar como éxito para evitar borrado de foto
    toast.success('Registro creado exitosamente');
    goBack(); // Navigate back on success
};

const handleSubmissionError = (err) => {
    // Same error handling
    if (err instanceof AxiosError) {
        const message = err.response?.data?.message || 'Error al guardar el registro';
        toast.error(message);
    } else {
        toast.error('Ocurrió un error inesperado');
    }
};

const addItem = () => {
    if (!newProductOrService.value._id) {
        toast.warning('Seleccione un apoyo primero');
        return;
    }

    let description = newProductOrService.value.name;

    if (isMedicineSelected.value && medicineName.value) {
        description = `${newProductOrService.value.name}: ${medicineName.value}`;
    } else if (isOtherSelected.value && otherName.value) {
        description = `${newProductOrService.value.name}: ${otherName.value}`;
    } else if (newProductOrService.value.requiresCustomName) {
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

    // Reset item inputs
    medicineName.value = '';
    otherName.value = '';
    // Keep quantity or reset to 1? usually better to keep 1
    contribution.value.quantity = 1;
};

const removeItem = (index) => {
    contribution.value.productOrServices.splice(index, 1);
}

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

const getSelectedCategory = () => {
    selectedCategory.value = categories.value.find(c => c._id === contribution.value.category._id)
}

onMounted(() => {
    getCategories()
    getFamilyNames()
    getBeneficiaryDetails() // Load beneficiary info for context
})
</script>
