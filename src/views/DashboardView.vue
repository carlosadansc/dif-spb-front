<template>
    <div class="container mx-auto px-4">
        <h1 class="text-2xl font-semibold text-gray-900 mb-8">Total de apoyos: <span class="font-bold">{{ contributionTotal }}</span></h1>

        <DateSelector v-model="dateFilter" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CategoryDistributionChart :data="contributionsData" />
            <ContributionChart @update:category="selectCategoryFilter" :data="contributionItemsData" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed} from 'vue';
import DateSelector from '../components/dashboard/DateSelector.vue';
import ContributionChart from '../components/dashboard/ContributionChart.vue';
import ContributionStats from '../components/dashboard/ContributionStats.vue';
import CategoryDistributionChart from '../components/dashboard/CategoryDistributionChart.vue';
import contributionServices from '@/services/contributionServices';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';

// composables
const { authHeader } = useAuth()

// data
const dateFilter = ref({
    year: null,
    month: null
});

const categoryFilter = ref(null)

const loading = ref(false)

const contributionsData = ref([])
const contributionItemsData = ref([])

//computed
const contributionTotal = computed(() =>{
  return contributionsData.value.reduce((acc, item) => acc + item.totalQuantity, 0)
});

//watch
watch(dateFilter, () => {
  getSummaryByCategory()
  getContributionItemSummary()
})

//methods
const getSummaryByCategory = async () => {
    try {
    loading.value = true
    const response = await contributionServices.getSummaryByCategory({ year: dateFilter.value.year, month: dateFilter.value.month },  authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
        contributionsData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loading.value = false
  }
}

const getContributionItemSummary = async (category = '') => {
    try {
    loading.value = true
    const response = await contributionServices.getContributionItemSummary({ category, year: dateFilter.value.year, month: dateFilter.value.month },  authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contributionItemsData.value = response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message)
    } else {
      toast.error(err)
    }
  } finally {
    loading.value = false
  }
}

const selectCategoryFilter = (category) => {
    categoryFilter.value = category
    if(category._id === 1) {
        getContributionItemSummary()
        return
    }
    getContributionItemSummary(category._id)
}


getContributionItemSummary()
getSummaryByCategory()
</script>