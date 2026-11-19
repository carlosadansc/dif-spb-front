<template>
    <div class="modal" :class="{ 'modal-open': show }" role="dialog" aria-modal="true" @click.self="handleClose">
        <div class="modal-box">
            <AppModalHeader title="Otorgar apoyo" description="Busca al beneficiario por CURP para continuar con la entrega." @close="handleClose">
                <template #icon><IconHeartHandshake class="h-5 w-5" /></template>
            </AppModalHeader>

            <div class="form-control">
                <label class="label">
                    <span class="label-text font-medium">CURP del beneficiario</span>
                </label>
                <input v-model="curp" v-maska="'@@@@######@@@@@@**'" type="text" placeholder="Ingresa el CURP"
                    class="input input-bordered w-full uppercase" maxlength="18" @input="curp = curp.toUpperCase()"
                    @keyup.enter="searchBeneficiary" :disabled="isSearching" />
                <label class="label">
                    <span class="label-text-alt text-gray-500">Ingresa el CURP de 18 caracteres</span>
                </label>
            </div>

            <div v-if="errorMessage" class="alert mt-4 border border-red-200 bg-red-50 text-red-900" role="alert">
                <IconAlertCircle class="h-5 w-5" />
                <span>{{ errorMessage }}</span>
            </div>

            <div class="modal-action">
                <button class="btn" @click="handleClose" :disabled="isSearching">
                    Cancelar
                </button>
                <button class="btn btn-brand min-w-32" @click="searchBeneficiary" :disabled="!isValidCurp || isSearching">
                    <span v-if="isSearching" class="loading loading-spinner loading-sm"></span>
                    <IconSearch v-else class="h-4 w-4" />
                    <span>{{ isSearching ? 'Buscando...' : 'Buscar CURP' }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import beneficiaryServices from '@/services/beneficiaryServices';
import { IconAlertCircle, IconHeartHandshake, IconSearch } from '@tabler/icons-vue';
import AppModalHeader from '@/components/ui/AppModalHeader.vue';

// Props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

// Emits
const emit = defineEmits(['close', 'beneficiary-found', 'beneficiary-not-found']);

// Composables
const { authHeader } = useAuth();

// Data
const curp = ref('');
const isSearching = ref(false);
const errorMessage = ref('');

// Computed
const isValidCurp = computed(() => {
    return curp.value.length === 18;
});

// Methods
const searchBeneficiary = async () => {
    if (!isValidCurp.value) {
        errorMessage.value = 'El CURP debe tener 18 caracteres';
        return;
    }

    isSearching.value = true;
    errorMessage.value = '';

    try {
        const response = await beneficiaryServices.checkBeneficiaryExistsByCurp(
            curp.value,
            authHeader.value
        );

        // La respuesta tiene la estructura: { data: {...beneficiario}, errors: [] }
        if (response.data && response.data._id) {
            // Beneficiario encontrado
            toast.success('Beneficiario encontrado');
            emit('beneficiary-found', response.data);
            handleClose();
        } else {
            // Beneficiario no encontrado
            toast.info('Beneficiario no registrado. Abriendo formulario de registro...');
            emit('beneficiary-not-found', curp.value);
            handleClose();
        }
    } catch (err) {
        if (err instanceof AxiosError) {
            errorMessage.value = err.response?.data?.message || 'Error al buscar beneficiario';
            toast.error(errorMessage.value);
        } else {
            errorMessage.value = 'Error inesperado al buscar beneficiario';
            toast.error(errorMessage.value);
        }
    } finally {
        isSearching.value = false;
    }
};

const handleClose = () => {
    curp.value = '';
    errorMessage.value = '';
    emit('close');
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
