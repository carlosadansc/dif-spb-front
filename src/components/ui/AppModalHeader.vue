<template>
  <header class="modal-header">
    <div class="flex min-w-0 items-start gap-3">
      <div v-if="$slots.icon" class="modal-header-icon" aria-hidden="true">
        <slot name="icon" />
      </div>
      <div class="min-w-0">
        <h2 :id="titleId" class="modal-title">{{ title }}</h2>
        <p v-if="description" class="modal-description">{{ description }}</p>
      </div>
    </div>
    <button type="button" class="btn btn-ghost btn-square btn-sm shrink-0" :aria-label="closeLabel" @click="$emit('close')">
      <IconX class="h-5 w-5" aria-hidden="true" />
    </button>
  </header>
</template>

<script setup>
import { IconX } from '@tabler/icons-vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  titleId: {
    type: String,
    default: undefined
  },
  closeLabel: {
    type: String,
    default: 'Cerrar ventana'
  }
});

defineEmits(['close']);
</script>
