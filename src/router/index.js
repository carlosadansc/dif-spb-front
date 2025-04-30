// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

//Components
import HomeView from "../views/HomeView.vue"
import LoginView from "../views/login/SignInView.vue"
import DashboardView from '../views/DashboardView.vue'
import BeneficiariesView from '../views/BeneficiariesView.vue'
import BeneficiaryView from '../views/BeneficiaryView.vue'
import UsersView from '../views/UsersView.vue'
import CategoriesView from '../views/CategoriesView.vue'

//Routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: '/beneficiaries',
        name: 'Beneficiaries',
        component: BeneficiariesView,
      },
      {
        path: '/beneficiaries/:id',
        name: 'Beneficiary',
        component: BeneficiaryView
      },
      {
        path: '/users',
        name: 'Users',
        component: UsersView,
        meta: {
          requiresAdmin: true
        }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: CategoriesView,
        meta: {
          requiresAdmin: true
        }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn, user } = useAuth()
  
  // Check if user is logged in and trying to access login or home page
  if ((to.name === 'Login' || to.name === 'Home') && isLoggedIn()) {
    return next({ path: '/dashboard' })
  }
  // Check if route requires authentication but user is not logged in
  else if (to.meta.requiresAuth && !isLoggedIn()) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  // Check if route requires admin privileges but user is not an admin
  else if (to.meta.requiresAdmin && user.value?.userType !== 'admin') {
    return next({
      path: '/dashboard',
      query: { error: 'No tienes permiso para acceder a esta ruta' }
    })
  }
  // Allow navigation
  else {
    return next()
  }
})


export default router
