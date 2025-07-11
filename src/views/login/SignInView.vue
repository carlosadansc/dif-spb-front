<template>
  <div class="relative flex flex-col justify-center h-screen overflow-hidden">
    <div class="w-full p-6 m-auto bg-white lg:max-w-lg">
      <div class="flex flex-col items-center justify-center mb-[5rem]">
        <img src="@/assets/img/logo-dif.png" class="h-[105px] w-auto mb-1" />
        <span class="font-bold text-center text-red-800">Sistema de Padrón de <br> Beneficiarios</span>
      </div>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input v-model="credentials.username" type="text" placeholder="Usuario"
            class="w-full input input-bordered text-input" />
        </div>
        <div>
          <input type="password" v-model="credentials.password" placeholder="Contraseña"
            class="w-full input input-bordered" />
        </div>
        <!-- <a href="#" class="text-xs text-gray-600 hover:underline hover:text-blue-600">Perdí mi contraseña</a> -->
        <div>
          <button type="submit" class="btn w-full text-white bg-red-800 rounded-[.8rem]">
            {{ loading ? '' : 'Iniciar sesión' }}
            <span v-if="loading" class="loading loading-spinner"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { toast } from 'vue3-toastify'
import { AxiosError } from 'axios'
import { storeToRefs } from 'pinia'
import router from '../../router'
import userServices from '../../services/userServices'
import { useAuthStore } from "../../stores/authStore"
import { getTranslatedError } from '../../utils/errorManager'

const authStore = useAuthStore()
const { user, authToken } = storeToRefs(authStore)

//data
const credentials = ref({ username: "", password: "" })
const loading = ref(false);


//methods
const login = async () => {
  loading.value = true;
  try {
    const data = await userServices.login(credentials.value);
    if (data && data.token && data.user) {
      authStore.setAuthToken(data.token);
      authStore.setUser(data.user);
      router.push('/');
    } else {
      // Si 'data' no tiene la estructura esperada, lanzamos un error.
      throw new Error('Respuesta de inicio de sesión inválida');
    }
  } catch (err) {
    const errorMessage = getTranslatedError(err);
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};


</script>

<style scoped lang="scss"></style>