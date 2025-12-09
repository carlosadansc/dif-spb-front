<template>
    <div class="container mx-auto px-4">
        <h1 class="text-2xl font-semibold text-gray-900 mb-8">Jornadas (Apoyos Masivos)</h1>

        <!-- Filtros expandidos -->
        <div class="card bg-base-100 shadow-sm border mb-6">
            <div class="card-body p-4">
                <div class="flex items-start gap-4">
                    <!-- Búsqueda -->
                    <label class="input input-bordered flex items-center gap-2 grow">
                        <input v-model="search" @keyup.enter="applyFilters()" type="text" class="grow"
                            placeholder="Buscar por folio, comentarios, responsable..." />
                        <IconSearch class="h-5 w-5" />
                    </label>

                    <!-- Dropdown para filtros avanzados -->
                    <div class="dropdown dropdown-end">
                        <label tabindex="0" class="btn btn-ghost">
                            <IconFilter class="h-5 w-5 mr-2" />
                            Filtros
                        </label>
                        <div tabindex="0"
                            class="dropdown-content z-[9999] card card-compact w-[25rem] p-4 shadow bg-base-100 border">
                            <div class="card-body">
                                <h3 class="card-title">Filtros avanzados</h3>
                                <div class="grid grid-cols-1 gap-4 mt-4">
                                    <!-- Filtro por categoría -->
                                    <select v-model="filters.category" @change="applyFilters()"
                                        class="select select-sm select-bordered w-full">
                                        <option value="">Todas las categorías</option>
                                        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                                            {{ cat.name }}
                                        </option>
                                    </select>

                                    <!-- Filtro por rango de fechas -->
                                    <div class="form-control">
                                        <label class="label">
                                            <span class="label-text">Fecha Inicio</span>
                                        </label>
                                        <input type="date" v-model="filters.startDate"
                                            class="input input-sm input-bordered" @change="applyFilters" />
                                    </div>

                                    <div class="form-control">
                                        <label class="label">
                                            <span class="label-text">Fecha Fin</span>
                                        </label>
                                        <input type="date" v-model="filters.endDate"
                                            class="input input-sm input-bordered" @change="applyFilters" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex justify-between items-center mt-4">
                    <button @click="clearFilters()" class="btn btn-ghost btn-sm">
                        <IconFilterX class="h-4 w-4 mr-2" />
                        Limpiar filtros
                    </button>

                    <div class="flex items-center gap-3">
                        <div class="tooltip tooltip-left" data-tip="Nueva Jornada Masiva">
                            <button @click="openNewMassiveContribution"
                                class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">
                                <IconPlus />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <EasyDataTable v-model:server-options="serverOptions" :server-items-length="serverItemsLength"
            :headers="headers" :items="data" :rows-items="rowsItems" :loading="loading"
            rows-per-page-message="Se muestran" alternating>

            <template #item-contributionDate="{ contributionDate }">
                {{ formatDateShort(contributionDate) }}
            </template>

            <template #item-category="item">
                <span class="badge badge-ghost">
                    {{ getCategoryName(item.productOrServices) }}
                </span>
            </template>

            <template #item-items="{ productOrServices }">
                <div class="flex flex-col gap-1">
                    <span v-for="(item, idx) in productOrServices.slice(0, 3)" :key="idx" class="text-xs">
                        {{ item.productOrService?.name }} ({{ item.quantity }})
                    </span>
                    <span v-if="productOrServices.length > 3" class="text-xs text-gray-500 underline">
                        +{{ productOrServices.length - 3 }} más
                    </span>
                </div>
            </template>

            <template #item-beneficiaries="{ beneficiaries }">
                <span class="badge badge-primary badge-outline">{{ beneficiaries.length }} Beneficiarios</span>
            </template>

            <template #item-actions="{ _id }">
                <div class="flex gap-1">
                    <!-- Aquí se podrían agregar acciones futuras como ver detalle de jornada -->
                    <button @click="openMassiveContributionDetails(_id)"
                        class="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50" title="Ver detalles">
                        <IconFileInfo class="h-4 w-4" />
                    </button>
                    <button @click="generateAndDownloadPdf(_id)"
                        class="btn btn-ghost btn-xs text-red-600 hover:bg-red-50" title="Descargar PDF">
                        <IconFileTypePdf class="h-4 w-4" />
                    </button>
                </div>
            </template>
        </EasyDataTable>

    </div>

    <MassiveContributionDetailsModal :show="showDetailsModal" :contribution="selectedContribution"
        @close="showDetailsModal = false" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { IconSearch, IconFilterX, IconFilter, IconPlus, IconFileInfo, IconFileTypePdf } from '@tabler/icons-vue';
import contributionServices from '../services/contributionServices';
import { useAuth } from '../composables/useAuth';
import { AxiosError } from 'axios';
import { useDate } from '../utils/dateTool';
import MassiveContributionDetailsModal from '../components/BeneficiaryView/MassiveContributionDetailsModal.vue';


const showDetailsModal = ref(false);
const selectedContribution = ref({});

const openMassiveContributionDetails = async (id) => {
    try {
        const response = await contributionServices.getContribution(id, authHeader.value);
        if (response.data) {
            selectedContribution.value = response.data;
            showDetailsModal.value = true;
        } else {
            toast.error('No se pudieron cargar los detalles de la jornada');
        }
    } catch (error) {
        toast.error('Error al obtener detalles');
    }
};


// Composables
const { authHeader } = useAuth();
const router = useRouter();
const { formatDateShort } = useDate();

// Data
const serverItemsLength = ref(0);
const rowsItems = [5, 10, 15, 20];
const serverOptions = ref({
    page: 1,
    rowsPerPage: 10,
    sortBy: 'createdAt',
    sortType: 'desc',
});

const headers = [
    { text: 'Fecha', value: 'contributionDate', sortable: true },
    { text: 'Folio', value: 'folio' },
    { text: 'Categoría', value: 'category' },
    { text: 'Apoyos Entregados', value: 'items' },
    { text: 'Total Beneficiarios', value: 'beneficiaries' },
    { text: 'Responsable', value: 'receiver' },
    { text: 'Acciones', value: 'actions' },
];

const data = ref([]);
const loading = ref(false);
const search = ref('');
const categories = ref([]);

const filters = ref({
    category: '',
    startDate: '',
    endDate: ''
});

// Watchers
watch(serverOptions, () => { getMassiveContributionsData() }, { deep: true });

// Methods
const openNewMassiveContribution = () => {
    router.push('/massive-contribution');
};



const generateAndDownloadPdf = (id) => {
    // TODO: Implement PDF generation
    toast.info('Generando PDF para ' + id);
};



const getCategoryName = (productOrServices) => {
    // console.log('Checking category for:', productOrServices); // Dubug log
    if (!productOrServices || !Array.isArray(productOrServices) || productOrServices.length === 0) return 'Sin items';

    // Buscar el primer item que tenga categoría válida
    for (const item of productOrServices) {
        if (item.productOrService?.category?.name) {
            return item.productOrService.category.name;
        }
    }

    return 'N/A';
};

const getCategories = async () => {
    try {
        const response = await contributionServices.getCategories(authHeader.value);
        if (response.data) {
            categories.value = response.data;
        }
    } catch (error) {
        console.error("Error loading categories", error);
    }
};

const getMassiveContributionsData = async () => {
    loading.value = true;
    try {
        const page = serverOptions.value.page;
        const limit = serverOptions.value.rowsPerPage;
        const sort = serverOptions.value.sortBy;
        const order = serverOptions.value.sortType === 'desc' ? 'desc' : 'asc';

        const params = {
            page,
            limit,
            sort,
            order,
            search: search.value,
            ...filters.value
        };

        // Clean empty params
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null) {
                delete params[key];
            }
        });

        const response = await contributionServices.getMassiveContributions(params, authHeader.value);

        // Ajustar según la respuesta del backend
        if (response.data) {
            data.value = response.data;
            serverItemsLength.value = response.pagination?.total || 0;
        } else {
            data.value = [];
            serverItemsLength.value = 0;
        }

    } catch (err) {
        data.value = [];
        serverItemsLength.value = 0;
        if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message || 'Error al obtener jornadas');
        } else {
            // toast.error('Error desconocido'); 
            // Silencioso o log
            console.error(err);
        }
    } finally {
        loading.value = false;
    }
};

const applyFilters = () => {
    serverOptions.value.page = 1;
    getMassiveContributionsData();
};

const clearFilters = () => {
    filters.value = {
        category: '',
        startDate: '',
        endDate: ''
    };
    search.value = '';
    getMassiveContributionsData();
};

onMounted(async () => {
    await getCategories();
    await getMassiveContributionsData();
});
</script>

<style scoped>
/* Estilos similares a BeneficiariesView */
</style>
