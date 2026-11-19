<template>
  <section v-if="isPending" class="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3" aria-labelledby="pending-title">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div class="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <IconAlertCircle class="mt-0.5 h-5 w-5 shrink-0 text-amber-800 sm:mt-0" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h2 id="pending-title" class="text-sm font-bold text-amber-950">Expediente pendiente</h2>
            <p class="text-xs text-amber-900">{{ missingFields.length }} datos por completar</p>
          </div>
          <div class="mt-1.5 flex max-w-sm items-center gap-2">
            <progress class="progress progress-warning h-1.5 flex-1" :value="completionPercent" max="100"
              :aria-label="`Expediente completado al ${completionPercent}%`"></progress>
            <span class="text-xs font-semibold text-amber-950">{{ completionPercent }}%</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <details class="relative flex-1 text-sm text-amber-950 sm:flex-none">
          <summary class="btn min-h-11 w-full list-none border-amber-300 bg-white text-amber-950 hover:bg-amber-100 sm:w-auto [&::-webkit-details-marker]:hidden">
            Ver pendientes
          </summary>
          <div class="absolute left-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-amber-200 bg-white p-4 shadow-lg sm:left-auto sm:right-0">
            <p class="mb-3 font-semibold text-gray-900">Datos pendientes</p>
            <ul class="grid gap-2">
              <li v-for="field in missingFields" :key="field.key" class="flex items-center gap-2 text-gray-700">
                <span class="h-2 w-2 rounded-full bg-amber-600" aria-hidden="true"></span>
                {{ field.label }}
              </li>
            </ul>
          </div>
        </details>
        <button type="button" class="btn min-h-11 flex-1 bg-amber-900 text-white hover:bg-amber-950 sm:flex-none" @click="$emit('start', firstMissingSection)">
          Completar expediente
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { IconAlertCircle } from '@tabler/icons-vue'
import { beneficiaryCompletionFields, getMissingBeneficiaryFields } from '@/utils/beneficiaryCompletion'

const props = defineProps({ beneficiary: { type: Object, required: true } })
defineEmits(['start'])

const missingFields = computed(() => getMissingBeneficiaryFields(props.beneficiary))
const completionPercent = computed(() => Math.round(((beneficiaryCompletionFields.length - missingFields.value.length) / beneficiaryCompletionFields.length) * 100))
const firstMissingSection = computed(() => missingFields.value[0]?.section || 'general')
const isPending = computed(() => props.beneficiary.registrationStatus === 'PENDING_COMPLETION' || missingFields.value.length > 0)
</script>
