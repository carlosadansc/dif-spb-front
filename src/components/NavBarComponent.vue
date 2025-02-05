<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="drawer z-50">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <!-- Page content here -->
          <label for="my-drawer" class="btn btn-ghost drawer-button text-red-800">
            <IconMenu2/>
          </label>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">

            <!-- Sidebar content here -->
            <li class="text-red-800"><a @click="goTo('/dashboard')"><IconCategory2 /> Dashboard</a></li>
            <li class="text-red-800"><a  @click="goTo('/beneficiaries')"><IconUsers />Beneficiarios</a></li>
            <li class="w-[90%] text-red-800 absolute bottom-5"><a  @click="logOut"><IconLogout />Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="navbar-center mt-2">
      <div class="flex flex-col items-center justify-center">
        <img src="../assets/img/logo-dif.png" class="h-[40px] w-auto mb-1" />
        <span class="text-xs font-bold text-red-800">Sistema de Padrón de Beneficiarios</span>
      </div>
    </div>
    <div class="navbar-end mr-2">
      <div class="flex items-center justify-center">
        <IconUser class="mr-2 h-8 w-8" />
        <div class="flex flex-col items-start justify-center leading-0">
          <p class="text-red-800 text-xs font-medium">{{ capitalize(user?.name) + ' ' + capitalize(user?.lastname) }}</p>
          <p class="text-red-800 text-xs font-medium">{{ capitalize(user?.position) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconMenu2, IconCategory2, IconUsers, IconLogout, IconUser } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import capitalize from '../utilities/capitalize'

//composables
const router = useRouter()
const { logoutUser, user } = useAuth()

//methods
const goTo = (path) => {
  router.push(path)
}

const logOut = () => {
  logoutUser()
  router.push('/')
}

</script>

<style lang="css" scoped></style>