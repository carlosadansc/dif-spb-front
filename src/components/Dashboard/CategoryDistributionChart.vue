<template>
  <div class="h-[450px] bg-white p-4 rounded-lg border border-gray-300">
    <h6 class="font-semibold text-lg text-gray-500 mb-[3rem]">Total de apoyos otorgados por categoría</h6>
    <div class="w-full h-[300px]">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

//data
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: false,
      text: 'Total de apoyos otorgados'
    }
  }
};

// computed
const data = computed(() => props.data)

const chartData = computed(() => {
  return {
    labels: data.value.map(item => item.category),
    datasets: [{
      data: data.value.map(item => item.totalQuantity),
      backgroundColor: data.value.map(item => item.categoryColor),
      borderWidth: 2
    }]
  };
});
</script>