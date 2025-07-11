<template>
  <div class="">
    <!-- <h3 class="text-lg font-semibold text-gray-900 mb-4">Historial de Apoyos</h3> -->
    <div class="overflow-x-auto">
      <div class="flex justify-between items-center mb-[2rem]">
        <!-- <div class="flex items-center gap-3"> -->
        <h6 class="ms-4 font-medium text-sm">Apoyos otorgados: <span v-if="!loading"
            class="font-bold text-xl text-red-800">{{ contributions.length }}</span> </h6>

        <div>
          <button class="btn btn-square bg-gray-800 font-black text-white text-[1.2rem]" @click.prevent="exportToExcel">
            <span v-if="loadingExport" class="loading loading-spinner loading-sm"></span>
            <IconFileSpreadsheet v-else class="w-5 h-5" />
          </button>
          <button class="btn btn-square bg-red-800 font-black text-white text-[1.2rem] ms-2"
            @click.prevent="showModal = true">
            <IconPlus class="w-5 h-5" />
          </button>
        </div>

        <!-- </div> -->
      </div>

      <div class="w-full">

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="loading loading-spinner loading-lg"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="contributions.length === 0" class="bg-white rounded-md shadow p-4 text-center">
          <p class="text-sm text-gray-500">No apoyos otorgados <span
              class="text-red-800 font-bold text-xs underline cursor-pointer hover:text-red-500"
              @click="showModal = true">Otorgar Apoyo</span></p>
        </div>

        <!-- Contributions List -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(contribution, index) in contributions" :key="`contribution-card-${contribution._id}`"
            class="bg-white border border-solid border-gray-100 rounded-lg p-4 flex flex-col">

            <p class="text-xs text-gray-500">Folio: <span class="font-bold text-red-800">{{ contribution.folio }}</span>
            </p>

            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">
                {{ formatDate(contribution.contributionDate) }}
              </span>
              <h5 :disable="contribution.loadingPrint" class="text-xs underline font-medium text-red-800 cursor-pointer"
                @click="generateTicketPDF(index)">Imprimir recibo <span class="loading loading-spinner loading-xs"
                  v-if="contribution.loadingPrint"></span> </h5>
            </div>

            <div class="space-y-1">
              <div v-for="(item, index) in contribution.productOrServices" :key="index"
                class="flex items-center justify-between text-sm">
                <div class="flex-1 min-w-0">
                  <span class="font-medium text-gray-900">{{ item.productOrService.category.name }}</span>
                  <span class="text-gray-500 mx-1 font-black">·</span>
                  <span class="text-gray-500">{{ item.description }}</span>
                </div>
                <div class="text-red-900 font-medium ml-2">
                  {{ item.quantity }}
                </div>
              </div>
            </div>

            <div class="mt-1">
              <p class="text-gray-500 text-sm">
                <span class="font-medium text-gray-900">Recibió: </span>
                {{ contribution.receiver }}
              </p>
            </div>

            <div v-if="contribution.comments" class="mt-1">
              <p class="text-xs text-gray-500 italic">
                {{ contribution.comments }}
              </p>
            </div>
            <ContributionTicketPDF ref="contributionTicketRef" :beneficiary="props.beneficiary"
              :contribution="contribution" />
          </div>
        </div>
      </div>
    </div>

    <NewContributionModal :showModal="showModal" @close:modal="showModal = false" @update:list="emits('update:list')" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue3-toastify';
import * as XLSX from 'xlsx';
import { IconFileSpreadsheet, IconPlus } from '@tabler/icons-vue';
import { useAuth } from '@/composables/useAuth';
import { useDate } from '@/utils/dateTool';
import contributionServices from '@/services/contributionServices';
import NewContributionModal from './NewContributionModal.vue';
import ContributionTicketPDF from './ContributionTicketPDF.vue';

// composables
const { authHeader } = useAuth();
const { formatDate } = useDate();

//props
const props = defineProps({
  beneficiary: Object
});

const emits = defineEmits(['update:list']);

//data
const showModal = ref(false);
const loading = ref(false);
const loadingExport = ref(false);
const contributions = ref([]);
const contributionsForExport = ref([]);
//computed


//methods
const getContributions = async () => {
  loading.value = true
  try {
    const response = await contributionServices.getContributionsByBeneficiary(props.beneficiary._id, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contributions.value = response.data
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

const getContributionsToExport = async () => {
  loadingExport.value = true;
  try {
    const response = await contributionServices.getContributionsByBeneficiaryForExport(props.beneficiary._id, authHeader.value)
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      contributionsForExport.value = response.data
      console.log(contributionsForExport.value)
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

const json_fields = {
  "Folio": "folio",
  "Fecha de apoyo": "contributionDate",
  "Nombre": "beneficiaryName",
  "Otorgado por": "createdBy",
  "Tipo de apoyo": "categoryName",
  "Apoyo otorgado": "description",
  "Cantidad": "quantity",
};

const exportToExcel = async () => {
  loadingExport.value = true;
  
  try {
    await getContributionsToExport();
    
    const dataExcel = contributionsForExport.value.map(contribution => {
      const row = {};
      
      for (const [key, value] of Object.entries(json_fields)) {
        try {
          // Obtener el valor de la propiedad anidada
          const cellValue = value.split('.').reduce((o, i) => o?.[i], contribution);
          
          // Formatear fecha de apoyo
          if (key === 'Fecha de apoyo' && cellValue) {
            const parsedDate = new Date(cellValue);
            if (!isNaN(parsedDate)) {
              // Formatear como DD/MM/YYYY
              row[key] = parsedDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
            } else {
              row[key] = cellValue;
            }
          } 
          // Formatear valores numéricos
          else if (['Cantidad', 'Valor unitario', 'Valor total'].includes(key) && cellValue !== null && cellValue !== undefined) {
            // Asegurar que los valores numéricos se muestren correctamente
            row[key] = Number(cellValue);
          } 
          else {
            row[key] = cellValue !== null && cellValue !== undefined ? cellValue : '';
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

    // Configurar anchos de columna
    const colWidths = {
      "Folio": 10,
      "Fecha de apoyo": 12,
      "Nombre": 25,
      "Otorgado por": 20,
      "Tipo de apoyo": 15,
      "Apoyo otorgado": 30,
      "Cantidad": 10,
    };

    worksheet['!cols'] = Object.keys(json_fields).map(header => ({
      wch: colWidths[header] || 15
    }));

    // Generar nombre de archivo limpio
    let fileName = '';
    
    if (props.beneficiary) {
      const beneficiaryName = (props.beneficiary.name ? props.beneficiary.name.toLowerCase() : '').split(' ').join('-');
      const fatherSurname = (props.beneficiary.fatherSurname ? props.beneficiary.fatherSurname.toLowerCase() : '').split(' ').join('-');
      
      if (beneficiaryName && fatherSurname) {
        fileName = `historial-apoyos-${beneficiaryName}-${fatherSurname}-smdif-la-paz.xlsx`;
      } else {
        fileName = `historial-apoyos-beneficiario-smdif-la-paz.xlsx`;
      }
    } else {
      fileName = `historial-apoyos-smdif-la-paz.xlsx`;
    }

    // Crear el libro y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Apoyos');
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
  } finally {
    loadingExport.value = false;
  }
};

// Eventos de PDF
const contributionTicketRef = ref()
const generateTicketPDF = async (index) => {
  const contribution = contributions.value[index]
  contribution.loadingPrint = true
  await contributionTicketRef.value[index].generateTicketPDF()
  contribution.loadingPrint = false
}

onMounted(() => {
  getContributions()
})

</script>