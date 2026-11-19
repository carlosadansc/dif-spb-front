<template>
  <main class="app-page">
    <AppPageHeader title="Reportes" description="Genera archivos consolidados desde un solo lugar.">
      <template #icon><IconReportAnalytics class="h-6 w-6" /></template>
    </AppPageHeader>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="grid min-h-[34rem] lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside class="border-b border-gray-200 bg-gray-50 p-4 lg:border-b-0 lg:border-r">
          <p class="px-3 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-500">Tipo de reporte</p>
          <nav class="space-y-1" aria-label="Tipos de reporte">
            <button v-for="report in reports" :key="report.id" type="button"
              class="group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors"
              :class="activeReport === report.id ? 'bg-red-900 text-white shadow-sm' : 'text-gray-700 hover:bg-white'"
              :aria-current="activeReport === report.id ? 'page' : undefined" @click="activeReport = report.id">
              <component :is="report.icon" class="mt-0.5 h-5 w-5 shrink-0"
                :class="activeReport === report.id ? 'text-white' : 'text-red-900'" aria-hidden="true" />
              <span>
                <span class="block text-sm font-bold">{{ report.label }}</span>
                <span class="mt-0.5 block text-xs leading-5"
                  :class="activeReport === report.id ? 'text-red-100' : 'text-gray-500'">{{ report.shortDescription }}</span>
              </span>
            </button>
          </nav>
        </aside>

        <div class="flex min-w-0 flex-col">
          <div class="border-b border-gray-200 px-5 py-5 sm:px-7">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="flex min-w-0 items-start gap-3">
                <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-900">
                  <component :is="selectedReport.icon" class="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-950">{{ selectedReport.label }}</h2>
                  <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-600">{{ selectedReport.description }}</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800">
                <IconFileSpreadsheet class="h-4 w-4" /> Excel (.xlsx)
              </span>
            </div>
          </div>

          <div class="flex-1 px-5 py-6 sm:px-7">
            <div v-if="activeReport === 'beneficiaries'" class="max-w-3xl space-y-5">
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="form-control">
                  <span class="label-text mb-2 font-semibold text-gray-800">Buscar en el padrón</span>
                  <div class="input input-bordered flex items-center gap-2">
                    <IconSearch class="h-5 w-5 text-gray-500" />
                    <input v-model.trim="beneficiaryFilters.search" class="grow" type="search"
                      placeholder="CURP, nombre o apellidos" @keyup.enter="generateReport" />
                  </div>
                </label>
                <label class="form-control">
                  <span class="label-text mb-2 font-semibold text-gray-800">Estado del expediente</span>
                  <select v-model="beneficiaryFilters.registrationStatus" class="select select-bordered w-full">
                    <option value="">Todos los expedientes</option>
                    <option value="PENDING_COMPLETION">Pendientes de completar</option>
                    <option value="COMPLETE">Completos</option>
                  </select>
                </label>
              </div>
              <p class="flex items-start gap-2 text-sm text-gray-600">
                <IconInfoCircle class="mt-0.5 h-4 w-4 shrink-0" />
                El archivo respetará la búsqueda y el estado seleccionados.
              </p>
            </div>

            <div v-else-if="activeReport === 'contributions'" class="max-w-3xl space-y-5">
              <DateRangeFields v-model:date-from="dateFilters.dateFrom" v-model:date-to="dateFilters.dateTo" />
              <p class="flex items-start gap-2 text-sm text-gray-600">
                <IconInfoCircle class="mt-0.5 h-4 w-4 shrink-0" />
                Incluye una fila por cada apoyo entregado dentro del periodo indicado.
              </p>
            </div>

            <div v-else class="max-w-3xl space-y-5">
              <div>
                <label class="form-control">
                  <span class="label-text mb-2 font-semibold text-gray-800">Seleccionar beneficiario</span>
                  <div class="flex flex-col gap-2 sm:flex-row">
                    <div class="input input-bordered flex grow items-center gap-2">
                      <IconSearch class="h-5 w-5 text-gray-500" />
                      <input v-model.trim="beneficiaryQuery" class="grow" type="search" placeholder="CURP, nombre o apellidos"
                        @keyup.enter="searchBeneficiaries" />
                    </div>
                    <button type="button" class="btn min-h-12 btn-outline border-gray-300" :disabled="searchingBeneficiaries"
                      @click="searchBeneficiaries">
                      <IconLoader v-if="searchingBeneficiaries" class="h-5 w-5 animate-spin" />
                      <IconSearch v-else class="h-5 w-5" /> Buscar
                    </button>
                  </div>
                </label>

                <div v-if="beneficiaryResults.length" class="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <button v-for="beneficiary in beneficiaryResults" :key="beneficiary._id" type="button"
                    class="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                    @click="selectBeneficiary(beneficiary)">
                    <span class="min-w-0">
                      <span class="block truncate text-sm font-bold text-gray-900">{{ beneficiaryFullName(beneficiary) }}</span>
                      <span class="block truncate text-xs text-gray-500">{{ beneficiary.curp }}</span>
                    </span>
                    <IconChevronRight class="h-5 w-5 shrink-0 text-gray-400" />
                  </button>
                </div>

                <div v-if="selectedBeneficiary" class="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <IconCircleCheck class="h-5 w-5 shrink-0 text-green-700" />
                    <div class="min-w-0">
                      <p class="truncate text-sm font-bold text-green-950">{{ beneficiaryFullName(selectedBeneficiary) }}</p>
                      <p class="truncate text-xs text-green-800">{{ selectedBeneficiary.curp }}</p>
                    </div>
                  </div>
                  <button type="button" class="btn btn-ghost btn-sm btn-square text-green-900" aria-label="Quitar beneficiario"
                    @click="clearSelectedBeneficiary"><IconX class="h-4 w-4" /></button>
                </div>
              </div>

              <DateRangeFields v-model:date-from="dateFilters.dateFrom" v-model:date-to="dateFilters.dateTo" />
            </div>
          </div>

          <footer class="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div class="flex items-start gap-2 text-xs leading-5 text-gray-600">
              <IconShieldLock class="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <span v-if="lastExport">Última exportación: {{ lastExport.label }} · {{ lastExport.rows }} registro(s).</span>
              <span v-else>Los archivos pueden contener datos personales. Compártelos únicamente con personal autorizado.</span>
            </div>
            <button type="button" class="btn min-h-12 shrink-0 bg-red-900 px-6 font-bold text-white hover:bg-red-950"
              :disabled="isGenerating || (activeReport === 'beneficiary-history' && !selectedBeneficiary)" @click="generateReport">
              <IconLoader v-if="isGenerating" class="h-5 w-5 animate-spin" />
              <IconDownload v-else class="h-5 w-5" />
              {{ isGenerating ? 'Generando…' : 'Generar y descargar' }}
            </button>
          </footer>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import {
  IconChevronRight,
  IconCircleCheck,
  IconDownload,
  IconFileSpreadsheet,
  IconHeartHandshake,
  IconInfoCircle,
  IconLoader,
  IconReportAnalytics,
  IconSearch,
  IconShieldLock,
  IconUserSearch,
  IconUsers,
  IconX
} from '@tabler/icons-vue'
import AppPageHeader from '@/components/ui/AppPageHeader.vue'
import DateRangeFields from '@/components/ReportsView/DateRangeFields.vue'
import beneficiaryServices from '@/services/beneficiaryServices'
import contributionServices from '@/services/contributionServices'
import { useAuth } from '@/composables/useAuth'
import {
  exportBeneficiariesReport,
  exportBeneficiaryContributionsReport,
  exportContributionsReport
} from '@/utils/reportExports'

const { authHeader } = useAuth()

const reports = [
  {
    id: 'beneficiaries',
    label: 'Padrón de beneficiarios',
    shortDescription: 'Datos generales y expediente',
    description: 'Exporta los datos generales del padrón y aplica filtros antes de generar el archivo.',
    icon: IconUsers
  },
  {
    id: 'contributions',
    label: 'Apoyos otorgados',
    shortDescription: 'Entregas y conceptos',
    description: 'Consulta todas las entregas de apoyo y delimita el resultado por fecha.',
    icon: IconHeartHandshake
  },
  {
    id: 'beneficiary-history',
    label: 'Historial individual',
    shortDescription: 'Apoyos por beneficiario',
    description: 'Busca una persona beneficiaria y descarga únicamente su historial de apoyos.',
    icon: IconUserSearch
  }
]

const activeReport = ref('beneficiaries')
const isGenerating = ref(false)
const lastExport = ref(null)
const beneficiaryFilters = ref({ search: '', registrationStatus: '' })
const dateFilters = ref({ dateFrom: '', dateTo: '' })
const beneficiaryQuery = ref('')
const beneficiaryResults = ref([])
const selectedBeneficiary = ref(null)
const searchingBeneficiaries = ref(false)

const selectedReport = computed(() => reports.find((report) => report.id === activeReport.value) || reports[0])

const beneficiaryFullName = (beneficiary) => [beneficiary.name, beneficiary.fatherSurname, beneficiary.motherSurname]
  .filter(Boolean)
  .join(' ')

const parseReportDate = (value) => {
  if (!value) return null
  const mexicanDate = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mexicanDate) return new Date(Number(mexicanDate[3]), Number(mexicanDate[2]) - 1, Number(mexicanDate[1]))
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const filterByDateRange = (rows, dateGetter) => {
  const from = dateFilters.value.dateFrom ? new Date(`${dateFilters.value.dateFrom}T00:00:00`) : null
  const to = dateFilters.value.dateTo ? new Date(`${dateFilters.value.dateTo}T23:59:59`) : null

  return rows.filter((row) => {
    const date = parseReportDate(dateGetter(row))
    if (!date) return !from && !to
    return (!from || date >= from) && (!to || date <= to)
  })
}

const validateDateRange = () => {
  if (dateFilters.value.dateFrom && dateFilters.value.dateTo && dateFilters.value.dateFrom > dateFilters.value.dateTo) {
    toast.warning('La fecha inicial no puede ser posterior a la fecha final')
    return false
  }
  return true
}

const searchBeneficiaries = async () => {
  if (beneficiaryQuery.value.length < 2) {
    toast.info('Escribe al menos 2 caracteres para buscar')
    return
  }

  searchingBeneficiaries.value = true
  try {
    const response = await beneficiaryServices.getBeneficiaries({
      page: 1,
      limit: 8,
      sort: 'createdAt',
      order: 'desc',
      search: beneficiaryQuery.value
    }, authHeader.value)
    beneficiaryResults.value = response.data?.beneficiaries || []
    if (!beneficiaryResults.value.length) toast.info('No se encontraron beneficiarios')
  } catch (error) {
    toast.error(error.response?.data?.message || 'No se pudo realizar la búsqueda')
  } finally {
    searchingBeneficiaries.value = false
  }
}

const selectBeneficiary = (beneficiary) => {
  selectedBeneficiary.value = beneficiary
  beneficiaryQuery.value = beneficiaryFullName(beneficiary)
  beneficiaryResults.value = []
}

const clearSelectedBeneficiary = () => {
  selectedBeneficiary.value = null
  beneficiaryQuery.value = ''
  beneficiaryResults.value = []
}

const exportBeneficiaries = async () => {
  const pageSize = 100
  const maximumRows = 10000
  const params = {
    limit: pageSize,
    sort: 'createdAt',
    order: 'desc',
    ...beneficiaryFilters.value
  }
  Object.keys(params).forEach((key) => params[key] === '' && delete params[key])

  const rows = []
  let page = 1
  let hasMore = true
  while (hasMore && rows.length < maximumRows) {
    const response = await beneficiaryServices.getBeneficiaries(
      { ...params, page },
      authHeader.value,
    )
    const pageRows = response.data?.beneficiaries || []
    if (!pageRows.length) break

    rows.push(...pageRows.slice(0, maximumRows - rows.length))
    const totalItems = Number(response.data?.totalItems)
    hasMore = Number.isFinite(totalItems)
      ? rows.length < totalItems
      : pageRows.length === pageSize
    if (pageRows.length < pageSize) hasMore = false
    page += 1
  }

  if (!rows.length) return 0
  exportBeneficiariesReport(rows)
  return rows.length
}

const exportContributions = async () => {
  if (!validateDateRange()) return null
  const response = await contributionServices.getAllContributions(authHeader.value)
  const rows = filterByDateRange(response.data || [], (row) => row['fecha de apoyo'])
  if (!rows.length) return 0
  exportContributionsReport(rows)
  return rows.length
}

const exportBeneficiaryHistory = async () => {
  if (!selectedBeneficiary.value || !validateDateRange()) return null
  const response = await contributionServices.getContributionsByBeneficiaryForExport(selectedBeneficiary.value._id, authHeader.value)
  const rows = filterByDateRange(response.data || [], (row) => row.contributionDate)
  if (!rows.length) return 0
  exportBeneficiaryContributionsReport(rows, selectedBeneficiary.value)
  return rows.length
}

const generateReport = async () => {
  if (isGenerating.value) return
  isGenerating.value = true

  try {
    const exporters = {
      beneficiaries: exportBeneficiaries,
      contributions: exportContributions,
      'beneficiary-history': exportBeneficiaryHistory
    }
    const rows = await exporters[activeReport.value]()
    if (rows === null) return
    if (!rows) {
      toast.warning('No hay datos para exportar con los filtros seleccionados')
      return
    }

    lastExport.value = { label: selectedReport.value.label, rows }
    toast.success(`${rows} registro(s) exportado(s)`)
  } catch (error) {
    toast.error(error.response?.data?.message || 'No se pudo generar el reporte')
  } finally {
    isGenerating.value = false
  }
}
</script>
