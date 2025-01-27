<template>
  <div class="h-[400px] bg-white p-4 rounded-lg shadow-md">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  timeFilter: {
    type: Object,
    required: true
  }
});

const chartData = computed(() => ({
  labels: props.data.map(d => d.date),
  datasets: [
    {
      label: 'Total Launches',
      data: props.data.map(d => d.launches),
      borderColor: '#2563eb',
      tension: 0.1
    },
    {
      label: 'Successful',
      data: props.data.map(d => d.success),
      borderColor: '#16a34a',
      tension: 0.1
    },
    {
      label: 'Failed',
      data: props.data.map(d => d.failures),
      borderColor: '#dc2626',
      tension: 0.1
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Apollo Launches Overview'
    }
  }
};
</script>