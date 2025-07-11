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
          <label for="contributionDate" class="block text-sm font-medium text-gray-700 required">
            Fecha de apoyo
          </label>
          <input type="date" id="contributionDate" v-model="contribution.contributionDate"
            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 required">
            Tipo de Apoyo
          </label>
          <select id="category" v-model="contribution.category" @change="getSelectedCategory"
            class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required>
            <option value="" disabled>Seleccione un tipo</option>
            <option class="capitalize" v-for="category in categories" :key="category._id" :value="category">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- Descripción -->
          <div class="col-span-2">
            <label for="productOrService" class="block text-sm font-medium text-gray-700 required">
              Descripción
            </label>
            <select id="productOrService" v-model="newProductOrService"
              class="input select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required>
              <option value="" disabled>Seleccione el apoyo otorgado</option>
              <option v-for="item in selectedCategory.productOrServices" :key="item._id" :value="item">
                {{ item.name }}
              </option>
            </select>

            <!-- Campo para nombre de medicamento (solo visible cuando es medicamento) -->
            <div v-if="isMedicineSelected" class="mt-2">
              <label for="medicineName" class="block text-sm font-medium text-gray-700 required">
                Nombre específico del medicamento
              </label>
              <input type="text" id="medicineName" v-model="medicineName"
                class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: Paracetamol 500mg">
            </div>

            <div v-if="isOtherSelected" class="mt-2">
              <label for="otherName" class="block text-sm font-medium text-gray-700 required">
                Nombre específico del apoyo
              </label>
              <input type="text" id="otherName" v-model="otherName"
                class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Especifique el apoyo">
            </div>
          </div>

          <!-- Cantidad -->
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700 required">
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
          <ul v-if="contribution.productOrServices.length > 0"
            class=" col-span-5 divide-y divide-gray-200 border border-gray-200 rounded-md">
            <li v-for="(item, index) in contribution.productOrServices" :key="index"
              class="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span class="text-sm text-gray-700">{{ item.description }} ( {{
                item.quantity }} )</span>
              <button type="button" @click="removeItem(index)"
                class="text-red-600 hover:text-red-800 text-sm font-medium">
                Remove
              </button>
            </li>
          </ul>
          <p v-else class="col-span-5 text-sm text-gray-500 text-center mt-7 text-red-600">
            No se ha agregado ningun tipo apoyo
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
          <label for="receiver" class="block text-sm font-medium text-gray-700 required">Recibe</label>
          <input v-model="contribution.receiver" id="receiver" list="families"
            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          <datalist id="families">
            <option v-for="(item, index) in families" :key="index" :value="item.name">
              {{ item.name }}
            </option>
          </datalist>
        </div>

        <!-- Comentarios -->
        <div>
          <label for="comments" class="block text-sm font-medium text-gray-700">Notas / Comentarios</label>
          <textarea id="comments" v-model="contribution.comments" rows="4"
            class="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>


        <!-- Submit Button -->
        <div class="pt-4">
          <button :disabled="loading" type="submit" class="btn bg-red-900 text-white w-full">
            <span v-if="!loading">Otorgar Apoyo</span>
            <span v-else class="loading loading-spinner loading-lg"></span>
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import contributionServices from '@/services/contributionServices';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import normalizeObjectText from '@/utils/normalizeObjectText'
import beneficiaryServices from '@/services/beneficiaryServices'

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
const medicineName = ref('');
const otherName = ref('');
const categories = ref([])
const loading = ref(false)
const beneficiary = router.currentRoute.value.params.id
const families = ref([])
const errorMessage = ref('')
const selectedCategory = ref({
  _id: 1,
  name: '',
  description: '',
  productOrServices: []
})

const newProductOrService = ref({})

const contribution = ref({
  category: '',
  productOrServices: [],
  quantity: 1,
  comments: '',
  receiver: '',
  contributionDate: null
})

// computed
const isMedicineSelected = computed(() => {
  return newProductOrService.value?.type === 'medicine' ||
    newProductOrService.value?.name?.toLowerCase().includes('medicamento');
});

const isOtherSelected = computed(() => {
  return newProductOrService.value?.type === 'other' ||
    newProductOrService.value?.name?.toLowerCase().includes('otro');
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

const updateList = () => {
  emits('update:list')
}

const getCategories = async () => {
  loading.value = true
  try {
    const response = await contributionServices.getCategories(authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      categories.value = response.data
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

const getFamilyNames = async () => {
  const response = await beneficiaryServices.getBeneficiaryFamilyNames(beneficiary, authHeader.value)
  try {
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      families.value = response.data
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
  loading.value = true;

  try {
    // Validación antes de enviar
    if (!validateForm()) {
      return;
    }

    const payload = normalizeObjectText(preparePayload());
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

// Funciones auxiliares
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
      description: p.description.toUpperCase(),
      quantity: p.quantity
    })),
    beneficiary: beneficiary,
    comments: contribution.value.comments,
    contributionDate: contribution.value.contributionDate,
    receiver: contribution.value.receiver
  };
};

const handleSuccessResponse = (response) => {
  toast.success('Registro creado exitosamente');
  updateList();
  resetForm(); // Considerar añadir esta función si es necesario
};

const handleSubmissionError = (err) => {
  if (err instanceof AxiosError) {
    if (err.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor. Verifique su conexión a internet');
    } else {
      const serverMessage = err.response?.data?.message || 'Error en el servidor';
      toast.error(`Error: ${serverMessage}`);

      // Log detallado para desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error detallado:', {
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
      }
    }
  } else {
    toast.error(`Error inesperado: ${err.message}`);
    console.error('Error no controlado:', err);
  }
};

const resetForm = () => {
  contribution.value = {
    category: null,
    productOrServices: [],
    contributionDate: null,
    receiver: '',
    comments: '',
    quantity: 1
  };
  newProductOrService.value = {};
  medicineName.value = '';
  otherName.value = '';
};

const addItem = () => {
  if (!newProductOrService.value._id) {
    toast.warning('Seleccione un apoyo primero');
    return;
  }

  // if (isMedicineSelected.value && !medicineName.value) {
  //   toast.warning('Debe especificar el nombre del medicamento');
  //   return;
  // }

  // if (isOtherSelected.value && !otherName.value) {
  //   toast.warning('Debe especificar el nombre del apoyo');
  //   return;
  // }

  const description = isMedicineSelected.value
    ? `${newProductOrService.value.name}: ${medicineName.value}`
    : isOtherSelected.value ? `${newProductOrService.value.name}: 
    ${otherName.value}` : newProductOrService.value.name;


  contribution.value.productOrServices.push({
    productOrService: newProductOrService.value,
    description: description,
    quantity: contribution.value.quantity
  });

  // Resetear campos después de añadir
  medicineName.value = '';
  otherName.value = '';
};


const removeItem = (index) => {
  contribution.value.productOrServices.splice(index, 1);
}

const getSelectedCategory = () => {
  selectedCategory.value = categories.value.find(c => c._id === contribution.value.category._id)
}

onMounted(() => {
  getCategories()
  getFamilyNames()
})

</script>

<style lang="css" scoped></style>