<template>
  <dialog ref="detailsModalRef" class="modal" aria-labelledby="contribution-details-title" @close="handleDialogClose" @cancel.prevent="closeModal">
    <div class="modal-box flex max-h-[92dvh] w-[calc(100%_-_1rem)] max-w-5xl flex-col overflow-hidden p-0 sm:w-full">
      <div class="shrink-0 px-5 pt-5 sm:px-7 sm:pt-6">
        <AppModalHeader title="Detalle del apoyo" :description="`Folio ${contribution.folio || 'sin asignar'}`"
          title-id="contribution-details-title" @close="closeModal">
          <template #icon><IconHeartHandshake class="h-5 w-5" /></template>
        </AppModalHeader>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-7">
        <section class="rounded-2xl border border-red-100 bg-red-50/60 p-4 sm:p-5" aria-labelledby="support-summary-title">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div class="min-w-0">
              <p id="support-summary-title" class="text-xs font-semibold uppercase tracking-wide text-red-800">Apoyo entregado a</p>
              <p class="mt-1 truncate text-lg font-bold text-gray-950">{{ beneficiaryName }}</p>
              <p v-if="beneficiary?.curp" class="mt-1 font-mono text-xs text-gray-600">{{ beneficiary.curp }}</p>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3">
              <IconPackage class="h-5 w-5 text-red-800" aria-hidden="true" />
              <div><p class="text-xs font-medium text-gray-500">Unidades entregadas</p><p class="text-xl font-bold text-gray-950">{{ totalUnits }}</p></div>
            </div>
          </div>
        </section>

        <section class="detail-section" aria-labelledby="delivery-information-title">
          <div class="detail-section-heading"><IconCalendar class="detail-section-icon" aria-hidden="true" /><h3 id="delivery-information-title">Información de la entrega</h3></div>
          <dl class="detail-grid md:grid-cols-4">
            <div class="detail-field"><dt>Fecha de entrega</dt><dd>{{ formatDate(contribution.contributionDate) }}</dd></div>
            <div class="detail-field"><dt>Entregó</dt><dd>{{ contribution.donor || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Recibió</dt><dd>{{ contribution.receiver || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Registrado por</dt><dd>{{ registeredBy }}</dd></div>
          </dl>
        </section>

        <section class="detail-section" aria-labelledby="delivered-items-title">
          <div class="detail-section-heading">
            <IconHeartHandshake class="detail-section-icon" aria-hidden="true" /><h3 id="delivered-items-title">Apoyos otorgados</h3>
            <span class="ml-auto text-xs font-medium text-gray-500">{{ supportItems.length }} concepto(s)</span>
          </div>
          <div v-if="supportItems.length" class="hidden overflow-hidden rounded-xl border border-gray-200 sm:block">
            <table class="table w-full">
              <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-600"><tr><th>Categoría</th><th>Descripción</th><th class="w-24 text-center">Cantidad</th></tr></thead>
              <tbody>
                <tr v-for="(item, index) in supportItems" :key="item._id || index" class="border-gray-100">
                  <td><span class="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800">{{ item.productOrService?.category?.name || 'Sin categoría' }}</span></td>
                  <td class="text-sm text-gray-700">{{ item.description || 'Sin descripción' }}</td>
                  <td class="text-center text-base font-bold text-gray-950">{{ item.quantity || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="supportItems.length" class="space-y-3 sm:hidden">
            <article v-for="(item, index) in supportItems" :key="`mobile-${item._id || index}`" class="rounded-xl border border-gray-200 p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0"><p class="text-xs font-semibold text-red-800">{{ item.productOrService?.category?.name || 'Sin categoría' }}</p><p class="mt-1 text-sm text-gray-700">{{ item.description || 'Sin descripción' }}</p></div>
                <span class="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-bold text-gray-900">× {{ item.quantity || 0 }}</span>
              </div>
            </article>
          </div>
          <p v-else class="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">No hay conceptos registrados en este apoyo.</p>
        </section>

        <section v-if="contribution.evidencePhoto" class="detail-section" aria-labelledby="evidence-title">
          <div class="detail-section-heading"><IconPhoto class="detail-section-icon" aria-hidden="true" /><h3 id="evidence-title">Evidencia fotográfica</h3></div>
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 sm:p-4">
            <ProtectedImage :path="contribution.evidencePhoto" alt="Evidencia fotográfica de la entrega del apoyo" class="mx-auto max-h-[360px] w-full rounded-lg object-contain" />
          </div>
        </section>

        <section v-if="contribution.comments" class="detail-section" aria-labelledby="contribution-notes-title">
          <div class="detail-section-heading"><IconNotes class="detail-section-icon" aria-hidden="true" /><h3 id="contribution-notes-title">Observaciones</h3></div>
          <p class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{{ contribution.comments }}</p>
        </section>

        <section class="detail-section" aria-labelledby="record-title">
          <div class="detail-section-heading"><IconClock class="detail-section-icon" aria-hidden="true" /><h3 id="record-title">Datos del registro</h3></div>
          <dl class="detail-grid md:grid-cols-3">
            <div class="detail-field"><dt>Fecha de creación</dt><dd>{{ formatDate(contribution.createdAt) }}</dd></div>
            <div v-if="contribution.updatedAt && contribution.updatedAt !== contribution.createdAt" class="detail-field"><dt>Última actualización</dt><dd>{{ formatDate(contribution.updatedAt) }}</dd></div>
            <div v-if="beneficiary?.phone" class="detail-field"><dt>Teléfono del beneficiario</dt><dd>{{ beneficiary.phone }}</dd></div>
          </dl>
        </section>
      </div>

      <footer class="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
        <button type="button" class="btn min-h-11 border-gray-300 bg-white text-gray-700 hover:bg-gray-50" @click="closeModal">Cerrar</button>
        <button type="button" class="btn btn-brand min-h-11" :disabled="isPrinting" @click="handlePrintTicket">
          <span v-if="isPrinting" class="loading loading-spinner loading-sm" aria-hidden="true"></span><IconReceipt2 v-else class="h-5 w-5" aria-hidden="true" />{{ isPrinting ? 'Generando…' : 'Generar recibo' }}
        </button>
      </footer>
    </div>
    <form method="dialog" class="modal-backdrop"><button aria-label="Cerrar detalle del apoyo">Cerrar</button></form>
  </dialog>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { IconCalendar, IconClock, IconHeartHandshake, IconNotes, IconPackage, IconPhoto, IconReceipt2 } from '@tabler/icons-vue';
import { useDate } from '@/utils/dateTool';
import ProtectedImage from '@/components/ProtectedImage.vue';
import AppModalHeader from '@/components/ui/AppModalHeader.vue';

const { formatDate } = useDate();
const props = defineProps({
  contribution: { type: Object, required: true, default: () => ({}) },
  beneficiary: { type: Object, default: null },
  show: { type: Boolean, default: false }
});
const emit = defineEmits(['close', 'print-ticket']);
const detailsModalRef = ref(null);
const supportItems = computed(() => props.contribution.productOrServices || []);
const totalUnits = computed(() => supportItems.value.reduce((total, item) => total + Number(item.quantity || 0), 0));
const beneficiaryName = computed(() => {
  if (!props.beneficiary) return 'Beneficiario no especificado';
  return [props.beneficiary.name, props.beneficiary.fatherSurname, props.beneficiary.motherSurname].filter(Boolean).join(' ');
});
const registeredBy = computed(() => [props.contribution.createdBy?.name, props.contribution.createdBy?.lastname].filter(Boolean).join(' ') || 'No especificado');
const isPrinting = computed(() => Boolean(props.contribution.loadingPrint));

watch(() => props.show, (show) => {
  nextTick(() => {
    if (show && !detailsModalRef.value?.open) detailsModalRef.value?.showModal();
    if (!show && detailsModalRef.value?.open) detailsModalRef.value?.close();
  });
}, { immediate: true });

const handleDialogClose = () => emit('close');
const closeModal = () => {
  if (detailsModalRef.value?.open) detailsModalRef.value.close();
};
const handlePrintTicket = () => emit('print-ticket', props.contribution);
</script>

<style scoped>
.detail-section { @apply mt-7; }
.detail-section-heading { @apply mb-3 flex items-center gap-2 text-sm font-bold text-gray-950; }
.detail-section-icon { @apply h-5 w-5 text-red-800; }
.detail-grid { @apply grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200; }
.detail-field { @apply min-w-0 bg-white px-4 py-3; }
.detail-field dt { @apply text-xs font-medium text-gray-500; }
.detail-field dd { @apply mt-1 break-words text-sm font-semibold text-gray-900; }
</style>
