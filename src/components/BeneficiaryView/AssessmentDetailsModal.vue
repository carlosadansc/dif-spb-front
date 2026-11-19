<template>
  <dialog ref="detailsModalRef" class="modal" aria-labelledby="assessment-details-title" @close="handleDialogClose" @cancel.prevent="closeModal">
    <div class="modal-box flex max-h-[92dvh] w-[calc(100%_-_1rem)] max-w-6xl flex-col overflow-hidden p-0 sm:w-full">
      <div class="shrink-0 px-5 pt-5 sm:px-7 sm:pt-6">
        <AppModalHeader title="Estudio socioeconómico" :description="`Folio ${assessment.folio || 'sin asignar'}`"
          title-id="assessment-details-title" @close="closeModal">
          <template #icon><IconClipboardData class="h-5 w-5" /></template>
        </AppModalHeader>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-7">
        <section aria-labelledby="economic-summary-title">
          <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p id="economic-summary-title" class="text-xs font-semibold uppercase tracking-wide text-red-800">Resumen económico del hogar</p>
              <p class="mt-1 text-sm text-gray-600">Situación registrada el {{ formatDate(assessment.assessmentDate) }}</p>
            </div>
            <span class="w-fit rounded-full border px-3 py-1 text-xs font-semibold" :class="balanceBadgeClass">{{ balanceLabel }}</span>
          </div>
          <dl class="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 lg:grid-cols-4">
            <div class="summary-field"><dt>Integrantes</dt><dd>{{ snapshot.householdSize || 0 }}</dd></div>
            <div class="summary-field"><dt>Ingreso mensual</dt><dd class="text-emerald-700">{{ formatMoney(totalIncome) }}</dd></div>
            <div class="summary-field"><dt>Gasto mensual</dt><dd class="text-red-700">{{ formatMoney(totalExpenses) }}</dd></div>
            <div class="summary-field"><dt>Balance</dt><dd :class="balanceTextClass">{{ formatMoney(balance) }}</dd></div>
          </dl>
        </section>

        <section class="detail-section" aria-labelledby="assessment-information-title">
          <div class="detail-section-heading"><IconCalendar class="detail-section-icon" aria-hidden="true" /><h3 id="assessment-information-title">Datos de la evaluación</h3></div>
          <dl class="detail-grid md:grid-cols-3">
            <div class="detail-field"><dt>Fecha de evaluación</dt><dd>{{ formatDate(assessment.assessmentDate) }}</dd></div>
            <div class="detail-field"><dt>Registrado por</dt><dd>{{ registeredBy }}</dd></div>
            <div class="detail-field"><dt>Folio</dt><dd class="font-mono">{{ assessment.folio || 'No asignado' }}</dd></div>
          </dl>
        </section>

        <section class="detail-section" aria-labelledby="beneficiary-economic-title">
          <div class="detail-section-heading"><IconUser class="detail-section-icon" aria-hidden="true" /><h3 id="beneficiary-economic-title">Perfil del beneficiario</h3></div>
          <dl class="detail-grid md:grid-cols-3">
            <div class="detail-field"><dt>Ingreso personal</dt><dd class="text-emerald-700">{{ formatMoney(snapshot.income) }}</dd></div>
            <div class="detail-field"><dt>Ocupación</dt><dd>{{ snapshot.occupation || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Escolaridad</dt><dd>{{ getScholarshipText(snapshot.scholarship) }}</dd></div>
            <div class="detail-field"><dt>Estado civil</dt><dd>{{ getCivilStatusText(snapshot.civilStatus) }}</dd></div>
            <div class="detail-field"><dt>Servicio médico</dt><dd>{{ getMedicalServiceText(snapshot.medicalService) }}</dd></div>
          </dl>
        </section>

        <section v-if="snapshot.address" class="detail-section" aria-labelledby="address-title">
          <div class="detail-section-heading"><IconMapPin class="detail-section-icon" aria-hidden="true" /><h3 id="address-title">Domicilio</h3></div>
          <dl class="detail-grid md:grid-cols-3">
            <div class="detail-field md:col-span-2"><dt>Calle</dt><dd>{{ snapshot.address.street || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Número exterior</dt><dd>{{ snapshot.address.extNum || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Colonia</dt><dd>{{ snapshot.address.neighborhood || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Delegación</dt><dd>{{ snapshot.address.delegation || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Subdelegación</dt><dd>{{ snapshot.address.subdelegation || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Código postal</dt><dd>{{ snapshot.address.cp || 'No especificado' }}</dd></div>
          </dl>
        </section>

        <section v-if="snapshot.spouseOrTutor?.fullname" class="detail-section" aria-labelledby="spouse-title">
          <div class="detail-section-heading"><IconUsers class="detail-section-icon" aria-hidden="true" /><h3 id="spouse-title">Cónyuge o tutor</h3></div>
          <dl class="detail-grid md:grid-cols-3">
            <div class="detail-field md:col-span-2"><dt>Nombre completo</dt><dd>{{ snapshot.spouseOrTutor.fullname }}</dd></div>
            <div class="detail-field"><dt>Parentesco</dt><dd>{{ snapshot.spouseOrTutor.relationship || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Edad</dt><dd>{{ snapshot.spouseOrTutor.age || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Teléfono</dt><dd>{{ snapshot.spouseOrTutor.phone || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Trabajo</dt><dd>{{ snapshot.spouseOrTutor.work || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Ingreso</dt><dd class="text-emerald-700">{{ formatMoney(snapshot.spouseOrTutor.income) }}</dd></div>
          </dl>
        </section>

        <section v-if="snapshot.home" class="detail-section" aria-labelledby="home-title">
          <div class="detail-section-heading"><IconHome class="detail-section-icon" aria-hidden="true" /><h3 id="home-title">Vivienda y servicios</h3></div>
          <dl class="detail-grid md:grid-cols-3">
            <div class="detail-field"><dt>Tipo de vivienda</dt><dd>{{ snapshot.home.type || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Número de cuartos</dt><dd>{{ snapshot.home.roomNumber || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Pertenencia</dt><dd>{{ snapshot.home.belonging || 'No especificada' }}</dd></div>
            <div class="detail-field"><dt>Tipo de piso</dt><dd>{{ snapshot.home.floorType || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Tipo de pared</dt><dd>{{ snapshot.home.wallType || 'No especificado' }}</dd></div>
            <div class="detail-field"><dt>Tipo de techo</dt><dd>{{ snapshot.home.ceilingType || 'No especificado' }}</dd></div>
          </dl>
          <div class="mt-4">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Servicios disponibles</p>
            <ul class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-label="Servicios de la vivienda">
              <li v-for="service in homeServices" :key="service.label" class="flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium"
                :class="service.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-gray-50 text-gray-500'">
                <IconCheck v-if="service.enabled" class="h-4 w-4 shrink-0" aria-hidden="true" />
                <IconX v-else class="h-4 w-4 shrink-0" aria-hidden="true" />
                {{ service.label }}
              </li>
            </ul>
          </div>
        </section>

        <section v-if="snapshot.expenses" class="detail-section" aria-labelledby="expenses-title">
          <div class="detail-section-heading"><IconReceipt2 class="detail-section-icon" aria-hidden="true" /><h3 id="expenses-title">Gastos mensuales del hogar</h3></div>
          <dl class="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div v-for="expense in expenseItems" :key="expense.label" class="rounded-xl border border-gray-200 bg-white p-4">
              <dt class="text-xs font-medium text-gray-500">{{ expense.label }}</dt>
              <dd class="mt-1 text-base font-bold text-gray-900">{{ formatMoney(expense.value) }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="familyMembers.length" class="detail-section" aria-labelledby="family-title">
          <div class="detail-section-heading"><IconUsers class="detail-section-icon" aria-hidden="true" /><h3 id="family-title">Integración familiar</h3><span class="ml-auto text-xs font-medium text-gray-500">{{ familyMembers.length }} integrante(s)</span></div>
          <div class="hidden overflow-x-auto rounded-xl border border-gray-200 md:block">
            <table class="table table-sm w-full">
              <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-600"><tr><th>Nombre</th><th>Edad</th><th>Sexo</th><th>Parentesco</th><th>Escolaridad</th><th>Ocupación</th><th class="text-right">Ingreso</th></tr></thead>
              <tbody><tr v-for="(member, index) in familyMembers" :key="member._id || index"><td class="font-semibold text-gray-900">{{ member.name }} {{ member.lastname }}</td><td>{{ member.age || '—' }}</td><td>{{ member.sex || '—' }}</td><td>{{ member.relationship || '—' }}</td><td>{{ getScholarshipText(member.scholarship) }}</td><td>{{ member.occupation || '—' }}</td><td class="text-right font-semibold text-emerald-700">{{ formatMoney(member.income) }}</td></tr></tbody>
            </table>
          </div>
          <div class="space-y-3 md:hidden">
            <article v-for="(member, index) in familyMembers" :key="`family-mobile-${member._id || index}`" class="rounded-xl border border-gray-200 p-4">
              <div class="flex items-start justify-between gap-3"><div><p class="font-semibold text-gray-950">{{ member.name }} {{ member.lastname }}</p><p class="mt-0.5 text-xs text-gray-500">{{ member.relationship || 'Parentesco no especificado' }} · {{ member.age || '—' }} años</p></div><span class="text-sm font-bold text-emerald-700">{{ formatMoney(member.income) }}</span></div>
              <dl class="mt-3 grid grid-cols-2 gap-3 text-xs"><div><dt class="text-gray-500">Escolaridad</dt><dd class="mt-0.5 font-medium text-gray-800">{{ getScholarshipText(member.scholarship) }}</dd></div><div><dt class="text-gray-500">Ocupación</dt><dd class="mt-0.5 font-medium text-gray-800">{{ member.occupation || 'No especificada' }}</dd></div></dl>
            </article>
          </div>
        </section>

        <section v-if="assessment.notes" class="detail-section" aria-labelledby="assessment-notes-title">
          <div class="detail-section-heading"><IconNotes class="detail-section-icon" aria-hidden="true" /><h3 id="assessment-notes-title">Observaciones</h3></div>
          <p class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{{ assessment.notes }}</p>
        </section>
      </div>

      <footer class="flex shrink-0 justify-end border-t border-gray-200 bg-white px-5 py-4 sm:px-7">
        <button type="button" class="btn min-h-11 w-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:w-auto" @click="closeModal">Cerrar detalle</button>
      </footer>
    </div>
    <form method="dialog" class="modal-backdrop"><button aria-label="Cerrar estudio socioeconómico">Cerrar</button></form>
  </dialog>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { IconCalendar, IconCheck, IconClipboardData, IconHome, IconMapPin, IconNotes, IconReceipt2, IconUser, IconUsers, IconX } from '@tabler/icons-vue';
import { useDate } from '@/utils/dateTool';
import civilStatus from '@/constants/civilStatus';
import scholarships from '@/constants/scholarships';
import medicalServices from '@/constants/medicalServices';
import AppModalHeader from '@/components/ui/AppModalHeader.vue';

const { formatDate } = useDate();
const props = defineProps({ assessment: { type: Object, required: true }, show: { type: Boolean, default: false } });
const emit = defineEmits(['close']);
const detailsModalRef = ref(null);
const snapshot = computed(() => props.assessment.snapshot || {});
const totalIncome = computed(() => Number(snapshot.value.totalHouseholdIncome || 0));
const totalExpenses = computed(() => Number(snapshot.value.totalHouseholdExpenses || 0));
const balance = computed(() => totalIncome.value - totalExpenses.value);
const familyMembers = computed(() => snapshot.value.familyMembers || []);
const registeredBy = computed(() => [props.assessment.createdBy?.name, props.assessment.createdBy?.lastname].filter(Boolean).join(' ') || 'No especificado');
const balanceLabel = computed(() => balance.value < 0 ? 'Déficit mensual' : balance.value > 0 ? 'Balance favorable' : 'Balance equilibrado');
const balanceTextClass = computed(() => balance.value < 0 ? 'text-red-700' : balance.value > 0 ? 'text-emerald-700' : 'text-gray-700');
const balanceBadgeClass = computed(() => balance.value < 0 ? 'border-red-200 bg-red-50 text-red-800' : balance.value > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-gray-50 text-gray-700');
const homeServices = computed(() => [
  { label: 'Baño', enabled: snapshot.value.home?.haveBathroom },
  { label: 'Sanitario', enabled: snapshot.value.home?.haveToilet },
  { label: 'Drenaje', enabled: snapshot.value.home?.haveDrainage },
  { label: 'Agua', enabled: snapshot.value.home?.haveWaterService },
  { label: 'Electricidad', enabled: snapshot.value.home?.haveElectricService },
  { label: 'Aire acondicionado', enabled: snapshot.value.home?.haveAirConditioning },
  { label: 'TV', enabled: snapshot.value.home?.haveTvService }
]);
const expenseItems = computed(() => [
  { label: 'Transporte', value: snapshot.value.expenses?.transport },
  { label: 'Alimentación', value: snapshot.value.expenses?.meal },
  { label: 'TV / Internet', value: snapshot.value.expenses?.tvService },
  { label: 'Agua', value: snapshot.value.expenses?.waterService },
  { label: 'Electricidad', value: snapshot.value.expenses?.electricService },
  { label: 'Otros gastos', value: snapshot.value.expenses?.otherExpenses }
]);

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
const formatMoney = (value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(Number(value || 0));
const findCatalogText = (catalog, value) => catalog.find(item => item.value === value)?.text || value || 'No especificado';
const getCivilStatusText = (value) => findCatalogText(civilStatus, value);
const getScholarshipText = (value) => findCatalogText(scholarships, value);
const getMedicalServiceText = (value) => findCatalogText(medicalServices, value);
</script>

<style scoped>
.summary-field { @apply min-w-0 bg-white px-4 py-4; }
.summary-field dt { @apply text-xs font-medium text-gray-500; }
.summary-field dd { @apply mt-1 break-words text-lg font-bold text-gray-950; }
.detail-section { @apply mt-7; }
.detail-section-heading { @apply mb-3 flex items-center gap-2 text-sm font-bold text-gray-950; }
.detail-section-icon { @apply h-5 w-5 text-red-800; }
.detail-grid { @apply grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200; }
.detail-field { @apply min-w-0 bg-white px-4 py-3; }
.detail-field dt { @apply text-xs font-medium text-gray-500; }
.detail-field dd { @apply mt-1 break-words text-sm font-semibold text-gray-900; }
</style>
