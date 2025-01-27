<template>
  <div class="h-[450px] bg-white p-4 rounded-lg border border-gray-300 flex flex-col">
    <h6 class="font-semibold text-lg text-gray-500">Total de apoyos otorgados por categoría</h6>

    <select :value="selectedCategory._id" @change="handlerSelectCategory($event)"
      class="select select-sm rounded-lg border-gray-300 bg-white text-gray-700 my-5 ml-auto">
      <option :value="1" selected>Selecciona una categoría</option>
      <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
    </select>

    <div class="w-full h-[300px]">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import contributionServices from '@/services/contributionServices';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';

// composables
const { authHeader } = useAuth()


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

//data
const loading = ref(false)
const categories = ref([])
const selectedCategory = ref({
  _id: 1,
  name: '',
  description: ''
})

//computed
const data = computed(() => props.data)
const backgroundChartColor = computed(() => { return selectedCategory.value.color ? selectedCategory.value.color : '#454545' })
const chartLabel = computed(() => { return selectedCategory.value.name ? selectedCategory.value.name : 'Todas' })

//emits
const emit = defineEmits(['update:category'])

//chart config                                
const chartData = computed(() => {
  return {
    labels: data.value.map(d => d.description),
    datasets: [{
      label: chartLabel.value,
      data: data.value.map(d => d.totalQuantity),
      backgroundColor: backgroundChartColor.value,
      borderColor: '#000',
      tension: 0.1,
      fill: false
    }]
  };

});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Apoyos otorgados por categoría'
    },
  },
  elements: {
    bar: {
      borderRadius: 10 // Ajusta este valor para redondear las barras
    }
  }
};

//methods
const getCategories = async () => {
  try {
    loading.value = true
    const response = await contributionServices.getCategories(authHeader.value);
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

const handlerSelectCategory = (event) => {
  if (event.target.value === '1') {
    selectedCategory.value = {
      _id: 1,
      name: '',
      description: ''
    }
    emit('update:category', selectedCategory.value)
    return
  }
  const category = categories.value.find(c => c._id === event.target.value)
  selectedCategory.value = category
  emit('update:category', category)
}

onMounted(() => {
  getCategories()
})

</script>