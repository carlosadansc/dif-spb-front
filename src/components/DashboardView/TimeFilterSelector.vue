<template>
  <div class="flex gap-4 mb-6">
    <button v-for="filter in ['weekly', 'monthly', 'yearly']" :key="filter"
      @click="emit('update:modelValue', filter)" :class="[
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        modelValue === filter
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]">
      {{ filter?.charAt(0).toUpperCase() + filter?.slice(1) }}
    </button>
  </div>
</template>


<script setup>

const props = defineProps({
  modelValue: {}
})

const emit = defineEmits(['update:modelValue']);
</script>