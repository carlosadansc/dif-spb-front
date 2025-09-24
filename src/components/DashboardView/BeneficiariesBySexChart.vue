<template>
  <div v-if="isLoading" class="skeleton h-[450px]"></div>
  <div v-else class="h-[450px] bg-white p-4 rounded-lg border border-gray-300">
      <h6 class="font-semibold text-lg text-gray-500 mb-[3rem]">Beneficiarios por sexo</h6>
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
    type: Object,
    required: true
  },
  isLoading: Boolean
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
      text: 'Total de beneficiarios por sexo'
    }
  }
};

// computed
const data = computed(() => props.data.stats)
const backgroundColor = computed(() => { return data.value?.map(item => {
  return item.sex === 'HOMBRE' ? '#2E4053' : '#B71540'
}) })

const chartData = computed(() => {
  return {
    labels: data.value?.map(item => item.sex),
    datasets: [{
      data: data.value?.map(item => item.count),
      backgroundColor: backgroundColor.value,
      borderWidth: 2
    }]
  };
});

</script>

<style lang="scss" scoped>

</style>