<template>
  <div class="empty-state">
    <div v-if="$slots.icon" class="empty-state-icon" aria-hidden="true">
      <slot name="icon" />
    </div>
    <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
    <p v-if="description" class="mt-1 max-w-md text-sm leading-6 text-gray-600">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5 flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
