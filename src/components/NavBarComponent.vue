<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="drawer z-50">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <!-- Page content here -->
          <label for="my-drawer" class="btn btn-ghost drawer-button text-red-800">
            <IconMenu2 />
          </label>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <!-- Sidebar content here -->
            <li v-if="isStandardUser" class="text-red-800"><a @click="goTo('/dashboard')">
                <IconCategory2 /> Dashboard
              </a></li>
            <li v-if="isStandardUser" class="text-red-800"><a @click="goTo('/beneficiaries')">
                <IconUsers />Beneficiarios
              </a></li>
            <li v-if="isStandardUser" class="text-red-800"><a @click="goTo('/massive-contributions')">
                <IconUsersGroup />Jornadas
              </a></li>
            <li v-if="isAdmin" class="text-red-800"><a @click="goTo('/categories')">
                <IconFilters />Categorias
              </a></li>
            <li v-if="isAdmin" class="text-red-800"><a @click="goTo('/users')">
                <IconUserCog />Usuarios
              </a></li>
            <li v-if="isAdmin" class="text-red-800"><a @click="goTo('/areas')">
                <IconSitemap />Areas
              </a></li>
            <li class="text-red-800 text-[0.7rem] leading-0 font-bold absolute bottom-5">Sistema para el Desarrollo
              Integral de la Familia del Municipio de La Paz - SPB v1.0.0 {{ new Date().getFullYear() }}</li>
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
        <IconUser class="mr-2 h-6 w-6 text-red-800" />
        <div class="flex flex-col items-start justify-center leading-0">
          <p class="text-red-800 text-xs font-medium">{{ user?.name + ' ' + user?.lastname }}
          </p>
          <p class="text-red-800 text-xs font-medium">{{ capitalize(user?.position) }}</p>
        </div>

        <div class="dropdown dropdown-end ms-2 me-5">
          <div tabindex="0" role="button" class="btn btn-ghost btn-square btn-xs m-1">
            <IconChevronDown class="h-5 w-5 text-red-800" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li @click="logOut" class="font-medium text-xs"><a>Cerrar sesión</a></li>
          </ul>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { IconMenu2, IconCategory2, IconUsers, IconUser, IconChevronDown, IconUserCog, IconFilters, IconSitemap, IconUsersGroup } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import capitalize from '../utils/capitalize'

//composables
const router = useRouter()
const { logoutUser, user, isAdmin, isExecutive, isStandardUser } = useAuth()

//methods
const goTo = (path) => {
  router.push(path)
}

const logOut = () => {
  logoutUser()
  router.push('/login')
}

</script>

<style lang="css" scoped></style>