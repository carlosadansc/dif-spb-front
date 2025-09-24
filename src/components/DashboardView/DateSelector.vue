<template>
  <div class="flex flex-wrap gap-4 mb-6 items-center">
    <select :value="modelValue.year?.toString()" @change="updateYear($event.target.value)"
      class="select rounded-lg border-gray-300 px-10 py-2 bg-white text-gray-700">
      <option value="" selected>Selecciona un año</option>
      <option v-for="year in years" :key="year._id" :value="year._id">
        {{ year._id }}
      </option>
    </select>

    <select v-if="modelValue.year" :value="modelValue.month?.toString()" @change="updateMonth($event.target.value)"
      class="select rounded-lg border-gray-300 px-10 py-2 bg-white text-gray-700">
      <option value="">Selecciona un mes</option>
      <option v-for="month in months" :key="month.value" :value="month.value">
        {{ month.label }}
      </option>
    </select>

    <button @click="showAllData"
      class="btn px-4 py-2 rounded-lg text-sm font-medium bg-red-800 text-white hover:bg-red-500 transition-colors">
      Ver todo
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import contributionServices from '@/services/contributionServices';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

// composables
const { authHeader } = useAuth()

//data
const loading = ref(false)

const emit = defineEmits(['update:modelValue']);

const years = ref([])

const months = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

//methods

const getYearsData = async () => {
  try {
    loading.value = true
    const response = await contributionServices.getContributionYears(authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      years.value = response.data
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

const updateYear = (year) => {
  emit('update:modelValue', {
    ...props.modelValue,
    year: year ? parseInt(year) : null
  });
};

const updateMonth = (month) => {
  emit('update:modelValue', {
    ...props.modelValue,
    month: month ? parseInt(month) : null
  });
};

const showAllData = () => {
  emit('update:modelValue', {
    year: null,
    month: null
  });
};

getYearsData();
</script>