<template>
  <fieldset>
    <legend class="mb-3 text-sm font-bold text-gray-900">Periodo del reporte</legend>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="form-control">
        <span class="label-text mb-2 font-semibold text-gray-800">Desde</span>
        <input :value="dateFrom" type="date" class="input input-bordered w-full"
          @input="$emit('update:dateFrom', $event.target.value)" />
      </label>
      <label class="form-control">
        <span class="label-text mb-2 font-semibold text-gray-800">Hasta</span>
        <input :value="dateTo" type="date" class="input input-bordered w-full"
          @input="$emit('update:dateTo', $event.target.value)" />
      </label>
    </div>
    <p class="mt-2 text-xs text-gray-500">Deja ambas fechas vacías para incluir todo el historial.</p>
  </fieldset>
</template>

<script setup>
defineProps({
  dateFrom: { type: String, default: '' },
  dateTo: { type: String, default: '' }
})

defineEmits(['update:dateFrom', 'update:dateTo'])
</script>
