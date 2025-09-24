<template>
  <div v-if="isLoading" class="skeleton h-[450px]"></div>
  <div v-else class="h-[450px] bg-white p-4 rounded-lg border border-gray-300 flex flex-col">
      <h6 class="font-semibold text-lg text-gray-500 mb-[3rem]">Beneficiarios por delegación</h6>

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
import { useAuth } from '@/composables/useAuth';

// composables
const { authHeader } = useAuth()


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  isLoading: Boolean
});

//data
const colors = [
  "#C70039", // rojo cereza - análogo más cálido
  "#581845", // púrpura profundo - análogo más frío
  "#FF5733", // naranja quemado - complementario suave
  "#FFC300", // amarillo ámbar - contraste vivo
  "#2E4053", // azul petróleo - complementario neutro
  "#76448A", // morado medio - análogo extendido
  "#D35400", // naranja cobrizo - complementario cálido
  "#1E8449", // verde esmeralda - complementario opuesto
  "#B71540", // carmesí - análogo cercano
  "#3498DB"  // azul acero - complementario frío
];

//computed
const data = computed(() => props.data.delegations)

//emits
const emit = defineEmits(['update:category'])

//chart config                                
const chartData = computed(() => {
  return {
    labels: data.value?.map(d => d.delegation),
    datasets: [{
      label: 'Total Beneficiarios',
      data: data.value?.map(d => d.count),
      backgroundColor: colors.map(c => c),
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
      text: 'Beneficiarios por delegación'
    },
  },
  elements: {
    bar: {
      borderRadius: 10 // Ajusta este valor para redondear las barras
    }
  }
};

</script>

<style lang="scss" scoped>

</style>