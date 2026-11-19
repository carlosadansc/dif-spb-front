<template>
  <img v-if="imageUrl" :src="imageUrl" :alt="alt" />
</template>

<script setup>
import { computed } from 'vue';
import { useProtectedImage } from '@/composables/useProtectedImage';

const props = defineProps({
  path: { type: String, default: '' },
  alt: { type: String, default: '' },
});

const source = computed(() => props.path);
const { imageUrl } = useProtectedImage(source);
</script>
