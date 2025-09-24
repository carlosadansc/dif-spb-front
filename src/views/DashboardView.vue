<template>
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center">
      <DateSelector v-model="dateFilter" />
        <button @click.prevent="exportToExcel" class="btn btn-sm bg-red-500 text-xs text-white">Descargar padrón de apoyos<IconFileDownload v-if="!loadingExport"/><span v-if="loadingExport" class="loading loading-spinner loading-sm"></span></button>
    </div>

    <div class="mb-8">
      <ContributionStats :loadingContributions="loadingSummary" :beneficiariesCount="beneficiariesCount" :contributionsCount="contributionsCount" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <SummaryChart :data="contibutionsSummaryData" :isLoading="loadingSummary" />
      <SummaryByCategoryChart @update:category="selectCategoryFilter" :isLoading="loadingSummaryByCategory" :data="contributionSummaryByCategoryData" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <BeneficiariesByDelegationChart :data="beneficiariesByDelegationData" :isLoading="loadingBeneficiariesByDelegation" />
      <BeneficiariesBySexChart :data="beneficiariesBySexData" :isLoading="loadingBeneficiariesBySex" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { IconFileDownload } from '@tabler/icons-vue';
import DateSelector from '@/components/dashboard/DateSelector.vue';
import SummaryByCategoryChart from '@/components/dashboard/SummaryByCategoryChart.vue';
import ContributionStats from '@/components/dashboard/ContributionStats.vue';
import SummaryChart from '@/components/dashboard/SummaryChart.vue';
import BeneficiariesByDelegationChart from '@/components/dashboard/BeneficiariesByDelegationChart.vue';
import BeneficiariesBySexChart from '@/components/dashboard/BeneficiariesBySexChart.vue';
import contributionServices from '@/services/contributionServices';
import beneficiaryServices from '@/services/beneficiaryServices';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import { omitUndefined } from '@/utils/omitUndefined';
import * as XLSX from 'xlsx';

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
const loadingContributions = ref(false)
const loadingExport = ref(false)

const contibutionsSummaryData = ref([])
const contributionSummaryByCategoryData = ref([])
const beneficiariesByDelegationData = ref({})
const beneficiariesBySexData = ref({})
const beneficiariesCount = ref(0)
const contributionsData = ref([])

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

const getAllContributions = async () => {
  try {
    loadingExport.value = true
    const response = await contributionServices.getAllContributions(authHeader.value);
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
    loadingExport.value = false 
  }
  }

  // Export to Excel
// Export to Excel
const json_fields = {
  "folio": "folio",
  "CURP": "curp",
  "Nombre": "nombre",
  "Apellido paterno": "apellido paterno",
  "Apellido materno": "apellido materno",
  "Fecha de nacimiento": "fecha de nacimiento",
  "Sexo": "sexo",
  "Edad": "edad",
  "Calle": "calle",
  "Número": "numero",
  "Colonia": "colonia",
  "Delegación": "delegacion",
  "Subdelegación": "subdilegacion",
  "Código postal": "codigo postal",
  "Fecha de apoyo": "fecha de apoyo",
  "Quien recibió": "quien recibio",
  "Quien entregó": "quien entrego",
  "Tipo de apoyo": "tipo de apoyo",
  "Apoyo otorgado": "apoyo otorgado",
  "Cantidad": "cantidad"
};

const exportToExcel = async () => {
  loadingExport.value = true;
  
  try {
    await getAllContributions();
    
    const dataExcel = contributionsData.value.map(contribution => {
      const row = {};
      for (const [key, value] of Object.entries(json_fields)) {
        try {
          // Los campos no están anidados, así que accedemos directamente
          const cellValue = contribution[value];
          
          // Formatear fechas si es necesario
          if ((key === 'Fecha de nacimiento' || key === 'Fecha de apoyo') && cellValue) {
            // Suponiendo que las fechas ya vienen formateadas como DD/MM/YYYY
            row[key] = cellValue;
          } else {
            row[key] = cellValue ?? '';
          }
        } catch (error) {
          console.warn(`Error procesando campo ${key}:`, error);
          row[key] = '';
        }
      }
      return row;
    });

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    
    // Ajustar anchos de algunas columnas
    worksheet['!cols'] = [
      { wch: 15 }, // Folio
      { wch: 18 }, // CURP
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellido paterno
      { wch: 15 }, // Apellido materno
      { wch: 15 }, // Fecha de nacimiento
      { wch: 10 }, // Sexo
      { wch: 8 },  // Edad
      { wch: 15 }, // Calle
      { wch: 10 }, // Número
      { wch: 15 }, // Colonia
      { wch: 15 }, // Delegación
      { wch: 15 }, // Subdelegación
      { wch: 10 }, // Código postal
      { wch: 15 }, // Fecha de apoyo
      { wch: 15 }, // Quien recibió
      { wch: 15 }, // Quien entregó
      { wch: 15 }, // Tipo de apoyo
      { wch: 25 }, // Apoyo otorgado
      { wch: 10 }  // Cantidad
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Apoyos');
    XLSX.writeFile(workbook, 'registro-apoyos-otorgados-smdif-la-paz.xlsx');
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    // Aquí podrías mostrar una notificación de error al usuario
  } finally {
    loadingExport.value = false;
  }
};

const selectCategoryFilter = (category) => {
  categoryFilter.value = category
  if (category._id === 1) {
    getContributionSummaryByCategory()
    return
  }
  getContributionSummaryByCategory(category._id)
}

onMounted(() => {
  getContributionSummaryByCategory()
  getContributionSummary()
  getBeneficiariesTotal()
  getBeneficiariesByDelegation()
  getBeneficiariesBySex()
})

</script>