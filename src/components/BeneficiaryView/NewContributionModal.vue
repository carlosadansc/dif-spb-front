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
                    <label for="contributionType" class="block text-sm font-medium text-gray-700">
                        Tipo de Apoyo
                    </label>
                    <select id="contributionType" v-model="contribution.contributionType"
                        class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required>
                        <option value="" disabled>Seleccione un tipo</option>
                        <option v-for="type in contributionTypes" :key="type" :value="type.value">
                            {{ type.text }}
                        </option>
                    </select>
                </div>

                <!-- Descripción -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea id="description" v-model="contribution.description" rows="2"
                        class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required></textarea>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Precio Aproximado -->
                    <div>
                        <label for="approxPrice" class="block text-sm font-medium text-gray-700">
                            Precio Aproximado
                        </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" id="approxPrice" v-model="contribution.approxPrice" min="0" step="0.01"
                                class="input pl-7 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required />
                        </div>
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

                <!-- Comentarios -->
                <div>
                    <label for="comments" class="block text-sm font-medium text-gray-700">
                        Comentarios
                    </label>
                    <textarea id="comments" v-model="contribution.comments" rows="2"
                        class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>

                <!-- Submit Button -->
                <div class="pt-4">
                    <button type="submit" class="btn bg-red-800 text-white w-full">
                        Otorgar Apoyo
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
//props
const props = defineProps({
    showModal: Boolean,
})

//emits
const emits = defineEmits(['close:modal']);

//data
const newContributionModalRef = ref()
const contributionItems = ref([])
const loading = ref(false)
const contribution = ref({
    contributionType: '',
    description: '',
    approxPrice: 0,
    quantity: 0,
    comments: ''
});

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

const getContributionItemsByCategory = async () => {
  loading.value = true
  try {
    const response = await contributionServices.getContributionItemsByCategory({
      category: contribution.value.contributionType,
    })
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contributionItems.value = response.data
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

const submitForm = () => {
    // Reset form
    contribution.value = {
        contributionType: '',
        description: '',
        approxPrice: 0,
        quantity: 0,
        comments: ''
    };
};
</script>

<style lang="css" scoped>

</style>