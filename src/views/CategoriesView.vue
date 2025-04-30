<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-semibold text-gray-900  mb-8">Categorías</h1>


    <div class="sm:flex sm:items-center sm:justify-between">
      <!-- Search -->
      <div class="mb-6">
        <div class="max-w-lg">
          <div class="mt-1 relative rounded-md shadow-sm">
            <input type="text" v-model="searchQuery"
              class="input block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Buscar categorías..." />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconSearch class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div class="tooltip tooltip-left" data-tip="Crear nueva categoría">
        <button @click.prevent="openCreateModal()"
          class="btn btn-square bg-red-800 font-black text-white text-[1.2rem]">+</button>
      </div>
    </div>



    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <div v-for="category in categories" :key="category.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="h-2" :style="{ backgroundColor: category.color }"></div>
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
            <div class="flex space-x-2">
              <button @click="editCategory(category)" class="text-indigo-600 hover:text-indigo-900">
                <IconEdit class="h-5 w-5" />
              </button>
              <button @click="deleteCategory(category._id)" class="text-red-600 hover:text-red-900">
                <IconTrash class="h-5 w-5" />
              </button>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-600">{{ category.description }}</p>

          <!-- Product or Service Items -->
          <div class="mt-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 mb-2">Apoyos</span>
              <button @click.prevent="selectCategory(category)" class="text-red-800 hover:text-red-200">
                <IconPlus class="h-5 w-5" />
              </button>
            </div>

            <div class="space-y-2">
              <div v-for="item in category.productOrServices" :key="item._id" class="text-sm bg-gray-50 p-2 rounded">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Category Modal -->
    <NewCategoryModal :is-open="isOpen" @refresh="getCategories" @close="isOpen = false" />

    <!-- Create Product Modal -->
    <NewProductModal :is-open="isProductModalOpen" :category="selectedCategory" @refresh="getCategories"
      @close="isProductModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash
} from '@tabler/icons-vue'
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/composables/useAuth';
import categoryServices from '@/services/categoriesServices';
import NewCategoryModal from '@/components/CategoriesView/NewCategoryModal.vue';
import NewProductModal from '@/components/CategoriesView/NewProductModal.vue';

const { authHeader } = useAuth();
const categories = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const isOpen = ref(false);
const isProductModalOpen = ref(false);

const selectedCategory = ref('');

const selectCategory = (category) => {
  selectedCategory.value = category._id;
  isProductModalOpen.value = true;
}

const getCategories = async () => {
  loading.value = true
  try {
    const response = await categoryServices.getCategories(authHeader.value);
    if (response.code === "ERR_NETWORK") {
      toast.error('No se pudo conectar con el servidor')
    } else {
      categories.value = response.data
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
};

const deleteCategory = async (categoryId) => {
  if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

  try {
    // await categoryServices.deleteCategory(categoryId, authHeader.value);
    toast.success('Categoría eliminada exitosamente');
    getCategories();
  } catch (error) {
    toast.error('Error al eliminar categoría');
    console.error(error);
  }
};

const editCategory = (category) => {
  // Implement edit functionality
  console.log('Edit category:', category);
};

const openCreateModal = () => {
  isOpen.value = true;
};

onMounted(() => {
  getCategories();
});
</script>