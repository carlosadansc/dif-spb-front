<template>
  <div class="relative flex flex-col justify-center h-screen overflow-hidden">
    <div class="w-full p-6 m-auto bg-white lg:max-w-lg">
      <h1 class="text-3xl font-bold text-center text-blue-700 mb-10">SIPA DIF</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input v-model="credentials.username" type="text" placeholder="Usuario"
            class="w-full input input-bordered text-input" />
        </div>
        <div>
          <input type="password" v-model="credentials.password" placeholder="Contraseña"
            class="w-full input input-bordered" />
        </div>
        <a href="#" class="text-xs text-gray-600 hover:underline hover:text-blue-600">Perdí mi contraseña</a>
        <div>
          <button type="submit" class="btn w-full text-white bg-blue-700 rounded-[.8rem]">
            {{ loading ? '' : 'Iniciar sesión' }}
            <span v-if="loading" class="loading loading-spinner"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { storeToRefs } from 'pinia'
import router from '../../router'
import userServices from '../../services/userServices'
import { useAuthStore } from "../../stores/authStore"

const authStore = useAuthStore()
const { user, authToken } = storeToRefs(authStore)

//data
const credentials = ref({ username: "", password: "" })
const loading = ref(false);

//rules
const usernameRules = [value => {
  if (value?.length >= 3) return true
  return 'First name must be at least 3 characters.'
},]


//methods
const login = async () => {
  loading.value = true
  await userServices.login(credentials.value).then((response) => {
    authStore.setAuthToken(response.data.token)
    authStore.setUser(response.data.user)
    loading.value = false
    router.push('/')
  }).catch(err => {
    console.log(err)
    loading.value = false
  })

}


</script>

<style scoped lang="scss"></style>