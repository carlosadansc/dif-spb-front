<template>
  <div class="bg-white p-6 rounded-lg ouline outline-1 outline-gray-200">
    <h3 class="text-sm font-medium text-gray-500">{{ props.title }}</h3>
    <div class="mt-2 flex items-baseline">
      <p class="text-2xl font-semibold text-gray-900">{{ props.value }}</p>
      <p :class="[
        'ml-2 text-sm font-medium',
        props.change >= 0 ? 'text-green-600' : 'text-red-600'
      ]">
        {{ props.change >= 0 ? '+' : '' }}{{ props.change }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  }
})
</script>