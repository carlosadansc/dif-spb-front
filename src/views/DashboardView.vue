<template>
  <div class="app-page">
    <AppPageHeader title="Resumen de apoyos" description="Consulta la actividad reciente y accede a las tareas más frecuentes.">
      <template #icon><IconChartBar class="h-6 w-6" /></template>
      <div class="flex flex-wrap gap-2" aria-label="Acciones rápidas">
        <router-link to="/beneficiaries" class="btn min-h-11 btn-outline border-red-200 text-red-900 hover:bg-red-50">
          <IconUsers class="h-5 w-5" aria-hidden="true" /> Beneficiarios
        </router-link>
        <button @click="showQuickContributionModal = true" class="btn min-h-11 bg-red-800 text-white hover:bg-red-900">
          <IconPlus class="h-5 w-5" aria-hidden="true" /> Otorgar apoyo
        </button>
      </div>
    </AppPageHeader>

    <div class="toolbar-panel flex items-center justify-between">
      <DateSelector v-model="dateFilter" />
    </div>

    <div class="mb-8">
      <ContributionStats :loadingContributions="loadingSummary" :beneficiariesCount="beneficiariesCount"
        :contributionsCount="contributionsCount" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <SummaryChart :data="contibutionsSummaryData" :isLoading="loadingSummary" />
      <SummaryByCategoryChart @update:category="selectCategoryFilter" :isLoading="loadingSummaryByCategory"
        :data="contributionSummaryByCategoryData" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <BeneficiariesByDelegationChart :data="beneficiariesByDelegationData"
        :isLoading="loadingBeneficiariesByDelegation" />
      <BeneficiariesBySexChart :data="beneficiariesBySexData" :isLoading="loadingBeneficiariesBySex" />
    </div>
  </div>

  <!-- Quick Contribution Modal -->
  <QuickContributionModal :show="showQuickContributionModal" @close="showQuickContributionModal = false"
    @beneficiary-found="handleBeneficiaryFound" @beneficiary-not-found="handleBeneficiaryNotFound" />

  <!-- New Beneficiary Modal -->
  <NewBeneficiaryModal :showModal="showNewBeneficiaryModal" :defaultCurp="defaultCurp"
    @close:modal="showNewBeneficiaryModal = false" @refresh:beneficiaries="handleBeneficiaryCreated" />


</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { IconChartBar, IconUsers, IconPlus } from '@tabler/icons-vue';
import AppPageHeader from '@/components/ui/AppPageHeader.vue';
import DateSelector from '@/components/DashboardView/DateSelector.vue';
import SummaryByCategoryChart from '@/components/DashboardView/SummaryByCategoryChart.vue';
import ContributionStats from '@/components/DashboardView/ContributionStats.vue';
import SummaryChart from '@/components/DashboardView/SummaryChart.vue';
import BeneficiariesByDelegationChart from '@/components/DashboardView/BeneficiariesByDelegationChart.vue';
import BeneficiariesBySexChart from '@/components/DashboardView/BeneficiariesBySexChart.vue';

import QuickContributionModal from '@/components/DashboardView/QuickContributionModal.vue';
import NewBeneficiaryModal from '@/components/BeneficiariesView/NewBeneficiaryModal.vue';
import contributionServices from '@/services/contributionServices';
import beneficiaryServices from '@/services/beneficiaryServices';
import router from '@/router';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import { omitUndefined } from '@/utils/omitUndefined';

// composables
const { authHeader } = useAuth()

// data
const dateFilter = ref({
  year: null,
  month: null
});

const categoryFilter = ref(null)

const loading = ref(false)
const loadingSummary = ref(false)
const loadingSummaryByCategory = ref(false)
const loadingBeneficiariesByDelegation = ref(false)
const loadingBeneficiariesBySex = ref(false)
const loadingBeneficiariesCount = ref(false)
const showQuickContributionModal = ref(false)
const showNewBeneficiaryModal = ref(false)
const defaultCurp = ref('')

const contibutionsSummaryData = ref([])
const contributionSummaryByCategoryData = ref([])
const beneficiariesByDelegationData = ref({})
const beneficiariesBySexData = ref({})
const beneficiariesCount = ref(0)

//computed
const contributionsCount = computed(() => {
  if (contibutionsSummaryData.value.length === 0) return 0
  return contibutionsSummaryData.value.reduce((acc, item) => acc + item.total, 0)
});

//watch
watch(dateFilter, () => {
  getContributionSummary()
  getContributionSummaryByCategory()
  getBeneficiariesTotal()
})

//methods
const getContributionSummary = async () => {
  try {
    loadingSummary.value = true
    const filter = omitUndefined({ year: dateFilter.value.year, month: dateFilter.value.month })
    const response = await contributionServices.getContributionSummary(filter, authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contibutionsSummaryData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loadingSummary.value = false
  }
}

const getContributionSummaryByCategory = async (category = '') => {
  try {
    loadingSummaryByCategory.value = true
    await new Promise(resolve => setTimeout(resolve, 3000));
    const filter = omitUndefined({ year: dateFilter.value.year, month: dateFilter.value.month })
    const response = await contributionServices.getContributionSummaryByCategory({ categoryId: category, ...filter }, authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contributionSummaryByCategoryData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loadingSummaryByCategory.value = false
  }
}

const getBeneficiariesTotal = async () => {
  try {
    loadingBeneficiariesCount.value = true
    const filter = omitUndefined({ year: dateFilter.value.year, month: dateFilter.value.month })
    const response = await beneficiaryServices.getBeneficiariesCount(filter, authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiariesCount.value = response.data.count
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loadingBeneficiariesCount.value = false
  }
}

const getBeneficiariesByDelegation = async () => {
  try {
    loadingBeneficiariesByDelegation.value = true
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await beneficiaryServices.getBeneficiariesByDelegation(authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiariesByDelegationData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loadingBeneficiariesByDelegation.value = false
  }
}

const getBeneficiariesBySex = async () => {
  try {
    loadingBeneficiariesBySex.value = true
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await beneficiaryServices.getBeneficiariesBySex(authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      beneficiariesBySexData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loadingBeneficiariesBySex.value = false
  }
}

const selectCategoryFilter = (category) => {
  categoryFilter.value = category
  if (category._id === 1) {
    getContributionSummaryByCategory()
    return
  }
  getContributionSummaryByCategory(category._id)
}

// Handlers para Quick Contribution
const handleBeneficiaryFound = (beneficiary) => {
  // Redirigir a la vista del beneficiario en la pestaña de contribuciones
  router.push(`/beneficiaries/${beneficiary._id}`);
}

const handleBeneficiaryNotFound = (curp) => {
  // Abrir modal de nuevo beneficiario con el CURP prellenado
  defaultCurp.value = curp;
  showNewBeneficiaryModal.value = true;
}

const handleBeneficiaryCreated = () => {
  // Cerrar modal y refrescar datos si es necesario
  showNewBeneficiaryModal.value = false;
  defaultCurp.value = '';
  // Opcional: refrescar estadísticas
  getBeneficiariesTotal();
}

onMounted(() => {
  getContributionSummaryByCategory()
  getContributionSummary()
  getBeneficiariesTotal()
  getBeneficiariesByDelegation()
  getBeneficiariesBySex()
})

</script>
