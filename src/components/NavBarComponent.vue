<template>
  <header class="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
    <div class="mx-auto grid min-h-[4.5rem] w-full max-w-screen-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-3 sm:px-5 2xl:grid-cols-[auto_minmax(0,1fr)_auto] 2xl:gap-8 2xl:px-8">
      <div class="flex min-w-0 items-center">
        <div class="drawer 2xl:hidden">
          <input id="main-navigation-drawer" v-model="drawerOpen" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
            <label
              for="main-navigation-drawer"
              role="button"
              aria-label="Abrir navegación"
              class="btn btn-ghost btn-square min-h-11 min-w-11 text-gray-700 hover:bg-gray-100 hover:text-red-900"
            >
              <IconMenu2 class="h-6 w-6" aria-hidden="true" />
            </label>
          </div>

          <div class="drawer-side z-50">
            <label for="main-navigation-drawer" aria-label="Cerrar navegación" class="drawer-overlay"></label>
            <aside class="flex min-h-full w-[min(20rem,calc(100vw-2rem))] flex-col bg-white p-4 text-gray-900 shadow-xl">
              <div class="mb-4 flex items-center gap-3 border-b border-gray-200 px-1 pb-4">
                <img src="../assets/img/logo-dif.png" class="h-11 w-auto" alt="DIF La Paz" width="113" height="40" />
                <div class="min-w-0 border-l border-gray-200 pl-3">
                  <p class="text-sm font-bold text-red-900">SPB</p>
                  <p class="truncate text-xs text-gray-600">Padrón de beneficiarios</p>
                </div>
              </div>

              <nav aria-label="Navegación principal">
                <ul class="menu w-full gap-1 p-0">
                  <li v-for="item in navigationItems" :key="item.to">
                    <router-link
                      :to="item.to"
                      active-class="bg-red-50 text-red-950 font-semibold"
                      class="min-h-11 gap-3 rounded-lg text-gray-700"
                      @click="drawerOpen = false"
                    >
                      <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
                      {{ item.label }}
                    </router-link>
                  </li>
                </ul>
              </nav>

              <p class="mt-auto border-t border-gray-200 px-1 pt-4 text-xs leading-5 text-gray-500">
                Sistema para el Desarrollo Integral de la Familia del Municipio de La Paz
              </p>
            </aside>
          </div>
        </div>

        <router-link to="/dashboard" class="hidden min-w-[15rem] items-center gap-3 2xl:flex" aria-label="Ir al inicio">
          <img src="../assets/img/logo-dif.png" class="h-11 w-auto" alt="DIF La Paz" width="113" height="40" />
          <span class="border-l border-gray-200 pl-3 leading-tight">
            <span class="block text-sm font-bold text-red-900">SPB</span>
            <span class="block text-xs text-gray-600">Padrón de beneficiarios</span>
          </span>
        </router-link>
      </div>

      <router-link to="/dashboard" class="2xl:hidden" aria-label="Ir al inicio">
        <img src="../assets/img/logo-dif.png" class="h-9 w-auto sm:h-10" alt="DIF La Paz" width="113" height="40" />
      </router-link>

      <nav class="hidden min-w-0 items-center justify-center gap-1 2xl:flex" aria-label="Navegación principal">
        <router-link
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          active-class="bg-red-50 text-red-950"
          class="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-950"
        >
          <component :is="item.icon" class="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          {{ item.label }}
        </router-link>
      </nav>

      <div class="flex min-w-0 justify-end">
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            aria-label="Abrir menú de usuario"
            class="flex min-h-11 max-w-[18rem] items-center gap-2 rounded-xl px-1.5 py-1.5 text-left transition-colors duration-200 hover:bg-gray-100 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-800 sm:px-2"
          >
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-900">
              <IconUser class="h-5 w-5" aria-hidden="true" />
            </span>
            <span class="hidden min-w-0 flex-1 sm:block">
              <span class="block truncate text-sm font-semibold leading-5 text-gray-900">{{ displayName }}</span>
              <span class="block truncate text-xs leading-4 text-gray-600">{{ capitalize(user?.position) }}</span>
            </span>
            <IconChevronDown class="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
          </div>

          <ul tabindex="0" class="dropdown-content menu z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            <li class="mb-1 border-b border-gray-100 pb-2 sm:hidden">
              <div class="cursor-default flex-col items-start gap-0 px-3 py-2 hover:bg-transparent">
                <span class="max-w-full truncate text-sm font-semibold text-gray-900">{{ displayName }}</span>
                <span class="max-w-full truncate text-xs text-gray-600">{{ capitalize(user?.position) }}</span>
              </div>
            </li>
            <li>
              <button type="button" class="min-h-11 gap-2 text-sm text-red-900 hover:bg-red-50" @click="logOut">
                <IconLogout class="h-5 w-5" aria-hidden="true" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  IconCategory2,
  IconChevronDown,
  IconFilters,
  IconLogout,
  IconMenu2,
  IconReportAnalytics,
  IconSitemap,
  IconUser,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import capitalize from '../utils/capitalize'

const router = useRouter()
const { logoutUser, user, isAdmin, isExecutive, isStandardUser } = useAuth()
const drawerOpen = ref(false)

const displayName = computed(() => {
  const fullName = [user.value?.name, user.value?.lastname].filter(Boolean).join(' ')
  return fullName || 'Usuario'
})

const navigationItems = computed(() => [
  { to: '/dashboard', label: 'Dashboard', icon: IconCategory2, visible: isStandardUser.value },
  { to: '/beneficiaries', label: 'Beneficiarios', icon: IconUsers, visible: isStandardUser.value },
  { to: '/reports', label: 'Reportes', icon: IconReportAnalytics, visible: isAdmin.value || isExecutive.value },
  { to: '/categories', label: 'Categorías', icon: IconFilters, visible: isAdmin.value },
  { to: '/users', label: 'Usuarios', icon: IconUserCog, visible: isAdmin.value },
  { to: '/areas', label: 'Áreas', icon: IconSitemap, visible: isAdmin.value },
].filter((item) => item.visible))

const logOut = () => {
  logoutUser()
  router.push('/login')
}
</script>
