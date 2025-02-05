<template>
    <dialog class="modal" ref="newContributionModalRef">
        <div class="modal-box  w-full max-w-[40vw]">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
                ✕
            </button>
            <h3 class="text-lg font-bold">Nuevo apoyo</h3>
            <p class="text-sm text-gray-l1-color mt-2">
                Por favor, rellene los campos con los datos del apoyo que desea registrar. Recuerde que los datos
                obligatorios se encuentran marcados con un asterisco (*).
            </p>

            <div class="divider"></div>
            <form @submit.prevent="submitForm" class="space-y-4">
                <!-- Tipo de Contribución -->
                <div>
                    <label for="contributionDate" class="block text-sm font-medium text-gray-700">
                        Fecha de apoyo
                    </label>
                    <input type="date" id="contributionDate" v-model="contribution.contributionDate"
                        class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="contributionCategory" class="block text-sm font-medium text-gray-700">
                        Tipo de Apoyo
                    </label>
                    <select id="contributionCategory" v-model="contribution.contributionCategory"
                        @change="getContributionItemsByCategory"
                        class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required>
                        <option value="" disabled>Seleccione un tipo</option>
                        <option class="capitalize" v-for="category in contributionCategories" :key="category._id" :value="category">
                            {{ category.name }}
                        </option>
                    </select>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <!-- Descripción -->
                    <div class="col-span-2">
                        <label for="contributionItem" class="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <span v-if="loading" class="spinner">Cargando...</span>
                        <select v-else id="contributionItem" v-model="newContributionItem"
                            class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required>
                            <option value="" disabled>Seleccione el apoyo otorgado</option>
                            <option v-for="item in contributionItems" :key="item._id" :value="item">
                                {{ item.description }}
                            </option>
                        </select>
                    </div>

                    <!-- Cantidad -->
                    <div>
                        <label for="quantity" class="block text-sm font-medium text-gray-700">
                            Cantidad
                        </label>
                        <input type="number" id="quantity" v-model="contribution.quantity" min="1"
                            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required />
                    </div>
                </div>

                <!-- Items List -->

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-6">

                    <!-- Items List -->
                    <ul v-if="contribution.contributionItems.length > 0"
                        class=" col-span-5 divide-y divide-gray-200 border border-gray-200 rounded-md">
                        <li v-for="(item, index) in contribution.contributionItems" :key="index"
                            class="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                            <span class="text-sm text-gray-700">{{ item.contributionItem.description }} ( {{
                                item.quantity }} )</span>
                            <button type="button" @click="removeItem(index)"
                                class="text-red-600 hover:text-red-800 text-sm font-medium">
                                Remove
                            </button>
                        </li>
                    </ul>
                    <p v-else class="col-span-5 text-sm text-gray-500 text-center py-2">
                        No items added yet
                    </p>

                    <div class="col-span-1 text-right">
                        <button type="button" @click="addItem"
                            class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">
                            +
                        </button>
                    </div>
                </div>

                <!-- Quien revibe -->
                <div>
                    <label for="receiver" class="block text-sm font-medium text-gray-700">Recibe</label>
                    <input type="text" v-model="contribution.receiver" id="receiver"
                        class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <!-- Comentarios -->
                <div>
                    <label for="comments" class="block text-sm font-medium text-gray-700">Notas / Comentarios</label>
                    <textarea id="comments" v-model="contribution.comments" rows="4" class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>


                <!-- Submit Button -->
                <div class="pt-4">
                    <button type="submit" class="btn bg-red-900 text-white w-full">
                        Otorgar Apoyo
                        <span v-if="loading" class="spinner">Guardando...</span>
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import contributionTypes from '../../constants/contributionTypes'
import contributionServices from '../../services/contributionServices';
import { useAuth } from '../../composables/useAuth';
import { useRouter } from 'vue-router';
import normalizeObjectText from '../../utilities/normalizeObjectText'

// composables
const { authHeader } = useAuth()
const router = useRouter()

//props
const props = defineProps({
    showModal: Boolean,
})

//emits
const emits = defineEmits(['close:modal', 'update:list'])

//data
const newContributionModalRef = ref()
const contributionItems = ref([])
const contributionCategories = ref([])
const loading = ref(false)
const beneficiary = router.currentRoute.value.params.id

const newContributionItem = ref({})

const contribution = ref({
    contributionCategory: '',
    contributionItems: [],
    quantity: 1,
    comments: '',
    receiver: '',
    contributionDate: new Date()
})

//watches
watch(
    () => props.showModal,
    (value) => {
        if (value) {
            newContributionModalRef.value.showModal()
        } else {
            newContributionModalRef.value.close()
        }
    }
)

//methods
const closeModal = () => {
    emits('close:modal')
}

const updateList = () => {
    emits('update:list')
}

const getContributionCategories = async () => {
    loading.value = true
    try {
        const response = await contributionServices.getCategories(authHeader.value)
        if (response.code === "ERR_NETWORK") {
            toast.error('No se pudo conectar con el servidor')
        } else {
            contributionCategories.value = response.data
        }
    } catch (err) {
        if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message)
        } else {
            toast.error(err)
        }
    } finally {
        loading.value = false
    }
}

const getContributionItemsByCategory = async () => {
    loading.value = true
    try {
        const response = await contributionServices.getContributionItemsByCategory({
            category: contribution.value.contributionCategory._id,
        }, authHeader.value)
        if (response.code === "ERR_NETWORK") {
            toast.error('No se pudo conectar con el servidor')
        } else {
            contributionItems.value = response.data
            console.log(contributionItems.value)
        }
    } catch (err) {
        if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message)
        } else {
            toast.error(err)
        }
    } finally {
        loading.value = false
    }
}

const submitForm = async () => {
    loading.value = true
    try {
        const response = await contributionServices.createContribution(normalizeObjectText(
            {
                contributionItems: contribution.value.contributionItems,
                beneficiary: beneficiary,
                comments: contribution.value.comments,
                contributionDate: contribution.value.contributionDate,
                receiver: contribution.value.receiver
            }
        ), authHeader.value)
        if (response.code === "ERR_NETWORK") {
            toast.error('No se pudo conectar con el servidor')
        } else {
           toast.success('Registro creado exitosamente')
          updateList()
        }
    } catch (err) {
        if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message)
        } else {
            toast.error(err)
        }
    } finally {
        loading.value = false
    }
}

const addItem = () => {
    contribution.value.contributionItems.push({
        contributionItem: newContributionItem.value,
        quantity: contribution.value.quantity
    })
}

const removeItem = (index) => {
    contribution.value.contributionItems.splice(index, 1);
}

getContributionCategories()

</script>

<style lang="css" scoped></style>