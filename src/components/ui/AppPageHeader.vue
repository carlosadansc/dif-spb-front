<template>
  <header class="page-header">
    <div class="flex min-w-0 items-start gap-3">
      <div v-if="$slots.icon" class="page-header-icon" aria-hidden="true">
        <slot name="icon" />
      </div>
      <div class="min-w-0">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="description" class="page-description">{{ description }}</p>
      </div>
    </div>

    <div v-if="$slots.default" class="page-actions">
      <slot />
    </div>
  </header>
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
