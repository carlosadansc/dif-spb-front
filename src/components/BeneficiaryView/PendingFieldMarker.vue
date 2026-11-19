<template>
  <span v-if="show" class="tooltip tooltip-top inline-flex align-middle" data-tip="Campo pendiente para completar el expediente">
    <IconAlertCircle class="h-4 w-4 text-amber-700" aria-hidden="true" />
    <span class="sr-only">Campo pendiente</span>
  </span>
</template>

<script setup>
import { IconAlertCircle } from '@tabler/icons-vue'

defineProps({ show: { type: Boolean, default: false } })
</script>
